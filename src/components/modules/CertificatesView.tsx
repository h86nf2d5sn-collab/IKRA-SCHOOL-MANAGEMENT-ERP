import { useState } from 'react';
import { Printer } from 'lucide-react';
import {
  CertificateTemplateKey,
  CertificateType,
  Student,
} from '../../types/erp';
import { PageHeader } from '../PageHeader';

interface CertificatesViewProps {
  students: Student[];
  signatureDataUrl: string;
}

export function CertificatesView({
  students,
  signatureDataUrl,
}: CertificatesViewProps) {
  const [certType, setCertType] = useState<CertificateType>('Testimonial');
  const [templateKey, setTemplateKey] =
    useState<CertificateTemplateKey>('classic');
  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || ''
  );
  const [issueDate, setIssueDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );

  const stu =
    students.find((s) => s.id === selectedStudentId) ||
    students[0] || {
      id: 'STU-SAMPLE',
      name: 'Abdullah Al Mamun',
      class: '10th Class Science Group',
      roll: '1',
      guardian: 'Abdul Karim',
      dept: 'Science',
      mobile: '',
      homeAddr: '',
      status: 'Active' as const,
    };

  const renderSignature = (darkText = true) =>
    signatureDataUrl ? (
      <img
        src={signatureDataUrl}
        alt="Principal signature"
        className={`h-8 object-contain mx-auto border-b ${
          darkText ? 'border-slate-900' : 'border-cyan-400'
        }`}
      />
    ) : (
      <div
        className={`h-6 border-b border-dashed ${
          darkText ? 'border-slate-700' : 'border-cyan-400'
        }`}
      />
    );

  const renderBodyCopy = (highlightClass: string, subHighlightClass: string) => (
    <>
      This is to certify that{' '}
      <strong className={`${highlightClass} underline`}>{stu.name}</strong>,
      son/daughter of{' '}
      <strong className={subHighlightClass}>{stu.guardian || 'N/A'}</strong>,
      was a bona fide student of{' '}
      <strong className={highlightClass}>{stu.class}</strong> (Roll No.{' '}
      <strong className={subHighlightClass}>{stu.roll}</strong>). During their
      academic tenure at this institution, their conduct, discipline, and moral
      character were observed to be exemplary. We wish them bright success in
      all future endeavors.
    </>
  );

  const renderTemplate = () => {
    switch (templateKey) {
      case 'royalgold':
        return (
          <div className="p-8 border-[12px] border-amber-600 bg-amber-50/40 font-serif text-slate-900">
            <div className="border-2 border-amber-500 p-6 space-y-5 text-center">
              <div className="space-y-1">
                <span className="text-amber-700 font-bold uppercase tracking-widest text-xs">
                  Excellence in Education
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-950 tracking-tight font-serif">
                  IKRA SCHOOL & COLLEGE
                </h2>
                <p className="text-xs font-semibold text-amber-800 italic">
                  Established for Academic Distinction
                </p>
              </div>
              <div className="py-2">
                <span className="bg-amber-600 text-white font-bold px-6 py-1.5 rounded text-xs uppercase tracking-widest border border-amber-800">
                  {certType}
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xl mx-auto pt-2 text-slate-800">
                {renderBodyCopy('text-amber-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Date of Issue: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-10 text-xs font-bold text-slate-800">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-dashed border-slate-700" />
                  <span className="text-[10px] uppercase tracking-wider text-amber-900 mt-1 block">
                    Prepared By
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-amber-600 flex items-center justify-center text-[9px] font-black text-amber-800 uppercase bg-amber-100/80">
                  SEAL
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] uppercase tracking-wider text-amber-900 mt-1 block">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'emerald':
        return (
          <div className="p-8 border-4 border-emerald-700 bg-emerald-50/30 text-slate-900">
            <div className="border-2 border-emerald-500 p-6 space-y-5 text-center rounded-lg">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                  IKRA SCHOOL & COLLEGE
                </h2>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Official Academic Certification
                </p>
              </div>
              <div className="py-2">
                <span className="bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-wider">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed max-w-xl mx-auto pt-2">
                {renderBodyCopy('text-emerald-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Issued: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-800">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-dashed border-emerald-800" />
                  <span className="text-[10px] text-emerald-900 mt-1 block">
                    Registrar
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] text-emerald-900 mt-1 block">
                    Principal Signature
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'crimson':
        return (
          <div className="p-8 border-8 border-rose-900 bg-rose-50/40 font-serif text-slate-900">
            <div className="border-2 border-rose-700 p-6 space-y-5 text-center">
              <h2 className="text-3xl font-extrabold text-rose-950 tracking-wider font-serif">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-widest">
                Heritage of Academic Honor
              </p>
              <div className="py-2">
                <span className="bg-rose-900 text-white font-bold px-6 py-2 rounded text-xs uppercase tracking-widest border border-slate-900">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-xl mx-auto pt-2">
                {renderBodyCopy('text-rose-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Date: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-800">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-dashed border-rose-900" />
                  <span className="text-[10px] text-rose-950 mt-1 block">
                    Section Supervisor
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] text-rose-950 mt-1 block">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sapphire':
        return (
          <div className="p-8 border-4 border-indigo-900 bg-indigo-50/40 text-slate-900">
            <div className="border-b-4 border-indigo-900 pb-4 text-center">
              <h2 className="text-3xl font-extrabold text-indigo-950 tracking-tight">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mt-0.5">
                Sapphire Academic Certificate
              </p>
            </div>
            <div className="py-5 text-center">
              <span className="bg-indigo-950 text-white font-bold px-6 py-2 rounded text-xs uppercase tracking-widest">
                {certType}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed max-w-xl mx-auto text-center">
              {renderBodyCopy('text-indigo-950 font-bold', 'text-slate-900 font-bold')}
            </p>
            <p className="text-xs font-mono text-slate-600 text-center mt-4">
              Issue Date: {issueDate}
            </p>
            <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-800">
              <div className="text-center w-36">
                <div className="h-6 border-b border-indigo-900" />
                <span className="text-[10px] text-indigo-950 mt-1 block">
                  Exam Controller
                </span>
              </div>
              <div className="text-center w-36">
                {renderSignature(true)}
                <span className="text-[10px] text-indigo-950 mt-1 block">
                  Principal
                </span>
              </div>
            </div>
          </div>
        );

      case 'vintage':
        return (
          <div className="p-8 border-8 border-amber-900 bg-yellow-50/60 font-serif text-slate-900">
            <div className="border border-amber-900 p-6 text-center space-y-5">
              <h2 className="text-3xl font-bold tracking-widest text-amber-950 uppercase font-serif">
                Ikra School & College
              </h2>
              <p className="text-xs font-semibold italic text-amber-900">
                Certificate of Educational Record
              </p>
              <div className="py-2">
                <span className="border-2 border-amber-900 px-6 py-1.5 text-xs font-bold uppercase text-amber-950 tracking-widest">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed max-w-xl mx-auto">
                {renderBodyCopy('text-amber-950 font-bold', 'font-bold')}
              </p>
              <p className="text-xs font-mono text-amber-900">
                Recorded on {issueDate}
              </p>
              <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-900">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-amber-950" />
                  <span className="text-[10px] uppercase mt-1 block">
                    Headmaster
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] uppercase mt-1 block">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="p-8 border-2 border-slate-900 bg-white text-slate-900">
            <div className="space-y-5 text-left">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-950 uppercase tracking-tight">
                    IKRA SCHOOL & COLLEGE
                  </h2>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                    Standard Educational Document
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-slate-900 border border-slate-900 px-3 py-1">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed pt-3">
                {renderBodyCopy('text-slate-950 font-bold', 'font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Issue Date: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-14 text-xs font-bold text-slate-950">
                <div className="text-left w-36">
                  <div className="h-5 border-b border-slate-900" />
                  <span className="text-[9px] uppercase mt-1 block font-bold">
                    Authorized Sign
                  </span>
                </div>
                <div className="text-right w-36">
                  {renderSignature(true)}
                  <span className="text-[9px] uppercase mt-1 block font-bold">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sunset':
        return (
          <div className="p-8 border-4 border-orange-600 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 text-slate-900">
            <div className="border-2 border-orange-400 p-6 space-y-5 text-center rounded-xl">
              <h2 className="text-3xl font-extrabold text-orange-950 tracking-tight">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Academic Achievement & Conduct
              </p>
              <div className="py-1">
                <span className="bg-gradient-to-r from-orange-600 to-rose-600 text-white font-bold px-6 py-2 rounded text-xs uppercase tracking-widest">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed max-w-xl mx-auto pt-2">
                {renderBodyCopy('text-orange-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-orange-900">
                Issued: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-800">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-orange-600" />
                  <span className="text-[10px] text-orange-950 mt-1 block">
                    Vice Principal
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] text-orange-950 mt-1 block">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'crest':
        return (
          <div className="p-8 border-8 border-blue-950 bg-blue-50/20 text-slate-900">
            <div className="border-2 border-blue-800 p-6 text-center space-y-5">
              <div className="w-16 h-16 mx-auto bg-blue-950 text-white font-extrabold rounded-full flex items-center justify-center text-base border-2 border-amber-400">
                IKRA
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight">
                  IKRA SCHOOL & COLLEGE
                </h2>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mt-0.5">
                  Academic Honor & Achievement
                </p>
              </div>
              <div className="py-1">
                <span className="bg-blue-950 text-amber-300 font-bold px-6 py-2 rounded-md text-xs uppercase tracking-widest border border-amber-400">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed max-w-xl mx-auto pt-2">
                {renderBodyCopy('text-blue-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Date: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-10 text-xs font-bold text-slate-800">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-blue-950" />
                  <span className="text-[10px] text-blue-950 mt-1 block">
                    Dean of Affairs
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <span className="text-[10px] text-blue-950 mt-1 block">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cyber':
        return (
          <div className="p-8 border-4 border-cyan-600 bg-slate-900 text-white rounded-xl">
            <div className="border border-cyan-400 p-6 text-center space-y-5 rounded-lg bg-slate-950/60">
              <h2 className="text-3xl font-extrabold text-cyan-400 tracking-wider uppercase">
                IKRA SCHOOL & COLLEGE
              </h2>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Digital Academic Transcript Certificate
              </p>
              <div className="py-2">
                <span className="bg-cyan-500 text-slate-950 font-bold px-6 py-2 rounded text-xs uppercase tracking-widest">
                  {certType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed max-w-xl mx-auto pt-2">
                {renderBodyCopy('text-cyan-300 font-bold', 'text-white font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-400">
                Issued: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-12 text-xs font-bold text-slate-300">
                <div className="text-center w-36">
                  <div className="h-6 border-b border-cyan-400" />
                  <span className="text-[10px] text-cyan-400 mt-1 block uppercase">
                    Registrar
                  </span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(false)}
                  <span className="text-[10px] text-cyan-400 mt-1 block uppercase">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'classic':
      default:
        return (
          <div className="p-8 border-4 border-slate-900 bg-white rounded-xl space-y-6">
            <div className="text-center space-y-4">
              <div className="border-b-4 border-blue-950 pb-4">
                <h2 className="text-3xl font-extrabold text-blue-950 tracking-wider">
                  IKRA SCHOOL & COLLEGE
                </h2>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">
                  Official Institutional Certificate
                </p>
              </div>
              <div className="py-3">
                <span className="bg-blue-950 text-white font-bold px-6 py-2 rounded text-sm uppercase tracking-widest border border-slate-900">
                  {certType}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-800 leading-relaxed max-w-xl mx-auto py-3">
                {renderBodyCopy('text-blue-950 font-bold', 'text-slate-900 font-bold')}
              </p>
              <p className="text-xs font-mono text-slate-600">
                Date of Issue: {issueDate}
              </p>
              <div className="flex justify-between items-end pt-14 px-8 text-xs font-bold text-slate-800">
                <div className="text-center border-t-2 border-slate-900 pt-1.5 w-36">
                  <span>Prepared By</span>
                </div>
                <div className="text-center w-36">
                  {renderSignature(true)}
                  <div className="border-t-2 border-slate-900 pt-1.5 mt-1">
                    Principal Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates & Testimonials"
        description="Generate official academic testimonials, transfer certificates, and character certificates across 10 design templates."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 space-y-4 self-start">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">
            Certificate Controls
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Testimonial">Academic Testimonial</option>
                <option value="Transfer Certificate">
                  Transfer Certificate (TC)
                </option>
                <option value="Character Certificate">
                  Character Certificate
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Design Template (10 Styles)
              </label>
              <select
                value={templateKey}
                onChange={(e) =>
                  setTemplateKey(e.target.value as CertificateTemplateKey)
                }
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="classic">1. Modern Classic Navy</option>
                <option value="royalgold">2. Royal Gold Prestige</option>
                <option value="emerald">3. Emerald Executive</option>
                <option value="crimson">4. Crimson Heritage</option>
                <option value="sapphire">5. Sapphire Elite</option>
                <option value="vintage">6. Vintage Ornamental</option>
                <option value="minimalist">7. Minimalist Noir</option>
                <option value="sunset">8. Vibrant Sunset</option>
                <option value="crest">9. Academic Crest Honor</option>
                <option value="cyber">10. Cyber Blue Modern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {students.length === 0 ? (
                  <option value="">No Students Enrolled</option>
                ) : (
                  students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class} · Roll {s.roll})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 print-only-full overflow-x-auto">
          <div className="min-w-[600px] bg-white rounded-xl shadow-sm overflow-hidden">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
