// scripts/engine_audit.ts — Stress-test engine across loan amounts & segments
import { generateProjections } from '../lib/engine';
import { getDynamicProfile } from '../lib/profiles';
import type { BusinessSegment } from '../types/cma';

const SEGMENTS: BusinessSegment[] = ['trading', 'service', 'manufacturing', 'construction'];
const LOAN_AMOUNTS = [50000, 100000, 200000, 300000, 500000, 750000, 1000000];

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
const pct = (n: number) => n.toFixed(1) + '%';
const ratio = (n: number) => n.toFixed(2) + '×';

const BASE_BENCHMARKS = {
  gpMargin: { min: 5, max: 50, label: 'GP%' },
  npMargin: { min: 3, max: 20, label: 'NP%' },
  ebitdaMargin: { min: 5, max: 25, label: 'EBITDA%' },
  currentRatio: { min: 1.1, max: 2.5, label: 'CR(incl)' },
  currentRatioExBank: { min: 1.33, max: 6.0, label: 'CR(excl)' },
  deRatio: { min: 0, max: 2.5, label: 'D:E' },
  tolTnw: { min: 0, max: 3.5, label: 'TOL/TNW' },
  dscr: { min: 1.2, max: 10.0, label: 'DSCR' },  // CC-only DSCR is naturally 4-8× (no TL repayment)
  icr: { min: 1.5, max: 15, label: 'ICR' },
  facr: { min: 1.0, max: 5.5, label: 'FACR' },
  roe: { min: 5, max: 80, label: 'ROE%' },
  roa: { min: 3, max: 40, label: 'ROA%' },
  bep: { min: 30, max: 90, label: 'BEP%' },
  invTurnover: { min: 2, max: 15, label: 'InvTurn' },
  wcTurnover: { min: 2, max: 12, label: 'WCTurn' },
  capUtil: { min: 50, max: 100, label: 'CapUtil%' },
  debtorDays: { min: 10, max: 90, label: 'DebtDays' },
  creditorDays: { min: 10, max: 120, label: 'CredDays' },
};

// Service businesses have structurally different benchmarks:
// - GP% 75-95% (no COGS, only direct labor costs)
// - Inventory turnover 15-30× (near-zero stock)
// - CR(excl) can be higher (fewer trade creditors)
const SEGMENT_OVERRIDES: Partial<Record<BusinessSegment, Partial<Record<string, { min: number; max: number }>>>> = {
  service: {
    gpMargin: { min: 60, max: 95 },
    currentRatioExBank: { min: 1.33, max: 15.0 },
    invTurnover: { min: 2, max: 30 },
  },
};

function getBenchmarks(segment: BusinessSegment) {
  const overrides = SEGMENT_OVERRIDES[segment] || {};
  const result: Record<string, { min: number; max: number; label: string }> = {};
  for (const [key, bench] of Object.entries(BASE_BENCHMARKS)) {
    const override = overrides[key];
    result[key] = override ? { ...bench, ...override } : bench;
  }
  return result;
}

interface RatioResult {
  value: number;
  flag: '✅' | '⚠️' | '🔴';
}

