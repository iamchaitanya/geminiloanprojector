// components/ReportView.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProjectedYear } from "../lib/engine";
import { fmt } from "../lib/format";

// Core Financial Statements
import ProfitLoss from "./reports/ProfitLoss";
import BalanceSheet from "./reports/BalanceSheet";
import CashFlow from "./reports/CashFlow";

// Logical Anchor Schedule
import Assumptions from "./reports/Assumptions";

// CMA Form Suite (Forms 1 to 6)
import Form1 from "./reports/forms/Form1";
import Form2 from "./reports/forms/Form2";
import Form3 from "./reports/forms/Form3";
import Form4 from "./reports/forms/Form4";
import Form5 from "./reports/forms/Form5";
import Form6 from "./reports/forms/Form6";

// Analytical Schedules
import Depreciation from "./reports/Depreciation";
import DscrSchedule from "./reports/DscrSchedule";
import RatioAnalysis from "./reports/RatioAnalysis";

interface ReportViewProps {
  data: ProjectedYear[];
  bizName: string;
  propName: string;
  loanAmount: number;
  proposedCc?: number;
  proposedTl?: number;
  existingCc?: number;
  existingTl?: number;
  pan?: string;
  address?: string;
  entityType?: string;
}

const PrintHeader = ({ bizName, pan, address, title }: { bizName: string, pan?: string, address?: string, title: string }) => (
  <div className="hidden print:block font-sans mb-6 mt-4 page-break-inside-avoid">
    <div style={{ textAlign: 'center', fontFamily: '"Times New Roman", Times, serif' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em' }}>{bizName}</h2>
      {address && <p style={{ fontSize: '11px', marginBottom: '2px', lineHeight: 1.4 }}>{address}</p>}
      <p style={{ fontSize: '11px' }}><strong>PAN:</strong> {pan || 'N/A'}</p>
    </div>
    <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '8px', fontFamily: '"Times New Roman", Times, serif' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #000', display: 'inline-block', paddingBottom: '2px' }}>{title}</h3>
    </div>
  </div>
);

const PrintFooter = ({ bizName, entityType }: { bizName: string; entityType?: string }) => {
  const designation =
    entityType === "partnership" ? "PARTNER" :
    entityType === "pvtltd" ? "DIRECTOR" :
    entityType === "individual" ? "INDIVIDUAL" :
    "PROPRIETOR";

  return (
    <div className="hidden print:flex flex-col items-end mt-16 font-sans text-xs pr-8 pb-8">
      <div className="font-bold uppercase" style={{ marginBottom: '40px' }}>For {bizName || "the Entity"}</div>
      <div className="font-bold uppercase">( {designation} )</div>
    </div>
  );
};

export default function ReportView({ data, bizName, propName, pan, address, loanAmount, proposedCc, proposedTl, existingCc, existingTl, entityType }: ReportViewProps) {
  const baseYear = 2024;
  const years = data.map(d => `31-03-${baseYear + d.year}\n(${d.year === 1 ? 'Actuals' : 'Estimations'})`);
  const [activeSection, setActiveSection] = useState('assumptions');
  const [isEditing, setIsEditing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const toggleEdit = useCallback(() => {
    const next = !isEditing;
    setIsEditing(next);
    if (!reportRef.current) return;
    // Target every value cell across all tables regardless of CSS Module hash
    const cells = reportRef.current.querySelectorAll<HTMLElement>('[class*="tdValue"]');
    cells.forEach(cell => {
      cell.contentEditable = next ? 'true' : 'false';
      cell.style.outline       = next ? '1.5px dashed #2563eb' : '';
      cell.style.backgroundColor = next ? '#fefce8' : '';
      cell.style.cursor        = next ? 'text' : '';
      cell.style.minWidth      = next ? '60px' : '';
    });
  }, [isEditing]);

  // Smooth scroll spy (optional enhancement, simple version here)
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'assumptions';
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') || 'assumptions';
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'cover', icon: '📄', label: 'Report Cover' },
    { id: 'assumptions', icon: '⚓', label: 'Basis of Projections' },
    { id: 'pnl', icon: '📊', label: 'Profit & Loss' },
    { id: 'balance-sheet', icon: '⚖️', label: 'Balance Sheet' },
    { id: 'cash-flow', icon: '💸', label: 'Cash Flow (AS-3)' },
    { id: 'forms-head', icon: '🏦', label: 'CMA Data Forms' },
    { id: 'depreciation', icon: '📉', label: 'Depreciation' },
    { id: 'dscr', icon: '🛡️', label: 'DSCR Analysis' },
    { id: 'ratios', icon: '📈', label: 'Ratio Analysis' },
  ];

  return (
    <div className="flex gap-8 max-w-[1400px] mx-auto animate-fade-in-up">
      {/* ── STICKY SIDEBAR NAV (Non-Printable) ── */}
      {/* Hiding the contents sidebar as requested to maximize table width */}
      {/* 
      <aside className="w-[260px] hidden lg:block flex-shrink-0 no-print report-toc">
        ...
      </aside> 
      */}

      {/* ── MAIN REPORT CONTENT (Printable Area) ── */}
      <div ref={reportRef} className="flex-1 min-w-0 lg:overflow-visible overflow-hidden space-y-12 pb-32 bank-statement">
        <div className="cma-formal-report">
          {/* 1. Basis of Projections (The Logical Anchor) */}
        <section id="assumptions" className="no-print">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Basis of Projections / Assumptions" />
          <Assumptions data={data} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 2. Profit & Loss Account */}
        <section id="pnl">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Profit & Loss Account" />
          <ProfitLoss data={data} years={years} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 3. Balance Sheet */}
        <section id="balance-sheet">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Balance Sheet" />
          <BalanceSheet data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 4. Cash Flow Statement (AS-3) */}
        <section id="cash-flow">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Cash Flow Statement" />
          <CashFlow data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 5. CMA Form I: Existing & Proposed Limits */}
        <section id="form1">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form I: Existing & Proposed Limits" />
          <Form1 
            bizName={bizName} 
            propName={propName} 
            proposedCc={proposedCc ?? loanAmount} 
            proposedTl={proposedTl ?? 0} 
            existingCc={existingCc ?? 0} 
            existingTl={existingTl ?? 0} 
          />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 6. CMA Form II: Operating Statement */}
        <section id="form2">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form II: Operating Statement" />
          <Form2 data={data} years={years} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 7. CMA Form III: Analysis of Balance Sheet */}
        <section id="form3">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form III: Analysis of Balance Sheet" />
          <Form3 data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 8. CMA Form IV: Comparative CA & CL */}
        <section id="form4">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form IV: Comparative CA & CL" />
          <Form4 data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 9. CMA Form V: MPBF Assessment (Method II) */}
        <section id="form5">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form V: MPBF Assessment" />
          <Form5 data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 10. CMA Form VI: Funds Flow Statement */}
        <section id="form6">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Form VI: Funds Flow Statement" />
          <Form6 data={data} years={years} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 11. Depreciation Schedule */}
        <section id="depreciation">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Depreciation Schedule" />
          <Depreciation data={data} years={years} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 12. DSCR Detailed Analysis */}
        <section id="dscr">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="DSCR Detailed Analysis" />
          <DscrSchedule data={data} years={years} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>

        {/* 13. 18-Point Ratio Analysis */}
        <section id="ratios">
          <PrintHeader bizName={bizName} pan={pan} address={address} title="Ratio Analysis" />
          <RatioAnalysis data={data} years={years} loanAmount={loanAmount} />
          <PrintFooter bizName={bizName} entityType={entityType} />
        </section>
        </div>
      </div>

      {/* ── EDIT MODE FLOATING BUTTON (hidden on print) ── */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
        }}
      >
        {isEditing && (
          <div style={{
            background: '#1e40af',
            color: '#fff',
            fontSize: '11px',
            fontFamily: '"Times New Roman", Times, serif',
            padding: '6px 14px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            maxWidth: '220px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            ✏️ Edit mode — click any value cell and type freely.
            Changes appear on print.
          </div>
        )}
        <button
          onClick={toggleEdit}
          style={{
            padding: '12px 22px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.03em',
            boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
            transition: 'all 0.2s',
            background: isEditing ? '#dc2626' : '#1e40af',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isEditing ? '🔒 Lock Report' : '✏️ Edit Report'}
        </button>
      </div>
    </div>
  );
}