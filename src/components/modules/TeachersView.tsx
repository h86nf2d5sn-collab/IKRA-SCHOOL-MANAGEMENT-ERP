import { useState, ChangeEvent, FormEvent } from 'react';
import { Download, Edit2, FileDown, Trash2, Upload } from 'lucide-react';
import { Teacher } from '../../types/erp';
import { downloadCSV, formatBDT, parseCSVRow } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface TeachersViewProps {
  teachers: Teacher[];
  onSaveTeacher: (teacher: Omit<Teacher, 'id'>, editId?: string) => void;
  onDeleteTeacher: (teacher: Teacher) => void;
  onImportTeachers: (imported: Omit<Teacher, 'id'>[]) => void;
}

export function TeachersView({
  teachers,
  onSaveTeacher,
  onDeleteTeacher,
  onImportTeachers,
}: TeachersViewProps) {
  const [editId, setEditId] = useState<string>('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [mobile, setMobile] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveTeacher(
      {
        name: name.trim(),
        subject: subject.trim() || 'General',
        mobile: mobile.trim(),
        salary: parseFloat(salary) || 0,
        status: 'Active',
      },
      editId || undefined
    );
    resetForm();
  };

  const resetForm = () => {
    setEditId('');
    setName('');
    setSubject('');
    setMobile('');
    setSalary('');
  };

  const handleStartEdit = (t: Teacher) => {
    setEditId(t.id);
    setName(t.name);
    setSubject(t.subject || '');
    setMobile(t.mobile || '');
    setSalary(t.salary ? t.salary.toString() : '');
  };

  const handleSampleCSV = () => {
    const headers = 'Name,Subject,Mobile,Salary\n';
    const sample =
      'Dr. M. A. Rahim,Mathematics,01700112233,35000\nNazma Akter,Bangla,01800112233,28000\n';
    downloadCSV('Teachers_Roster_Template.csv', headers + sample);
  };

  const handleExportCSV = () => {
    let csv = 'Name,Subject,Mobile,Salary\n';
    teachers.forEach((t) => {
      csv += `"${t.name}","${t.subject || ''}","${t.mobile || ''}","${t.salary || 0}"\n`;
    });
    downloadCSV('IKRA_Teachers_Export.csv', csv);
  };

  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = typeof ev.target?.result === 'string' ? ev.target.result : '';
      const lines = text.split(/\r?\n/);
      const parsed: Omit<Teacher, 'id'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = parseCSVRow(line);
        if (parts[0]) {
          parsed.push({
            name: parts[0],
            subject: parts[1] || 'General',
            mobile: parts[2] || '',
            salary: parseFloat(parts[3]) || 20000,
            status: 'Active',
          });
        }
      }
      if (parsed.length > 0) {
        onImportTeachers(parsed);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers Directory & Roster"
        description="Manage teaching faculty profiles, assigned subjects, and monthly payroll baselines."
        actions={
          <>
            <button
              type="button"
              onClick={handleSampleCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
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
                onChange={handleImportCSV}
              />
            </label>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 self-start">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              {editId ? 'Edit Teacher Record' : 'Add Teacher'}
            </h3>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teacher Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. M. A. Rahim"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono tabular-nums font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Salary (BDT)
              </label>
              <input
                type="number"
                min={0}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="25000"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono tabular-nums font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {editId ? 'Update Teacher' : 'Save Teacher'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden self-start">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4 text-right">Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      No teachers added yet.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {t.name}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {t.subject || 'General'}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {t.mobile || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {formatBDT(t.salary)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTeacher(t)}
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
      </div>
    </div>
  );
}
