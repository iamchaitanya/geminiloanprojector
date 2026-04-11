// components/reports/Depreciation.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt } from "../../lib/format";
import s from "./shared.module.css";
import own from "./Depreciation.module.css";

const ASSET_SPLITS: Record<string, { building: number; plant: number; furniture: number; computer: number }> = {
  trading:       { building: 0.00, plant: 0.55, furniture: 0.30, computer: 0.15 },
  service:       { building: 0.00, plant: 0.35, furniture: 0.40, computer: 0.25 },
  manufacturing: { building: 0.25, plant: 0.55, furniture: 0.10, computer: 0.10 },
  construction:  { building: 0.15, plant: 0.60, furniture: 0.15, computer: 0.10 },
};

const RATES = { building: 0.10, plant: 0.15, furniture: 0.10, computer: 0.40 };

interface AssetRow {
  label: string; rate: number; openWDV: number; additions: number;
  total: number; depn: number; closeWDV: number;
}

function buildSchedule(data: ProjectedYear[]): AssetRow[][] {
  const firstYear = data[0];
  let segment = "trading";
  if (firstYear.rawMaterials > 0 && firstYear.stockInProcess > 0) segment = "manufacturing";
  else if (firstYear.rawMaterials > 0) segment = "construction";
  else if (firstYear.inventory > 0 && firstYear.finishedGoods === firstYear.inventory) {
    if (firstYear.grossFA / firstYear.sales < 0.12) segment = "service";
  }

  const splits = ASSET_SPLITS[segment] || ASSET_SPLITS.trading;
  const allYears: AssetRow[][] = [];
  let bldgWDV = 0, plantWDV = 0, furnWDV = 0, compWDV = 0;

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const openingWDV = d.netFA + d.depnYr;

    if (i === 0) {
      bldgWDV  = Math.round(openingWDV * splits.building);
      plantWDV = Math.round(openingWDV * splits.plant);
      furnWDV  = Math.round(openingWDV * splits.furniture);
      compWDV  = openingWDV - bldgWDV - plantWDV - furnWDV;
    }

    const bldgDepn  = Math.round(bldgWDV  * RATES.building);
    const plantDepn = Math.round(plantWDV * RATES.plant);
    const furnDepn  = Math.round(furnWDV  * RATES.furniture);
    const compDepn  = Math.round(compWDV  * RATES.computer);
    const rawTotalDepn = bldgDepn + plantDepn + furnDepn + compDepn;

    const scale = rawTotalDepn > 0 ? d.depnYr / rawTotalDepn : 1;
    const adjBldgDepn  = Math.round(bldgDepn  * scale);
    const adjPlantDepn = Math.round(plantDepn * scale);
    const adjFurnDepn  = Math.round(furnDepn  * scale);
    const adjCompDepn  = d.depnYr - adjBldgDepn - adjPlantDepn - adjFurnDepn;

    const additions = { building: 0, plant: 0, furniture: 0, computer: 0 };
    if (i > 0) {
      const addnTotal = Math.max(d.grossFA - data[i - 1].grossFA, 0);
      if (addnTotal > 0) {
        additions.building  = Math.round(addnTotal * splits.building);
        additions.plant     = Math.round(addnTotal * splits.plant);
        additions.furniture = Math.round(addnTotal * splits.furniture);
        additions.computer  = addnTotal - additions.building - additions.plant - additions.furniture;
      }
    }

    const rows: AssetRow[] = [
      { label: "Building / Civil Works",  rate: RATES.building  * 100, openWDV: bldgWDV,  additions: additions.building,  total: bldgWDV  + additions.building,  depn: adjBldgDepn,  closeWDV: bldgWDV  + additions.building  - adjBldgDepn  },
      { label: "Plant & Machinery",        rate: RATES.plant     * 100, openWDV: plantWDV, additions: additions.plant,     total: plantWDV + additions.plant,     depn: adjPlantDepn, closeWDV: plantWDV + additions.plant     - adjPlantDepn },
      { label: "Furniture & Fixtures",     rate: RATES.furniture * 100, openWDV: furnWDV,  additions: additions.furniture, total: furnWDV  + additions.furniture, depn: adjFurnDepn,  closeWDV: furnWDV  + additions.furniture - adjFurnDepn  },
      { label: "Computers / Software",     rate: RATES.computer  * 100, openWDV: compWDV,  additions: additions.computer,  total: compWDV  + additions.computer,  depn: adjCompDepn,  closeWDV: compWDV  + additions.computer  - adjCompDepn  },
    ];
    allYears.push(rows);

    bldgWDV  = rows[0].closeWDV;
    plantWDV = rows[1].closeWDV;
    furnWDV  = rows[2].closeWDV;
    compWDV  = rows[3].closeWDV;
  }

  return allYears;
}

