// components/reports/BalanceSheet.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt } from "../../lib/format";
import s from "./BalanceSheet.module.css";

export default function BalanceSheet({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 1;

  const yearHeaders = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 3</div>
          <h3 className="report-section-title">Detailed Projected Balance Sheet</h3>
          <p className="report-section-subtitle">Comprehensive Sources &amp; Applications of Funds</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge badge-emerald">Audit Grade</span>
          <span className="badge badge-blue no-print">Tandon/RBI Compliant</span>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>

          {/* ── LIABILITIES HEADER ─────────────────────────────────── */}
          <thead>
            <tr>
              <th className={s.colParticulars}>Particulars</th>
              {yearHeaders}
            </tr>
          </thead>

          <tbody>
            {/* 1) NET WORTH */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>1) NET WORTH &amp; QUASI-EQUITY</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Proprietor's / Partners Capital</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.capital)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>B) Add: Quasi-Equity (Promoter Loans)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.quasiEquity)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>TANGIBLE NET WORTH (A + B)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.capital + d.quasiEquity)}</td>)}
            </tr>

            {/* 2) TERM LIABILITIES */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>2) TERM LIABILITIES (LONG TERM)</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Term Loans (Bank/FIs)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.termLoan)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Unsecured Loans (Market/External)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.unsecured)}</td>)}
            </tr>

            {/* 3) CURRENT LIABILITIES */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>3) CURRENT LIABILITIES &amp; PROVISIONS</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>A) Bank Borrowings (Proposed Limit CC/OD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.bankBorrowings)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Current Maturities of Long Term Debt (CMLTD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cmltd)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>C) Sundry Creditors (Trade Payables)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.creditors)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>D) Statutory Liabilities (GST/PF/TDS)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>E) Other Current Liabilities &amp; Provisions</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.otherCL)}</td>)}
            </tr>

            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', borderBottom: '3px double #000' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900, fontSize: '12pt' }}>TOTAL LIABILITIES &amp; CAPITAL</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmt(d.totalLiab)}</td>)}
            </tr>

            {/* Spacer */}
            <tr className={s.spacerRow} style={{ height: '24px' }}><td colSpan={ncols} /></tr>

            {/* 4) FIXED ASSETS */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>4) FIXED ASSETS</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Gross Block (At Cost)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.grossFA)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>B) Less: Accumulated Depreciation</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>({fmt(d.accDepn)})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>NET FIXED ASSETS (A - B)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.netFA)}</td>)}
            </tr>

            {/* 5) CURRENT ASSETS */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>5) CURRENT ASSETS, LOANS &amp; ADVANCES</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>A) Closing Stock (Inventory)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.inventory)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>B) Sundry Debtors &lt; 6 Months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: "700", marginLeft: '40px', display: 'inline-block' }}>C) Sundry Debtors &gt; 6 Months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.debtorsOver6M)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>D) Cash and Bank Balances</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cashBank)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>E) Loans &amp; Advances (Suppliers/Deposits)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.loansAdv)}</td>)}
            </tr>
            {data.some((d) => d.reconAdj > 0) && (
              <tr>
                <td className={s.tdParticulars}>
                  <span style={{ marginLeft: '40px', display: 'inline-block' }}>F) Other Deposits / Adjustments</span>
                </td>
                {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.reconAdj)}</td>)}
              </tr>
            )}

            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', borderBottom: '3px double #000' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900, fontSize: '12pt' }}>TOTAL APPLICATION OF FUNDS</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmt(d.totalAssets)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}