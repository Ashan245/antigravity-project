import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  Teacher,
  TuitionClass,
  Subject,
  Branch,
  AttendanceRecord,
  PaymentRecord,
  ExpenseRecord,
  ExamRecord,
  AppNotification
} from '../types';
import {
  initialStudents,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialBranches,
  initialAttendance,
  initialPayments,
  initialExpenses,
  initialExams,
  initialNotifications
} from '../data/initialData';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  classes: TuitionClass[];
  subjects: Subject[];
  branches: Branch[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  exams: ExamRecord[];
  notifications: AppNotification[];
  isSyncing: boolean;
  lastSyncedAt: Date | null;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'qrCode' | 'barcode'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  toggleStudentStatus: (id: string) => void;
  deleteStudent: (id: string) => void;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'createdAt'>) => Teacher;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  toggleTeacherStatus: (id: string) => void;
  deleteTeacher: (id: string) => void;

  // Class Actions
  addClass: (cls: Omit<TuitionClass, 'id'>) => TuitionClass;
  updateClass: (id: string, updates: Partial<TuitionClass>) => void;
  deleteClass: (id: string) => void;

  // Subject Actions
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Branch Actions
  addBranch: (branch: Omit<Branch, 'id'>) => Branch;
  updateBranch: (id: string, updates: Partial<Branch>) => void;

  // Attendance Actions
  markAttendance: (
    studentId: string,
    classId: string,
    status?: 'present' | 'late' | 'absent' | 'excused',
    method?: 'qr_scanner' | 'manual',
    notes?: string
  ) => { success: boolean; message: string; record?: AttendanceRecord };
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  deleteAttendance: (id: string) => void;

  // Payment Actions
  addPayment: (
    payment: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'paymentDate'>
  ) => PaymentRecord;
  updatePayment: (id: string, updates: Partial<PaymentRecord>) => void;

  // Expense Actions
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => ExpenseRecord;
  deleteExpense: (id: string) => void;

  // Exam Actions
  addExam: (exam: Omit<ExamRecord, 'id'>) => ExamRecord;
  updateExamMarks: (examId: string, studentId: string, marks: number, remarks?: string) => void;
  deleteExam: (id: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Backup & Restore
  exportBackupJSON: () => string;
  restoreFromJSON: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'tuition_pro_data_';

function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
  }
  return defaultVal;
}

function saveToStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage('teachers', initialTeachers));
  const [classes, setClasses] = useState<TuitionClass[]>(() => loadFromStorage('classes', initialClasses));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('subjects', initialSubjects));
  const [branches, setBranches] = useState<Branch[]>(() => loadFromStorage('branches', initialBranches));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', initialAttendance));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadFromStorage('payments', initialPayments));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadFromStorage('expenses', initialExpenses));
  const [exams, setExams] = useState<ExamRecord[]>(() => loadFromStorage('exams', initialExams));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', initialNotifications));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('teachers', teachers); }, [teachers]);
  useEffect(() => { saveToStorage('classes', classes); }, [classes]);
  useEffect(() => { saveToStorage('subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('branches', branches); }, [branches]);
  useEffect(() => { saveToStorage('attendance', attendance); }, [attendance]);
  useEffect(() => { saveToStorage('payments', payments); }, [payments]);
  useEffect(() => { saveToStorage('expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  // Firestore Sync if configured
  useEffect(() => {
    if (!isFirebaseConfigured() || !db) return;

    const syncWithFirestore = async () => {
      try {
        setIsSyncing(true);
        // Load collections from Firestore if available
        const studentsSnap = await getDocs(collection(db, 'students'));
        if (!studentsSnap.empty) {
          const loadedStudents = studentsSnap.docs.map(d => d.data() as Student);
          setStudents(loadedStudents);
        }
        setLastSyncedAt(new Date());
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncWithFirestore();
  }, []);

  // Sync item to Firestore helper
  const syncDocToFirestore = async (colName: string, id: string, data: any) => {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, colName, id), data);
      } catch (e) {
        console.warn(`Firestore write to ${colName}/${id} warning:`, e);
      }
    }
  };

  const deleteDocFromFirestore = async (colName: string, id: string) => {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, colName, id));
      } catch (e) {
        console.warn(`Firestore delete ${colName}/${id} warning:`, e);
      }
    }
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'qrCode' | 'barcode'>): Student => {
    const nextNum = students.length + 1;
    const year = new Date().getFullYear();
    const id = `STU-${String(nextNum).padStart(3, '0')}`;
    const qrCode = `TP-${id}`;
    const barcode = `984${year.toString().slice(-2)}${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newStudent: Student = {
      ...studentData,
      id,
      qrCode,
      barcode,
      createdAt: now,
      updatedAt: now
    };

    setStudents(prev => [newStudent, ...prev]);
    syncDocToFirestore('students', id, newStudent);

    // Add notification
    const notif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'නව සිසුවෙකු ලියාපදිංචි විය',
      message: `${newStudent.name} (${newStudent.id}) සාර්ථකව පද්ධතියට එක් කරන ලදී.`,
      type: 'info',
      createdAt: now,
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
        syncDocToFirestore('students', id, updated);
        return updated;
      }
      return s;
    }));
  };

  const toggleStudentStatus = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updated: Student = {
          ...s,
          status: s.status === 'active' ? 'inactive' : 'active',
          updatedAt: new Date().toISOString()
        };
        syncDocToFirestore('students', id, updated);
        return updated;
      }
      return s;
    }));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    deleteDocFromFirestore('students', id);
  };

  // Teacher Actions
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'createdAt'>): Teacher => {
    const nextNum = teachers.length + 1;
    const id = `TCH-${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTeacher: Teacher = {
      ...teacherData,
      id,
      createdAt: now
    };

    setTeachers(prev => [newTeacher, ...prev]);
    syncDocToFirestore('teachers', id, newTeacher);
    return newTeacher;
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        syncDocToFirestore('teachers', id, updated);
        return updated;
      }
      return t;
    }));
  };

  const toggleTeacherStatus = (id: string) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const updated: Teacher = {
          ...t,
          status: t.status === 'active' ? 'inactive' : 'active'
        };
        syncDocToFirestore('teachers', id, updated);
        return updated;
      }
      return t;
    }));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    deleteDocFromFirestore('teachers', id);
  };

  // Class Actions
  const addClass = (clsData: Omit<TuitionClass, 'id'>): TuitionClass => {
    const nextNum = classes.length + 1;
    const id = `CLS-${String(nextNum).padStart(2, '0')}`;
    const newClass: TuitionClass = { ...clsData, id };
    setClasses(prev => [...prev, newClass]);
    syncDocToFirestore('classes', id, newClass);
    return newClass;
  };

  const updateClass = (id: string, updates: Partial<TuitionClass>) => {
    setClasses(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        syncDocToFirestore('classes', id, updated);
        return updated;
      }
      return c;
    }));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    deleteDocFromFirestore('classes', id);
  };

  // Subject Actions
  const addSubject = (subData: Omit<Subject, 'id'>): Subject => {
    const nextNum = subjects.length + 1;
    const id = `SUB-${String(nextNum).padStart(2, '0')}`;
    const newSub: Subject = { ...subData, id };
    setSubjects(prev => [...prev, newSub]);
    syncDocToFirestore('subjects', id, newSub);
    return newSub;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        syncDocToFirestore('subjects', id, updated);
        return updated;
      }
      return s;
    }));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    deleteDocFromFirestore('subjects', id);
  };

  // Branch Actions
  const addBranch = (branchData: Omit<Branch, 'id'>): Branch => {
    const nextNum = branches.length + 1;
    const id = `BR-${String(nextNum).padStart(2, '0')}`;
    const newBranch: Branch = { ...branchData, id };
    setBranches(prev => [...prev, newBranch]);
    syncDocToFirestore('branches', id, newBranch);
    return newBranch;
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, ...updates };
        syncDocToFirestore('branches', id, updated);
        return updated;
      }
      return b;
    }));
  };

  // Attendance Actions with duplicate checking!
  const markAttendance = (
    studentId: string,
    classId: string,
    status: 'present' | 'late' | 'absent' | 'excused' = 'present',
    method: 'qr_scanner' | 'manual' = 'qr_scanner',
    notes?: string
  ): { success: boolean; message: string; record?: AttendanceRecord } => {
    const today = new Date().toISOString().split('T')[0];

    // Find student
    const student = students.find(s => s.id === studentId || s.qrCode === studentId);
    if (!student) {
      return { success: false, message: 'සිසුවා හඳුනාගත නොහැකි විය (Student not found).' };
    }

    if (student.status === 'inactive') {
      return { success: false, message: `${student.name} අක්‍රිය කර ඇත (Student is inactive).` };
    }

    // Check duplicate on same day for same class
    const existing = attendance.find(
      a => a.studentId === student.id && a.classId === classId && a.date === today
    );

    if (existing) {
      return {
        success: false,
        message: `මෙම සිසුවාගේ පැමිණීම අද දින දැනටමත් සටහන් කර ඇත! (${existing.time} ට සටහන් විය)`,
        record: existing
      };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const id = `ATT-${Date.now().toString().slice(-6)}`;

    const newRecord: AttendanceRecord = {
      id,
      studentId: student.id,
      classId,
      date: today,
      time: timeStr,
      status,
      method,
      markedBy: method === 'qr_scanner' ? 'QR Camera Scanner' : 'Manual Entry',
      notes
    };

    setAttendance(prev => [newRecord, ...prev]);
    syncDocToFirestore('attendance', id, newRecord);

    return {
      success: true,
      message: `${student.name} (${student.id}) පැමිණීම සාර්ථකව සටහන් විය.`,
      record: newRecord
    };
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        syncDocToFirestore('attendance', id, updated);
        return updated;
      }
      return a;
    }));
  };

  const deleteAttendance = (id: string) => {
    setAttendance(prev => prev.filter(a => a.id !== id));
    deleteDocFromFirestore('attendance', id);
  };

  // Payment Actions
  const addPayment = (
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'paymentDate'>
  ): PaymentRecord => {
    const year = new Date().getFullYear();
    const count = payments.length + 1;
    const receiptNumber = `REC-${year}-${String(count).padStart(4, '0')}`;
    const id = `PAY-${Date.now().toString().slice(-6)}`;

    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const newPayment: PaymentRecord = {
      ...paymentData,
      id,
      receiptNumber,
      paymentDate: dateStr
    };

    setPayments(prev => [newPayment, ...prev]);
    syncDocToFirestore('payments', id, newPayment);

    // Add notification
    const student = students.find(s => s.id === paymentData.studentId);
    const notif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'නව ගෙවීමක් සටහන් විය',
      message: `${receiptNumber}: ${student?.name || paymentData.studentId} විසින් රු. ${paymentData.paidAmount.toLocaleString()} ක් ගෙවන ලදී.`,
      type: 'payment',
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<PaymentRecord>) => {
    setPayments(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        syncDocToFirestore('payments', id, updated);
        return updated;
      }
      return p;
    }));
  };

  // Expense Actions
  const addExpense = (expenseData: Omit<ExpenseRecord, 'id'>): ExpenseRecord => {
    const id = `EXP-${Date.now().toString().slice(-6)}`;
    const newExpense: ExpenseRecord = { ...expenseData, id };
    setExpenses(prev => [newExpense, ...prev]);
    syncDocToFirestore('expenses', id, newExpense);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    deleteDocFromFirestore('expenses', id);
  };

  // Exam Actions
  const addExam = (examData: Omit<ExamRecord, 'id'>): ExamRecord => {
    const id = `EXAM-${Date.now().toString().slice(-6)}`;
    const newExam: ExamRecord = { ...examData, id };
    setExams(prev => [newExam, ...prev]);
    syncDocToFirestore('exams', id, newExam);
    return newExam;
  };

  const updateExamMarks = (examId: string, studentId: string, marks: number, remarks?: string) => {
    setExams(prev => prev.map(ex => {
      if (ex.id === examId) {
        let grade: 'A' | 'B' | 'C' | 'S' | 'F' = 'F';
        if (marks >= 75) grade = 'A';
        else if (marks >= 65) grade = 'B';
        else if (marks >= 50) grade = 'C';
        else if (marks >= 35) grade = 'S';

        const existingItem = ex.marksList.find(m => m.studentId === studentId);
        let updatedList;
        if (existingItem) {
          updatedList = ex.marksList.map(m => m.studentId === studentId ? { ...m, marks, grade, remarks } : m);
        } else {
          updatedList = [...ex.marksList, { studentId, marks, grade, remarks }];
        }

        // Sort by marks desc to compute rank
        const sorted = [...updatedList].sort((a, b) => b.marks - a.marks);
        const rankedList = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));

        const updatedExam = { ...ex, marksList: rankedList };
        syncDocToFirestore('exams', examId, updatedExam);
        return updatedExam;
      }
      return ex;
    }));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    deleteDocFromFirestore('exams', id);
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Backup & Restore
  const exportBackupJSON = (): string => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      students,
      teachers,
      classes,
      subjects,
      branches,
      attendance,
      payments,
      expenses,
      exams,
      notifications
    };
    return JSON.stringify(backupData, null, 2);
  };

  const restoreFromJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      if (data.teachers && Array.isArray(data.teachers)) setTeachers(data.teachers);
      if (data.classes && Array.isArray(data.classes)) setClasses(data.classes);
      if (data.subjects && Array.isArray(data.subjects)) setSubjects(data.subjects);
      if (data.branches && Array.isArray(data.branches)) setBranches(data.branches);
      if (data.attendance && Array.isArray(data.attendance)) setAttendance(data.attendance);
      if (data.payments && Array.isArray(data.payments)) setPayments(data.payments);
      if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (data.exams && Array.isArray(data.exams)) setExams(data.exams);
      if (data.notifications && Array.isArray(data.notifications)) setNotifications(data.notifications);
      return true;
    } catch (err) {
      console.error('Failed to restore backup', err);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setBranches(initialBranches);
    setAttendance(initialAttendance);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setExams(initialExams);
    setNotifications(initialNotifications);
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        classes,
        subjects,
        branches,
        attendance,
        payments,
        expenses,
        exams,
        notifications,
        isSyncing,
        lastSyncedAt,
        addStudent,
        updateStudent,
        toggleStudentStatus,
        deleteStudent,
        addTeacher,
        updateTeacher,
        toggleTeacherStatus,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        addBranch,
        updateBranch,
        markAttendance,
        updateAttendance,
        deleteAttendance,
        addPayment,
        updatePayment,
        addExpense,
        deleteExpense,
        addExam,
        updateExamMarks,
        deleteExam,
        markNotificationRead,
        clearNotifications,
        exportBackupJSON,
        restoreFromJSON,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
