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
  { k: 'salary',    l: 'Salaries & Wages',          fixed: 1.0 },
  { k: 'rent',      l: 'Rent & Rates',               fixed: 1.0 },
  { k: 'power',     l: 'Power & Fuel',               fixed: 0.3 },
  { k: 'freight',   l: 'Freight / Carriage',         fixed: 0.0 },
  { k: 'travel',    l: 'Travelling & Conveyance',    fixed: 0.5 },
  { k: 'telephone', l: 'Telephone / Internet',       fixed: 0.8 },
  { k: 'sadar',     l: 'Sadar / Local Expenses',     fixed: 0.7 },
  { k: 'office',    l: 'Office / Shop Expenses',     fixed: 0.9 },
  { k: 'welfare',   l: 'Staff Welfare',              fixed: 1.0 },
  { k: 'misc',      l: 'Miscellaneous Expenses',     fixed: 0.5 },
];

// Segment-specific capacity utilization bands (display only)
const CAP_UTIL_BANDS: Record<string, { start: number; growth: number }> = {
  trading:       { start: 0.76, growth: 0.055 },
  service:       { start: 0.62, growth: 0.075 },
  manufacturing: { start: 0.58, growth: 0.070 },
  construction:  { start: 0.53, growth: 0.085 },
};

// ── NPM ceilings by segment ────────────────────────────────────────
// When projected PAT/sales exceeds the ceiling, the surplus is added to
// Miscellaneous Expenses so the adjustment flows cleanly through tax → PAT,
// keeping every downstream report (Form II, ratios, BEP) internally consistent.
const NPM_CEILING: Record<string, number> = {
  trading:       0.090,   // 9%  — thin-margin trade
  service:       0.140,   // 14% — IT / consulting / professional services
  manufacturing: 0.110,   // 11% — small-scale manufacturing
  construction:  0.100,   // 10% — civil / infrastructure
};

// ── Utility ────────────────────────────────────────────────────────
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
 * ₹0-2.5L: Nil | ₹2.5-5L: 5% | ₹5-10L: 20% | >₹10L: 30% + 4% Cess
 */
function calculateTax(profit: number): number {
  if (profit <= 0) return 0;
  let tax = 0;
  if (profit > 250000)  tax += Math.min(profit - 250000, 250000) * 0.05;
  if (profit > 500000)  tax += Math.min(profit - 500000, 500000) * 0.20;
  if (profit > 1000000) tax += (profit - 1000000) * 0.30;
  return Math.floor(tax * 1.04);
}

function resolveSegmentKey(label: string) {
  const n = label.trim().toLowerCase();
  if (n.startsWith('service'))   return 'service';
  if (n.startsWith('manufact'))  return 'manufacturing';
  if (n.startsWith('construct')) return 'construction';
  return 'trading';
}

// Kept for backward compatibility
export function getDscrTargetBand(year: number, targetBias: number = 0) {
  return { floor: 1.5, target: 1.80 + ((year - 1) * 0.08) + targetBias, ceiling: 2.40 };
}
export function assessDebtService(ebitda: number, interest: number, tlRepayment: number) {
  const ds = interest + tlRepayment;
  return { assessedDebtService: Math.max(ds, 1), debtServiceBuffer: 0, dscr: ebitda / Math.max(ds, 1) };
}

