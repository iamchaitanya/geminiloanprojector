// lib/profiles.ts
import { BusinessProfile, BusinessSegment } from '../types/cma';

export const GOLDEN_PROFILES: Record<BusinessSegment, BusinessProfile> = {
  trading: {
    label: 'Trading',
    salesMult: 5.0, purchaseRatio: 0.81, stockMonths: 1.5,
    debtorDays: 30, creditorDays: 42, indExpRatio: 0.09, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.40, grossFAMult: 0.80, drawingsMult: 0.38,
    wcMargin: 25, cashPct: 0.020, loansAdvPct: 0.015, otherCLPct: 0.040,
    exp: { salary: 0.48, rent: 0.25, power: 0.03, freight: 0.05, travel: 0.04, telephone: 0.03, sadar: 0.04, office: 0.04, welfare: 0.02, misc: 0.02 }
  },
  service: {
    label: 'Services',
    salesMult: 5.5, purchaseRatio: 0.15, stockMonths: 0.5,
    debtorDays: 35, creditorDays: 22, indExpRatio: 0.65, depnRate: 0.15,
    revGrowth: 0.18, purGrowth: 0.12, expGrowth: 0.09,
    capitalMult: 1.30, grossFAMult: 0.65, drawingsMult: 0.42,
    wcMargin: 25, cashPct: 0.025, loansAdvPct: 0.012, otherCLPct: 0.045,
    exp: { salary: 0.58, rent: 0.18, power: 0.02, freight: 0.01, travel: 0.06, telephone: 0.03, sadar: 0.03, office: 0.04, welfare: 0.02, misc: 0.03 }
  },
  manufacturing: {
    label: 'Manufacturing',
    salesMult: 5.0, purchaseRatio: 0.74, stockMonths: 2.0,
    debtorDays: 40, creditorDays: 42, indExpRatio: 0.14, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.50, grossFAMult: 1.20, drawingsMult: 0.35,
    wcMargin: 25, cashPct: 0.015, loansAdvPct: 0.022, otherCLPct: 0.038,
    exp: { salary: 0.40, rent: 0.12, power: 0.16, freight: 0.08, travel: 0.04, telephone: 0.03, sadar: 0.04, office: 0.04, welfare: 0.04, misc: 0.05 }
  },
  construction: {
    label: 'Construction',
    salesMult: 5.2, purchaseRatio: 0.70, stockMonths: 1.0,
    debtorDays: 42, creditorDays: 42, indExpRatio: 0.16, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.40, grossFAMult: 1.00, drawingsMult: 0.36,
    wcMargin: 25, cashPct: 0.018, loansAdvPct: 0.025, otherCLPct: 0.038,
    exp: { salary: 0.45, rent: 0.10, power: 0.09, freight: 0.12, travel: 0.04, telephone: 0.03, sadar: 0.06, office: 0.04, welfare: 0.04, misc: 0.03 }
  }
};

const LOAN_AMOUNT_MIN = 50_000;
const LOAN_AMOUNT_MAX = 1_000_000;

type DynamicProfileCurve = {
  salesMult: [number, number];
  purchaseRatio: [number, number];
  stockMonths: [number, number];
  debtorDays: [number, number];
  creditorDays: [number, number];
  indExpRatio: [number, number];
  revGrowth: [number, number];
  capitalMult: [number, number];
  grossFAMult: [number, number];
  drawingsMult: [number, number];
  cashPct: [number, number];
  loansAdvPct: [number, number];
  otherCLPct: [number, number];
};

