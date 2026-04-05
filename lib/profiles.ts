// lib/profiles.ts
import { BusinessProfile, BusinessSegment } from '../types/cma';

export const GOLDEN_PROFILES: Record<BusinessSegment, BusinessProfile> = {
  trading: {
    label: 'Trading',
    salesMult: 5.0, purchaseRatio: 0.88, stockMonths: 1.5,
    debtorDays: 30, creditorDays: 42, indExpRatio: 0.08, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.00, grossFAMult: 0.50, drawingsMult: 0.45,
    wcMargin: 25, cashPct: 0.020, loansAdvPct: 0.015, otherCLPct: 0.040,
    exp: { salary: 0.32, rent: 0.18, power: 0.04, freight: 0.12, travel: 0.06, telephone: 0.03, sadar: 0.08, office: 0.07, welfare: 0.04, misc: 0.06 }
  },
  service: {
    label: 'Services',
    salesMult: 5.0, purchaseRatio: 0.15, stockMonths: 0.5,
    debtorDays: 35, creditorDays: 20, indExpRatio: 0.65, depnRate: 0.15,
    revGrowth: 0.18, purGrowth: 0.12, expGrowth: 0.10,
    capitalMult: 1.20, grossFAMult: 0.60, drawingsMult: 0.40,
    wcMargin: 25, cashPct: 0.030, loansAdvPct: 0.012, otherCLPct: 0.045,
    exp: { salary: 0.55, rent: 0.15, power: 0.03, freight: 0.01, travel: 0.08, telephone: 0.04, sadar: 0.04, office: 0.05, welfare: 0.02, misc: 0.03 }
  },
  manufacturing: {
    label: 'Manufacturing',
    salesMult: 5.5, purchaseRatio: 0.73, stockMonths: 2.0,
    debtorDays: 45, creditorDays: 45, indExpRatio: 0.11, depnRate: 0.15,
    revGrowth: 0.12, purGrowth: 0.10, expGrowth: 0.08,
    capitalMult: 0.85, grossFAMult: 1.20, drawingsMult: 0.30,
    wcMargin: 25, cashPct: 0.015, loansAdvPct: 0.020, otherCLPct: 0.035,
    exp: { salary: 0.35, rent: 0.08, power: 0.18, freight: 0.10, travel: 0.04, telephone: 0.02, sadar: 0.04, office: 0.03, welfare: 0.06, misc: 0.10 }
  },
  construction: {
    label: 'Construction',
    salesMult: 5.2, purchaseRatio: 0.70, stockMonths: 1.0,
    debtorDays: 50, creditorDays: 60, indExpRatio: 0.12, depnRate: 0.15,
    revGrowth: 0.15, purGrowth: 0.12, expGrowth: 0.08,
    capitalMult: 1.10, grossFAMult: 0.90, drawingsMult: 0.35,
    wcMargin: 25, cashPct: 0.025, loansAdvPct: 0.030, otherCLPct: 0.040,
    exp: { salary: 0.40, rent: 0.05, power: 0.08, freight: 0.15, travel: 0.06, telephone: 0.02, sadar: 0.08, office: 0.04, welfare: 0.06, misc: 0.06 }
  }
};