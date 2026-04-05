// components/reports/BalanceSheet.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt } from "../../lib/format";

export default function BalanceSheet({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5 flex justify-between items-center border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white tracking-tight">Balance Sheet (Projected)</h3>
        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md tracking-wider">FORM III</span>
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
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>Sources of Funds</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Capital / Net Worth</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10">Bank Borrowings (CC/OD)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.bankBorrowings)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider pl-10" colSpan={years.length + 1}>Current Liabilities</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">Sundry Creditors (Trade)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.creditors)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">Other Current Liabilities</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.otherCL)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-700 font-medium pl-10">Total Current Liabilities</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.totalCL)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y-2 border-[#ccc8be]">
              <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Sources of Funds</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalLiab)}</td>)}
            </tr>
            <tr className="bg-[#faf9f5] h-3"><td colSpan={years.length + 1}></td></tr>
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[0.68rem] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>Application of Funds</td>
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider pl-10" colSpan={years.length + 1}>Fixed Assets</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">Gross Block</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.grossFA)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">Less: Accumulated Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">({fmt(d.accDepn)})</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-700 font-medium pl-10">Net Block</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.netFA)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider pl-10" colSpan={years.length + 1}>Current Assets, Loans & Advances</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">a) Inventories / Closing Stock</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.inventory)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">b) Sundry Debtors</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.debtors)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">c) Cash & Bank Balances</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.cashBank)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">d) Loans & Advances</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.loansAdv)}</td>)}
            </tr>
            {data.some(d => d.reconAdj > 0) && (
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-2 text-left text-slate-500 pl-14 text-xs">e) Other Assets / Deposits</td>
                {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-mono text-slate-500 text-xs">{fmt(d.reconAdj)}</td>)}
              </tr>
            )}
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-700 font-medium pl-10">Total Current Assets</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-mono text-slate-700">{fmt(d.totalCA)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y-2 border-[#ccc8be]">
              <td className="px-6 py-3 text-left text-[#0f0e0b]">Total Application of Funds</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-[#0f0e0b]">{fmt(d.totalAssets)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
