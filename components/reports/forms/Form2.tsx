// components/reports/forms/Form2.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form2({ data, years }: { data: ProjectedYear[], years: string[] }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      {/* 1. Header consistent with Form I */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form II</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Operating Statement (Projected Performance)</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form II</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[380px]">Sr. Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* I. REVENUE SECTION */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. REVENUE FROM OPERATIONS</td>
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-sans pl-10">1. Gross Sales / Turnover</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.sales)}</td>)}
            </tr>
            <tr className="text-[10px] text-blue-600 italic">
              <td className="px-6 py-1.5 text-left font-sans pl-16">% Growth in Sales (YoY)</td>
              {data.map((d, i) => {
                const growth = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
                return <td key={d.year} className="px-6 py-1.5 text-right font-bold">{i === 0 ? "—" : fmtR(growth) + "%"}</td>;
              })}
            </tr>

            {/* II. COST OF SALES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. COST OF SALES / DIRECT COSTS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">a) Raw Materials / Purchases</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.purchases)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">b) Add: Opening Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.openStock)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">c) Less: Closing Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-rose-600">({fmt(d.closingStock)})</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-2.5 text-left pl-6 font-sans">2. Total Cost of Goods Sold (COGS)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.purchases + d.openStock - d.closingStock)}</td>)}
            </tr>
            <tr className="bg-emerald-50 text-emerald-900 font-bold">
              <td className="px-6 py-3 text-left font-sans">3. GROSS PROFIT (1 - 2)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.sales - (d.purchases + d.openStock - d.closingStock))}</td>)}
            </tr>

            {/* III. OPERATING EXPENSES (GRANULAR) */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>III. SELLING, GENERAL & ADMINISTRATIVE EXPENSES</td>
            </tr>
            {/* Dynamic rendering of specific expense heads from engine.ts */}
            {data[0].indirectExpenses.map((exp, idx) => (
              <tr key={exp.label} className="hover:bg-slate-50">
                <td className="px-6 py-2 text-left font-sans text-slate-500 pl-14">{exp.label}</td>
                {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-500">{fmt(d.indirectExpenses[idx].value)}</td>)}
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-2.5 text-left pl-6 font-sans">4. Total Indirect Expenses</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalIndExp)}</td>)}
            </tr>

            {/* IV. OPERATING PROFIT & FINAL BOTTOM LINE */}
            <tr className="bg-blue-900 text-white font-bold">
              <td className="px-6 py-4 text-left font-sans uppercase tracking-tight">5. EBITDA (Operating Profit)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tighter text-blue-300">{fmt(d.ebitda)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left font-sans pl-10">6. Less: Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left font-sans pl-10">7. Less: Interest on Borrowings</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.interest)}</td>)}
            </tr>
            <tr className="bg-emerald-100 text-emerald-900 font-bold border-t-2 border-emerald-300 shadow-sm">
              <td className="px-6 py-4 text-left font-sans uppercase tracking-tight">8. NET PROFIT AFTER TAX (PAT)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-lg">{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className="bg-white text-[10px] text-blue-600 font-bold">
              <td className="px-6 py-2 text-left font-sans pl-16 italic">Net Profit Margin (%)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmtR(d.npRatio)}%</td>)}
            </tr>

          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-start">
        <div className="max-w-2xl">
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            * Note: EBITDA (Earnings Before Interest, Tax, Depreciation, and Amortization) is a key proxy for cash flow generated from operations. 
            Banks typically look for a minimum EBITDA margin of 8-10% in trading and 12-15% in manufacturing sectors.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Audit Check</p>
          <p className="text-[8px] text-slate-400 font-mono">Interest Coverage Target: &gt; 2.5x</p>
        </div>
      </div>
    </div>
  );
}