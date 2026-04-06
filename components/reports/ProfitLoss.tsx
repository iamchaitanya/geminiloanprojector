// components/reports/ProfitLoss.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt, fmtR } from"../../lib/format";

export default function ProfitLoss({ data, years }: { data: ProjectedYear[], years: string[] }) {
 return (
 <div className="border border-black rounded-none overflow-hidden">
 <div className="border-b border-black px-6 py-5 flex justify-between items-center border-b border-black">
 <h3 className="text-[11px] font-bold font-semibold">Profit & Loss Account</h3>
 <span className="text-[11px] font-semibold border border-black px-2.5 py-1 rounded-none">P & L</span>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap">
 <thead className="border-b border-black">
 <tr>
 <th className="px-6 py-4 text-left font-semibold uppercase text-[11px] min-w-[300px]">Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-4 text-right font-semibold uppercase text-[11px]">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 <tr className="border-y border-black font-bold text-[0.68rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>I. INCOME</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Sales / Turnover</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.sales)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Other Income</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.otherInc)}</td>)}
 </tr>
 <tr className="font-bold border-y-2 border-[#ccc8be]">
 <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Revenue (A)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalRev)}</td>)}
 </tr>
 <tr className="h-3"><td colSpan={years.length + 1}></td></tr>
 <tr className="border-y border-black font-bold text-[0.68rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>II. EXPENDITURE</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Opening Stock</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.openStock)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Purchases / Direct Costs</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.purchases)}</td>)}
 </tr>
 <tr>
 <td className="px-6 py-2.5 text-left font-semibold text-[11px] uppercase pl-10" colSpan={years.length + 1}>Indirect / Operating Expenses</td>
 </tr>
 {data[0].indirectExpenses.map((exp, idx) => (
 <tr key={exp.label} className="hover:">
 <td className="px-6 py-2 text-left pl-14 text-[11px]">{exp.label}</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-[11px]">{fmt(d.indirectExpenses[idx].value)}</td>)}
 </tr>
 ))}
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Total Indirect Expenses</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.totalIndExp)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10">Less: Closing Stock</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.closingStock)}</td>)}
 </tr>
 <tr className="font-bold border-y-2 border-[#ccc8be]">
 <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Expenditure (B)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalCosts)}</td>)}
 </tr>
 <tr className="h-3"><td colSpan={years.length + 1}></td></tr>
 <tr className="border-y border-black font-semibold border-t-2 border-black">
 <td className="px-6 py-3 text-left">Gross Profit (A−B)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.grossProfit)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-10">Gross Profit Ratio (%)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmtR(d.gpRatio)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-10">Less: Depreciation</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.depnYr)}</td>)}
 </tr>
 <tr className="font-semibold border-y border-black">
 <td className="px-6 py-3 text-left">Profit before Interest & Tax</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.profitBeforeInt)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-10">Less: Interest on Borrowings</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.interest)}</td>)}
 </tr>
 <tr className="border-y border-black/50 font-semibold border-t border-black">
 <td className="px-6 py-3 text-left">Net Profit before Tax</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.profitBeforeTax)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-10">Net Profit Ratio (%)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmtR(d.npRatio)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-10">Less: Income Tax Provision</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono">{fmt(d.tax)}</td>)}
 </tr>
 <tr className="border-y-2 border-black font-bold border-t-2 border-black">
 <td className="px-6 py-4 text-left">Net Profit after Tax (PAT)</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right font-mono text-[11px] font-bold">{fmt(d.netProfit)}</td>)}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}