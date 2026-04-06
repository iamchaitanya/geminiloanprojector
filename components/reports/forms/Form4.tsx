// components/reports/forms/Form4.tsx
import { ProjectedYear } from"../../../lib/engine";
import { fmt, fmtR } from"../../../lib/format";

export default function Form4({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">CMA Form IV</h3>
 <p className="text-[10px] mt-0.5 font-mono">Comparative Statement of Current Assets & Liabilities</p>
 </div>
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Form IV</span>
 </div>

 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold">
 <th className="px-6 py-3 text-left min-w-[450px]">Sr. No. & Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-3 text-right">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 
 {/* I. CURRENT ASSETS */}
 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={years.length + 1}>I. CURRENT ASSETS</td>
 </tr>
 
 <tr>
 <td className="px-6 py-2 pl-6 font-sans font-bold">1. Raw Materials (including stores and spares)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.inventory)}</td>)}
 </tr>
 <tr className="">
 <td className="px-6 py-1.5 pl-12 font-sans">a. Imported</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">0</td>)}
 </tr>
 <tr className="">
 <td className="px-6 py-1.5 pl-12 font-sans">b. Indigenous</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.inventory)}</td>)}
 </tr>
 <tr className="text-[10px]">
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
 <tr className="border-y border-black">
 <td className="px-6 py-1.5 pl-12 font-sans font-bold">a. Up to 6 months (Liquid)</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.debtorsUnder6M)}</td>)}
 </tr>
 <tr className="">
 <td className="px-6 py-1.5 pl-12 font-sans font-bold">b. More than 6 months (Excluded from DP)</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right">{fmt(d.debtorsOver6M)}</td>)}
 </tr>
 <tr className="text-[10px]">
 <td className="px-6 py-1.5 pl-12 font-sans">Collection period (Days Sales)</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold">{Math.round(d.debtors / (d.sales / 365))} Days</td>)}
 </tr>

 <tr><td className="px-6 py-2 pl-6 font-sans">6. Advances to suppliers of raw materials, stores, spares, etc.</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.loansAdv)}</td>)}</tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">7. Other current assets (incl. cash, bank & prepaid exp)</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cashBank + d.reconAdj)}</td>)}</tr>
 
 <tr className="border-b border-black font-bold">
 <td className="px-6 py-3 pl-6 font-sans uppercase text-[11px]">8. TOTAL CURRENT ASSETS (1 to 7)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right text-[11px]">{fmt(d.totalCA)}</td>)}
 </tr>

 {/* II. CURRENT LIABILITIES */}
 <tr className="border-y border-black font-bold text-[10px] uppercase border-t-2 border-black">
 <td className="px-6 py-2 text-left" colSpan={years.length + 1}>II. CURRENT LIABILITIES</td>
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">9. Creditors for purchases of raw materials, stores, spares, etc.</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.creditors)}</td>)}
 </tr>
 <tr className="text-[10px]">
 <td className="px-6 py-1.5 pl-12 font-sans">Payment period (Days Purchases)</td>
 {data.map(d => <td key={d.year} className="px-6 py-1.5 text-right font-bold">{Math.round(d.creditors / (d.purchases / 365))} Days</td>)}
 </tr>
 <tr><td className="px-6 py-2 pl-6 font-sans">10. Advances from customers</td>{data.map(d => <td key={d.year} className="px-6 py-2 text-right">0</td>)}</tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">11. Installments of Term Loans (CMLTD)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right">{fmt(d.cmltd)}</td>)}
 </tr>
 <tr className="">
 <td className="px-6 py-2 pl-6 font-sans font-bold">12. Statutory, Tax & Other Liabilities</td>
 {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold">{fmt(d.statutoryDues + d.otherCL + d.tax)}</td>)}
 </tr>
 
 <tr className="border-y border-[#ccc8be] font-bold">
 <td className="px-6 py-2.5 pl-6 font-sans uppercase">13. TOTAL CURRENT LIABILITIES (9 to 12)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.totalCL)}</td>)}
 </tr>

 {/* III. WORKING CAPITAL ANALYSIS */}
 <tr className="border-y border-black font-bold border-t-2 border-black">
 <td className="px-6 py-4 pl-6 font-sans uppercase text-[11px]">14. WORKING CAPITAL GAP (8 - 13)</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-[11px] font-bold">{fmt(d.totalCA - d.totalCL)}</td>)}
 </tr>
 <tr className="font-bold border-y border-black">
 <td className="px-6 py-3 pl-6 font-sans uppercase text-[10px]">15. ACTUAL/PROJECTED NET WORKING CAPITAL (NWC)</td>
 {data.map(d => <td key={d.year} className="px-6 py-3 text-right font-mono">{fmt(d.totalCA - (d.totalCL + d.bankBorrowings))}</td>)}
 </tr>
 <tr className="border-b border-black font-bold">
 <td className="px-6 py-4 pl-6 font-sans uppercase text-[11px]">16. ASSESSED BANK FINANCE (Req. Limits)</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl">{fmt(d.bankBorrowings)}</td>)}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}