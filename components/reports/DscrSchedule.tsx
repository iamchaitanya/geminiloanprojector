// components/reports/DscrSchedule.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmtZ, fmtRZ, fmtAccZ } from "../../lib/format";
import { usePrintSettings } from "../../lib/PrintSettingsContext";
import s from "./shared.module.css";
import own from "./DscrSchedule.module.css";

export default function DscrSchedule({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  const { showZero } = usePrintSettings();
  const f    = (n: number) => fmtZ(n, showZero);
  const fR   = (n: number) => fmtRZ(n, showZero);
  const fAcc = (n: number) => fmtAccZ(n, showZero);
  const ncols = years.length + 1;
  const isCcOnly = data[0]?.isCcOnly ?? false;
  const avgDscr = isCcOnly ? 0 : data.reduce((acc, d) => acc + d.dscr, 0) / data.length;
  const avgIcr  = data.reduce((acc, d) => acc + (d.icr ?? (d.ebitda / Math.max(d.interest, 1))), 0) / data.length;

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 12</div>
          <h3 className="report-section-title">
            {isCcOnly ? 'Interest Coverage Ratio (ICR) — CC / OD Facility' : 'Debt Service Coverage Ratio (DSCR)'}
          </h3>
          <p className="report-section-subtitle">
            {isCcOnly ? 'No Term Loan — DSCR not applicable; ICR shown instead' : 'Detailed Schedule of Repayment Capacity'}
          </p>
        </div>
        <span className="badge badge-emerald">Liquid Coverage</span>
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
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>A. Cash Accruals (Sources of Funds)</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Net Profit after Tax (PAT)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.netProfit)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Add: Depreciation (Non-Cash)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.depnYr)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Add: Interest on Term Loans / CC</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.interest)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Cash Accruals (1+2+3)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.netProfit + d.depnYr + d.interest)}</td>)}
            </tr>

            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>B. Debt Obligations (Applications)</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Interest on Term Loans / Working Capital</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.interest)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Repayment of Term Loan Installments</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.tlRepayment)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Debt Service (4+5)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.interest + d.tlRepayment)}</td>)}
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>
                {isCcOnly ? 'Interest Coverage Ratio (ICR)' : 'Debt Service Coverage Ratio (DSCR)'}
              </td>
              {data.map((d) => (
                <td key={d.year} className={s.tdValue}>
                  {isCcOnly
                    ? fR(d.icr ?? (d.ebitda / Math.max(d.interest, 1)))
                    : fR(d.dscr)}
                </td>
              ))}
            </tr>

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                {isCcOnly ? 'Weighted Average ICR' : 'Weighted Average DSCR'}
              </td>
              <td colSpan={data.length} className={s.tdValue}>
                {fR(isCcOnly ? avgIcr : avgDscr)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
