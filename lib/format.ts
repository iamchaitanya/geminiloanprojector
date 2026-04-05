// lib/format.ts
export const fmt = (num: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(num));
export const fmtR = (num: number) => num.toFixed(2);