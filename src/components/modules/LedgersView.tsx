import { Download, Printer } from 'lucide-react';
import { Transaction } from '../../types/erp';
import { downloadCSV, formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface LedgersViewProps {
  transactions: Transaction[];
}

export function LedgersView({ transactions }: LedgersViewProps) {
  const monthMap: Record<
    string,
    { income: number; expense: number; count: number }
  > = {};

  transactions.forEach((t) => {
    const monthKey = t.date ? t.date.substring(0, 7) : '2026-01';
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'Income') {
      monthMap[monthKey].income += Number(t.amount) || 0;
    } else if (t.type === 'Expense') {
      monthMap[monthKey].expense += Number(t.amount) || 0;
    }
    monthMap[monthKey].count += 1;
  });

  const months = Object.keys(monthMap).sort().reverse();

  const grandIncome = months.reduce((acc, m) => acc + monthMap[m].income, 0);
  const grandExpense = months.reduce((acc, m) => acc + monthMap[m].expense, 0);
  const grandNet = grandIncome - grandExpense;

  const handleExport = () => {
    let csv =
      'Month,Entries,Total Inflow (BDT),Total Outflow (BDT),Net Balance (BDT)\n';
    months.forEach((m) => {
      const inc = monthMap[m].income;
      const exp = monthMap[m].expense;
      csv += `"${m}","${monthMap[m].count}","${inc}","${exp}","${inc - exp}"\n`;
    });
    downloadCSV('IKRA_Audit_Ledgers.csv', csv);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full Audit Ledgers"
        description="Monthly institutional balance summaries and reconciled financial statements."
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit Report</span>
            </button>
          </>
        }
      />

      <div className="print-only-full bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Month / Period</th>
                <th className="py-3 px-4 text-center">Transactions</th>
                <th className="py-3 px-4 text-right">Total Inflow (Income)</th>
                <th className="py-3 px-4 text-right">Total Outflow (Expense)</th>
                <th className="py-3 px-4 text-right">Net Financial Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {months.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No financial transactions recorded.
                  </td>
                </tr>
              ) : (
                months.map((m) => {
                  const inc = monthMap[m].income;
                  const exp = monthMap[m].expense;
                  const net = inc - exp;
                  return (
                    <tr
                      key={m}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {m}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                        {monthMap[m].count}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {formatBDT(inc)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-rose-700">
                        {formatBDT(exp)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${
                          net >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {formatBDT(net)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {months.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                  <td className="py-3 px-4">Cumulative Total</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">
                    {transactions.length}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                    {formatBDT(grandIncome)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-700">
                    {formatBDT(grandExpense)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono tabular-nums ${
                      grandNet >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatBDT(grandNet)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
