// lib/engine.ts
import { BusinessProfile, ProjectedYear } from '../types/cma';

const EXP_LABELS = [
  { k: 'salary', l: 'Salaries & Wages', fixed: 1.0 }, 
  { k: 'rent', l: 'Rent & Rates', fixed: 1.0 },
  { k: 'power', l: 'Power & Fuel', fixed: 0.3 }, // Mostly variable
  { k: 'freight', l: 'Freight / Carriage', fixed: 0.0 }, // Fully variable
  { k: 'travel', l: 'Travelling & Conveyance', fixed: 0.5 },
  { k: 'telephone', l: 'Telephone / Internet', fixed: 0.8 },
  { k: 'sadar', l: 'Sadar / Local Expenses', fixed: 0.7 }, 
  { k: 'office', l: 'Office / Shop Expenses', fixed: 0.9 },
  { k: 'welfare', l: 'Staff Welfare', fixed: 1.0 }, 
  { k: 'misc', l: 'Miscellaneous Expenses', fixed: 0.5 }
];

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
    
    let totalFixedCosts = 0;
    const indirectExpenses = EXP_LABELS.map(e => {
      const expRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
      const val = indExpTotal * expRatio;
      totalFixedCosts += val * e.fixed; // Aggregating for Break-even
      return { label: e.l, value: val };
    });

    const totalCosts = (openStock + purchases + indExpTotal) - closeStock;
    const grossProfit = sales - totalCosts;
    const depnYr = wdv * profile.depnRate;
    wdv = Math.max(wdv - depnYr, 0);

    const interest = loanAmount * 0.115; // Standard CC Interest
    const profitBeforeInt = grossProfit - depnYr;
    const netProfit = profitBeforeInt - interest;
    const ebitda = netProfit + depnYr + interest;

    // --- GRANULAR BALANCE SHEET MATH ---
    const drawings = loanAmount * profile.drawingsMult;
    capital = capital + netProfit - drawings;
    
    // Split Unsecured into Quasi-Equity (Promoter) and Market Debt
    const rawUnsecured = loanAmount * 0.10; // Assumption if not provided
    const quasiEquity = rawUnsecured * (profile.quasiEquityPct || 0.6);
    const marketUnsecured = rawUnsecured - quasiEquity;
    
    const bankBorrowings = loanAmount; 
    const creditors = (purchases / 365) * profile.creditorDays;
    
    // Split Other CL into Statutory Dues (GST/TDS) and Trade Prov.
    const totalOtherCL = sales * profile.otherCLPct;
    const statutoryDues = totalOtherCL * (profile.statutoryDuesPct || 0.4);
    const generalOtherCL = totalOtherCL - statutoryDues;

    const inventory = closeStock;
    const totalDebtors = (sales / 365) * profile.debtorDays;
    
    // Debtor Aging Logic (Banks exclude >6 months from Drawing Power)
    const debtorsOver6M = totalDebtors * (profile.debtorAgingPct || 0.05);
    const debtorsUnder6M = totalDebtors - debtorsOver6M;

    const cashBank = sales * profile.cashPct;
    const loansAdv = sales * profile.loansAdvPct;
    
    accDepn += depnYr;
    const netFA = Math.max(grossFA - accDepn, 0);

    // Tallying with Reconciliation Plug
    const totalCA = inventory + totalDebtors + cashBank + loansAdv;
    const totalCL = creditors + totalOtherCL;
    
    const totalLiabDraft = capital + rawUnsecured + bankBorrowings + totalCL;
    const totalAssetsDraft = netFA + totalCA;
    const reconAdj = Math.max(totalLiabDraft - totalAssetsDraft, 0);
    
    const totalAssets = netFA + totalCA + reconAdj;
    const totalLiab = totalAssets;

    // --- ADVANCED RATIOS ---
    const tnw = capital + quasiEquity; // Tangible Net Worth includes Quasi-equity
    const totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured;
    
    // Break-even Analysis
    const variableCosts = (purchases + (indExpTotal - totalFixedCosts));
    const contribution = sales - variableCosts;
    const bepSales = (totalFixedCosts + interest + depnYr) / (contribution / sales);

    projections.push({
      year: i, sales, otherInc, totalRev, openStock, purchases, indirectExpenses, totalIndExp: indExpTotal,
      closingStock: closeStock, totalCosts, grossProfit, gpRatio: (grossProfit/sales)*100, depnYr, profitBeforeInt, 
      interest, netProfit, npRatio: (netProfit/sales)*100, ebitda,
      
      capital, quasiEquity, unsecured: marketUnsecured, bankBorrowings, creditors, 
      statutoryDues, otherCL: generalOtherCL, totalCL, totalLiab,
      
      grossFA, accDepn, netFA, inventory, debtors: totalDebtors, debtorsUnder6M, debtorsOver6M,
      cashBank, loansAdv, reconAdj, totalCA, totalAssets,
      
      currentRatio: totalCA / Math.max(totalCL + bankBorrowings, 1),
      currentRatioExBank: totalCA / Math.max(totalCL, 1),
      dscr: ebitda / Math.max(interest, 1),
      deRatio: bankBorrowings / Math.max(tnw, 1),
      tolTnw: totalOutsideLiab / Math.max(tnw, 1),
      bepPercentage: (bepSales / sales) * 100,
      facr: netFA / Math.max(loanAmount * 0.5, 1), // Proxy if no term loan
      capacityUtil: (sales / (profile.installedCap || (sales * 1.25))) * 100
    });

    openStock = closeStock;
  }

  return projections;
}