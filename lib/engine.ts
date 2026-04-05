// lib/engine.ts
import { BusinessProfile, ProjectedYear } from '../types/cma';

export type { ProjectedYear };

const EXP_LABELS = [
  { k: 'salary', l: 'Salaries & Wages', fixed: 1.0 }, 
  { k: 'rent', l: 'Rent & Rates', fixed: 1.0 },
  { k: 'power', l: 'Power & Fuel', fixed: 0.3 }, 
  { k: 'freight', l: 'Freight / Carriage', fixed: 0.0 }, 
  { k: 'travel', l: 'Travelling & Conveyance', fixed: 0.5 },
  { k: 'telephone', l: 'Telephone / Internet', fixed: 0.8 },
  { k: 'sadar', l: 'Sadar / Local Expenses', fixed: 0.7 }, 
  { k: 'office', l: 'Office / Shop Expenses', fixed: 0.9 },
  { k: 'welfare', l: 'Staff Welfare', fixed: 1.0 }, 
  { k: 'misc', l: 'Miscellaneous Expenses', fixed: 0.5 }
];

function addNoise(baseValue: number, variancePercent: number = 0.02): number {
  const min = 1 - variancePercent;
  const max = 1 + variancePercent;
  const noiseFactor = Math.random() * (max - min) + min;
  return Math.floor(baseValue * noiseFactor);
}

