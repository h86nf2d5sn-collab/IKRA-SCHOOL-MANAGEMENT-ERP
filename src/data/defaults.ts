import {
  ClassSubjectsMap,
  ExamMark,
  RoutineSlot,
  StaffMember,
  Student,
  Teacher,
  Transaction,
} from '../types/erp';

export const AVAILABLE_CLASSES: string[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9 Science Group',
  'Class 9 Arts Group',
  'Class 9 Commerce Group',
  '10th Class Science Group',
  '10th Class Arts Group',
  '10th Class Commerce Group',
  'HSC -XI Science group',
  'HSC -XI arts group',
  'HSC -XI commerce group',
  'HSC -XII Science group',
  'HSC -XII arts group',
  'HSC -XII commerce group',
];

export const STREAMS: string[] = [
  'Science',
  'Humanities/Arts',
  'Business Studies/Commerce',
  'General',
];

export const EXAM_TERMS: { value: string; label: string }[] = [
  { value: 'First Term Exam', label: '1st Term Examination' },
  { value: 'Mid Term Exam', label: 'Mid Term Examination' },
  { value: 'Final Term Exam', label: 'Final Term Examination' },
  { value: 'Model Test 1', label: 'Model Test 1' },
  { value: 'Model Test 2', label: 'Model Test 2' },
];

export const DEFAULT_DAILY_PERIODS: { period: number; time: string }[] = [
  { period: 1, time: '09:00 AM - 09:45 AM' },
  { period: 2, time: '09:45 AM - 10:30 AM' },
  { period: 3, time: '10:30 AM - 11:15 AM' },
  { period: 4, time: '11:15 AM - 12:00 PM' },
  { period: 5, time: '12:30 PM - 01:15 PM' },
  { period: 6, time: '01:15 PM - 02:00 PM' },
];

export const ROUTINE_DAYS: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
];

export const DEFAULT_FEE_CATEGORIES: string[] = [
  'Tuition Fee',
  'Admission Fee',
  'Exam Fee',
  'Library Fee',
  'Lab Fee',
  'Sports Fee',
];

export const DEFAULT_FEE_PRESETS: Record<string, number> = {
  'Tuition Fee': 1500,
  'Admission Fee': 5000,
  'Exam Fee': 500,
  'Library Fee': 200,
  'Lab Fee': 300,
  'Sports Fee': 200,
};

export const DEFAULT_COST_CATEGORIES: string[] = [
  'Salary Expense',
  'Electricity Bill',
  'Maintenance',
  'Stationery',
  'Event Expense',
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'STU-1',
    roll: '1',
    name: 'Abdullah Al Mamun',
    class: 'Class 9 Science Group',
    dept: 'Science',
    guardian: 'Abdul Karim',
    mobile: '01711223344',
    homeAddr: 'Dhaka',
    status: 'Active',
  },
  {
    id: 'STU-2',
    roll: '2',
    name: 'Nusrat Jahan',
    class: 'Class 9 Science Group',
    dept: 'Science',
    guardian: 'Rafiqul Islam',
    mobile: '01811223344',
    homeAddr: 'Mirpur',
    status: 'Active',
  },
  {
    id: 'STU-3',
    roll: '1',
    name: 'Tanvir Ahmed',
    class: '10th Class Science Group',
    dept: 'Science',
    guardian: 'Kamal Ahmed',
    mobile: '01911223344',
    homeAddr: 'Uttara',
    status: 'Active',
  },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'TCH-1',
    name: 'Dr. M. A. Rahim',
    subject: 'Mathematics',
    mobile: '01700112233',
    salary: 35000,
    status: 'Active',
  },
  {
    id: 'TCH-2',
    name: 'Nazma Akter',
    subject: 'Bangla',
    mobile: '01800112233',
    salary: 28000,
    status: 'Active',
  },
];

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'STF-1',
    name: 'Monir Hossain',
    role: 'Accountant',
    mobile: '01600112233',
    salary: 20000,
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-1',
    date: '2026-01-10',
    type: 'Income',
    category: 'Tuition Fee',
    payee: 'Abdullah Al Mamun (Class 9 Science Group)',
    amount: 2500,
    studentId: 'STU-1',
    billingMonth: '2026-01',
  },
];

const PRIMARY_SUBJECTS = [
  { name: 'Bangla', group: 'Compulsory' },
  { name: 'English', group: 'Compulsory' },
  { name: 'Mathematics', group: 'Compulsory' },
  { name: 'Elementary Science', group: 'Compulsory' },
  { name: 'Bangladesh & Global Studies', group: 'Compulsory' },
  { name: 'Religion & Moral Education', group: 'Compulsory' },
];

const JUNIOR_SECONDARY_SUBJECTS = [
  { name: 'Bangla 1st Paper', group: 'Compulsory' },
  { name: 'Bangla 2nd Paper', group: 'Compulsory' },
  { name: 'English 1st Paper', group: 'Compulsory' },
  { name: 'English 2nd Paper', group: 'Compulsory' },
  { name: 'Mathematics', group: 'Compulsory' },
  { name: 'General Science', group: 'Compulsory' },
  { name: 'ICT', group: 'Compulsory' },
  { name: 'Bangladesh & Global Studies', group: 'Compulsory' },
];

