// components/reports/Depreciation.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmt } from"../../lib/format";

export default function Depreciation({ data, years }: { data: ProjectedYear[], years: string[] }) {
 // Logic: We map our single-block engine data to"Plant & Machinery" for now.
 // In the next step, we can update engine.ts to support multiple multipliers for Building/Furniture.
 
 return (
 <div className="space-y-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="h-8 w-1 rounded-none"></div>
 <h2 className="text-xl font-bold">Depreciation Schedule (WDV Method)</h2>
 </div>

 {data.map((yearData, idx) => (
 <div key={idx} className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-3 flex justify-between items-center border-b border-black">
 <h3 className="font-bold uppercase text-[10px]">
 Schedule for Financial Year: {years[idx]}
 </h3>
 <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase">Income Tax Act Rates</span>
 </div>
 
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase font-bold text-center">
 <th className="px-4 py-3 text-left w-48 border-r border-[#ccc8be]">Particulars of Assets</th>
 <th className="px-4 py-3 border-r border-[#ccc8be]">Rate (%)</th>
 <th className="px-4 py-3 border-r border-[#ccc8be]">Opening WDV</th>
 <th className="px-4 py-3 border-r border-[#ccc8be]">Additions</th>
 <th className="px-4 py-3 border-r border-[#ccc8be]">Total</th>
 <th className="px-4 py-3 border-r border-[#ccc8be]">Depreciation</th>
 <th className="px-4 py-3">Closing WDV</th>
 </tr>
 </thead>
 <tbody className="divide-black divide-black text-right">
 
 {/* 1. Building */}
 <tr>
 <td className="px-4 py-2.5 text-left font-sans border-r border-[#f0ede6]">Building / Civil Works</td>
 <td className="px-4 py-2.5 text-center border-r border-[#f0ede6]">10%</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5">0</td>
 </tr>

 {/* 2. Plant & Machinery (Mapped to Engine Totals) */}
 <tr className="">
 <td className="px-4 py-2.5 text-left font-sans font-bold border-r border-[#f0ede6]">Plant & Machinery</td>
 <td className="px-4 py-2.5 text-center border-r border-[#f0ede6]">15%</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">{fmt(yearData.netFA + yearData.depnYr)}</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">{fmt(yearData.netFA + yearData.depnYr)}</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6] font-bold">{fmt(yearData.depnYr)}</td>
 <td className="px-4 py-2.5 font-bold">{fmt(yearData.netFA)}</td>
 </tr>

 {/* 3. Furniture */}
 <tr>
 <td className="px-4 py-2.5 text-left font-sans border-r border-[#f0ede6]">Furniture & Fixtures</td>
 <td className="px-4 py-2.5 text-center border-r border-[#f0ede6]">10%</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5">0</td>
 </tr>

 {/* 4. Computers */}
 <tr className="">
 <td className="px-4 py-2.5 text-left font-sans border-r border-[#f0ede6]">Computers / Software</td>
 <td className="px-4 py-2.5 text-center border-r border-[#f0ede6]">40%</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5 border-r border-[#f0ede6]">0</td>
 <td className="px-4 py-2.5">0</td>
 </tr>

 {/* Total Row */}
 <tr className="border-b border-black font-bold">
 <td className="px-4 py-3 text-left font-sans uppercase border-r border-black">Total Assets</td>
 <td className="px-4 py-3 text-center border-r border-black">—</td>
 <td className="px-4 py-3 border-r border-black">{fmt(yearData.netFA + yearData.depnYr)}</td>
 <td className="px-4 py-3 border-r border-black">0</td>
 <td className="px-4 py-3 border-r border-black">{fmt(yearData.netFA + yearData.depnYr)}</td>
 <td className="px-4 py-3 border-r border-black">{fmt(yearData.depnYr)}</td>
 <td className="px-4 py-3">{fmt(yearData.netFA)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 ))}
 
 <div className="border border-black p-4 rounded-none">
 <p className="text-[10px] leading-relaxed">
 * Note: Depreciation is calculated on the Written Down Value (WDV) method at the beginning of each financial year. 
 The rates used are based on the standard Income Tax Act guidelines for business assets in India.
 </p>
 </div>
 </div>
 );
}