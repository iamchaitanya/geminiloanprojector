// lib/format.ts
export const fmt = (num: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(num));
export const fmtR = (num: number) => num.toFixed(2);
/** Accounting format: negatives shown as (value), positives as-is */
export const fmtAcc = (num: number) => {
  const rounded = Math.round(num);
  if (rounded < 0) return `(${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(-rounded)})`;
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded);
};

// ── Zero-aware wrappers ─────────────────────────────────────────────────────
// When showZero=false, these return "" for a rounded-zero value so the cell
// prints blank instead of "0", matching the preference of many CAs/banks.
export const fmtZ    = (num: number, showZero: boolean) => (!showZero && Math.round(num) === 0 ? '' : fmt(num));
export const fmtRZ   = (num: number, showZero: boolean) => (!showZero && parseFloat(num.toFixed(2)) === 0 ? '' : fmtR(num));
export const fmtAccZ = (num: number, showZero: boolean) => (!showZero && Math.round(num) === 0 ? '' : fmtAcc(num));