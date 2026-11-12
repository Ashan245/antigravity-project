export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface Student {
  id: string; // e.g. STU-2026-001
  name: string;
  sinhalaName?: string;
  gender: 'male' | 'female';
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  school: string;
  grade: string; // e.g. "Grade 11 - O/L", "Grade 12 - A/L"
  stream?: string; // Physical Science, Bio Science, Commerce, Arts, Tech
  parentName: string;
  parentPhone: string;
  enrolledClassIds: string[];
  enrollmentDate: string; // YYYY-MM-DD
  photoUrl: string;
  status: 'active' | 'inactive';
  qrCode: string; // TP-STU-001
  barcode: string;
  hasFreeCard?: boolean;
  discountPercent?: number; // 0 - 100
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string; // e.g. TCH-001
  name: string;
  sinhalaName?: string;
  phone: string;
  email: string;
  nic: string;
  qualifications: string;
  subjectIds: string[];
  classIds: string[];
  salaryType: 'percentage' | 'fixed_per_student' | 'monthly_fixed';
  salaryRate: number; // e.g. 80% or 1500 LKR
  photoUrl: string;
  status: 'active' | 'inactive';
  bankDetails?: {
    bank: string;
    branch: string;
    accountNumber: string;
    accountName: string;
  };
  joinedDate: string;
  notes?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  sinhalaName: string;
  code: string;
  grade: string;
  stream?: string;
  defaultFee: number; // in LKR
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TuitionClass {
  id: string; // CLS-001
  name: string;
  subjectId: string;
  teacherId: string;
  grade: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "08:00"
  endTime: string; // "11:30"
  hallNumber: string;
  monthlyFee: number; // LKR
  branchId: string;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  name: string;
  sinhalaName: string;
  address: string;
  phone: string;
  contactPerson: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  status: AttendanceStatus;
  method: 'qr_scanner' | 'manual';
  markedBy: string;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';
export type PaymentStatus = 'paid' | 'partial' | 'free_card';

export interface PaymentRecord {
  id: string;
  receiptNumber: string; // REC-2026-0001
  studentId: string;
  classId: string;
  month: string; // YYYY-MM (e.g. "2026-03")
  feeAmount: number; // regular fee
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string; // YYYY-MM-DD HH:mm
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  cashierName: string;
  notes?: string;
}

export type ExpenseCategory = 
  | 'teacher_payout'
  | 'building_rent'
  | 'electricity_water'
  | 'stationery_printing'
  | 'staff_salary'
  | 'advertising'
  | 'maintenance'
  | 'other';

export interface ExpenseRecord {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number; // LKR
  date: string; // YYYY-MM-DD
  paidTo: string;
  teacherId?: string;
  classId?: string;
  receiptRef?: string;
  notes?: string;
}

export interface ExamMarkItem {
  studentId: string;
  marks: number;
  grade: 'A' | 'B' | 'C' | 'S' | 'F';
  rank?: number;
  remarks?: string;
}

export interface ExamRecord {
  id: string;
  title: string;
  classId: string;
  date: string;
  totalMarks: number;
  marksList: ExamMarkItem[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'payment' | 'attendance' | 'exam';
  createdAt: string;
  read: boolean;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
