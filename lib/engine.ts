// lib/engine.ts
import { BusinessProfile } from '../types/cma';

const EXP_LABELS = [
  { k: 'salary', l: 'Salaries & Wages' }, { k: 'rent', l: 'Rent & Rates' },
  { k: 'power', l: 'Power & Fuel' }, { k: 'freight', l: 'Freight / Carriage' },
  { k: 'travel', l: 'Travelling & Conveyance' }, { k: 'telephone', l: 'Telephone / Internet' },
  { k: 'sadar', l: 'Sadar / Local Expenses' }, { k: 'office', l: 'Office / Shop Expenses' },
  { k: 'welfare', l: 'Staff Welfare' }, { k: 'misc', l: 'Miscellaneous Expenses' }
];

export interface ProjectedYear {
  year: number;
  // P&L
  sales: number; otherInc: number; totalRev: number; openStock: number; purchases: number;
  indirectExpenses: { label: string; value: number }[]; totalIndExp: number; closingStock: number;
  totalCosts: number; grossProfit: number; gpRatio: number; depnYr: number;
  profitBeforeInt: number; interest: number; netProfit: number; npRatio: number; ebitda: number;
  
  // Balance Sheet (RBI Form III Granular)
  capital: number;
  unsecured: number;
  bankBorrowings: number;
  creditors: number;
  otherCL: number;
  totalCL: number;
  totalLiab: number; // Total Sources
  
  grossFA: number;
  accDepn: number;
  netFA: number;
  
  inventory: number;
  debtors: number;
  cashBank: number;
  loansAdv: number;
  reconAdj: number;
  totalCA: number;
  totalAssets: number; // Total Applications

  // Ratios
  currentRatio: number; currentRatioExBank: number; dscr: number; deRatio: number;
}

export function generateProjections(loanAmount: number, profile: BusinessProfile, projectionYears: number = 3): ProjectedYear[] {
  const projections: ProjectedYear[] = [];
  
  let sales = loanAmount * profile.salesMult;
  let purchases = sales * profile.purchaseRatio;
  
  // Initial BS Setup
  let capital = loanAmount * profile.capitalMult;
  let grossFA = loanAmount * profile.grossFAMult;
  let accDepn = 0;
  let wdv = grossFA;
  let openStock = 0;

  for (let i = 1; i <= projectionYears; i++) {
    if (i > 1) {
      sales = sales * (1 + profile.revGrowth);
      purchases = purchases * (1 + profile.purGrowth);
    }

    // --- P&L MATH ---
    const otherInc = 0; 
    const totalRev = sales + otherInc;
    const closeStock = (purchases / 12) * profile.stockMonths;
    const indExpTotal = sales * profile.indExpRatio;
    
    const indirectExpenses = EXP_LABELS.map(e => {
      const expRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
      return { label: e.l, value: indExpTotal * expRatio };
    });

    const totalCosts = (openStock + purchases + indExpTotal) - closeStock;
    const grossProfit = sales - totalCosts;
    const depnYr = wdv * profile.depnRate;
    wdv = Math.max(wdv - depnYr, 0);

    const interest = loanAmount * 0.115;
    const profitBeforeInt = grossProfit - depnYr;
    const netProfit = profitBeforeInt - interest;
    const ebitda = netProfit + depnYr + interest;

    // --- BALANCE SHEET MATH (RBI Form III) ---
    const drawings = loanAmount * profile.drawingsMult;
    capital = capital + netProfit - drawings;
    const netWorth = Math.max(capital, 1);
    
    const unsecured = 0;
    const bankBorrowings = loanAmount; // Assuming CC loan stays at limit
    
    const creditors = (purchases / 365) * profile.creditorDays;
    const otherCL = sales * profile.otherCLPct;
    const totalCL = creditors + otherCL; // Non-bank CL

    const inventory = closeStock;
    const debtors = (sales / 365) * profile.debtorDays;
    const cashBank = sales * profile.cashPct;
    const loansAdv = sales * profile.loansAdvPct;
    const totalCA = inventory + debtors + cashBank + loansAdv;

    accDepn += depnYr;
    const netFA = Math.max(grossFA - accDepn, 0);

    // Tallying the Balance Sheet (The "Plug")
    const totalLiabDraft = netWorth + unsecured + bankBorrowings + totalCL;
    const totalAssetsDraft = netFA + totalCA;
    const reconAdj = Math.max(totalLiabDraft - totalAssetsDraft, 0);
    
    const totalAssets = netFA + totalCA + reconAdj;
    const totalLiab = totalAssets;

    projections.push({
      year: i, sales, otherInc, totalRev, openStock, purchases, indirectExpenses, totalIndExp: indExpTotal,
      closingStock: closeStock, totalCosts, grossProfit, gpRatio: (grossProfit/sales)*100, depnYr, profitBeforeInt, 
      interest, netProfit, npRatio: (netProfit/sales)*100, ebitda,
      
      capital: netWorth, unsecured, bankBorrowings, creditors, otherCL, totalCL, totalLiab,
      grossFA, accDepn, netFA, inventory, debtors, cashBank, loansAdv, reconAdj, totalCA, totalAssets,
      
      currentRatio: totalCA / Math.max(totalCL + bankBorrowings, 1),
      currentRatioExBank: totalCA / Math.max(totalCL, 1),
      dscr: ebitda / Math.max(interest, 1),
      deRatio: bankBorrowings / netWorth
    });

    openStock = closeStock;
  }

  return projections;
}