// lib/engine.ts — Forward-Flow CMA Projection Engine
// Architecture: Operations → P&L → Balance Sheet → Ratios (outputs, never targets)
import { BusinessProfile, ProjectedYear, LoanLimits } from '../types/cma';

export type { ProjectedYear };
export interface ProjectionOptions {
  seed?: number;
  variability?: number;
}

// ── Expense head metadata ──────────────────────────────────────────
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
  { k: 'misc', l: 'Miscellaneous Expenses', fixed: 0.5 },
];

// Segment-specific capacity utilization bands (display only)
const CAP_UTIL_BANDS: Record<string, { start: number; growth: number }> = {
  trading:       { start: 0.76, growth: 0.055 },
  service:       { start: 0.62, growth: 0.075 },
  manufacturing: { start: 0.58, growth: 0.070 },
  construction:  { start: 0.53, growth: 0.085 },
};

// ── Utility functions ──────────────────────────────────────────────
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
  if (seed !== undefined) return seed >>> 0;
  return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
}

function centeredRandom(rng: () => number, amplitude: number) {
  return (rng() * 2 - 1) * amplitude;
}

/**
 * Progressive income tax — Old Regime (Proprietorship/Partnership)
 * Slabs: ₹0-2.5L: Nil | ₹2.5-5L: 5% | ₹5-10L: 20% | >₹10L: 30%
 * Plus 4% Health & Education Cess on computed tax.
 */
function calculateTax(profit: number): number {
  if (profit <= 0) return 0;
  let tax = 0;
  if (profit > 250000) tax += Math.min(profit - 250000, 250000) * 0.05;
  if (profit > 500000) tax += Math.min(profit - 500000, 500000) * 0.20;
  if (profit > 1000000) tax += (profit - 1000000) * 0.30;
  return Math.floor(tax * 1.04);
}

function resolveSegmentKey(label: string) {
  const n = label.trim().toLowerCase();
  if (n.startsWith('service')) return 'service';
  if (n.startsWith('manufact')) return 'manufacturing';
  if (n.startsWith('construct')) return 'construction';
  return 'trading';
}

// Kept for backward compatibility (scripts may reference it)
export function getDscrTargetBand(year: number, targetBias: number = 0) {
  return { floor: 1.5, target: 1.80 + ((year - 1) * 0.08) + targetBias, ceiling: 2.40 };
}
export function assessDebtService(ebitda: number, interest: number, tlRepayment: number) {
  const ds = interest + tlRepayment;
  return { assessedDebtService: Math.max(ds, 1), debtServiceBuffer: 0, dscr: ebitda / Math.max(ds, 1) };
}

