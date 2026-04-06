// components/reports/Assumptions.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt, fmtR } from"../../lib/format";

interface AssumptionsProps {
 data: ProjectedYear[];
}

export default function Assumptions({ data }: AssumptionsProps) {
 // Labels for the projection years
 const years = data.map(d => `FY ${d.year}`);

 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 {/* Schedule Header */}
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">Basis of Projections</h3>
 <p className="text-[10px] mt-0.5 font-mono">Assumptions & Capacity Utilization Analysis</p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Schedule A</span>
 <span className="text-[8px] mt-1 uppercase font-mono">Logical Anchor v1.0</span>
 </div>
 </div>

 <div className="p-8 space-y-12">
 {/* I. Operational Growth Assumptions */}
 <section>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-1.5 h-4"></div>
 <h4 className="text-[11px] font-bold uppercase">I. Operational Growth Assumptions</h4>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full text-[11px] font-mono border border-black">
 <thead className="uppercase">
 <tr>
 <th className="px-6 py-3 text-left border-b border-black">Particulars</th>
 {years.map(y => <th key={y} className="px-6 py-3 text-right border-b border-black">{y}</th>)}
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 <tr>
 <td className="px-6 py-3 font-sans">Revenue Growth Rate (%)</td>
 {data.map((d, i) => {
 const growth = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
 return (
 <td key={i} className="px-6 py-3 text-right font-bold">
 {i === 0 ?"Base Year" : `${fmtR(growth)}%`}
 </td>
 );
 })}
 </tr>
 <tr>
 <td className="px-6 py-3 font-sans">Direct Cost (Purchases) Growth (%)</td>
 {data.map((d, i) => {
 const growth = i === 0 ? 0 : ((d.purchases / data[i - 1].purchases) - 1) * 100;
 return (
 <td key={i} className="px-6 py-3 text-right">
 {i === 0 ?"Base Year" : `${fmtR(growth)}%`}
 </td>
 );
 })}
 </tr>
 <tr className="font-bold">
 <td className="px-6 py-3 font-sans uppercase">EBITDA Margin (%)</td>
 {data.map((d, i) => (
 <td key={i} className="px-6 py-3 text-right">
 {fmtR((d.ebitda / d.sales) * 100)}%
 </td>
 ))}
 </tr>
 </tbody>
 </table>
 </div>
 </section>

 {/* II. Capacity Utilization Analysis */}
 <section>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-1.5 h-4"></div>
 <h4 className="text-[11px] font-bold uppercase">II. Capacity Utilization (Financial Terms)</h4>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
 <div className="overflow-x-auto">
 <table className="min-w-full text-[11px] font-mono border border-black">
 <tbody className="divide-black divide-black">
 <tr>
 <td className="px-6 py-3 font-sans">Projected Sales (Utilized Capacity)</td>
 {data.map((d, i) => <td key={i} className="px-6 py-3 text-right font-bold">{fmt(d.sales)}</td>)}
 </tr>
 <tr>
 <td className="px-6 py-3 font-sans">Max Sales Potential (100% Capacity)</td>
 {data.map((d, i) => {
 const cap100 = d.sales / (d.capacityUtil / 100);
 return <td key={i} className="px-6 py-3 text-right font-bold">{fmt(cap100)}</td>;
 })}
 </tr>
 <tr className="border-t-2 border-black">
 <td className="px-6 py-4 font-sans font-bold uppercase">CAPACITY UTILIZATION (%)</td>
 {data.map((d, i) => (
 <td key={i} className={`px-6 py-4 text-right text-[11px] font-bold ${d.capacityUtil > 90 ? '' : ''}`}>
 {fmtR(d.capacityUtil)}%
 </td>
 ))}
 </tr>
 </tbody>
 </table>
 </div>
 <div className="p-6 border border-black rounded">
 <h5 className="text-[10px] font-bold uppercase mb-2">Technical Feasibility Note</h5>
 <p className="text-[11px] leading-relaxed">
 * Note: The projected growth is underpinned by existing installed infrastructure. 
 Utilization levels are maintained within the optimal banking threshold of 70-85% for standard units. 
 Any utilization above 90% is subject to verification of proposed Capital Expenditure (Capex).
 </p>
 </div>
 </div>
 </section>

 {/* III. Working Capital Cycle Assumptions */}
 <section>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-1.5 h-4"></div>
 <h4 className="text-[11px] font-bold uppercase">III. Working Capital Cycle Assumptions</h4>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {data.map((d, i) => (
 <div key={i} className="border border-black rounded p-4">
 <div className="text-[10px] font-bold text-center uppercase border-b border-black pb-2 mb-4">
 Operating Cycle: {years[i]}
 </div>
 <div className="space-y-3">
 <div className="flex justify-between text-[11px] font-mono">
 <span className="">Inventory Holding:</span>
 <span className="font-bold">{fmtR(d.inventory / (d.purchases / 12))} Mo.</span>
 </div>
 <div className="flex justify-between text-[11px] font-mono">
 <span className="">Debtors Collection:</span>
 <span className="font-bold">{Math.round(d.debtors / (d.sales / 365))} Days</span>
 </div>
 <div className="flex justify-between text-[11px] font-mono">
 <span className="">Creditors Payment:</span>
 <span className="font-bold">{Math.round(d.creditors / (d.purchases / 365))} Days</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </section>
 </div>
 </div>
 );
}