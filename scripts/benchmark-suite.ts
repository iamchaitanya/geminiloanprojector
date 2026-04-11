import { generateProjections } from '../lib/engine';
import { getDynamicProfile } from '../lib/profiles';
import { BusinessSegment, ProjectedYear } from '../types/cma';

const LOAN_AMOUNTS = Array.from({ length: 20 }, (_, i) => (i + 1) * 50_000);
const SEGMENTS: BusinessSegment[] = ['trading', 'service', 'manufacturing', 'construction'];
const VARIANT_SEEDS = [101, 202, 303];

type RatioBand = {
  min?: number;
  max?: number;
};

type SegmentBands = {
  gpMargin: RatioBand;
  npMargin: RatioBand;
  ebitdaMargin: RatioBand;
  bep?: RatioBand;
};

const CORE_BANDS = {
  currentRatio: { min: 1.1, max: 1.65 },
  currentRatioExBank: { min: 1.33 },
  quickRatio: { min: 0.72 },
  debtEquity: { max: 2.1 },
  tolTnw: { max: 3.2 },
  icr: { min: 2.5 },
  facr: { min: 1.1 },
  // For CC-only loans, DSCR = EBITDA / interest (i.e. ICR). A high value is healthy —
  // banks only enforce a floor, not a ceiling, for working capital facilities.
  dscr: { min: 1.5 },
  debtEbitda: { max: 4.0 },
  roa: { min: 5 },
  roe: { min: 12 },
} satisfies Record<string, RatioBand>;

const SEGMENT_BANDS: Record<BusinessSegment, SegmentBands> = {
  trading: {
    gpMargin: { min: 18, max: 26 },
    npMargin: { min: 7, max: 12.6 },
    ebitdaMargin: { min: 10, max: 15 },
    bep: { max: 82 },
  },
  service: {
    gpMargin: { min: 80, max: 92 },
    npMargin: { min: 9.5, max: 15.5 },
    ebitdaMargin: { min: 12, max: 17 },
    bep: { max: 91 },
  },
  manufacturing: {
    gpMargin: { min: 22, max: 31 },
    npMargin: { min: 7, max: 12.8 },
    ebitdaMargin: { min: 10, max: 17 },
    bep: { max: 86 },
  },
  construction: {
    gpMargin: { min: 28, max: 35 },
    npMargin: { min: 8.4, max: 14.5 },
    ebitdaMargin: { min: 12, max: 18.5 },
    bep: { max: 85 },
  },
};

interface ScenarioResult {
  segment: BusinessSegment;
  loanAmount: number;
  passed: boolean;
  failures: string[];
  variantsChecked: number;
  averages: {
    currentRatio: number;
    dscr: number;
    debtEquity: number;
    npMargin: number;
    ebitdaMargin: number;
  };
}

function checkBand(value: number, band: RatioBand, label: string, failures: string[]) {
  if (band.min !== undefined && value < band.min) {
    failures.push(`${label} low (${value.toFixed(2)})`);
  }

  if (band.max !== undefined && value > band.max) {
    failures.push(`${label} high (${value.toFixed(2)})`);
  }
}

function evaluateYear(segment: BusinessSegment, projection: ProjectedYear, failures: string[]) {
  const segmentBands = SEGMENT_BANDS[segment];
  const ebitdaMargin = (projection.ebitda / Math.max(projection.sales, 1)) * 100;
  const quickRatio = (projection.totalCA - projection.inventory) / Math.max(projection.totalCL + projection.bankBorrowings, 1);
  const icr = projection.ebitda / Math.max(projection.interest, 1);
  const totalDebt = projection.bankBorrowings + projection.termLoan + projection.cmltd + projection.unsecured;
  const debtEbitda = totalDebt / Math.max(projection.ebitda, 1);
  const roa = (projection.netProfit / Math.max(projection.totalAssets, 1)) * 100;
  const roe = (projection.netProfit / Math.max(projection.capital, 1)) * 100;

  checkBand(projection.gpRatio, segmentBands.gpMargin, `Yr ${projection.year} GP Margin`, failures);
  checkBand(projection.npRatio, segmentBands.npMargin, `Yr ${projection.year} NP Margin`, failures);
  checkBand(ebitdaMargin, segmentBands.ebitdaMargin, `Yr ${projection.year} EBITDA Margin`, failures);
  if (segmentBands.bep) {
    checkBand(projection.bepPercentage, segmentBands.bep, `Yr ${projection.year} BEP`, failures);
  }

  checkBand(projection.currentRatio, CORE_BANDS.currentRatio, `Yr ${projection.year} Current Ratio`, failures);
  checkBand(projection.currentRatioExBank, CORE_BANDS.currentRatioExBank, `Yr ${projection.year} Current Ratio ex-bank`, failures);
  checkBand(quickRatio, CORE_BANDS.quickRatio, `Yr ${projection.year} Quick Ratio`, failures);
  checkBand(projection.deRatio, CORE_BANDS.debtEquity, `Yr ${projection.year} D:E`, failures);
  checkBand(projection.tolTnw, CORE_BANDS.tolTnw, `Yr ${projection.year} TOL/TNW`, failures);
  checkBand(icr, CORE_BANDS.icr, `Yr ${projection.year} ICR`, failures);
  checkBand(projection.facr, CORE_BANDS.facr, `Yr ${projection.year} FACR`, failures);
  checkBand(projection.dscr, CORE_BANDS.dscr, `Yr ${projection.year} DSCR`, failures);
  checkBand(debtEbitda, CORE_BANDS.debtEbitda, `Yr ${projection.year} Debt/EBITDA`, failures);
  checkBand(roa, CORE_BANDS.roa, `Yr ${projection.year} ROA`, failures);
  checkBand(roe, CORE_BANDS.roe, `Yr ${projection.year} ROE`, failures);

  if (projection.cashBank < 0) {
    failures.push(`Yr ${projection.year} Negative Cash`);
  }

  if (projection.capital < 0) {
    failures.push(`Yr ${projection.year} Negative Capital`);
  }

  if (projection.reconAdj !== 0) {
    failures.push(`Yr ${projection.year} Balance Sheet mismatch (${projection.reconAdj.toFixed(0)})`);
  }
}

