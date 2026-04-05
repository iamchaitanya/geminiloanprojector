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
  // Professional Granularity Fields
  installedCap?: number; 
  utilizedCap?: number;
  quasiEquityPct?: number; // % of unsecured loans treated as quasi-equity
  debtorAgingPct?: number; // % of debtors > 6 months
  statutoryDuesPct?: number; // % of other CL that is statutory (GST/PF/TDS)
  exp: {
    salary: number; rent: number; power: number; freight: number;
    travel: number; telephone: number; sadar: number; office: number;
    welfare: number; misc: number;
  };
}

export interface ProjectedYear {
  year: number;
  // P&L
  sales: number; otherInc: number; totalRev: number; openStock: number; purchases: number;
  indirectExpenses: { label: string; value: number }[]; totalIndExp: number; closingStock: number;
  totalCosts: number; grossProfit: number; gpRatio: number; depnYr: number;
  profitBeforeInt: number; interest: number; netProfit: number; npRatio: number; ebitda: number;
  
  // Balance Sheet (RBI Form III Granular)
  capital: number;
  quasiEquity: number;   // Subordinated promoter loans
  unsecured: number;     // External market loans
  bankBorrowings: number;
  creditors: number;
  statutoryDues: number; // GST/PF/TDS breakup
  otherCL: number;       // General trade liabilities
  totalCL: number;
  totalLiab: number; 
  
  grossFA: number;
  accDepn: number;
  netFA: number;
  
  inventory: number;
  debtorsUnder6M: number; // Liquid receivables
  debtorsOver6M: number;  // Non-liquid receivables (excluded from DP)
  debtors: number;
  cashBank: number;
  loansAdv: number;
  reconAdj: number;
  totalCA: number;
  totalAssets: number;

  // Ratios & Analytics
  currentRatio: number;
  currentRatioExBank: number;
  dscr: number;
  deRatio: number;
  tolTnw: number;        // Total Outside Liabilities / Tangible Net Worth
  bepPercentage: number; // Break-even point as % of sales
  facr: number;          // Fixed Asset Coverage Ratio
  capacityUtil: number;  // % of installed capacity utilized
}

export interface CMAFormData {
  loanAmount: number;
  businessSegment: BusinessSegment;
  businessName: string;
  proprietorName: string;
}