function checkRatio(value: number, min: number, max: number): RatioResult {
  if (value >= min && value <= max) return { value, flag: '✅' };
  if (value < min * 0.7 || value > max * 1.5) return { value, flag: '🔴' };
  return { value, flag: '⚠️' };
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  CMA ENGINE DIAGNOSTIC — All Segments × All Loan Amounts');
console.log('  Seed: 42 (deterministic) | 3 Projection Years');
console.log('═══════════════════════════════════════════════════════════════════\n');

let totalTests = 0;
let passCount = 0;
let warnCount = 0;
let failCount = 0;

for (const segment of SEGMENTS) {
  console.log(`\n${'▓'.repeat(70)}`);
  console.log(`  SEGMENT: ${segment.toUpperCase()}`);
  console.log(`${'▓'.repeat(70)}\n`);

  for (const loanAmt of LOAN_AMOUNTS) {
    const profile = getDynamicProfile(segment, loanAmt);
    const limits = { ccLimit: loanAmt, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0, ccIntRate: 11.5, tlIntRate: 12, tenure: 60 };
    const data = generateProjections(limits, {
      ...profile,
      label: segment,
      exp: profile.exp,
    }, 3, 2024, { seed: 42, variability: 1 });

    console.log(`  ┌─ Loan: ₹${fmt(loanAmt)} ──────────────────────────────────────────`);
    console.log(`  │  Sales Y1: ₹${fmt(data[0].sales)}  │  Sales Y3: ₹${fmt(data[2].sales)}`);
    console.log(`  │  Capital Y1: ₹${fmt(data[0].capital)}  │  Capital Y3: ₹${fmt(data[2].capital)}`);
    console.log(`  │`);

    // Header
    const hdr = '  │  ' + 'Ratio'.padEnd(12) + '│ ' + 
      data.map((_, i) => `  Y${i+1}  `).join('│ ') + '│ Benchmark';
    console.log(hdr);
    console.log('  │  ' + '─'.repeat(12) + '┼' + data.map(() => '────────').join('┼') + '┼──────────');

    // Compute ratios for each year
    const BENCHMARKS = getBenchmarks(segment);
    for (const [key, bench] of Object.entries(BENCHMARKS)) {
      const values = data.map(d => {
        switch (key) {
          case 'gpMargin': return d.gpRatio;
          case 'npMargin': return d.npRatio;
          case 'ebitdaMargin': return (d.ebitda / d.sales) * 100;
          case 'currentRatio': return d.currentRatio;
          case 'currentRatioExBank': return d.currentRatioExBank;
          case 'deRatio': return d.deRatio;
          case 'tolTnw': return d.tolTnw;
          case 'dscr': return d.dscr;
          case 'icr': return d.ebitda / Math.max(d.interest, 1);
          case 'facr': return d.facr;
          case 'roe': return (d.netProfit / Math.max(d.capital, 1)) * 100;
          case 'roa': return (d.netProfit / Math.max(d.totalAssets, 1)) * 100;
          case 'bep': return d.bepPercentage;
          case 'invTurnover': return (d.purchases + d.openStock - d.closingStock) / Math.max(d.inventory, 1);
          case 'wcTurnover': {
            const wcGap = d.totalCA - d.totalCL; // WC Gap = CA – CL (excl. bank borrowings)
            return d.sales / Math.max(wcGap, 1);
          }
          case 'capUtil': return d.capacityUtil;
          case 'debtorDays': return Math.round(d.debtors / (d.sales / 365));
          case 'creditorDays': return Math.round(d.creditors / (d.purchases / 365));
          default: return 0;
        }
      });

      const checked = values.map(v => checkRatio(v, bench.min, bench.max));
      checked.forEach(c => {
        totalTests++;
        if (c.flag === '✅') passCount++;
        else if (c.flag === '⚠️') warnCount++;
        else failCount++;
      });

      const isPercentage = key.includes('Margin') || key === 'roe' || key === 'roa' || key === 'bep' || key === 'capUtil';
      const isDays = key.includes('Days') || key.includes('days');
      const formatVal = (v: number) => isDays ? `${Math.round(v)}d` : isPercentage ? pct(v) : ratio(v);

      const row = '  │  ' + bench.label.padEnd(12) + '│ ' +
        checked.map(c => `${c.flag}${formatVal(c.value).padStart(6)}`).join('│ ') +
        `│ ${bench.min}-${bench.max}`;
      console.log(row);
    }

    console.log(`  └${'─'.repeat(70)}`);
    console.log('');
  }
}

console.log('\n' + '═'.repeat(70));
console.log('  SUMMARY');
console.log('═'.repeat(70));
console.log(`  Total ratio checks: ${totalTests}`);
console.log(`  ✅ Pass:    ${passCount} (${((passCount/totalTests)*100).toFixed(1)}%)`);
console.log(`  ⚠️  Warn:    ${warnCount} (${((warnCount/totalTests)*100).toFixed(1)}%)`);
console.log(`  🔴 Fail:    ${failCount} (${((failCount/totalTests)*100).toFixed(1)}%)`);
console.log('═'.repeat(70));
