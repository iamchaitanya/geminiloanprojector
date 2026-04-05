// components/reports/forms/Form4.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt, fmtR } from "../../../lib/format";

export default function Form4({ data, years }: { data: ProjectedYear[], years: string[] }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form IV</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Comparative Statement of Current Assets & Current Liabilities</p>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form IV</span>
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
            
            {/* A. CURRENT ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>A. CURRENT ASSETS</td>
            </tr>
            
            {/* 1. Raw Materials */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">1. Raw Materials (incl. stores and spares)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.inventory)}</td>)}
            </tr>
            <tr className="bg-slate-50/50 text-[10px] text-slate-500 italic">
              <td className="px-6 py-1.5 text-left font-sans pl-16">Holding period (Months Consumption)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold text-blue-600">{fmtR(d.inventory / (d.purchases / 12))} Mo</td>)}
            </tr>

            {/* 2. Stocks-in-process */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">2. Stocks-in-process</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}
            </tr>

            {/* 3. Finished Goods */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">3. Finished Goods</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}
            </tr>

            {/* 5. Receivables */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">5. Receivables other than export bills</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.debtors)}</td>)}
            </tr>
            <tr className="bg-slate-50/50 text-[10px] text-slate-500 italic">
              <td className="px-6 py-1.5 text-left font-sans pl-16">Collection period (Days Sales)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold text-blue-600">{Math.round(d.debtors / (d.sales / 365))} Days</td>)}
            </tr>

            {/* 7. Advances to Suppliers */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">7. Advances to suppliers of RM/Stores/Spares</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.loansAdv)}</td>)}
            </tr>

            {/* 8. Cash & Bank Balances */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">8. Cash and Bank Balances</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cashBank)}</td>)}
            </tr>

            {/* 9. Other Current Assets */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">9. Other Current Assets (Incl. Deposits)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.reconAdj)}</td>)}
            </tr>

            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">10. TOTAL CURRENT ASSETS (1 to 9)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.totalCA)}</td>)}
            </tr>

            {/* B. CURRENT LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length + 1}>B. CURRENT LIABILITIES</td>
            </tr>

            {/* 11. Sundry Creditors */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">11. Sundry Creditors (Trade)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.creditors)}</td>)}
            </tr>
            <tr className="bg-slate-50/50 text-[10px] text-slate-500 italic">
              <td className="px-6 py-1.5 text-left font-sans pl-16">Payment period (Days Purchases)</td>
              {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold text-blue-600">{Math.round(d.creditors / (d.purchases / 365))} Days</td>)}
            </tr>

            {/* 12. Advance Payments */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">12. Advance payments from customers</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}
            </tr>

            {/* 13. Statutory Dues */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">13. Statutory Dues (GST/Income Tax/EPF)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL * 0.4)}</td>)}
            </tr>

            {/* 14. Other Current Liabilities */}
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">14. Other Current Liabilities & Provisions</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.otherCL * 0.6)}</td>)}
            </tr>

            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">15. TOTAL CURRENT LIABILITIES (11 to 14)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.totalCL)}</td>)}
            </tr>

            {/* 16. Working Capital Gap */}
            <tr className="bg-slate-50 font-bold">
              <td className="px-6 py-3 text-left pl-6 font-sans italic">16. WORKING CAPITAL GAP (10 - 15)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.totalCA - d.totalCL)}</td>)}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}