export default function Depreciation({ data, years }: { data: ProjectedYear[]; years: string[] }) {
  const schedule = buildSchedule(data);

  return (
    <div className="report-section-wrapper bg-white">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Section 11</div>
          <h3 className="report-section-title">Depreciation Schedule (WDV Method)</h3>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {data.map((yearData, idx) => {
          const rows = schedule[idx];
          const totals = {
            openWDV:   rows.reduce((acc, r) => acc + r.openWDV, 0),
            additions: rows.reduce((acc, r) => acc + r.additions, 0),
            total:     rows.reduce((acc, r) => acc + r.total, 0),
            depn:      rows.reduce((acc, r) => acc + r.depn, 0),
            closeWDV:  rows.reduce((acc, r) => acc + r.closeWDV, 0),
          };

          return (
            <div key={idx} style={{ border: "1px solid #000" }}>
              <div style={{
                borderBottom: "1px solid #000", padding: "8px 6px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontFamily: '"Times New Roman", Times, serif', fontSize: "11px",
              }}>
                <strong style={{ textTransform: "uppercase" }}>Schedule for Financial Year: {years[idx]}</strong>
                <span style={{ fontSize: "9px", fontWeight: "bold" }}>Income Tax Act Rates</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className={`${s.table} ${own.table}`} style={{ border: "none" }}>
                  <colgroup>
                    <col className={own.colAsset} />
                    <col className={own.colRate} />
                    <col /><col /><col /><col /><col />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className={s.colParticulars} style={{ textAlign: "left" }}>Particulars of Assets</th>
                      <th style={{ textAlign: "center" }}>Rate (%)</th>
                      <th style={{ textAlign: "center" }}>Opening WDV</th>
                      <th style={{ textAlign: "center" }}>Additions</th>
                      <th style={{ textAlign: "center" }}>Total</th>
                      <th style={{ textAlign: "center" }}>Depreciation</th>
                      <th style={{ textAlign: "center" }}>Closing WDV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const fmtC = (val: string) => {
                        if (val === "—") return <div style={{ textAlign: "center" }}>—</div>;
                        return (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: "44px", display: "flex", justifyContent: "flex-end" }}>
                              <span style={{ whiteSpace: "nowrap" }}>{val}</span>
                            </div>
                          </div>
                        );
                      };

                      const fmtRate = (val: string) => {
                        if (val === "—") return <div style={{ textAlign: "center" }}>—</div>;
                        return (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: "24px", display: "flex", justifyContent: "flex-end" }}>
                              <span style={{ whiteSpace: "nowrap" }}>{val}</span>
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {rows.map((row, ri) => (
                            <tr key={ri} className={s.detailRow}>
                              <td className={s.tdParticulars}>
                                <span style={{ marginLeft: '40px', display: 'inline-block' }}>{row.label}</span>
                              </td>
                              <td className={s.tdValue}>{fmtRate(row.rate + "%")}</td>
                              <td className={s.tdValue}>{fmtC(fmt(row.openWDV))}</td>
                              <td className={s.tdValue}>{fmtC(row.additions > 0 ? fmt(row.additions) : "—")}</td>
                              <td className={s.tdValue}>{fmtC(fmt(row.total))}</td>
                              <td className={s.tdValue} style={{ fontWeight: "700" }}>{fmtC(fmt(row.depn))}</td>
                              <td className={s.tdValue}>{fmtC(fmt(row.closeWDV))}</td>
                            </tr>
                          ))}
                          <tr className={s.subtotalRow} style={{ borderTop: '2px solid #000', borderBottom: '3px double #000' }}>
                            <td className={s.tdParticulars} style={{ fontWeight: 800 }}>Total Assets — Depreciation Schedule</td>
                            <td className={s.tdValue}>{fmtRate("—")}</td>
                            <td className={s.tdValue} style={{ fontWeight: 800 }}>{fmtC(fmt(totals.openWDV))}</td>
                            <td className={s.tdValue} style={{ fontWeight: 800 }}>{fmtC(totals.additions > 0 ? fmt(totals.additions) : "—")}</td>
                            <td className={s.tdValue} style={{ fontWeight: 800 }}>{fmtC(fmt(totals.total))}</td>
                            <td className={s.tdValue} style={{ fontWeight: 800 }}>{fmtC(fmt(totals.depn))}</td>
                            <td className={s.tdValue} style={{ fontWeight: 800 }}>{fmtC(fmt(totals.closeWDV))}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <div className="no-print" style={{
          border: "1px solid #000", padding: "12px",
          fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", lineHeight: 1.6,
        }}>
          * Note: Depreciation is calculated on the Written Down Value (WDV) method at the beginning of each financial year.
          Rates are based on Income Tax Act guidelines. Asset categories are allocated based on the nature of business operations.
        </div>
      </div>
    </div>
  );
}
