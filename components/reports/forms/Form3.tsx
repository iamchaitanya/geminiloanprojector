// components/reports/forms/Form3.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form3({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form III</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Analysis of Balance Sheet (RBI Form III)</p>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form III</span>
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
            
            {/* I. CURRENT LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. CURRENT LIABILITIES</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">1. Short Term Borrowings from Banks (WC)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(loanAmount)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">2. Short Term Borrowings from Others</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">3. Sundry Creditors (Trade)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.creditors)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">9. Other Current Liabilities & Provisions</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">10. TOTAL CURRENT LIABILITIES (1 to 9)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCL + loanAmount)}</td>)}
            </tr>

            {/* II. TERM LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. TERM LIABILITIES</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">15. Unsecured Loans</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.unsecured)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">17. TOTAL TERM LIABILITIES (11 to 16)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.unsecured)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-3 text-left pl-6 font-sans text-slate-600 italic uppercase">18. TOTAL OUTSIDE LIABILITIES (10+17)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.totalCL + loanAmount + d.unsecured)}</td>)}
            </tr>

            {/* III. NET WORTH */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>III. NET WORTH</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">19. Ordinary Share Capital / Proprietor's Cap.</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">24. TOTAL NET WORTH (19 to 23)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 text-left font-sans uppercase">25. TOTAL LIABILITIES (18+24)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tight">{fmt(d.totalLiab)}</td>)}
            </tr>

            {/* IV. FIXED ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>IV. FIXED ASSETS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">26. Gross Block</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.grossFA)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">27. Less: Accumulated Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">({fmt(d.accDepn)})</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">30. NET FIXED ASSETS (26-27)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.netFA)}</td>)}
            </tr>

            {/* VI. CURRENT ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>VI. CURRENT ASSETS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">34. Raw Materials / Inventory</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.inventory)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">38. Receivables / Sundry Debtors</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.debtors)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">40. Cash and Bank Balances</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cashBank)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">41. Loans and Advances / Deposits</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.loansAdv + d.reconAdj)}</td>)}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">43. TOTAL CURRENT ASSETS (34 to 42)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.totalCA)}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 text-left font-sans uppercase">44. TOTAL ASSETS (30+33+43)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tight">{fmt(d.totalAssets)}</td>)}
            </tr>

            {/* MANDATORY RECONCILIATION ROWS (THE MISSING NWC SECTION) */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left font-sans italic" colSpan={years.length + 1}>ANALYSIS OF LIQUIDITY (NWC)</td>
            </tr>
            <tr className="bg-emerald-50 text-emerald-900 font-bold border-t-2 border-emerald-300">
              <td className="px-6 py-3 text-left font-sans uppercase">45. TANGIBLE NET WORTH (TNW)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left font-sans pl-6">46. Working Capital Gap (43 − [10 excl. bank])</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>
            <tr className="bg-blue-100 text-blue-900 font-bold border-y-2 border-blue-300 shadow-sm">
              <td className="px-6 py-4 text-left font-sans uppercase">47. NET WORKING CAPITAL (NWC) (43 − 10)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tight">{fmt(d.totalCA - (d.totalCL + loanAmount))}</td>)}
            </tr>
            <tr className="hover:bg-slate-50 border-b-2 border-slate-200">
              <td className="px-6 py-3 text-left font-sans pl-6">48. Current Ratio (Times) (43 / 10)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmtR(d.totalCA / (d.totalCL + loanAmount))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}