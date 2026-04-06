// components/reports/forms/Form6.tsx
import { ProjectedYear } from"../../../lib/engine";
import { fmt } from"../../../lib/format";

export default function Form6({ data, years }: { data: ProjectedYear[], years: string[] }) {
 // Fund Flow requires at least two years to show"movement"
 if (data.length < 2) return <div className="p-4">Funds flow analysis requires at least two years of data.</div>;

 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 {/* 1. Standardized Header */}
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">CMA Form VI</h3>
 <p className="text-[10px] mt-0.5 font-mono">Funds Flow Statement (Comparison of Projections)</p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Form VI</span>
 <span className="text-[8px] mt-1 uppercase font-mono">Anti-Diversion Audit v4.0</span>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold">
 <th className="px-6 py-3 text-left min-w-[420px]">Sr. No. & Particulars</th>
 {years.slice(1).map(y => (
 <th key={y} className="px-6 py-3 text-right">
 FY {years[years.indexOf(y)-1]} to {y}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 
 {/* A. SOURCES OF FUNDS (Entries 1 to 5) */}
 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={years.length}>A. SOURCES OF FUNDS</td>
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">1. Net Profit after tax</td>
 {data.slice(1).map((d, i) => <td key={i} className="px-6 py-2 text-right">{fmt(d.netProfit)}</td>)}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">2. Depreciation</td>
 {data.slice(1).map((d, i) => <td key={i} className="px-6 py-2 text-right">{fmt(d.depnYr)}</td>)}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">3. Increase in Capital / Proprietor's Funds (Fresh Infusion)</td>
 {data.slice(1).map((d, i) => {
 const prev = data[i];
 const diff = d.capital - (prev.capital + d.netProfit);
 return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
 })}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">4. Increase in Long-Term Liabilities (Unsecured/Term Loans)</td>
 {data.slice(1).map((d, i) => {
 const termInc = Math.max(0, d.termLoan - data[i].termLoan + d.tlRepayment);
 const unsecInc = Math.max(0, d.unsecured - data[i].unsecured);
 return <td key={i} className="px-6 py-2 text-right">{fmt(termInc + unsecInc)}</td>;
 })}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">5. Decrease in Fixed Assets (Sale of Assets)</td>
 {data.slice(1).map((d, i) => {
 const diff = data[i].grossFA - d.grossFA;
 return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
 })}
 </tr>
 <tr className="font-bold border-y border-black uppercase">
 <td className="px-6 py-2.5 pl-6 font-sans">TOTAL SOURCES (A)</td>
 {data.slice(1).map((d, i) => {
 const prev = data[i];
 const capInc = Math.max(d.capital - (prev.capital + d.netProfit), 0);
 const termInc = Math.max(0, d.termLoan - prev.termLoan + d.tlRepayment) + Math.max(0, d.unsecured - prev.unsecured);
 const faDec = Math.max(prev.grossFA - d.grossFA, 0);
 return <td key={i} className="px-6 py-2.5 text-right">{fmt(d.netProfit + d.depnYr + capInc + termInc + faDec)}</td>;
 })}
 </tr>

 {/* B. APPLICATION OF FUNDS (Entries 6 to 8) */}
 <tr className="border-y border-black font-bold text-[10px] uppercase border-t-2 border-black">
 <td className="px-6 py-2 text-left" colSpan={years.length}>B. APPLICATION OF FUNDS</td>
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">6. Increase in Fixed Assets (Capital Expenditure)</td>
 {data.slice(1).map((d, i) => {
 const diff = d.grossFA - data[i].grossFA;
 return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
 })}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">7. Decrease in Term Liabilities (Repayment)</td>
 {data.slice(1).map((d, i) => {
 const unsecDec = Math.max(0, data[i].unsecured - d.unsecured);
 return <td key={i} className="px-6 py-2 text-right">{fmt(d.tlRepayment + unsecDec)}</td>;
 })}
 </tr>
 <tr>
 <td className="px-6 py-2 pl-6 font-sans">8. Dividend / Proprietor's Drawings</td>
 {data.slice(1).map((d, i) => {
 const prev = data[i];
 const drawings = Math.max((prev.capital + d.netProfit) - d.capital, 0);
 return <td key={i} className="px-6 py-2 text-right">{fmt(drawings)}</td>;
 })}
 </tr>
 <tr className="font-bold border-y border-black uppercase">
 <td className="px-6 py-2.5 pl-6 font-sans">TOTAL APPLICATIONS (B)</td>
 {data.slice(1).map((d, i) => {
 const prev = data[i];
 const faInc = Math.max(d.grossFA - prev.grossFA, 0);
 const termDec = d.tlRepayment + Math.max(0, prev.unsecured - d.unsecured);
 const drawings = Math.max((prev.capital + d.netProfit) - d.capital, 0);
 return <td key={i} className="px-6 py-2.5 text-right">{fmt(faInc + termDec + drawings)}</td>;
 })}
 </tr>

 {/* RECONCILIATION */}
 <tr className="border-b border-black font-bold border-t-2 border-black">
 <td className="px-6 py-4 pl-6 font-sans uppercase underline text-[11px]">C. NET INCREASE / (DECREASE) IN NWC (A - B)</td>
 {data.slice(1).map((d, i) => {
 const prev = data[i];
 const capInc = Math.max(d.capital - (prev.capital + d.netProfit), 0);
 const termInc = Math.max(0, d.termLoan - prev.termLoan + d.tlRepayment) + Math.max(0, d.unsecured - prev.unsecured);
 const faDec = Math.max(prev.grossFA - d.grossFA, 0);
 const totalA = d.netProfit + d.depnYr + capInc + termInc + faDec;
 
 const faInc = Math.max(d.grossFA - prev.grossFA, 0);
 const termDec = d.tlRepayment + Math.max(0, prev.unsecured - d.unsecured);
 const drawings = Math.max((prev.capital + d.netProfit) - d.capital, 0);
 const totalB = faInc + termDec + drawings;

 const netChange = totalA - totalB;
 return <td key={i} className={`px-6 py-4 text-right text-[11px] ${netChange >= 0 ? '' : ''}`}>{fmt(netChange)}</td>;
 })}
 </tr>

 {/* INSPECTOR'S CHECK */}
 <tr className="border-y border-black font-bold border-t border-black">
 <td className="px-6 py-3 pl-10 font-sans uppercase text-[10px]">Actual Change in NWC (Verified from Form III)</td>
 {data.slice(1).map((d, i) => {
 // Bank Borrowings are excluded from NWC calculation as per CMA norms
 const prevNWC = data[i].totalCA - data[i].totalCL;
 const currNWC = d.totalCA - d.totalCL;
 return <td key={i} className="px-6 py-3 text-right">{fmt(currNWC - prevNWC)}</td>;
 })}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}