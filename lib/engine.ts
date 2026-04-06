// lib/engine.ts
import { BusinessProfile, ProjectedYear, LoanLimits } from '../types/cma';

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

function organic(val: number): number {
  const v = Math.floor(val);
  if (v <= 1000) return v;
  // If the number is unnaturally round (ends in 00), playfully bump it
  if (v % 100 === 0) {
    const bump = Math.floor(Math.random() * 89) + 11;
    return v + (Math.random() > 0.5 ? bump : -bump);
  }
  return v;
}

function addNoise(baseValue: number, variancePercent: number = 0.02): number {
  const min = 1 - variancePercent;
  const max = 1 + variancePercent;
  const noiseFactor = Math.random() * (max - min) + min;
  return organic(Math.floor(baseValue * noiseFactor));
}

/**
 * Progressive income tax — Old Regime (Proprietorship/Partnership)
 * Slabs: ₹0-2.5L: Nil | ₹2.5-5L: 5% | ₹5-10L: 20% | >₹10L: 30%
 * Plus 4% Health & Education Cess on computed tax.
 * This matches the slab structure used in bank credit appraisals.
 */
function calculateTax(profit: number): number {
  if (profit <= 0) return 0;
  let tax = 0;
  if (profit > 250000)  tax += Math.min(profit - 250000, 250000) * 0.05;  // 5%
  if (profit > 500000)  tax += Math.min(profit - 500000, 500000) * 0.20;  // 20%
  if (profit > 1000000) tax += (profit - 1000000) * 0.30;                 // 30%
  return Math.floor(tax * 1.04); // 4% H&E Cess
}

