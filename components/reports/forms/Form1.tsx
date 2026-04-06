// components/reports/forms/Form1.tsx
import { fmt } from"../../../lib/format";

interface Form1Props {
 bizName: string;
 propName: string;
 proposedCc: number;
 proposedTl: number;
 existingCc: number;
 existingTl: number;
}

export default function Form1({ bizName, propName, proposedCc, proposedTl, existingCc, existingTl }: Form1Props) {
 const totalExisting = existingCc + existingTl;
 const totalProposed = proposedCc + proposedTl;
 return (
 <div className="border border-black rounded-none overflow-hidden font-sans">
 {/* 1. Header with Banking Metadata */}
 <div className="border-b border-black px-6 py-4 flex justify-between items-center border-b border-black">
 <div>
 <h3 className="font-bold uppercase text-[11px]">CMA Form I</h3>
 <p className="text-[10px] mt-0.5 font-mono">Particulars of Existing & Proposed Limits</p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase">Form I</span>
 <span className="text-[8px] mt-1 uppercase font-mono">RBI Compliance v2.0</span>
 </div>
 </div>

 {/* PART A: LIMITS TABLE (Fund & Non-Fund Based) */}
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[11px] whitespace-nowrap font-mono">
 <thead className="border-b border-black">
 <tr className="uppercase">
 <th className="px-6 py-3 text-left font-bold min-w-[350px]">Nature of Facility</th>
 <th className="px-6 py-3 text-right font-bold">Existing Limits</th>
 <th className="px-6 py-3 text-right font-bold">Proposed Limits</th>
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={3}>A. FUND BASED LIMITS</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">1. Cash Credit / Overdraft</td>
 <td className={`px-6 py-2 text-right ${existingCc > 0 ? 'font-bold' : ' '}`}>
 {existingCc > 0 ? `₹${fmt(existingCc)}` : 'NIL'}
 </td>
 <td className={`px-6 py-2 text-right ${proposedCc > 0 ? 'font-bold' : ' '}`}>
 {proposedCc > 0 ? `₹${fmt(proposedCc)}` : 'NIL'}
 </td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">2. Term Loan</td>
 <td className={`px-6 py-2 text-right ${existingTl > 0 ? 'font-bold' : ' '}`}>
 {existingTl > 0 ? `₹${fmt(existingTl)}` : 'NIL'}
 </td>
 <td className={`px-6 py-2 text-right ${proposedTl > 0 ? 'font-bold' : ' '}`}>
 {proposedTl > 0 ? `₹${fmt(proposedTl)}` : 'NIL'}
 </td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">3. Bills Purchased / Discounted</td>
 <td className="px-6 py-2 text-right">NIL</td>
 <td className="px-6 py-2 text-right">NIL</td>
 </tr>
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-2.5 text-left pl-6 font-sans">Total Fund Based Limits (A)</td>
 <td className={`px-6 py-2.5 text-right ${totalExisting > 0 ? 'font-bold' : ' '}`}>
 {totalExisting > 0 ? `₹${fmt(totalExisting)}` : 'NIL'}
 </td>
 <td className={`px-6 py-2.5 text-right ${totalProposed > 0 ? 'font-bold' : ' '}`}>
 {totalProposed > 0 ? `₹${fmt(totalProposed)}` : 'NIL'}
 </td>
 </tr>

 <tr className="border-y border-black font-bold text-[10px] uppercase">
 <td className="px-6 py-2 text-left" colSpan={3}>B. NON-FUND BASED LIMITS</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">1. Letter of Credit (LC)</td>
 <td className="px-6 py-2 text-right">NIL</td>
 <td className="px-6 py-2 text-right">NIL</td>
 </tr>
 <tr>
 <td className="px-6 py-2 text-left pl-10 font-sans">2. Bank Guarantee (BG)</td>
 <td className="px-6 py-2 text-right">NIL</td>
 <td className="px-6 py-2 text-right">NIL</td>
 </tr>
 <tr className="font-bold border-y border-[#ccc8be]">
 <td className="px-6 py-2.5 text-left pl-6 font-sans">Total Non-Fund Based Limits (B)</td>
 <td className="px-6 py-2.5 text-right">NIL</td>
 <td className="px-6 py-2.5 text-right">NIL</td>
 </tr>

 <tr className="border-b border-black font-bold text-[11px]">
 <td className="px-6 py-4 text-left font-sans">TOTAL LIMITS (A + B)</td>
 <td className={`px-6 py-4 text-right text-[11px] ${totalExisting > 0 ? '' : ' '}`}>
 {totalExisting > 0 ? `₹${fmt(totalExisting)}` : 'NIL'}
 </td>
 <td className="px-6 py-4 text-right font-bold">
 {totalProposed > 0 ? `₹${fmt(totalProposed)}` : 'NIL'}
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 {/* PART B: SECURITY DETAILS (Legal & Physical) */}
 <div className="border-t-2 border-black">
 <div className="px-6 py-2 border-y border-black font-bold text-[10px] uppercase border-b border-black">
 PART B: SECURITY PARTICULARS
 </div>
 <table className="min-w-full divide-black divide-black text-[11px]">
 <tbody className="divide-black divide-black font-sans">
 <tr>
 <td className="px-6 py-3 font-bold border-r border-black w-48">Primary Security</td>
 <td className="px-6 py-3">Hypothecation of all Stocks and Book Debts of {bizName || 'the business'} (Present & Future).</td>
 </tr>
 <tr>
 <td className="px-6 py-3 font-bold border-r border-black">Collateral Security</td>
 <td className="px-6 py-3">Personal Guarantee of Promoter(s) / Third Party Property (if applicable).</td>
 </tr>
 <tr>
 <td className="px-6 py-3 font-bold border-r border-black">Personal Guarantees</td>
 <td className="px-6 py-3">Personal Guarantee of {propName || 'the proprietor'} / Managing Partners.</td>
 </tr>
 </tbody>
 </table>
 </div>

 {/* PART C: ASSOCIATE / GROUP CONCERNS (Mandatory Disclosure for Anti-Siphoning) */}
 <div className="border-t-2 border-black">
 <div className="px-6 py-2 border-y border-black font-bold text-[10px] uppercase border-b border-black">
 PART C: PARTICULARS OF ASSOCIATE / GROUP CONCERNS
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-black divide-black text-[10px] font-mono">
 <thead className="">
 <tr className="uppercase">
 <th className="px-6 py-2 text-left border-r border-black">Name of Concern</th>
 <th className="px-6 py-2 text-left border-r border-black">Activity</th>
 <th className="px-6 py-2 text-left border-r border-black">Name of Banker</th>
 <th className="px-6 py-2 text-right">Limit / Outstanding</th>
 </tr>
 </thead>
 <tbody className="divide-black divide-black">
 <tr className="hover:">
 <td className="px-6 py-3 text-center" colSpan={4}>
 No other bank facilities enjoyed by associate concerns as per available records.
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 
 <div className="p-4 border-t border-black">
 <p className="text-[8px]">
 * Note: This statement is prepared as per standard Credit Monitoring Arrangement (CMA) guidelines. 
 The data presented is projected and subject to bank's internal appraisal norms.
 </p>
 </div>
 </div>
 );
}