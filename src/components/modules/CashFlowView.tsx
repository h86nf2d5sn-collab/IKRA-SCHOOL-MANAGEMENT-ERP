import { useState } from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { Transaction } from '../../types/erp';
import { downloadCSV, formatBDT } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface CashFlowViewProps {
  transactions: Transaction[];
}

export function CashFlowView({ transactions }: CashFlowViewProps) {
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Income' | 'Expense'>(
    'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const netBalance = totalIncome - totalExpense;

  const filtered = transactions
    .slice()
    .reverse()
    .filter((t) => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.category.toLowerCase().includes(q) ||
        t.payee.toLowerCase().includes(q) ||
        t.date.includes(q)
      );
    });

  const handleExport = () => {
    let csv = 'Date,Type,Category,Payee/Payer,Amount (BDT)\n';
    filtered.forEach((t) => {
      csv += `"${t.date}","${t.type}","${t.category}","${t.payee}","${t.amount}"\n`;
    });
    downloadCSV('IKRA_Cash_Flow_Statement.csv', csv);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Flow & Statements"
        description="Monitor incoming fee collections and outgoing institutional expenditures."
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Total Inflow</p>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {formatBDT(totalIncome)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Total Outflow</p>
          <p className="text-xl font-bold text-rose-700 font-mono tabular-nums mt-1">
            {formatBDT(totalExpense)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Net Cash Flow</p>
          <p
            className={`text-xl font-bold font-mono tabular-nums mt-1 ${
              netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'
            }`}
          >
            {formatBDT(netBalance)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="no-print p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['ALL', 'Income', 'Expense'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTypeFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  typeFilter === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All Entries' : tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category, payee, date..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 bg-white rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payee / Payer</th>
                <th className="py-3 px-4 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No cash flow records match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {t.date}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span
                        className={
                          t.type === 'Income'
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {t.category}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{t.payee}</td>
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${
                        t.type === 'Income'
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
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
  );
}
