// components/reports/Assumptions.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmt, fmtR } from "../../lib/format";

interface AssumptionsProps {
  data: ProjectedYear[];
}

export default function Assumptions({ data }: AssumptionsProps) {
  // Labels for the projection years
  const years = data.map(d => `FY ${d.year}`);

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      {/* Schedule Header */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">Basis of Projections</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Assumptions & Capacity Utilization Analysis</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Schedule A</span>
          <span className="text-[8px] text-slate-500 mt-1 uppercase font-mono tracking-widest">Logical Anchor v1.0</span>
        </div>
      </div>

      <div className="p-8 space-y-12">
        {/* I. Operational Growth Assumptions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-blue-600"></div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">I. Operational Growth Assumptions</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[11px] font-mono border border-slate-100">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left border-b border-slate-200">Particulars</th>
                  {years.map(y => <th key={y} className="px-6 py-3 text-right border-b border-slate-200">{y}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-3 text-slate-600 font-sans">Revenue Growth Rate (%)</td>
                  {data.map((d, i) => {
                    const growth = i === 0 ? 0 : ((d.sales / data[i - 1].sales) - 1) * 100;
                    return (
                      <td key={i} className="px-6 py-3 text-right font-bold text-blue-600">
                        {i === 0 ? "Base Year" : `${fmtR(growth)}%`}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-slate-600 font-sans">Direct Cost (Purchases) Growth (%)</td>
                  {data.map((d, i) => {
                    const growth = i === 0 ? 0 : ((d.purchases / data[i - 1].purchases) - 1) * 100;
                    return (
                      <td key={i} className="px-6 py-3 text-right">
                        {i === 0 ? "Base Year" : `${fmtR(growth)}%`}
                      </td>
                    );
                  })}
                </tr>
                <tr className="bg-slate-50/50 font-bold">
                  <td className="px-6 py-3 text-slate-900 font-sans uppercase">EBITDA Margin (%)</td>
                  {data.map((d, i) => (
                    <td key={i} className="px-6 py-3 text-right text-emerald-700">
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
            <div className="w-1.5 h-4 bg-emerald-600"></div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">II. Capacity Utilization (Financial Terms)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="overflow-x-auto">
              <table className="min-w-full text-[11px] font-mono border border-slate-100">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-3 text-slate-600 font-sans">Projected Sales (Utilized Capacity)</td>
                    {data.map((d, i) => <td key={i} className="px-6 py-3 text-right font-bold">{fmt(d.sales)}</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-slate-600 font-sans">Max Sales Potential (100% Capacity)</td>
                    {data.map((d, i) => {
                      const cap100 = d.sales / (d.capacityUtil / 100);
                      return <td key={i} className="px-6 py-3 text-right font-bold">{fmt(cap100)}</td>;
                    })}
                  </tr>
                  <tr className="bg-slate-50 border-t-2 border-emerald-200">
                    <td className="px-6 py-4 text-slate-900 font-sans font-bold uppercase">CAPACITY UTILIZATION (%)</td>
                    {data.map((d, i) => (
                      <td key={i} className={`px-6 py-4 text-right text-sm font-bold ${d.capacityUtil > 90 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {fmtR(d.capacityUtil)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 p-6 border border-slate-200 rounded">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Technical Feasibility Note</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed italic">
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
            <div className="w-1.5 h-4 bg-amber-600"></div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">III. Working Capital Cycle Assumptions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((d, i) => (
              <div key={i} className="border border-slate-200 rounded p-4 bg-[#fcfcfc] shadow-sm">
                <div className="text-[10px] font-bold text-slate-400 text-center uppercase border-b border-slate-100 pb-2 mb-4 tracking-tighter">
                  Operating Cycle: {years[i]}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Inventory Holding:</span>
                    <span className="font-bold text-slate-800">{fmtR(d.inventory / (d.purchases / 12))} Mo.</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Debtors Collection:</span>
                    <span className="font-bold text-slate-800">{Math.round(d.debtors / (d.sales / 365))} Days</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Creditors Payment:</span>
                    <span className="font-bold text-slate-800">{Math.round(d.creditors / (d.purchases / 365))} Days</span>
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