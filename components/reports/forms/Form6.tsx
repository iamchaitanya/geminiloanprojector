// components/reports/forms/Form6.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt } from "../../../lib/format";
import s from "../shared.module.css";

export default function Form6({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  // Zero baseline — represents the pre-loan opening position (Year 0)
  const zero: ProjectedYear = {
    year: 0, fyLabel: '', sales: 0, otherInc: 0, totalRev: 0, openStock: 0, purchases: 0,
    indirectExpenses: [], totalIndExp: 0, closingStock: 0, totalCosts: 0, grossProfit: 0,
    gpRatio: 0, depnYr: 0, profitBeforeInt: 0, interest: 0, profitBeforeTax: 0, tax: 0,
    netProfit: 0, npRatio: 0, ebitda: 0,
    capital: 0, quasiEquity: 0, unsecured: 0, bankBorrowings: 0, termLoan: 0, cmltd: 0,
    tlRepayment: 0, creditors: 0, statutoryDues: 0, otherCL: 0, totalCL: 0, totalLiab: 0,
    grossFA: 0, accDepn: 0, netFA: 0, inventory: 0, rawMaterials: 0, stockInProcess: 0,
    finishedGoods: 0, debtorsUnder6M: 0, debtorsOver6M: 0, debtors: 0, cashBank: 0,
    loansAdv: 0, reconAdj: 0, totalCA: 0, totalAssets: 0,
    currentRatio: 0, currentRatioExBank: 0, dscr: 0, assessedDebtService: 0,
    debtServiceBuffer: 0, deRatio: 0, tolTnw: 0, bepPercentage: 0, facr: 0, capacityUtil: 0,
  };

  // prev(i) returns the year before data[i]; for i=0 use the zero baseline
  const prev = (i: number): ProjectedYear => (i === 0 ? zero : data[i - 1]);

  const periodHeaders = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));
  const ncols = years.length + 1;

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Form VI</div>
          <h3 className="report-section-title">Funds Flow Statement (Comparison of Projections)</h3>
          <p className="report-section-subtitle">CMA Form VI</p>
        </div>
        <span className="badge badge-emerald">Anti-Diversion Audit v4.0</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead>
            <tr>
              <th className={s.colParticulars} style={{ textAlign: 'left' }}>Particulars</th>
              {periodHeaders}
            </tr>
          </thead>
          <tbody>
            {/* A. SOURCES */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>A. Sources of Funds</td></tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Net Profit after Tax (PAT)</span>
              </td>
              {data.map((d, i) => <td key={i} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Add: Depreciation (Non-Cash)</span>
              </td>
              {data.map((d, i) => <td key={i} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Increase in Capital / Proprietor&apos;s Funds</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const diff = d.capital - (p.capital + d.netProfit);
                return <td key={i} className={s.tdValue}>{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Increase in Term Loans / Unsecured Loans</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const ti = Math.max(0, d.termLoan - p.termLoan + d.tlRepayment);
                const ui = Math.max(0, d.unsecured - p.unsecured);
                return <td key={i} className={s.tdValue}>{fmt(ti + ui)}</td>;
              })}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Sale / Decrease in Fixed Assets</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const diff = p.grossFA - d.grossFA;
                return <td key={i} className={s.tdValue}>{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Sources (A)</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const ci = Math.max(d.capital - (p.capital + d.netProfit), 0);
                const ti = Math.max(0, d.termLoan - p.termLoan + d.tlRepayment) + Math.max(0, d.unsecured - p.unsecured);
                const fd = Math.max(p.grossFA - d.grossFA, 0);
                return <td key={i} className={s.tdValue}>{fmt(d.netProfit + d.depnYr + ci + ti + fd)}</td>;
              })}
            </tr>

            {/* B. APPLICATIONS */}
            <tr className={s.sectionHeader}><td colSpan={ncols}>B. Application of Funds</td></tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Capital Expenditure (Increase in Fixed Assets)</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const diff = d.grossFA - p.grossFA;
                return <td key={i} className={s.tdValue}>{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>7) Repayment of Term Loans / Unsecured Loans</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const ud = Math.max(0, p.unsecured - d.unsecured);
                return <td key={i} className={s.tdValue}>{fmt(d.tlRepayment + ud)}</td>;
              })}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>8) Dividend / Proprietor&apos;s Drawings</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const drawings = Math.max((p.capital + d.netProfit) - d.capital, 0);
                return <td key={i} className={s.tdValue}>{fmt(drawings)}</td>;
              })}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Applications (B)</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const fi = Math.max(d.grossFA - p.grossFA, 0);
                const td2 = d.tlRepayment + Math.max(0, p.unsecured - d.unsecured);
                const dr = Math.max((p.capital + d.netProfit) - d.capital, 0);
                return <td key={i} className={s.tdValue}>{fmt(fi + td2 + dr)}</td>;
              })}
            </tr>

            {/* RECONCILIATION */}
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>C. Net Increase / (Decrease) in NWC (A - B)</td>
              {data.map((d, i) => {
                const p = prev(i);
                const ci = Math.max(d.capital - (p.capital + d.netProfit), 0);
                const ti = Math.max(0, d.termLoan - p.termLoan + d.tlRepayment) + Math.max(0, d.unsecured - p.unsecured);
                const fd = Math.max(p.grossFA - d.grossFA, 0);
                const totalA = d.netProfit + d.depnYr + ci + ti + fd;
                const fi = Math.max(d.grossFA - p.grossFA, 0);
                const td2 = d.tlRepayment + Math.max(0, p.unsecured - d.unsecured);
                const dr = Math.max((p.capital + d.netProfit) - d.capital, 0);
                const totalB = fi + td2 + dr;
                return <td key={i} className={s.tdValue}>{fmt(totalA - totalB)}</td>;
              })}
            </tr>

            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Actual Change in NWC (Verified from Form III)</span>
              </td>
              {data.map((d, i) => {
                const p = prev(i);
                const prevNWC = p.totalCA - (p.totalCL + p.bankBorrowings);
                const currNWC = d.totalCA - (d.totalCL + d.bankBorrowings);
                return <td key={i} className={s.tdValue}>{fmt(currNWC - prevNWC)}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}