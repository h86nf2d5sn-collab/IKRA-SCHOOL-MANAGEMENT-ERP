import { useState, useEffect, FormEvent } from 'react';
import { Plus, Printer, Trash2 } from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/defaults';
import { FeeLineItem, MoneyReceipt, Student } from '../../types/erp';
import { formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface PaymentsViewProps {
  students: Student[];
  feeCategories: string[];
  feePresets: Record<string, number>;
  signatureDataUrl: string;
  prefillSelection?: { className: string; studentId: string; month: string } | null;
  latestReceipt: MoneyReceipt | null;
  onCollectFee: (payload: {
    student: Student;
    month: string;
    items: { name: string; amt: number }[];
    totalAmount: number;
  }) => void;
}

export function PaymentsView({
  students,
  feeCategories,
  feePresets,
  signatureDataUrl,
  prefillSelection,
  latestReceipt,
  onCollectFee,
}: PaymentsViewProps) {
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [billingMonth, setBillingMonth] = useState('2026-01');
  const [rows, setRows] = useState<FeeLineItem[]>(() => {
    const firstCat = feeCategories[0] || 'Tuition Fee';
    return [
      {
        id: 'row-1',
        name: firstCat,
        amount: feePresets[firstCat] ?? 1500,
      },
    ];
  });

  const classStudents = students.filter(
    (s) => s.class === selectedClass && s.status !== 'Graduated'
  );

  // Sync student selection when class changes or prefill is triggered
  useEffect(() => {
    if (prefillSelection) {
      setSelectedClass(prefillSelection.className);
      setSelectedStudentId(prefillSelection.studentId);
      setBillingMonth(prefillSelection.month);
    }
  }, [prefillSelection]);

  useEffect(() => {
    if (
      classStudents.length > 0 &&
      !classStudents.some((s) => s.id === selectedStudentId)
    ) {
      setSelectedStudentId(classStudents[0].id);
    } else if (classStudents.length === 0) {
      setSelectedStudentId('');
    }
  }, [selectedClass, classStudents, selectedStudentId]);

  const addRow = () => {
    const firstCat = feeCategories[0] || 'Tuition Fee';
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random()}`,
        name: firstCat,
        amount: feePresets[firstCat] ?? 0,
      },
    ]);
  };

  const updateRowCategory = (id: string, catName: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, name: catName, amount: feePresets[catName] ?? 0 }
          : r
      )
    );
  };

  const updateRowAmount = (id: string, amt: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, amount: amt } : r))
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const grandTotal = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;
    const validItems = rows
      .filter((r) => Number(r.amount) > 0)
      .map((r) => ({ name: r.name, amt: Number(r.amount) }));
    if (validItems.length === 0) return;

    onCollectFee({
      student,
      month: billingMonth,
      items: validItems,
      totalAmount: validItems.reduce((acc, i) => acc + i.amt, 0),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Collection & Official Receipt"
        description="Collect itemized student tuition and term fees with instant printable money receipts."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Money Receipt</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Entry Form */}
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 space-y-4 self-start">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">
            Receive Fee Payment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class Level
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {AVAILABLE_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {classStudents.length === 0 ? (
                  <option value="">No Students in {selectedClass}</option>
                ) : (
                  classStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll {s.roll})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Month / Period
              </label>
              <input
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Fee Items Breakdown
                </label>
                <button
                  type="button"
                  onClick={addRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item Row</span>
                </button>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <select
                      value={row.name}
                      onChange={(e) =>
                        updateRowCategory(row.id, e.target.value)
                      }
                      className="flex-1 min-w-0 px-2.5 py-1.5 border border-slate-300 bg-white rounded text-xs font-medium text-slate-900 focus:outline-none"
                    >
                      {feeCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      value={row.amount}
                      onChange={(e) =>
                        updateRowAmount(
                          row.id,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-24 px-2 py-1.5 border border-slate-300 bg-white rounded text-xs font-mono tabular-nums font-bold text-emerald-700 text-right focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      aria-label="Remove fee line"
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Total Calculation
              </span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-700">
                {formatBDT(grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={!selectedStudentId || grandTotal <= 0}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Collect Fee & Generate Receipt
            </button>
          </form>
        </div>

        {/* Printable Money Receipt Canvas */}
        <div className="lg:col-span-2 print-only-full bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 space-y-6 self-start">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Official Student Money Receipt
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-bold px-3 py-1 rounded text-[11px] uppercase tracking-wider">
                MONEY RECEIPT
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                Receipt No: #{latestReceipt?.receiptNo || 'IKRA-0000'}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Date: {latestReceipt?.date || '--/--/----'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">Student Name</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {latestReceipt?.studentName || '—'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Class & Roll</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono tabular-nums">
                {latestReceipt
                  ? `${latestReceipt.className} · Roll ${latestReceipt.roll}`
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Billing Period</p>
              <p className="text-xs font-mono font-semibold text-slate-900 mt-0.5">
                {latestReceipt?.month || '—'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Payment Status</p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">
                {latestReceipt ? 'PAID & RECEIVED' : 'AWAITING COLLECTION'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 font-bold uppercase text-slate-800">
                  <th className="py-2.5">Fee Head / Description</th>
                  <th className="py-2.5 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {!latestReceipt || latestReceipt.items.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-slate-400">
                      Collect a fee entry to generate an official itemized receipt.
                    </td>
                  </tr>
                ) : (
                  latestReceipt.items.map((item, idx) => (
                    <tr key={`${item.name}-${idx}`}>
                      <td className="py-2.5 font-medium text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatBDT(item.amt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3">
            <span className="text-sm font-bold text-slate-900">
              Grand Total Paid
            </span>
            <span className="text-xl font-extrabold font-mono tabular-nums text-emerald-700">
              {formatBDT(latestReceipt?.totalAmount || 0)}
            </span>
          </div>

          <div className="flex justify-between items-end pt-12 text-xs font-semibold text-slate-800">
            <div className="text-center border-t border-slate-900 pt-1.5 w-36">
              Accounts Sign
            </div>
            <div className="text-center w-36">
              {signatureDataUrl && (
                <img
                  src={signatureDataUrl}
                  alt="Principal signature"
                  className="h-7 object-contain mx-auto mb-1"
                />
              )}
              <div className="border-t border-slate-900 pt-1.5">
                Principal Sign
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
