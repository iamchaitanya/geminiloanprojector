// components/reports/RatioAnalysis.tsx
import { ProjectedYear } from"../../lib/engine";
import { fmtR } from"../../lib/format";

export default function RatioAnalysis({ data, years, loanAmount }: { data: ProjectedYear[], years: string[], loanAmount: number }) {
 
 const getStatusColor = (val: number, type: string) => {
 switch (type) {
 case 'np': return val >= 7 ? '' : val >= 4 ? '' : '';
 case 'gp': return val >= 10 ? '' : val >= 5 ? '' : '';
 case 'ebitda': return val >= 10 ? '' : val >= 5 ? '' : '';
 case 'bep': return val <= 75 ? '' : val <= 85 ? '' : '';
 case 'roe': return val >= 12 ? '' : val >= 6 ? '' : '';
 case 'roa': return val >= 5 ? '' : val >= 2.5 ? '' : '';
 
 case 'cr_incl': return val >= 1.1 ? '' : val >= 1.0 ? '' : '';
 case 'cr_excl': return val >= 1.33 ? '' : val >= 1.1 ? '' : '';
 case 'qr': return val >= 1.0 ? '' : val >= 0.75 ? '' : '';
 
 case 'de': return val <= 2.0 ? '' : val <= 3.0 ? '' : '';
 case 'toltnw': return val <= 3.0 ? '' : val <= 4.5 ? '' : '';
 case 'icr': return val >= 2.5 ? '' : val >= 1.5 ? '' : '';
 case 'facr': return val >= 1.33 ? '' : val >= 1.1 ? '' : '';
 case 'dscr': return val >= 1.5 ? '' : val >= 1.0 ? '' : '';
 case 'debt_ebitda': return val < 4.0 ? '' : val <= 5.0 ? '' : '';
 
 case 'debtor_days': return val <= 45 ? '' : val <= 75 ? '' : '';
 case 'creditor_days': return val <= 75 ? '' : val <= 90 ? '' : '';
 case 'inv_months': return val <= 3.0 ? '' : val <= 4.0 ? '' : '';
 case 'inv_turn': return val >= 4.0 ? '' : val >= 2.5 ? '' : '';
 case 'wc_turn': return (val >= 3.0 && val <= 8.0) ? '' : (val >= 1.5 && val <= 10.0) ? '' : '';
 case 'ass_turn': return val >= 1.5 ? '' : val >= 1.0 ? '' : '';
 case 'capacity': return val >= 65 ? '' : val >= 50 ? '' : '';
 
 default: return '';
 }
 };

 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 <div className="border-b border-black px-6 py-5 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="text-[11px] font-bold font-semibold">Ratio Analysis & Benchmarks</h3>
 <p className="text-[11px] mt-1">Full 22-Point Financial Diagnostic Suite</p>
 </div>
 <span className="text-[11px] font-semibold border border-black px-2.5 py-1 rounded-none uppercase">Audit Ready</span>
 </div>
 
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap">
 <thead className="font-mono">
 <tr>
 <th className="px-6 py-4 text-left font-semibold uppercase text-[11px] min-w-[320px]">Ratio Description</th>
 {years.map(y => <th key={y} className="px-6 py-4 text-right font-semibold uppercase text-[11px]">{y}</th>)}
 <th className="px-6 py-4 text-right font-semibold uppercase text-[11px]">Benchmark</th>
 </tr>
 </thead>
 <tbody className="divide-black divide-black font-mono">
 
 {/* 1. PROFITABILITY RATIOS */}
 <tr className="font-bold text-[0.65rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>1. Profitability Ratios</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Gross Profit Margin (%)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.gpRatio, 'gp')}`}>{fmtR(d.gpRatio)}%</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 10% Good</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Net Profit Margin (%)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.npRatio, 'np')}`}>{fmtR(d.npRatio)}%</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 7% Good</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">EBITDA Margin (%)</td>
 {data.map(d => {
 const val = (d.ebitda/d.sales)*100;
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'ebitda')}`}>{fmtR(val)}%</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 10% Good</td>
 </tr>
 <tr className="">
 <td className="px-6 py-2 text-left font-bold pl-10 font-sans">Break-Even Point (% of Sales)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.bepPercentage, 'bep')}`}>{fmtR(d.bepPercentage)}%</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≤ 75%</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Return on Equity (ROE %)</td>
 {data.map(d => {
 const val = (d.netProfit/Math.max(d.capital, 1))*100;
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'roe')}`}>{fmtR(val)}%</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 12% Good</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Return on Assets (ROA %)</td>
 {data.map(d => {
 const val = (d.netProfit/Math.max(d.totalAssets, 1))*100;
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'roa')}`}>{fmtR(val)}%</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 5% Good</td>
 </tr>

 {/* 2. LIQUIDITY RATIOS */}
 <tr className="font-bold text-[0.65rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>2. Liquidity Ratios</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Current Ratio (incl. CC)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.currentRatio, 'cr_incl')}`}>{fmtR(d.currentRatio)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">1.1 – 1.4</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Current Ratio (excl. bank)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.currentRatioExBank, 'cr_excl')}`}>{fmtR(d.currentRatioExBank)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 1.33</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Quick Ratio</td>
 {data.map(d => {
 const val = (d.totalCA - d.inventory) / Math.max(d.totalCL + d.bankBorrowings, 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'qr')}`}>{fmtR(val)}×</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 1.00</td>
 </tr>

 {/* 3. SOLVENCY & LEVERAGE */}
 <tr className="font-bold text-[0.65rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>3. Solvency & Leverage</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Debt to Equity (D:E)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.deRatio, 'de')}`}>{fmtR(d.deRatio)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≤ 2.0</td>
 </tr>
 <tr className="">
 <td className="px-6 py-2 text-left font-bold pl-10 font-sans">TOL / TNW (Regulatory Cap)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.tolTnw, 'toltnw')}`}>{fmtR(d.tolTnw)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≤ 3.0 Best</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Interest Coverage Ratio (ICR)</td>
 {data.map(d => {
 const val = d.ebitda / Math.max(d.interest, 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'icr')}`}>{fmtR(val)}×</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 2.5</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Fixed Asset Coverage Ratio (FACR)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.facr, 'facr')}`}>{fmtR(d.facr)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 1.33</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">DSCR</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.dscr, 'dscr')}`}>{fmtR(d.dscr)}×</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 1.50</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Total Debt / EBITDA</td>
 {data.map(d => {
 const val = (d.bankBorrowings + d.termLoan + d.cmltd + d.unsecured) / Math.max(d.ebitda, 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'debt_ebitda')}`}>{fmtR(val)}×</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">{'< 4.0'}</td>
 </tr>

 {/* 4. EFFICIENCY & CAPACITY */}
 <tr className="font-bold text-[0.65rem] uppercase">
 <td className="px-6 py-3 text-left font-sans" colSpan={years.length + 2}>4. Efficiency Ratios</td>
 </tr>
 <tr className="">
 <td className="px-6 py-2 text-left font-bold pl-10 font-sans">Capacity Utilization (%)</td>
 {data.map(d => <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(d.capacityUtil, 'capacity')}`}>{fmtR(d.capacityUtil)}%</td>)}
 <td className="px-6 py-2 text-right text-[10px]">≥ 70% Good</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Debtor Collection Period (Days)</td>
 {data.map(d => {
 const val = Math.round(d.debtors / (d.sales / 365));
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'debtor_days')}`}>{val}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≤ 45 Days</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Creditor Payment Period (Days)</td>
 {data.map(d => {
 const val = Math.round(d.creditors / (d.purchases / 365));
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'creditor_days')}`}>{val}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≤ 75 Days</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Inventory Holding (Months)</td>
 {data.map(d => {
 const val = d.inventory / (d.purchases / 12);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'inv_months')}`}>{fmtR(val)}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≤ 3.0</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Inventory Turnover (×)</td>
 {data.map(d => {
 const val = d.purchases / Math.max(d.inventory, 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'inv_turn')}`}>{fmtR(val)}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 4.0×</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Working Capital Turnover (×)</td>
 {data.map(d => {
 const val = d.sales / Math.max(d.totalCA - (d.totalCL + d.bankBorrowings), 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'wc_turn')}`}>{fmtR(val)}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">3.0 – 8.0×</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">Asset Turnover (×)</td>
 {data.map(d => {
 const val = d.sales / Math.max(d.totalAssets, 1);
 return <td key={d.year} className={`px-6 py-2 text-right font-bold ${getStatusColor(val, 'ass_turn')}`}>{fmtR(val)}</td>
 })}
 <td className="px-6 py-2 text-right text-[10px]">≥ 1.5×</td>
 </tr>

 </tbody>
 </table>
 </div>
 </div>
 );
}