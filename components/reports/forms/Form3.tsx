// components/reports/forms/Form3.tsx
import React from "react";
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";
import s from "../shared.module.css";

// Row helper — declared outside Form3 to avoid react-hooks/static-components warning
interface RProps {
  label: string;
  vals: React.ReactNode[];
  bold?: boolean;
  indent?: number;
  num?: string;
}
function R({ label, vals, bold, indent = 40, num }: RProps) {
  return (
    <tr className={bold ? s.subtotalRow : s.detailRow}>
      <td className={s.tdParticulars}>
        <span style={{ marginLeft: `${indent}px`, display: 'inline-block' }}>
          {num ? `${num}) ` : ""}{label}
        </span>
      </td>
      {vals.map((v, i) => (
        <td key={i} className={s.tdValue}>
          {v}
        </td>
      ))}
    </tr>
  );
}

export default function Form3({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 1;

  const YH = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));

  return (
    <div className="report-section-wrapper font-serif">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Form III</div>
          <h3 className="report-section-title">Analysis of Balance Sheet (CMA Official Format)</h3>
          <p className="report-section-subtitle">Comprehensive Sources &amp; Applications Audit</p>
        </div>
        <span className="badge badge-emerald">Statutory Format</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead>
            <tr>
              <th className={s.colParticulars} style={{ textAlign: 'left' }}>Particulars of Liabilities &amp; Assets</th>
              {YH}
            </tr>
          </thead>
          <tbody>
            {/* I. CURRENT LIABILITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>I. Current Liabilities</td>
            </tr>
            <R num="1" label="Raw Materials, Stores and Spares" vals={data.map(() => fmt(0))} />
            <R num="2" label="Short-Term Borrowings from Banks (WC Limits)" vals={data.map((d) => fmt(d.bankBorrowings))} bold />
            <R num="3" label="Sundry Creditors (Trade Payables)" vals={data.map((d) => fmt(d.creditors))} />
            <R num="4" label="Advance Payments from Customers" vals={data.map(() => "0")} />
            <R num="5" label="Provision for Taxation" vals={data.map((d) => d.tax === 0 ? "0" : fmt(d.tax))} />
            <R num="6" label="Dividend Payable" vals={data.map(() => "0")} />
            <R num="7" label="Statutory Liabilities (GST/PF/TDS Payable)" vals={data.map((d) => fmt(d.statutoryDues))} />
            <R num="8" label="Instalments of Term Loans Due within 1 Year (CMLTD)" vals={data.map((d) => fmt(d.cmltd))} />
            <R num="9" label="Other Current Liabilities and Provisions" vals={data.map((d) => fmt(d.otherCL))} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>10) Total Current Liabilities (1 to 9)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCL + d.bankBorrowings)}</td>)}
            </tr>

            {/* II. TERM LIABILITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>II. Term Liabilities (Long Term)</td>
            </tr>
            <R num="11" label="Debentures (Not Maturing within One Year)" vals={data.map(() => "0")} />
            <R num="12" label="Preference Shares (Redeemable after One Year)" vals={data.map(() => "0")} />
            <R num="13" label="Term Loans (Excl. Current Instalments)" vals={data.map((d) => fmt(d.termLoan))} />
            <R num="14" label="Deferred Payment Credits" vals={data.map(() => "0")} />
            <R num="15" label="Fixed Deposits (Maturing after One Year)" vals={data.map(() => "0")} />
            <R num="16" label="Unsecured Loans / Quasi-Equity Additions" vals={data.map((d) => fmt(d.unsecured))} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>17) Total Term Liabilities (11 to 16)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.termLoan + d.unsecured)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>18) Total Outside Liabilities (10 + 17)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCL + d.bankBorrowings + d.termLoan + d.unsecured)}</td>)}
            </tr>

            {/* III. NET WORTH */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>III. Net Worth / Promoter Funds</td>
            </tr>
            <R num="19" label="Proprietor's / Partners / Share Capital" vals={data.map((d) => fmt(d.capital))} bold />
            <R num="20" label="Preference Share Capital" vals={data.map(() => "0")} />
            <R num="21" label="General Reserves" vals={data.map(() => "0")} />
            <R num="22" label="Revaluation Reserves" vals={data.map(() => "0")} />
            <R num="23" label="Other Reserves (Excl. Provisions)" vals={data.map(() => "0")} />
            <R num="24" label="Surplus / Deficit in P & L Account" vals={data.map((d) => fmt(d.netProfit))} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>25) Total Net Worth (19 to 24)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.capital)}</td>)}
            </tr>
            <tr className={s.grandTotalRow} style={{ fontWeight: 700 }}>
              <td className={s.tdParticulars} style={{ fontWeight: 700, borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>26) Total Liabilities (18 + 25)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 700, borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>{fmt(d.totalLiab)}</td>)}
            </tr>

            {/* IV. FIXED ASSETS */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>IV. Fixed Assets</td>
            </tr>
            <R num="27" label="Gross Block (Fixed Assets)" vals={data.map((d) => fmt(d.grossFA))} />
            <R num="28" label="Less: Accumulated Depreciation" vals={data.map((d) => `(${fmt(d.accDepn)})`)} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>29) Net Fixed Assets (27 - 28)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netFA)}</td>)}
            </tr>
            <R num="30" label="Capital Work-in-Progress" vals={data.map(() => "0")} />

            {/* V. NON-CURRENT ASSETS */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>V. Non-Current Assets</td>
            </tr>
            <R num="31" label="Investments (Long-Term)" vals={data.map(() => "0")} />
            <R num="32" label="Other Non-Current Assets (Incl. Deposits)" vals={data.map(() => "0")} />

            {/* VI. CURRENT ASSETS */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>VI. Current Assets</td>
            </tr>
            <R num="33" label="Raw Materials (Stores & Spares)" vals={data.map((d) => fmt(d.rawMaterials))} />
            <R num="34" label="Stocks-in-Process" vals={data.map((d) => fmt(d.stockInProcess))} />
            <R num="35" label="Finished Goods" vals={data.map((d) => fmt(d.finishedGoods))} />
            <R num="36" label="Other Spares (Consumables)" vals={data.map(() => "0")} />
            <R num="37" label="Receivables (Trade Debtors) < 6 Months" vals={data.map((d) => fmt(d.debtorsUnder6M))} />
            <R num="38" label="Receivables (Trade Debtors) > 6 Months" vals={data.map((d) => fmt(d.debtorsOver6M))} />
            <R num="39" label="Total Receivables (37 + 38)" vals={data.map((d) => fmt(d.debtors))} bold />
            <R num="40" label="Bills Purchased and Discounted" vals={data.map(() => "0")} />
            <R num="41" label="Cash and Bank Balances" vals={data.map((d) => fmt(d.cashBank))} />
            <R num="42" label="Advances to Suppliers / Other Current Assets" vals={data.map((d) => fmt(d.loansAdv + d.reconAdj))} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>43) Total Current Assets (33 to 42)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCA)}</td>)}
            </tr>
            <tr className={s.grandTotalRow} style={{ fontWeight: 700 }}>
              <td className={s.tdParticulars} style={{ fontWeight: 700, borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>44) Total Assets (29 + 30 + 31 + 32 + 43)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 700, borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>{fmt(d.totalAssets)}</td>)}
            </tr>

            {/* VII. VALUATION */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>VII. Valuation &amp; Liquidity Audit</td>
            </tr>
            <R num="45" label="Less: Intangible Assets" vals={data.map(() => "0")} />
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>46) Tangible Net Worth (TNW) (25 - 45)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.capital + d.quasiEquity)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Of which: Quasi-Equity (Promoter Funds)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.quasiEquity)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>47) Net Working Capital (NWC) (43 - 10)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>48) Final Current Ratio (Benchmark: ≥ 1.33)</td>
              {data.map((d) => {
                const ratio = d.totalCA / (d.totalCL + d.bankBorrowings);
                return <td key={d.year} className={s.tdValue}>{fmtR(ratio)}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}