const PROFILE_CURVES: Record<BusinessSegment, DynamicProfileCurve> = {
  // Ranges are intentionally wide: small-ticket borrowers get high indExpRatio, long debtor days,
  // lower growth; large-ticket borrowers get leaner expense structures and faster growth.
  // This ensures projections are visibly different across the ₹50K–₹10L loan spectrum.
  trading: {
    salesMult:    [4.88, 5.28],        // ~8% spread vs previous 3%
    purchaseRatio:[0.800, 0.775],      // kept tight — GP floor protection (min 18%)
    stockMonths:  [1.8, 1.15],         // small traders carry more stock
    debtorDays:   [22, 40],            // was [28, 34] — now 18-day spread
    creditorDays: [30, 55],            // was [36, 48] — now 25-day spread
    indExpRatio:  [0.115, 0.080],      // was [0.100, 0.095] — now 35% spread
    revGrowth:    [0.12, 0.19],        // small traders grow faster from low base
    capitalMult:  [1.20, 1.68],
    grossFAMult:  [0.60, 1.02],
    drawingsMult: [0.50, 0.27],        // higher drawings at small scale (personal use)
    cashPct:      [0.028, 0.014],
    loansAdvPct:  [0.010, 0.024],
    otherCLPct:   [0.030, 0.054],
  },
  service: {
    salesMult:    [4.20, 5.20],
    purchaseRatio:[0.10, 0.175],       // was 0.20 max — caps service COGS so GP stays ≥ 80%
    stockMonths:  [0.12, 0.55],
    debtorDays:   [20, 46],
    creditorDays: [10, 32],
    indExpRatio:  [0.80, 0.62],
    revGrowth:    [0.12, 0.24],
    capitalMult:  [1.08, 1.55],
    grossFAMult:  [0.44, 0.92],
    drawingsMult: [0.54, 0.27],
    cashPct:      [0.038, 0.016],
    loansAdvPct:  [0.008, 0.022],
    otherCLPct:   [0.032, 0.058],
  },
  manufacturing: {
    salesMult:    [4.85, 5.28],
    purchaseRatio:[0.755, 0.715],      // slightly tighter at large end — GP ceiling (31%) protection
    stockMonths:  [1.95, 1.55],        // was 2.1 at small end — clears Quick Ratio ≥ 0.72 edge case
    debtorDays:   [28, 52],
    creditorDays: [26, 56],
    indExpRatio:  [0.158, 0.108],
    revGrowth:    [0.11, 0.19],
    capitalMult:  [1.22, 1.72],
    grossFAMult:  [0.95, 1.58],
    drawingsMult: [0.46, 0.23],
    cashPct:      [0.026, 0.010],
    loansAdvPct:  [0.014, 0.034],
    otherCLPct:   [0.026, 0.050],
  },
  construction: {
    salesMult:    [4.82, 5.48],
    purchaseRatio:[0.710, 0.672],      // was 0.662 — GP ceiling (35%) protection for large ticket
    stockMonths:  [1.45, 0.78],
    debtorDays:   [26, 54],
    creditorDays: [25, 56],
    indExpRatio:  [0.205, 0.132],
    revGrowth:    [0.11, 0.19],
    capitalMult:  [1.12, 1.65],
    grossFAMult:  [0.76, 1.38],
    drawingsMult: [0.48, 0.25],
    cashPct:      [0.028, 0.012],
    loansAdvPct:  [0.016, 0.038],
    otherCLPct:   [0.026, 0.050],
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function loanMix(loanAmount: number) {
  return clamp((loanAmount - LOAN_AMOUNT_MIN) / (LOAN_AMOUNT_MAX - LOAN_AMOUNT_MIN), 0, 1);
}

export function getDynamicProfile(segment: BusinessSegment, loanAmount: number): BusinessProfile {
  const base = GOLDEN_PROFILES[segment];
  const curve = PROFILE_CURVES[segment];
  const t = loanMix(loanAmount || LOAN_AMOUNT_MIN);

  return {
    ...base,
    salesMult: lerp(curve.salesMult[0], curve.salesMult[1], t),
    purchaseRatio: lerp(curve.purchaseRatio[0], curve.purchaseRatio[1], t),
    stockMonths: lerp(curve.stockMonths[0], curve.stockMonths[1], t),
    debtorDays: Math.round(lerp(curve.debtorDays[0], curve.debtorDays[1], t)),
    creditorDays: Math.round(lerp(curve.creditorDays[0], curve.creditorDays[1], t)),
    indExpRatio: lerp(curve.indExpRatio[0], curve.indExpRatio[1], t),
    revGrowth: lerp(curve.revGrowth[0], curve.revGrowth[1], t),
    capitalMult: lerp(curve.capitalMult[0], curve.capitalMult[1], t),
    grossFAMult: lerp(curve.grossFAMult[0], curve.grossFAMult[1], t),
    drawingsMult: lerp(curve.drawingsMult[0], curve.drawingsMult[1], t),
    cashPct: lerp(curve.cashPct[0], curve.cashPct[1], t),
    loansAdvPct: lerp(curve.loansAdvPct[0], curve.loansAdvPct[1], t),
    otherCLPct: lerp(curve.otherCLPct[0], curve.otherCLPct[1], t),
  };
}
