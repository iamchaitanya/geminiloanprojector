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
  installedCap?: number; 
  utilizedCap?: number;
  quasiEquityPct?: number; 
  debtorAgingPct?: number; 
  statutoryDuesPct?: number; 
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
  profitBeforeInt: number; interest: number; profitBeforeTax: number; tax: number;
  netProfit: number; npRatio: number; ebitda: number;
  
  // Balance Sheet (RBI Form III Granular)
  capital: number;
  quasiEquity: number;   
  unsecured: number;     
  bankBorrowings: number; // Short Term WC (Cash Credit)
  termLoan: number;       // Long Term Debt (strictly excluding current portion)
  cmltd: number;          // Current Maturities of Long Term Debt
  tlRepayment: number;    // Actual principal repayment made during the year
  creditors: number;
  statutoryDues: number; 
  otherCL: number;       
  totalCL: number;
  totalLiab: number; 
  
  grossFA: number;
  accDepn: number;
  netFA: number;
  
  inventory: number;
  debtorsUnder6M: number; 
  debtorsOver6M: number;  
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
  tolTnw: number;        
  bepPercentage: number; 
  facr: number;          
  capacityUtil: number;  
}

export interface CMAFormData {
  loanAmount: number;
  businessSegment: BusinessSegment;
  businessName: string;
  proprietorName: string;
}