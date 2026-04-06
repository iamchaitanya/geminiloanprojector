// components/reports/forms/Form5.tsx
import { ProjectedYear } from"../../../lib/engine";
import { fmt } from"../../../lib/format";

export default function Form5({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">CMA Form V</h3>
 <p className="text-[10px] mt-0.5 font-mono">Assessment of Maximum Permissible Bank Finance (MPBF)</p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Form V</span>
 <span className="text-[8px] mt-1 uppercase font-mono">RBI / Tandon / Nayak Compliance</span>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold">
 <th className="px-6 py-3 text-left min-w-[450px]">Sr. No. & Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-3 text-right">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 
 {/* I. TANDON METHOD II */}
 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. TANDON COMMITTEE (METHOD II) - Standard Norms</td>
 </tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">1. Total Current Assets (as per Form III)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.totalCA)}</td>)}</tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">2. Other Current Liabilities (excl. bank borrowings)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right">({fmt(d.totalCL)})</td>)}
 </tr>
 <tr className="text-[10px]">
 <td className="px-6 py-1 pl-12 font-sans">Of which: Statutory Dues (GST/PF/TDS)</td>
 {data.map(d => <td key={d.year} className="px-6 py-1 text-right">{fmt(d.statutoryDues)}</td>)}
 </tr>
 <tr className="font-bold border-y border-black">
 <td className="px-6 py-3 pl-6 font-sans">3. WORKING CAPITAL GAP (1 - 2)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.totalCA - d.totalCL)}</td>)}
 </tr>
 
 <tr>
 <td className="px-6 py-2 pl-6 font-sans font-bold">4. Min. Borrower Margin (25% of Total Current Assets)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right">({fmt(d.totalCA * 0.25)})</td>)}
 </tr>
 <tr className="">
 <td className="px-6 py-3 pl-6 font-sans font-bold">5. MPBF AS PER METHOD II (3 - 4)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-[11px]">{fmt((d.totalCA - d.totalCL) - (d.totalCA * 0.25))}</td>)}
 </tr>
 
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">6. Actual Net Working Capital (NWC) Proposed</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
 </tr>
 
 <tr className="border-b border-black font-bold">
 <td className="px-6 py-4 pl-6 font-sans uppercase text-[11px]">7. FINAL ELIGIBILITY (TANDON II)</td>
 {data.map(d => {
 const mpbf = (d.totalCA - d.totalCL) - (d.totalCA * 0.25);
 return <td key={d.year} className="px-6 py-4 text-right text-[11px]">{fmt(mpbf)}</td>;
 })}
 </tr>

 {/* II. NAYAK COMMITTEE */}
 <tr className="border-y border-black font-bold text-[10px] uppercase border-t-2 border-black">
 <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. NAYAK COMMITTEE (TURNOVER METHOD) - MSME Limit</td>
 </tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">8. Projected Annual Turnover (Sales)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.sales)}</td>)}</tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">9. Total WC Requirement (25% of Turnover)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.sales * 0.25)}</td>)}</tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">10. Min. Borrower Contribution (5% of Turnover)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">({fmt(d.sales * 0.05)})</td>)}</tr>
 <tr className="font-bold">
 <td className="px-6 py-4 pl-6 font-sans uppercase text-[11px]">11. MPBF AS PER TURNOVER METHOD (9 - 10)</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl">{fmt(d.sales * 0.20)}</td>)}
 </tr>

 <tr className="font-bold border-t border-black uppercase">
 <td className="px-6 py-4 pl-6 font-sans">Final Requested Loan Limit (CC/OD)</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-[11px] font-bold">{fmt(d.bankBorrowings)}</td>)}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}