// ════════════════════════════════════════════════════════════════════
// MAIN ENGINE — Forward-Flow Projection
// ════════════════════════════════════════════════════════════════════
export function generateProjections(
  limits: LoanLimits,
  profile: BusinessProfile,
  projectionYears: number = 3,
  baseYear: number = 2024,
  options: ProjectionOptions = {}
): ProjectedYear[] {
  const projections: ProjectedYear[] = [];
  const rng = createSeededRandom(createRunSeed(options.seed));
  const segKey = resolveSegmentKey(profile.label);
  const baselineVol = limits.ccLimit || limits.existingCc || limits.termLoan || 500000;

  // ── SEED-BASED INITIALIZATION ──────────────────────────────────
  // The seed creates unique starting conditions per business.
  // Growth rates are also seed-jittered so trajectories diverge.
  const salesJitter     = 1 + centeredRandom(rng, 0.04);
  const capitalJitter   = 1 + centeredRandom(rng, 0.05);
  const faJitter        = 1 + centeredRandom(rng, 0.05);
  const revGrowth       = clamp(profile.revGrowth * (1 + centeredRandom(rng, 0.12)), 0.08, 0.25);
  const expGrowth       = clamp(profile.expGrowth * (1 + centeredRandom(rng, 0.15)), 0.05, 0.14);
  const drawingRatioBase = clamp(0.68 + centeredRandom(rng, 0.06), 0.62, 0.80);
  const baseDebtorDays  = Math.round(clamp(profile.debtorDays * (1 + centeredRandom(rng, 0.08)), 20, 90));
  const baseCreditorDays= Math.round(clamp(profile.creditorDays * (1 + centeredRandom(rng, 0.08)), 15, 90));
  const baseStockMonths = clamp(profile.stockMonths * (1 + centeredRandom(rng, 0.08)), 0.3, 3.0);
  // Bug 3 fix: purchase ratio improves slightly each year (economies of scale)
  const purRatioImprovePerYr = clamp(0.002 + centeredRandom(rng, 0.0005), 0.0015, 0.0025);
  // Bug 4 fix: average CC utilization grows as business expands
  const baseAvgUtil     = clamp(0.70 + centeredRandom(rng, 0.03), 0.65, 0.76);
  const utilGrowthPerYr = 0.02;

  // ── Y1 Base Values ─────────────────────────────────────────────
  let sales        = Math.round(baselineVol * profile.salesMult * salesJitter);
  // Hard floor: Nayak MPBF requires sales ≥ 5× CC limit
  sales = Math.max(sales, Math.ceil(baselineVol * 5.0));

  let capital      = Math.round(baselineVol * profile.capitalMult * capitalJitter);
  let grossFA      = Math.round(baselineVol * profile.grossFAMult * faJitter);
  let accDepn      = 0;
  let wdv          = grossFA;

  // Fixed BS items (stable across all years)
  const bankBorrowings = Math.round(limits.ccLimit * 0.75);
  const quasiEquity    = Math.round(baselineVol * (profile.quasiEquityPct || 0.06));
  const unsecured      = Math.round(baselineVol * 0.04);

  // Term loan setup
  let openingTermLoan  = limits.isRenewal ? limits.existingTl : 0;
  let annualTlRepayment = 0;

  // Y1 expense breakdown: derived from profile weights + seed jitter
  const expWeights = EXP_LABELS.map(e => {
    const baseRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
    return { ...e, weight: Math.max(baseRatio * (1 + centeredRandom(rng, 0.06)), 0.005) };
  });
  const totalWeight = expWeights.reduce((s, e) => s + e.weight, 0);
  const normalizedWeights = expWeights.map(e => ({ ...e, ratio: e.weight / totalWeight }));

  // Bug 2 fix: Y1 opening stock = prior year's closing stock (smaller, business was growing)
  // Simulates prior year having ~revGrowth% less purchases → less stock
  const priorPurchases = Math.round(sales * profile.purchaseRatio / (1 + revGrowth));
  let openStock = Math.round((priorPurchases / 12) * baseStockMonths);

  // Capacity utilization (display only)
  const capBand = CAP_UTIL_BANDS[segKey] || CAP_UTIL_BANDS.trading;
  const capUtilJitter = centeredRandom(rng, 0.05);

  for (let i = 1; i <= projectionYears; i++) {
    const projStartYear = baseYear + i;
    const fyLabel = `FY ${projStartYear.toString().slice(-2)}-${(projStartYear + 1).toString().slice(-2)}`;

    // ── Term Loan ────────────────────────────────────────────────
    if (i === 1) {
      openingTermLoan += limits.termLoan;
      annualTlRepayment = Math.round(openingTermLoan / (limits.tenure || 5));
    }

    // ── SALES & PURCHASES ────────────────────────────────────────
    if (i > 1) {
      sales = Math.round(sales * (1 + revGrowth));
    }
    // Bug 3 fix: purchase ratio improves slightly each year (scale economies)
    const yearPurRatio = Math.max(profile.purchaseRatio - (i - 1) * purRatioImprovePerYr, 0.08);
    const purchases = Math.round(sales * yearPurRatio);

    // Bug 5 fix: WC cycle improves gradually each year
    const yearDebtorDays  = Math.max(baseDebtorDays - (i - 1) * 1, 15);
    const yearCreditorDays = Math.min(baseCreditorDays + (i - 1) * 0.5, 90);
    const yearStockMonths  = Math.max(baseStockMonths - (i - 1) * 0.03, 0.3);

    // ── STOCK ────────────────────────────────────────────────────
    const closeStock = Math.round((purchases / 12) * yearStockMonths);

    // ── COGS & GROSS PROFIT ──────────────────────────────────────
    const cogs = openStock + purchases - closeStock;
    const grossProfit = sales - cogs;

    // ── INDIRECT EXPENSES ────────────────────────────────────────
    // Y1: from profile weights. Y2+: each line grows from its prior year value.
    let indirectExpenses: { label: string; value: number }[];
    let indExpTotal: number;

    if (i === 1) {
      const baseIndExp = Math.round(sales * profile.indExpRatio * (1 + centeredRandom(rng, 0.03)));
      indirectExpenses = normalizedWeights.map((e, idx) => {
        if (idx === normalizedWeights.length - 1) {
          // Last item (misc) absorbs rounding
          const allocated = normalizedWeights.slice(0, -1).reduce((s, w) => s + Math.round(baseIndExp * w.ratio), 0);
          return { label: e.l, value: Math.max(baseIndExp - allocated, 0) };
        }
        return { label: e.l, value: Math.round(baseIndExp * e.ratio) };
      });

      // Employee-driven salary (Y1 only)
      if (typeof profile.numEmployees === 'number' && profile.numEmployees > 0) {
        const salaryItem = indirectExpenses.find(e => e.label === 'Salaries & Wages')!;
        const monthlyCTC = 12000 + Math.floor(rng() * 4000);
        salaryItem.value = Math.round(profile.numEmployees * monthlyCTC * 12);
      }

      // Own premises: zero rent (Y1 only — subsequent years inherit this)
      if (profile.ownPremises === true) {
        const rentItem = indirectExpenses.find(e => e.label === 'Rent & Rates')!;
        rentItem.value = 0;
      }

      indExpTotal = indirectExpenses.reduce((s, e) => s + e.value, 0);
    } else {
      // Y2+: each expense grows from its prior year value
      const prior = projections[i - 2].indirectExpenses;
      indirectExpenses = prior.map(e => {
        // Salary grows slightly faster than other expenses
        const lineGrowth = e.label === 'Salaries & Wages'
          ? expGrowth + 0.02  // Salary: +2% above general expense growth
          : e.label === 'Rent & Rates' && e.value === 0
            ? 0  // Own premises: stay at zero
            : expGrowth;
        return { label: e.label, value: Math.round(e.value * (1 + lineGrowth)) };
      });
      indExpTotal = indirectExpenses.reduce((s, e) => s + e.value, 0);
    }

    // ── DEPRECIATION ─────────────────────────────────────────────
    const depnYr = Math.round(wdv * profile.depnRate);
    wdv = Math.max(wdv - depnYr, 0);

    // ── INTEREST ─────────────────────────────────────────────────
    // Bug 4 fix: interest on average utilization (grows as business expands)
    // BS shows year-end balance (75%), but avg annual utilization varies
    const yearAvgUtil = clamp(baseAvgUtil + (i - 1) * utilGrowthPerYr, 0.65, 0.85);
    const ccInterest = Math.round(limits.ccLimit * yearAvgUtil * (limits.ccIntRate / 100));
    const tlInterest = Math.round(openingTermLoan * (limits.tlIntRate / 100));
    const interest = ccInterest + tlInterest;

    // ── PROFIT ───────────────────────────────────────────────────
    const otherInc = Math.round(sales * (0.0008 + rng() * 0.0012));
    const totalRev = sales + otherInc;
    const profitBeforeInt = grossProfit - indExpTotal - depnYr;
    const profitBeforeTax = profitBeforeInt - interest;
    const tax = calculateTax(profitBeforeTax);
    const netProfit = profitBeforeTax - tax;
    const ebitda = netProfit + tax + depnYr + interest;
    const totalCosts = cogs + indExpTotal;

    // ── TERM LOAN REPAYMENT ──────────────────────────────────────
    const tlRepayment = Math.min(annualTlRepayment, openingTermLoan);
    const closingTermLoan = openingTermLoan - tlRepayment;
    const cmltd = Math.min(annualTlRepayment, closingTermLoan);

    // ════════════════════════════════════════════════════════════
    // BALANCE SHEET — Capital-first, cash balances
    // ════════════════════════════════════════════════════════════

    // ── Fixed Assets ─────────────────────────────────────────────
    accDepn += depnYr;
    const netFA = Math.max(grossFA - accDepn, 0);

    // ── Capital: prior + PAT - drawings ──────────────────────────
    // Drawing ratio escalates with year — proprietors take more as business matures.
    // Y1: base | Y2: +3% | Y3: +6% | Y4: +9% | Y5: +12%
    if (i > 1) {
      const yearDrawingRatio = clamp(drawingRatioBase + (i - 1) * 0.03, 0.62, 0.88);
      const drawings = Math.round(netProfit * yearDrawingRatio);
      capital = capital + netProfit - drawings;
    }

    // ── Current Assets (from business cycle) ─────────────────────
    const inventory = closeStock;
    const totalDebtors = Math.round((sales / 365) * yearDebtorDays);
    const debtorsOver6M = Math.round(totalDebtors * (profile.debtorAgingPct || 0.05));
    const debtorsUnder6M = totalDebtors - debtorsOver6M;
    // Loans & advances grow with business expansion (new deposits, advances to suppliers)
    const loansAdv = Math.round(sales * profile.loansAdvPct * (1 + (i - 1) * 0.15));

    // ── Current Liabilities (from business cycle) ────────────────
    const creditors = Math.round((purchases / 365) * yearCreditorDays);
    const totalOtherCL = Math.round(sales * profile.otherCLPct);
    const statutoryDues = Math.round(totalOtherCL * (profile.statutoryDuesPct || 0.4));
    const generalOtherCL = totalOtherCL - statutoryDues;
    const totalCL = creditors + totalOtherCL + cmltd;

    // ── Total Liabilities (initial) ──────────────────────────────
    let marketUnsecured = unsecured;
    let totalLiab = capital + quasiEquity + marketUnsecured + bankBorrowings
                  + closingTermLoan + creditors + totalOtherCL + cmltd;

    // ── Cash = balancing item ────────────────────────────────────
    const nonCashAssets = netFA + inventory + totalDebtors + loansAdv;

    // If assets > liabilities, the proprietor has borrowed from
    // family/market to fund working capital — very common in MSMEs.
    if (nonCashAssets > totalLiab) {
      const shortfall = nonCashAssets - totalLiab;
      marketUnsecured += shortfall;
      totalLiab += shortfall;
    }

    let cashBank = totalLiab - nonCashAssets; // Always >= 0 now
    let totalCA = inventory + totalDebtors + loansAdv + cashBank;

    // ── CR Floor Guard ───────────────────────────────────────────
    // If CR < 1.25 (below bankable minimum), the proprietor injects
    // more market borrowing to maintain working capital liquidity.
    // Unsecured goes UP → totalLiab UP → cash UP → CA UP → CR UP.
    // Unsecured is NOT in the CR denominator, so this directly helps.
    const crDenom = totalCL + bankBorrowings;
    const minCR = 1.25;
    if (totalCA / Math.max(crDenom, 1) < minCR) {
      const targetCA = Math.ceil(minCR * crDenom);
      const extraNeeded = targetCA - totalCA;
      if (extraNeeded > 0) {
        marketUnsecured += extraNeeded;
        cashBank += extraNeeded;
        totalCA += extraNeeded;
        totalLiab += extraNeeded;
      }
    }

    const totalAssets = netFA + totalCA;
    const reconAdj = totalAssets - totalLiab; // 0 by construction

    // ── RATIOS (all outputs, never targets) ──────────────────────
    const currentRatio = totalCA / Math.max(totalCL + bankBorrowings, 1);
    const currentRatioExBank = totalCA / Math.max(totalCL, 1);

    const baseDebtService = interest + tlRepayment;
    const dscr = ebitda / Math.max(baseDebtService, 1);

    const tnw = capital + quasiEquity;
    const deRatio = (bankBorrowings + closingTermLoan) / Math.max(tnw, 1);
    const totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
    const tolTnw = totalOutsideLiab / Math.max(tnw, 1);

    // BEP
    const totalFixedCosts = indirectExpenses.reduce((s, exp) => {
      const meta = EXP_LABELS.find(l => l.l === exp.label);
      return s + exp.value * (meta?.fixed ?? 0.5);
    }, 0);
    const variableCosts = purchases + (indExpTotal - totalFixedCosts);
    const contribution = sales - variableCosts;
    const bepSales = contribution > 0
      ? (totalFixedCosts + interest + depnYr) / (contribution / sales)
      : sales;

    const facr = closingTermLoan > 0 ? netFA / Math.max(closingTermLoan, 1) : 0;

    const capacityUtil = clamp(
      (capBand.start + capUtilJitter + (i - 1) * capBand.growth) * 100,
      50, 95
    );

    // ── Stock sub-categories ─────────────────────────────────────
    let rawMaterials = 0, stockInProcess = 0, finishedGoods = inventory;
    if (segKey === 'manufacturing') {
      rawMaterials = Math.round(inventory * 0.60);
      stockInProcess = Math.round(inventory * 0.10);
      finishedGoods = Math.round(inventory * 0.30);
    } else if (segKey === 'construction') {
      rawMaterials = Math.round(inventory * 0.70);
      finishedGoods = Math.round(inventory * 0.30);
    }

    projections.push({
      year: i, fyLabel, sales, otherInc, totalRev, openStock, purchases,
      indirectExpenses, totalIndExp: indExpTotal,
      closingStock: closeStock, totalCosts, grossProfit,
      gpRatio: (grossProfit / sales) * 100, depnYr, profitBeforeInt,
      interest, profitBeforeTax, tax, netProfit,
      npRatio: (netProfit / sales) * 100, ebitda,

      capital, quasiEquity, unsecured: marketUnsecured, bankBorrowings,
      termLoan: closingTermLoan - cmltd, cmltd, tlRepayment,
      creditors, statutoryDues, otherCL: generalOtherCL, totalCL, totalLiab,

      grossFA, accDepn, netFA, inventory,
      rawMaterials, stockInProcess, finishedGoods,
      debtorsUnder6M, debtorsOver6M, debtors: totalDebtors,
      cashBank, loansAdv, reconAdj, totalCA, totalAssets,

      currentRatio, currentRatioExBank, dscr,
      assessedDebtService: Math.max(baseDebtService, 1),
      debtServiceBuffer: 0,
      deRatio, tolTnw,
      bepPercentage: (bepSales / sales) * 100,
      facr, capacityUtil,
    });

    openStock = closeStock;
    openingTermLoan = closingTermLoan;
  }

  return projections;
}
