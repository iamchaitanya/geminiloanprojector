// components/reports/CashFlow.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt } from"../../lib/format";

export default function CashFlow({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
 
 return (
 <div className="border border-black rounded-none overflow-hidden">
 <div className="border-b border-black px-6 py-5 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="text-[11px] font-bold font-semibold">Cash Flow Statement (Indirect Method)</h3>
 <p className="text-[11px] mt-1">As per AS-3 Revised Format</p>
 </div>
 <span className="text-[11px] font-semibold border border-black px-2.5 py-1 rounded-none">CASH FLOW</span>
 </div>
 
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr>
 <th className="px-6 py-4 text-left font-semibold uppercase text-[11px] min-w-[350px]">Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-4 text-right font-semibold uppercase text-[11px]">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black text-[#0f0e0b]">
 
 {/* A. OPERATING ACTIVITIES */}
 <tr className="border-y border-black font-bold text-[0.68rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>A. CASH FLOW FROM OPERATING ACTIVITIES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">Net Profit after Tax</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.netProfit)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">Add: Depreciation (non-cash)</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.depnYr)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">Add: Interest Charged Back</td>
 {data.map(d => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(d.interest)}</td>)}
 </tr>
 
 {/* Working Capital Changes */}
 <tr className="hover: text-[#8a8275] text-[11px]">
 <td className="px-6 py-2 text-left font-sans pl-14">(Increase) / Decrease in Debtors</td>
 {data.map((d, i) => {
 const diff = i === 0 ? d.debtors : d.debtors - data[i-1].debtors;
 return <td key={d.year} className="px-6 py-2 text-right">{fmt(-diff)}</td>;
 })}
 </tr>
 <tr className="hover: text-[#8a8275] text-[11px]">
 <td className="px-6 py-2 text-left font-sans pl-14">(Increase) / Decrease in Inventory</td>
 {data.map((d, i) => {
 const diff = i === 0 ? d.inventory : d.inventory - data[i-1].inventory;
 return <td key={d.year} className="px-6 py-2 text-right">{fmt(-diff)}</td>;
 })}
 </tr>
 <tr className="hover: text-[#8a8275] text-[11px]">
 <td className="px-6 py-2 text-left font-sans pl-14">Increase / (Decrease) in Creditors</td>
 {data.map((d, i) => {
 const diff = i === 0 ? d.creditors : d.creditors - data[i-1].creditors;
 return <td key={d.year} className="px-6 py-2 text-right">{fmt(diff)}</td>;
 })}
 </tr>
 <tr className="hover: text-[#8a8275] text-[11px]">
 <td className="px-6 py-2 text-left font-sans pl-14">Increase / (Decrease) in Other CL</td>
 {data.map((d, i) => {
 const diff = i === 0 ? d.otherCL : d.otherCL - data[i-1].otherCL;
 return <td key={d.year} className="px-6 py-2 text-right">{fmt(diff)}</td>;
 })}
 </tr>

 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-3 text-left font-sans pl-6">Net Cash from Operations (A)</td>
 {data.map((d, i) => {
 const incD = i === 0 ? d.debtors : d.debtors - data[i-1].debtors;
 const incI = i === 0 ? d.inventory : d.inventory - data[i-1].inventory;
 const incC = i === 0 ? d.creditors : d.creditors - data[i-1].creditors;
 const incO = i === 0 ? d.otherCL : d.otherCL - data[i-1].otherCL;
 const total = d.netProfit + d.depnYr + d.interest - incD - incI + incC + incO;
 return <td key={d.year} className="px-6 py-3 text-right">{fmt(total)}</td>;
 })}
 </tr>

 <tr className="h-4"></tr>

 {/* B. INVESTING ACTIVITIES */}
 <tr className="border-y border-black font-bold text-[0.68rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>B. CASH FLOW FROM INVESTING ACTIVITIES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">Purchase of Fixed Assets / Capex</td>
 {data.map((d, i) => {
 const capex = i === 0 ? d.grossFA : d.grossFA - data[i-1].grossFA;
 return <td key={d.year} className="px-6 py-2.5 text-right">({fmt(capex)})</td>;
 })}
 </tr>
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-3 text-left font-sans pl-6">Net Cash from Investing (B)</td>
 {data.map((d, i) => {
 const capex = i === 0 ? d.grossFA : d.grossFA - data[i-1].grossFA;
 return <td key={d.year} className="px-6 py-3 text-right">({fmt(capex)})</td>;
 })}
 </tr>

 <tr className="h-4"></tr>

 {/* C. FINANCING ACTIVITIES */}
 <tr className="border-y border-black font-bold text-[0.68rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 1}>C. CASH FLOW FROM FINANCING ACTIVITIES</td>
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">CC Limit Availed / Loan Received</td>
 {data.map((d, i) => <td key={d.year} className="px-6 py-2.5 text-right">{fmt(i === 0 ? loanAmount : 0)}</td>)}
 </tr>
 <tr className="hover:">
 <td className="px-6 py-2.5 text-left font-sans pl-10">Proprietor's Drawings / Withdrawals</td>
 {data.map((d, i) => {
 const drawings = i === 0 ? (d.netProfit - d.capital + loanAmount) : (d.netProfit - (d.capital - data[i-1].capital));
 return <td key={d.year} className="px-6 py-2.5 text-right">({fmt(Math.abs(drawings))})</td>;
 })}
 </tr>
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-3 text-left font-sans pl-6">Net Cash from Financing (C)</td>
 {data.map((d, i) => {
 const drawings = i === 0 ? (d.netProfit - d.capital + loanAmount) : (d.netProfit - (d.capital - data[i-1].capital));
 const total = (i === 0 ? loanAmount : 0) - Math.abs(drawings);
 return <td key={d.year} className="px-6 py-3 text-right">{fmt(total)}</td>;
 })}
 </tr>

 <tr className="h-6"></tr>

 {/* RECONCILIATION */}
 <tr className="font-bold border-t-2 border-[#ccc8be]">
 <td className="px-6 py-4 text-left font-sans uppercase">Net Increase / (Decrease) in Cash (A+B+C)</td>
 {data.map((d, i) => {
 // Calculation of Net CF
 const incD = i === 0 ? d.debtors : d.debtors - data[i-1].debtors;
 const incI = i === 0 ? d.inventory : d.inventory - data[i-1].inventory;
 const incC = i === 0 ? d.creditors : d.creditors - data[i-1].creditors;
 const incO = i === 0 ? d.otherCL : d.otherCL - data[i-1].otherCL;
 const cfA = d.netProfit + d.depnYr + d.interest - incD - incI + incC + incO;
 const cfB = -(i === 0 ? d.grossFA : d.grossFA - data[i-1].grossFA);
 const drawings = i === 0 ? (d.netProfit - d.capital + loanAmount) : (d.netProfit - (d.capital - data[i-1].capital));
 const cfC = (i === 0 ? loanAmount : 0) - Math.abs(drawings);
 return <td key={d.year} className="px-6 py-4 text-right text-[11px] font-bold">{fmt(cfA + cfB + cfC)}</td>;
 })}
 </tr>
 <tr className="hover: font-medium">
 <td className="px-6 py-3 text-left font-sans pl-6">Opening Cash & Bank Balance</td>
 {data.map((d, i) => {
 // Previous year's cash or initial (Sales * 2%)
 return <td key={d.year} className="px-6 py-3 text-right">{fmt(i === 0 ? d.sales * 0.02 : data[i-1].cashBank)}</td>;
 })}
 </tr>
 <tr className="border-y-2 border-black font-bold border-y-2 border-black">
 <td className="px-6 py-4 text-left font-sans">Closing Cash & Bank Balance</td>
 {data.map(d => <td key={d.year} className="px-6 py-4 text-right text-xl">{fmt(d.cashBank)}</td>)}
 </tr>

 </tbody>
 </table>
 </div>
 </div>
 );
}