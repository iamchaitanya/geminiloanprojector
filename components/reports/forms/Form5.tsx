// components/reports/forms/Form5.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt } from "../../../lib/format";
import s from "../shared.module.css";

export default function Form5({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 1;

  const YH = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Form V</div>
          <h3 className="report-section-title">Assessment of Maximum Permissible Bank Finance (MPBF)</h3>
          <p className="report-section-subtitle">CMA Form V</p>
        </div>
        <span className="badge badge-emerald">RBI / Tandon / Nayak Compliance</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead><tr><th className={s.colParticulars}>Particulars</th>{YH}</tr></thead>
          <tbody>
            {/* I. TANDON METHOD II */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>I. Tandon Committee (Method II) — Standard Norms</td></tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Total Current Assets (as per Form III)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCA)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Other Current Liabilities (Excl. Bank Borrowings)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>({fmt(d.totalCL)})</td>)}
            </tr>
            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>Of Which: Statutory Dues (GST/PF/TDS)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>3) Working Capital Gap (1 - 2)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Min. Borrower Margin (25% of NCA)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>({fmt(d.totalCA * 0.25)})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>5) MPBF as per Method II (3 - 4)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt((d.totalCA - d.totalCL) - (d.totalCA * 0.25))}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Actual Net Working Capital (NWC) Proposed</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>7) Final Eligibility (Tandon II)</td>
              {data.map((d) => {
                const mpbf = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
                return <td key={d.year} className={s.tdValue}>{fmt(mpbf)}</td>;
              })}
            </tr>

            {/* II. NAYAK COMMITTEE */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>II. Nayak Committee (Turnover Method) — MSME Limit</td></tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>8) Projected Annual Turnover (Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>9) Total WC Requirement (25% of Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales * 0.25)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>10) Min. Borrower Contribution (5% of Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>({fmt(d.sales * 0.05)})</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>11) MPBF as per Turnover Method (9 - 10)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.sales * 0.20)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>12) Final Requested Loan Limit (CC/OD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.bankBorrowings)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}