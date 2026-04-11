// components/reports/forms/Form1.tsx
import { fmt } from "../../../lib/format";
import s from "../shared.module.css";

interface Form1Props {
  bizName: string; propName: string;
  proposedCc: number; proposedTl: number;
  existingCc: number; existingTl: number;
}

export default function Form1({ proposedCc, proposedTl, existingCc, existingTl }: Form1Props) {
  const totalExisting = existingCc + existingTl;
  const totalProposed = proposedCc + proposedTl;

  // No ₹ prefix — matches the rest of the report
  const fmtV = (v: number) => (v > 0 ? fmt(v) : "0");

  return (
    <div className="report-section-wrapper font-sans">
      <div className="report-section-header">
        <div>
          <div className="report-section-num">Form I</div>
          <h3 className="report-section-title">Particulars of Existing &amp; Proposed Limits</h3>
          <p className="report-section-subtitle">CMA Form I</p>
        </div>
        <span className="badge badge-emerald">RBI Compliance v2.0</span>
      </div>

      {/* PART A: LIMITS TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: "32%", minWidth: "280px" }} />
            <col /><col />
          </colgroup>
          <thead>
            <tr>
              <th className={s.colParticulars}>Nature of Facility</th>
              <th style={{ textAlign: "center" }}>Existing Limits</th>
              <th style={{ textAlign: "center" }}>Proposed Limits</th>
            </tr>
          </thead>
          <tbody>
            <tr className={s.sectionHeader}><td colSpan={3}>A. Fund Based Limits</td></tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Cash Credit / Overdraft</span>
              </td>
              <td className={s.tdValue}>{fmtV(existingCc)}</td>
              <td className={s.tdValue}>{fmtV(proposedCc)}</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Term Loan</span>
              </td>
              <td className={s.tdValue}>{fmtV(existingTl)}</td>
              <td className={s.tdValue}>{fmtV(proposedTl)}</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>3) Bills Purchased / Discounted</span>
              </td>
              <td className={s.tdValue}>0</td>
              <td className={s.tdValue}>0</td>
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Fund Based Limits (A)</span>
              </td>
              <td className={s.tdValue}>{fmtV(totalExisting)}</td>
              <td className={s.tdValue}>{fmtV(totalProposed)}</td>
            </tr>

            <tr className={s.sectionHeader}><td colSpan={3}>B. Non-Fund Based Limits</td></tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>1) Letter of Credit (LC)</span>
              </td>
              <td className={s.tdValue}>0</td><td className={s.tdValue}>0</td>
            </tr>
            <tr className={s.detailRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '40px', display: 'inline-block' }}>2) Bank Guarantee (BG)</span>
              </td>
              <td className={s.tdValue}>0</td><td className={s.tdValue}>0</td>
            </tr>
            <tr className={s.subtotalRow}>
              <td className={s.tdParticulars}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>Total Non-Fund Based Limits (B)</span>
              </td>
              <td className={s.tdValue}>0</td><td className={s.tdValue}>0</td>
            </tr>

            <tr className={s.grandTotalRow}>
              <td className={s.tdParticulars}>Total Limits (A + B)</td>
              <td className={s.tdValue}>{fmtV(totalExisting)}</td>
              <td className={s.tdValue}>{fmtV(totalProposed)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PART B: SECURITY */}
      <div style={{ borderTop: "2px solid #000" }}>
        <div style={{ padding: "6px 16px", borderBottom: "1px solid #000", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", fontFamily: '"Times New Roman", Times, serif' }}>
          PART B: SECURITY PARTICULARS
        </div>
        <table className={s.table} style={{ border: "none", borderTop: "none" }}>
          <tbody>
            <tr className="security-row">
              <td className={s.tdParticulars} style={{ fontWeight: "bold", width: "200px" }}>Primary Security</td>
              <td className={s.tdParticulars}>Hypothecation of all Stocks and Book Debts of the business</td>
            </tr>
            <tr className="security-row">
              <td className={s.tdParticulars} style={{ fontWeight: "bold" }}>Collateral Security</td>
              <td className={s.tdParticulars}>Property (if applicable) / CGFMU / CGTMSE</td>
            </tr>
            <tr className="security-row">
              <td className={s.tdParticulars} style={{ fontWeight: "bold" }}>Personal Guarantees</td>
              <td className={s.tdParticulars}>Personal Guarantee of the proprietor / Managing Partners</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PART C: ASSOCIATE CONCERNS */}
      <div style={{ borderTop: "2px solid #000" }}>
        <div style={{ padding: "6px 16px", borderBottom: "1px solid #000", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", fontFamily: '"Times New Roman", Times, serif' }}>
          PART C: PARTICULARS OF ASSOCIATE / GROUP CONCERNS
        </div>
        <table className={s.table} style={{ border: "none" }}>
          <thead>
            <tr>
              <th className={s.colParticulars}>Name of Concern</th>
              <th style={{ textAlign: "left" }}>Activity</th>
              <th style={{ textAlign: "left" }}>Name of Banker</th>
              <th style={{ textAlign: "center" }}>Limit / Outstanding</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className={`${s.tdParticulars} force-center`} style={{ color: "#000", fontSize: "11px" }}>
                No other bank facilities enjoyed by associate concerns as per available records.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="no-print" style={{ padding: "12px 16px", borderTop: "1px solid #000", fontFamily: '"Times New Roman", Times, serif', fontSize: "8px" }}>
        * Note: This statement is prepared as per standard Credit Monitoring Arrangement (CMA) guidelines.
        The data presented is projected and subject to bank&apos;s internal appraisal norms.
      </div>
    </div>
  );
}