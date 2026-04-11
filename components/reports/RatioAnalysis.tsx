// components/reports/RatioAnalysis.tsx
import React from "react";
import { ProjectedYear } from "../../lib/engine";
import { fmtR } from "../../lib/format";
import s from "./RatioAnalysis.module.css";

// Row helper — at module scope to avoid react-hooks/static-components warning
interface RowProps {
  label: string;
  vals: React.ReactNode[];
  benchmark: string;
  styles: Record<string, string>;
}
function RatioRow({ label, vals, benchmark, styles: cx }: RowProps) {
  return (
    <tr className={cx.ratioRow}>
      <td className={cx.tdDescription}>{label}</td>
      {vals.map((v, i) => <td key={i} className={cx.tdValue}>{v}</td>)}
      <td className={`${cx.tdBenchmark} no-print`}>{benchmark}</td>
    </tr>
  );
}

export default function RatioAnalysis({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 2; // Description + years + Benchmark

  const getStatusColor = (val: number, type: string): string => {
    switch (type) {
      case "np":          return val >= 7 ? "" : val >= 4 ? "" : "";
      case "gp":          return val >= 10 ? "" : val >= 5 ? "" : "";
      case "ebitda":      return val >= 10 ? "" : val >= 5 ? "" : "";
      case "bep":         return val <= 75 ? "" : val <= 85 ? "" : "";
      case "roe":         return val >= 12 ? "" : val >= 6 ? "" : "";
      case "roa":         return val >= 5 ? "" : val >= 2.5 ? "" : "";
      case "cr_incl":     return val >= 1.1 ? "" : val >= 1.0 ? "" : "";
      case "cr_excl":     return val >= 1.33 ? "" : val >= 1.1 ? "" : "";
      case "qr":          return val >= 1.0 ? "" : val >= 0.75 ? "" : "";
      case "de":          return val <= 2.0 ? "" : val <= 3.0 ? "" : "";
      case "toltnw":      return val <= 3.0 ? "" : val <= 4.5 ? "" : "";
      case "icr":         return val >= 2.5 ? "" : val >= 1.5 ? "" : "";
      case "facr":        return val >= 1.33 ? "" : val >= 1.1 ? "" : "";
      case "dscr":        return val >= 1.5 ? "" : val >= 1.0 ? "" : "";
      case "debt_ebitda": return val < 4.0 ? "" : val <= 5.0 ? "" : "";
      case "debtor_days": return val <= 45 ? "" : val <= 75 ? "" : "";
      case "creditor_days":return val <= 75 ? "" : val <= 90 ? "" : "";
      case "inv_months":  return val <= 3.0 ? "" : val <= 4.0 ? "" : "";
      case "inv_turn":    return val >= 4.0 ? "" : val >= 2.5 ? "" : "";
      case "wc_turn":     return (val >= 3.0 && val <= 8.0) ? "" : (val >= 1.5 && val <= 10.0) ? "" : "";
      case "ass_turn":    return val >= 1.5 ? "" : val >= 1.0 ? "" : "";
      case "capacity":    return val >= 65 ? "" : val >= 50 ? "" : "";
      default:            return "";
    }
  };

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 13</div>
          <h3 className="report-section-title">Ratio Analysis &amp; Benchmarks</h3>
          <p className="report-section-subtitle">Full 22-Point Financial Diagnostic Suite</p>
        </div>
        <span className="badge badge-emerald">Audit Ready</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
            <col className="no-print" style={{ width: "120px" }} />
          </colgroup>

          <thead>
            <tr>
              <th className={s.colDescription}>Ratio Description</th>
              {years.map((y) => (
                <th key={y} style={{ textAlign: "center" }}>
                  {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
                </th>
              ))}
              <th className={`${s.colBenchmark} no-print`}>Benchmark</th>
            </tr>
          </thead>

          <tbody>
            {/* I. PROFITABILITY */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>Profitability Ratios</td></tr>
            <RatioRow styles={s} label="Gross Profit Margin (%)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.gpRatio, "gp")}>{fmtR(d.gpRatio)}%</span>)}
              benchmark="≥ 10% Good" />
            <RatioRow styles={s} label="Net Profit Margin (%)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.npRatio, "np")}>{fmtR(d.npRatio)}%</span>)}
              benchmark="≥ 7% Good" />
            <RatioRow styles={s} label="EBITDA Margin (%)"
              vals={data.map((d) => { const v = (d.ebitda / d.sales) * 100; return <span key={d.year} className={getStatusColor(v, "ebitda")}>{fmtR(v)}%</span>; })}
              benchmark="≥ 10% Good" />
            <RatioRow styles={s} label="Break-Even Point (% of Sales)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.bepPercentage, "bep")}>{fmtR(d.bepPercentage)}%</span>)}
              benchmark="≤ 75%" />
            <RatioRow styles={s} label="Return on Equity (ROE %)"
              vals={data.map((d) => { const v = (d.netProfit / Math.max(d.capital, 1)) * 100; return <span key={d.year} className={getStatusColor(v, "roe")}>{fmtR(v)}%</span>; })}
              benchmark="≥ 12% Good" />
            <RatioRow styles={s} label="Return on Assets (ROA %)"
              vals={data.map((d) => { const v = (d.netProfit / Math.max(d.totalAssets, 1)) * 100; return <span key={d.year} className={getStatusColor(v, "roa")}>{fmtR(v)}%</span>; })}
              benchmark="≥ 5% Good" />

            {/* II. LIQUIDITY */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>Liquidity Ratios</td></tr>
            <RatioRow styles={s} label="Current Ratio (incl. CC)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.currentRatio, "cr_incl")}>{fmtR(d.currentRatio)}×</span>)}
              benchmark="1.1 – 1.4" />
            <RatioRow styles={s} label="Current Ratio (excl. bank)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.currentRatioExBank, "cr_excl")}>{fmtR(d.currentRatioExBank)}×</span>)}
              benchmark="≥ 1.33" />
            <RatioRow styles={s} label="Quick Ratio"
              vals={data.map((d) => { const v = (d.totalCA - d.inventory) / Math.max(d.totalCL + d.bankBorrowings, 1); return <span key={d.year} className={getStatusColor(v, "qr")}>{fmtR(v)}×</span>; })}
              benchmark="≥ 1.00" />

            {/* III. SOLVENCY */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>Solvency &amp; Leverage</td></tr>
            <RatioRow styles={s} label="Debt to Equity (D:E)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.deRatio, "de")}>{fmtR(d.deRatio)}×</span>)}
              benchmark="≤ 2.0" />
            <RatioRow styles={s} label="TOL / TNW (Regulatory Cap)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.tolTnw, "toltnw")}>{fmtR(d.tolTnw)}×</span>)}
              benchmark="≤ 3.0 Best" />
            <RatioRow styles={s} label="Interest Coverage Ratio (ICR)"
              vals={data.map((d) => { const v = d.ebitda / Math.max(d.interest, 1); return <span key={d.year} className={getStatusColor(v, "icr")}>{fmtR(v)}×</span>; })}
              benchmark="≥ 2.5" />
            <RatioRow styles={s} label="Fixed Asset Coverage Ratio (FACR)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.facr, "facr")}>{fmtR(d.facr)}×</span>)}
              benchmark="≥ 1.33" />
            <RatioRow styles={s} label="DSCR"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.dscr, "dscr")}>{fmtR(d.dscr)}×</span>)}
              benchmark="≥ 1.50" />
            <RatioRow styles={s} label="Total Debt / EBITDA"
              vals={data.map((d) => { const v = (d.bankBorrowings + d.termLoan + d.cmltd + d.unsecured) / Math.max(d.ebitda, 1); return <span key={d.year} className={getStatusColor(v, "debt_ebitda")}>{fmtR(v)}×</span>; })}
              benchmark="< 4.0" />

            {/* IV. EFFICIENCY */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>Efficiency Ratios</td></tr>
            <RatioRow styles={s} label="Capacity Utilization (%)"
              vals={data.map((d) => <span key={d.year} className={getStatusColor(d.capacityUtil, "capacity")}>{fmtR(d.capacityUtil)}%</span>)}
              benchmark="≥ 70% Good" />
            <RatioRow styles={s} label="Debtor Collection Period (Days)"
              vals={data.map((d) => { const v = Math.round(d.debtors / (d.sales / 365)); return <span key={d.year} className={getStatusColor(v, "debtor_days")}>{v}</span>; })}
              benchmark="≤ 45 Days" />
            <RatioRow styles={s} label="Creditor Payment Period (Days)"
              vals={data.map((d) => { const v = Math.round(d.creditors / (d.purchases / 365)); return <span key={d.year} className={getStatusColor(v, "creditor_days")}>{v}</span>; })}
              benchmark="≤ 75 Days" />
            <RatioRow styles={s} label="Inventory Holding (Months)"
              vals={data.map((d) => { const v = d.inventory / (d.purchases / 12); return <span key={d.year} className={getStatusColor(v, "inv_months")}>{fmtR(v)}</span>; })}
              benchmark="≤ 3.0" />
            <RatioRow styles={s} label="Inventory Turnover (×)"
              vals={data.map((d) => { const v = d.purchases / Math.max(d.inventory, 1); return <span key={d.year} className={getStatusColor(v, "inv_turn")}>{fmtR(v)}</span>; })}
              benchmark="≥ 4.0×" />
            <RatioRow styles={s} label="Working Capital Turnover (×)"
              vals={data.map((d) => { const v = d.sales / Math.max(d.totalCA - (d.totalCL + d.bankBorrowings), 1); return <span key={d.year} className={getStatusColor(v, "wc_turn")}>{fmtR(v)}</span>; })}
              benchmark="3.0 – 8.0×" />
            <RatioRow styles={s} label="Asset Turnover (×)"
              vals={data.map((d) => { const v = d.sales / Math.max(d.totalAssets, 1); return <span key={d.year} className={getStatusColor(v, "ass_turn")}>{fmtR(v)}</span>; })}
              benchmark="≥ 1.5×" />
          </tbody>
        </table>
      </div>
    </div>
  );
}