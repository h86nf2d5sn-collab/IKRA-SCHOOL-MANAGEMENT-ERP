import {
  UserPlus,
  Receipt,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  StaffMember,
  Student,
  TabId,
  Teacher,
  Transaction,
} from '../../types/erp';
import { formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  staff: StaffMember[];
  transactions: Transaction[];
  onSwitchTab: (tab: TabId) => void;
}

export function DashboardView({
  students,
  teachers,
  staff,
  transactions,
  onSwitchTab,
}: DashboardViewProps) {
  const activeStudents = students.filter((s) => s.status !== 'Graduated');
  const totalStaff = teachers.length + staff.length;

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  // Class enrollment summary
  const classCounts = activeStudents.reduce<Record<string, number>>((acc, s) => {
    acc[s.class] = (acc[s.class] || 0) + 1;
    return acc;
  }, {});
  const classEntries = Object.entries(classCounts).sort((a, b) => b[1] - a[1]);

  const recentTransactions = transactions.slice().reverse().slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Dashboard Summary"
        description="Real-time operational metrics across student enrollment, faculty & staff, and financial cash flow."
      />

      {/* 4-Column KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Total Students</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1.5">
            {activeStudents.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Active enrollment across {classEntries.length} classes
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">
            Total Faculty & Staff
          </p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1.5">
            {totalStaff}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {teachers.length} Teachers · {staff.length} Support Staff
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">
            Total Inflows (Income)
          </p>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1.5">
            {formatBDT(totalIncome)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Tuition & institutional collections
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">
            Total Outflows (Expense)
          </p>
          <p className="text-2xl font-bold text-rose-700 font-mono tabular-nums mt-1.5">
            {formatBDT(totalExpense)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            Net Balance: {formatBDT(netBalance)}
          </p>
        </div>
      </div>

      {/* Quick Operational Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Quick Operational Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onSwitchTab('admission')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Add Admission</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab('payments')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Receipt className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Collect Fees</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab('expenses')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Wallet className="w-4 h-4 text-rose-700 shrink-0" />
            <span>Record Expense</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab('idcards')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <CreditCard className="w-4 h-4 text-amber-700 shrink-0" />
            <span>ID Cards</span>
          </button>
        </div>
      </div>

      {/* Two-column operational overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Active Enrollment by Class
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('classes')}
              className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
            >
              View Rosters
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Class Level</th>
                  <th className="py-2.5 px-4 text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-8 text-center text-slate-500 text-xs"
                    >
                      No active students enrolled yet.
                    </td>
                  </tr>
                ) : (
                  classEntries.map(([cls, count]) => (
                    <tr
                      key={cls}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {cls}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Financial Activity
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('cashflow')}
              className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
            >
              All Statements
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-slate-500 text-xs"
                    >
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((trx) => {
                    const isIncome = trx.type === 'Income';
                    return (
                      <tr
                        key={trx.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono tabular-nums text-slate-600">
                          {trx.date}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="font-medium text-slate-900 truncate max-w-[200px]">
                            {trx.category}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {trx.payee}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isIncome ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                            )}
                            {formatBDT(trx.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