export function generateProjections(loanAmount: number, profile: BusinessProfile, projectionYears: number = 3): ProjectedYear[] {
  const projections: ProjectedYear[] = [];
  
  let sales = addNoise(loanAmount * profile.salesMult, 0.02);
  let purchases = addNoise(sales * profile.purchaseRatio, 0.015);
  
  let capital = loanAmount * profile.capitalMult;
  let grossFA = loanAmount * profile.grossFAMult;
  let accDepn = 0;
  let wdv = grossFA;
  let openStock = 0;
  
  // Initialize Bank Debt Split (60% Working Capital Limit, 40% Term Loan)
  let bankBorrowings = Math.floor(loanAmount * 0.60);
  let openingTermLoan = loanAmount - bankBorrowings;
  const annualTlRepayment = Math.floor(openingTermLoan / 5); // 5-year door-to-door tenor
  
  let installedCapacity = profile.installedCap || Math.floor(sales * 1.25); 

  for (let i = 1; i <= projectionYears; i++) {
    if (i > 1) {
      sales = addNoise(sales * (1 + profile.revGrowth), 0.025);
      const noisyPurchaseRatio = profile.purchaseRatio * (1 + (Math.random() * 0.02 - 0.01)); 
      purchases = Math.floor(sales * noisyPurchaseRatio);
    }
    
    // --- DYNAMIC CAPEX LOGIC ---
    let currentUtil = (sales / installedCapacity) * 100;
    if (currentUtil > 90) { 
      const targetCapacity = Math.floor(sales * 1.25); 
      const growthRatio = (targetCapacity - installedCapacity) / installedCapacity;
      const capexAmount = Math.floor(grossFA * growthRatio);
      
      grossFA += capexAmount;
      wdv += capexAmount; 
      installedCapacity = targetCapacity;
      currentUtil = (sales / installedCapacity) * 100; 
    }

    // --- P&L MATH ---
    const otherInc = 0; 
    const totalRev = sales + otherInc;
    const closeStock = Math.floor((purchases / 12) * profile.stockMonths);
    
    const noisyIndExpRatio = profile.indExpRatio * (1 + (Math.random() * 0.03 - 0.015));
    const indExpTotal = Math.floor(sales * noisyIndExpRatio);
    
    let totalFixedCosts = 0;
    const indirectExpenses = EXP_LABELS.map(e => {
      const expRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
      const val = Math.floor(indExpTotal * expRatio);
      totalFixedCosts += val * e.fixed; 
      return { label: e.l, value: val };
    });

    const totalCosts = (openStock + purchases + indExpTotal) - closeStock;
    const grossProfit = sales - totalCosts;
    const depnYr = Math.floor(wdv * profile.depnRate);
    wdv = Math.max(wdv - depnYr, 0);

    const profitBeforeInt = grossProfit - depnYr;
    
    // Interest calculated on OPENING CC Limit (11.5%) + OPENING Term Loan (11.0%)
    const ccInterest = Math.floor(bankBorrowings * 0.115);
    const tlInterest = Math.floor(openingTermLoan * 0.110);
    const interest = ccInterest + tlInterest; 
    
    const profitBeforeTax = profitBeforeInt - interest;
    
    let tax = 0;
    if (profitBeforeTax > 1200000) {
        tax = Math.floor((profitBeforeTax - 1200000) * 0.30);
    }
    
    const netProfit = profitBeforeTax - tax; 
    const ebitda = netProfit + tax + depnYr + interest;

    // --- TERM LOAN REPAYMENT ---
    const tlRepayment = Math.min(annualTlRepayment, openingTermLoan);
    const closingTermLoan = openingTermLoan - tlRepayment;
    const cmltd = Math.min(annualTlRepayment, closingTermLoan); // Next year's dues

    // --- GRANULAR BALANCE SHEET MATH ---
    const drawings = Math.floor(Math.max(loanAmount * 0.05, netProfit * profile.drawingsMult));
    capital = capital + netProfit - drawings;
    
    const rawUnsecured = loanAmount * 0.10; 
    const quasiEquity = Math.floor(rawUnsecured * (profile.quasiEquityPct || 0.6));
    const marketUnsecured = Math.floor(rawUnsecured - quasiEquity);
    
    const creditors = Math.floor((purchases / 365) * profile.creditorDays);
    const totalOtherCL = Math.floor(sales * profile.otherCLPct);
    const statutoryDues = Math.floor(totalOtherCL * (profile.statutoryDuesPct || 0.4));
    const generalOtherCL = totalOtherCL - statutoryDues;
    
    // Total Current Liabilities must now include CMLTD
    const totalCL = creditors + totalOtherCL + cmltd;

    const inventory = closeStock; 
    const totalDebtors = Math.floor((sales / 365) * profile.debtorDays);
    const debtorsOver6M = Math.floor(totalDebtors * (profile.debtorAgingPct || 0.05));
    const debtorsUnder6M = totalDebtors - debtorsOver6M;
    const loansAdv = Math.floor(sales * profile.loansAdvPct);
    
    accDepn += depnYr;
    const netFA = Math.max(grossFA - accDepn, 0);

    // --- TRUE SOURCES & APPLICATIONS BALANCING ---
    const totalAssetsExCash = netFA + inventory + totalDebtors + loansAdv;
    
    // Note: totalLiabDraft relies on closingTermLoan and other non-bank liabilities
    const totalLiabDraft = capital + quasiEquity + marketUnsecured + closingTermLoan + creditors + totalOtherCL;
    
    const minCash = Math.floor(sales * profile.cashPct);
    const targetAssets = totalAssetsExCash + minCash;
    
    const fundingGap = targetAssets - totalLiabDraft;
    
    let cashBank = minCash;
    if (fundingGap > 0) {
        // We utilize the CC Limit to plug the gap (fund working capital/repayments)
        bankBorrowings = fundingGap;
    } else {
        // Surplus cash generated
        bankBorrowings = 0;
        cashBank += Math.abs(fundingGap);
    }

    const totalCA = inventory + totalDebtors + cashBank + loansAdv;
    const totalAssets = netFA + totalCA;
    const totalLiab = capital + quasiEquity + marketUnsecured + bankBorrowings + closingTermLoan + creditors + totalOtherCL;
    const reconAdj = 0; 

    // --- ADVANCED RATIOS ---
    const tnw = capital + quasiEquity; 
    // totalOutsideLiab includes strictly non-current TL + CC Limit + CMLTD (inside totalCL)
    const totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
    
    const variableCosts = (purchases + (indExpTotal - totalFixedCosts));
    const contribution = sales - variableCosts;
    const bepSales = (totalFixedCosts + interest + depnYr) / (contribution / sales);
    
    // True DSCR = Operating Cash / Debt Obligations
    const dscr = ebitda / Math.max(interest + tlRepayment, 1);

    projections.push({
      year: i, sales, otherInc, totalRev, openStock, purchases, indirectExpenses, totalIndExp: indExpTotal,
      closingStock: closeStock, totalCosts, grossProfit, gpRatio: (grossProfit/sales)*100, depnYr, profitBeforeInt, 
      interest, profitBeforeTax, tax, netProfit, npRatio: (netProfit/sales)*100, ebitda,
      
      capital, quasiEquity, unsecured: marketUnsecured, bankBorrowings, 
      termLoan: closingTermLoan - cmltd, // Strict Long Term portion for UI
      cmltd, tlRepayment,
      creditors, statutoryDues, otherCL: generalOtherCL, totalCL, totalLiab,
      
      grossFA, accDepn, netFA, inventory, debtors: totalDebtors, debtorsUnder6M, debtorsOver6M,
      cashBank, loansAdv, reconAdj, totalCA, totalAssets,
      
      currentRatio: totalCA / Math.max(totalCL + bankBorrowings, 1),
      currentRatioExBank: totalCA / Math.max(totalCL, 1),
      dscr,
      deRatio: (bankBorrowings + closingTermLoan) / Math.max(tnw, 1),
      tolTnw: totalOutsideLiab / Math.max(tnw, 1),
      bepPercentage: (bepSales / sales) * 100,
      facr: netFA / Math.max(closingTermLoan, 1), 
      capacityUtil: currentUtil
    });

    openStock = closeStock;
    openingTermLoan = closingTermLoan; // Carry remaining loan to next year
  }

  return projections;
}