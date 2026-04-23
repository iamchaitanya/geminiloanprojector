// components/reports/forms/Form4.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmtZ, fmtRZ, fmtAccZ } from "../../../lib/format";
import { usePrintSettings } from "../../../lib/PrintSettingsContext";
import s from "../shared.module.css";

export default function Form4({ data, years }: { data: ProjectedYear[]; years: string[]; loanAmount: number }) {
  const { showZero } = usePrintSettings();
  const f    = (n: number) => fmtZ(n, showZero);
  const fR   = (n: number) => fmtRZ(n, showZero);
  const fAcc = (n: number) => fmtAccZ(n, showZero);
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
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>I. Current Assets</td>
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Raw Materials (Stores &amp; Spares)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.rawMaterials)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>i) Imported</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(0)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>ii) Indigenous</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.rawMaterials)}</td>)}
            </tr>
            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Holding Period (Months Consumption)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{fR(d.inventory / Math.max(d.purchases / 12, 1))} Mo</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Stocks-in-Process</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.stockInProcess)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Finished Goods</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.finishedGoods)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>4) Other Spares (Consumables)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(0)}</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>5) Receivables (Incl. Bills Discounted)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.debtors)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>i) Up to 6 months (Liquid)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '64px', display: 'inline-block' }}>ii) More than 6 months</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.debtorsOver6M)}</td>)}
            </tr>
            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Collection Period (Days Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{Math.round(d.debtors / Math.max(d.sales / 365, 1))} Days</td>)}
            </tr>

            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>6) Advances To Suppliers / Advance Taxes</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.loansAdv)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>7) Other current assets (Incl. Cash/Bank)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.cashBank + d.reconAdj)}</td>)}
            </tr>

            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>8) Total Current Assets (1 to 7)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.totalCA)}</td>)}
            </tr>

            {/* II. CURRENT LIABILITIES */}
            <tr className={s.sectionHeader}>
              <td colSpan={ncols}>II. Current Liabilities (Excl. Bank)</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>9) Creditors For Purchases</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.creditors)}</td>)}
            </tr>
            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Payment Period (Days Purchases)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{Math.round(d.creditors / Math.max(d.purchases / 365, 1))} Days</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>10) Advances from customers</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(0)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>11) Installments of Term Loans (CMLTD)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.cmltd)}</td>)}
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>12) Statutory &amp; Other Provisions</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.statutoryDues + d.otherCL + d.tax)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>13) Total Current Liabilities (9 to 12)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.totalCL)}</td>)}
            </tr>

            {/* III. WORKING CAPITAL ANALYSIS */}
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>14) Working Capital Gap (8 - 13)</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.totalCA - d.totalCL)}</td>)}
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>15) Actual / Projected Net Working Capital</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
            </tr>
            <tr className={s.infoRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>Nayak Committee (20% of Projected Sales)</span>
              </td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(Math.floor(d.sales * 0.20))}</td>)}
            </tr>
            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Assessed Bank Finance</td>
              {data.map((d) => <td key={d.year} className={s.tdValue}>{f(Math.floor(d.sales * 0.20))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}