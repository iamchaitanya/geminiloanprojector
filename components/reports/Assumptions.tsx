// components/reports/Assumptions.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";
import s from "./shared.module.css";

export default function Assumptions({ data }: { data: ProjectedYear[] }) {
  const years = data.map((d) => `FY ${d.year}`);
  const ncols = years.length + 1;

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Schedule A</div>
          <h3 className="report-section-title">Basis of Projections &amp; Parameters</h3>
          <p className="report-section-subtitle">Comprehensive Logical Assumptions &amp; Capacity Analysis</p>
        </div>
        <span className="badge badge-emerald">Audit Compliant</span>
      </div>

      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "48px" }}>

        {/* I. OPERATIONAL GROWTH */}
        <section>
          <h4 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px" }}>
            I. Operational Growth Assumptions
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <colgroup>
                <col style={{ width: "32%" }} />
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
                <tr>
                  <td className={s.tdParticulars}>
                    <span style={{ marginLeft: '40px', display: 'inline-block' }}>Revenue Growth Rate (%)</span>
                  </td>
                  {data.map((d, i) => {
                    const growth = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
                    return <td key={i} className={s.tdValue} style={{ fontWeight: "700" }}>{i === 0 ? "Base Year" : `${fmtR(growth)}%`}</td>;
                  })}
                </tr>
                <tr>
                  <td className={s.tdParticulars}>
                    <span style={{ marginLeft: '40px', display: 'inline-block' }}>Direct Cost (Purchases) Growth (%)</span>
                  </td>
                  {data.map((d, i) => {
                    const growth = i === 0 ? 0 : ((d.purchases / data[i - 1].purchases) - 1) * 100;
                    return <td key={i} className={s.tdValue}>{i === 0 ? "Base Year" : `${fmtR(growth)}%`}</td>;
                  })}
                </tr>
                <tr className={s.subtotalRow} style={{ borderTop: '2.5px solid #000', borderBottom: '2.5px solid #000' }}>
                  <td className={s.tdParticulars}>
                    <span style={{ fontWeight: 800, marginLeft: '20px', display: 'inline-block' }}>EBITDA Margin (%)</span>
                  </td>
                  {data.map((d, i) => (
                    <td key={i} className={s.tdValue} style={{ fontWeight: 800 }}>{fmtR((d.ebitda / d.sales) * 100)}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* II. CAPACITY UTILIZATION */}
        <section>
          <h4 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px" }}>
            II. Capacity Utilization (Financial Terms)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
            <div style={{ overflowX: "auto" }}>
              <table className={s.table}>
                <colgroup>
                  <col style={{ width: "55%" }} />
                  {years.map((y) => <col key={y} />)}
                </colgroup>
                <thead>
                  <tr>
                    <th className={s.colParticulars}>Particulars</th>
                    {years.map((y) => <th key={y} style={{ textAlign: "center" }}>{y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={s.tdParticulars}>
                      <span style={{ marginLeft: '40px', display: 'inline-block' }}>Projected Sales (Utilized Capacity)</span>
                    </td>
                    {data.map((d, i) => <td key={i} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(d.sales)}</td>)}
                  </tr>
                  <tr>
                    <td className={s.tdParticulars}>
                      <span style={{ marginLeft: '40px', display: 'inline-block' }}>Max Sales Potential (100% Capacity)</span>
                    </td>
                    {data.map((d, i) => {
                      const cap100 = d.sales / (d.capacityUtil / 100);
                      return <td key={i} className={s.tdValue} style={{ fontWeight: "700" }}>{fmt(cap100)}</td>;
                    })}
                  </tr>
                  <tr className={s.totalRow} style={{ borderTop: '2.5px solid #000', borderBottom: '3.5px double #000' }}>
                    <td className={s.tdParticulars} style={{ fontWeight: 800 }}>CAPACITY UTILIZATION (%)</td>
                    {data.map((d, i) => <td key={i} className={s.tdValue} style={{ fontWeight: 800 }}>{fmtR(d.capacityUtil)}%</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ border: "1px solid #000", padding: "16px", fontFamily: '"Times New Roman", Times, serif', fontSize: "11px", lineHeight: 1.6 }}>
              <strong style={{ display: "block", fontSize: "10px", textTransform: "uppercase", marginBottom: "8px" }}>Technical Feasibility Note</strong>
              * The projected growth is underpinned by existing installed infrastructure.
              Utilization levels are maintained within the optimal banking threshold of 70-85% for standard units.
              Any utilization above 90% is subject to verification of proposed Capital Expenditure (Capex).
            </div>
          </div>
        </section>

        {/* III. WORKING CAPITAL CYCLE */}
        <section>
          <h4 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px" }}>
            III. Working Capital Cycle Assumptions
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: "16px" }}>
            {data.map((d, i) => (
              <div key={i} style={{ border: "1px solid #000", padding: "14px", fontFamily: '"Times New Roman", Times, serif', fontSize: "11px" }}>
                <div style={{ fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "8px", marginBottom: "16px" }}>
                  Operating Cycle: {years[i]}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Inventory Holding:</span>
                    <strong>{fmtR(d.inventory / (d.purchases / 12))} Mo.</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Debtors Collection:</span>
                    <strong>{Math.round(d.debtors / (d.sales / 365))} Days</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Creditors Payment:</span>
                    <strong>{Math.round(d.creditors / (d.purchases / 365))} Days</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}