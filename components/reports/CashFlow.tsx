// components/reports/CashFlow.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtAcc } from "../../lib/format";
import s from "./shared.module.css";
import own from "./CashFlow.module.css";

export default function CashFlow({ data, years, loanAmount }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 1;

  const yearHeaders = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));

  const wcDiff = (key: keyof ProjectedYear) =>
    data.map((d, i) => (i === 0 ? (d[key] as number) : (d[key] as number) - (data[i - 1][key] as number)));

  const debtorDiffs = wcDiff("debtors");
  const inventDiffs = wcDiff("inventory");
  const credDiffs   = wcDiff("creditors");
  const otherCLDiffs = wcDiff("otherCL");

  // A. Operating Flows (Indirect Method)
  const cfA = data.map((d, i) =>
    d.netProfit + d.depnYr + d.interest
    - debtorDiffs[i] - inventDiffs[i]
    + credDiffs[i] + otherCLDiffs[i]
  );

  // B. Investing Flows
  const capex = data.map((d, i) => (i === 0 ? d.grossFA : d.grossFA - data[i - 1].grossFA));
  const cfB = capex.map((c) => -c);

  // C. Financing Flows
  const ccDiffs = data.map((d, i) => (i === 0 ? d.bankBorrowings : d.bankBorrowings - data[i - 1].bankBorrowings));
  const tlProceeds = data.map((d, i) => (i === 0 ? d.termLoan + d.cmltd : Math.max(0, (d.termLoan + d.cmltd) - (data[i - 1].termLoan + data[i - 1].cmltd) + d.tlRepayment)));
  const tlRepayments = data.map(d => d.tlRepayment);
  
  const unsecDiffs = data.map((d, i) => (i === 0 ? d.unsecured : d.unsecured - data[i - 1].unsecured));
  const quasiDiffs = data.map((d, i) => (i === 0 ? d.quasiEquity : d.quasiEquity - data[i - 1].quasiEquity));
  
  // Drawings = Profit - Change in Capital + (Initial Stake if Y1)
  // Actually, Change in Capital = Profit - Drawings + Injection
  // For Y1: Injection = d.capital + drawings - d.netProfit
  const drawings = data.map((d, i) => {
    const capDelta = i === 0 ? d.capital : d.capital - data[i - 1].capital;
    if (i === 0) {
      // In Y1, we assume drawings follow the engine's ratio (~70% of profit)
      // And the remainder of the capital delta is the "Initial Stake"
      const estDrawings = Math.round(d.netProfit * 0.75); 
      return estDrawings;
    }
    // In Y2+, delta = profit - drawings
    return Math.max(0, d.netProfit - capDelta);
  });

  const initialStake = data.map((d, i) => {
    if (i !== 0) return 0;
    // Initial Stake = Capital Y1 - Profit Y1 + Drawings Y1
    return d.capital - d.netProfit + drawings[0];
  });

  const cfC = data.map((d, i) => 
    ccDiffs[i] + tlProceeds[i] - tlRepayments[i] 
    + unsecDiffs[i] + quasiDiffs[i] + initialStake[i] - drawings[i]
  );

  const netCash = data.map((_, i) => cfA[i] + cfB[i] + cfC[i]);

  return (
    <div className="report-section-wrapper">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 4</div>
          <h3 className="report-section-title">Cash Flow Statement (Indirect Method)</h3>
          <p className="report-section-subtitle">As per AS-3 Revised Format</p>
        </div>
        <span className="badge badge-emerald">CASH FLOW</span>
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
            {/* A. OPERATING ACTIVITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>A. Cash Flow from Operating Activities</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Net Profit after Tax</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Add: Depreciation (Non-Cash)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Add: Interest Charged Back</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Working Capital Adjustments:</span>
              </td>
              {years.map((y) => <td key={y} />)}
            </tr>
            <tr className={s.adjustRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>i) (Increase) / Decrease in Debtors</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(-debtorDiffs[i])}</td>)}
            </tr>
            <tr className={s.adjustRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>ii) (Increase) / Decrease in Inventory</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(-inventDiffs[i])}</td>)}
            </tr>
            <tr className={s.adjustRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>iii) Increase / (Decrease) in Creditors</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(credDiffs[i])}</td>)}
            </tr>
            <tr className={s.adjustRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>iv) Increase / (Decrease) in Other CL</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(otherCLDiffs[i])}</td>)}
            </tr>

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Net Cash from Operating Activities (A)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmt(cfA[i])}</td>)}
            </tr>

            <tr className={`${s.spacerRow} ${own.spacerRow}`}><td colSpan={ncols} /></tr>

            {/* B. INVESTING ACTIVITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>B. Cash Flow from Investing Activities</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Purchase of Fixed Assets / Capex</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(capex[i])})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Net Cash from Investing Activities (B)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(capex[i])})</td>)}
            </tr>

            <tr className={`${s.spacerRow} ${own.spacerRow}`}><td colSpan={ncols} /></tr>

            {/* C. FINANCING ACTIVITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>C. Cash Flow from Financing Activities</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Cash Credit Limit Availed</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(ccDiffs[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Term Loan Proceeds</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(tlProceeds[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Less: Term Loan Repayments</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(tlRepayments[i])})</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Increase / (Decrease) in Unsecured Loans</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(unsecDiffs[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Increase / (Decrease) in Quasi-Equity</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(quasiDiffs[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Proprietor&apos;s Initial Capital Stake</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(initialStake[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>7) Proprietor&apos;s Drawings / Withdrawals</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(drawings[i])})</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Net Cash from Financing Activities (C)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(cfC[i])}</td>)}
            </tr>

            <tr className={`${s.spacerRow} ${own.spacerRow}`}><td colSpan={ncols} /></tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Net Increase / (Decrease) in Cash (A + B + C)</td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmtAcc(netCash[i])}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Add: Opening Cash &amp; Bank Balance</span>
              </td>
              {data.map((d, i) => (
                <td key={d.year} className={s.tdValue}>
                  {fmt(i === 0 ? 0 : data[i - 1].cashBank)}
                </td>
              ))}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Closing Cash &amp; Bank Balance</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cashBank)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
