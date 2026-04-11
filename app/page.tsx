// app/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { generateProjections, ProjectedYear } from '../lib/engine';
import ReportView from '../components/ReportView';

const PROFILES: any = {
  trading:      { label: 'Trading',      salesMult: 5.0, purchaseRatio: .81, stockMonths: 1.5, debtorDays: 30, creditorDays: 42, indExpRatio: .11, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.10, grossFAMult: .40, drawingsMult: .38, wcMargin: 25, cashPct: .020, loansAdvPct: .015, otherCLPct: .040, exp: { salary: .40, rent: .20, power: .04, freight: .08, travel: .06, telephone: .04, sadar: .06, office: .07, welfare: .02, misc: .03 } },
  service:      { label: 'Services',     salesMult: 5.5, purchaseRatio: .15, stockMonths: .5,  debtorDays: 35, creditorDays: 22, indExpRatio: .65, depnRate: .15, revGrowth: .18, purGrowth: .12, expGrowth: .09, capitalMult: 1.00, grossFAMult: .40, drawingsMult: .42, wcMargin: 25, cashPct: .025, loansAdvPct: .012, otherCLPct: .045, exp: { salary: .55, rent: .15, power: .03, freight: .01, travel: .08, telephone: .04, sadar: .04, office: .05, welfare: .02, misc: .03 } },
  manufacturing:{ label: 'Manufacturing',salesMult: 5.0, purchaseRatio: .74, stockMonths: 2.0, debtorDays: 40, creditorDays: 42, indExpRatio: .14, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.20, grossFAMult: 1.00, drawingsMult: .35, wcMargin: 25, cashPct: .015, loansAdvPct: .022, otherCLPct: .038, exp: { salary: .35, rent: .10, power: .18, freight: .10, travel: .04, telephone: .03, sadar: .05, office: .05, welfare: .05, misc: .05 } },
  construction: { label: 'Construction', salesMult: 5.2, purchaseRatio: .70, stockMonths: 1.0, debtorDays: 42, creditorDays: 42, indExpRatio: .16, depnRate: .15, revGrowth: .15, purGrowth: .12, expGrowth: .08, capitalMult: 1.10, grossFAMult: .80, drawingsMult: .36, wcMargin: 25, cashPct: .018, loansAdvPct: .025, otherCLPct: .038, exp: { salary: .40, rent: .07, power: .10, freight: .15, travel: .05, telephone: .03, sadar: .08, office: .04, welfare: .04, misc: .04 } }
};

const EXPENSE_HEADS = [
  { k: 'salary', l: 'Salaries & Wages' }, { k: 'rent', l: 'Rent & Rates' }, { k: 'power', l: 'Power & Fuel' },
  { k: 'freight', l: 'Freight / Carriage' }, { k: 'travel', l: 'Travelling & Conveyance' }, { k: 'telephone', l: 'Telephone / Internet' },
  { k: 'sadar', l: 'Sadar / Local Expenses' }, { k: 'office', l: 'Office / Shop Expenses' }, { k: 'welfare', l: 'Staff Welfare' }, { k: 'misc', l: 'Miscellaneous Expenses' }
];

const BIZ_ICONS: Record<string, string> = {
  trading: '', service: '', manufacturing: '', construction: ''
};

