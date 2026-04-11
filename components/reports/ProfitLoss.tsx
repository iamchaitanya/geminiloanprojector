// components/reports/ProfitLoss.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";
import s from "./ProfitLoss.module.css";

export default function ProfitLoss({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  const ncols = years.length + 1; // Particulars + year columns

  return (
    <div className="report-section-wrapper">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 2</div>
          <h3 className="report-section-title">Profit &amp; Loss Account</h3>
        </div>
        <span className="badge badge-emerald">P &amp; L</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>

          <thead>
            <tr>
              <th className={s.colParticulars}>Particulars</th>
              {years.map((y) => (
                <th key={y} style={{ textAlign: "center" }}>
                  {y.includes("\n")
                    ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>)
                    : y}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>


            {/* ── 1) INCOME ─────────────────────────────────────────── */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>1) Income / Revenue</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Sales / Turnover</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Other Income</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.otherInc)}</td>)}
            </tr>

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Revenue (A)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalRev)}</td>)}
            </tr>

            {/* ── 2) EXPENDITURE ───────────────────────────────────── */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>2) Expenditure</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Opening Stock</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.openStock)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Purchases / Direct Costs</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.purchases)}</td>)}
            </tr>

            {/* Indirect expenses sub-section heading — treated as section-header */}
            <tr className={s.sectionHeader}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>C) Indirect / Operating Expenses:</span>
              </td>
              {years.map((y) => <td key={y} />)}
            </tr>

            {/* Indirect expense line items */}
            {data[0].indirectExpenses.map((exp, idx) => {
              const charCode = 97 + idx; // starting from 'a'
              const label = String.fromCharCode(charCode) + ') ' + exp.label;
              return (
                <tr key={exp.label} className={s.detailRow}>
                  <td className={s.tdParticulars}>
                    <span style={{ marginLeft: '64px', display: 'inline-block' }}>{label}</span>
                  </td>
                  {data.map((d) => (
                    <td key={d.year} className={s.tdValue}>{fmt(d.indirectExpenses[idx].value)}</td>
                  ))}
                </tr>
              );
            })}

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '48px', display: 'inline-block' }}>Total Indirect Expenses</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalIndExp)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>D) Less: Closing Stock</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.closingStock)}</td>)}
            </tr>

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Expenditure (B)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCosts)}</td>)}
            </tr>

            {/* ── GROSS PROFIT ──────────────────────────────────────── */}
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>3) Gross Profit (A − B)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.grossProfit)}</td>)}
            </tr>

            <tr className={s.ratioRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Gross Profit Ratio (%)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmtR(d.gpRatio)}%</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Less: Depreciation</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>5) Profit before Interest &amp; Tax (PBIT)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.profitBeforeInt)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Less: Interest on Borrowings</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>7) Net Profit before Tax (PBT)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.profitBeforeTax)}</td>)}
            </tr>

            <tr className={s.ratioRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Net Profit Ratio (%)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmtR(d.npRatio)}%</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>8) Less: Income Tax Provision</span>
              </td>
              {data.map((d) => (
                <td key={d.year} className={s.tdValue}>
                  {d.tax === 0 ? "0" : fmt(d.tax)}
                </td>
              ))}
            </tr>

            {/* ── NET PROFIT AFTER TAX ──────────────────────────────── */}
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>9) Net Profit After Tax (PAT)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}