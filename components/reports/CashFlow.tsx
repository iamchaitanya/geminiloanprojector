// components/reports/CashFlow.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtAcc } from "../../lib/format";
import s from "./CashFlow.module.css";

export default function CashFlow({ data, years, loanAmount }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const ncols = years.length + 1;

  const yearHeaders = years.map((y) => (
    <th key={y} style={{ textAlign: "center" }}>
      {y.includes("\n") ? y.split("\n").map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>) : y}
    </th>
  ));

  // Helpers to avoid repeating WC diff logic
  const wcDiff = (key: keyof ProjectedYear) =>
    data.map((d, i) => (i === 0 ? (d[key] as number) : (d[key] as number) - (data[i - 1][key] as number)));

  const debtorDiffs = wcDiff("debtors");
  const inventDiffs = wcDiff("inventory");
  const credDiffs   = wcDiff("creditors");
  const otherCLDiffs = wcDiff("otherCL");

  const cfA = data.map((d, i) =>
    d.netProfit + d.depnYr + d.interest
    - debtorDiffs[i] - inventDiffs[i]
    + credDiffs[i] + otherCLDiffs[i]
  );

  const capex = data.map((d, i) => (i === 0 ? d.grossFA : d.grossFA - data[i - 1].grossFA));
  const cfB = capex.map((c) => -c);

  const drawings = data.map((d, i) =>
    i === 0
      ? d.netProfit - d.capital + loanAmount
      : d.netProfit - (d.capital - data[i - 1].capital)
  );
  const cfC = data.map((d, i) => (i === 0 ? loanAmount : 0) - Math.abs(drawings[i]));

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
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
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
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>A. CASH FLOW FROM OPERATING ACTIVITIES</td>
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Net Profit after Tax</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.netProfit)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Add: Depreciation (non-cash)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.depnYr)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Add: Interest Charged Back</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.interest)}</td>)}
            </tr>

            {/* Working capital adjustments */}
            <tr>
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

            <tr className={s.subtotalRow} style={{ borderBottom: '3px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>NET CASH FROM OPERATING ACTIVITIES (A)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(cfA[i])}</td>)}
            </tr>

            <tr className={s.spacerRow} style={{ height: '24px' }}><td colSpan={ncols} /></tr>

            {/* B. INVESTING ACTIVITIES */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>B. CASH FLOW FROM INVESTING ACTIVITIES</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Purchase of Fixed Assets / Capex</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(capex[i])})</td>)}
            </tr>
            <tr className={s.subtotalRow} style={{ borderBottom: '3px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>NET CASH FROM INVESTING ACTIVITIES (B)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>({fmt(capex[i])})</td>)}
            </tr>

            <tr className={s.spacerRow} style={{ height: '24px' }}><td colSpan={ncols} /></tr>

            {/* C. FINANCING ACTIVITIES */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>C. CASH FLOW FROM FINANCING ACTIVITIES</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) CC Limit Availed / Loan Received</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>{fmt(i === 0 ? loanAmount : 0)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Proprietor's Drawings / Withdrawals</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue}>({fmt(Math.abs(drawings[i]))})</td>)}
            </tr>
            <tr className={s.subtotalRow} style={{ borderBottom: '3px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>NET CASH FROM FINANCING ACTIVITIES (C)</span>
              </td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmtAcc(cfC[i])}</td>)}
            </tr>

            <tr className={s.spacerRow} style={{ height: '32px' }}><td colSpan={ncols} /></tr>

            {/* RECONCILIATION */}
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars} style={{ fontWeight: 800 }}>NET INCREASE / (DECREASE) IN CASH (A + B + C)</td>
              {data.map((d, i) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmtAcc(netCash[i])}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Add: Opening Cash &amp; Bank Balance</span>
              </td>
              {data.map((d, i) => (
                <td key={d.year} className={s.tdValue}>
                  {fmt(i === 0 ? d.sales * 0.02 : data[i - 1].cashBank)}
                </td>
              ))}
            </tr>
            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', borderBottom: '3px double #000' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900, fontSize: '12pt' }}>CLOSING CASH &amp; BANK BALANCE</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmt(d.cashBank)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}