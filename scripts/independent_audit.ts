// scripts/independent_audit.ts — TRULY INDEPENDENT adversarial audit
// This script is designed to catch problems, NOT to rubber-stamp the engine.
// Every check here is what a REAL bank credit analyst would flag.

import { generateProjections } from '../lib/engine';
import { getDynamicProfile } from '../lib/profiles';
import type { BusinessSegment } from '../types/cma';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
const r = (n: number) => n.toFixed(2);
const pct = (n: number) => (n * 100).toFixed(1) + '%';

const SEGMENTS: BusinessSegment[] = ['trading', 'service', 'manufacturing', 'construction'];
const AMOUNTS = [50000, 100000, 200000, 300000, 500000, 750000, 1000000];
const SEEDS = [42, 101, 202, 303, 777, 12345, 99999]; // Many seeds for diversity

interface Finding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  detail: string;
}

const findings: Finding[] = [];

function addFinding(severity: Finding['severity'], category: string, detail: string) {
  findings.push({ severity, category, detail });
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  INDEPENDENT ADVERSARIAL AUDIT — CMA Projection Engine');
console.log('  Testing as a real bank credit analyst would examine reports');
console.log('  MSME loans ₹50K–₹10L | Indian PSU Bank Standards');
console.log('═══════════════════════════════════════════════════════════════\n');

// ══════════════════════════════════════════════════════════════════════
// TEST 1: DSCR UNIFORMITY — Is DSCR suspiciously identical?
// A real bank sees 100+ applications. If every single one shows the
// SAME DSCR trajectory, it's obviously machine-generated.
// ══════════════════════════════════════════════════════════════════════

console.log('\n📊 TEST 1: DSCR UNIFORMITY ACROSS ALL SCENARIOS');
console.log('─'.repeat(70));

const allDscrs: number[] = [];
const dscrByYear: { [key: number]: number[] } = { 1: [], 2: [], 3: [] };

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    for (const seed of SEEDS) {
      const p = getDynamicProfile(seg, amt);
      const d = generateProjections(
        { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
        { ...p, label: seg, exp: p.exp }, 3, 2024, { seed, variability: 1 }
      );
      d.forEach(yr => {
        allDscrs.push(yr.dscr);
        dscrByYear[yr.year].push(yr.dscr);
      });
    }
  }
}

const dscrUnique = new Set(allDscrs.map(d => d.toFixed(2)));
const dscrMin = Math.min(...allDscrs);
const dscrMax = Math.max(...allDscrs);
const dscrRange = dscrMax - dscrMin;

console.log(`  Total DSCR observations: ${allDscrs.length}`);
console.log(`  Unique DSCR values (2dp): ${dscrUnique.size}`);
console.log(`  DSCR Range: ${r(dscrMin)} to ${r(dscrMax)} (spread: ${r(dscrRange)})`);
console.log(`  Y1 avg: ${r(dscrByYear[1].reduce((a,b)=>a+b,0)/dscrByYear[1].length)}`);
console.log(`  Y2 avg: ${r(dscrByYear[2].reduce((a,b)=>a+b,0)/dscrByYear[2].length)}`);
console.log(`  Y3 avg: ${r(dscrByYear[3].reduce((a,b)=>a+b,0)/dscrByYear[3].length)}`);

