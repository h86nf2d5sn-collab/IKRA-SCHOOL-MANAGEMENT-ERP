import { useState, FormEvent } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/defaults';
import { ClassSubjectsMap, SubjectItem } from '../../types/erp';
import { PageHeader } from '../PageHeader';

interface SubjectsViewProps {
  classSubjects: ClassSubjectsMap;
  onAddSubject: (className: string, subject: SubjectItem) => void;
  onDeleteSubject: (className: string, index: number) => void;
}

export function SubjectsView({
  classSubjects,
  onAddSubject,
  onDeleteSubject,
}: SubjectsViewProps) {
  const [selectedClass, setSelectedClass] = useState('Class 9 Science Group');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('Compulsory');

  const subjects = classSubjects[selectedClass] || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const title = subjectTitle.trim();
    if (!title) return;
    onAddSubject(selectedClass, { name: title, group: subjectGroup });
    setSubjectTitle('');
    setSubjectGroup('Compulsory');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class-Wise Subject Setup"
        description="Define compulsory and elective subjects for each academic grade and stream."
        actions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subject</span>
          </button>
        }
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="subject-class-select"
              className="text-xs font-semibold text-slate-700 whitespace-nowrap"
            >
              Select Class Level
            </label>
            <select
              id="subject-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {AVAILABLE_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {subjects.length} subjects configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-16">#</th>
                <th className="py-3 px-4">Subject Title</th>
                <th className="py-3 px-4">Group / Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No subjects configured for {selectedClass}. Click "Add New Subject" to begin.
                  </td>
                </tr>
              ) : (
                subjects.map((sub, idx) => (
                  <tr
                    key={`${sub.name}-${idx}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{sub.group}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteSubject(selectedClass, idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Add New Subject
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Class Level
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedClass}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  placeholder="e.g. Agricultural Science"
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Group / Type *
                </label>
                <select
                  value={subjectGroup}
                  onChange={(e) => setSubjectGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Compulsory">Compulsory</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                  <option value="Optional">Optional / Elective</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
