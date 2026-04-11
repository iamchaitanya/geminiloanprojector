// components/reports/forms/Form4.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";
import s from "../shared.module.css";

export default function Form4({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
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
          <div className="report-section-num">Form IV</div>
          <h3 className="report-section-title">Comparative Statement of Current Assets &amp; Liabilities</h3>
          <p className="report-section-subtitle">CMA Form IV</p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead><tr><th className={s.colParticulars}>Particulars</th>{YH}</tr></thead>
          <tbody>
            {/* I. CURRENT ASSETS */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>I. CURRENT ASSETS</td>
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Raw Materials (Stores & Spares)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.rawMaterials)}</td>)}
            </tr>
            <tr className={s.subRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>i) Imported</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(0)}</td>)}
            </tr>
            <tr className={s.subRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>ii) Indigenous</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.rawMaterials)}</td>)}
            </tr>
            <tr className={s.infoRow} style={{ background: '#f9f9f9' }}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Holding Period (Months Consumption)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmtR(d.inventory / Math.max(d.purchases / 12, 1))} Mo</td>)}
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Stocks-in-Process</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.stockInProcess)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Finished Goods</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.finishedGoods)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Other Spares (Consumables)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(0)}</td>)}
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Receivables (Incl. Bills Discounted)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.debtors)}</td>)}
            </tr>
            <tr className={s.subRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>i) Up to 6 months (Liquid)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr className={s.subRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>ii) More than 6 months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.debtorsOver6M)}</td>)}
            </tr>
            <tr className={s.infoRow} style={{ background: '#f9f9f9' }}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Collection Period (Days Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{Math.round(d.debtors / Math.max(d.sales / 365, 1))} Days</td>)}
            </tr>

            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Advances To Suppliers / Advance Taxes</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.loansAdv)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>7) Other current assets (Incl. Cash/Bank)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cashBank + d.reconAdj)}</td>)}
            </tr>

            <tr className={s.subtotalRow} style={{ borderTop: '2.5px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>8) TOTAL CURRENT ASSETS (1 to 7)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.totalCA)}</td>)}
            </tr>

            {/* II. CURRENT LIABILITIES */}
            <tr className={s.sectionRow}>
              <td colSpan={ncols} style={{ textAlign: 'left', fontWeight: 800 }}>II. CURRENT LIABILITIES (EXCL. BANK)</td>
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>9) Creditors For Purchases</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.creditors)}</td>)}
            </tr>
            <tr className={s.infoRow} style={{ background: '#f9f9f9' }}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Payment Period (Days Purchases)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{Math.round(d.creditors / Math.max(d.purchases / 365, 1))} Days</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>10) Advances from customers</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(0)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>11) Installments of Term Loans (CMLTD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.cmltd)}</td>)}
            </tr>
            <tr>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>12) Statutory & Other Provisions</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(d.statutoryDues + d.otherCL + d.tax)}</td>)}
            </tr>
            <tr className={s.subtotalRow} style={{ borderTop: '2.5px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>13) TOTAL CURRENT LIABILITIES (9 to 12)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.totalCL)}</td>)}
            </tr>

            {/* III. WORKING CAPITAL ANALYSIS */}
            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', background: '#f5f5f5' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900 }}>14) WORKING CAPITAL GAP (8 - 13)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>15) ACTUAL / PROJECTED NET WORKING CAPITAL</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 800 }}>{fmt(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
            </tr>
            <tr className={s.infoRow} style={{ borderTop: '2px solid #000' }}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Nayak Committee (20% of Projected Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fmt(Math.floor(d.sales * 0.20))}</td>)}
            </tr>
            <tr className={s.totalRow} style={{ borderTop: '3px solid #000', borderBottom: '3px double #000', background: '#eef2ff' }}>
              <td className={s.tdParticulars} style={{ fontWeight: 900, fontSize: '12pt' }}>ASSESSED BANK FINANCE</td>
              {data.map((d) => <td key={d.year} className={s.tdValue} style={{ fontWeight: 900 }}>{fmt(Math.floor(d.sales * 0.20))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}