function evaluateScenario(segment: BusinessSegment, loanAmount: number): ScenarioResult {
  const profile = getDynamicProfile(segment, loanAmount);
  const limits = { 
    ccLimit: loanAmount, 
    termLoan: 0, 
    isRenewal: false, 
    existingCc: 0, 
    existingTl: 0,
    ccIntRate: 11.5,
    tlIntRate: 11.0,
    tenure: 5
  };
  const failures: string[] = [];
  const averages = { currentRatio: 0, dscr: 0, debtEquity: 0, npMargin: 0, ebitdaMargin: 0 };
  let count = 0;

  for (const seed of VARIANT_SEEDS) {
    const projections = generateProjections(limits, profile, 3, 2024, { seed, variability: 1 });
    projections.forEach((projection) => evaluateYear(segment, projection, failures));
    projections.forEach((projection) => {
      averages.currentRatio += projection.currentRatio;
      averages.dscr += projection.dscr;
      averages.debtEquity += projection.deRatio;
      averages.npMargin += projection.npRatio;
      averages.ebitdaMargin += (projection.ebitda / Math.max(projection.sales, 1)) * 100;
      count += 1;
    });
  }

  return {
    segment,
    loanAmount,
    passed: failures.length === 0,
    failures,
    variantsChecked: VARIANT_SEEDS.length,
    averages: {
      currentRatio: averages.currentRatio / count,
      dscr: averages.dscr / count,
      debtEquity: averages.debtEquity / count,
      npMargin: averages.npMargin / count,
      ebitdaMargin: averages.ebitdaMargin / count,
    },
  };
}

function runSuite() {
  console.log('=========================================');
  console.log(' CMA SAAS DYNAMIC PROFILE BENCHMARK SUITE');
  console.log('  Segment-specific bank benchmark bands  ');
  console.log('=========================================\n');

  let totalFailures = 0;

  for (const segment of SEGMENTS) {
    console.log(`--- SEGMENT: ${segment.toUpperCase()} ---`);

    for (const loanAmount of LOAN_AMOUNTS) {
      const result = evaluateScenario(segment, loanAmount);
      const summary = `CR ${result.averages.currentRatio.toFixed(2)} | DSCR ${result.averages.dscr.toFixed(2)} | D:E ${result.averages.debtEquity.toFixed(2)} | NP ${result.averages.npMargin.toFixed(2)}% | EBITDA ${result.averages.ebitdaMargin.toFixed(2)}% | ${result.variantsChecked} variants`;

      if (result.passed) {
        console.log(`✅ ₹${loanAmount.toLocaleString()} -> ${summary}`);
      } else {
        totalFailures += result.failures.length;
        console.log(`❌ ₹${loanAmount.toLocaleString()} -> ${summary}`);
        Array.from(new Set(result.failures)).forEach((failure) => console.log(`   - ${failure}`));
      }
    }

    console.log('');
  }

  console.log('=========================================');
  console.log(totalFailures === 0 ? 'SUITE RESULT: PASS' : `SUITE RESULT: FAIL (${totalFailures} issues)`);
  console.log('=========================================');

  if (totalFailures > 0) {
    process.exitCode = 1;
  }
}

runSuite();
