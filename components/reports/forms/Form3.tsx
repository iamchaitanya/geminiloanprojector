// components/reports/forms/Form3.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form3({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      {/* Header Section */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form III</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Analysis of Balance Sheet (Official 48-Item Format)</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form III</span>
          <span className="text-[8px] text-slate-500 mt-1 uppercase font-mono tracking-widest">Banking Standards v4.0</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-[11px] whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[450px]">Sr. Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* LIABILITIES SECTION */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. CURRENT LIABILITIES</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">1. Raw Materials / Stock-in-trade</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">Included in Item 3</td>)}</tr>
            <tr>
              <td className="px-6 py-2 pl-10 font-sans font-bold text-blue-800">2. Short-term borrowings from banks (Working Capital)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold text-blue-800">{fmt(loanAmount)}</td>)}
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">3. Sundry Creditors (Trade Payables)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.creditors)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">4. Advance payments from customers</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">5. Provision for Taxation</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">6. Dividend Payable</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">7. Other Statutory Liabilities (GST/PF/TDS)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL * 0.4)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">8. Installments of Term Loans due within 1 year</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">9. Other Current Liabilities & Provisions</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL * 0.6)}</td>)}</tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">10. TOTAL CURRENT LIABILITIES (1 to 9)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.totalCL + loanAmount)}</td>)}
            </tr>

            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. TERM LIABILITIES</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">11. Debentures (not maturing within 1 year)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">12. Preference Shares (redeemable after 1 year)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">13. Term Loans (excl. current installments)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">14. Deferred Payment Credits</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">15. Fixed Deposits (maturing after 1 year)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">16. Unsecured Loans (Long Term)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.unsecured)}</td>)}</tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">17. TOTAL TERM LIABILITIES (11 to 16)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.unsecured)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold">
              <td className="px-6 py-3 pl-6 font-sans text-slate-600 italic uppercase">18. TOTAL OUTSIDE LIABILITIES (10 + 17)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.totalCL + loanAmount + d.unsecured)}</td>)}
            </tr>

            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>III. NET WORTH</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">19. Ordinary Share Capital / Proprietor's Capital</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.capital)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">20. Preference Share Capital</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">21. General Reserves</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">22. Revaluation Reserves</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">23. Other Reserves (Excl. Provisions)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">24. Surplus/Deficit in P&L Account</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">Included in Item 19</td>)}</tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">25. TOTAL NET WORTH (19 to 24)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 font-sans uppercase">26. TOTAL LIABILITIES (18 + 25)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tight text-blue-300">{fmt(d.totalLiab)}</td>)}
            </tr>

            {/* ASSETS SECTION */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>IV. FIXED ASSETS</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">27. Gross Block (Fixed Assets)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.grossFA)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">28. Less: Accumulated Depreciation</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right text-rose-600">({fmt(d.accDepn)})</td>)}</tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">29. NET FIXED ASSETS (27 - 28)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.netFA)}</td>)}
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">30. Capital Work-in-Progress</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>

            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>V. NON-CURRENT ASSETS</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">31. Long Term Investments</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">32. Other Non-current Assets (Deposits, etc.)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>

            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>VI. CURRENT ASSETS</td>
            </tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">33. Raw Materials (incl. Stores & Spares)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.inventory * 0.7)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">34. Stocks-in-process</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">35. Finished Goods</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.inventory * 0.3)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">36. Other Spares which are consumables</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr className="bg-slate-50 italic"><td className="px-6 py-1.5 pl-14 font-sans text-slate-500">37. Receivables (Trade Debtors) &lt; 6 months</td>{data.map(d => <td key={d.year} className="px-6 py-1.5 text-right text-slate-500">{fmt(d.debtors)}</td>)}</tr>
            <tr className="bg-slate-50 italic"><td className="px-6 py-1.5 pl-14 font-sans text-slate-500">38. Receivables (Trade Debtors) &gt; 6 months</td>{data.map(d => <td key={d.year} className="px-6 py-1.5 text-right text-slate-500">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">39. Total Receivables (37 + 38)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.debtors)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">40. Bills Purchased & Discounted</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">41. Cash and Bank Balances</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cashBank)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-10 font-sans">42. Advances to Suppliers / Other Current Assets</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.loansAdv + d.reconAdj)}</td>)}</tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">43. TOTAL CURRENT ASSETS (33 to 42)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.totalCA)}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 font-sans uppercase">44. TOTAL ASSETS (29 + 30 + 31 + 32 + 43)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-base tracking-tight text-blue-300">{fmt(d.totalAssets)}</td>)}
            </tr>

            {/* THE ANALYTICAL ENTRIES (45 TO 48) */}
            <tr className="bg-[#ede9df] font-bold text-[#7a7567] text-[10px] uppercase border-t-4 border-slate-900">
              <td className="px-6 py-2 text-left italic" colSpan={years.length + 1}>VII. VALUATION & LIQUIDITY AUDIT</td>
            </tr>
            <tr>
              <td className="px-6 py-3 pl-10 font-sans text-rose-700 italic">45. Less: Intangible Assets (Goodwill, Preliminary Expenses)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-rose-600">(0)</td>)}
            </tr>
            <tr className="bg-slate-50 border-b border-slate-200">
              <td className="px-6 py-3 pl-6 font-bold font-sans uppercase text-blue-900">46. TANGIBLE NET WORTH (TNW) (25 - 45)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-blue-900 text-sm tracking-tight">{fmt(d.capital)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-3 pl-6 font-bold font-sans uppercase text-emerald-900">47. NET WORKING CAPITAL (NWC) (43 - 10)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-emerald-700 text-sm tracking-tight">{fmt(d.totalCA - (d.totalCL + loanAmount))}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 pl-6 font-sans uppercase tracking-tight">48. FINAL CURRENT RATIO (Standard Benchmark: 1.33)</td>
              {data.map(d => {
                const ratio = d.totalCA / (d.totalCL + loanAmount);
                return (
                  <td key={d.year} className={`px-6 py-4 text-right text-lg ${ratio >= 1.33 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {fmtR(ratio)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}