// components/reports/DscrSchedule.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";
import s from "./DscrSchedule.module.css";

export default function DscrSchedule({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  const ncols = years.length + 1;
  const avgDscr = data.reduce((acc, d) => acc + d.dscr, 0) / data.length;

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 12</div>
          <h3 className="report-section-title">Debt Service Coverage Ratio (DSCR)</h3>
          <p className="report-section-subtitle">Detailed Schedule of Repayment Capacity</p>
        </div>
        <span className="badge badge-emerald">Liquid Coverage</span>
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
                  {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* A. CASH ACCRUALS */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>A. CASH ACCRUALS (SOURCES OF FUNDS)</td>
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Net Profit after Tax (PAT)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Add: Depreciation (Non-cash)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Add: Interest on Term Loans / CC</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>TOTAL CASH ACCRUALS (1+2+3)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.netProfit + d.depnYr + d.interest)}</td>)}
            </tr>

            {/* B. DEBT OBLIGATIONS */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>B. DEBT OBLIGATIONS (APPLICATIONS)</td>
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Interest on Term Loans / Working Capital</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Repayment of Term Loan Installments</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.tlRepayment)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>TOTAL DEBT SERVICE (4+5)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.interest + d.tlRepayment)}</td>)}
            </tr>

            {/* DSCR RESULT */}
            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', borderBottom: '3px double #000' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900, fontSize: '11pt' }}>DEBT SERVICE COVERAGE RATIO (DSCR)</td>
              {data.map((d) => (
                <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmtR(d.dscr)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Average DSCR footer */}
      <div style={{
        padding: "16px 24px",
        borderTop: "2px solid #000",
        borderBottom: "1px solid #000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: '"Times New Roman", Times, serif',
        background: "#fff",
      }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }}>
            Weighted Average DSCR
          </div>
          <div style={{ fontSize: "10px", marginTop: "2px" }}>
            Calculated over the entire projection period of {data.length} years.
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "28px", fontWeight: 900 }}>{fmtR(avgDscr)}</span>
          <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
            Benchmark: ≥ 1.50
          </span>
        </div>
      </div>
    </div>
  );
}