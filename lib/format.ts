// lib/format.ts
export const fmt = (num: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(num));
export const fmtR = (num: number) => num.toFixed(2);
/** Accounting format: negatives shown as (value), positives as-is */
export const fmtAcc = (num: number) => {
  const rounded = Math.round(num);
  if (rounded < 0) return `(${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(-rounded)})`;
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded);
};