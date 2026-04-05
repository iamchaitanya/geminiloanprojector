// components/reports/ProfitLoss.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";

export default function ProfitLoss({ data, years }: { data: ProjectedYear[], years: string[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5 flex justify-between items-center border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white tracking-tight">Profit & Loss Account</h3>
        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md tracking-wider">P & L</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm whitespace-nowrap">
          <thead className="bg-[#ede9df]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-[#7a7567] uppercase tracking-wider text-xs min-w-[300px]">Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-4 text-right font-semibold text-[#7a7567] uppercase tracking-wider text-xs">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white">
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[0.68rem] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>I. INCOME</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Sales / Turnover</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.sales)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Other Income</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.otherInc)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y-2 border-[#ccc8be]">
              <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Revenue (A)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalRev)}</td>)}
            </tr>
            <tr className="bg-[#faf9f5] h-3"><td colSpan={years.length + 1}></td></tr>
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[0.68rem] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>II. EXPENDITURE</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Opening Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.openStock)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Purchases / Direct Costs</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.purchases)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider pl-10" colSpan={years.length + 1}>Indirect / Operating Expenses</td>
            </tr>
            {data[0].indirectExpenses.map((exp, idx) => (
              <tr key={exp.label} className="hover:bg-slate-50">
                <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">{exp.label}</td>
                {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.indirectExpenses[idx].value)}</td>)}
              </tr>
            ))}
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-700 font-medium pl-10">Total Indirect Expenses</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.totalIndExp)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-700 font-medium pl-10">Less: Closing Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.closingStock)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y-2 border-[#ccc8be]">
              <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Expenditure (B)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalCosts)}</td>)}
            </tr>
            <tr className="bg-[#faf9f5] h-3"><td colSpan={years.length + 1}></td></tr>
            <tr className="bg-emerald-50 text-emerald-900 font-semibold border-t-2 border-emerald-200">
              <td className="px-6 py-3 text-left">Gross Profit (A−B)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.grossProfit)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-600 pl-10">Gross Profit Ratio (%)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmtR(d.gpRatio)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-600 pl-10">Less: Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-semibold border-y border-slate-200">
              <td className="px-6 py-3 text-left text-slate-800">Profit before Interest & Tax</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-slate-800">{fmt(d.profitBeforeInt)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-600 pl-10">Less: Interest on Borrowings</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.interest)}</td>)}
            </tr>
            <tr className="bg-emerald-50/50 text-emerald-800 font-semibold border-t border-emerald-100">
              <td className="px-6 py-3 text-left">Net Profit before Tax</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-600 pl-10">Net Profit Ratio (%)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmtR(d.npRatio)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-600 pl-10">Less: Income Tax Provision</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">0</td>)}
            </tr>
            <tr className="bg-emerald-100 text-emerald-900 font-bold border-t-2 border-emerald-300 shadow-sm">
              <td className="px-6 py-4 text-left">Net Profit after Tax (PAT)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right font-mono text-lg">{fmt(d.netProfit)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}