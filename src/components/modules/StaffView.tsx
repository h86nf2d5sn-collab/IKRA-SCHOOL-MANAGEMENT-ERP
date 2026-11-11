import { useState, ChangeEvent, FormEvent } from 'react';
import { Download, Edit2, FileDown, Trash2, Upload } from 'lucide-react';
import { StaffMember } from '../../types/erp';
import { downloadCSV, formatBDT, parseCSVRow } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface StaffViewProps {
  staff: StaffMember[];
  onSaveStaff: (member: Omit<StaffMember, 'id'>, editId?: string) => void;
  onDeleteStaff: (member: StaffMember) => void;
  onImportStaff: (imported: Omit<StaffMember, 'id'>[]) => void;
}

export function StaffView({
  staff,
  onSaveStaff,
  onDeleteStaff,
  onImportStaff,
}: StaffViewProps) {
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [mobile, setMobile] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveStaff(
      {
        name: name.trim(),
        role: role.trim() || 'Staff',
        mobile: mobile.trim(),
        salary: parseFloat(salary) || 0,
      },
      editId || undefined
    );
    resetForm();
  };

  const resetForm = () => {
    setEditId('');
    setName('');
    setRole('');
    setMobile('');
    setSalary('');
  };

  const handleStartEdit = (st: StaffMember) => {
    setEditId(st.id);
    setName(st.name);
    setRole(st.role || '');
    setMobile(st.mobile || '');
    setSalary(st.salary ? st.salary.toString() : '');
  };

  const handleSampleCSV = () => {
    const headers = 'Name,Role,Mobile,Salary\n';
    const sample =
      'Monir Hossain,Accountant,01600112233,20000\nShafiqul Islam,Lab Assistant,01500112233,15000\n';
    downloadCSV('Staff_Directory_Template.csv', headers + sample);
  };

  const handleExportCSV = () => {
    let csv = 'Name,Role,Mobile,Salary\n';
    staff.forEach((st) => {
      csv += `"${st.name}","${st.role || ''}","${st.mobile || ''}","${st.salary || 0}"\n`;
    });
    downloadCSV('IKRA_Staff_Export.csv', csv);
  };

  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = typeof ev.target?.result === 'string' ? ev.target.result : '';
      const lines = text.split(/\r?\n/);
      const parsed: Omit<StaffMember, 'id'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = parseCSVRow(line);
        if (parts[0]) {
          parsed.push({
            name: parts[0],
            role: parts[1] || 'Staff',
            mobile: parts[2] || '',
            salary: parseFloat(parts[3]) || 15000,
          });
        }
      }
      if (parsed.length > 0) {
        onImportStaff(parsed);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Directory"
        description="Manage administrative and campus support staff details and monthly salaries."
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
              {editId ? 'Edit Staff Record' : 'Add Staff Member'}
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
                Staff Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monir Hossain"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Accountant"
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
                placeholder="20000"
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono tabular-nums font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {editId ? 'Update Staff' : 'Save Staff'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden self-start">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4 text-right">Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      No staff members added yet.
                    </td>
                  </tr>
                ) : (
                  staff.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {st.name}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {st.role || 'Staff'}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {st.mobile || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {formatBDT(st.salary)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(st)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteStaff(st)}
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
