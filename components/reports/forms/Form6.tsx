// components/reports/forms/Form6.tsx
import { ProjectedYear } from "../../../lib/engine";
import { fmt } from "../../../lib/format";

export default function Form6({ data, years }: { data: ProjectedYear[], years: string[] }) {
  // Fund Flow requires at least two years to show "movement"
  // We skip Year 1 for the 'Change' calculation or assume a zero-baseline
  
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form VI</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Funds Flow Statement (Comparison of Projections)</p>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form VI</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase font-bold">
              <th className="px-6 py-3 text-left tracking-wider min-w-[380px]">Sr. Particulars</th>
              {years.slice(1).map(y => <th key={y} className="px-6 py-3 text-right tracking-wider">From {years[years.indexOf(y)-1]} to {y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            
            {/* SOURCES OF FUNDS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length}>A. SOURCES OF FUNDS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">1. Net Profit after tax</td>
              {data.slice(1).map((d, i) => <td key={i} className="px-6 py-2 text-right">{fmt(d.netProfit)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">2. Depreciation</td>
              {data.slice(1).map((d, i) => <td key={i} className="px-6 py-2 text-right">{fmt(d.depnYr)}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">3. Increase in Capital / Proprietor's Funds</td>
              {data.slice(1).map((d, i) => {
                const prev = data[i]; // data[i] is the previous year because we sliced from index 1
                const diff = d.capital - (prev.capital + d.netProfit); 
                // Note: Only fresh capital, excluding internal profit generation
                return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">4. Increase in Term Liabilities</td>
              {data.slice(1).map((d, i) => {
                const diff = d.unsecured - data[i].unsecured;
                return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">5. Decrease in Fixed Assets</td>
              {data.slice(1).map((d, i) => {
                const diff = data[i].grossFA - d.grossFA;
                return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">TOTAL SOURCES (A)</td>
              {data.slice(1).map((d, i) => {
                const prev = data[i];
                const capInc = Math.max(d.capital - (prev.capital + d.netProfit), 0);
                const termInc = Math.max(d.unsecured - prev.unsecured, 0);
                const faDec = Math.max(prev.grossFA - d.grossFA, 0);
                return <td key={i} className="px-6 py-2.5 text-right font-bold">{fmt(d.netProfit + d.depnYr + capInc + termInc + faDec)}</td>;
              })}
            </tr>

            {/* APPLICATION OF FUNDS */}
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={years.length}>B. APPLICATION OF FUNDS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">1. Increase in Fixed Assets</td>
              {data.slice(1).map((d, i) => {
                const diff = d.grossFA - data[i].grossFA;
                return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">2. Decrease in Term Liabilities</td>
              {data.slice(1).map((d, i) => {
                const diff = data[i].unsecured - d.unsecured;
                return <td key={i} className="px-6 py-2 text-right">{fmt(diff > 0 ? diff : 0)}</td>;
              })}
            </tr>
            <tr>
              <td className="px-6 py-2 text-left font-sans pl-10">3. Dividend / Proprietor's Drawings</td>
              {data.slice(1).map((d, i) => {
                const prev = data[i];
                // Drawings = Opening Capital + Net Profit - Closing Capital
                const drawings = (prev.capital + d.netProfit) - d.capital;
                return <td key={i} className="px-6 py-2 text-right">{fmt(drawings > 0 ? drawings : 0)}</td>;
              })}
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 font-sans uppercase">TOTAL APPLICATIONS (B)</td>
              {data.slice(1).map((d, i) => {
                const prev = data[i];
                const faInc = Math.max(d.grossFA - prev.grossFA, 0);
                const termDec = Math.max(prev.unsecured - d.unsecured, 0);
                const drawings = Math.max((prev.capital + d.netProfit) - d.capital, 0);
                return <td key={i} className="px-6 py-2.5 text-right font-bold">{fmt(faInc + termDec + drawings)}</td>;
              })}
            </tr>

            {/* RECONCILIATION */}
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-6 py-4 text-left font-sans uppercase tracking-tight italic underline">C. NET INCREASE / (DECREASE) IN WORKING CAPITAL (A - B)</td>
              {data.slice(1).map((d, i) => {
                const prev = data[i];
                // Calculation for Sources (A)
                const capInc = Math.max(d.capital - (prev.capital + d.netProfit), 0);
                const termInc = Math.max(d.unsecured - prev.unsecured, 0);
                const faDec = Math.max(prev.grossFA - d.grossFA, 0);
                const totalA = d.netProfit + d.depnYr + capInc + termInc + faDec;
                
                // Calculation for Applications (B)
                const faInc = Math.max(d.grossFA - prev.grossFA, 0);
                const termDec = Math.max(prev.unsecured - d.unsecured, 0);
                const drawings = Math.max((prev.capital + d.netProfit) - d.capital, 0);
                const totalB = faInc + termDec + drawings;

                return <td key={i} className="px-6 py-4 text-right text-base text-blue-400">{fmt(totalA - totalB)}</td>;
              })}
            </tr>

            <tr className="bg-emerald-50 text-emerald-900 font-bold border-t border-emerald-200">
              <td className="px-6 py-2.5 text-left font-sans pl-10 italic">Check: Actual Change in NWC (from Form III)</td>
              {data.slice(1).map((d, i) => {
                const prevNWC = data[i].totalCA - (data[i].totalCL + data[i].bankBorrowings);
                const currNWC = d.totalCA - (d.totalCL + d.bankBorrowings);
                return <td key={i} className="px-6 py-2.5 text-right">{fmt(currNWC - prevNWC)}</td>;
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}