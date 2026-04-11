// components/reports/BalanceSheet.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt } from "../../lib/format";
import s from "./shared.module.css";
import own from "./BalanceSheet.module.css";

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
        <table className={`${s.table} ${own.table}`}>
          <colgroup>
            <col className={own.colParticulars} />
            {years.map((y) => <col key={y} />)}
          </colgroup>

          <thead>
            <tr>
              <th className={s.colParticulars}>Particulars</th>
              {yearHeaders}
            </tr>
          </thead>

          <tbody>
            {/* 1) NET WORTH */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>1) Net Worth &amp; Quasi-Equity</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Proprietor&apos;s / Partners Capital</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.capital)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Add: Quasi-Equity (Promoter Loans)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.quasiEquity)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Tangible Net Worth (A + B)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.capital + d.quasiEquity)}</td>)}
            </tr>

            {/* 2) TERM LIABILITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>2) Term Liabilities (Long Term)</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Term Loans (Bank/FIs)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.termLoan)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Unsecured Loans (Market/External)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.unsecured)}</td>)}
            </tr>

            {/* 3) CURRENT LIABILITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>3) Current Liabilities &amp; Provisions</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Bank Borrowings (Proposed Limit CC/OD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.bankBorrowings)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Current Maturities of Long Term Debt (CMLTD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cmltd)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>C) Sundry Creditors (Trade Payables)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.creditors)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>D) Statutory Liabilities (GST/PF/TDS)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>E) Other Current Liabilities &amp; Provisions</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.otherCL)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Total Liabilities &amp; Capital</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalLiab)}</td>)}
            </tr>

            <tr className={`${s.spacerRow} ${own.spacerRow}`}><td colSpan={ncols} /></tr>

            {/* 4) FIXED ASSETS */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>4) Fixed Assets</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Gross Block (At Cost)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.grossFA)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Less: Accumulated Depreciation</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>({fmt(d.accDepn)})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Net Fixed Assets (A - B)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netFA)}</td>)}
            </tr>

            {/* 5) CURRENT ASSETS */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>5) Current Assets, Loans &amp; Advances</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>A) Closing Stock (Inventory)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.inventory)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>B) Sundry Debtors &lt; 6 Months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>C) Sundry Debtors &gt; 6 Months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.debtorsOver6M)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>D) Cash and Bank Balances</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cashBank)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>E) Loans &amp; Advances (Suppliers/Deposits)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.loansAdv)}</td>)}
            </tr>
            {data.some((d) => d.reconAdj > 0) && (
              <tr className={s.detailRow}>
                <td className={s.tdParticulars}>
                  <span style={{ marginLeft: '40px', display: 'inline-block' }}>F) Other Deposits / Adjustments</span>
                </td>
                {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.reconAdj)}</td>)}
              </tr>
            )}

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Total Application of Funds</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalAssets)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
