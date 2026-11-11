import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Download,
  Edit2,
  FileDown,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AVAILABLE_CLASSES, STREAMS } from '../../data/defaults';
import { Student } from '../../types/erp';
import { downloadCSV, parseCSVRow } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface StudentsViewProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onImportStudents: (imported: Omit<Student, 'id'>[]) => void;
}

export function StudentsView({
  students,
  onUpdateStudent,
  onDeleteStudent,
  onImportStudents,
}: StudentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) => {
    if (classFilter !== 'ALL' && s.class !== classFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.roll.toString().includes(q) ||
      (s.mobile && s.mobile.includes(q)) ||
      s.class.toLowerCase().includes(q)
    );
  });

  const handleDownloadSample = () => {
    const headers =
      'Roll,Student Name,Class,Stream,Guardian,Mobile,Address\n';
    const sample =
      '1,Rahim Ahmed,Class 9 Science Group,Science,Abul Hossain,01711000000,Dhaka\n2,Fatema Begum,Class 9 Science Group,Science,Karim Chowdhury,01811000000,Mirpur\n';
    downloadCSV('Students_Directory_Template.csv', headers + sample);
  };

  const handleExport = () => {
    let csv = 'Roll,Student Name,Class,Stream,Guardian,Mobile,Address\n';
    students.forEach((s) => {
      csv += `"${s.roll}","${s.name}","${s.class}","${s.dept || 'General'}","${s.guardian || ''}","${s.mobile || ''}","${s.homeAddr || ''}"\n`;
    });
    downloadCSV('IKRA_Students_Export.csv', csv);
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = typeof ev.target?.result === 'string' ? ev.target.result : '';
      const lines = text.split(/\r?\n/);
      const parsed: Omit<Student, 'id'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = parseCSVRow(line);
        if (parts.length >= 2 && parts[1]) {
          parsed.push({
            roll: parts[0] || '1',
            name: parts[1],
            class: parts[2] || 'Class 9 Science Group',
            dept: parts[3] || 'General',
            guardian: parts[4] || '',
            mobile: parts[5] || '',
            homeAddr: parts[6] || '',
            status: 'Active',
          });
        }
      }
      if (parsed.length > 0) {
        onImportStudents(parsed);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students Directory & CSV Operations"
        description="Search, edit, filter, and bulk import/export student enrollment records."
        actions={
          <>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </>
        }
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll, mobile, or class..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 bg-white rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            aria-label="Filter by class"
            className="px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Classes ({students.length})</option>
            {AVAILABLE_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4">Guardian</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                      {s.roll}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {s.name}
                      {s.status === 'Graduated' && (
                        <span className="ml-2 text-[11px] font-medium text-slate-500">
                          (Graduated)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{s.class}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {s.dept || 'General'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {s.guardian || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {s.mobile || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingStudent({ ...s })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Student Record
              </h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStudent.roll}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        roll: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-mono tabular-nums font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    value={editingStudent.class}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        class: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {AVAILABLE_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stream / Group
                  </label>
                  <select
                    value={editingStudent.dept}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        dept: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {STREAMS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    value={editingStudent.guardian}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        guardian: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={editingStudent.mobile}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        mobile: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-mono tabular-nums font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Home Address
                </label>
                <input
                  type="text"
                  value={editingStudent.homeAddr}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      homeAddr: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