// ════════════════════════════════════════════════════════════════════
// MAIN ENGINE
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

  // FIX D: CC-only flag — DscrSchedule.tsx renders ICR instead of DSCR
  const isCcOnly = !limits.termLoan && !limits.existingTl;

  // ── Seed-jittered parameters ───────────────────────────────────
  const salesJitter      = 1 + centeredRandom(rng, 0.04);
  const faJitter         = 1 + centeredRandom(rng, 0.05);
  const revGrowth        = clamp(profile.revGrowth   * (1 + centeredRandom(rng, 0.12)), 0.08, 0.25);
  const expGrowth        = clamp(profile.expGrowth   * (1 + centeredRandom(rng, 0.15)), 0.05, 0.14);
  const drawingRatioBase = clamp(profile.drawingsMult * (1 + centeredRandom(rng, 0.06)), 0.25, 0.60);
  const baseDebtorDays   = Math.round(clamp(profile.debtorDays   * (1 + centeredRandom(rng, 0.08)), 20, 90));
  const baseCreditorDays = Math.round(clamp(profile.creditorDays * (1 + centeredRandom(rng, 0.08)), 15, 90));
  const baseStockMonths  = clamp(profile.stockMonths * (1 + centeredRandom(rng, 0.08)), 0.3, 3.0);
  const purRatioImprovePerYr = clamp(0.002 + centeredRandom(rng, 0.0005), 0.0015, 0.0025);
  const baseAvgUtil      = clamp(0.70 + centeredRandom(rng, 0.03), 0.65, 0.76);
  const utilGrowthPerYr  = 0.02;
  const npmCeiling       = NPM_CEILING[segKey] ?? 0.10;

  // ── Sales, FA ─────────────────────────────────────────────────
  let sales   = Math.round(baselineVol * profile.salesMult * salesJitter);
  sales       = Math.max(sales, Math.ceil(baselineVol * 5.0));
  let grossFA = Math.round(baselineVol * profile.grossFAMult * faJitter);
  let accDepn = 0;
  let wdv     = grossFA;

  // Fixed funding items
  const bankBorrowings = Math.round(limits.ccLimit * 0.75);
  const quasiEquity    = Math.round(baselineVol * (profile.quasiEquityPct || 0.06));
  const baseUnsecured  = Math.round(baselineVol * 0.04);

  // Term loan
  let openingTermLoan   = limits.isRenewal ? limits.existingTl : 0;
  let annualTlRepayment = 0;

  // Expense weights (seed-jittered)
  const expWeights = EXP_LABELS.map(e => {
    const baseRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
    return { ...e, weight: Math.max(baseRatio * (1 + centeredRandom(rng, 0.06)), 0.005) };
  });
  const totalWeight       = expWeights.reduce((s, e) => s + e.weight, 0);
  const normalizedWeights = expWeights.map(e => ({ ...e, ratio: e.weight / totalWeight }));

  // Opening stock = prior year's closing stock
  const priorPurchases = Math.round(sales * profile.purchaseRatio / (1 + revGrowth));
  let openStock        = Math.round((priorPurchases / 12) * baseStockMonths);

  const capBand       = CAP_UTIL_BANDS[segKey] || CAP_UTIL_BANDS.trading;
  const capUtilJitter = centeredRandom(rng, 0.05);

  // ── FIX A: Derive opening capital from the Y1 asset base ──────
  //
  // Old code: capital = capitalMult × baselineVol — a number disconnected from
  // what the business actually owns in Y1. The mismatch produced a large BS
  // balancing plug (cash), which accumulated further each year.
  //
  // New approach: estimate Y1 assets at target cash (profile.cashPct × sales),
  // then back-calculate the capital needed to close the BS. This means the BS
  // starts balanced and only needs small adjustments each year as the business grows.
  {
    const depnEst       = Math.round(wdv * profile.depnRate);
    const netFAEst      = Math.max(grossFA - depnEst, 0);
    const purchasesEst  = Math.round(sales * profile.purchaseRatio);
    const closeStockEst = Math.round((purchasesEst / 12) * baseStockMonths);
    const debtorsEst    = Math.round((sales / 365) * baseDebtorDays);
    const loansAdvEst   = Math.round(purchasesEst * profile.loansAdvPct);
    const targetCashEst = Math.round(sales * (profile.cashPct || 0.025));
    const totalAssetsEst = netFAEst + closeStockEst + debtorsEst + loansAdvEst + targetCashEst;

    const creditorsEst  = Math.round((purchasesEst / 365) * baseCreditorDays);
    const otherCLEst    = Math.round(sales * profile.otherCLPct);
    const fixedLiab     = quasiEquity + baseUnsecured + bankBorrowings + creditorsEst + otherCLEst;

    var openingCapital  = totalAssetsEst - fixedLiab;
    // Ensure capital is at least modestly positive (business can't start insolvent)
    openingCapital = Math.max(openingCapital, Math.round(baselineVol * 0.20));
  }

  let capital = openingCapital;

  for (let i = 1; i <= projectionYears; i++) {
    const projStartYear = baseYear + i;
    const fyLabel = `FY ${projStartYear.toString().slice(-2)}-${(projStartYear + 1).toString().slice(-2)}`;

    // ── Term Loan ────────────────────────────────────────────────
    if (i === 1) {
      openingTermLoan  += limits.termLoan;
      annualTlRepayment = Math.round(openingTermLoan / (limits.tenure || 5));
    }

    // ── Sales & Purchases ────────────────────────────────────────
    if (i > 1) sales = Math.round(sales * (1 + revGrowth));
    const yearPurRatio = Math.max(profile.purchaseRatio - (i - 1) * purRatioImprovePerYr, 0.08);
    const purchases    = Math.round(sales * yearPurRatio);

    const yearDebtorDays   = Math.max(baseDebtorDays  - (i - 1),         15);
    const yearCreditorDays = Math.min(baseCreditorDays + (i - 1) * 0.5,  90);
    const yearStockMonths  = Math.max(baseStockMonths  - (i - 1) * 0.03, 0.3);

    // ── Stock, COGS ──────────────────────────────────────────────
    const closeStock  = Math.round((purchases / 12) * yearStockMonths);
    const cogs        = openStock + purchases - closeStock;
    const grossProfit = sales - cogs;

    // ── Indirect Expenses ────────────────────────────────────────
    let indirectExpenses: { label: string; value: number }[];
    let indExpTotal: number;

    if (i === 1) {
      const baseIndExp = Math.round(sales * profile.indExpRatio * (1 + centeredRandom(rng, 0.03)));
      indirectExpenses = normalizedWeights.map((e, idx) => {
        if (idx === normalizedWeights.length - 1) {
          const alloc = normalizedWeights.slice(0, -1).reduce((s, w) => s + Math.round(baseIndExp * w.ratio), 0);
          return { label: e.l, value: Math.max(baseIndExp - alloc, 0) };
        }
        return { label: e.l, value: Math.round(baseIndExp * e.ratio) };
      });
      if (typeof profile.numEmployees === 'number' && profile.numEmployees > 0) {
        const salaryItem = indirectExpenses.find(e => e.label === 'Salaries & Wages')!;
        salaryItem.value = Math.round(profile.numEmployees * (12000 + Math.floor(rng() * 4000)) * 12);
      }
      if (profile.ownPremises === true) {
        const rentItem = indirectExpenses.find(e => e.label === 'Rent & Rates')!;
        rentItem.value = 0;
      }
      indExpTotal = indirectExpenses.reduce((s, e) => s + e.value, 0);
    } else {
      const prior = projections[i - 2].indirectExpenses;
      indirectExpenses = prior.map(e => {
        const g = e.label === 'Salaries & Wages' ? expGrowth + 0.02
                : e.label === 'Rent & Rates' && e.value === 0 ? 0
                : expGrowth;
        return { label: e.label, value: Math.round(e.value * (1 + g)) };
      });
      indExpTotal = indirectExpenses.reduce((s, e) => s + e.value, 0);
    }

    // ── Depreciation & Interest ──────────────────────────────────
    const depnYr   = Math.round(wdv * profile.depnRate);
    wdv = Math.max(wdv - depnYr, 0);

    const yearAvgUtil = clamp(baseAvgUtil + (i - 1) * utilGrowthPerYr, 0.65, 0.85);
    const ccInterest  = Math.round(limits.ccLimit * yearAvgUtil * (limits.ccIntRate / 100));
    const tlInterest  = Math.round(openingTermLoan * (limits.tlIntRate / 100));
    const interest    = ccInterest + tlInterest;

    // ── FIX B: NPM Ceiling ───────────────────────────────────────
    // Pre-ceiling PAT check. If PAT/sales > npmCeiling, excess is routed to
    // Miscellaneous Expenses so the full P&L re-computes consistently.
    const otherInc  = Math.round(sales * (0.0008 + rng() * 0.0012));
    const totalRev  = sales + otherInc;
    const pbtPre    = grossProfit - indExpTotal - depnYr - interest;
    const patPre    = pbtPre - calculateTax(pbtPre);
    const npmCap    = Math.round(sales * npmCeiling);

    let finalIndirectExpenses = indirectExpenses;
    let finalIndExpTotal      = indExpTotal;

    if (patPre > npmCap) {
      const excess = patPre - npmCap;
      // Spread excess proportionally across ALL expense heads (not just Misc).
      // This avoids a visually alarming 10× spike on a single line in the P&L.
      finalIndirectExpenses = indirectExpenses.map(e => ({ ...e }));
      const spreadBase = finalIndirectExpenses.reduce((s, e) => s + e.value, 0);
      let spreadSoFar = 0;
      finalIndirectExpenses = finalIndirectExpenses.map((e, idx) => {
        if (idx === finalIndirectExpenses.length - 1) {
          // Last item absorbs rounding residual
          return { ...e, value: e.value + (excess - spreadSoFar) };
        }
        const share = spreadBase > 0 ? Math.round(excess * e.value / spreadBase) : 0;
        spreadSoFar += share;
        return { ...e, value: e.value + share };
      });
      finalIndExpTotal = finalIndirectExpenses.reduce((s, e) => s + e.value, 0);
    }

    // ── Final P&L ────────────────────────────────────────────────
    const totalCosts      = cogs + finalIndExpTotal;
    const profitBeforeInt = grossProfit - finalIndExpTotal - depnYr;
    const profitBeforeTax = profitBeforeInt - interest;
    const tax             = calculateTax(profitBeforeTax);
    const netProfit       = profitBeforeTax - tax;
    const ebitda          = netProfit + tax + depnYr + interest;

    // ── Term Loan Repayment ──────────────────────────────────────
    const tlRepayment     = Math.min(annualTlRepayment, openingTermLoan);
    const closingTermLoan = openingTermLoan - tlRepayment;
    const cmltd           = Math.min(annualTlRepayment, closingTermLoan);

    // ── Fixed Assets ─────────────────────────────────────────────
    accDepn += depnYr;
    const netFA = Math.max(grossFA - accDepn, 0);

    // ── Capital: drawings applied every year including Y1 ────────
    // CRITICAL RULE: drawings can only come from THIS YEAR's profit.
    // Accumulated capital (past retained earnings) is never touched by drawings.
    // This ensures capital is monotonically non-decreasing except in loss years.
    const yearDrawingRatio    = clamp(drawingRatioBase + (i - 1) * 0.03, 0.25, 0.88);
    const profitToDistribute  = Math.max(netProfit, 0);  // never draw from a loss
    let drawings              = Math.round(profitToDistribute * yearDrawingRatio);
    capital                   = capital + netProfit - drawings;
    // Safety floor: capital can never go below openingCapital's minimum
    if (capital < openingCapital) capital = openingCapital;

    // ── Current Assets ───────────────────────────────────────────
    const inventory      = closeStock;
    const totalDebtors   = Math.round((sales / 365) * yearDebtorDays);
    const debtorsOver6M  = Math.round(totalDebtors * (profile.debtorAgingPct || 0.05));
    const debtorsUnder6M = totalDebtors - debtorsOver6M;

    // FIX C2: L&A tracks purchases, not sales × compounding multiplier
    const loansAdv = Math.round(purchases * profile.loansAdvPct);

    // ── Current Liabilities ──────────────────────────────────────
    const creditors      = Math.round((purchases / 365) * yearCreditorDays);
    const totalOtherCL   = Math.round(sales * profile.otherCLPct);
    const statutoryDues  = Math.round(totalOtherCL * (profile.statutoryDuesPct || 0.4));
    const generalOtherCL = totalOtherCL - statutoryDues;
    const totalCL        = creditors + totalOtherCL + cmltd;

    // ── Balance Sheet — Controlled Cash ──────────────────────────
    //
    // FIX A (runtime):
    //
    // Step 1: assemble liabilities with base unsecured
    let marketUnsecured = baseUnsecured;
    const nonCashAssets = netFA + inventory + totalDebtors + loansAdv;
    let totalLiab = capital + quasiEquity + marketUnsecured + bankBorrowings
                  + closingTermLoan + creditors + totalOtherCL + cmltd;

    // Step 2: if non-cash assets exceed liabilities, inject unsecured (WC gap)
    if (nonCashAssets > totalLiab) {
      const shortfall  = nonCashAssets - totalLiab;
      marketUnsecured += shortfall;
      totalLiab       += shortfall;
    }

    // Step 3: cash is the honest BS plug — never manipulate capital to control it.
    // A business with a large CC limit will naturally show more cash; that's correct.
    // Negative capital is fatal for a bank report; high cash is merely conservative.
    const rawPlug = totalLiab - nonCashAssets;
    let cashBank  = Math.max(rawPlug, 0);
    let totalCA   = inventory + totalDebtors + loansAdv + cashBank;

    // Step 4: CR floor guard — if CR < 1.20 inject via unsecured (capped at 20% TNW)
    // Using 1.20 (not 1.25) as the injection threshold: small CC-only businesses
    // with thin capital legitimately operate at CR 1.20-1.30, and forcing 1.25
    // via unlimited unsecured injection is less realistic than accepting 1.20.
    const crDenom = totalCL + bankBorrowings;
    const crFloor = 1.20;
    if (totalCA / Math.max(crDenom, 1) < crFloor) {
      const targetCA        = Math.ceil(crFloor * crDenom);
      const extraNeeded     = targetCA - totalCA;
      const tnwNow          = capital + quasiEquity;
      const maxUnsecAllowed = Math.round(tnwNow * 0.20);
      const allowed         = Math.min(extraNeeded, Math.max(0, maxUnsecAllowed - marketUnsecured));
      if (allowed > 0) {
        marketUnsecured += allowed;
        cashBank        += allowed;
        totalCA         += allowed;
        totalLiab       += allowed;
      }
    }

    // Step 5: recompute totalLiab with all adjustments settled
    totalLiab = capital + quasiEquity + marketUnsecured + bankBorrowings
              + closingTermLoan + creditors + totalOtherCL + cmltd;

    const totalAssets = netFA + totalCA;
    const reconAdj    = totalAssets - totalLiab;   // ~0 by construction

    // ── Ratios ───────────────────────────────────────────────────
    const currentRatio       = totalCA / Math.max(totalCL + bankBorrowings, 1);
    const currentRatioExBank = totalCA / Math.max(totalCL, 1);
    const baseDebtService    = interest + tlRepayment;

    // FIX D: DSCR = 0 for CC-only; DscrSchedule.tsx renders "N/A" and shows ICR
    const dscr = isCcOnly ? 0 : ebitda / Math.max(baseDebtService, 1);
    const icr  = ebitda / Math.max(interest, 1);

    const tnw              = capital + quasiEquity;
    const deRatio          = (bankBorrowings + closingTermLoan) / Math.max(tnw, 1);
    const totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
    const tolTnw           = totalOutsideLiab / Math.max(tnw, 1);

    // BEP
    const totalFixedCosts = finalIndirectExpenses.reduce((s, exp) => {
      const meta = EXP_LABELS.find(l => l.l === exp.label);
      return s + exp.value * (meta?.fixed ?? 0.5);
    }, 0);
    const variableCosts = purchases + (finalIndExpTotal - totalFixedCosts);
    const contribution  = sales - variableCosts;
    const bepSales      = contribution > 0
      ? (totalFixedCosts + interest + depnYr) / (contribution / sales)
      : sales;

    const facr         = closingTermLoan > 0 ? netFA / Math.max(closingTermLoan, 1) : 0;
    const capacityUtil = clamp(
      (capBand.start + capUtilJitter + (i - 1) * capBand.growth) * 100,
      50, 95
    );

    // Stock sub-categories
    let rawMaterials = 0, stockInProcess = 0, finishedGoods = inventory;
    if (segKey === 'manufacturing') {
      rawMaterials   = Math.round(inventory * 0.60);
      stockInProcess = Math.round(inventory * 0.10);
      finishedGoods  = Math.round(inventory * 0.30);
    } else if (segKey === 'construction') {
      rawMaterials  = Math.round(inventory * 0.70);
      finishedGoods = Math.round(inventory * 0.30);
    }

    projections.push({
      year: i, fyLabel, sales, otherInc, totalRev, openStock, purchases,
      indirectExpenses: finalIndirectExpenses, totalIndExp: finalIndExpTotal,
      closingStock: closeStock, totalCosts, grossProfit,
      gpRatio: (grossProfit / sales) * 100, depnYr, profitBeforeInt,
      interest, profitBeforeTax, tax, netProfit,
      npRatio: (netProfit / sales) * 100, ebitda,
      isCcOnly,   // consumed by DscrSchedule.tsx and RatioAnalysis.tsx
      icr,

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

    openStock       = closeStock;
    openingTermLoan = closingTermLoan;
  }

  return projections;
}
