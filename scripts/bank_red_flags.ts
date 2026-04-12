// scripts/bank_red_flags.ts — What would a real credit analyst flag?
import { generateProjections } from '../lib/engine';
import { getDynamicProfile } from '../lib/profiles';
import type { BusinessSegment } from '../types/cma';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
const r = (n: number) => n.toFixed(2);

const SEGMENTS: BusinessSegment[] = ['trading', 'service', 'manufacturing', 'construction'];
const AMOUNTS = [100000, 300000, 500000, 1000000];

console.log('===================================================================');
console.log('  BANK CREDIT ANALYST RED FLAG AUDIT');
console.log('  What a real manager would question in these CMA projections');
console.log('===================================================================\n');

// --- RED FLAG 1: DSCR UNIFORMITY ---
console.log('RED FLAG 1: DSCR IS SUSPICIOUSLY IDENTICAL ACROSS ALL SCENARIOS');
console.log('-'.repeat(70));
console.log('  A real business at Rs.1L wouldn\'t have the same DSCR as one at Rs.10L.');
console.log('  Credit analysts compare applications — identical patterns are a red flag.\n');
console.log('  Segment        | Loan    |  DSCR Y1 |  DSCR Y2 |  DSCR Y3');
console.log('  ---------------+---------+----------+----------+----------');

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(d[0].dscr)}x  |   ${r(d[1].dscr)}x  |   ${r(d[2].dscr)}x`);
  }
}

// --- RED FLAG 2: FACR UNIFORMITY ---
console.log('\n\nRED FLAG 2: FACR IS IDENTICAL ACROSS ALL SCENARIOS');
console.log('-'.repeat(70));
console.log('  Segment        | Loan    |  FACR Y1 |  FACR Y2 |  FACR Y3');
console.log('  ---------------+---------+----------+----------+----------');

for (const seg of SEGMENTS) {
  for (const amt of [100000, 500000, 1000000]) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(d[0].facr)}x  |   ${r(d[1].facr)}x  |   ${r(d[2].facr)}x`);
  }
}

// --- RED FLAG 3: OVER-CAPITALIZATION (ROE fix side-effect) ---
console.log('\n\nRED FLAG 3: ROE FIX CAUSED OVER-CAPITALIZATION');
console.log('-'.repeat(70));
console.log('  "If your equity is 3x your debt, why do you need our loan?"');
console.log('  Banks WANT to see D:E = 1.0-2.0, not 0.34.\n');
console.log('  Segment        | Loan    |  D:E Y1  |  D:E Y3  |  Capital Y3   |  Verdict');
console.log('  ---------------+---------+----------+----------+---------------+----------');

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    const deY3 = d[2].deRatio;
    const verdict = deY3 < 0.5 ? 'Over-cap' : deY3 < 0.8 ? 'Low lev' : deY3 <= 2.0 ? 'Good' : 'High';
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(d[0].deRatio)}x  |   ${r(deY3)}x  |  Rs.${fmt(d[2].capital).padStart(10)}  |  ${verdict}`);
  }
}

// --- RED FLAG 4: CR CLIMBING TOO HIGH ---
console.log('\n\nRED FLAG 4: CURRENT RATIO CLIMBING ABOVE 2.0 IN LATER YEARS');
console.log('-'.repeat(70));
console.log('  Banks want CR 1.1-1.5. Above 2.0 = "you don\'t need our money".\n');
console.log('  Segment        | Loan    |  CR Y1   |  CR Y2   |  CR Y3   |  Verdict');
console.log('  ---------------+---------+----------+----------+----------+----------');

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    const crY3 = d[2].currentRatio;
    const verdict = crY3 > 2.5 ? 'Too high' : crY3 > 2.0 ? 'Getting high' : crY3 >= 1.1 ? 'Good' : 'Low';
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(d[0].currentRatio)}x  |   ${r(d[1].currentRatio)}x  |   ${r(crY3)}x  |  ${verdict}`);
  }
}

// --- RED FLAG 5: CAPACITY UTIL IS TOO UNIFORM ---
console.log('\n\nRED FLAG 5: CAPACITY UTILIZATION PATTERN IS IDENTICAL');
console.log('-'.repeat(70));
console.log('  Every business shows ~72% -> ~83% -> ~91% regardless of size/type.\n');
console.log('  Segment        | Loan    |  Cap% Y1 |  Cap% Y2 |  Cap% Y3');
console.log('  ---------------+---------+----------+----------+----------');