export default function CMAApp() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [bizType, setBizType] = useState('trading');

  const [f, setF] = useState({
    bizName: '', propName: '', pan: '', preparedBy: '', address: '', entityType: 'proprietorship',
    ccLimit: 500000, termLoan: 0, isRenewal: false, existingCc: 0, existingTl: 0,
    ccIntRate: 11.5, tlIntRate: 11.0, baseYear: new Date().getFullYear(), projYears: 5, tenure: 5,
    sales0: 2500000, otherInc: 0, openSt: 0, closeSt: 200000, purch0: 2000000,
    revG: 15, purG: 12, expG: 8, depnRate: 15,
    capital: 800000, unsecured: 0, creditors: 200000, otherCL: 50000,
    grossFA: 300000, accDepn: 0, debtors: 250000, inventory: 200000, cash: 100000, loansAdv: 0, deposits: 0, capex: 0,
    debtorDays: 30, credDays: 45, stockMo: 2, margin: 25, drawings: 120000,
    instCap: 0, quasiEq: 60, debtorAge: 5, statDues: 40,
    expBase: { salary: 0, rent: 0, power: 0, freight: 0, travel: 0, telephone: 0, sadar: 0, office: 0, welfare: 0, misc: 0 },
    optSens: false, optDepn: true, optCF: true, sealFirm: 'Srinivasa Tax Consultants',
    numEmployees: 1 as number | '',
    ownPremises: false,
  });

  const [showError, setShowError] = useState(false);
  const [isOverride, setIsOverride] = useState(false);
  const bizNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
  }, [f.ccLimit, f.termLoan, bizType, isOverride]);

  const pv = useMemo(() => {
    const s = f.sales0;
    const de = (f.ccLimit + f.termLoan) / Math.max(f.capital, 1);
    const cr = (f.closeSt + f.debtors + f.cash) / Math.max(f.creditors + f.otherCL + f.ccLimit, 1);
    return { sales: s, np: (s * 0.082), de, turnLmt: (s * 0.20), cr };
  }, [f]);

  const update = (k: string, v: any) => {
    if (k === 'bizName' && v.trim()) setShowError(false);
    setF(p => ({ ...p, [k]: v }));
  };
  const fmtVal = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n));
  const fmtCr = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${fmtVal(n)}`;
  };

  const [projections, setProjections] = useState<ProjectedYear[]>([]);

  const handleGenerate = () => {
    if (!f.bizName.trim()) {
      setShowError(true);
      bizNameRef.current?.focus();
      return;
    }
    const totalExpBase = Object.values(f.expBase).reduce((a: number, b: any) => a + Number(b), 0);
    const indExpRatioImplied = f.sales0 > 0 ? (totalExpBase / f.sales0) : 0.12;
    const normalizedExpRatios = Object.fromEntries(
      Object.entries(f.expBase).map(([k, v]) => [k, totalExpBase > 0 ? Number(v) / totalExpBase : 0])
    );
    const limits = { ccLimit: f.ccLimit, termLoan: f.termLoan, isRenewal: f.isRenewal, existingCc: f.existingCc, existingTl: f.existingTl, ccIntRate: f.ccIntRate, tlIntRate: f.tlIntRate, tenure: f.tenure };
    const totalCurrentLoan = f.ccLimit + f.termLoan || 1;

    const results = generateProjections(limits, {
      label: bizType,
      salesMult: f.sales0 / totalCurrentLoan,
      capitalMult: f.capital / totalCurrentLoan,
      drawingsMult: f.drawings / totalCurrentLoan,
      grossFAMult: f.grossFA / totalCurrentLoan,
      revGrowth: f.revG / 100, purGrowth: f.purG / 100, expGrowth: f.expG / 100,
      purchaseRatio: f.purch0 / f.sales0,
      indExpRatio: indExpRatioImplied,
      depnRate: f.depnRate / 100,
      stockMonths: f.stockMo, creditorDays: f.credDays, debtorDays: f.debtorDays,
      cashPct: f.cash / f.sales0, loansAdvPct: f.loansAdv / f.sales0,
      otherCLPct: (f.creditors + f.otherCL) / f.sales0,
      wcMargin: f.margin,
      installedCap: f.instCap, quasiEquityPct: f.quasiEq / 100,
      debtorAgingPct: f.debtorAge / 100, statutoryDuesPct: f.statDues / 100,
      exp: normalizedExpRatios as any,
      numEmployees: typeof f.numEmployees === 'number' ? f.numEmployees : undefined,
      ownPremises: f.ownPremises,
    }, f.projYears, f.baseYear);
    setProjections(results);
    setIsGenerated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ═══════ GENERATED REPORT VIEW ═══════
  if (isGenerated) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--navy-950)' }}>
        <style>{`
          @media print {
            @page {
              size: ${f.projYears > 5 ? 'landscape' : 'portrait'};
              margin: 10mm;
            }
            .cma-formal-report {
              /* Scale down the entire report wrapper so wide tables fit */
              zoom: ${f.projYears > 5 ? '0.8' : '0.7'};
            }
          }
        `}</style>
        {/* Report Top Bar */}
        <div className="sticky top-0 z-50 border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 flex items-center gap-4 flex-wrap no-print" style={{
          background: 'linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%)',
        }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff'
            }}>L</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {f.bizName || 'CMA Report'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {f.projYears}-Year Projection · {f.ccLimit + f.termLoan > 0 ? fmtCr(f.ccLimit + f.termLoan) : ''} Loan
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <span className="badge badge-blue no-print hidden sm:inline-flex">RBI / CMA</span>
            <span className="badge badge-emerald no-print hidden sm:inline-flex">Tandon Format</span>
            <button
              onClick={() => { window.print(); }}
              style={{
                background: 'var(--surface-glass)', border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 6,
                fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
              className="no-print"
              onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              🖨 Print
            </button>
            <button
              onClick={() => setIsGenerated(false)}
              style={{
                background: 'var(--accent-600)', color: '#fff',
                padding: '6px 18px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s', border: 'none',
              }}
              className="no-print"
            >
              ← Edit Inputs
            </button>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-6 pb-20 max-w-[1300px] mx-auto">
          <ReportView
            data={projections}
            bizName={f.bizName}
            propName={f.propName}
            pan={f.pan}
            address={f.address}
            loanAmount={f.ccLimit + f.termLoan}
            proposedCc={f.ccLimit}
            proposedTl={f.termLoan}
            existingCc={f.isRenewal ? f.existingCc : 0}
            existingTl={f.isRenewal ? f.existingTl : 0}
            entityType={f.entityType}
          />
        </div>
      </div>
    );
  }

  // ═══════ INPUT FORM ═══════
  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-950)', color: 'var(--text-primary)' }}>

      {/* ════ HEADER ════ */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 header-glass">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between sm:justify-start gap-4 flex-wrap">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}>L</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                <span style={{ color: 'var(--text-primary)' }}>Loan</span>
                <span className="gradient-text">Proj</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                CMA Engine
              </div>
            </div>
          </div>

          {/* Center nav pills */}
          <div className="hidden sm:flex" style={{ marginLeft: 'auto', gap: 4 }}>
            {['Dashboard', 'Reports', 'Settings'].map((item, i) => (
              <button key={item} style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                background: i === 0 ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: i === 0 ? 'var(--accent-400)' : 'var(--text-muted)',
                border: i === 0 ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>{item}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-12 ml-auto">
            <span className="badge badge-blue">RBI Compliant</span>
            <span className="badge badge-purple">Tandon / CMA</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>C</div>
          </div>
        </div>
      </header>


      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 pb-24">




        <div className={`glass-card glass-card-animated p-5 sm:p-7 mb-5 ${showError ? 'form-shake' : ''}`}>
          {showError && (
            <div className="fintech-banner animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[var(--rose-400)] flex items-center justify-center text-white font-bold shrink-0">!</div>
              <div>
                <p className="text-[13px] font-bold text-[var(--text-primary)]">Business Name Required</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Please enter the entity name in the field below to generate your financial projections.</p>
              </div>
            </div>
          )}

          {/* ════ SELECTOR ZONE (DROPDOWNS) ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div>
              <label className="fintech-label">Business Type</label>
              <select value={bizType} onChange={e => setBizType(e.target.value)} className="fintech-input">
                {['trading', 'service', 'manufacturing', 'construction'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="fintech-label">Legal Constitution</label>
              <select value={f.entityType} onChange={e => update('entityType', e.target.value)} className="fintech-input">
                <option value="individual">Individual</option>
                <option value="proprietorship">Proprietorship</option>
                <option value="partnership">Partnership Firm</option>
                <option value="pvtltd">Pvt Ltd Company</option>
              </select>
            </div>
            <div>
              <label className="fintech-label">Application Type</label>
              <select value={f.isRenewal ? 'renewal' : 'fresh'} onChange={e => update('isRenewal', e.target.value === 'renewal')} className="fintech-input">
                <option value="fresh">Fresh Proposal</option>
                <option value="renewal">Renewal / Enhancement</option>
              </select>
            </div>
            <div>
              <label className="fintech-label">Base Financial Year</label>
              <select value={f.baseYear} onChange={e => update('baseYear', Number(e.target.value))} className="fintech-input">
                {[-3, -2, -1, 0, 1, 2].map(offset => {
                  const y = new Date().getFullYear() + offset;
                  return <option key={y} value={y}>{y}-{(y + 1).toString().slice(-2)}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="fintech-label">Projection Period</label>
              <select value={f.projYears} onChange={e => update('projYears', Number(e.target.value))} className="fintech-input">
                {[2,3,4,5,6,7,8,9].map(y => <option key={y} value={y}>{y} Years</option>)}
              </select>
            </div>
            <div>
              <label className="fintech-label">No. of Employees</label>
              <select value={f.numEmployees} onChange={e => update('numEmployees', Number(e.target.value))} className="fintech-input">
                {[...Array(101)].map((_, i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="fintech-label">Business Premises</label>
              <select value={f.ownPremises ? 'own' : 'rented'} onChange={e => update('ownPremises', e.target.value === 'own')} className="fintech-input">
                <option value="rented">Rented / Leased</option>
                <option value="own">Own Building</option>
              </select>
            </div>
          </div>

          {/* ════ INPUT ZONE (TEXT & NUMBERS) ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="col-span-1 sm:col-span-2">
              <label className="fintech-label">Business / Firm Name <span className="text-[var(--rose-400)]">*</span></label>
              <input 
                ref={bizNameRef}
                value={f.bizName} 
                onChange={e => update('bizName', e.target.value)} 
                placeholder="e.g. Srinivas Enterprises" 
                className={`fintech-input ${showError && !f.bizName.trim() ? 'field-error-pulse' : (!f.bizName.trim() && isGenerated ? 'border-[var(--rose-400)] shadow-[0_0_0_1px_var(--rose-400)]' : '')}`} 
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="fintech-label">Business Address</label>
              <input value={f.address} onChange={e => update('address', e.target.value)} placeholder="Full factory / office address" className="fintech-input" />
            </div>
            
            {f.entityType !== 'individual' && (
              <div>
                <label className="fintech-label">Proprietor / Managing Partner / Director</label>
                <input value={f.propName} onChange={e => update('propName', e.target.value)} placeholder="Full Name" className="fintech-input" />
              </div>
            )}

            <div className="sm:col-span-1">
              <label className="fintech-label">PAN</label>
              <input 
                value={f.pan} 
                onChange={e => update('pan', e.target.value.toUpperCase())} 
                placeholder="XXXXX0000X" 
                maxLength={10}
                className={`fintech-input ${
                  f.pan.length > 0
                    ? (f.pan.length === 10
                        ? (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(f.pan) 
                            ? 'border-[var(--emerald-400)] shadow-[0_0_0_1px_var(--emerald-400)]' 
                            : 'border-[var(--rose-400)] shadow-[0_0_0_1px_var(--rose-400)]')
                        : 'border-[var(--rose-400)] shadow-[0_0_0_1px_var(--rose-400)]')
                    : ''
                }`} 
              />
              {f.pan && f.pan.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(f.pan) && (
                <p className="text-[9px] text-[var(--rose-500)] mt-1 font-semibold italic">Invalid PAN Format (Expects 5 Letters, 4 Digits, 1 Letter)</p>
              )}
              {f.pan && f.pan.length > 0 && f.pan.length < 10 && (
                <p className="text-[9px] text-[var(--rose-500)] mt-1 italic">Enter 10 characters...</p>
              )}
            </div>

            <div>
              <label className="fintech-label">Proposed CC/OD Limit (₹)</label>
              <input type="number" value={f.ccLimit} onChange={e => update('ccLimit', Number(e.target.value))} className="fintech-input" />
            </div>
            <div>
              <label className="fintech-label">CC/OD Interest Rate (% p.a.)</label>
              <input type="number" value={f.ccIntRate} onChange={e => update('ccIntRate', Number(e.target.value))} className="fintech-input" step="0.25" />
            </div>
            <div>
              <label className="fintech-label">Proposed Term Loan (₹)</label>
              <input type="number" value={f.termLoan} onChange={e => update('termLoan', Number(e.target.value))} className="fintech-input" />
            </div>
            
            {(f.termLoan > 0 || f.existingTl > 0) && (
              <>
                <div>
                  <label className="fintech-label">Term Loan Interest (% p.a.)</label>
                  <input type="number" value={f.tlIntRate} onChange={e => update('tlIntRate', Number(e.target.value))} className="fintech-input" step="0.25" />
                </div>
                <div>
                  <label className="fintech-label">Repayment Tenure (Years)</label>
                  <input type="number" value={f.tenure} onChange={e => update('tenure', Number(e.target.value))} className="fintech-input" />
                </div>
              </>
            )}

            {f.isRenewal && (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-lg p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <span className="badge badge-amber">Renewal Details</span>
                </div>
                <div>
                  <label className="fintech-label" style={{ color: 'var(--amber-400)' }}>Existing CC Limit (₹)</label>
                  <input type="number" value={f.existingCc} onChange={e => update('existingCc', Number(e.target.value))} className="fintech-input" />
                </div>
                <div>
                  <label className="fintech-label" style={{ color: 'var(--amber-400)' }}>Existing Term Loan O/s (₹)</label>
                  <input type="number" value={f.existingTl} onChange={e => update('existingTl', Number(e.target.value))} className="fintech-input" />
                </div>
              </div>
            )}

          </div>
        </div>
 
        {/* ── GENERATE CTA BAR ── */}
        <div className="mobile-bottom-cta" style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          marginTop: 40,
        }}>
          <button
            onClick={handleGenerate}
            className="shimmer-btn"
            style={{
              color: '#fff', padding: '12px 32px', borderRadius: 8,
              fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              letterSpacing: '0.02em', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <span>⚡</span> Generate Projections
          </button>
        </div>
      </main>
    </div>
  );
}