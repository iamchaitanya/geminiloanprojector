// components/reports/forms/Form5.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt } from "../../../lib/format";

export default function Form5({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form V</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Maximum Permissible Bank Finance (MPBF) - Method II</p>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form V</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[400px]">Sr. Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* 1. Total Current Assets */}
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">1. Total Current Assets (as per Form IV)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCA)}</td>)}
            </tr>

            {/* 2. Current Liabilities (excl bank) */}
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">2. Current Liabilities (other than bank borrowings)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCL)}</td>)}
            </tr>

            {/* 3. Working Capital Gap */}
            <tr className="bg-slate-50 font-bold">
              <td className="px-6 py-3 text-left font-sans pl-6 italic">3. WORKING CAPITAL GAP (1 - 2)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>

            {/* 4. Min. Stipulated NWC */}
            <tr className="text-rose-700">
              <td className="px-6 py-2.5 text-left font-sans pl-10 font-medium italic">4. Min. Stipulated NWC (25% of Current Assets)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">({fmt(d.totalCA * 0.25)})</td>)}
            </tr>

            {/* 5. MPBF (3 - 4) */}
            <tr className="bg-blue-50 text-blue-900 font-bold border-y border-blue-200">
              <td className="px-6 py-3 text-left font-sans uppercase">5. MPBF as per Method II (3 - 4)</td>
              {data.map(d => {
                const mpbfVal = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
                return <td key={d.year} className="px-6 py-3 text-right">{fmt(Math.max(mpbfVal, 0))}</td>;
              })}
            </tr>

            {/* 6. Actual/Projected NWC */}
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">6. Actual / Projected NWC (1 - [2 + bank borrowings])</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-semibold text-emerald-700">{fmt(d.totalCA - (d.totalCL + loanAmount))}</td>)}
            </tr>

            {/* 7. Item 3 minus Item 6 */}
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">7. Item 3 minus Item 6</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt((d.totalCA - d.totalCL) - (d.totalCA - (d.totalCL + loanAmount)))}</td>)}
            </tr>

            {/* 8. MPBF (Lower of 5 or 7) */}
            <tr className="bg-slate-100 font-bold border-y-2 border-slate-300">
              <td className="px-6 py-4 text-left font-sans uppercase tracking-tight">8. Maximum Permissible Bank Finance (MPBF)</td>
              {data.map(d => {
                const method2Limit = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
                const gapMinusNWC = (d.totalCA - d.totalCL) - (d.totalCA - (d.totalCL + loanAmount));
                const finalMPBF = Math.min(method2Limit, gapMinusNWC);
                return <td key={d.year} className="px-6 py-4 text-right text-lg text-blue-800">{fmt(Math.max(finalMPBF, 0))}</td>;
              })}
            </tr>

            {/* 9. Proposed / Admissible Limit */}
            <tr className="bg-emerald-100 text-emerald-900 font-bold">
              <td className="px-6 py-4 text-left font-sans">9. ADMISSIBLE BANK FINANCE (Proposed Limit)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl">₹{fmt(loanAmount)}</td>)}
            </tr>

            {/* 10. Excess Borrowings / Shortfall */}
            <tr className="text-[10px] text-slate-500 italic bg-slate-50">
              <td className="px-6 py-2 text-left font-sans pl-10">10. Excess Borrowings / (Shortfall) (9 - 8)</td>
              {data.map(d => {
                const method2Limit = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
                const gapMinusNWC = (d.totalCA - d.totalCL) - (d.totalCA - (d.totalCL + loanAmount));
                const finalMPBF = Math.max(Math.min(method2Limit, gapMinusNWC), 0);
                const diff = loanAmount - finalMPBF;
                return (
                  <td key={d.year} className={`px-6 py-2 text-right font-bold ${diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {diff > 0 ? `Excess: ${fmt(diff)}` : `Comfort: ${fmt(Math.abs(diff))}`}
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <p className="text-[10px] text-slate-500 leading-relaxed italic">
          * Note: As per Tandon Committee Method II, the borrower is required to provide for at least 25% of the Total Current Assets from long-term sources (Net Working Capital). 
          The admissible bank finance is the lower of the Working Capital Gap minus the stipulated NWC, or the Gap minus the actual NWC.
        </p>
      </div>
    </div>
  );
}