if (dscrUnique.size < 15) {
  addFinding('CRITICAL', 'DSCR_UNIFORMITY',
    `Only ${dscrUnique.size} unique DSCR values across ${allDscrs.length} scenarios. ` +
    `A banker reviewing multiple applications will instantly spot this as machine-generated. ` +
    `Values cluster around ${Array.from(dscrUnique).sort().join(', ')}`);
}
if (dscrRange < 0.5) {
  addFinding('CRITICAL', 'DSCR_RANGE',
    `DSCR spread is only ${r(dscrRange)} across ALL segments/amounts/seeds. ` +
    `Real MSMEs show DSCR from 1.2 to 4.0+. This is artificially clamped.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 2: FACR UNIFORMITY — Is FACR suspiciously capped?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 2: FACR UNIFORMITY — Is it always hitting a cap?');
console.log('─'.repeat(70));

const allFacrs: number[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    d.forEach(yr => allFacrs.push(yr.facr));
  }
}

const facrAt5 = allFacrs.filter(f => f >= 4.99).length;
console.log(`  Total FACR observations: ${allFacrs.length}`);
console.log(`  Values at cap (5.0): ${facrAt5} (${((facrAt5/allFacrs.length)*100).toFixed(0)}%)`);
console.log(`  Unique values: ${new Set(allFacrs.map(f => f.toFixed(2))).size}`);

if (facrAt5 / allFacrs.length > 0.8) {
  addFinding('CRITICAL', 'FACR_CAPPED',
    `${((facrAt5/allFacrs.length)*100).toFixed(0)}% of FACR values are pinned at 5.00. ` +
    `The Math.min(facr, 5.0) cap on line 671 is hit for nearly ALL CC-only scenarios because ` +
    `the fake injected term loan creates a tiny denominator. A banker seeing FACR=5.00 ` +
    `for EVERY applicant will know this is fake.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 3: D:E RATIO — Is it unrealistically LOW?
// Banks WANT D:E = 1.0–2.0. Below 0.5 means "you don't need our money"
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 3: D:E RATIO — Is the borrower over-capitalized?');
console.log('─'.repeat(70));

const deVerdicts = { overCap: 0, lowLev: 0, healthy: 0, high: 0 };
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    for (const seed of SEEDS) {
      const p = getDynamicProfile(seg, amt);
      const d = generateProjections(
        { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
        { ...p, label: seg, exp: p.exp }, 3, 2024, { seed, variability: 1 }
      );
      const deY3 = d[2].deRatio;
      if (deY3 < 0.5) deVerdicts.overCap++;
      else if (deY3 < 0.8) deVerdicts.lowLev++;
      else if (deY3 <= 2.0) deVerdicts.healthy++;
      else deVerdicts.high++;
    }
  }
}

const totalDE = Object.values(deVerdicts).reduce((a,b) => a+b, 0);
console.log(`  Over-capitalized (D:E < 0.5): ${deVerdicts.overCap} (${((deVerdicts.overCap/totalDE)*100).toFixed(0)}%)`);
console.log(`  Low leverage (0.5-0.8):        ${deVerdicts.lowLev} (${((deVerdicts.lowLev/totalDE)*100).toFixed(0)}%)`);
console.log(`  Healthy (0.8-2.0):             ${deVerdicts.healthy} (${((deVerdicts.healthy/totalDE)*100).toFixed(0)}%)`);
console.log(`  High leverage (>2.0):          ${deVerdicts.high} (${((deVerdicts.high/totalDE)*100).toFixed(0)}%)`);

if (deVerdicts.overCap / totalDE > 0.3) {
  addFinding('HIGH', 'DE_TOO_LOW',
    `${((deVerdicts.overCap/totalDE)*100).toFixed(0)}% of Y3 scenarios show D:E < 0.5 (over-capitalized). ` +
    `A banker will ask: "If your equity is 2-3x your debt, why do you need our loan?" ` +
    `Capital is growing too fast because drawings are too low relative to profits.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 4: FAKE TERM LOAN INJECTION — Is phantom debt distorting ratios?
// The engine injects a fake closed loan for CC-only borrowers (lines 342-345)
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 4: PHANTOM TERM LOAN — Does fake debt distort ratios?');
console.log('─'.repeat(70));

const seg = 'trading';
const amt = 500000;
const p = getDynamicProfile(seg, amt);
const d = generateProjections(
  { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
  { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
);

console.log(`  Scenario: Trading, ₹5L CC-only, NO real term loan`);
for (const yr of d) {
  const termLoanOnBS = yr.termLoan + yr.cmltd;  // Total TL including current portion
  console.log(`  Y${yr.year}: TL on BS = ₹${fmt(termLoanOnBS)} | CMLTD = ₹${fmt(yr.cmltd)} | TL Repayment = ₹${fmt(yr.tlRepayment)} | DSCR = ${r(yr.dscr)} | Debt Service Buffer = ₹${fmt(yr.debtServiceBuffer)}`);
}

if (d[0].tlRepayment > 0) {
  addFinding('HIGH', 'PHANTOM_TL',
    `Engine injects fake term loan history for CC-only borrowers. ` +
    `A ₹5L CC-only trader shows ₹${fmt(d[0].tlRepayment)}/yr phantom TL repayment. ` +
    `This phantom debt is used to artificially manage DSCR via the debt service buffer mechanism. ` +
    `DSCR buffer Y1=₹${fmt(d[0].debtServiceBuffer)}, Y2=₹${fmt(d[1].debtServiceBuffer)}, Y3=₹${fmt(d[2].debtServiceBuffer)}. ` +
    `Without this, DSCR would be much higher (ICR of 5-8x instead of ~1.65-1.75).`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 5: LOANS & ADVANCES — Used as a plug to hit CR target?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 5: LOANS & ADVANCES — Is it an unrealistic plug?');
console.log('─'.repeat(70));

const laHighCases: string[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    for (const yr of d) {
      const laPct = (yr.loansAdv / yr.sales) * 100;
      if (laPct > 5) {
        laHighCases.push(`${seg} ₹${fmt(amt)} Y${yr.year}: L&A = ₹${fmt(yr.loansAdv)} (${laPct.toFixed(1)}% of sales)`);
      }
    }
  }
}

console.log(`  Cases where Loans & Advances > 5% of sales: ${laHighCases.length}`);
laHighCases.slice(0, 5).forEach(c => console.log(`    ${c}`));
if (laHighCases.length > 5) console.log(`    ... and ${laHighCases.length - 5} more`);

if (laHighCases.length > 0) {
  addFinding('MEDIUM', 'LA_PLUG',
    `${laHighCases.length} scenarios show Loans & Advances > 5% of sales. ` +
    `The engine uses L&A as a plug to hit CR targets (line 579: missingCA routed to loansAdv). ` +
    `A banker will question why a small MSME has large advances outstanding.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 6: GROSS FA INFLATION — Is Fixed Assets artificially inflated?
// Lines 593-596 and 613-614 add to grossFA to balance BS
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 6: GROSS FA vs SALES RATIO — Are Fixed Assets bloated?');
console.log('─'.repeat(70));

const faBloatCases: string[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    for (const yr of d) {
      const faToSales = yr.grossFA / yr.sales;
      const expectedMax = seg === 'manufacturing' ? 0.40 : seg === 'construction' ? 0.35 : 0.25;
      if (faToSales > expectedMax) {
        faBloatCases.push(`${seg} ₹${fmt(amt)} Y${yr.year}: GrossFA/Sales = ${(faToSales*100).toFixed(1)}% (max ${(expectedMax*100).toFixed(0)}%)`);
      }
    }
  }
}

console.log(`  Cases of bloated Fixed Assets: ${faBloatCases.length}`);
faBloatCases.slice(0, 5).forEach(c => console.log(`    ${c}`));
if (faBloatCases.length > 5) console.log(`    ... and ${faBloatCases.length - 5} more`);

if (faBloatCases.length > 3) {
  addFinding('HIGH', 'FA_BLOAT',
    `${faBloatCases.length} scenarios show Gross FA / Sales exceeding segment norms. ` +
    `The engine inflates Fixed Assets to absorb excess capital (lines 593, 613). ` +
    `A small trading business with ₹25L sales shouldn't have ₹10L+ in fixed assets — ` +
    `a banker would ask "what machinery does a trader need worth that much?"`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 7: CURRENT RATIO UNIFORMITY — Is it always ~1.33?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 7: CR UNIFORMITY — Does every Y1 start at ~1.33?');
console.log('─'.repeat(70));

const crY1Values: number[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    for (const seed of SEEDS) {
      const p = getDynamicProfile(seg, amt);
      const d = generateProjections(
        { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
        { ...p, label: seg, exp: p.exp }, 3, 2024, { seed, variability: 1 }
      );
      crY1Values.push(d[0].currentRatio);
    }
  }
}

const crY1Min = Math.min(...crY1Values);
const crY1Max = Math.max(...crY1Values);
const crY1Spread = crY1Max - crY1Min;
console.log(`  Y1 CR range: ${r(crY1Min)} to ${r(crY1Max)} (spread: ${r(crY1Spread)})`);
console.log(`  Total Y1 observations: ${crY1Values.length}`);

if (crY1Spread < 0.2) {
  addFinding('HIGH', 'CR_UNIFORMITY',
    `Y1 Current Ratio varies by only ${r(crY1Spread)} across ALL scenarios. ` +
    `Range: ${r(crY1Min)} to ${r(crY1Max)}. The engine is solving for a target CR, ` +
    `not computing it organically. Real MSMEs show CR from 0.9 to 2.5 depending on ` +
    `their actual working capital cycle.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 8: CAPITAL GROWTH REALISM — Does equity grow too fast?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 8: CAPITAL GROWTH — Is equity growing unrealistically?');
console.log('─'.repeat(70));

const capGrowthHigh: string[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    const capGrowth = ((d[2].capital / d[0].capital) - 1) * 100;
    if (capGrowth > 40) {
      capGrowthHigh.push(`${seg} ₹${fmt(amt)}: Capital Y1=₹${fmt(d[0].capital)} → Y3=₹${fmt(d[2].capital)} (+${capGrowth.toFixed(0)}%)`);
    }
    // Also check if Drawings / NP ratio is realistic
    const impliedDrawings = d[0].capital + d[0].netProfit - d[1].capital; // Approximate
    const drawingsRatio = impliedDrawings / Math.max(d[0].netProfit, 1);
  }
}

console.log(`  Cases where Capital grows > 40% over 3 years: ${capGrowthHigh.length} of ${SEGMENTS.length * AMOUNTS.length}`);
capGrowthHigh.slice(0, 5).forEach(c => console.log(`    ${c}`));
if (capGrowthHigh.length > 5) console.log(`    ... and ${capGrowthHigh.length - 5} more`);

if (capGrowthHigh.length > SEGMENTS.length * AMOUNTS.length * 0.5) {
  addFinding('MEDIUM', 'CAPITAL_GROWTH',
    `${capGrowthHigh.length}/${SEGMENTS.length * AMOUNTS.length} scenarios show capital growing 40%+ in 3 years. ` +
    `This implies the proprietor is retaining too much profit and not drawing enough. ` +
    `A real MSME proprietor draws 50-70% of net profit for personal expenses.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 9: PURCHASE-TO-SALES RATIO MANIPULATION
// ICR ceiling (line 482-503) absorbs excess EBITDA into purchases,
// distorting the natural purchase/sales relationship
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 9: PURCHASE RATIO STABILITY — Is COGS being manipulated?');
console.log('─'.repeat(70));

for (const seg of ['trading', 'manufacturing'] as BusinessSegment[]) {
  const p = getDynamicProfile(seg, 500000);
  const d = generateProjections(
    { ccLimit: 500000, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
    { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
  );
  console.log(`  ${seg}: Purchase/Sales Y1=${(d[0].purchases/d[0].sales*100).toFixed(1)}% Y2=${(d[1].purchases/d[1].sales*100).toFixed(1)}% Y3=${(d[2].purchases/d[2].sales*100).toFixed(1)}%`);
  console.log(`    GP Margin: Y1=${d[0].gpRatio.toFixed(1)}% Y2=${d[1].gpRatio.toFixed(1)}% Y3=${d[2].gpRatio.toFixed(1)}%`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 10: DEBT SERVICE BUFFER — The invisible padding
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 10: DEBT SERVICE BUFFER — Phantom expenses hiding real DSCR');
console.log('─'.repeat(70));

let bufferUsedCount = 0;
let bufferTotal = 0;
const totalObs = SEGMENTS.length * AMOUNTS.length * 3;

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    d.forEach(yr => {
      if (yr.debtServiceBuffer > 0) {
        bufferUsedCount++;
        bufferTotal += yr.debtServiceBuffer;
      }
    });
  }
}

console.log(`  Debt Service Buffer used: ${bufferUsedCount}/${totalObs} year-observations (${((bufferUsedCount/totalObs)*100).toFixed(0)}%)`);
console.log(`  Total buffer padding: ₹${fmt(bufferTotal)}`);

if (bufferUsedCount / totalObs > 0.5) {
  addFinding('CRITICAL', 'DSB_PADDING',
    `Debt Service Buffer is used in ${((bufferUsedCount/totalObs)*100).toFixed(0)}% of observations. ` +
    `This is a phantom expense that doesn't appear on any financial statement — it only exists ` +
    `to artificially cap DSCR at 1.65-1.75. Real debt service = interest + TL repayment. ` +
    `Adding invisible padding is dishonest financial engineering.`);
}

// ══════════════════════════════════════════════════════════════════════
// TEST 11: BALANCE SHEET IDENTITY — Does Assets = Liabilities?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 11: BALANCE SHEET IDENTITY CHECK');
console.log('─'.repeat(70));

let bsMismatchCount = 0;
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    for (const seed of SEEDS) {
      const p = getDynamicProfile(seg, amt);
      const d = generateProjections(
        { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
        { ...p, label: seg, exp: p.exp }, 3, 2024, { seed, variability: 1 }
      );
      d.forEach(yr => {
        // Manually recompute total liabilities
        const computedLiab = yr.capital + yr.quasiEquity + yr.unsecured + yr.bankBorrowings + yr.termLoan + yr.cmltd + yr.creditors + yr.statutoryDues + yr.otherCL;
        const computedAssets = yr.netFA + yr.totalCA;
        const diff = Math.abs(computedAssets - computedLiab);
        if (diff > 100) { // Allow ₹100 rounding tolerance
          bsMismatchCount++;
        }
      });
    }
  }
}

const bsTotal = SEGMENTS.length * AMOUNTS.length * SEEDS.length * 3;
console.log(`  BS mismatches (>₹100): ${bsMismatchCount} / ${bsTotal}`);

// ══════════════════════════════════════════════════════════════════════
// TEST 12: UNSECURED LOANS — Are they realistic?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 12: UNSECURED LOANS — Are they used as a BS plug?');
console.log('─'.repeat(70));

const unsecuredHighCases: string[] = [];
for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    for (const yr of d) {
      const unsecuredPct = yr.unsecured / Math.max(yr.totalAssets, 1) * 100;
      if (unsecuredPct > 15) {
        unsecuredHighCases.push(`${seg} ₹${fmt(amt)} Y${yr.year}: Unsecured = ₹${fmt(yr.unsecured)} (${unsecuredPct.toFixed(0)}% of assets)`);
      }
    }
  }
}

console.log(`  Cases where Unsecured > 15% of Total Assets: ${unsecuredHighCases.length}`);

// ══════════════════════════════════════════════════════════════════════
// TEST 13: INTER-YEAR CONSISTENCY — Do ratios move naturally?
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n📊 TEST 13: MONOTONIC IMPROVEMENT — Do ratios improve every year?');
console.log('─'.repeat(70));

let alwaysImproving = { np: 0, cr: 0, de: 0, gp: 0 };
let totalScenarios = 0;

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    for (const seed of SEEDS) {
      totalScenarios++;
      const p = getDynamicProfile(seg, amt);
      const d = generateProjections(
        { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
        { ...p, label: seg, exp: p.exp }, 3, 2024, { seed, variability: 1 }
      );
      // Check if NP margin always increases
      if (d[0].npRatio < d[1].npRatio && d[1].npRatio < d[2].npRatio) alwaysImproving.np++;
      if (d[0].currentRatio < d[1].currentRatio && d[1].currentRatio < d[2].currentRatio) alwaysImproving.cr++;
      if (d[0].deRatio > d[1].deRatio && d[1].deRatio > d[2].deRatio) alwaysImproving.de++;
      if (d[0].gpRatio < d[1].gpRatio && d[1].gpRatio < d[2].gpRatio) alwaysImproving.gp++;
    }
  }
}

console.log(`  NP Margin monotonically improving: ${alwaysImproving.np}/${totalScenarios} (${((alwaysImproving.np/totalScenarios)*100).toFixed(0)}%)`);
console.log(`  CR monotonically improving:        ${alwaysImproving.cr}/${totalScenarios} (${((alwaysImproving.cr/totalScenarios)*100).toFixed(0)}%)`);
console.log(`  D:E monotonically improving:       ${alwaysImproving.de}/${totalScenarios} (${((alwaysImproving.de/totalScenarios)*100).toFixed(0)}%)`);
console.log(`  GP Margin monotonically improving:  ${alwaysImproving.gp}/${totalScenarios} (${((alwaysImproving.gp/totalScenarios)*100).toFixed(0)}%)`);

if (alwaysImproving.np / totalScenarios > 0.85 || alwaysImproving.de / totalScenarios > 0.90) {
  addFinding('HIGH', 'MONOTONIC_RATIOS',
    `Ratios improve monotonically too often: NP=${((alwaysImproving.np/totalScenarios)*100).toFixed(0)}%, D:E=${((alwaysImproving.de/totalScenarios)*100).toFixed(0)}%. ` +
    `Real businesses have dips, plateaus, and occasional bad years. ` +
    `NP monotonic in >85% of scenarios suggests the growth model is too smooth.`);
}

// ══════════════════════════════════════════════════════════════════════
// NOTE: The 3 original dishonest test suites (benchmark-suite.ts,
// engine_audit.ts, bank_red_flags.ts) have been DELETED.
// This independent audit is now the sole source of truth.
// ══════════════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════════════
// FINAL REPORT
// ══════════════════════════════════════════════════════════════════════

console.log('\n\n' + '═'.repeat(70));
console.log('  INDEPENDENT AUDIT — FINAL FINDINGS');
console.log('═'.repeat(70));

const critical = findings.filter(f => f.severity === 'CRITICAL');
const high = findings.filter(f => f.severity === 'HIGH');
const medium = findings.filter(f => f.severity === 'MEDIUM');
const low = findings.filter(f => f.severity === 'LOW');

console.log(`\n  🔴 CRITICAL: ${critical.length}`);
critical.forEach(f => {
  console.log(`\n  [${f.category}]`);
  console.log(`  ${f.detail}`);
});

console.log(`\n  🟠 HIGH: ${high.length}`);
high.forEach(f => {
  console.log(`\n  [${f.category}]`);
  console.log(`  ${f.detail}`);
});

console.log(`\n  🟡 MEDIUM: ${medium.length}`);
medium.forEach(f => {
  console.log(`\n  [${f.category}]`);
  console.log(`  ${f.detail}`);
});

console.log(`\n  OVERALL VERDICT: ${critical.length > 0 ? '❌ FAIL — Engine produces artificial figures that a trained banker WILL flag' : '✅ PASS'}`);
console.log('═'.repeat(70));
