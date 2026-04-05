// components/ReportView.tsx
import { ProjectedYear } from "../lib/engine";

// Core Financial Statements
import ProfitLoss from "./reports/ProfitLoss";
import BalanceSheet from "./reports/BalanceSheet";
import CashFlow from "./reports/CashFlow";

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
}

export default function ReportView({ data, bizName, propName, loanAmount }: ReportViewProps) {
  const years = data.map(d => `Year ${d.year}`);

  return (
    <div className="mt-12 space-y-16 animate-fade-in-up pb-32 max-w-7xl mx-auto px-4">
      
      {/* 1. Profit & Loss Account */}
      <section id="pnl">
        <ProfitLoss data={data} years={years} />
      </section>

      {/* 2. Balance Sheet */}
      <section id="balance-sheet">
        <BalanceSheet data={data} years={years} loanAmount={loanAmount} />
      </section>

      {/* 3. Cash Flow Statement (AS-3) */}
      <section id="cash-flow">
        <CashFlow data={data} years={years} loanAmount={loanAmount} />
      </section>

      {/* 4. CMA Form I: Existing & Proposed Limits */}
      <section id="form1">
        <Form1 loanAmount={loanAmount} bizName={bizName} propName={propName} />
      </section>

      {/* 5. CMA Form II: Operating Statement */}
      <section id="form2">
        <Form2 data={data} years={years} />
      </section>

      {/* 6. CMA Form III: Analysis of Balance Sheet */}
      <section id="form3">
        <Form3 data={data} years={years} loanAmount={loanAmount} />
      </section>

      {/* 7. CMA Form IV: Comparative CA & CL */}
      <section id="form4">
        <Form4 data={data} years={years} />
      </section>

      {/* 8. CMA Form V: MPBF Assessment (Method II) */}
      <section id="form5">
        <Form5 data={data} years={years} loanAmount={loanAmount} />
      </section>

      {/* 9. CMA Form VI: Funds Flow Statement */}
      <section id="form6">
        <Form6 data={data} years={years} />
      </section>

      {/* 10. Depreciation Schedule */}
      <section id="depreciation">
        <Depreciation data={data} years={years} />
      </section>

      {/* 11. DSCR Detailed Analysis */}
      <section id="dscr">
        <DscrSchedule data={data} years={years} />
      </section>

      {/* 12. 18-Point Ratio Analysis */}
      <section id="ratios">
        <RatioAnalysis data={data} years={years} loanAmount={loanAmount} />
      </section>

    </div>
  );
}