for (const seg of SEGMENTS) {
  for (const amt of [100000, 500000, 1000000]) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(d[0].capacityUtil)}%  |   ${r(d[1].capacityUtil)}%  |   ${r(d[2].capacityUtil)}%`);
  }
}

// --- ICR TOO HIGH ---
console.log('\n\nRED FLAG 6: ICR IS UNREALISTICALLY HIGH');
console.log('-'.repeat(70));
console.log('  ICR 10-14x means the business earns 14x its interest cost.');
console.log('  Bank thinks: "Why do you need a loan if you can cover interest 14 times?"\n');
console.log('  Segment        | Loan    |  ICR Y1  |  ICR Y2  |  ICR Y3  |  Verdict');
console.log('  ---------------+---------+----------+----------+----------+----------');

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    const icrVals = d.map(yr => yr.ebitda / Math.max(yr.interest, 1));
    const verdict = icrVals[2] > 10 ? 'Suspiciously high' : icrVals[2] > 5 ? 'Strong' : 'Good';
    console.log(`  ${seg.padEnd(16)}| Rs.${fmt(amt).padStart(7)}|   ${r(icrVals[0])}x  |   ${r(icrVals[1])}x  |   ${r(icrVals[2])}x  |  ${verdict}`);
  }
}

// --- DATA-DRIVEN VERDICT ---
console.log('\n\n' + '='.repeat(70));
console.log('  DATA-DRIVEN VERDICT — Computed from actual test data above');
console.log('='.repeat(70));

// Collect actual ranges across all scenarios
const allDE: number[] = [];
const allCR: number[] = [];
const allDSCR: number[] = [];
const allICR: number[] = [];
let bsErrors = 0;

for (const seg of SEGMENTS) {
  for (const amt of AMOUNTS) {
    const p = getDynamicProfile(seg, amt);
    const d = generateProjections(
      { ccLimit: amt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 5 },
      { ...p, label: seg, exp: p.exp }, 3, 2024, { seed: 42, variability: 1 }
    );
    for (const yr of d) {
      allDE.push(yr.deRatio);
      allCR.push(yr.currentRatio);
      allDSCR.push(yr.dscr);
      allICR.push(yr.ebitda / Math.max(yr.interest, 1));
      if (Math.abs(yr.reconAdj) > 100) bsErrors++;
    }
  }
}

const deMin = Math.min(...allDE).toFixed(2);
const deMax = Math.max(...allDE).toFixed(2);
const crMin = Math.min(...allCR).toFixed(2);
const crMax = Math.max(...allCR).toFixed(2);
const dscrMin = Math.min(...allDSCR).toFixed(2);
const dscrMax = Math.max(...allDSCR).toFixed(2);

const issues: string[] = [];
if (Math.min(...allDE) < 0.4) issues.push(`D:E too low (${deMin}x) — over-capitalized`);
if (Math.max(...allDE) > 2.5) issues.push(`D:E too high (${deMax}x) — over-leveraged`);
if (Math.min(...allCR) < 1.0) issues.push(`CR below 1.0 (${crMin}x) — bank will reject`);
if (Math.max(...allCR) > 2.5) issues.push(`CR too high (${crMax}x) — suggests capital hoarding`);
if (bsErrors > 0) issues.push(`${bsErrors} balance sheet mismatches found`);
if (Math.max(...allDSCR) > 20) issues.push(`DSCR exceeds 20x — unusual`);

console.log(`\n  Measured from ${allDE.length} year-observations across ${SEGMENTS.length} segments × ${AMOUNTS.length} amounts:\n`);
console.log(`  D:E range:   ${deMin}x – ${deMax}x  ${(Math.min(...allDE) >= 0.4 && Math.max(...allDE) <= 2.5) ? '✅' : '⚠️'}`);
console.log(`  CR range:    ${crMin}x – ${crMax}x   ${(Math.min(...allCR) >= 1.0 && Math.max(...allCR) <= 2.0) ? '✅' : '⚠️'}`);
console.log(`  DSCR range:  ${dscrMin}x – ${dscrMax}x  (ICR for CC-only — high is natural)`);
console.log(`  BS errors:   ${bsErrors}  ${bsErrors === 0 ? '✅' : '❌'}`);

if (issues.length === 0) {
  console.log('\n  VERDICT: ✅ Projections pass — figures are within bank-acceptable ranges.');
} else {
  console.log(`\n  VERDICT: ⚠️ ${issues.length} concern(s) found:`);
  issues.forEach(i => console.log(`    - ${i}`));
}
console.log('');
