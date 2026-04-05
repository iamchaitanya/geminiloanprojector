// components/reports/forms/Form4.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form4({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form IV</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Comparative Statement of Current Assets & Liabilities</p>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form IV</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-[11px] whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[450px]">Sr. No. & Particulars</th>
              {years.map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* I. CURRENT ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. CURRENT ASSETS</td>
            </tr>
            
            <tr>
              <td className="px-6 py-2 pl-6 font-sans font-bold">1. Raw Materials (including stores and spares)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.inventory)}</td>)}
            </tr>
            <tr className="italic text-slate-500 bg-slate-50/50">
              <td className="px-6 py-1.5 pl-12 font-sans">a. Imported</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">0</td>)}
            </tr>
            <tr className="italic text-slate-500 bg-slate-50/50">
              <td className="px-6 py-1.5 pl-12 font-sans">b. Indigenous</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.inventory)}</td>)}
            </tr>
            <tr className="bg-blue-50/30 text-[10px] text-blue-600 italic">
              <td className="px-6 py-1.5 pl-12 font-sans">Holding period (Months Consumption)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold">{fmtR(d.inventory / (d.purchases / 12))} Mo</td>)}
            </tr>

            <tr><td className="px-6 py-2 pl-6 font-sans">2. Stocks-in-process</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">3. Finished Goods</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">4. Other spares which are consumables</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>

            <tr>
              <td className="px-6 py-2 pl-6 font-sans font-bold">5. Receivables (including bills discounted with banks)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.debtors)}</td>)}
            </tr>
            <tr className="bg-emerald-50 italic text-emerald-800">
              <td className="px-6 py-1.5 pl-12 font-sans font-bold">a. Up to 6 months (Liquid)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr className="bg-rose-50 italic text-rose-800">
              <td className="px-6 py-1.5 pl-12 font-sans font-bold">b. More than 6 months (Excluded from DP)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.debtorsOver6M)}</td>)}
            </tr>
            <tr className="bg-blue-50/30 text-[10px] text-blue-600 italic">
              <td className="px-6 py-1.5 pl-12 font-sans">Collection period (Days Sales)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold">{Math.round(d.debtors / (d.sales / 365))} Days</td>)}
            </tr>

            <tr><td className="px-6 py-2 pl-6 font-sans">6. Advances to suppliers of raw materials, stores, spares, etc.</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.loansAdv)}</td>)}</tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">7. Other current assets (incl. cash, bank & prepaid exp)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cashBank + d.reconAdj)}</td>)}</tr>
            
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-3 pl-6 font-sans uppercase tracking-tight text-xs italic">8. TOTAL CURRENT ASSETS (1 to 7)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-base text-blue-300">{fmt(d.totalCA)}</td>)}
            </tr>

            {/* II. CURRENT LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase border-t-2 border-slate-300">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. CURRENT LIABILITIES</td>
            </tr>
            <tr>
              <td className="px-6 py-2 pl-6 font-sans">9. Creditors for purchases of raw materials, stores, spares, etc.</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.creditors)}</td>)}
            </tr>
            <tr className="bg-blue-50/30 text-[10px] text-blue-600 italic">
              <td className="px-6 py-1.5 pl-12 font-sans">Payment period (Days Purchases)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold">{Math.round(d.creditors / (d.purchases / 365))} Days</td>)}
            </tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">10. Advances from customers</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
            <tr className="bg-amber-50">
               <td className="px-6 py-2 pl-6 font-sans font-bold text-amber-800">11. Statutory liabilities (GST/PF/TDS)</td>
               {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold text-amber-800">{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr><td className="px-6 py-2 pl-6 font-sans">12. Other current liabilities & provisions</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL)}</td>)}</tr>
            
            <tr className="bg-[#e8e4da] border-y border-[#ccc8be] font-bold">
              <td className="px-6 py-2.5 pl-6 font-sans uppercase">13. TOTAL CURRENT LIABILITIES (9 to 12)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCL)}</td>)}
            </tr>

            {/* III. WORKING CAPITAL ANALYSIS */}
            <tr className="bg-emerald-50 text-emerald-900 font-bold border-t-2 border-emerald-200">
              <td className="px-6 py-4 pl-6 font-sans uppercase tracking-tight text-sm italic">14. WORKING CAPITAL GAP (8 - 13)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-lg">{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-6 py-3 pl-6 font-sans uppercase italic text-[10px]">15. ACTUAL/PROJECTED NET WORKING CAPITAL (NWC)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono text-slate-600">{fmt(d.totalCA - (d.totalCL + loanAmount))}</td>)}
            </tr>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 pl-6 font-sans uppercase tracking-widest text-xs">16. ASSESSED BANK FINANCE (Requested)</td>
              {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl text-emerald-400 tracking-tighter">{fmt(loanAmount)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}