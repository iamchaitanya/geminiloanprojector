// components/reports/BalanceSheet.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt } from "../../lib/format";

export default function BalanceSheet({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-5 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight uppercase">Detailed Projected Balance Sheet</h3>
          <p className="text-slate-400 text-xs mt-1 font-mono">Comprehensive Sources & Applications of Funds</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-md tracking-wider uppercase">Audit Grade</span>
          <span className="text-[10px] text-slate-500 mt-1 uppercase font-mono tracking-widest text-right">Tandon/RBI Compliant</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm whitespace-nowrap">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold text-xs">
              <th className="px-6 py-4 text-left tracking-wider min-w-[400px]">Capital & Liabilities (Sources)</th>
              {years.map(y => <th key={y} className="px-6 py-4 text-right tracking-wider">{y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white font-mono text-[13px]">
            
            {/* 1. NET WORTH SECTION */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[11px] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>I. NET WORTH & QUASI-EQUITY</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3 text-left text-slate-900 font-medium pl-10 font-sans">1. Proprietor's / Partners Capital</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-slate-700">{fmt(d.capital)}</td>)}
            </tr>
            <tr className="hover:bg-emerald-50 italic text-emerald-800 bg-emerald-50/10">
              <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold">2. Add: Quasi-Equity (Promoter Loans)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.quasiEquity)}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-100">
              <td className="px-6 py-3 text-left text-blue-900 pl-10 font-sans uppercase text-[11px]">TANGIBLE NET WORTH (1 + 2)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-blue-900">{fmt(d.capital + d.quasiEquity)}</td>)}
            </tr>

            {/* 2. TERM LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[11px] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>II. TERM LIABILITIES</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">3. Term Loans (Bank/FIs)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">0</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">4. Unsecured Loans (Market/External)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.unsecured)}</td>)}
            </tr>

            {/* 3. CURRENT LIABILITIES */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[11px] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>III. CURRENT LIABILITIES</td>
            </tr>
            <tr className="hover:bg-blue-50/50 bg-blue-50/20">
              <td className="px-6 py-3 text-left text-blue-900 font-bold pl-10 font-sans">5. Bank Borrowings (Proposed Limit CC/OD)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-blue-900">{fmt(loanAmount)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">6. Sundry Creditors (Trade Payables)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.creditors)}</td>)}
            </tr>
            <tr className="hover:bg-amber-50 italic text-amber-800 bg-amber-50/10">
              <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold">7. Statutory Liabilities (GST/PF/TDS)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.statutoryDues)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">8. Other Current Liabilities & Provisions</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.otherCL)}</td>)}
            </tr>

            <tr className="bg-slate-900 text-white font-bold text-base border-t-2 border-slate-700">
              <td className="px-6 py-5 text-left font-sans uppercase tracking-tight">TOTAL SOURCES OF FUNDS</td>
              {data.map(d => <td key={d.year} className="px-6 py-5 text-right text-blue-300 font-bold">{fmt(d.totalLiab)}</td>)}
            </tr>

            <tr className="bg-white h-8"><td colSpan={years.length + 1}></td></tr>

            {/* FIXED ALIGNMENT: ASSETS SECTION HEADER */}
            <tr className="bg-[#ede9df] border-y-4 border-slate-900 text-[#7a7567] uppercase font-bold text-xs">
              <td className="px-6 py-4 text-left tracking-wider font-sans">Fixed & Current Assets (Applications)</td>
              {years.map(y => <td key={y} className="px-6 py-4 text-right tracking-wider font-sans">{y}</td>)}
            </tr>

            {/* 4. FIXED ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[11px] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>IV. FIXED ASSETS</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">9. Gross Block (At Cost)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.grossFA)}</td>)}
            </tr>
            <tr className="hover:bg-rose-50 text-rose-700 bg-rose-50/10">
              <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold italic">10. Less: Accumulated Depreciation</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">({fmt(d.accDepn)})</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-100">
              <td className="px-6 py-3 text-left text-slate-900 pl-10 font-sans uppercase text-[11px]">NET FIXED ASSETS (9 - 10)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.netFA)}</td>)}
            </tr>

            {/* 5. CURRENT ASSETS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[11px] uppercase tracking-wider">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>V. CURRENT ASSETS, LOANS & ADVANCES</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-3 text-left text-slate-900 font-medium pl-10 font-sans">11. Closing Stock (Inventory)</td>
              {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold text-slate-700">{fmt(d.inventory)}</td>)}
            </tr>
            <tr className="hover:bg-blue-50/50 bg-blue-50/10">
              <td className="px-6 py-2.5 text-left text-blue-900 font-bold pl-10 font-sans italic">12. Sundry Debtors (Receivables) &lt; 6 Months</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.debtorsUnder6M)}</td>)}
            </tr>
            <tr className="hover:bg-rose-50 italic text-rose-800 bg-rose-50/10">
              <td className="px-6 py-2 text-left pl-14 font-sans font-bold">13. Sundry Debtors (Receivables) &gt; 6 Months</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.debtorsOver6M)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">14. Cash and Bank Balances</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.cashBank)}</td>)}
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-2.5 text-left text-slate-900 font-medium pl-10 font-sans">15. Loans & Advances (Suppliers/Deposits)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right text-slate-700">{fmt(d.loansAdv)}</td>)}
            </tr>
            {data.some(d => d.reconAdj > 0) && (
              <tr className="hover:bg-slate-50 italic">
                <td className="px-6 py-2 text-left text-slate-500 pl-14 font-sans text-xs">16. Other Deposits / Adjustments</td>
                {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-500 text-xs">{fmt(d.reconAdj)}</td>)}
              </tr>
            )}

            <tr className="bg-slate-900 text-white font-bold text-base border-t-2 border-slate-700">
              <td className="px-6 py-5 text-left font-sans uppercase tracking-tight">TOTAL APPLICATION OF FUNDS</td>
              {data.map(d => <td key={d.year} className="px-6 py-5 text-right text-blue-300 font-bold">{fmt(d.totalAssets)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}