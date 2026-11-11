import { useState, useEffect, useMemo } from 'react';
import { Rocket, Zap } from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/defaults';
import { ExamMark, PromotionCriteria, Student } from '../../types/erp';
import { calculateStudentGPA, getNextLogicalClass } from '../../utils/erpHelpers';
import { PageHeader } from '../PageHeader';

interface PromotionViewProps {
  students: Student[];
  examMarks: ExamMark[];
  onBatchPromote: (studentIds: string[], targetClass: string, sourceClass: string) => void;
  onGlobalPromote: () => void;
}

export function PromotionView({
  students,
  examMarks,
  onBatchPromote,
  onGlobalPromote,
}: PromotionViewProps) {
  const [sourceClass, setSourceClass] = useState('Class 9 Science Group');
  const [targetClass, setTargetClass] = useState(
    getNextLogicalClass('Class 9 Science Group')
  );
  const [criteria, setCriteria] = useState<PromotionCriteria>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const classStudents = useMemo(
    () =>
      students.filter(
        (s) => s.class === sourceClass && s.status !== 'Graduated'
      ),
    [students, sourceClass]
  );

  const evaluations = useMemo(() => {
    return classStudents.map((s) => {
      const gpa = calculateStudentGPA(examMarks, s.id);
      let eligible = true;
      let reason = 'Auto Promoted';

      if (criteria === 'GPA_PASS') {
        eligible = gpa >= 1.0;
        reason = eligible ? 'Passed (GPA >= 1.00)' : 'Retained (GPA < 1.00)';
      } else if (criteria === 'MERIT_TOP') {
        eligible = gpa >= 3.5;
        reason = eligible ? 'Merit Qualified (GPA >= 3.50)' : 'Below Merit Threshold';
      } else if (criteria === 'MANUAL') {
        eligible = false;
        reason = 'Manual Selection';
      }

      return { student: s, gpa, eligible, reason };
    });
  }, [classStudents, examMarks, criteria]);

  // Sync Target Class when Source Class changes
  const handleSourceClassChange = (newSrc: string) => {
    setSourceClass(newSrc);
    setTargetClass(getNextLogicalClass(newSrc));
  };

  // Recompute default checked rows whenever class or criteria changes
  useEffect(() => {
    if (criteria === 'MANUAL') {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        evaluations.filter((e) => e.eligible).map((e) => e.student.id)
      );
    }
  }, [evaluations, criteria]);

  const allChecked =
    classStudents.length > 0 && selectedIds.length === classStudents.length;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(classStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSingle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const promotionRate =
    classStudents.length > 0
      ? Math.round((selectedIds.length / classStudents.length) * 100)
      : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auto Progress & Class Promotion Engine"
        description="Automated class progression driven by exam GPA thresholds, merit rules, and target stream mapping."
        actions={
          <button
            type="button"
            onClick={onGlobalPromote}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Run Global Auto-Engine (All Classes)</span>
          </button>
        }
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="promo-source"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Source Class (From)
            </label>
            <select
              id="promo-source"
              value={sourceClass}
              onChange={(e) => handleSourceClassChange(e.target.value)}
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
            <label
              htmlFor="promo-target"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Target Class (Promote To)
            </label>
            <select
              id="promo-target"
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {AVAILABLE_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Graduated">Graduated Alumnus</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="promo-criteria"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Auto-Engine Evaluation Mode
            </label>
            <select
              id="promo-criteria"
              value={criteria}
              onChange={(e) =>
                setCriteria(e.target.value as PromotionCriteria)
              }
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Promote All Active Students (Default)</option>
              <option value="GPA_PASS">Promote Only Passed (GPA ≥ 1.00)</option>
              <option value="MERIT_TOP">Promote Top Performers (GPA ≥ 3.50)</option>
              <option value="MANUAL">Manual Student Selection</option>
            </select>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-mono tabular-nums">
            <span>
              Selected to Promote:{' '}
              <strong className="text-slate-900">
                {selectedIds.length} / {classStudents.length}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Promotion Rate:{' '}
              <strong className="text-slate-900">{promotionRate}%</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onBatchPromote(selectedIds, targetClass, sourceClass)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Execute Batch Promotion</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all students"
                    checked={allChecked}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-blue-700"
                  />
                </th>
                <th className="py-3 px-4">Current Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Current Class</th>
                <th className="py-3 px-4">Target Class</th>
                <th className="py-3 px-4 text-center">Exam GPA</th>
                <th className="py-3 px-4 text-right">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No active students found in {sourceClass} for promotion.
                  </td>
                </tr>
              ) : (
                evaluations.map(({ student, gpa, eligible, reason }) => {
                  const isChecked = selectedIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSingle(student.id)}
                          aria-label={`Select ${student.name}`}
                          className="w-4 h-4 cursor-pointer accent-blue-700"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                        {student.roll}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {student.class}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">
                        {targetClass}
                      </td>
                      <td
                        className={`py-3 px-4 text-center font-mono tabular-nums font-bold ${
                          gpa >= 1 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        <span
                          className={
                            eligible || isChecked
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }
                        >
                          {isChecked ? 'Selected for Promotion' : reason}
                        </span>
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
  );
}