export const DEFAULT_CLASS_SUBJECTS: ClassSubjectsMap = {
  'Class 1': PRIMARY_SUBJECTS.slice(0, 4),
  'Class 2': PRIMARY_SUBJECTS.slice(0, 4),
  'Class 3': PRIMARY_SUBJECTS,
  'Class 4': PRIMARY_SUBJECTS,
  'Class 5': PRIMARY_SUBJECTS,
  'Class 6': JUNIOR_SECONDARY_SUBJECTS,
  'Class 7': JUNIOR_SECONDARY_SUBJECTS,
  'Class 8': JUNIOR_SECONDARY_SUBJECTS,
  'Class 9 Science Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'Physics', group: 'Science' },
    { name: 'Chemistry', group: 'Science' },
    { name: 'Higher Mathematics / Biology', group: 'Science' },
  ],
  'Class 9 Arts Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'History of Bengal', group: 'Arts' },
    { name: 'Geography & Environment', group: 'Arts' },
    { name: 'Civics & Citizenship', group: 'Arts' },
  ],
  'Class 9 Commerce Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'Accounting', group: 'Commerce' },
    { name: 'Finance & Banking', group: 'Commerce' },
    { name: 'Business Entrepreneurship', group: 'Commerce' },
  ],
  '10th Class Science Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'Physics', group: 'Science' },
    { name: 'Chemistry', group: 'Science' },
    { name: 'Higher Mathematics / Biology', group: 'Science' },
  ],
  '10th Class Arts Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'History of Bengal', group: 'Arts' },
    { name: 'Geography & Environment', group: 'Arts' },
    { name: 'Civics & Citizenship', group: 'Arts' },
  ],
  '10th Class Commerce Group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'General Mathematics', group: 'Compulsory' },
    { name: 'Accounting', group: 'Commerce' },
    { name: 'Finance & Banking', group: 'Commerce' },
    { name: 'Business Entrepreneurship', group: 'Commerce' },
  ],
  'HSC -XI Science group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Physics 1st Paper', group: 'Science' },
    { name: 'Chemistry 1st Paper', group: 'Science' },
    { name: 'Higher Mathematics / Biology 1st Paper', group: 'Science' },
  ],
  'HSC -XI arts group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Civics & Good Governance 1st Paper', group: 'Arts' },
    { name: 'Islamic History 1st Paper', group: 'Arts' },
    { name: 'Economics 1st Paper', group: 'Arts' },
  ],
  'HSC -XI commerce group': [
    { name: 'Bangla 1st Paper', group: 'Compulsory' },
    { name: 'English 1st Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Accounting 1st Paper', group: 'Commerce' },
    { name: 'Business Organization 1st Paper', group: 'Commerce' },
    { name: 'Finance, Banking & Insurance 1st Paper', group: 'Commerce' },
  ],
  'HSC -XII Science group': [
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Physics 2nd Paper', group: 'Science' },
    { name: 'Chemistry 2nd Paper', group: 'Science' },
    { name: 'Higher Mathematics / Biology 2nd Paper', group: 'Science' },
  ],
  'HSC -XII arts group': [
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Civics & Good Governance 2nd Paper', group: 'Arts' },
    { name: 'Islamic History 2nd Paper', group: 'Arts' },
    { name: 'Economics 2nd Paper', group: 'Arts' },
  ],
  'HSC -XII commerce group': [
    { name: 'Bangla 2nd Paper', group: 'Compulsory' },
    { name: 'English 2nd Paper', group: 'Compulsory' },
    { name: 'ICT', group: 'Compulsory' },
    { name: 'Accounting 2nd Paper', group: 'Commerce' },
    { name: 'Business Organization 2nd Paper', group: 'Commerce' },
    { name: 'Finance, Banking & Insurance 2nd Paper', group: 'Commerce' },
  ],
};

export const DEFAULT_EXAM_MARKS: ExamMark[] = [
  {
    id: 'MRK-SEED-1',
    term: 'Final Term Exam',
    cls: 'Class 9 Science Group',
    stuId: 'STU-1',
    studentName: 'Abdullah Al Mamun',
    roll: '1',
    subject: 'General Mathematics',
    written: 62,
    mcq: 26,
    total: 88,
  },
  {
    id: 'MRK-SEED-2',
    term: 'Final Term Exam',
    cls: 'Class 9 Science Group',
    stuId: 'STU-1',
    studentName: 'Abdullah Al Mamun',
    roll: '1',
    subject: 'Physics',
    written: 58,
    mcq: 24,
    total: 82,
  },
  {
    id: 'MRK-SEED-3',
    term: 'Final Term Exam',
    cls: 'Class 9 Science Group',
    stuId: 'STU-2',
    studentName: 'Nusrat Jahan',
    roll: '2',
    subject: 'General Mathematics',
    written: 54,
    mcq: 22,
    total: 76,
  },
  {
    id: 'MRK-SEED-4',
    term: 'Final Term Exam',
    cls: 'Class 9 Science Group',
    stuId: 'STU-2',
    studentName: 'Nusrat Jahan',
    roll: '2',
    subject: 'Physics',
    written: 51,
    mcq: 23,
    total: 74,
  },
];

export const DEFAULT_ROUTINES: RoutineSlot[] = [
  {
    className: 'Class 9 Science Group',
    day: 'Sunday',
    period: 1,
    time: 'Period 1 (09:00 AM - 09:45 AM)',
    subject: 'General Mathematics',
    teacher: 'Dr. M. A. Rahim',
  },
  {
    className: 'Class 9 Science Group',
    day: 'Sunday',
    period: 2,
    time: 'Period 2 (09:45 AM - 10:30 AM)',
    subject: 'Bangla 1st Paper',
    teacher: 'Nazma Akter',
  },
];
