// components/reports/DscrSchedule.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";

export default function DscrSchedule({ data, years }: { data: ProjectedYear[], years: string[] }) {
  
  // Calculate Average DSCR for the projection period
  const totalDscr = data.reduce((acc, d) => acc + d.dscr, 0);
  const avgDscr = totalDscr / data.length;

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">Debt Service Coverage Ratio (DSCR)</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Detailed Schedule of Repayment Capacity</p>
        </div>
        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Liquid Coverage</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[380px]">Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* SOURCES: CASH ACCRUALS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>A. CASH ACCRUALS (SOURCES)</td>
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">1. Net Profit after Tax (PAT)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.netProfit)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">2. Add: Depreciation (Non-cash)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.depnYr)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">3. Add: Interest on Term Loans / CC</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.interest)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-3 text-left pl-6 font-sans uppercase">4. TOTAL CASH ACCRUALS (1+2+3)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.netProfit + d.depnYr + d.interest)}</td>)}
            </tr>

            {/* OBLIGATIONS: DEBT SERVICE */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>B. DEBT OBLIGATIONS (APPLICATIONS)</td>
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">5. Interest on Term Loans / Working Capital</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-rose-600">{fmt(d.interest)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">6. Repayment of Term Loan Installments</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-rose-600">0</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-3 text-left pl-6 font-sans uppercase">7. TOTAL DEBT SERVICE (5+6)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-rose-700">{fmt(d.interest)}</td>)}
            </tr>

            {/* RATIO RESULT */}
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 text-left font-sans uppercase text-sm">8. DSCR (ITEM 4 / ITEM 7)</td>
              {data.map(d => (
                <td key={d.year} className={`px-6 py-4 text-right text-lg ${d.dscr >= 1.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {fmtR(d.dscr)}
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

      {/* Average DSCR Footer */}
      <div className="p-6 bg-emerald-50 border-t-2 border-emerald-200 flex justify-between items-center">
        <div>
          <h4 className="text-emerald-900 font-bold uppercase text-xs tracking-widest">Weighted Average DSCR</h4>
          <p className="text-emerald-700 text-[10px] italic mt-1">Calculated over the entire projection period of {data.length} years.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-emerald-900 tracking-tighter">{fmtR(avgDscr)}</span>
          <span className="ml-2 text-xs font-bold text-emerald-600 uppercase tracking-tighter">Benchmark: ≥ 1.50</span>
        </div>
      </div>
    </div>
  );
}