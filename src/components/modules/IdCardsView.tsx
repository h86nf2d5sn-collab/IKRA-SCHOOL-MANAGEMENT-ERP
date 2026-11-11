import { useState, ChangeEvent } from 'react';
import { Printer, Trash2, Upload } from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/defaults';
import {
  AuthorityRole,
  IdCardOrientation,
  IdCardSubTab,
  IdCardTemplateKey,
  StaffMember,
  Student,
  Teacher,
} from '../../types/erp';
import { PageHeader } from '../PageHeader';

interface IdCardsViewProps {
  students: Student[];
  teachers: Teacher[];
  staff: StaffMember[];
  signatureDataUrl: string;
  onSignatureUpload: (dataUrl: string) => void;
  onClearSignature: () => void;
}

const COLOR_TEMPLATES: Record<
  IdCardTemplateKey,
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  }
> = {
  ocean: {
    bg: 'bg-blue-900',
    border: 'border-blue-900',
    text: 'text-blue-950',
    badge: 'bg-blue-600 text-white',
    accent: 'bg-blue-100',
  },
  crimson: {
    bg: 'bg-rose-900',
    border: 'border-rose-900',
    text: 'text-rose-950',
    badge: 'bg-rose-600 text-white',
    accent: 'bg-rose-100',
  },
  emerald: {
    bg: 'bg-emerald-900',
    border: 'border-emerald-900',
    text: 'text-emerald-950',
    badge: 'bg-emerald-600 text-white',
    accent: 'bg-emerald-100',
  },
  amber: {
    bg: 'bg-amber-800',
    border: 'border-amber-800',
    text: 'text-amber-950',
    badge: 'bg-amber-600 text-white',
    accent: 'bg-amber-100',
  },
  purple: {
    bg: 'bg-purple-900',
    border: 'border-purple-900',
    text: 'text-purple-950',
    badge: 'bg-purple-600 text-white',
    accent: 'bg-purple-100',
  },
  slate: {
    bg: 'bg-slate-900',
    border: 'border-slate-900',
    text: 'text-slate-950',
    badge: 'bg-slate-700 text-white',
    accent: 'bg-slate-200',
  },
  indigo: {
    bg: 'bg-indigo-900',
    border: 'border-indigo-900',
    text: 'text-indigo-950',
    badge: 'bg-indigo-600 text-white',
    accent: 'bg-indigo-100',
  },
  teal: {
    bg: 'bg-teal-900',
    border: 'border-teal-900',
    text: 'text-teal-950',
    badge: 'bg-teal-600 text-white',
    accent: 'bg-teal-100',
  },
  rose: {
    bg: 'bg-pink-900',
    border: 'border-pink-900',
    text: 'text-pink-950',
    badge: 'bg-pink-600 text-white',
    accent: 'bg-pink-100',
  },
  navy: {
    bg: 'bg-blue-950',
    border: 'border-blue-950',
    text: 'text-blue-950',
    badge: 'bg-blue-800 text-white',
    accent: 'bg-blue-100',
  },
};

interface CardRenderData {
  name: string;
  type: string;
  info1: string;
  info2: string;
  info3: string;
  idCode: string;
}

