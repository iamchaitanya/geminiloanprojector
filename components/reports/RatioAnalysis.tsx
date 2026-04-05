// components/reports/RatioAnalysis.tsx
import { ProjectedYear } from "../../lib/engine";
import { fmtR } from "../../lib/format";

export default function RatioAnalysis({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
  
  // RESTORED: Original logic gates from your uploaded file
  const getStatusColor = (val: number, type: string) => {
    switch (type) {
      case 'np': return val >= 7 ? 'text-emerald-600' : val >= 4 ? 'text-amber-600' : 'text-rose-600';
      case 'gp': return val >= 10 ? 'text-emerald-600' : val >= 5 ? 'text-amber-600' : 'text-rose-600';
      case 'cr': return val >= 1.25 ? 'text-emerald-600' : val >= 1.1 ? 'text-amber-600' : 'text-rose-600';
      case 'de': return val <= 2.0 ? 'text-emerald-600' : val <= 3.0 ? 'text-amber-600' : 'text-rose-600';
      case 'dscr': return val >= 1.5 ? 'text-emerald-600' : val >= 1.0 ? 'text-amber-600' : 'text-rose-600';
      case 'days': return val <= 45 ? 'text-emerald-600' : val <= 75 ? 'text-amber-600' : 'text-rose-600';
      // New audit-specific gates
      case 'toltnw': return val <= 3.0 ? 'text-emerald-600' : val <= 4.5 ? 'text-amber-600' : 'text-rose-600';
      default: return 'text-slate-700';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-900 px-6 py-5 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Ratio Analysis & Benchmarks</h3>
          <p className="text-slate-400 text-xs mt-1">Full 22-Point Financial Diagnostic Suite</p>
        </div>
        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md tracking-wider uppercase">Audit Ready</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm whitespace-nowrap">
          <thead className="bg-slate-50 font-mono">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 uppercase tracking-wider text-xs min-w-[320px]">Ratio Description</th>
              {years.map(y => <th key={y} className="px-6 py-4 text-right font-semibold text-slate-700 uppercase tracking-wider text-xs">{y}</th>)}
              <th className="px-6 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs">Benchmark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-mono">
            
            {/* 1. PROFITABILITY RATIOS (Restored Original) */}
            <tr className="bg-slate-50/50 font-bold text-slate-800 text-[0.65rem] uppercase tracking-widest">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>1. Profitability Ratios</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Gross Profit Margin (%)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.gpRatio, 'gp')}`}>{fmtR(d.gpRatio)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 10% Good</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Net Profit Margin (%)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.npRatio, 'np')}`}>{fmtR(d.npRatio)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 7% Good</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">EBITDA Margin (%)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR((d.ebitda/d.sales)*100)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 10% Good</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Return on Equity (ROE %)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR((d.netProfit/d.capital)*100)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 12% Good</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Return on Assets (ROA %)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR((d.netProfit/d.totalAssets)*100)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 5% Good</td>
            </tr>

            {/* 2. LIQUIDITY RATIOS (Restored Original) */}
            <tr className="bg-slate-50/50 font-bold text-slate-800 text-[0.65rem] uppercase tracking-widest">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>2. Liquidity Ratios</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Current Ratio (incl. CC)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.currentRatio, 'cr')}`}>{fmtR(d.currentRatio)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">1.1 – 1.4</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Current Ratio (excl. bank)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.currentRatioExBank, 'cr')}`}>{fmtR(d.currentRatioExBank)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 1.33</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Quick Ratio</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR((d.debtors + d.cashBank) / (d.totalCL + loanAmount))}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 1.00</td>
            </tr>

            {/* 3. SOLVENCY & LEVERAGE (Restored Original + Added Audit Specs) */}
            <tr className="bg-slate-50/50 font-bold text-slate-800 text-[0.65rem] uppercase tracking-widest">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>3. Solvency & Leverage</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Debt to Equity (D:E)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.deRatio, 'de')}`}>{fmtR(d.deRatio)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≤ 2.0</td>
            </tr>
            <tr className="bg-emerald-50/30">
              <td className="px-6 py-2 text-left text-emerald-900 font-bold pl-10 font-sans italic">TOL / TNW (Regulatory Cap)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.tolTnw, 'toltnw')}`}>{fmtR(d.tolTnw)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≤ 3.0 Best</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Interest Coverage Ratio (ICR)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(d.ebitda / d.interest)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 2.5</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">DSCR</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.dscr, 'dscr')}`}>{fmtR(d.dscr)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 1.50</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Total Debt / EBITDA</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(loanAmount / d.ebitda)}×</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">{'< 4.0'}</td>
            </tr>

            {/* 4. EFFICIENCY & CAPACITY (Restored Original + Added Audit Specs) */}
            <tr className="bg-slate-50/50 font-bold text-slate-800 text-[0.65rem] uppercase tracking-widest">
              <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>4. Efficiency Ratios</td>
            </tr>
            <tr className="bg-blue-50/30">
              <td className="px-6 py-2 text-left text-blue-900 font-bold pl-10 font-sans italic">Capacity Utilization (%)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right font-bold text-blue-800">{fmtR(d.capacityUtil)}%</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">70% – 85%</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Debtor Collection Period (Days)</td>
              {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.debtors / (d.sales / 365), 'days')}`}>{Math.round(d.debtors / (d.sales / 365))}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≤ 45 Days</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Creditor Payment Period (Days)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{Math.round(d.creditors / (d.purchases / 365))}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">30 – 75 Days</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Inventory Holding (Months)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(d.inventory / (d.purchases / 12), 1)}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">1.5 – 3.0</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Inventory Turnover (×)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(d.purchases / d.inventory, 1)}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 4.0×</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Working Capital Turnover (×)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(d.sales / (d.totalCA - (d.totalCL + loanAmount)), 1)}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">3.0 – 8.0×</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left text-slate-700 pl-10 font-sans">Asset Turnover (×)</td>
              {data.map(d => <td key={d.year} className="px-6 py-2 text-right text-slate-700">{fmtR(d.sales / d.totalAssets, 1)}</td>)}
              <td className="px-6 py-2 text-right text-slate-400 text-[10px]">≥ 1.5×</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}