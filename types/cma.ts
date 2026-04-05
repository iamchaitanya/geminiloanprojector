// types/cma.ts

export type BusinessSegment = 'trading' | 'service' | 'manufacturing' | 'construction';

export interface BusinessProfile {
  label: string;
  salesMult: number;
  purchaseRatio: number;
  stockMonths: number;
  debtorDays: number;
  creditorDays: number;
  indExpRatio: number;
  depnRate: number;
  revGrowth: number;
  purGrowth: number;
  expGrowth: number;
  capitalMult: number;
  grossFAMult: number;
  drawingsMult: number;
  wcMargin: number;
  cashPct: number;
  loansAdvPct: number;
  otherCLPct: number;
  exp: {
    salary: number; rent: number; power: number; freight: number;
    travel: number; telephone: number; sadar: number; office: number;
    welfare: number; misc: number;
  };
}

export interface CMAFormData {
  loanAmount: number;
  businessSegment: BusinessSegment;
  businessName: string;
  proprietorName: string;
}