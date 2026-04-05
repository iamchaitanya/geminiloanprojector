// components/reports/forms/Form5.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt } from "../../../lib/format";

export default function Form5({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form V</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Assessment of Maximum Permissible Bank Finance (MPBF)</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form V</span>
          <span className="text-[8px] text-slate-500 mt-1 uppercase font-mono tracking-widest">RBI / Tandon / Nayak Compliance</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-[11px] whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[450px]">Sr. No. & Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* I. TANDON METHOD II */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. TANDON COMMITTEE (METHOD II) - Standard Norms</td>
            </tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">1. Total Current Assets (as per Form III)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.totalCA)}</td>)}</tr>
            <tr>
              <td className="px-6 py-2 pl-6 font-sans">2. Other Current Liabilities (excl. bank borrowings)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-rose-600">({fmt(d.totalCL)})</td>)}
            </tr>
            <tr className="bg-amber-50/50 italic text-[10px]">
              <td className="px-6 py-1 pl-12 font-sans text-amber-700">Of which: Statutory Dues (GST/PF/TDS)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1 text-right text-amber-700">{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-3 pl-6 font-sans text-slate-900">3. WORKING CAPITAL GAP (1 - 2)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>
            
            <tr>
              <td className="px-6 py-2 pl-6 font-sans font-bold text-rose-800">4. Min. Borrower Margin (25% of Total Current Assets)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-rose-800">({fmt(d.totalCA * 0.25)})</td>)}
            </tr>
            <tr className="bg-blue-50/50">
              <td className="px-6 py-3 pl-6 font-sans font-bold text-blue-900 italic">5. MPBF AS PER METHOD II (3 - 4)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-blue-900 text-sm">{fmt((d.totalCA - d.totalCL) - (d.totalCA * 0.25))}</td>)}
            </tr>
            
            <tr>
              <td className="px-6 py-2 pl-6 font-sans">6. Actual Net Working Capital (NWC) Proposed</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold text-emerald-600">{fmt(d.totalCA - (d.totalCL + loanAmount))}</td>)}
            </tr>
            
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 pl-6 font-sans uppercase tracking-tight text-xs italic">7. FINAL ELIGIBILITY (TANDON II)</td>
              {data.map(d => {
                const mpbf = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
                return <td key={d.year} className="px-6 py-4 text-right text-base text-blue-300">{fmt(mpbf)}</td>;
              })}
            </tr>

            {/* II. NAYAK COMMITTEE */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase border-t-2 border-slate-300">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. NAYAK COMMITTEE (TURNOVER METHOD) - MSME Limit</td>
            </tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">8. Projected Annual Turnover (Sales)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.sales)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">9. Total WC Requirement (25% of Turnover)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.sales * 0.25)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-6 font-sans text-rose-700 italic">10. Min. Borrower Contribution (5% of Turnover)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right text-rose-600">({fmt(d.sales * 0.05)})</td>)}</tr>
            <tr className="bg-emerald-900 text-white font-bold">
              <td className="px-6 py-4 pl-6 font-sans uppercase tracking-widest text-xs">11. MPBF AS PER TURNOVER METHOD (9 - 10)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl text-emerald-400 tracking-tighter">{fmt(d.sales * 0.20)}</td>)}
            </tr>

            <tr className="bg-slate-50 font-bold border-t border-slate-200 uppercase">
              <td className="px-6 py-4 pl-6 font-sans text-blue-900">Final Requested Loan Limit (CC/OD)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-lg text-blue-900">{fmt(loanAmount)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}