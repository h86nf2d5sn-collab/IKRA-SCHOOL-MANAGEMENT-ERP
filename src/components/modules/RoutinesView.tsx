import { useState, FormEvent } from 'react';
import { Plus, Printer, Trash2, X } from 'lucide-react';
import {
  AVAILABLE_CLASSES,
  DEFAULT_DAILY_PERIODS,
  ROUTINE_DAYS,
} from '../../data/defaults';
import { ClassSubjectsMap, RoutineSlot, Teacher } from '../../types/erp';
import { PageHeader } from '../PageHeader';

interface RoutinesViewProps {
  routineSlots: RoutineSlot[];
  teachers: Teacher[];
  classSubjects: ClassSubjectsMap;
  onSaveSlot: (slot: RoutineSlot) => void;
  onClearSlot: (className: string, day: string, period: number) => void;
}

export function RoutinesView({
  routineSlots,
  teachers,
  classSubjects,
  onSaveSlot,
  onClearSlot,
}: RoutinesViewProps) {
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');
  const [modalSlot, setModalSlot] = useState<{
    day: string;
    period: number;
    timeLabel: string;
    subject: string;
    teacher: string;
    hasExisting: boolean;
  } | null>(null);

  const openCellModal = (day: string, period: number, defaultTime: string) => {
    const existing = routineSlots.find(
      (r) =>
        r.className === selectedClass &&
        r.day === day &&
        (r.period === period || r.time === `Period ${period} (${defaultTime})`)
    );
    setModalSlot({
      day,
      period,
      timeLabel: `Period ${period} (${defaultTime})`,
      subject: existing?.subject || '',
      teacher: existing?.teacher || teachers[0]?.name || 'Unassigned',
      hasExisting: Boolean(existing),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!modalSlot || !modalSlot.subject.trim()) return;
    onSaveSlot({
      className: selectedClass,
      day: modalSlot.day,
      period: modalSlot.period,
      time: modalSlot.timeLabel,
      subject: modalSlot.subject.trim(),
      teacher: modalSlot.teacher,
    });
    setModalSlot(null);
  };

  const handleClear = () => {
    if (!modalSlot) return;
    onClearSlot(selectedClass, modalSlot.day, modalSlot.period);
    setModalSlot(null);
  };

  const quickSubjects = classSubjects[selectedClass] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Class Routines Grid"
        description="Interactive Sunday to Thursday timetable. Click any period cell to assign a subject and teacher."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </button>
        }
      />

      <div className="print-only-full bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="routine-class-select"
              className="text-xs font-semibold text-slate-700 whitespace-nowrap"
            >
              Target Class
            </label>
            <select
              id="routine-class-select"
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

          <span className="text-xs text-slate-500">
            6 Periods Daily · Sunday – Thursday
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-center">
                <th className="py-3 px-3 border-r border-slate-700 w-28 font-semibold">
                  Day / Period
                </th>
                {DEFAULT_DAILY_PERIODS.map((p) => (
                  <th
                    key={p.period}
                    className="py-2.5 px-3 border-r border-slate-700 last:border-none min-w-[140px]"
                  >
                    <div className="font-semibold">Period {p.period}</div>
                    <div className="text-[10px] font-mono text-slate-300 mt-0.5">
                      {p.time}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROUTINE_DAYS.map((day) => (
                <tr key={day} className="hover:bg-slate-50/40">
                  <td className="py-3 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200 text-center">
                    {day}
                  </td>
                  {DEFAULT_DAILY_PERIODS.map((p) => {
                    const slot = routineSlots.find(
                      (r) =>
                        r.className === selectedClass &&
                        r.day === day &&
                        (r.period === p.period || r.time === p.time)
                    );
                    return (
                      <td
                        key={`${day}-${p.period}`}
                        onClick={() => openCellModal(day, p.period, p.time)}
                        className="p-2 border-r border-slate-200 last:border-none cursor-pointer align-top hover:bg-blue-50/50 transition-colors"
                      >
                        {slot ? (
                          <div className="bg-white border border-blue-200 rounded-lg p-2.5 text-center shadow-xs hover:border-blue-400 transition-colors">
                            <p className="font-semibold text-slate-900 text-xs leading-snug">
                              {slot.subject}
                            </p>
                            <p className="text-[11px] text-slate-600 mt-1 pt-1 border-t border-slate-100 truncate">
                              {slot.teacher || 'Unassigned'}
                            </p>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-lg py-3 px-2 text-center text-slate-400 hover:border-blue-500 hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
                            <Plus className="w-3 h-3" />
                            <span>Assign</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Edit Modal */}
      {modalSlot && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Set Routine: {selectedClass}
              </h3>
              <button
                type="button"
                onClick={() => setModalSlot(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day of Week
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={modalSlot.day}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Period & Timing
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={modalSlot.timeLabel}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  list="routine-subject-suggestions"
                  value={modalSlot.subject}
                  onChange={(e) =>
                    setModalSlot({ ...modalSlot, subject: e.target.value })
                  }
                  placeholder="e.g. Higher Mathematics"
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <datalist id="routine-subject-suggestions">
                  {quickSubjects.map((sub, i) => (
                    <option key={`${sub.name}-${i}`} value={sub.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Teacher *
                </label>
                <select
                  value={modalSlot.teacher}
                  onChange={(e) =>
                    setModalSlot({ ...modalSlot, teacher: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {teachers.length === 0 ? (
                    <option value="Unassigned">No Teachers Registered</option>
                  ) : (
                    teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.subject || 'General'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {modalSlot.hasExisting ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Slot</span>
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalSlot(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Save Slot
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
