import { AVAILABLE_CLASSES } from '../data/defaults';
import { ExamMark, Student } from '../types/erp';

export function autoReorderStudentRolls(students: Student[]): Student[] {
  const updated = students.map((s) => ({ ...s }));
  AVAILABLE_CLASSES.forEach((cls) => {
    const classStudents = updated.filter(
      (s) => s.class === cls && s.status !== 'Graduated'
    );
    classStudents.forEach((st, idx) => {
      st.roll = (idx + 1).toString();
    });
  });
  return updated;
}

export function normalizeLegacyStudentClass(cls: string): string {
  if (cls === 'Class 10 Science Group') return '10th Class Science Group';
  if (cls === 'Class 10 Arts Group') return '10th Class Arts Group';
  if (cls === 'Class 10 Commerce Group') return '10th Class Commerce Group';
  return cls;
}

export function getNextClassRoll(students: Student[], cls: string): number {
  const classStudents = students.filter(
    (s) => s.class === cls && s.status !== 'Graduated'
  );
  return classStudents.length + 1;
}

export function getNextLogicalClass(srcCls: string): string {
  const promotionMap: Record<string, string> = {
    'Class 1': 'Class 2',
    'Class 2': 'Class 3',
    'Class 3': 'Class 4',
    'Class 4': 'Class 5',
    'Class 5': 'Class 6',
    'Class 6': 'Class 7',
    'Class 7': 'Class 8',
    'Class 8': 'Class 9 Science Group',
    'Class 9 Science Group': '10th Class Science Group',
    'Class 9 Arts Group': '10th Class Arts Group',
    'Class 9 Commerce Group': '10th Class Commerce Group',
    '10th Class Science Group': 'HSC -XI Science group',
    '10th Class Arts Group': 'HSC -XI arts group',
    '10th Class Commerce Group': 'HSC -XI commerce group',
    'HSC -XI Science group': 'HSC -XII Science group',
    'HSC -XI arts group': 'HSC -XII arts group',
    'HSC -XI commerce group': 'HSC -XII commerce group',
    'HSC -XII Science group': 'Graduated',
    'HSC -XII arts group': 'Graduated',
    'HSC -XII commerce group': 'Graduated',
  };
  return promotionMap[srcCls] || 'Graduated';
}

export function calculateSubjectGP(marks: number): {
  gp: number;
  grade: string;
} {
  const val = Number(marks) || 0;
  if (val >= 80) return { gp: 5.0, grade: 'A+' };
  if (val >= 70) return { gp: 4.0, grade: 'A' };
  if (val >= 60) return { gp: 3.5, grade: 'A-' };
  if (val >= 50) return { gp: 3.0, grade: 'B' };
  if (val >= 40) return { gp: 2.0, grade: 'C' };
  if (val >= 33) return { gp: 1.0, grade: 'D' };
  return { gp: 0.0, grade: 'F' };
}

export function calculateOverallGPA(
  subjectMarksList: Pick<ExamMark, 'total'>[]
): {
  gpa: string;
  grade: string;
  totalMarks: number;
  failedCount: number;
} {
  if (!subjectMarksList || subjectMarksList.length === 0) {
    return { gpa: '3.50', grade: 'A-', totalMarks: 0, failedCount: 0 };
  }

  let totalGP = 0;
  let totalMarks = 0;
  let failedCount = 0;

  subjectMarksList.forEach((m) => {
    const subTotal = Number(m.total) || 0;
    totalMarks += subTotal;
    const { gp } = calculateSubjectGP(subTotal);
    if (gp === 0.0) {
      failedCount++;
    }
    totalGP += gp;
  });

  if (failedCount > 0) {
    return { gpa: '0.00', grade: 'F', totalMarks, failedCount };
  }

  const avgGP = totalGP / subjectMarksList.length;
  let overallGrade = 'F';
  if (avgGP >= 5.0) overallGrade = 'A+';
  else if (avgGP >= 4.0) overallGrade = 'A';
  else if (avgGP >= 3.5) overallGrade = 'A-';
  else if (avgGP >= 3.0) overallGrade = 'B';
  else if (avgGP >= 2.0) overallGrade = 'C';
  else if (avgGP >= 1.0) overallGrade = 'D';

  return {
    gpa: avgGP.toFixed(2),
    grade: overallGrade,
    totalMarks,
    failedCount: 0,
  };
}

export function calculateStudentGPA(examMarks: ExamMark[], stuId: string): number {
  const marks = examMarks.filter((m) => m.stuId === stuId);
  const result = calculateOverallGPA(marks);
  return parseFloat(result.gpa);
}

export function formatBDT(amount: number): string {
  return `৳ ${Number(amount || 0).toLocaleString('en-US')}`;
}

export function downloadCSV(filename: string, textContent: string): void {
  const blob = new Blob([textContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result.map((col) => col.replace(/^"|"$/g, '').trim());
}
