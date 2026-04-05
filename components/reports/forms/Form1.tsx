// components/reports/forms/Form1.tsx
import { fmt } from "../../../lib/format";

interface Form1Props {
  loanAmount: number;
  bizName: string;
  propName: string;
}

export default function Form1({ loanAmount, bizName, propName }: Form1Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-sans">
      {/* 1. Header with Banking Metadata */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">CMA Form I</h3>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Particulars of Existing & Proposed Limits</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-tighter">Form I</span>
          <span className="text-[8px] text-slate-500 mt-1 uppercase font-mono tracking-widest">RBI Compliance v2.0</span>
        </div>
      </div>

      {/* PART A: LIMITS TABLE (Fund & Non-Fund Based) */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs whitespace-nowrap font-mono">
          <thead className="bg-[#ede9df]">
            <tr className="text-[#7a7567] uppercase">
              <th className="px-6 py-3 text-left font-bold tracking-wider min-w-[350px]">Nature of Facility</th>
              <th className="px-6 py-3 text-right font-bold tracking-wider">Existing Limits</th>
              <th className="px-6 py-3 text-right font-bold tracking-wider">Proposed Limits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ede6] bg-white text-slate-900">
            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={3}>A. FUND BASED LIMITS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left pl-10 font-sans">1. Cash Credit / Overdraft</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2 text-right font-bold tracking-tight">₹{fmt(loanAmount)}</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left pl-10 font-sans">2. Term Loan</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left pl-10 font-sans">3. Bills Purchased / Discounted</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 italic font-sans text-slate-700">Total Fund Based Limits (A)</td>
              <td className="px-6 py-2.5 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2.5 text-right font-bold">₹{fmt(loanAmount)}</td>
            </tr>

            <tr className="bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase">
              <td className="px-6 py-2 text-left" colSpan={3}>B. NON-FUND BASED LIMITS</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left pl-10 font-sans">1. Letter of Credit (LC)</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
            </tr>
            <tr>
              <td className="px-6 py-2 text-left pl-10 font-sans">2. Bank Guarantee (BG)</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2 text-right text-slate-400 italic">NIL</td>
            </tr>
            <tr className="bg-[#e8e4da] font-bold border-y border-[#ccc8be]">
              <td className="px-6 py-2.5 text-left pl-6 italic font-sans text-slate-700">Total Non-Fund Based Limits (B)</td>
              <td className="px-6 py-2.5 text-right text-slate-400 italic">NIL</td>
              <td className="px-6 py-2.5 text-right text-slate-400 italic">NIL</td>
            </tr>

            <tr className="bg-slate-900 text-white font-bold text-sm">
              <td className="px-6 py-4 text-left font-sans">TOTAL LIMITS (A + B)</td>
              <td className="px-6 py-4 text-right text-slate-400 italic text-xs">NIL</td>
              <td className="px-6 py-4 text-right font-bold text-blue-400 tracking-wider">₹{fmt(loanAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PART B: SECURITY DETAILS (Legal & Physical) */}
      <div className="border-t-2 border-slate-900 bg-slate-50/50">
        <div className="px-6 py-2 bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase border-b border-slate-200">
          PART B: SECURITY PARTICULARS
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <tbody className="divide-y divide-slate-100 bg-white text-slate-800 font-sans">
            <tr>
              <td className="px-6 py-3 font-bold border-r border-slate-100 bg-slate-50/30 w-48">Primary Security</td>
              <td className="px-6 py-3">Hypothecation of all Stocks and Book Debts of {bizName || 'the business'} (Present & Future).</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-bold border-r border-slate-100 bg-slate-50/30">Collateral Security</td>
              <td className="px-6 py-3">Personal Guarantee of Promoter(s) / Third Party Property (if applicable).</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-bold border-r border-slate-100 bg-slate-50/30">Personal Guarantees</td>
              <td className="px-6 py-3">Personal Guarantee of {propName || 'the proprietor'} / Managing Partners.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PART C: ASSOCIATE / GROUP CONCERNS (Mandatory Disclosure for Anti-Siphoning) */}
      <div className="border-t-2 border-slate-900">
        <div className="px-6 py-2 bg-[#f0ede6] font-bold text-[#7a7567] text-[10px] uppercase border-b border-slate-200">
          PART C: PARTICULARS OF ASSOCIATE / GROUP CONCERNS
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-[10px] font-mono">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="px-6 py-2 text-left border-r border-slate-200">Name of Concern</th>
                <th className="px-6 py-2 text-left border-r border-slate-200">Activity</th>
                <th className="px-6 py-2 text-left border-r border-slate-200">Name of Banker</th>
                <th className="px-6 py-2 text-right">Limit / Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-3 text-slate-400 italic text-center" colSpan={4}>
                  No other bank facilities enjoyed by associate concerns as per available records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <p className="text-[8px] text-slate-400 italic">
          * Note: This statement is prepared as per standard Credit Monitoring Arrangement (CMA) guidelines. 
          The data presented is projected and subject to bank's internal appraisal norms.
        </p>
      </div>
    </div>
  );
}