export function generateProjections(limits: LoanLimits, profile: BusinessProfile, projectionYears: number = 3, baseYear: number = 2024): ProjectedYear[] {
  const projections: ProjectedYear[] = [];
  
  // Use a sensible baseline for random scale if CC Limit is 0
  const baselineVol = (limits.ccLimit || limits.existingCc || limits.termLoan || 500000);
  
  let sales = Math.max(organic(baselineVol * profile.salesMult), baselineVol * 5);
  let purchases = organic(sales * profile.purchaseRatio);
  
  let capital = organic(baselineVol * profile.capitalMult);
  let grossFA = organic(baselineVol * profile.grossFAMult);
  let accDepn = 0;
  let wdv = grossFA;
  
  // Normalize Year 1 opening stock to prevent artificial profit inflation
  let openStock = organic((purchases / 12) * profile.stockMonths); 
  
  // Initialize Bank Debt Split from direct inputs
  let bankBorrowings = limits.isRenewal ? limits.existingCc : 0;
  let openingTermLoan = limits.isRenewal ? limits.existingTl : 0;
  let annualTlRepayment = 0; 
  
  // Year 1 base installed capacity (around 70-75% util) helps ensure increasing trend for next 3 years
  let installedCapacity = profile.installedCap || organic(sales * 1.35); 

  let curDebtorDays = profile.debtorDays;
  let curCreditorDays = profile.creditorDays;
  let curStockMonths = profile.stockMonths;

  for (let i = 1; i <= projectionYears; i++) {
    const projStartYear = baseYear + i;
    const fyLabel = `FY ${projStartYear.toString().slice(-2)}-${(projStartYear + 1).toString().slice(-2)}`;

    if (i === 1) {
      openingTermLoan += limits.termLoan; // Incorporate newly proposed term loan in Year 1
      annualTlRepayment = organic(openingTermLoan / 5); 
    }

    if (i > 1) {
      sales = Math.max(organic(sales * (1 + profile.revGrowth)), baselineVol * 5);
      
      // Healthy business: direct costs reduce slightly as % of sales due to economies of scale (GP Margin increases)
      const costEfficiency = (i - 1) * 0.015; // 1.5% improvement per projected year
      const noisyPurchaseRatio = profile.purchaseRatio * (1 - costEfficiency + (Math.random() * 0.01 - 0.005)); 
      purchases = organic(sales * noisyPurchaseRatio);
      
      // Working capital cycle forcibly improves YoY by strict days
      curDebtorDays = Math.max(15, curDebtorDays - (Math.floor(Math.random() * 3) + 1)); // Drops 1-3 days YoY
      curCreditorDays = Math.min(120, curCreditorDays + (Math.floor(Math.random() * 3) + 1)); // Extends 1-3 days YoY
      curStockMonths = Math.max(0.5, curStockMonths - 0.1); 
    }
    
    // --- DYNAMIC CAPEX LOGIC ---
    let currentUtil = (sales / installedCapacity) * 100;
    if (currentUtil > 95) { // Expand just enough to sustain ~90% util without crashing the trend
      const targetCapacity = Math.floor(sales * 1.10); 
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
    const closeStock = organic((purchases / 12) * curStockMonths);
    
    // Healthy business: better operating leverage (EBITDA / NP Margins increase)
    const opEfficiency = (i - 1) * 0.02; // 2% improvement in exp ratio per year
    const noisyIndExpRatio = profile.indExpRatio * (1 - opEfficiency + (Math.random() * 0.01 - 0.005));
    const indExpTotal = organic(sales * noisyIndExpRatio);
    
    let totalFixedCosts = 0;
    const indirectExpenses = EXP_LABELS.map(e => {
      const expRatio = profile.exp[e.k as keyof typeof profile.exp] as number;
      const val = organic(indExpTotal * expRatio);
      totalFixedCosts += val * e.fixed; 
      return { label: e.l, value: val };
    });

    const cogs = (openStock + purchases) - closeStock;
    const totalCosts = cogs + indExpTotal;
    const grossProfit = sales - cogs;
    const depnYr = organic(wdv * profile.depnRate);
    wdv = Math.max(wdv - depnYr, 0);

    const profitBeforeInt = grossProfit - indExpTotal - depnYr;
    
    // Interest calculated on CC Limit (11.5%) + Term Loan (11.0%)
    // Assume full utilization of proposed limits during the projected year
    const effectiveCcForInt = (i === 1 && !limits.isRenewal) ? limits.ccLimit : (bankBorrowings || limits.ccLimit);
    const ccInterest = organic(effectiveCcForInt * 0.115);
    const tlInterest = organic(openingTermLoan * 0.110);
    const interest = ccInterest + tlInterest;
    
    const profitBeforeTax = profitBeforeInt - interest;
    
    const tax = calculateTax(profitBeforeTax);
    
    const netProfit = profitBeforeTax - tax; 
    const ebitda = netProfit + tax + depnYr + interest;

    // --- TERM LOAN REPAYMENT ---
    const tlRepayment = Math.min(annualTlRepayment, openingTermLoan);
    const closingTermLoan = openingTermLoan - tlRepayment;
    const cmltd = Math.min(annualTlRepayment, closingTermLoan); // Next year's dues

    // --- GRANULAR BALANCE SHEET MATH ---
    // Proprietors in MSME typically withdraw 50–70% of net profit.
    // Using a progressive multiplier: starts at profile base (~38-42%), increases 8% per year.
    // This prevents capital hoarding that inflates cash beyond the loan amount.
    let dynamicDrawingsMult = Math.min(profile.drawingsMult + ((i - 1) * 0.08), 0.75);
    let drawings = organic(Math.max(baselineVol * 0.05, netProfit * dynamicDrawingsMult));
    capital = capital + netProfit - drawings;
    
    const rawUnsecured = baselineVol * 0.10; 
    let quasiEquity = organic(rawUnsecured * (profile.quasiEquityPct || 0.6));
    let marketUnsecured = organic(rawUnsecured - quasiEquity);
    
    let creditors = organic((purchases / 365) * curCreditorDays);
    const totalOtherCL = organic(sales * profile.otherCLPct);
    const statutoryDues = organic(totalOtherCL * (profile.statutoryDuesPct || 0.4));
    const generalOtherCL = totalOtherCL - statutoryDues;
    
    let totalCL = creditors + totalOtherCL + cmltd;

    let inventory = closeStock; 
    let totalDebtors = organic((sales / 365) * curDebtorDays);
    let debtorsOver6M = organic(totalDebtors * (profile.debtorAgingPct || 0.05));
    let debtorsUnder6M = totalDebtors - debtorsOver6M;
    let loansAdv = organic(sales * profile.loansAdvPct);
    
    accDepn += depnYr;
    let netFA = Math.max(grossFA - accDepn, 0);

    let totalAssetsExCash = netFA + inventory + totalDebtors + loansAdv;
    
    // Note: totalLiabDraft relies on closingTermLoan and other non-bank liabilities
    let totalLiabDraft = capital + quasiEquity + marketUnsecured + closingTermLoan + creditors + totalOtherCL;
    
    let minCash = organic(sales * profile.cashPct);
    let targetAssets = totalAssetsExCash + minCash;
    let fundingGap = targetAssets - totalLiabDraft;
    
    let cashBank = minCash;
    
    if (limits.ccLimit > 0) {
        // --- BANK CMA CC UTILIZATION LOGIC ---
        // In CMA projections, the bank expects to see active CC utilization:
        // - Minimum 70% utilization (shows the facility is productive)
        // - If funding gap > CC limit, full utilization + unsecured for shortfall
        // - If funding gap < CC limit, use full limit but show modest surplus as cash
        // - Cash is capped to prevent the "why borrow if you have cash?" red flag
        
        const minUtilization = organic(limits.ccLimit * 0.70);
        
        if (fundingGap >= limits.ccLimit) {
            // Business needs more than CC limit — full utilization + unsecured
            bankBorrowings = limits.ccLimit;
            const shortfall = fundingGap - limits.ccLimit;
            marketUnsecured += shortfall;
            cashBank = minCash;
        } else if (fundingGap > 0) {
            // Business needs less than CC limit — show healthy utilization
            bankBorrowings = Math.max(fundingGap, minUtilization);
            const surplus = bankBorrowings - fundingGap;
            // Surplus from over-utilization shows as modest cash buffer
            cashBank = minCash + surplus;
        } else {
            // No funding gap — business is flush. Still draw at least 70% CC.
            bankBorrowings = minUtilization;
            cashBank = minCash + Math.abs(fundingGap) + (bankBorrowings);
        }
        
        // Hard cap: cash should stay modest — bank red flag if cash > loan amount.
        // Use profile-aligned cap: max of (3× minCash) or (25% of CC limit).
        // Protects capital from erosion below a safe floor.
        const maxCash = Math.max(minCash * 3, limits.ccLimit * 0.25);
        if (cashBank > maxCash) {
            const excess = cashBank - maxCash;
            // Never erode capital below the loan amount (borrower skin-in-game)
            const capitalFloor = Math.max(limits.ccLimit * 0.30, baselineVol * 0.25);
            const drainable = Math.max(0, capital - capitalFloor);
            const actualDrain = Math.min(excess, drainable);
            if (actualDrain > 0) {
                drawings += actualDrain;
                capital  -= actualDrain;
                cashBank -= actualDrain;
            }
        }
    } else {
        // User entered 0 for CC Limit, so we auto-calculate the exact needed amount
        if (fundingGap > 0) {
            bankBorrowings = fundingGap;
            cashBank = minCash;
        } else {
            bankBorrowings = 0;
            cashBank = minCash;
        }
    }

    let totalCA = inventory + totalDebtors + cashBank + loansAdv;
    
    // --- RATIO ENFORCEMENT ENGINE ---
    // (1) Current Ratio >= 1.33 Strategy (Improves YoY): 
    // Current Ratio = totalCA / (bankBorrowings + totalCL)
    // If below target, convert some short-term creditors into long-term unsecured loans
    const targetCR = 1.33 + ((i - 1) * 0.05); // Y1: 1.33, Y2: 1.38, Y3: 1.43
    let crLoops = 0;
    while ((totalCA / Math.max(bankBorrowings + totalCL, 1)) < targetCR && crLoops < 50) {
       const crShift = organic(totalCL * 0.05);
       if (creditors > crShift * 1.5) {
          creditors -= crShift;
          marketUnsecured += crShift;
          totalCL -= crShift;
       } else {
          // If creditors are drained, inject external proprietor cash to beef up Current Assets
          capital += crShift;
          cashBank += crShift;
          totalCA += crShift;
       }
       crLoops++;
    }

    // (2) D:E Ratio <= 2.0 Strategy (Improves YoY):
    // D:E UI Formula: (bankBorrowings + closingTermLoan) / TNW
    // Proprietor injects personal funds — realistic for MSME (bank asks borrower to bring own funds)
    // Cap: injected capital cannot exceed 100% of pre-loop capital (i.e., capital can at most double)
    const targetDE = 2.0 - ((i - 1) * 0.1); // Y1: 2.0, Y2: 1.9, Y3: 1.8
    let deLoops = 0;
    const capitalPreDE = capital;
    while ((bankBorrowings + closingTermLoan) / Math.max(capital + quasiEquity, 1) > targetDE && deLoops < 50) {
       if (capital > capitalPreDE * 2.0) break; // Hard cap: max 2× initial capital via injection
       const capitalInjection = organic(capital * 0.10);
       capital  += capitalInjection;
       cashBank += capitalInjection;
       totalCA  += capitalInjection;
       deLoops++;
    }

    // (3) TOL/TNW <= 3.0 Strategy (Improves YoY):
    // Bank regulatory cap is 3.0
    // Prefer converting unsecured market loans → equity (reclassification) before injecting fresh capital
    // Cap fresh capital injection at 80% of pre-loop capital to stay realistic
    const targetTolTnw = 2.9 - ((i - 1) * 0.1);
    let tolTnwLoops = 0;
    const capitalPreTol = capital;
    let totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
    while ((totalOutsideLiab / Math.max(capital + quasiEquity, 1)) > targetTolTnw && tolTnwLoops < 50) {
        if (marketUnsecured > 5000) {
            // Step 1: reclassify unsecured borrowings as quasi-equity (no cash needed)
            const shift = organic(marketUnsecured * 0.15);
            marketUnsecured -= shift;
            capital         += shift; // treated as proprietor's contribution
        } else {
            // Step 2: fresh proprietor injection (capped)
            if (capital >= capitalPreTol * 1.8) break; // Hard cap
            const shift = organic(capital * 0.10);
            capital         += shift;
            cashBank        += shift;
            totalCA         += shift;
            totalAssetsExCash += shift;
        }
        totalOutsideLiab = totalCL + bankBorrowings + marketUnsecured + (closingTermLoan - cmltd);
        tolTnwLoops++;
    }

    // Recalculate true finals after all adjustments
    const totalAssets = netFA + totalCA;
    const totalLiab = capital + quasiEquity + marketUnsecured + bankBorrowings + closingTermLoan + creditors + totalOtherCL;
    // reconAdj: any residual rounding gap between Assets and Liabilities.
    // A non-zero value flags a balance sheet that doesn't foot — critical for bank submission.
    const reconAdj = Math.abs(totalAssets - totalLiab) < 500 ? 0 : (totalAssets - totalLiab);
    
    const tnw = capital + quasiEquity;
    
    const variableCosts = (purchases + (indExpTotal - totalFixedCosts));
    const contribution = sales - variableCosts;
    const bepSales = (totalFixedCosts + interest + depnYr) / (contribution / sales);
    
    // True DSCR = Operating Cash / Debt Obligations
    let rawDscr = ebitda / Math.max(interest + tlRepayment, 1);
    const dscr = Math.min(rawDscr, 5.0); // Capped at 5.0 to avoid unrealistic explosive metrics

    // FACR scales organically even if Term Loan is 0
    const effectiveTLForFacr = closingTermLoan > 0 ? closingTermLoan : organic(netFA / (1.5 + i * 0.15));
    let rawFacr = netFA / effectiveTLForFacr;
    const facr = Math.min(rawFacr, 5.0);

    projections.push({
      year: i, fyLabel, sales, otherInc, totalRev, openStock, purchases, indirectExpenses, totalIndExp: indExpTotal,
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
      facr: facr, 
      capacityUtil: currentUtil
    });

    openStock = closeStock;
    openingTermLoan = closingTermLoan; // Carry remaining loan to next year
  }

  return projections;
}