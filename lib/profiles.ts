// lib/profiles.ts
import { BusinessProfile, BusinessSegment } from '../types/cma';

export const GOLDEN_PROFILES: Record<BusinessSegment, BusinessProfile> = {
  trading: {
    label: 'Trading',
    salesMult: 5.0, purchaseRatio: 0.81, stockMonths: 1.5,
    debtorDays: 30, creditorDays: 42, indExpRatio: 0.09, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.10, grossFAMult: 0.40, drawingsMult: 0.38,
    wcMargin: 25, cashPct: 0.020, loansAdvPct: 0.015, otherCLPct: 0.040,
    exp: { salary: 0.40, rent: 0.20, power: 0.04, freight: 0.08, travel: 0.06, telephone: 0.04, sadar: 0.06, office: 0.07, welfare: 0.02, misc: 0.03 }
  },
  service: {
    label: 'Services',
    salesMult: 5.5, purchaseRatio: 0.15, stockMonths: 0.5,
    debtorDays: 35, creditorDays: 22, indExpRatio: 0.65, depnRate: 0.15,
    revGrowth: 0.18, purGrowth: 0.12, expGrowth: 0.09,
    capitalMult: 1.00, grossFAMult: 0.40, drawingsMult: 0.42,
    wcMargin: 25, cashPct: 0.025, loansAdvPct: 0.012, otherCLPct: 0.045,
    exp: { salary: 0.55, rent: 0.15, power: 0.03, freight: 0.01, travel: 0.08, telephone: 0.04, sadar: 0.04, office: 0.05, welfare: 0.02, misc: 0.03 }
  },
  manufacturing: {
    label: 'Manufacturing',
    salesMult: 5.0, purchaseRatio: 0.74, stockMonths: 2.0,
    debtorDays: 40, creditorDays: 42, indExpRatio: 0.14, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.20, grossFAMult: 1.00, drawingsMult: 0.35,
    wcMargin: 25, cashPct: 0.015, loansAdvPct: 0.022, otherCLPct: 0.038,
    exp: { salary: 0.35, rent: 0.10, power: 0.18, freight: 0.10, travel: 0.04, telephone: 0.03, sadar: 0.05, office: 0.05, welfare: 0.05, misc: 0.05 }
  },
  construction: {
    label: 'Construction',
    salesMult: 5.2, purchaseRatio: 0.70, stockMonths: 1.0,
    debtorDays: 42, creditorDays: 42, indExpRatio: 0.16, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.10, grossFAMult: 0.80, drawingsMult: 0.36,
    wcMargin: 25, cashPct: 0.018, loansAdvPct: 0.025, otherCLPct: 0.038,
    exp: { salary: 0.40, rent: 0.07, power: 0.10, freight: 0.15, travel: 0.05, telephone: 0.03, sadar: 0.08, office: 0.04, welfare: 0.04, misc: 0.04 }
  }
};