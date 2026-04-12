// lib/engine.ts
import { BusinessProfile, ProjectedYear, LoanLimits } from '../types/cma';

export type { ProjectedYear };
export interface ProjectionOptions {
  seed?: number;
  variability?: number;
}

const EXP_LABELS = [
  { k: 'salary', l: 'Salaries & Wages', fixed: 1.0 }, 
  { k: 'rent', l: 'Rent & Rates', fixed: 1.0 },
  { k: 'power', l: 'Power & Fuel', fixed: 0.3 }, 
  { k: 'freight', l: 'Freight / Carriage', fixed: 0.0 }, 
  { k: 'travel', l: 'Travelling & Conveyance', fixed: 0.5 },
  { k: 'telephone', l: 'Telephone / Internet', fixed: 0.8 },
  { k: 'sadar', l: 'Sadar / Local Expenses', fixed: 0.7 }, 
  { k: 'office', l: 'Office / Shop Expenses', fixed: 0.9 },
  { k: 'welfare', l: 'Staff Welfare', fixed: 1.0 }, 
  { k: 'misc', l: 'Miscellaneous Expenses', fixed: 0.5 }
];

const EBITDA_MARGIN_BANDS = {
  trading: { min: 0.11, max: 0.135 },
  service: { min: 0.14, max: 0.16 },
  manufacturing: { min: 0.12, max: 0.155 },
  construction: { min: 0.135, max: 0.165 },
} as const;

const NP_MARGIN_BANDS = {
  trading: { min: 0.07, max: 0.126 },
  service: { min: 0.095, max: 0.155 },
  manufacturing: { min: 0.07, max: 0.128 },
  construction: { min: 0.084, max: 0.145 },
} as const;

// Segment-specific capacity utilization starting points and growth
const CAP_UTIL_BANDS = {
  trading:       { start: 0.76, growth: 0.055 },
  service:       { start: 0.62, growth: 0.075 },
  manufacturing: { start: 0.58, growth: 0.070 },
  construction:  { start: 0.53, growth: 0.085 },
} as const;

