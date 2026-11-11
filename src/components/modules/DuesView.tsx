import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { Student, Transaction } from '../../types/erp';
import { formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface DuesViewProps {
  students: Student[];
  transactions: Transaction[];
  feePresets: Record<string, number>;
  onCollectForStudent: (student: Student, month: string) => void;
}

export function DuesView({
  students,
  transactions,
  feePresets,
  onCollectForStudent,
}: DuesViewProps) {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const expectedMonthlyFee = feePresets['Tuition Fee'] ?? 1500;

  const activeStudents = students.filter((s) => s.status !== 'Graduated');

  const rows = activeStudents.map((s) => {
    // Match payments made by this student for the selected billing month
    const paidForMonth = transactions
      .filter((t) => {
        if (t.type !== 'Income') return false;
        const matchesStudent =
          t.studentId === s.id ||
          t.payee.toLowerCase().includes(s.name.toLowerCase());
        const matchesMonth =
          t.billingMonth === selectedMonth ||
          (!t.billingMonth && t.date.startsWith(selectedMonth));
        return matchesStudent && matchesMonth;
      })
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const pendingDue = Math.max(0, expectedMonthlyFee - paidForMonth);

    return {
      student: s,
      paid: paidForMonth,
      due: pendingDue,
      isCleared: pendingDue === 0,
    };
  });

  const totalPending = rows.reduce((acc, r) => acc + r.due, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Dues Tracker"
        description="Monitor monthly tuition expectations against collected fee transactions."
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="dues-month"
              className="text-xs font-semibold text-slate-700 whitespace-nowrap"
            >
              Billing Period
            </label>
            <input
              id="dues-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 bg-white rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 font-mono tabular-nums">
            <span>
              Monthly Tuition Standard:{' '}
              <strong className="text-slate-900">
                {formatBDT(expectedMonthlyFee)}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Total Pending:{' '}
              <strong className="text-rose-700">
                {formatBDT(totalPending)}
              </strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Guardian</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Pending Dues</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No active students enrolled.
                  </td>
                </tr>
              ) : (
                rows.map(({ student, paid, due, isCleared }) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                      {student.roll}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {student.class}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {student.guardian || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {student.mobile || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                      {formatBDT(paid)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${
                        isCleared ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {isCleared ? 'Cleared (৳ 0)' : formatBDT(due)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onCollectForStudent(student, selectedMonth)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>{isCleared ? 'Add Payment' : 'Collect Fee'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
