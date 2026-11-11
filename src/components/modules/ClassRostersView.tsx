import { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/defaults';
import { Student } from '../../types/erp';
import { downloadCSV } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface ClassRostersViewProps {
  students: Student[];
}

export function ClassRostersView({ students }: ClassRostersViewProps) {
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');

  const roster = students.filter(
    (s) => s.class === selectedClass && s.status !== 'Graduated'
  );

  const handleExport = () => {
    let csv = 'Roll,Student Name,Stream,Guardian Name,Mobile Phone\n';
    roster.forEach((s) => {
      csv += `"${s.roll}","${s.name}","${s.dept || 'General'}","${s.guardian || ''}","${s.mobile || ''}"\n`;
    });
    downloadCSV(
      `Roster_${selectedClass.replace(/\s+/g, '_')}.csv`,
      csv
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Rosters & Student Lists"
        description="View class-wise active student enrollment and guardian contact information."
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Roster CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Roster</span>
            </button>
          </>
        }
      />

      <div className="print-only-full bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="roster-class-select"
              className="text-xs font-semibold text-slate-700 whitespace-nowrap"
            >
              Select Class Roster
            </label>
            <select
              id="roster-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {AVAILABLE_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {roster.length} enrolled students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-20">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4">Guardian Name</th>
                <th className="py-3 px-4">Mobile Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No active students enrolled in {selectedClass}.
                  </td>
                </tr>
              ) : (
                roster.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                      {s.roll}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {s.dept || 'General'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {s.guardian || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {s.mobile || 'N/A'}
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