// Segment-specific minimum creditor days — trading businesses always get supplier credit
const MIN_CREDITOR_DAYS: Record<string, number> = {
  trading: 30, service: 18, manufacturing: 28, construction: 25,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRunSeed(seed?: number) {
  if (seed !== undefined) {
    return seed >>> 0;
  }
  return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
}

function centeredRandom(rng: () => number, amplitude: number) {
  return (rng() * 2 - 1) * amplitude;
}

function organic(val: number, rng: () => number): number {
  const v = Math.floor(val);
  if (v <= 1000) return v;
  // If the number is unnaturally round (ends in 00), playfully bump it
  if (v % 100 === 0) {
    const bump = Math.floor(rng() * 89) + 11;
    return v + (rng() > 0.5 ? bump : -bump);
  }
  return v;
}

function addNoise(baseValue: number, rng: () => number, variancePercent: number = 0.02): number {
  const min = 1 - variancePercent;
  const max = 1 + variancePercent;
  const noiseFactor = rng() * (max - min) + min;
  return organic(Math.floor(baseValue * noiseFactor), rng);
}

export function getDscrTargetBand(year: number, targetBias: number = 0) {
  const baseTarget = 1.65 + ((year - 1) * 0.05);
  const target = clamp(baseTarget + targetBias, 1.55, 1.95);
  return {
    floor: 1.5,
    target,
    ceiling: target + 0.3,
  };
}

function resolveSegmentKey(label: string) {
  const normalized = label.trim().toLowerCase();
  if (normalized in EBITDA_MARGIN_BANDS) {
    return normalized as keyof typeof EBITDA_MARGIN_BANDS;
  }
  if (normalized.startsWith('service')) {
    return 'service';
  }
  if (normalized.startsWith('manufact')) {
    return 'manufacturing';
  }
  if (normalized.startsWith('construct')) {
    return 'construction';
  }
  if (normalized.startsWith('trad')) {
    return 'trading';
  }
  return 'trading';
}

function getTargetEbitdaMargin(label: string, year: number) {
  const band = EBITDA_MARGIN_BANDS[resolveSegmentKey(label)];
  const yearlyStep = (band.max - band.min) / 2;
  return Math.min(band.min + ((year - 1) * yearlyStep), band.max);
}

function getComfortNpMargin(label: string, year: number) {
  const band = NP_MARGIN_BANDS[resolveSegmentKey(label)];
  const min = Math.min(band.min + ((year - 1) * 0.003), band.max - 0.01);
  const max = Math.max(band.max - ((3 - Math.min(year, 3)) * 0.003), min + 0.01);
  return { min, max };
}

function buildIndirectExpenses(indExpTotal: number, profile: BusinessProfile, rng: () => number, variability: number) {
  let totalFixedCosts = 0;
  const weights = EXP_LABELS.map((expenseLabel) => {
    const expRatio = profile.exp[expenseLabel.k as keyof typeof profile.exp] as number;
    return {
      ...expenseLabel,
      weight: Math.max(expRatio * (1 + centeredRandom(rng, 0.06 * variability)), 0.005),
    };
  });
  const totalWeight = weights.reduce((acc, expense) => acc + expense.weight, 0);
  let allocated = 0;
  const indirectExpenses = weights.map((expenseLabel, index) => {
    const ratio = expenseLabel.weight / Math.max(totalWeight, 1);
    const value = index === weights.length - 1
      ? Math.max(indExpTotal - allocated, 0)
      : organic(indExpTotal * ratio, rng);
    allocated += value;
    totalFixedCosts += value * expenseLabel.fixed;
    return { label: expenseLabel.l, value };
  });

  // ── Loan-amount-aware adjustments ──────────────────────────────────────────
  // 1. SALARY: if numEmployees is explicitly set, derive salary from headcount.
  //    ₹12,000/month per employee is a conservative MSME floor (2024 India).
  //    0 employees = owner-operated → salary line stays very small (just a token
  //    amount for casual helpers), sourced from the proportional split above.
  if (typeof profile.numEmployees === 'number' && profile.numEmployees > 0) {
    const salaryItem = indirectExpenses.find(e => e.label === 'Salaries & Wages')!;
    const monthlyCTC = 12_000 + Math.floor(rng() * 4_000); // ₹12K–₹16K per person
    const targetSalary = organic(profile.numEmployees * monthlyCTC * 12, rng);
    const delta = targetSalary - salaryItem.value;
    salaryItem.value = targetSalary;
    // Absorb delta from office / welfare (flex items) to keep total ~stable
    // Never drain misc — every real business has petty cash / miscellaneous expenses
    const officeItem = indirectExpenses.find(e => e.label === 'Office / Shop Expenses')!;
    const welfareItem = indirectExpenses.find(e => e.label === 'Staff Welfare')!;
    const flexItems = [officeItem, welfareItem];
    const flexTotal = flexItems.reduce((s, e) => s + e.value, 0) || 1;
    const absorbable = Math.min(delta, flexTotal * 0.6); // never drain more than 60% of flex items
    flexItems.forEach(e => { e.value = Math.max(e.value - Math.round((e.value / flexTotal) * absorbable), 0); });
  }

  // 2. RENT: if own premises, zero out rent and redistribute to other items.
  if (profile.ownPremises === true) {
    const rentItem = indirectExpenses.find(e => e.label === 'Rent & Rates')!;
    const freed = rentItem.value;
    rentItem.value = 0;
    // Spread freed rent into office, power (not misc — misc has its own floor)
    const flexKeys = ['Office / Shop Expenses', 'Power & Fuel'];
    const flexItems = indirectExpenses.filter(e => flexKeys.includes(e.label));
    const flexTotal = flexItems.reduce((s, e) => s + e.value, 0) || 1;
    flexItems.forEach(e => { e.value += Math.round((e.value / flexTotal) * freed); });
  }

  // 3. MISC EXPENSE FLOOR: every real business has petty cash, repairs, bank charges.
  //    A banker will question ₹0 miscellaneous expenses. Enforce a realistic floor.
  const miscItem = indirectExpenses.find(e => e.label === 'Miscellaneous Expenses')!;
  const miscFloor = organic(Math.max(indExpTotal * 0.018, 800), rng); // At least 1.8% of indirect or ₹800
  if (miscItem.value < miscFloor) {
    const shortfall = miscFloor - miscItem.value;
    miscItem.value = miscFloor;
    // Take from the largest expense line to keep total stable
    const largestItem = indirectExpenses
      .filter(e => e.label !== 'Miscellaneous Expenses' && e.label !== 'Rent & Rates')
      .sort((a, b) => b.value - a.value)[0];
    if (largestItem) {
      largestItem.value = Math.max(largestItem.value - shortfall, 0);
    }
  }

  // Recompute totalFixedCosts from the final distribution
  totalFixedCosts = indirectExpenses.reduce((s, exp) => {
    const label = EXP_LABELS.find(l => l.l === exp.label);
    return s + exp.value * (label?.fixed ?? 0.5);
  }, 0);

  return { indirectExpenses, totalFixedCosts };
}

export function assessDebtService(ebitda: number, interest: number, tlRepayment: number, year: number, targetBias: number = 0, rng?: () => number) {
  const baseDebtService = interest + tlRepayment;

  if (ebitda <= 0) {
    return {
      assessedDebtService: Math.max(baseDebtService, 1),
      debtServiceBuffer: 0,
      dscr: 0,
    };
  }

  // For CC-only (no term loan repayment), DSCR = EBITDA/interest (effectively ICR).
  // For WC facilities, a high ICR (5-10×) is a GREEN flag — the business clearly services
  // its interest. Banks don't penalise CC borrowers for strong cash coverage.
  if (tlRepayment <= 0) {
    return {
      assessedDebtService: Math.max(baseDebtService, 1),
      debtServiceBuffer: 0,
      dscr: ebitda / Math.max(baseDebtService, 1),
    };
  }

  // For TL cases: moderate padding only if DSCR exceeds comfortable ceiling
  const { target, ceiling } = getDscrTargetBand(year, targetBias);
  const rawDscr = ebitda / Math.max(baseDebtService, 1);

  if (rawDscr > ceiling) {
    const debtServiceBuffer = Math.max(Math.floor((ebitda / target) - baseDebtService), 0);
    const assessedDebtService = baseDebtService + debtServiceBuffer;
    return {
      assessedDebtService: Math.max(assessedDebtService, 1),
      debtServiceBuffer,
      dscr: ebitda / Math.max(assessedDebtService, 1),
    };
  }

  return {
    assessedDebtService: Math.max(baseDebtService, 1),
    debtServiceBuffer: 0,
    dscr: rawDscr,
  };
}

/**
 * Progressive income tax — Old Regime (Proprietorship/Partnership)
 * Slabs: ₹0-2.5L: Nil | ₹2.5-5L: 5% | ₹5-10L: 20% | >₹10L: 30%
 * Plus 4% Health & Education Cess on computed tax.
 * This matches the slab structure used in bank credit appraisals.
 */
function calculateTax(profit: number): number {
  if (profit <= 0) return 0;
  let tax = 0;
  if (profit > 250000)  tax += Math.min(profit - 250000, 250000) * 0.05;  // 5%
  if (profit > 500000)  tax += Math.min(profit - 500000, 500000) * 0.20;  // 20%
  if (profit > 1000000) tax += (profit - 1000000) * 0.30;                 // 30%
  return Math.floor(tax * 1.04); // 4% H&E Cess
}

function solveProfitBeforeTaxForNetProfit(targetNetProfit: number) {
  if (targetNetProfit <= 0) {
    return 0;
  }

  let low = targetNetProfit;
  let high = Math.max(targetNetProfit * 1.5, 1000);

  while ((high - calculateTax(high)) < targetNetProfit) {
    high *= 1.25;
  }

  for (let i = 0; i < 28; i++) {
    const mid = (low + high) / 2;
    const derivedNetProfit = mid - calculateTax(mid);
    if (derivedNetProfit < targetNetProfit) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.ceil(high);
}

export function generateProjections(limits: LoanLimits, profile: BusinessProfile, projectionYears: number = 3, baseYear: number = 2024, options: ProjectionOptions = {}): ProjectedYear[] {
  const projections: ProjectedYear[] = [];
  const rng = createSeededRandom(createRunSeed(options.seed));
  const variability = clamp(options.variability ?? 1, 0, 1.5);
  const segKey = resolveSegmentKey(profile.label);
  
  // Use a sensible baseline for random scale if CC Limit is 0
  const baselineVol = (limits.ccLimit || limits.existingCc || limits.termLoan || 500000);
  const salesTilt     = 1 + centeredRandom(rng, 0.045 * variability);  // ±4.5% — borrower-level revenue idiosyncrasy
  const purchaseTilt  = 1 + centeredRandom(rng, 0.012 * variability);  // ±1.2% — kept tight to protect GP floor
  const expenseTilt   = 1 + centeredRandom(rng, 0.032 * variability);  // ±3.2% — opex structure varies by borrower
  const capitalTilt   = 1 + centeredRandom(rng, 0.055 * variability);
  const fixedAssetTilt = 1 + centeredRandom(rng, 0.075 * variability);
  const drawingsTilt  = 1 + centeredRandom(rng, 0.09 * variability);
  const dscrBias = centeredRandom(rng, 0.04 * variability);
  
  // ═══════════════════════════════════════════════════════════════
  // HARD RULE: Sales MUST be ≥ 5× CC Limit. NON-NEGOTIABLE.
  // Uses 5.05× floor so Nayak MPBF (20% of turnover) is always
  // slightly above the requested CC limit — not an exact round figure.
  // ═══════════════════════════════════════════════════════════════
  const SALES_FLOOR_MULT = 5.0;
  const salesFloor = Math.ceil(baselineVol * SALES_FLOOR_MULT);
  let sales = Math.max(
    addNoise(baselineVol * profile.salesMult * salesTilt, rng, 0.015 * variability),
    salesFloor
  );
  let purchases = addNoise(sales * profile.purchaseRatio * purchaseTilt, rng, 0.008 * variability);
  
  let capital = addNoise(baselineVol * profile.capitalMult * capitalTilt, rng, 0.012 * variability);
  let grossFA = addNoise(baselineVol * profile.grossFAMult * fixedAssetTilt, rng, 0.015 * variability);
  let accDepn = 0;
  let wdv = grossFA;
  
  // Normalize Year 1 opening stock to prevent artificial profit inflation
  let openStock = addNoise((purchases / 12) * profile.stockMonths, rng, 0.015 * variability); 
  
  // Initialize Bank Debt Split from direct inputs
  let bankBorrowings = limits.isRenewal ? limits.existingCc : 0;
  let openingTermLoan = limits.isRenewal ? limits.existingTl : 0;
  let annualTlRepayment = 0; 
  
  // Inject closed loan history for CC-only borrowers (seasoning)
  if (limits.termLoan === 0 && limits.existingTl === 0 && !limits.isRenewal) {
    openingTermLoan = organic(baselineVol * 0.08, rng);
    annualTlRepayment = openingTermLoan; // fully amortizes in yr 1
  }
  
  // Segment-specific capacity utilization
  const capBand = CAP_UTIL_BANDS[segKey];
  const capStartNoise  = centeredRandom(rng, 0.07 * variability);  // ±7% — starting util visibly different across borrowers
  const capGrowthNoise = centeredRandom(rng, 0.028 * variability); // ±2.8% — growth rate differs too
  let installedCapacity = profile.installedCap || addNoise(
    sales / (capBand.start + capStartNoise),
    rng, 0.01 * variability
  );

  let curDebtorDays = Math.max(15, Math.round(profile.debtorDays * (1 + centeredRandom(rng, 0.04 * variability))));
  const minCredDays = MIN_CREDITOR_DAYS[segKey] || 20;
  let curCreditorDays = Math.max(minCredDays, Math.round(profile.creditorDays * (1 + centeredRandom(rng, 0.04 * variability))));
  let curStockMonths = Math.max(0.5, profile.stockMonths * (1 + centeredRandom(rng, 0.05 * variability)));

  for (let i = 1; i <= projectionYears; i++) {
    const projStartYear = baseYear + i;
    const fyLabel = `FY ${projStartYear.toString().slice(-2)}-${(projStartYear + 1).toString().slice(-2)}`;

    if (i === 1) {
      openingTermLoan += limits.termLoan; // Incorporate newly proposed term loan in Year 1
      annualTlRepayment = organic(openingTermLoan / (limits.tenure || 5), rng); 
    }

    if (i > 1) {
      // ── REALISTIC GROWTH JITTER ──────────────────────────────────────────
      // Real businesses don't grow at perfectly smooth rates. One year might
      // see a slight dip or slower growth due to seasonal variation, a late
      // monsoon, or a delayed government order. Introducing per-year micro-
      // noise with occasional negative bias makes the trajectory credible.
      const yearMood = rng(); // 0-1, where <0.15 = soft year, 0.15-0.85 = normal, >0.85 = strong
      const moodBias = yearMood < 0.15 ? -0.025 : (yearMood > 0.85 ? 0.018 : 0);
      const realizedGrowth = Math.max(
        profile.revGrowth + centeredRandom(rng, 0.032 * variability) + moodBias,
        profile.revGrowth * 0.60
      );
      sales = Math.max(organic(sales * (1 + realizedGrowth), rng), salesFloor);
      
      // Healthy business: direct costs reduce slightly as % of sales (economies of scale).
      // Kept modest (0.8%/yr) to avoid breaching GP margin ceilings in Y3 for mfg/construction.
      const costEfficiency = (i - 1) * 0.008; // 0.8% improvement per projected year
      const noisyPurchaseRatio = profile.purchaseRatio * purchaseTilt * (1 - costEfficiency + centeredRandom(rng, 0.004 * variability)); 
      purchases = organic(sales * noisyPurchaseRatio, rng);
      
      // ── REALISTIC WC CYCLE IMPROVEMENT ─────────────────────────────────
      // Not every year shows improvement — occasionally debtor days plateau
      // or creditor days stall, just like real business negotiations.
      const debtorImprovement = rng() < 0.20 ? 0 : (Math.floor(rng() * 3) + 1); // 20% chance of NO improvement
      curDebtorDays = Math.max(15, curDebtorDays - debtorImprovement);
      
      const creditorImprovement = rng() < 0.25 ? 0 : (Math.floor(rng() * 2) + 1); // 25% chance of stall
      curCreditorDays = Math.min(120, Math.max(minCredDays, curCreditorDays + creditorImprovement));
      
      const stockImprovement = rng() < 0.20 ? 0 : (0.04 + (rng() * 0.03)); // 20% chance of plateau
      curStockMonths = Math.max(0.5, curStockMonths - stockImprovement); 
    }
    
    // --- DYNAMIC CAPEX LOGIC ---
    let currentUtil = (sales / installedCapacity) * 100;
    if (currentUtil > 95) { // Expand just enough to sustain ~90% util without crashing the trend
      const targetCapacity = Math.floor(sales * 1.10); 
      const growthRatio = (targetCapacity - installedCapacity) / installedCapacity;
      const capexAmount = organic(grossFA * growthRatio * (1 + centeredRandom(rng, 0.04 * variability)), rng);
      
      grossFA += capexAmount;
      wdv += capexAmount; 
      installedCapacity = targetCapacity;
      currentUtil = (sales / installedCapacity) * 100; 
    }

    // Segment-specific capacity utilization trajectory  
    const targetCapUtil = clamp(
      (capBand.start + capStartNoise) + (i - 1) * (capBand.growth + capGrowthNoise),
      0.50, 0.95
    ) * 100;
    // Blend actual util with target for organic feel
    // 50/50 blend: actual capacity story is half the driver; target provides gentle direction.
    // Reduces the "every trading borrower shows ~78%→84%→89%" determinism.
    currentUtil = currentUtil * 0.50 + targetCapUtil * 0.50;

    // --- P&L MATH ---
    const otherInc = organic(sales * (0.0005 + rng() * 0.0015), rng); // 0.05% to 0.20%
    const totalRev = sales + otherInc;
    const closeStock = organic((purchases / 12) * curStockMonths, rng);
    
    // Healthy business: better operating leverage (EBITDA / NP Margins increase)
    const opEfficiency = (i - 1) * 0.02; // 2% improvement in exp ratio per year
    const noisyIndExpRatio = profile.indExpRatio * expenseTilt * (1 - opEfficiency + centeredRandom(rng, 0.004 * variability));
    let indExpTotal = organic(sales * noisyIndExpRatio, rng);

    let cogs = (openStock + purchases) - closeStock;
    const targetEbitdaMargin = getTargetEbitdaMargin(profile.label, i);
    const targetEbitda = sales * targetEbitdaMargin;
    const rawEbitda = sales - cogs - indExpTotal;
    if (rawEbitda < (sales * EBITDA_MARGIN_BANDS[resolveSegmentKey(profile.label)].min) || rawEbitda > (sales * EBITDA_MARGIN_BANDS[resolveSegmentKey(profile.label)].max)) {
      indExpTotal = organic(Math.max(sales - cogs - targetEbitda, sales * 0.04), rng);
    }

    let { indirectExpenses, totalFixedCosts } = buildIndirectExpenses(indExpTotal, profile, rng, variability);
    let grossProfit = sales - cogs;
    const depnYr = organic(wdv * profile.depnRate, rng);
    wdv = Math.max(wdv - depnYr, 0);

    // Interest calculated on CC Limit & Term Loan based on dynamic rates
    // Assume full utilization of proposed limits during the projected year
    const effectiveCcForInt = (i === 1 && !limits.isRenewal) ? limits.ccLimit : (bankBorrowings || limits.ccLimit);
    const ccInterest = organic(effectiveCcForInt * (limits.ccIntRate / 100), rng);
    const tlInterest = organic(openingTermLoan * (limits.tlIntRate / 100), rng);
    const interest = ccInterest + tlInterest;
    let profitBeforeInt = grossProfit - indExpTotal - depnYr;
    let profitBeforeTax = profitBeforeInt - interest;
    let tax = calculateTax(profitBeforeTax);
    let netProfit = profitBeforeTax - tax; 
    let ebitda = netProfit + tax + depnYr + interest;

    const npComfortBand = getComfortNpMargin(profile.label, i);
    const npMargin = netProfit / Math.max(sales, 1);
    if (npMargin < npComfortBand.min || npMargin > npComfortBand.max) {
      const targetNpMargin = npMargin < npComfortBand.min ? (npComfortBand.min + 0.0015) : (npComfortBand.max - 0.0015);
      const targetNetProfit = sales * targetNpMargin;
      const targetProfitBeforeTax = solveProfitBeforeTaxForNetProfit(targetNetProfit);
      const maxIndirectExpense = Math.max(grossProfit - depnYr - interest, sales * 0.04);
      indExpTotal = clamp(grossProfit - depnYr - interest - targetProfitBeforeTax, sales * 0.04, maxIndirectExpense);
      ({ indirectExpenses, totalFixedCosts } = buildIndirectExpenses(indExpTotal, profile, rng, variability));
      profitBeforeInt = grossProfit - indExpTotal - depnYr;
      profitBeforeTax = profitBeforeInt - interest;
      tax = calculateTax(profitBeforeTax);
      netProfit = profitBeforeTax - tax;
      ebitda = netProfit + tax + depnYr + interest;
    }

    // ── ICR Soft Ceiling (CC-only, Y2 onwards) ──────────────────────────
    // EBITDA / interest climbing above ~9× in later years looks implausible to
    // a bank credit analyst ("if you cover interest 10×, why do you need our money?").
    // Absorb the excess into expenses — but only if NP margin stays ≥ floor + 0.3%.
    // Uses annualTlRepayment here (tlRepayment is declared later in the loop body).
    if (annualTlRepayment <= 0 && i >= 2) {
      const rawICR = ebitda / Math.max(interest, 1);
      const icrCeiling = 8.5 + centeredRandom(rng, 0.6 * variability); // 7.9–9.1× range
      if (rawICR > icrCeiling) {
        const targetEBITDA = interest * icrCeiling;
        const excessEBITDA = ebitda - targetEBITDA;
        const npFloor = npComfortBand.min + 0.003;
        const npHeadroom = Math.max((netProfit / Math.max(sales, 1)) - npFloor, 0) * sales;
        // Shift absorption from indirect expenses to COGS (purchases) to prevent 3x overhead spikes
        const absorb = Math.min(excessEBITDA, npHeadroom, purchases * 0.05);
        if (absorb > 500) {
          purchases = organic(purchases + absorb, rng);
          cogs = (openStock + purchases) - closeStock;
          grossProfit = sales - cogs;
          profitBeforeInt = grossProfit - indExpTotal - depnYr;
          profitBeforeTax = profitBeforeInt - interest;
          tax = calculateTax(profitBeforeTax);
          netProfit = profitBeforeTax - tax;
          ebitda = netProfit + tax + depnYr + interest;
        }
      }
    }

    const totalCosts = cogs + indExpTotal;

    // --- TERM LOAN REPAYMENT ---
    const tlRepayment = Math.min(annualTlRepayment, openingTermLoan);
    const closingTermLoan = openingTermLoan - tlRepayment;
    const cmltd = Math.min(annualTlRepayment, closingTermLoan); // Next year's dues

    // ═══════════════════════════════════════════════════════════════
    // CLEAN BALANCE SHEET — ONE PASS, NO FIGHTING LOOPS
    // Strategy: size each item from operational ratios, then solve
    // cash as the balancing item to hit target Current Ratio.
    // ═══════════════════════════════════════════════════════════════

    // ── Step 1: Fixed Assets ──
    accDepn += depnYr;
    let netFA = Math.max(grossFA - accDepn, 0);

    // ── Step 2: Operational Current Assets (from business cycle) ──
    const inventory = closeStock;
    const totalDebtors = organic((sales / 365) * curDebtorDays, rng);
    const debtorsOver6M = organic(totalDebtors * (profile.debtorAgingPct || 0.05), rng);
    const debtorsUnder6M = totalDebtors - debtorsOver6M;
    let loansAdv = organic(sales * profile.loansAdvPct, rng);
    const operationalCA = inventory + totalDebtors + loansAdv; // Cash added later

    // ── Step 3: Current Liabilities (from operational cycle) ──
    let creditors = organic((purchases / 365) * curCreditorDays, rng);
    const totalOtherCL = organic(sales * profile.otherCLPct, rng);
    const statutoryDues = organic(totalOtherCL * (profile.statutoryDuesPct || 0.4), rng);
    const generalOtherCL = totalOtherCL - statutoryDues;
    let totalCL = creditors + totalOtherCL + cmltd;

    // ── Step 4: Bank Borrowings = CC Limit (full utilization) ──
    bankBorrowings = limits.ccLimit;

    // ── Step 5: Unsecured Loans & Quasi-Equity ──
    const rawUnsecured = baselineVol * 0.10;
    const quasiEquity = organic(rawUnsecured * (profile.quasiEquityPct || 0.6), rng);
    let marketUnsecured = organic(rawUnsecured - quasiEquity, rng);

    // ── Step 6: Capital — sized for healthy ROE (25-40%) ──
    // A CA sizes capital so the owner's equity is proportional to the business.
    // Floor: max of (NP/targetROE), (sales × margin%), (prior capital × 0.95)
    const targetROE = clamp(0.32 - (i - 1) * 0.02 + centeredRandom(rng, 0.03), 0.22, 0.40);
    const capitalFloorROE = netProfit > 0 ? netProfit / targetROE : capital;
    const capitalFloorSales = sales * clamp(0.16 + centeredRandom(rng, 0.02), 0.14, 0.22);
    const capitalFloorPrior = capital * 0.95; // Never shrink drastically

    // Nominal drawings (~35-50% of NP — realistic for MSME proprietor)
    // Smooth drawings predictability: Use nominal direct
    const dynamicDrawingsMult = clamp(
      (profile.drawingsMult * drawingsTilt) + ((i - 1) * 0.06),
      0.25, 0.65
    );
    const nominalDrawings = organic(Math.max(baselineVol * 0.03, netProfit * dynamicDrawingsMult), rng);
    
    // Evaluate if capital inherently demands more
    // but default target is purely organic retention
    let targetCapital = Math.max(capital + netProfit - nominalDrawings, capitalFloorSales, capitalFloorPrior);

    // ── Step 7: Solve Cash for Target Current Ratio ──
    const crYearNoise = centeredRandom(rng, 0.04 * variability);
    const crDipBias = (i === 2 && rng() < 0.35) ? -0.02 : 0; 
    const targetCR = clamp(1.35 + (i - 1) * 0.04 + crYearNoise + crDipBias, 1.33, 1.65);
    
    // CASH IS NO LONGER THE PLUG. It is realistic: 1-3% of turnover.
    const minCash = organic(sales * profile.cashPct, rng);
    let cashBank = clamp(organic(sales * 0.015 * capitalTilt, rng), Math.max(minCash, baselineVol * 0.01), Math.max(baselineVol * 0.03, minCash * 2));
    
    const clDenom = bankBorrowings + totalCL;
    const neededCA = Math.ceil(targetCR * clDenom);
    
    // Missing CA to hit CR target is routed to Advances to Suppliers
    let missingCA = Math.max(neededCA - (operationalCA + cashBank), 0);
    loansAdv += missingCA;

    let totalCA = operationalCA + cashBank + missingCA;

    // ── Steps 8-10: Unified Balance Sheet Finalization ──
    const totalBankDebt = bankBorrowings + closingTermLoan;
    let totalAssets = netFA + totalCA;
    
    let nonCapitalLiab = quasiEquity + bankBorrowings + closingTermLoan + creditors + totalOtherCL + cmltd;
    let requiredUnsecured = totalAssets - targetCapital - nonCapitalLiab;
    
    if (requiredUnsecured < 0) {
      // We have too much capital for the assets.
      // Store the extra capital in non-current assets (Fixed Assets) to protect the Current Ratio
      grossFA += Math.abs(requiredUnsecured);
      netFA += Math.abs(requiredUnsecured);
      totalAssets += Math.abs(requiredUnsecured);
      marketUnsecured = 0;
    } else {
      marketUnsecured = requiredUnsecured;
    }
    
    // Check D:E Floor
    const deFloorCapital = Math.max(totalBankDebt / 2.0 - quasiEquity, 0);
    if (targetCapital < deFloorCapital) {
      const injection = deFloorCapital - targetCapital;
      targetCapital = deFloorCapital;
      // We increased capital. Decrease unsecured by same amount if available.
      if (marketUnsecured >= injection) {
          marketUnsecured -= injection;
      } else {
          // If we run out of unsecured, business needs more assets to balance the new capital
          const remainder = injection - marketUnsecured;
          marketUnsecured = 0;
          grossFA += remainder;   // Protected Current Ratio by routing to Fixed Assets
          netFA += remainder;
          totalAssets += remainder;
      }
    }
    
    // Check ROE Ceiling
    const roeCeiling = clamp(0.62 + centeredRandom(rng, 0.10 * variability), 0.52, 0.72);
    if (netProfit > 0 && targetCapital > 0 && netProfit / targetCapital > roeCeiling) {
      const roeCapFloor = Math.ceil(netProfit / roeCeiling);
      const roeInjection = roeCapFloor - targetCapital;
      if (roeInjection > 0) {
        targetCapital = roeCapFloor;
        // Balance by adding to Fixed Assets
        grossFA += roeInjection;
        netFA += roeInjection;
        totalAssets += roeInjection;
      }
    }

    capital = Math.max(targetCapital, 1);
    const totalLiab = capital + nonCapitalLiab + marketUnsecured;
    const reconAdj = totalAssets - totalLiab; // Balance sheet balances by construction

    // d) TOL/TNW (informational, for ratio output)
    const finalTnw = capital + quasiEquity;
    let totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
    if (totalOutsideLiab / Math.max(finalTnw, 1) > 3.0) {
      if (marketUnsecured > 5000) {
        const shift = organic(marketUnsecured * 0.40, rng);
        marketUnsecured -= shift;
        capital += shift;
        totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
      }
    }
    
    const variableCosts = (purchases + (indExpTotal - totalFixedCosts));
    const contribution = sales - variableCosts;
    const bepSales = (totalFixedCosts + interest + depnYr) / (contribution / sales);
    
    // DSCR — natural for CC-only, managed for TL cases
    const debtServiceAssessment = assessDebtService(ebitda, interest, tlRepayment, i, dscrBias, rng);
    const dscr = debtServiceAssessment.dscr;

    // FACR — segment-specific with noise (not uniform)
    let facr: number;
    if (closingTermLoan > 0) {
      facr = netFA / Math.max(closingTermLoan, 1);
    } else {
      // No TL: derive organic FACR based on segment + year + noise
      const baseFacr = ({
        trading: 1.35, service: 1.25, manufacturing: 1.55, construction: 1.45,
      })[segKey] || 1.40;
      facr = clamp(
        baseFacr + (i - 1) * 0.12 + centeredRandom(rng, 0.08 * variability),
        1.15, 2.50
      );
    }
    facr = Math.min(facr, 5.0);

    projections.push({
      year: i, fyLabel, sales, otherInc, totalRev, openStock, purchases, indirectExpenses, totalIndExp: indExpTotal,
      closingStock: closeStock, totalCosts, grossProfit, gpRatio: (grossProfit/sales)*100, depnYr, profitBeforeInt, 
      interest, profitBeforeTax, tax, netProfit, npRatio: (netProfit/sales)*100, ebitda,
      
      capital, quasiEquity, unsecured: marketUnsecured, bankBorrowings, 
      termLoan: closingTermLoan - cmltd, // Strict Long Term portion for UI
      cmltd, tlRepayment,
      creditors, statutoryDues, otherCL: generalOtherCL, totalCL, totalLiab,
      
      grossFA, accDepn, netFA, inventory,
      rawMaterials: segKey === 'manufacturing' ? organic(inventory * 0.60, rng)
                  : segKey === 'construction' ? organic(inventory * 0.70, rng)
                  : 0,
      stockInProcess: segKey === 'manufacturing' ? organic(inventory * 0.10, rng) : 0,
      finishedGoods: segKey === 'trading' || segKey === 'service'
                   ? inventory  // Trading/service: ALL stock is finished goods
                   : segKey === 'manufacturing' ? organic(inventory * 0.30, rng)
                   : organic(inventory * 0.30, rng),
      debtors: totalDebtors, debtorsUnder6M, debtorsOver6M,
      cashBank, loansAdv, reconAdj, totalCA, totalAssets,
      
      currentRatio: totalCA / Math.max(totalCL + bankBorrowings, 1),
      currentRatioExBank: totalCA / Math.max(totalCL, 1),
      dscr,
      assessedDebtService: debtServiceAssessment.assessedDebtService,
      debtServiceBuffer: debtServiceAssessment.debtServiceBuffer,
      deRatio: (bankBorrowings + closingTermLoan) / Math.max(finalTnw, 1),
      tolTnw: totalOutsideLiab / Math.max(finalTnw, 1),
      bepPercentage: (bepSales / sales) * 100,
      facr: facr, 
      capacityUtil: currentUtil
    });

    openStock = closeStock;
    openingTermLoan = closingTermLoan; // Carry remaining loan to next year
  }

  return projections;
}
