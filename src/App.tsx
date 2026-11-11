import { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import {
  Award,
  BookOpen,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Database,
  FileSpreadsheet,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Menu,
  Receipt,
  Settings,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { AdmissionView } from './components/modules/AdmissionView';
import { CashFlowView } from './components/modules/CashFlowView';
import { CertificatesView } from './components/modules/CertificatesView';
import { ClassRostersView } from './components/modules/ClassRostersView';
import { DashboardView } from './components/modules/DashboardView';
import { DuesView } from './components/modules/DuesView';
import { ExamsView } from './components/modules/ExamsView';
import { ExpensesView } from './components/modules/ExpensesView';
import { IdCardsView } from './components/modules/IdCardsView';
import { LedgersView } from './components/modules/LedgersView';
import { PaymentsView } from './components/modules/PaymentsView';
import { PromotionView } from './components/modules/PromotionView';
import { RoutinesView } from './components/modules/RoutinesView';
import { SettingsView } from './components/modules/SettingsView';
import { StaffView } from './components/modules/StaffView';
import { StudentsView } from './components/modules/StudentsView';
import { SubjectsView } from './components/modules/SubjectsView';
import { TeachersView } from './components/modules/TeachersView';
import {
  AVAILABLE_CLASSES,
  DEFAULT_CLASS_SUBJECTS,
  DEFAULT_COST_CATEGORIES,
  DEFAULT_EXAM_MARKS,
  DEFAULT_FEE_CATEGORIES,
  DEFAULT_FEE_PRESETS,
  DEFAULT_ROUTINES,
  DEFAULT_STAFF,
  DEFAULT_STUDENTS,
  DEFAULT_TEACHERS,
  DEFAULT_TRANSACTIONS,
} from './data/defaults';
import {
  ClassSubjectsMap,
  ConfirmDialogState,
  ErpDatabase,
  ExamMark,
  MoneyReceipt,
  RoutineSlot,
  StaffMember,
  Student,
  SubjectItem,
  TabId,
  Teacher,
  ToastMessage,
  Transaction,
} from './types/erp';
import {
  autoReorderStudentRolls,
  calculateStudentGPA,
  getNextClassRoll,
  getNextLogicalClass,
  normalizeLegacyStudentClass,
} from './utils/erpHelpers';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface NavGroup {
  title: string;
  items: { id: TabId; label: string; icon: ReactNode }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Main Navigation',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Overview',
        icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'settings',
        label: 'Settings & Categories',
        icon: <Settings className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'subjects',
        label: 'Class Subject Setup',
        icon: <BookOpen className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'cashflow',
        label: 'Cash Flow & Statements',
        icon: <TrendingUp className="w-4 h-4 shrink-0" />,
      },
    ],
  },
  {
    title: 'Students & Admissions',
    items: [
      {
        id: 'admission',
        label: 'Student Admission',
        icon: <UserPlus className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'promotion',
        label: 'Auto Progress & Promotion',
        icon: <GraduationCap className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'students',
        label: 'Students Directory & CSV',
        icon: <Users className="w-4 h-4 shrink-0" />,
      },
    ],
  },
  {
    title: 'Staff & Roster',
    items: [
      {
        id: 'teachers',
        label: 'Teachers Roster & CSV',
        icon: <UserCheck className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'staff',
        label: 'Staff Directory & CSV',
        icon: <Users className="w-4 h-4 shrink-0" />,
      },
    ],
  },
  {
    title: 'Academics & Operations',
    items: [
      {
        id: 'idcards',
        label: 'ID Card Engine',
        icon: <CreditCard className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'routines',
        label: 'Weekly Class Routines',
        icon: <CalendarClock className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'classes',
        label: 'Class Rosters & Lists',
        icon: <ClipboardList className="w-4 h-4 shrink-0" />,
      },
    ],
  },
  {
    title: 'Finance & Exams',
    items: [
      {
        id: 'payments',
        label: 'Fee Collection & Receipts',
        icon: <Receipt className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'dues',
        label: 'Fee Dues Tracker',
        icon: <Landmark className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'modeltest',
        label: 'Exam & Marksheet Engine',
        icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'expenses',
        label: 'Expense & Salary Outflow',
        icon: <Wallet className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'certificates',
        label: 'Certificates & Testimonials',
        icon: <Award className="w-4 h-4 shrink-0" />,
      },
      {
        id: 'ledgers',
        label: 'Full Audit Ledgers',
        icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
      },
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>(() => {
    const loaded = loadStorage<Student[]>('ikra_students', DEFAULT_STUDENTS);
    const normalized = loaded.map((s) => ({
      ...s,
      class: normalizeLegacyStudentClass(s.class),
      status: s.status || ('Active' as const),
    }));
    return autoReorderStudentRolls(normalized);
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    loadStorage<Teacher[]>('ikra_teachers', DEFAULT_TEACHERS)
  );
  const [staff, setStaff] = useState<StaffMember[]>(() =>
    loadStorage<StaffMember[]>('ikra_staff', DEFAULT_STAFF)
  );
  const [feeCategories, setFeeCategories] = useState<string[]>(() =>
    loadStorage<string[]>('ikra_fee_cats', DEFAULT_FEE_CATEGORIES)
  );
  const [feePresets, setFeePresets] = useState<Record<string, number>>(() =>
    loadStorage<Record<string, number>>('ikra_fee_presets', DEFAULT_FEE_PRESETS)
  );
  const [costCategories, setCostCategories] = useState<string[]>(() =>
    loadStorage<string[]>('ikra_cost_cats', DEFAULT_COST_CATEGORIES)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadStorage<Transaction[]>('ikra_transactions', DEFAULT_TRANSACTIONS)
  );
  const [classSubjects, setClassSubjects] = useState<ClassSubjectsMap>(() => {
    const stored = loadStorage<ClassSubjectsMap>(
      'ikra_class_subjects',
      DEFAULT_CLASS_SUBJECTS
    );
    return { ...DEFAULT_CLASS_SUBJECTS, ...stored };
  });
  const [examMarks, setExamMarks] = useState<ExamMark[]>(() =>
    loadStorage<ExamMark[]>('ikra_exam_marks', DEFAULT_EXAM_MARKS)
  );
  const [routineSlots, setRoutineSlots] = useState<RoutineSlot[]>(() =>
    loadStorage<RoutineSlot[]>('ikra_routines', DEFAULT_ROUTINES)
  );
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>(() =>
    localStorage.getItem('ikra_signature') || ''
  );
  const [latestReceipt, setLatestReceipt] = useState<MoneyReceipt | null>(() =>
    loadStorage<MoneyReceipt | null>('ikra_latest_receipt', null)
  );
  const [paymentPrefill, setPaymentPrefill] = useState<{
    className: string;
    studentId: string;
    month: string;
  } | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ikra_students', JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem('ikra_teachers', JSON.stringify(teachers));
  }, [teachers]);
  useEffect(() => {
    localStorage.setItem('ikra_staff', JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem('ikra_fee_cats', JSON.stringify(feeCategories));
  }, [feeCategories]);
  useEffect(() => {
    localStorage.setItem('ikra_fee_presets', JSON.stringify(feePresets));
  }, [feePresets]);
  useEffect(() => {
    localStorage.setItem('ikra_cost_cats', JSON.stringify(costCategories));
  }, [costCategories]);
  useEffect(() => {
    localStorage.setItem('ikra_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('ikra_class_subjects', JSON.stringify(classSubjects));
  }, [classSubjects]);
  useEffect(() => {
    localStorage.setItem('ikra_exam_marks', JSON.stringify(examMarks));
  }, [examMarks]);
  useEffect(() => {
    localStorage.setItem('ikra_routines', JSON.stringify(routineSlots));
  }, [routineSlots]);
  useEffect(() => {
    if (signatureDataUrl) {
      localStorage.setItem('ikra_signature', signatureDataUrl);
    } else {
      localStorage.removeItem('ikra_signature');
    }
  }, [signatureDataUrl]);
  useEffect(() => {
    if (latestReceipt) {
      localStorage.setItem(
        'ikra_latest_receipt',
        JSON.stringify(latestReceipt)
      );
    }
  }, [latestReceipt]);

  const notify = (
    type: ToastMessage['type'],
    title: string,
    message?: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSwitchTab = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // --- Backup & Restore DB ---
  const handleExportDB = () => {
    const db: ErpDatabase = {
      students,
      teachers,
      staff,
      feeCategories,
      feePresets,
      costCategories,
      transactions,
      classSubjects,
      examMarks,
      routineSlots,
    };
    const jsonStr = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `IKRA_ERP_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify('success', 'Database backup exported');
  };

  const handleImportDB = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw =
          typeof ev.target?.result === 'string' ? ev.target.result : '';
        const db = JSON.parse(raw) as Partial<ErpDatabase>;
        if (db.students)
          setStudents(
            autoReorderStudentRolls(
              db.students.map((s) => ({
                ...s,
                class: normalizeLegacyStudentClass(s.class),
              }))
            )
          );
        if (db.teachers) setTeachers(db.teachers);
        if (db.staff) setStaff(db.staff);
        if (db.feeCategories) setFeeCategories(db.feeCategories);
        if (db.feePresets) setFeePresets(db.feePresets);
        if (db.costCategories) setCostCategories(db.costCategories);
        if (db.transactions) setTransactions(db.transactions);
        if (db.classSubjects) setClassSubjects(db.classSubjects);
        if (db.examMarks) setExamMarks(db.examMarks);
        if (db.routineSlots) setRoutineSlots(db.routineSlots);
        setActiveTab('dashboard');
        notify(
          'success',
          'Database restored',
          'All institutional records have been loaded from the backup.'
        );
      } catch {
        notify(
          'error',
          'Restore failed',
          'Could not parse the selected JSON backup file.'
        );
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  // --- Settings Handlers ---
  const handleAddFeeCategory = (name: string) => {
    if (feeCategories.includes(name)) {
      notify('info', 'Fee category already exists');
      return;
    }
    setFeeCategories((prev) => [...prev, name]);
    setFeePresets((prev) => ({
      ...prev,
      [name]: prev[name] ?? 500,
    }));
    notify('success', 'Fee category added', name);
  };

  const handleDeleteFeeCategory = (idx: number) => {
    const cat = feeCategories[idx];
    if (!cat) return;
    setFeeCategories((prev) => prev.filter((_, i) => i !== idx));
    setFeePresets((prev) => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
    notify('info', 'Fee category removed', cat);
  };

  const handleResetFeeCategories = () => {
    setFeeCategories(DEFAULT_FEE_CATEGORIES);
    setFeePresets(DEFAULT_FEE_PRESETS);
    notify('info', 'Fee categories reset to defaults');
  };

  const handleUpdateFeePreset = (cat: string, amount: number) => {
    setFeePresets((prev) => ({ ...prev, [cat]: amount }));
  };

  const handleAddCostCategory = (name: string) => {
    if (costCategories.includes(name)) {
      notify('info', 'Expense head already exists');
      return;
    }
    setCostCategories((prev) => [...prev, name]);
    notify('success', 'Expense head added', name);
  };

  const handleDeleteCostCategory = (idx: number) => {
    const cat = costCategories[idx];
    setCostCategories((prev) => prev.filter((_, i) => i !== idx));
    if (cat) notify('info', 'Expense head removed', cat);
  };

  const handleResetCostCategories = () => {
    setCostCategories(DEFAULT_COST_CATEGORIES);
    notify('info', 'Expense categories reset to defaults');
  };

  // --- Subject Handlers ---
  const handleAddSubject = (className: string, subject: SubjectItem) => {
    setClassSubjects((prev) => ({
      ...prev,
      [className]: [...(prev[className] || []), subject],
    }));
    notify('success', 'Subject added', `${subject.name} (${className})`);
  };

  const handleDeleteSubject = (className: string, idx: number) => {
    setClassSubjects((prev) => ({
      ...prev,
      [className]: (prev[className] || []).filter((_, i) => i !== idx),
    }));
    notify('info', 'Subject removed');
  };

  // --- Admission & Students Handlers ---
  const handleAdmitStudent = (
    payload: Omit<Student, 'id' | 'roll' | 'status'>
  ) => {
    const nextRoll = getNextClassRoll(students, payload.class).toString();
    const newStudent: Student = {
      ...payload,
      id: `STU-${Date.now()}`,
      roll: nextRoll,
      status: 'Active',
    };
    setStudents((prev) => autoReorderStudentRolls([...prev, newStudent]));
    notify(
      'success',
      'Student admitted successfully',
      `${payload.name} enrolled in ${payload.class} with Roll #${nextRoll}.`
    );
    setActiveTab('students');
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    notify('success', 'Student record updated', updated.name);
  };

  const handleDeleteStudent = (student: Student) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Student Record',
      description: `Are you sure you want to delete ${student.name} (${student.class}, Roll #${student.roll})? Remaining rolls in this class will be reordered automatically.`,
      confirmLabel: 'Delete Student',
      variant: 'danger',
      onConfirm: () => {
        setStudents((prev) =>
          autoReorderStudentRolls(prev.filter((s) => s.id !== student.id))
        );
        notify('info', 'Student deleted', student.name);
      },
    });
  };

  const handleImportStudents = (imported: Omit<Student, 'id'>[]) => {
    const created: Student[] = imported.map((item, idx) => ({
      ...item,
      id: `STU-${Date.now()}-${idx}`,
      class: normalizeLegacyStudentClass(item.class),
    }));
    setStudents((prev) => autoReorderStudentRolls([...prev, ...created]));
    notify(
      'success',
      'Students imported',
      `${created.length} student record(s) imported from CSV.`
    );
  };

  // --- Promotion Handlers ---
  const handleBatchPromote = (
    studentIds: string[],
    targetClass: string,
    sourceClass: string
  ) => {
    if (studentIds.length === 0) {
      notify(
        'error',
        'No students selected',
        `Select at least one student from ${sourceClass} to promote.`
      );
      return;
    }

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (!studentIds.includes(s.id)) return s;
        if (targetClass === 'Graduated') {
          return { ...s, status: 'Graduated' as const };
        }
        return { ...s, class: targetClass };
      });
      return autoReorderStudentRolls(updated);
    });

    notify(
      'success',
      'Batch promotion complete',
      `${studentIds.length} student(s) promoted from ${sourceClass} to ${targetClass}.`
    );
  };

  const handleGlobalPromote = () => {
    setConfirmState({
      isOpen: true,
      title: 'Run Global Auto-Promotion Engine',
      description:
        'Are you sure you want to promote eligible students (GPA ≥ 1.00) across ALL classes to their next academic level?',
      confirmLabel: 'Run Global Engine',
      variant: 'primary',
      onConfirm: () => {
        let totalPromoted = 0;
        setStudents((prev) => {
          const updated = prev.map((s) => {
            if (s.status === 'Graduated') return s;
            const gpa = calculateStudentGPA(examMarks, s.id);
            if (gpa < 1.0) return s;
            const target = getNextLogicalClass(s.class);
            totalPromoted++;
            if (target === 'Graduated') {
              return { ...s, status: 'Graduated' as const };
            }
            return { ...s, class: target };
          });
          return autoReorderStudentRolls(updated);
        });
        notify(
          'success',
          'Global promotion finished',
          `Promoted ${totalPromoted} eligible student(s) across the institution.`
        );
      },
    });
  };

  // --- Teachers Handlers ---
  const handleSaveTeacher = (
    data: Omit<Teacher, 'id'>,
    editId?: string
  ) => {
    if (editId) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, ...data } : t))
      );
      notify('success', 'Teacher updated', data.name);
    } else {
      setTeachers((prev) => [
        ...prev,
        { ...data, id: `TCH-${Date.now()}` },
      ]);
      notify('success', 'Teacher added', data.name);
    }
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Teacher Record',
      description: `Are you sure you want to remove ${teacher.name} from the faculty roster?`,
      confirmLabel: 'Delete Teacher',
      variant: 'danger',
      onConfirm: () => {
        setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
        notify('info', 'Teacher deleted', teacher.name);
      },
    });
  };

  const handleImportTeachers = (imported: Omit<Teacher, 'id'>[]) => {
    const created: Teacher[] = imported.map((item, idx) => ({
      ...item,
      id: `TCH-${Date.now()}-${idx}`,
    }));
    setTeachers((prev) => [...prev, ...created]);
    notify(
      'success',
      'Teachers imported',
      `${created.length} teacher record(s) added.`
    );
  };

  // --- Staff Handlers ---
  const handleSaveStaff = (
    data: Omit<StaffMember, 'id'>,
    editId?: string
  ) => {
    if (editId) {
      setStaff((prev) =>
        prev.map((st) => (st.id === editId ? { ...st, ...data } : st))
      );
      notify('success', 'Staff record updated', data.name);
    } else {
      setStaff((prev) => [...prev, { ...data, id: `STF-${Date.now()}` }]);
      notify('success', 'Staff member added', data.name);
    }
  };

  const handleDeleteStaff = (member: StaffMember) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Staff Record',
      description: `Are you sure you want to remove ${member.name} from the staff directory?`,
      confirmLabel: 'Delete Staff',
      variant: 'danger',
      onConfirm: () => {
        setStaff((prev) => prev.filter((st) => st.id !== member.id));
        notify('info', 'Staff deleted', member.name);
      },
    });
  };

  const handleImportStaff = (imported: Omit<StaffMember, 'id'>[]) => {
    const created: StaffMember[] = imported.map((item, idx) => ({
      ...item,
      id: `STF-${Date.now()}-${idx}`,
    }));
    setStaff((prev) => [...prev, ...created]);
    notify(
      'success',
      'Staff imported',
      `${created.length} staff record(s) added.`
    );
  };

  // --- Routine Handlers ---
  const handleSaveRoutineSlot = (slot: RoutineSlot) => {
    setRoutineSlots((prev) => {
      const filtered = prev.filter(
        (r) =>
          !(
            r.className === slot.className &&
            r.day === slot.day &&
            (r.period === slot.period || r.time === slot.time)
          )
      );
      return [...filtered, slot];
    });
    notify(
      'success',
      'Timetable slot saved',
      `${slot.day} Period ${slot.period} · ${slot.subject}`
    );
  };

  const handleClearRoutineSlot = (
    className: string,
    day: string,
    period: number
  ) => {
    setRoutineSlots((prev) =>
      prev.filter(
        (r) =>
          !(r.className === className && r.day === day && r.period === period)
      )
    );
    notify('info', 'Timetable slot cleared', `${day} Period ${period}`);
  };

  // --- Payments & Dues Handlers ---
  const handleCollectFee = ({
    student,
    month,
    items,
    totalAmount,
  }: {
    student: Student;
    month: string;
    items: { name: string; amt: number }[];
    totalAmount: number;
  }) => {
    const receiptNo = `IKRA-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-GB');

    const newTrx: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Income',
      category: items.map((i) => i.name).join(', '),
      payee: `${student.name} (${student.class})`,
      amount: totalAmount,
      studentId: student.id,
      billingMonth: month,
    };

    setTransactions((prev) => [...prev, newTrx]);
    setLatestReceipt({
      receiptNo,
      date: dateStr,
      studentName: student.name,
      className: student.class,
      roll: student.roll,
      month,
      items,
      totalAmount,
    });
    notify(
      'success',
      'Fee collected & receipt generated',
      `Receipt #${receiptNo} for ${student.name}`
    );
  };

  const handleCollectForStudentFromDues = (student: Student, month: string) => {
    setPaymentPrefill({
      className: AVAILABLE_CLASSES.includes(student.class)
        ? student.class
        : 'Class 9 Science Group',
      studentId: student.id,
      month,
    });
    setActiveTab('payments');
  };

  // --- Exams Handler ---
  const handleSaveMarksheet = (
    term: string,
    cls: string,
    student: Student,
    rows: { subject: string; written: number; mcq: number }[]
  ) => {
    const newMarks: ExamMark[] = rows.map((r, idx) => ({
      id: `MRK-${Date.now()}-${idx}-${Math.random()}`,
      term,
      cls,
      stuId: student.id,
      studentName: student.name,
      roll: student.roll,
      subject: r.subject,
      written: r.written,
      mcq: r.mcq,
      total: r.written + r.mcq,
    }));

    setExamMarks((prev) => [
      ...prev.filter((m) => !(m.stuId === student.id && m.term === term)),
      ...newMarks,
    ]);
    notify(
      'success',
      'Marksheet saved',
      `${newMarks.length} subject mark(s) recorded for ${student.name} (${term}).`
    );
  };

  // --- Expense Handler ---
  const handleRecordExpense = ({
    category,
    payee,
    amount,
    date,
  }: {
    category: string;
    payee: string;
    amount: number;
    date: string;
  }) => {
    setTransactions((prev) => [
      ...prev,
      {
        id: `TRX-${Date.now()}`,
        date,
        type: 'Expense',
        category,
        payee,
        amount,
      },
    ]);
    notify('success', 'Expense recorded', `${category} · ${payee}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Zone 1 Brand Wordmark — Zone 2 Quick Links — Zone 3 Actions */}
      <header className="no-print sticky top-0 z-40 h-14 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation sidebar"
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('dashboard')}
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            IKRA School & College
          </button>
        </div>

        <nav
          aria-label="Primary quick links"
          className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300"
        >
          {(
            [
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'students', label: 'Students' },
              { id: 'payments', label: 'Fee Collection' },
              { id: 'modeltest', label: 'Exams & GPA' },
              { id: 'ledgers', label: 'Audit Ledgers' },
            ] as const
          ).map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleSwitchTab(link.id)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === link.id
                  ? 'text-white border-blue-400 font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restore DB</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportDB}
            />
          </label>
          <button
            type="button"
            onClick={handleExportDB}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup DB</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="no-print fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          />
        )}

        {/* Sidebar Navigation (260px) */}
        <aside
          className={`no-print ${
            mobileMenuOpen
              ? 'fixed inset-y-14 left-0 z-30 w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto shadow-xl'
              : 'hidden'
          } md:block md:w-64 md:shrink-0`}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-5 md:sticky md:top-20">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSwitchTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <span
                        className={
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Active Module Viewport */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              staff={staff}
              transactions={transactions}
              onSwitchTab={handleSwitchTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              feeCategories={feeCategories}
              feePresets={feePresets}
              costCategories={costCategories}
              signatureDataUrl={signatureDataUrl}
              onAddFeeCategory={handleAddFeeCategory}
              onDeleteFeeCategory={handleDeleteFeeCategory}
              onResetFeeCategories={handleResetFeeCategories}
              onUpdateFeePreset={handleUpdateFeePreset}
              onAddCostCategory={handleAddCostCategory}
              onDeleteCostCategory={handleDeleteCostCategory}
              onResetCostCategories={handleResetCostCategories}
              onSignatureUpload={(url) => {
                setSignatureDataUrl(url);
                notify('success', 'Digital signature updated');
              }}
              onClearSignature={() => {
                setSignatureDataUrl('');
                notify('info', 'Digital signature cleared');
              }}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView
              classSubjects={classSubjects}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeTab === 'cashflow' && (
            <CashFlowView transactions={transactions} />
          )}

          {activeTab === 'admission' && (
            <AdmissionView
              students={students}
              onAdmitStudent={handleAdmitStudent}
            />
          )}

          {activeTab === 'promotion' && (
            <PromotionView
              students={students}
              examMarks={examMarks}
              onBatchPromote={handleBatchPromote}
              onGlobalPromote={handleGlobalPromote}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onImportStudents={handleImportStudents}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersView
              teachers={teachers}
              onSaveTeacher={handleSaveTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onImportTeachers={handleImportTeachers}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView
              staff={staff}
              onSaveStaff={handleSaveStaff}
              onDeleteStaff={handleDeleteStaff}
              onImportStaff={handleImportStaff}
            />
          )}

          {activeTab === 'idcards' && (
            <IdCardsView
              students={students}
              teachers={teachers}
              staff={staff}
              signatureDataUrl={signatureDataUrl}
              onSignatureUpload={(url) => {
                setSignatureDataUrl(url);
                notify('success', 'Digital signature uploaded');
              }}
              onClearSignature={() => {
                setSignatureDataUrl('');
                notify('info', 'Digital signature cleared');
              }}
            />
          )}

          {activeTab === 'routines' && (
            <RoutinesView
              routineSlots={routineSlots}
              teachers={teachers}
              classSubjects={classSubjects}
              onSaveSlot={handleSaveRoutineSlot}
              onClearSlot={handleClearRoutineSlot}
            />
          )}

          {activeTab === 'classes' && <ClassRostersView students={students} />}

          {activeTab === 'payments' && (
            <PaymentsView
              students={students}
              feeCategories={feeCategories}
              feePresets={feePresets}
              signatureDataUrl={signatureDataUrl}
              prefillSelection={paymentPrefill}
              latestReceipt={latestReceipt}
              onCollectFee={handleCollectFee}
            />
          )}

          {activeTab === 'dues' && (
            <DuesView
              students={students}
              transactions={transactions}
              feePresets={feePresets}
              onCollectForStudent={handleCollectForStudentFromDues}
            />
          )}

          {activeTab === 'modeltest' && (
            <ExamsView
              students={students}
              classSubjects={classSubjects}
              examMarks={examMarks}
              signatureDataUrl={signatureDataUrl}
              onSaveMarksheet={handleSaveMarksheet}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              costCategories={costCategories}
              teachers={teachers}
              staff={staff}
              transactions={transactions}
              onRecordExpense={handleRecordExpense}
            />
          )}

          {activeTab === 'certificates' && (
            <CertificatesView
              students={students}
              signatureDataUrl={signatureDataUrl}
            />
          )}

          {activeTab === 'ledgers' && <LedgersView transactions={transactions} />}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        state={confirmState}
        onCancel={() =>
          setConfirmState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
