import { useState, useEffect, FormEvent } from 'react';
import { Printer } from 'lucide-react';
import { StaffMember, Teacher, Transaction } from '../../types/erp';
import { formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface ExpensesViewProps {
  costCategories: string[];
  teachers: Teacher[];
  staff: StaffMember[];
  transactions: Transaction[];
  onRecordExpense: (payload: {
    category: string;
    payee: string;
    amount: number;
    date: string;
  }) => void;
}

export function ExpensesView({
  costCategories,
  teachers,
  staff,
  transactions,
  onRecordExpense,
}: ExpensesViewProps) {
  const [category, setCategory] = useState(
    costCategories[0] || 'Salary Expense'
  );
  const [recipientType, setRecipientType] = useState<
    'General' | 'Teacher' | 'Staff'
  >('General');
  const [payeeName, setPayeeName] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!costCategories.includes(category) && costCategories.length > 0) {
      setCategory(costCategories[0]);
    }
  }, [costCategories, category]);

  useEffect(() => {
    if (recipientType === 'Teacher' && teachers.length > 0) {
      const first = teachers[0];
      setSelectedEmployeeName(first.name);
      setAmount(first.salary ? first.salary.toString() : '');
      if (costCategories.includes('Salary Expense')) {
        setCategory('Salary Expense');
      }
    } else if (recipientType === 'Staff' && staff.length > 0) {
      const first = staff[0];
      setSelectedEmployeeName(first.name);
      setAmount(first.salary ? first.salary.toString() : '');
      if (costCategories.includes('Salary Expense')) {
        setCategory('Salary Expense');
      }
    } else {
      setSelectedEmployeeName('');
    }
  }, [recipientType, teachers, staff, costCategories]);

  const handleEmployeeChange = (empName: string) => {
    setSelectedEmployeeName(empName);
    if (recipientType === 'Teacher') {
      const t = teachers.find((item) => item.name === empName);
      if (t) setAmount(t.salary.toString());
    } else if (recipientType === 'Staff') {
      const st = staff.find((item) => item.name === empName);
      if (st) setAmount(st.salary.toString());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) return;

    const finalPayee =
      recipientType === 'General'
        ? payeeName.trim() || 'General Expense'
        : `${selectedEmployeeName || 'Employee'} (${recipientType})`;

    onRecordExpense({
      category,
      payee: finalPayee,
      amount: numericAmount,
      date: date || new Date().toISOString().split('T')[0],
    });

    setPayeeName('');
    if (recipientType === 'General') {
      setAmount('');
    }
  };

  const expenseTransactions = transactions
    .filter((t) => t.type === 'Expense')
    .slice()
    .reverse();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense & Salary Outflow"
        description="Record faculty/staff payroll disbursements, utility bills, and campus maintenance expenses."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Outflow Report</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outflow Form */}
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 space-y-4 self-start">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">
            Record Outflow Expense
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {costCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Type
              </label>
              <select
                value={recipientType}
                onChange={(e) =>
                  setRecipientType(
                    e.target.value as 'General' | 'Teacher' | 'Staff'
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="General">General / External Payee</option>
                <option value="Teacher">Teacher Salary</option>
                <option value="Staff">Staff Salary</option>
              </select>
            </div>

            {recipientType === 'General' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payee / Vendor Name
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. DESCO Electric Board"
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select {recipientType}
                </label>
                <select
                  value={selectedEmployeeName}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {recipientType === 'Teacher' ? (
                    teachers.length === 0 ? (
                      <option value="">No Teachers Registered</option>
                    ) : (
                      teachers.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.mobile || 'Faculty'})
                        </option>
                      ))
                    )
                  ) : staff.length === 0 ? (
                    <option value="">No Staff Registered</option>
                  ) : (
                    staff.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.role || 'Staff'})
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Outflow Amount (BDT) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono tabular-nums font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Record Outflow Expense
            </button>
          </form>
        </div>

        {/* Expense Table */}
        <div className="lg:col-span-2 print-only-full bg-white border border-slate-200 rounded-xl overflow-hidden self-start">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Expense Outflows
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payee / Recipient</th>
                  <th className="py-3 px-4 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenseTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  expenseTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {t.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {t.category}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{t.payee}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-rose-700">
                        {formatBDT(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
