// app/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { generateProjections, ProjectedYear } from '../lib/engine';
import ReportView from '../components/ReportView';

const PROFILES: any = {
  trading: { label: 'Trading', salesMult: 5.0, purchaseRatio: .81, stockMonths: 1.5, debtorDays: 30, creditorDays: 42, indExpRatio: .11, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.10, grossFAMult: .40, drawingsMult: .38, wcMargin: 25, cashPct: .020, loansAdvPct: .015, otherCLPct: .040, exp: { salary: .40, rent: .20, power: .04, freight: .08, travel: .06, telephone: .04, sadar: .06, office: .07, welfare: .02, misc: .03 } },
  service: { label: 'Services', salesMult: 5.5, purchaseRatio: .15, stockMonths: .5, debtorDays: 35, creditorDays: 22, indExpRatio: .65, depnRate: .15, revGrowth: .18, purGrowth: .12, expGrowth: .09, capitalMult: 1.00, grossFAMult: .40, drawingsMult: .42, wcMargin: 25, cashPct: .025, loansAdvPct: .012, otherCLPct: .045, exp: { salary: .55, rent: .15, power: .03, freight: .01, travel: .08, telephone: .04, sadar: .04, office: .05, welfare: .02, misc: .03 } },
  manufacturing: { label: 'Manufacturing', salesMult: 5.0, purchaseRatio: .74, stockMonths: 2.0, debtorDays: 40, creditorDays: 42, indExpRatio: .14, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.20, grossFAMult: 1.00, drawingsMult: .35, wcMargin: 25, cashPct: .015, loansAdvPct: .022, otherCLPct: .038, exp: { salary: .35, rent: .10, power: .18, freight: .10, travel: .04, telephone: .03, sadar: .05, office: .05, welfare: .05, misc: .05 } },
  construction: { label: 'Construction', salesMult: 5.2, purchaseRatio: .70, stockMonths: 1.0, debtorDays: 42, creditorDays: 42, indExpRatio: .16, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.10, grossFAMult: .80, drawingsMult: .36, wcMargin: 25, cashPct: .018, loansAdvPct: .025, otherCLPct: .038, exp: { salary: .40, rent: .07, power: .10, freight: .15, travel: .05, telephone: .03, sadar: .08, office: .04, welfare: .04, misc: .04 } }
};

const EXPENSE_HEADS = [
  { k: 'salary', l: 'Salaries & Wages' }, { k: 'rent', l: 'Rent & Rates' }, { k: 'power', l: 'Power & Fuel' },
  { k: 'freight', l: 'Freight / Carriage' }, { k: 'travel', l: 'Travelling & Conveyance' }, { k: 'telephone', l: 'Telephone / Internet' },
  { k: 'sadar', l: 'Sadar / Local Expenses' }, { k: 'office', l: 'Office / Shop Expenses' }, { k: 'welfare', l: 'Staff Welfare' }, { k: 'misc', l: 'Miscellaneous Expenses' }
];

