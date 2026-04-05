// components/reports/forms/Form2.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form2({ data, years }: { data: ProjectedYear[], years: string[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <h3 className="text-white font-semibold uppercase text-sm tracking-tight">CMA Form II: Operating Statement</h3>
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-mono uppercase">Form II</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm whitespace-nowrap">
          <thead className="bg-slate-50 font-mono text-[10px] text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Sr. Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
            <tr>
              <td className="px-6 py-2.5 text-left font-sans">1. Gross Sales / Turnover</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.sales)}</td>)}
            </tr>
            <tr className="text-slate-500 text-xs italic">
              <td className="px-6 py-2 text-left font-sans pl-10">2. % Growth in Net Sales</td>
              {data.map((d, i) => {
                const growth = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
                return <td key={d.year} className="px-6 py-2 text-right">{i === 0 ? "—" : fmtR(growth) + "%"}</td>;
              })}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-3 text-left font-sans">3. Net Sales</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.sales)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-bold text-slate-400 text-[10px] uppercase pl-6" colSpan={years.length + 1}>4. Cost of Sales</td>
            </tr>
            <tr className="text-xs">
              <td className="px-6 py-2 text-left font-sans pl-10">a) Purchases / Direct Materials</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.purchases)}</td>)}
            </tr>
            <tr className="text-xs">
              <td className="px-6 py-2 text-left font-sans pl-10">b) Indirect / Operating Expenses</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.totalIndExp)}</td>)}
            </tr>
            <tr className="text-xs">
              <td className="px-6 py-2 text-left font-sans pl-10">c) Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.depnYr)}</td>)}
            </tr>
            <tr className="text-xs">
              <td className="px-6 py-2 text-left font-sans pl-10">d) Add: Opening Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.openStock)}</td>)}
            </tr>
            <tr className="text-xs border-b border-slate-100">
              <td className="px-6 py-2 text-left font-sans pl-10">e) Less: Closing Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">({fmt(d.closingStock)})</td>)}
            </tr>
            <tr className="bg-slate-100 font-bold">
              <td className="px-6 py-3 text-left font-sans pl-6">Total Cost of Sales</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.totalCosts)}</td>)}
            </tr>
            <tr className="bg-emerald-50 text-emerald-900 font-bold">
              <td className="px-6 py-3 text-left font-sans">5. Operating Profit before Interest</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.profitBeforeInt)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left font-sans">6. Less: Interest on Borrowings</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.interest)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-3 text-left font-sans">7. Net Profit before Tax</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.netProfit)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50 text-slate-500">
              <td className="px-6 py-2.5 text-left font-sans">8. Provision for Taxes</td>
              <td colSpan={years.length} className="px-6 py-2.5 text-right italic text-xs">Assumed Nil</td>
            </tr>
            <tr className="bg-emerald-100 text-emerald-900 font-bold border-t-2 border-emerald-300 shadow-sm">
              <td className="px-6 py-4 text-left font-sans uppercase tracking-tight">9. Net Profit after Tax (PAT)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-lg">{fmt(d.netProfit)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}