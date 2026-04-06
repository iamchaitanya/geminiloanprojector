// components/reports/BalanceSheet.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt } from"../../lib/format";

export default function BalanceSheet({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-5 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="text-[11px] font-bold font-semibold uppercase">Detailed Projected Balance Sheet</h3>
 <p className="text-[11px] mt-1 font-mono">Comprehensive Sources & Applications of Funds</p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[11px] font-semibold px-3 py-1 rounded-none uppercase">Audit Grade</span>
 <span className="text-[10px] mt-1 uppercase font-mono text-right">Tandon/RBI Compliant</span>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold text-[11px]">
 <th className="px-6 py-4 text-left min-w-[400px]">Capital & Liabilities (Sources)</th>
 {years.map(y => <th key={y} className="px-6 py-4 text-right">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black font-mono text-[13px]">
 
 {/* 1. NET WORTH SECTION */}
 <tr className="border-y border-black font-bold text-[11px] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>I. NET WORTH & QUASI-EQUITY</td>
 </tr>
 <tr className="hover: transition-colors">
 <td className="px-6 py-3 text-left font-medium pl-10 font-sans">1. Proprietor's / Partners Capital</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.capital)}</td>)}
 </tr>
 <tr className="hover: border-y border-black border-y border-black/10">
 <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold">2. Add: Quasi-Equity (Promoter Loans)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.quasiEquity)}</td>)}
 </tr>
 <tr className="font-bold border-y border-black">
 <td className="px-6 py-3 text-left pl-10 font-sans uppercase text-[11px]">TANGIBLE NET WORTH (1 + 2)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.capital + d.quasiEquity)}</td>)}
 </tr>

 {/* 2. TERM LIABILITIES */}
 <tr className="border-y border-black font-bold text-[11px] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>II. TERM LIABILITIES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">3. Term Loans (Bank/FIs)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.termLoan)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">4. Unsecured Loans (Market/External)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.unsecured)}</td>)}
 </tr>

 {/* 3. CURRENT LIABILITIES */}
 <tr className="border-y border-black font-bold text-[11px] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>III. CURRENT LIABILITIES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-3 text-left font-bold pl-10 font-sans">5. Bank Borrowings (Proposed Limit CC/OD)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.bankBorrowings)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">6. Current Maturities of Long Term Debt (CMLTD)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.cmltd)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">7. Sundry Creditors (Trade Payables)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.creditors)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold">8. Statutory Liabilities (GST/PF/TDS)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.statutoryDues)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">9. Other Current Liabilities & Provisions</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.otherCL)}</td>)}
 </tr>

 <tr className="border-b border-black font-bold text-[11px] border-t-2 border-black">
 <td className="px-6 py-5 text-left font-sans uppercase">TOTAL SOURCES OF FUNDS</td>
 {data.map(d => <td key={d.year} className="px-6 py-5 text-right font-bold">{fmt(d.totalLiab)}</td>)}
 </tr>

 <tr className="h-8"><td colSpan={years.length + 1}></td></tr>

 {/* FIXED ALIGNMENT: ASSETS SECTION HEADER */}
 <tr className="border-b border-black border-y-4 border-black uppercase font-bold text-[11px]">
 <td className="px-6 py-4 text-left font-sans">Fixed & Current Assets (Applications)</td>
 {years.map(y => <td key={y} className="px-6 py-4 text-right font-sans">{y}</td>)}
 </tr>

 {/* 4. FIXED ASSETS */}
 <tr className="border-y border-black font-bold text-[11px] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>IV. FIXED ASSETS</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">10. Gross Block (At Cost)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.grossFA)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left pl-14 font-sans font-bold">11. Less: Accumulated Depreciation</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">({fmt(d.accDepn)})</td>)}
 </tr>
 <tr className="font-bold border-y border-black">
 <td className="px-6 py-3 text-left pl-10 font-sans uppercase text-[11px]">NET FIXED ASSETS (10 - 11)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right">{fmt(d.netFA)}</td>)}
 </tr>

 {/* 5. CURRENT ASSETS */}
 <tr className="border-y border-black font-bold text-[11px] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>V. CURRENT ASSETS, LOANS & ADVANCES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-3 text-left font-medium pl-10 font-sans">12. Closing Stock (Inventory)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-bold">{fmt(d.inventory)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-bold pl-10 font-sans">13. Sundry Debtors (Receivables) &lt; 6 Months</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right font-bold">{fmt(d.debtorsUnder6M)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2 text-left pl-14 font-sans font-bold">14. Sundry Debtors (Receivables) &gt; 6 Months</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.debtorsOver6M)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">15. Cash and Bank Balances</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.cashBank)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-medium pl-10 font-sans">16. Loans & Advances (Suppliers/Deposits)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.loansAdv)}</td>)}
 </tr>
 {data.some(d => d.reconAdj > 0) && (
 <tr className="hover:">
 <td className="px-6 py-2 text-left pl-14 font-sans text-[11px]">17. Other Deposits / Adjustments</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-[11px]">{fmt(d.reconAdj)}</td>)}
 </tr>
 )}

 <tr className="border-b border-black font-bold text-[11px] border-t-2 border-black">
 <td className="px-6 py-5 text-left font-sans uppercase">TOTAL APPLICATION OF FUNDS</td>
 {data.map(d => <td key={d.year} className="px-6 py-5 text-right font-bold">{fmt(d.totalAssets)}</td>)}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}