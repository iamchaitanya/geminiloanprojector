# CMA Loan Projector

A Next.js CMA (Credit Monitoring Arrangement) report generator for Indian bank loan appraisals. Produces all 6 RBI CMA forms — P&L, Balance Sheet, Cash Flow, Depreciation Schedule, DSCR, Ratio Analysis, and Funds Flow — from a single input form.

[![Ratio Benchmark](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml/badge.svg?job=test-ratios)](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml)
[![Bank Red Flag Scan](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml/badge.svg?job=test-redflags)](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml)
[![Engine Audit](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml/badge.svg?job=test-audit)](https://github.com/iamchaitanya/geminiloanprojector/actions/workflows/ci.yml)

## Live Demo

[superb-scone-275e42.netlify.app](https://superb-scone-275e42.netlify.app)

## What it does

- Accepts business inputs: segment, sales, expenses, assets, limits (CC + TL)
- Runs a pure client-side projection engine (`lib/engine.ts`) for up to 5 years
- Renders all 6 CMA forms as print-ready tables
- Validates 15+ financial ratios against RBI / bank benchmark bands
- Supports 4 business segments: Trading, Service, Manufacturing, Construction

## Test Scripts

| Command | Script | Coverage |
|---|---|---|
| `npm run test:ratios` | `scripts/benchmark-suite.ts` | 240 ratio-band scenarios (4 segments × 20 loan amounts × 3 seeds) |
| `npm run test:redflags` | `scripts/bank_red_flags.ts` | Bank red-flag pattern detection |
| `npm run test:audit` | `scripts/engine_audit.ts` | Engine internals, BS integrity, formula audit |
| `npm test` | All three in sequence | Full suite |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Netlify** for deployment
- No backend — 100% client-side computation