export function IdCardsView({
  students,
  teachers,
  staff,
  signatureDataUrl,
  onSignatureUpload,
  onClearSignature,
}: IdCardsViewProps) {
  const [subTab, setSubTab] = useState<IdCardSubTab>('student');
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');
  const [selectedStudentId, setSelectedStudentId] = useState('ALL');
  const [selectedTeacherId, setSelectedTeacherId] = useState('ALL');
  const [selectedStaffId, setSelectedStaffId] = useState('ALL');
  const [templateKey, setTemplateKey] = useState<IdCardTemplateKey>('ocean');
  const [orientation, setOrientation] =
    useState<IdCardOrientation>('horizontal');
  const [authorityRole, setAuthorityRole] =
    useState<AuthorityRole>('Principal');

  const classStudents = students.filter(
    (s) => s.class === selectedClass && s.status !== 'Graduated'
  );

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setSelectedStudentId('ALL');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        onSignatureUpload(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  let cards: CardRenderData[] = [];
  if (subTab === 'student') {
    const targetList =
      selectedStudentId === 'ALL'
        ? classStudents
        : classStudents.filter((s) => s.id === selectedStudentId);
    cards = targetList.map((s) => ({
      name: s.name,
      type: 'STUDENT IDENTITY CARD',
      info1: `Class: ${s.class}`,
      info2: `Roll: #${s.roll}`,
      info3: `Guardian: ${s.guardian || 'N/A'}`,
      idCode: s.id,
    }));
  } else if (subTab === 'teacher') {
    const targetList =
      selectedTeacherId === 'ALL'
        ? teachers
        : teachers.filter((t) => t.id === selectedTeacherId);
    cards = targetList.map((t) => ({
      name: t.name,
      type: 'TEACHER / FACULTY CARD',
      info1: `Dept: ${t.subject || 'General'}`,
      info2: `Mobile: ${t.mobile || 'N/A'}`,
      info3: 'Role: Senior Faculty',
      idCode: t.id,
    }));
  } else {
    const targetList =
      selectedStaffId === 'ALL'
        ? staff
        : staff.filter((st) => st.id === selectedStaffId);
    cards = targetList.map((st) => ({
      name: st.name,
      type: 'STAFF IDENTITY CARD',
      info1: `Role: ${st.role || 'Staff'}`,
      info2: `Mobile: ${st.mobile || 'N/A'}`,
      info3: 'Dept: Administration',
      idCode: st.id,
    }));
  }

  const theme = COLOR_TEMPLATES[templateKey];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ID Card Engine"
        description="Generate printable identity cards for students, teaching faculty, and administrative staff."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print ID Cards</span>
          </button>
        }
      />

      {/* Submenu + Controls */}
      <div className="no-print space-y-4">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {(
            [
              { id: 'student', label: 'Student ID Cards' },
              { id: 'teacher', label: 'Teacher ID Cards' },
              { id: 'staff', label: 'Staff ID Cards' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                subTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subTab === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Class Level
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Student (Roll No)
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="ALL">All Students in {selectedClass}</option>
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        Roll #{s.roll} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {subTab === 'teacher' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Teacher
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Teachers ({teachers.length})</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject || 'General'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subTab === 'staff' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Staff Member
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Staff Members ({staff.length})</option>
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Color Theme Template
              </label>
              <select
                value={templateKey}
                onChange={(e) =>
                  setTemplateKey(e.target.value as IdCardTemplateKey)
                }
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ocean">1. Ocean Blue Theme</option>
                <option value="crimson">2. Crimson Red Theme</option>
                <option value="emerald">3. Emerald Green Theme</option>
                <option value="amber">4. Golden Amber Theme</option>
                <option value="purple">5. Deep Purple Theme</option>
                <option value="slate">6. Slate Dark Theme</option>
                <option value="indigo">7. Indigo Modern Theme</option>
                <option value="teal">8. Corporate Teal Theme</option>
                <option value="rose">9. Royal Rose Theme</option>
                <option value="navy">10. Midnight Navy Theme</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Card Orientation (2&quot;x3&quot;)
              </label>
              <select
                value={orientation}
                onChange={(e) =>
                  setOrientation(e.target.value as IdCardOrientation)
                }
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="horizontal">Horizontal (3&quot; x 2&quot;)</option>
                <option value="vertical">Vertical (2&quot; x 3&quot;)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Authority Role
              </label>
              <select
                value={authorityRole}
                onChange={(e) =>
                  setAuthorityRole(e.target.value as AuthorityRole)
                }
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Principal">Principal Signature</option>
                <option value="Headmaster">Headmaster Signature</option>
                <option value="Director">Director Signature</option>
                <option value="Vice Principal">Vice Principal Signature</option>
                <option value="Chairman">Chairman Signature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Digital Signature Image
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Signature</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {signatureDataUrl && (
                  <button
                    type="button"
                    onClick={onClearSignature}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Grid */}
      <div className="print-only-full flex flex-wrap gap-6 justify-center bg-slate-100 border border-slate-200 p-6 rounded-xl min-h-[280px]">
        {cards.length === 0 ? (
          <div className="flex items-center justify-center p-10 text-xs font-medium text-slate-500">
            No matching records found to generate ID cards.
          </div>
        ) : (
          cards.map((card) =>
            orientation === 'horizontal' ? (
              <div
                key={card.idCode}
                className={`print-break-inside-avoid w-[324px] h-[204px] bg-white border-2 ${theme.border} rounded-xl shadow-sm flex flex-col justify-between overflow-hidden`}
              >
                <div
                  className={`${theme.bg} text-white px-3 py-2 flex justify-between items-center border-b ${theme.border}`}
                >
                  <div>
                    <h4 className="font-bold text-[11px] tracking-tight leading-none">
                      IKRA SCHOOL & COLLEGE
                    </h4>
                    <p className="text-[9px] text-slate-200 font-medium mt-0.5">
                      {card.type}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${theme.badge}`}
                  >
                    ID
                  </span>
                </div>

                <div className="px-3 py-2 flex gap-3 items-center flex-1">
                  <div
                    className={`w-14 h-14 ${theme.accent} border-2 ${theme.border} rounded-full flex items-center justify-center text-lg font-bold ${theme.text} shrink-0`}
                  >
                    {card.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-0.5 text-[11px] font-semibold text-slate-800 leading-tight min-w-0">
                    <h5 className={`text-xs font-bold ${theme.text} truncate`}>
                      {card.name}
                    </h5>
                    <p className="truncate">{card.info1}</p>
                    <p className="font-mono tabular-nums truncate">
                      {card.info2}
                    </p>
                    <p className="text-[10px] text-slate-600 truncate">
                      {card.info3}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 bg-slate-50 border-t ${theme.border} flex justify-between items-end`}
                >
                  <div className="text-[8px] font-mono text-slate-600">
                    <p>ID: {card.idCode}</p>
                    <p className="text-emerald-700 font-bold">VERIFIED</p>
                  </div>
                  <div className="text-center w-24">
                    {signatureDataUrl ? (
                      <img
                        src={signatureDataUrl}
                        alt="Authority signature"
                        className="h-5 object-contain mx-auto border-b border-slate-700"
                      />
                    ) : (
                      <div className="h-4 border-b border-dashed border-slate-500" />
                    )}
                    <p className="text-[8px] font-bold text-slate-800 uppercase tracking-tight mt-0.5">
                      {authorityRole}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={card.idCode}
                className={`print-break-inside-avoid w-[204px] h-[324px] bg-white border-2 ${theme.border} rounded-xl shadow-sm flex flex-col justify-between overflow-hidden`}
              >
                <div
                  className={`${theme.bg} text-white p-2.5 text-center border-b ${theme.border}`}
                >
                  <h4 className="font-bold text-[10px] leading-tight">
                    IKRA SCHOOL & COLLEGE
                  </h4>
                  <p className="text-[8px] text-slate-200 font-medium uppercase tracking-tight mt-0.5">
                    {card.type}
                  </p>
                </div>

                <div className="p-3 flex flex-col items-center text-center space-y-2 flex-1 justify-center">
                  <div
                    className={`w-16 h-16 ${theme.accent} border-2 ${theme.border} rounded-full flex items-center justify-center text-xl font-bold ${theme.text}`}
                  >
                    {card.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="w-full min-w-0">
                    <h5 className={`text-xs font-bold ${theme.text} truncate`}>
                      {card.name}
                    </h5>
                    <p className="text-[10px] font-semibold text-slate-800 leading-tight mt-1">
                      {card.info1}
                    </p>
                    <p className="text-[10px] font-mono tabular-nums font-semibold text-slate-800 leading-tight mt-0.5">
                      {card.info2}
                    </p>
                    <p className="text-[9px] text-slate-600 mt-0.5 truncate">
                      {card.info3}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-2 bg-slate-50 border-t ${theme.border} flex justify-between items-end`}
                >
                  <div className="text-[8px] font-mono text-slate-600 text-left">
                    <p>ID: {card.idCode}</p>
                    <p className="text-emerald-700 font-bold">VERIFIED</p>
                  </div>
                  <div className="text-center w-20">
                    {signatureDataUrl ? (
                      <img
                        src={signatureDataUrl}
                        alt="Authority signature"
                        className="h-5 object-contain mx-auto border-b border-slate-700"
                      />
                    ) : (
                      <div className="h-4 border-b border-dashed border-slate-500" />
                    )}
                    <p className="text-[7px] font-bold text-slate-800 uppercase mt-0.5">
                      {authorityRole}
                    </p>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
