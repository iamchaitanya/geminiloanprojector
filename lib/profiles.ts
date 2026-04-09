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
  trading: {
    salesMult: [5.0, 5.15],
    purchaseRatio: [0.79, 0.79],
    stockMonths: [1.6, 1.3],
    debtorDays: [28, 34],
    creditorDays: [36, 48],
    indExpRatio: [0.10, 0.095],
    revGrowth: [0.13, 0.16],
    capitalMult: [1.30, 1.55],
    grossFAMult: [0.70, 0.92],
    drawingsMult: [0.42, 0.32],
    cashPct: [0.022, 0.018],
    loansAdvPct: [0.012, 0.018],
    otherCLPct: [0.035, 0.045],
  },
  service: {
    salesMult: [4.40, 5.05],
    purchaseRatio: [0.12, 0.18],
    stockMonths: [0.2, 0.5],
    debtorDays: [28, 38],
    creditorDays: [15, 26],
    indExpRatio: [0.74, 0.69],
    revGrowth: [0.14, 0.18],
    capitalMult: [1.15, 1.40],
    grossFAMult: [0.55, 0.78],
    drawingsMult: [0.45, 0.34],
    cashPct: [0.03, 0.022],
    loansAdvPct: [0.01, 0.014],
    otherCLPct: [0.04, 0.048],
  },
  manufacturing: {
    salesMult: [5.0, 5.15],
    purchaseRatio: [0.74, 0.723],
    stockMonths: [2.2, 1.8],
    debtorDays: [35, 43],
    creditorDays: [34, 45],
    indExpRatio: [0.138, 0.13],
    revGrowth: [0.13, 0.16],
    capitalMult: [1.35, 1.60],
    grossFAMult: [1.10, 1.35],
    drawingsMult: [0.38, 0.30],
    cashPct: [0.018, 0.013],
    loansAdvPct: [0.018, 0.026],
    otherCLPct: [0.034, 0.04],
  },
  construction: {
    salesMult: [5.0, 5.25],
    purchaseRatio: [0.70, 0.68],
    stockMonths: [1.2, 0.9],
    debtorDays: [36, 44],
    creditorDays: [34, 45],
    indExpRatio: [0.18, 0.15],
    revGrowth: [0.13, 0.16],
    capitalMult: [1.25, 1.50],
    grossFAMult: [0.90, 1.15],
    drawingsMult: [0.40, 0.31],
    cashPct: [0.021, 0.016],
    loansAdvPct: [0.022, 0.028],
    otherCLPct: [0.034, 0.04],
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
