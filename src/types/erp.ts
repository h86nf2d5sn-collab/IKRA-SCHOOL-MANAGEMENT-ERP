export type TabId =
  | 'dashboard'
  | 'settings'
  | 'subjects'
  | 'cashflow'
  | 'admission'
  | 'promotion'
  | 'students'
  | 'teachers'
  | 'staff'
  | 'idcards'
  | 'routines'
  | 'classes'
  | 'payments'
  | 'dues'
  | 'modeltest'
  | 'expenses'
  | 'certificates'
  | 'ledgers';

export interface Student {
  id: string;
  roll: string;
  name: string;
  class: string;
  dept: string;
  guardian: string;
  mobile: string;
  homeAddr: string;
  status: 'Active' | 'Graduated';
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  mobile: string;
  salary: number;
  status?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  mobile: string;
  salary: number;
}

export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  payee: string;
  amount: number;
  studentId?: string;
  billingMonth?: string;
}

export interface SubjectItem {
  name: string;
  group: string;
}

export type ClassSubjectsMap = Record<string, SubjectItem[]>;

export interface ExamMark {
  id: string;
  term: string;
  cls: string;
  stuId: string;
  studentName: string;
  roll: string;
  subject: string;
  written: number;
  mcq: number;
  total: number;
}

export interface RoutineSlot {
  className: string;
  day: string;
  period: number;
  time: string;
  subject: string;
  teacher: string;
}

export interface FeeLineItem {
  id: string;
  name: string;
  amount: number;
}

export interface MoneyReceipt {
  receiptNo: string;
  date: string;
  studentName: string;
  className: string;
  roll: string;
  month: string;
  items: { name: string; amt: number }[];
  totalAmount: number;
}

export type IdCardSubTab = 'student' | 'teacher' | 'staff';

export type IdCardTemplateKey =
  | 'ocean'
  | 'crimson'
  | 'emerald'
  | 'amber'
  | 'purple'
  | 'slate'
  | 'indigo'
  | 'teal'
  | 'rose'
  | 'navy';

export type IdCardOrientation = 'horizontal' | 'vertical';

export type AuthorityRole =
  | 'Principal'
  | 'Headmaster'
  | 'Director'
  | 'Vice Principal'
  | 'Chairman';

export type CertificateType =
  | 'Testimonial'
  | 'Transfer Certificate'
  | 'Character Certificate';

export type CertificateTemplateKey =
  | 'classic'
  | 'royalgold'
  | 'emerald'
  | 'crimson'
  | 'sapphire'
  | 'vintage'
  | 'minimalist'
  | 'sunset'
  | 'crest'
  | 'cyber';

export type PromotionCriteria = 'ALL' | 'GPA_PASS' | 'MANUAL' | 'MERIT_TOP';

export interface ErpDatabase {
  students: Student[];
  teachers: Teacher[];
  staff: StaffMember[];
  feeCategories: string[];
  feePresets: Record<string, number>;
  costCategories: string[];
  transactions: Transaction[];
  classSubjects: ClassSubjectsMap;
  examMarks: ExamMark[];
  routineSlots: RoutineSlot[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
}
