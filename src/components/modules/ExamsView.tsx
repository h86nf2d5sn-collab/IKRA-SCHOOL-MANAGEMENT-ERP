import { useState, useEffect, useMemo, FormEvent } from 'react';
import { FileText, ListPlus, Plus, Printer, Trash2, X } from 'lucide-react';
import { AVAILABLE_CLASSES, EXAM_TERMS } from '../../data/defaults';
import { ClassSubjectsMap, ExamMark, Student } from '../../types/erp';
import { calculateOverallGPA, calculateSubjectGP } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface ExamsViewProps {
  students: Student[];
  classSubjects: ClassSubjectsMap;
  examMarks: ExamMark[];
  signatureDataUrl: string;
  onSaveMarksheet: (
    term: string,
    cls: string,
    student: Student,
    rows: { subject: string; written: number; mcq: number }[]
  ) => void;
}

interface SubjectRowDraft {
  id: string;
  subject: string;
  written: number;
  mcq: number;
}

const GRADING_SCALE = [
  { range: '80% – 100%', grade: 'A+', gpa: '5.00', label: 'Outstanding', cls: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { range: '70% – 79%', grade: 'A', gpa: '4.00', label: 'Excellent', cls: 'bg-emerald-50/50 border-emerald-200 text-emerald-800' },
  { range: '60% – 69%', grade: 'A-', gpa: '3.50', label: 'Very Good', cls: 'bg-blue-50 border-blue-200 text-blue-900' },
  { range: '50% – 59%', grade: 'B', gpa: '3.00', label: 'Good', cls: 'bg-blue-50/50 border-blue-200 text-blue-800' },
  { range: '40% – 49%', grade: 'C', gpa: '2.00', label: 'Satisfactory', cls: 'bg-amber-50 border-amber-200 text-amber-900' },
  { range: '33% – 39%', grade: 'D', gpa: '1.00', label: 'Passing', cls: 'bg-orange-50 border-orange-200 text-orange-900' },
  { range: 'Below 33%', grade: 'F', gpa: '0.00', label: 'Retained', cls: 'bg-rose-50 border-rose-200 text-rose-900' },
];

export function ExamsView({
  students,
  classSubjects,
  examMarks,
  signatureDataUrl,
  onSaveMarksheet,
}: ExamsViewProps) {
  const [term, setTerm] = useState('Final Term Exam');
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [rows, setRows] = useState<SubjectRowDraft[]>([]);
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);

  const classStudents = useMemo(
    () =>
      students.filter(
        (s) => s.class === selectedClass && s.status !== 'Graduated'
      ),
    [students, selectedClass]
  );

  const availableSubjects = useMemo(() => {
    const subs = classSubjects[selectedClass];
    if (subs && subs.length > 0) return subs.map((s) => s.name);
    return ['Bangla 1st Paper', 'English 1st Paper', 'General Mathematics'];
  }, [classSubjects, selectedClass]);

  // Ensure selected student stays valid when class changes
  useEffect(() => {
    if (
      classStudents.length > 0 &&
      !classStudents.some((s) => s.id === selectedStudentId)
    ) {
      setSelectedStudentId(classStudents[0].id);
    } else if (classStudents.length === 0) {
      setSelectedStudentId('');
    }
  }, [classStudents, selectedStudentId]);

  // Pre-load saved marks for selected student + term, or default single row
  useEffect(() => {
    if (!selectedStudentId) {
      setRows([
        {
          id: 'draft-1',
          subject: availableSubjects[0] || 'General Mathematics',
          written: 55,
          mcq: 25,
        },
      ]);
      return;
    }

    const existing = examMarks.filter(
      (m) => m.stuId === selectedStudentId && m.term === term
    );
    if (existing.length > 0) {
      setRows(
        existing.map((m, idx) => ({
          id: `existing-${idx}-${m.id}`,
          subject: m.subject,
          written: m.written,
          mcq: m.mcq,
        }))
      );
    } else {
      setRows([
        {
          id: `draft-${Date.now()}`,
          subject: availableSubjects[0] || 'General Mathematics',
          written: 55,
          mcq: 25,
        },
      ]);
    }
  }, [selectedStudentId, term, examMarks, availableSubjects]);

  const addRow = () => {
    const used = new Set(rows.map((r) => r.subject));
    const nextSubject =
      availableSubjects.find((s) => !used.has(s)) || availableSubjects[0];
    setRows((prev) => [
      ...prev,
      {
        id: `draft-${Date.now()}-${Math.random()}`,
        subject: nextSubject,
        written: 55,
        mcq: 25,
      },
    ]);
  };

  const loadAllClassSubjects = () => {
    setRows(
      availableSubjects.map((sub, idx) => {
        const existing = rows.find((r) => r.subject === sub);
        return {
          id: `all-${idx}-${Date.now()}`,
          subject: sub,
          written: existing ? existing.written : 55,
          mcq: existing ? existing.mcq : 25,
        };
      })
    );
  };

  const updateRow = (
    id: string,
    field: 'subject' | 'written' | 'mcq',
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student || rows.length === 0) return;
    onSaveMarksheet(
      term,
      selectedClass,
      student,
      rows.map((r) => ({
        subject: r.subject,
        written: Number(r.written) || 0,
        mcq: Number(r.mcq) || 0,
      }))
    );
  };

  // Compute Leaderboard for selectedClass + term
  const leaderboard = useMemo(() => {
    const filteredMarks = examMarks.filter(
      (m) => (m.cls === selectedClass || !m.cls) && m.term === term
    );

    const byStudent: Record<
      string,
      { stuId: string; name: string; roll: string; subjects: ExamMark[] }
    > = {};

    filteredMarks.forEach((m) => {
      if (!byStudent[m.stuId]) {
        const studentObj = students.find((s) => s.id === m.stuId);
        byStudent[m.stuId] = {
          stuId: m.stuId,
          name: studentObj?.name || m.studentName || 'Student',
          roll: studentObj?.roll || m.roll || '-',
          subjects: [],
        };
      }
      byStudent[m.stuId].subjects.push(m);
    });

    return Object.values(byStudent)
      .map((stu) => {
        const res = calculateOverallGPA(stu.subjects);
        return {
          stuId: stu.stuId,
          name: stu.name,
          roll: stu.roll,
          totalMarks: res.totalMarks,
          gpa: res.gpa,
          grade: res.grade,
          subjects: stu.subjects,
        };
      })
      .sort((a, b) => {
        if (parseFloat(b.gpa) !== parseFloat(a.gpa)) {
          return parseFloat(b.gpa) - parseFloat(a.gpa);
        }
        return b.totalMarks - a.totalMarks;
      });
  }, [examMarks, selectedClass, term, students]);

  const previewEntry = previewStudentId
    ? leaderboard.find((l) => l.stuId === previewStudentId) || null
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam & Marksheet Engine"
        description="Record term marks (Written + MCQ) across subjects with automated 5.00 GPA calculation and academic transcripts."
      />

      {/* Grading Scale Reference */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Subject Marks Standard & Grading Scale Reference (5.00 GPA Scale)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {GRADING_SCALE.map((g) => (
            <div key={g.grade} className={`border rounded-lg p-2 ${g.cls}`}>
              <span className="block font-mono tabular-nums font-semibold text-[11px]">
                {g.range}
              </span>
              <span className="block text-sm font-bold font-mono tabular-nums mt-0.5">
                {g.grade} ({g.gpa})
              </span>
              <span className="block text-[10px] opacity-80 mt-0.5">
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marks Entry Form */}
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 space-y-4 self-start">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">
            Record Marks Entry
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Examination Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {EXAM_TERMS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

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
                Student (Roll No)
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

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Subject Marks (W 70 + MCQ 30)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadAllClassSubjects}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-blue-700 whitespace-nowrap"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Load All</span>
                  </button>
                  <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {rows.map((row) => {
                  const total =
                    (Number(row.written) || 0) + (Number(row.mcq) || 0);
                  const { gp, grade } = calculateSubjectGP(total);
                  return (
                    <div
                      key={row.id}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <select
                          value={row.subject}
                          onChange={(e) =>
                            updateRow(row.id, 'subject', e.target.value)
                          }
                          className="flex-1 min-w-0 px-2 py-1.5 border border-slate-300 bg-white rounded text-xs font-medium text-slate-900 focus:outline-none"
                        >
                          {availableSubjects.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                          {!availableSubjects.includes(row.subject) && (
                            <option value={row.subject}>{row.subject}</option>
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          aria-label="Remove subject row"
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 flex-1">
                          <span className="text-[10px] font-semibold text-slate-500">
                            W
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={row.written}
                            onChange={(e) =>
                              updateRow(
                                row.id,
                                'written',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2 py-1 border border-slate-300 bg-white rounded text-xs font-mono tabular-nums text-center text-slate-900"
                          />
                        </div>
                        <div className="flex items-center gap-1 flex-1">
                          <span className="text-[10px] font-semibold text-slate-500">
                            MCQ
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={row.mcq}
                            onChange={(e) =>
                              updateRow(
                                row.id,
                                'mcq',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2 py-1 border border-slate-300 bg-white rounded text-xs font-mono tabular-nums text-center text-slate-900"
                          />
                        </div>
                        <span
                          className={`text-[11px] font-mono tabular-nums font-bold px-2 py-1 rounded border min-w-[68px] text-center ${
                            grade === 'F'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {grade} ({gp.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedStudentId || rows.length === 0}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Save Student Marksheet
            </button>
          </form>
        </div>

        {/* Merit Leaderboard */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden self-start">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Class Academic Merit Leaderboard
            </h3>
            <span className="text-xs font-medium text-slate-600">
              {selectedClass} · {term}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Total Marks</th>
                  <th className="py-3 px-4 text-center">GPA</th>
                  <th className="py-3 px-4 text-center">Overall Grade</th>
                  <th className="py-3 px-4 text-right">Marksheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No exam marks recorded for {selectedClass} ({term}).
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((item, idx) => {
                    const passed = item.grade !== 'F';
                    return (
                      <tr
                        key={item.stuId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                          {item.roll}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-slate-900">
                          {item.totalMarks}
                        </td>
                        <td
                          className={`py-3 px-4 text-center font-mono tabular-nums font-bold ${
                            passed ? 'text-blue-700' : 'text-rose-700'
                          }`}
                        >
                          {item.gpa}
                        </td>
                        <td
                          className={`py-3 px-4 text-center font-mono tabular-nums font-bold ${
                            passed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.grade} ({item.gpa})
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setPreviewStudentId(item.stuId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Transcript</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable Student Transcript Modal */}
      {previewEntry && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="print-only-full bg-white border border-slate-300 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Academic Transcript Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Marksheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewStudentId(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Academic Transcript · {term}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500">Student Name:</span>{' '}
                <strong className="text-slate-900">{previewEntry.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Class:</span>{' '}
                <strong className="text-slate-900">{selectedClass}</strong>
              </div>
              <div>
                <span className="text-slate-500">Roll No:</span>{' '}
                <strong className="font-mono text-slate-900">
                  {previewEntry.roll}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Result GPA:</span>{' '}
                <strong
                  className={`font-mono ${
                    previewEntry.grade === 'F'
                      ? 'text-rose-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {previewEntry.gpa} ({previewEntry.grade})
                </strong>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <th className="py-2.5 px-3 border-r border-slate-300">
                    Subject
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">
                    Written
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">
                    MCQ
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">
                    Total
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">
                    Grade
                  </th>
                  <th className="py-2.5 px-3 text-center">GP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewEntry.subjects.map((sub) => {
                  const { gp, grade } = calculateSubjectGP(sub.total);
                  return (
                    <tr key={sub.id}>
                      <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900">
                        {sub.subject}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono tabular-nums">
                        {sub.written}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono tabular-nums">
                        {sub.mcq}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono tabular-nums font-bold">
                        {sub.total}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono font-bold">
                        {grade}
                      </td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums">
                        {gp.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-900 font-bold">
                  <td colSpan={3} className="py-2.5 px-3 text-right">
                    Total Obtained Marks
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                    {previewEntry.totalMarks}
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-center font-mono">
                    GPA {previewEntry.gpa} · {previewEntry.grade}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-between items-end pt-10 text-xs font-semibold text-slate-800">
              <div className="text-center border-t border-slate-800 pt-1.5 w-36">
                Exam Controller
              </div>
              <div className="text-center w-36">
                {signatureDataUrl && (
                  <img
                    src={signatureDataUrl}
                    alt="Principal signature"
                    className="h-7 object-contain mx-auto mb-1"
                  />
                )}
                <div className="border-t border-slate-800 pt-1.5">
                  Principal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