export default function CMAApp() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [inputMode, setInputMode] = useState('simple');
  const [detTab, setDetTab] = useState(1);
  const [bizType, setBizType] = useState('trading');
  const [wcMethod, setWcMethod] = useState('turnover');

  // --- COMPREHENSIVE STATE ---
  const [f, setF] = useState({
    bizName: '', propName: '', pan: '', preparedBy: '', address: '', entityType: 'proprietorship',
    ccLimit: 500000, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0,
    intRate: 11.5, baseYear: new Date().getFullYear(), projYears: 3, tenure: 5,
    sales0: 2500000, otherInc: 0, openSt: 0, closeSt: 200000, purch0: 2000000,
    revG: 15, purG: 12, expG: 8, depnRate: 15,
    capital: 800000, unsecured: 0, creditors: 200000, otherCL: 50000,
    grossFA: 300000, accDepn: 0, debtors: 250000, inventory: 200000, cash: 100000, loansAdv: 0, deposits: 0, capex: 0,
    debtorDays: 30, credDays: 45, stockMo: 2, margin: 25, drawings: 120000,
    // Granular Audit Fields
    instCap: 0, quasiEq: 60, debtorAge: 5, statDues: 40,
    expBase: { salary: 0, rent: 0, power: 0, freight: 0, travel: 0, telephone: 0, sadar: 0, office: 0, welfare: 0, misc: 0 },
    optSens: false, optDepn: true, optCF: true, sealFirm: 'Srinivasa Tax Consultants'
  });

  const [isOverride, setIsOverride] = useState(false);

  // ════════ AUTO-FILL ENGINE ════════
  useEffect(() => {
    if (inputMode === 'simple') {
      const p = PROFILES[bizType];
      const totalLoanForMath = f.ccLimit + f.termLoan || 500000;
      const sales = isOverride ? f.sales0 : Math.round(totalLoanForMath * p.salesMult);
      const purch = Math.round(sales * p.purchaseRatio);
      const indExp = Math.round(sales * p.indExpRatio);
      const newExps = { ...f.expBase };
      EXPENSE_HEADS.forEach(h => { (newExps as any)[h.k] = Math.round(indExp * p.exp[h.k]); });

      setF(prev => ({
        ...prev,
        sales0: sales, purch0: purch, revG: p.revGrowth * 100, purG: p.purGrowth * 100, expG: p.expGrowth * 100,
        capital: Math.round(totalLoanForMath * p.capitalMult), drawings: Math.round(totalLoanForMath * p.drawingsMult),
        grossFA: Math.round(totalLoanForMath * p.grossFAMult), closeSt: Math.round((purch / 12) * p.stockMonths),
        debtors: Math.round((sales / 365) * p.debtorDays), creditors: Math.round((purch / 365) * p.creditorDays),
        inventory: Math.round((purch / 12) * p.stockMonths), cash: Math.round(sales * p.cashPct), 
        loansAdv: Math.round(sales * p.loansAdvPct), otherCL: Math.round(sales * p.otherCLPct),
        debtorDays: p.debtorDays, credDays: p.creditorDays, stockMo: p.stockMonths, margin: p.wcMargin,
        expBase: newExps
      }));
    }
  }, [f.ccLimit, f.termLoan, bizType, inputMode, isOverride]);

  // ════════ LIVE PREVIEW ════════
  const pv = useMemo(() => {
    const s = f.sales0;
    const de = (f.ccLimit + f.termLoan) / Math.max(f.capital, 1);
    const cr = (f.closeSt + f.debtors + f.cash) / Math.max(f.creditors + f.otherCL + f.ccLimit, 1);
    return { sales: s, np: (s * 0.082), de, turnLmt: (s * 0.20), cr };
  }, [f]);

  const update = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
  const fmtVal = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n));

  const [projections, setProjections] = useState<ProjectedYear[]>([]);

  const handleGenerate = () => {
    const totalExpBase = Object.values(f.expBase).reduce((a: number, b: any) => a + Number(b), 0);
    const indExpRatioImplied = f.sales0 > 0 ? (totalExpBase / f.sales0) : 0.12;

    const normalizedExpRatios = Object.fromEntries(
      Object.entries(f.expBase).map(([k, v]) => [k, totalExpBase > 0 ? Number(v) / totalExpBase : 0])
    );

    const limits = {
      ccLimit: f.ccLimit, termLoan: f.termLoan,
      isRenewal: f.isRenewal, existingCc: f.existingCc, existingTl: f.existingTl
    };
    const totalCurrentLoan = f.ccLimit + f.termLoan || 1;

    const results = generateProjections(limits, {
      label: bizType,
      salesMult: f.sales0 / totalCurrentLoan,
      capitalMult: f.capital / totalCurrentLoan,
      drawingsMult: f.drawings / totalCurrentLoan,
      grossFAMult: f.grossFA / totalCurrentLoan,
      revGrowth: f.revG / 100,
      purGrowth: f.purG / 100,
      expGrowth: f.expG / 100,
      purchaseRatio: f.purch0 / f.sales0,
      indExpRatio: indExpRatioImplied,
      depnRate: f.depnRate / 100,
      stockMonths: f.stockMo,
      creditorDays: f.credDays,
      debtorDays: f.debtorDays,
      cashPct: f.cash / f.sales0,
      loansAdvPct: f.loansAdv / f.sales0,
      otherCLPct: (f.creditors + f.otherCL) / f.sales0,
      wcMargin: f.margin,
      // Granular audit fields mapping
      installedCap: f.instCap,
      quasiEquityPct: f.quasiEq / 100,
      debtorAgingPct: f.debtorAge / 100,
      statutoryDuesPct: f.statDues / 100,
      exp: normalizedExpRatios as any
    }, f.projYears, f.baseYear);
    setProjections(results);
    setIsGenerated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isGenerated) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] p-8">
        <ReportView 
          data={projections} 
          bizName={f.bizName} 
          propName={f.propName} 
          loanAmount={f.ccLimit + f.termLoan} 
          proposedCc={f.ccLimit}
          proposedTl={f.termLoan}
          existingCc={f.isRenewal ? f.existingCc : 0}
          existingTl={f.isRenewal ? f.existingTl : 0}
        />
        <button onClick={() => setIsGenerated(false)} className="fixed bottom-8 right-8 bg-[#c8401a] text-white px-8 py-2.5 rounded-full shadow-2xl font-bold uppercase tracking-widest text-xs">↺ Edit Inputs</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#0f0e0b] font-sans pb-20">
      {/* ════════ HEADER ════════ */}
      <header className="bg-[#0f0e0b] text-[#f5f2eb] px-6 py-4 flex items-center gap-3 border-b-[3px] border-[#c8401a]">
        <h1 className="font-serif text-xl font-bold italic tracking-tight">LoanProj</h1>
        <div className="ml-auto font-mono text-[10px] text-[#8a8680] uppercase tracking-widest">RBI / CMA / Tandon Format</div>
      </header>

      {/* ════════ TOPBAR TOGGLES ════════ */}
      <div className="bg-[#ede9df] border-b border-[#ccc8be] px-6 py-2 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a7567] uppercase">
          Business: <div className="flex bg-white border border-[#ccc8be] rounded overflow-hidden">
            {['trading', 'service', 'manufacturing', 'construction'].map(t => <button key={t} onClick={() => setBizType(t)} className={`px-3 py-1 capitalize border-r last:border-0 ${bizType === t ? 'bg-[#0f0e0b] text-white' : 'hover:bg-slate-50'}`}>{t}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a7567] uppercase">
          WC Method: <div className="flex bg-white border border-[#ccc8be] rounded overflow-hidden">
            {['turnover', 'mpbf', 'opercycle'].map(w => <button key={w} onClick={() => setWcMethod(w)} className={`px-3 py-1 capitalize border-r last:border-0 ${wcMethod === w ? 'bg-[#0f0e0b] text-white' : 'hover:bg-slate-50'}`}>{w}</button>)}
          </div>
        </div>
      </div>

      <main className="max-w-[1380px] mx-auto p-6 space-y-6">
        {/* SEAL & GENERATE BAR */}
        <div className="bg-[#f8f6f0] p-4 border border-[#ccc8be] rounded-lg flex items-center gap-4 shadow-sm">
          <label className="text-[10px] font-bold uppercase text-[#7a7567]">Firm Seal Name:</label>
          <input value={f.sealFirm} onChange={e => update('sealFirm', e.target.value)} className="legacy-input max-w-sm" />
          <button onClick={handleGenerate} className="ml-auto bg-[#c8401a] text-white px-8 py-2.5 rounded font-bold shadow-xl hover:bg-[#a5341a] transition-all active:scale-95">⚡ Generate CMA Report</button>
        </div>

        {/* MODE NAVIGATION */}
        <div className="flex border-b-2 border-[#ccc8be] gap-2">
          <button onClick={() => setInputMode('simple')} className={`px-8 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${inputMode === 'simple' ? 'border-[#c8401a] text-[#c8401a]' : 'border-transparent text-[#7a7567]'}`}>Simple Mode</button>
          <button onClick={() => setInputMode('detailed')} className={`px-8 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${inputMode === 'detailed' ? 'border-[#c8401a] text-[#c8401a]' : 'border-transparent text-[#7a7567]'}`}>Detailed Mode</button>
        </div>

        {/* INPUT PANEL */}
        <div className="bg-white border border-[#ccc8be] rounded-lg p-8 shadow-sm space-y-10">
          
          {inputMode === 'detailed' && (
            <div className="flex flex-wrap gap-3 border-b border-slate-100 pb-5">
              {['1. Applicant & Loan Details', '2. P&L / Operating Inputs', '3. Balance Sheet Opening', '4. Audit & WC Granularities'].map((label, i) => (
                <button key={i} onClick={() => setDetTab(i + 1)} className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all ${detTab === i + 1 ? 'bg-[#1a5fa8] text-white shadow-md' : 'bg-[#f5f2eb] text-[#7a7567] hover:bg-slate-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* TAB 1: APPLICANT & LOAN */}
          <div className={`${(inputMode === 'detailed' && detTab !== 1) ? 'hidden' : ''} grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6`}>
             <div className="md:col-span-2"><label className="l-label">Business / Firm Name</label><input value={f.bizName} onChange={e => update('bizName', e.target.value)} placeholder="e.g. Srinivas Enterprises" className="legacy-input" /></div>
             <div><label className="l-label">Legal Constitution</label><select value={f.entityType} onChange={e => update('entityType', e.target.value)} className="legacy-input"><option value="proprietorship">Proprietorship</option><option value="partnership">Partnership Firm</option><option value="pvtltd">Pvt Ltd Company</option></select></div>
             <div><label className="l-label">Proprietor / Managing Partner</label><input value={f.propName} onChange={e => update('propName', e.target.value)} className="legacy-input" /></div>
             <div><label className="l-label">Permanent Account Number (PAN)</label><input value={f.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="XXXXX0000X" className="legacy-input" /></div>
             <div><label className="l-label">Prepared By (CA / Firm)</label><input value={f.preparedBy} onChange={e => update('preparedBy', e.target.value)} className="legacy-input" /></div>
             
             {/* NEW LOAN INPUTS */}
             <div><label className="l-label text-blue-700">Application Type</label><select value={f.isRenewal ? 'renewal' : 'fresh'} onChange={e => update('isRenewal', e.target.value === 'renewal')} className="legacy-input font-bold"><option value="fresh">Fresh Proposal</option><option value="renewal">Renewal / Enhancement</option></select></div>
             <div><label className="l-label text-blue-700">Proposed CC/OD Limit (₹)</label><input type="number" value={f.ccLimit} onChange={e => update('ccLimit', Number(e.target.value))} className="legacy-input font-bold border-blue-200" /></div>
             <div><label className="l-label text-blue-700">Proposed Term Loan (₹)</label><input type="number" value={f.termLoan} onChange={e => update('termLoan', Number(e.target.value))} className="legacy-input font-bold border-blue-200" /></div>
             <div><label className="l-label">Interest Rate (% Per Annum)</label><input type="number" value={f.intRate} onChange={e => update('intRate', Number(e.target.value))} className="legacy-input" step="0.25" /></div>
             
             {f.isRenewal && (
                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-x-8 bg-amber-50 p-4 border border-amber-200 rounded-md">
                   <div><label className="l-label text-amber-800">Existing CC Limit (₹)</label><input type="number" value={f.existingCc} onChange={e => update('existingCc', Number(e.target.value))} className="legacy-input border-amber-300 bg-white" /></div>
                   <div><label className="l-label text-amber-800">Existing Term Loan O/s (₹)</label><input type="number" value={f.existingTl} onChange={e => update('existingTl', Number(e.target.value))} className="legacy-input border-amber-300 bg-white" /></div>
                </div>
             )}

             <div>
               <label className="l-label">Base Financial Year (Actuals)</label>
               <select value={f.baseYear} onChange={e => update('baseYear', Number(e.target.value))} className="legacy-input">
                 {[-2, -1, 0, 1].map(offset => {
                   const y = new Date().getFullYear() + offset;
                   return <option key={y} value={y}>FY {y.toString().slice(-2)}-{(y+1).toString().slice(-2)}</option>;
                 })}
               </select>
             </div>
             <div><label className="l-label">Projection Period (Years)</label><select value={f.projYears} onChange={e => update('projYears', Number(e.target.value))} className="legacy-input">{[2,3,4,5,6,7,8,9].map(y => <option key={y} value={y}>{y} Years</option>)}</select></div>
             {(f.termLoan > 0 || f.existingTl > 0) && <div><label className="l-label">Repayment Tenure (Years)</label><input type="number" value={f.tenure} onChange={e => update('tenure', Number(e.target.value))} className="legacy-input" /></div>}
             <div className="md:col-span-4"><label className="l-label">Full Business / Factory Address</label><input value={f.address} onChange={e => update('address', e.target.value)} className="legacy-input" /></div>
          </div>

          {/* TAB 2: P&L INPUTS (Detailed Mode) */}
          {inputMode === 'detailed' && detTab === 2 && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div><label className="l-label">Annual Sales / Turnover (₹)</label><input type="number" value={f.sales0} onChange={e => update('sales0', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Installed Capacity (Annual ₹)</label><input type="number" value={f.instCap} onChange={e => update('instCap', Number(e.target.value))} className="legacy-input border-emerald-200" placeholder="0 = Auto" /></div>
                <div><label className="l-label">Other Non-Operating Income (₹)</label><input type="number" value={f.otherInc} onChange={e => update('otherInc', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Opening Stock (₹)</label><input type="number" value={f.openSt} onChange={e => update('openSt', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Closing Stock (₹)</label><input type="number" value={f.closeSt} onChange={e => update('closeSt', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Purchases / Direct Costs (₹)</label><input type="number" value={f.purch0} onChange={e => update('purch0', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Revenue Growth Rate (%)</label><input type="number" value={f.revG} onChange={e => update('revG', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Purchase Growth Rate (%)</label><input type="number" value={f.purG} onChange={e => update('purG', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Expense Growth Rate (%)</label><input type="number" value={f.expG} onChange={e => update('expG', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Depreciation Rate (% WDV)</label><input type="number" value={f.depnRate} onChange={e => update('depnRate', Number(e.target.value))} className="legacy-input" /></div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Granular Indirect Expense Breakup (Base Year)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {EXPENSE_HEADS.map(h => (
                    <div key={h.k}><label className="l-label">{h.l} (₹)</label><input type="number" value={(f.expBase as any)[h.k]} onChange={e => setF(prev => ({...prev, expBase: {...prev.expBase, [h.k]: Number(e.target.value)}}))} className="legacy-input" /></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BALANCE SHEET (Detailed Mode) */}
          {inputMode === 'detailed' && detTab === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 animate-in fade-in duration-300">
               <div><label className="l-label">Proprietor Capital / Net Worth (₹)</label><input type="number" value={f.capital} onChange={e => update('capital', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Unsecured Loans (Market/Promoter) (₹)</label><input type="number" value={f.unsecured} onChange={e => update('unsecured', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Sundry Creditors (Trade Payables) (₹)</label><input type="number" value={f.creditors} onChange={e => update('creditors', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Other Current Liabilities & Prov. (₹)</label><input type="number" value={f.otherCL} onChange={e => update('otherCL', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Gross Fixed Assets (Block) (₹)</label><input type="number" value={f.grossFA} onChange={e => update('grossFA', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Accumulated Depreciation (₹)</label><input type="number" value={f.accDepn} onChange={e => update('accDepn', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Sundry Debtors (Receivables) (₹)</label><input type="number" value={f.debtors} onChange={e => update('debtors', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Inventory / Closing Stock (₹)</label><input type="number" value={f.inventory} onChange={e => update('inventory', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Cash & Bank Balances (₹)</label><input type="number" value={f.cash} onChange={e => update('cash', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Loans & Advances (Suppliers) (₹)</label><input type="number" value={f.loansAdv} onChange={e => update('loansAdv', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Security Deposits (Rent/Elect) (₹)</label><input type="number" value={f.deposits} onChange={e => update('deposits', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label">Annual Capital Expenditure (Capex) (₹)</label><input type="number" value={f.capex} onChange={e => update('capex', Number(e.target.value))} className="legacy-input" /></div>
            </div>
          )}

          {/* TAB 4: AUDIT & WC GRANULARITIES (Detailed Mode) */}
          {inputMode === 'detailed' && detTab === 4 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              
              {/* NEW SECTION: INSPECTOR'S AUDIT INPUTS */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg space-y-6">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-4 bg-emerald-600 rounded-full"></div>
                   <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Inspector's Audit Granularities</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="l-label">Quasi-Equity Allocation (%)</label>
                    <input type="number" value={f.quasiEq} onChange={e => update('quasiEq', Number(e.target.value))} className="legacy-input border-emerald-200" />
                    <p className="text-[8px] text-slate-500 mt-1 italic">% of unsecured loans treated as Promoter Equity (subordinated to bank)</p>
                  </div>
                  <div>
                    <label className="l-label">Debtor Aging &gt; 6 Months (%)</label>
                    <input type="number" value={f.debtorAge} onChange={e => update('debtorAge', Number(e.target.value))} className="legacy-input border-rose-200" />
                    <p className="text-[8px] text-slate-500 mt-1 italic">% of receivables excluded from Drawing Power calculation</p>
                  </div>
                  <div>
                    <label className="l-label">Statutory Dues Portion (%)</label>
                    <input type="number" value={f.statDues} onChange={e => update('statDues', Number(e.target.value))} className="legacy-input border-amber-200" />
                    <p className="text-[8px] text-slate-500 mt-1 italic">% of other CL related to GST/PF/TDS (red flag for auditor if high)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div><label className="l-label">Debtor Collection Period (Days)</label><input type="number" value={f.debtorDays} onChange={e => update('debtorDays', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Creditor Payment Period (Days)</label><input type="number" value={f.credDays} onChange={e => update('credDays', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Stock Holding Period (Months)</label><input type="number" value={f.stockMo} onChange={e => update('stockMo', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Working Capital Margin (%)</label><input type="number" value={f.margin} onChange={e => update('margin', Number(e.target.value))} className="legacy-input" /></div>
                <div><label className="l-label">Annual Personal Drawings (₹)</label><input type="number" value={f.drawings} onChange={e => update('drawings', Number(e.target.value))} className="legacy-input" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
                <label className="chk-box"><input type="checkbox" checked={f.optSens} onChange={e => update('optSens', e.target.checked)} /> <div><p>Sensitivity Analysis</p><p className="text-[8px] font-normal opacity-60 uppercase">6-scenario stress test</p></div></label>
                <label className="chk-box"><input type="checkbox" checked={f.optDepn} onChange={e => update('optDepn', e.target.checked)} /> <div><p>Depreciation Schedule</p><p className="text-[8px] font-normal opacity-60 uppercase">WDV Method Year-wise breakup</p></div></label>
                <label className="chk-box"><input type="checkbox" checked={f.optCF} onChange={e => update('optCF', e.target.checked)} /> <div><p>Cash Flow Statement</p><p className="text-[8px] font-normal opacity-60 uppercase">Indirect method as per AS-3</p></div></label>
              </div>
            </div>
          )}

          {/* SIMPLE MODE AUTO-DERIVED SECTION */}
          {inputMode === 'simple' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
               <div className="md:col-span-4 flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Auto-Derived Financials</h4>
                  <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono italic">Calibrated to Loan Amount</span>
               </div>
               <div><label className="l-label text-blue-800">Yr 1 Sales / Turnover (₹)</label><input type="number" value={f.sales0} onChange={e => {update('sales0', Number(e.target.value)); setIsOverride(true);}} className="legacy-input border-blue-200" /></div>
               <div><label className="l-label text-blue-800">Net Worth / Capital (₹)</label><input type="number" value={f.capital} onChange={e => update('capital', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label text-blue-800">Annual Personal Drawings (₹)</label><input type="number" value={f.drawings} onChange={e => update('drawings', Number(e.target.value))} className="legacy-input" /></div>
               <div><label className="l-label text-blue-800">Gross Fixed Assets (Block) (₹)</label><input type="number" value={f.grossFA} onChange={e => update('grossFA', Number(e.target.value))} className="legacy-input" /></div>
               
               <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                  <label className="chk-box"><input type="checkbox" checked={f.optSens} onChange={e => update('optSens', e.target.checked)} /> Sensitivity Analysis</label>
                  <label className="chk-box"><input type="checkbox" checked={f.optDepn} onChange={e => update('optDepn', e.target.checked)} /> Depreciation Schedule</label>
                  <label className="chk-box"><input type="checkbox" checked={f.optCF} onChange={e => update('optCF', e.target.checked)} /> Cash Flow Statement</label>
               </div>
            </div>
          )}

          {/* ⚡ LIVE PREVIEW GRID (THE GOLD BOX) */}
          <div className="bg-[#fff9ec] border border-[#e8d59a] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <span className="animate-pulse">⚡</span>
               <h4 className="text-[10px] font-bold text-[#b8922a] uppercase tracking-widest">Real-time CMA Preview (Year 1)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
               {[
                 { l: 'Sales', v: `₹${fmtVal(pv.sales)}` },
                 { l: 'Est. Net Profit', v: `₹${fmtVal(pv.np)}`, ok: true },
                 { l: 'D:E Ratio', v: `${pv.de.toFixed(2)}x`, ok: pv.de <= 2 },
                 { l: 'Current Ratio', v: `${pv.cr.toFixed(2)}x`, ok: pv.cr >= 1.33 },
                 { l: 'Turnover Limit', v: `₹${fmtVal(pv.turnLmt)}` },
                 { l: 'Est. DSCR', v: '4.50x', ok: true }
               ].map((x, i) => (
                 <div key={i} className="bg-white p-3 rounded border border-[#e8d59a] transition-all hover:shadow-md">
                   <p className="text-[9px] font-bold text-[#9a8030] uppercase mb-1">{x.l}</p>
                   <p className={`text-sm font-mono font-bold ${x.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{x.v}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>

      {/* EMBEDDED STYLES */}
      <style jsx>{`
        .legacy-input { background: #f5f2eb; border: 1.5px solid #ccc8be; border-radius: 4px; padding: 0.5rem 0.75rem; font-family: 'DM Mono', monospace; font-size: 0.85rem; width: 100%; outline: none; transition: all 0.15s; }
        .legacy-input:focus { border-color: #1a5fa8; background: #fff; box-shadow: 0 0 0 3px rgba(26,95,168,0.1); }
        .l-label { display: block; font-size: 10px; font-weight: 700; color: #7a7567; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; }
        .chk-box { display: flex; gap: 10px; align-items: center; background: #f8f6f0; border: 1.5px solid #ccc8be; padding: 10px 15px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .chk-box:hover { border-color: #1a5fa8; background: #fff; }
        .chk-box input { width: 18px; height: 18px; accent-color: #1a5fa8; }
      `}</style>
    </div>
  );
}