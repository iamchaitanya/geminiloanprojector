// components/reports/DscrSchedule.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt, fmtR } from"../../lib/format";

export default function DscrSchedule({ data, years }: { data: ProjectedYear[], years: string[] }) {
 
 // Calculate Average DSCR for the projection period
 const totalDscr = data.reduce((acc, d) => acc + d.dscr, 0);
 const avgDscr = totalDscr / data.length;

 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">Debt Service Coverage Ratio (DSCR)</h3>
 <p className="text-[10px] mt-0.5 font-mono">Detailed Schedule of Repayment Capacity</p>
 </div>
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Liquid Coverage</span>
 </div>

 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold">
 <th className="px-6 py-3 text-left min-w-[380px]">Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-3 text-right">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 
 {/* SOURCES: CASH ACCRUALS */}
 <tr className="border-y border-black font-bold text-[10px] uppercase">
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
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-3 text-left pl-6 font-sans uppercase">4. TOTAL CASH ACCRUALS (1+2+3)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.netProfit + d.depnYr + d.interest)}</td>)}
 </tr>

 {/* OBLIGATIONS: DEBT SERVICE */}
 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={years.length + 1}>B. DEBT OBLIGATIONS (APPLICATIONS)</td>
 </tr>
 <tr>
 <td className="px-6 py-2.5 text-left font-sans pl-10">5. Interest on Term Loans / Working Capital</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.interest)}</td>)}
 </tr>
 <tr>
 <td className="px-6 py-2.5 text-left font-sans pl-10">6. Repayment of Term Loan Installments</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.tlRepayment)}</td>)}
 </tr>
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-3 text-left pl-6 font-sans uppercase">7. TOTAL DEBT SERVICE (5+6)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.interest + d.tlRepayment)}</td>)}
 </tr>

 {/* RATIO RESULT */}
 <tr className="border-b border-black font-bold">
 <td className="px-6 py-4 text-left font-sans uppercase text-[11px]">8. DSCR (ITEM 4 / ITEM 7)</td>
 {data.map(d => (
 <td key={d.year} className={`px-6 py-4 text-right text-[11px] font-bold ${d.dscr >= 1.5 ? '' : ''}`}>
 {fmtR(d.dscr)}
 </td>
 ))}
 </tr>

 </tbody>
 </table>
 </div>

 {/* Average DSCR Footer */}
 <div className="p-6 border-y border-black border-t-2 border-black flex justify-between items-center">
 <div>
 <h4 className="font-bold uppercase text-[11px]">Weighted Average DSCR</h4>
 <p className="text-[10px] mt-1">Calculated over the entire projection period of {data.length} years.</p>
 </div>
 <div className="text-right">
 <span className="text-3xl font-black">{fmtR(avgDscr)}</span>
 <span className="ml-2 text-[11px] font-bold uppercase">Benchmark: ≥ 1.50</span>
 </div>
 </div>
 </div>
 );
}