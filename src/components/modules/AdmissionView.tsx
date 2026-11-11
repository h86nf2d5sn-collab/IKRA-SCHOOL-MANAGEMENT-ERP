import { useState, FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import { AVAILABLE_CLASSES, STREAMS } from '../../data/defaults';
import { Student } from '../../types/erp';
import { getNextClassRoll } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface AdmissionViewProps {
  students: Student[];
  onAdmitStudent: (student: Omit<Student, 'id' | 'roll' | 'status'>) => void;
}

function inferStreamFromClass(cls: string): string {
  const lower = cls.toLowerCase();
  if (lower.includes('science')) return 'Science';
  if (lower.includes('arts')) return 'Humanities/Arts';
  if (lower.includes('commerce')) return 'Business Studies/Commerce';
  return 'General';
}

export function AdmissionView({
  students,
  onAdmitStudent,
}: AdmissionViewProps) {
  const [name, setName] = useState('');
  const [targetClass, setTargetClass] = useState('10th Class Science Group');
  const [dept, setDept] = useState('Science');
  const [guardian, setGuardian] = useState('');
  const [mobile, setMobile] = useState('');
  const [homeAddr, setHomeAddr] = useState('');

  const nextRoll = getNextClassRoll(students, targetClass);

  const handleClassChange = (cls: string) => {
    setTargetClass(cls);
    setDept(inferStreamFromClass(cls));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !guardian.trim() || !mobile.trim()) return;
    onAdmitStudent({
      name: name.trim(),
      class: targetClass,
      dept,
      guardian: guardian.trim(),
      mobile: mobile.trim(),
      homeAddr: homeAddr.trim(),
    });
    setName('');
    setGuardian('');
    setMobile('');
    setHomeAddr('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Admission Entry"
        description="Enroll new students with automatic class-level roll assignment."
      />

      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Admission Registration Form
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Required fields are marked with an asterisk (*).
            </p>
          </div>
          <div className="text-xs text-slate-600 font-mono tabular-nums">
            Assigned Roll Preview:{' '}
            <span className="font-bold text-blue-700">#{nextRoll}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="adm-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Student Full Name *
              </label>
              <input
                id="adm-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Siddiqua"
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="adm-class"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Select Target Class *
              </label>
              <select
                id="adm-class"
                required
                value={targetClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {AVAILABLE_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="adm-dept"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Stream / Group *
              </label>
              <select
                id="adm-dept"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {STREAMS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="adm-guardian"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Guardian Name *
              </label>
              <input
                id="adm-guardian"
                type="text"
                required
                value={guardian}
                onChange={(e) => setGuardian(e.target.value)}
                placeholder="e.g. Tariqul Islam"
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="adm-mobile"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Contact Mobile Number *
              </label>
              <input
                id="adm-mobile"
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-mono tabular-nums font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="adm-addr"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Home Address
              </label>
              <input
                id="adm-addr"
                type="text"
                value={homeAddr}
                onChange={(e) => setHomeAddr(e.target.value)}
                placeholder="Street, Area, City"
                className="w-full px-3.5 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Submit Admission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
