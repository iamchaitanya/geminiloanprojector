// components/reports/forms/Form2.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";
import s from "../shared.module.css";
import own from "./Form2.module.css";

export default function Form2({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  const ncols = years.length + 1;

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Form II</div>
          <h3 className="report-section-title">Operating Statement (Projected Performance)</h3>
          <p className="report-section-subtitle">CMA Form II</p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={`${s.table} ${own.table}`}>
          <colgroup>
            <col className={own.colParticulars} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead>
            <tr>
              <th className={s.colParticulars}>Particulars</th>
              {years.map((y) => (
                <th key={y} style={{ textAlign: "center" }}>
                  {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={s.sectionHeader}><td colSpan={ncols}>I. Revenue from Operations</td></tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Gross Sales / Turnover</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales)}</td>)}
            </tr>
            <tr className={s.ratioRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) % Growth in Sales (YoY)</span>
              </td>
              {data.map((d, i) => {
                const g = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
                return <td key={d.year} className={s.tdValue}>{i === 0 ? "—" : `${fmtR(g)}%`}</td>;
              })}
            </tr>

            <tr className={s.sectionHeader}><td colSpan={ncols}>II. Cost of Sales / Direct Costs</td></tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Raw Materials / Purchases</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.purchases)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Add: Opening Stock</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.openStock)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>C) Less: Closing Stock</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>({fmt(d.closingStock)})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Cost of Goods Sold (COGS)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.purchases + d.openStock - d.closingStock)}</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Gross Profit (I - II)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales - (d.purchases + d.openStock - d.closingStock))}</td>)}
            </tr>

            <tr className={s.sectionHeader}><td colSpan={ncols}>III. Selling, General &amp; Administrative Expenses</td></tr>
            {data[0].indirectExpenses.map((exp, idx) => {
              const charCode = 97 + idx;
              const label = String.fromCharCode(charCode) + ') ' + exp.label;
              return (
                <tr key={exp.label} className={s.detailRow}>
                  <td className={s.tdParticulars}>
                    <span style={{ marginLeft: '64px', display: 'inline-block' }}>{label}</span>
                  </td>
                  {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.indirectExpenses[idx].value)}</td>)}
                </tr>
              );
            })}
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Indirect Expenses</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalIndExp)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>IV. EBITDA (Operating Profit)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.ebitda)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Less: Depreciation</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Less: Interest on Borrowings</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Profit before Tax (PBT)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.profitBeforeTax)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>7) Less: Provision for Taxation</span>
              </td>
              {data.map((d) => (
                <td key={d.year} className={s.tdValue}>
                  {d.tax === 0 ? "0" : `(${fmt(d.tax)})`}
                </td>
              ))}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Net Profit After Tax (PAT)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className={s.ratioRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Net Profit Margin (%)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmtR(d.npRatio)}%</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`no-print ${own.footnoteBlock}`}>
        <p className={own.footnoteText}>
          * Note: EBITDA (Earnings Before Interest, Tax, Depreciation, and Amortization) is a key proxy for cash flow generated from operations.
          Banks typically look for a minimum EBITDA margin of 8-10% in trading and 12-15% in manufacturing sectors.
        </p>
        <div className={own.auditNote}>
          <p className={own.auditNoteTitle}>Internal Audit Check</p>
          <p style={{ fontFamily: "monospace" }}>Interest Coverage Target: &gt; 2.5x</p>
        </div>
      </div>
    </div>
  );
}
