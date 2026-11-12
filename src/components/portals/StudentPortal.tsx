import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { StudentQRCardModal } from '../students/StudentQRCardModal';
import { ReceiptModal } from '../finance/ReceiptModal';
import { Badge } from '../common/Badge';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { 
  User, 
  QrCode, 
  CreditCard, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Printer, 
  School 
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { students, classes, attendance, payments, exams } = useData();
  const { currentStudent, setCurrentStudent } = useAuth();

  const activeStudent: Student = currentStudent || students[0];

  const [isQRCardOpen, setIsQRCardOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  const studentClasses = classes.filter(c => activeStudent.enrolledClassIds?.includes(c.id));
  const studentAttendance = attendance.filter(a => a.studentId === activeStudent.id);
  const studentPayments = payments.filter(p => p.studentId === activeStudent.id);

  const presentCount = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : 100;

  const totalPaid = studentPayments.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-primary-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={activeStudent.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={activeStudent.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
              <User className="w-3.5 h-3.5" />
              <span>සිසු පිවිසුම (Student Portal)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {activeStudent.sinhalaName || activeStudent.name}
            </h2>
            <p className="text-xs text-sky-100">
              {activeStudent.id} • {activeStudent.school} • {activeStudent.grade}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsQRCardOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-sky-50 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 text-primary-600" />
            <span>මගේ QR කාඩ්පත</span>
          </button>

          {/* Switch active student dropdown */}
          <select
            value={activeStudent.id}
            onChange={(e) => {
              const s = students.find(stu => stu.id === e.target.value);
              if (s) setCurrentStudent(s);
            }}
            className="bg-indigo-950/80 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 focus:outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.sinhalaName || s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">පැමිණීමේ ප්‍රතිශතය</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{attendanceRate}%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">හදාරන පන්ති ගණන</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{studentClasses.length} පන්ති</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">ගෙවූ මුළු මුදල</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatLKR(totalPaid)}</p>
        </div>
      </div>

      {/* 2 columns: Enrolled Classes & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Classes */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span>මගේ පන්ති කාලසටහන</span>
          </h3>

          <div className="space-y-3">
            {studentClasses.map(cls => (
              <div key={cls.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{cls.name}</h4>
                  <p className="text-slate-500 mt-1">{cls.dayOfWeek} • {cls.startTime} - {cls.endTime} • {cls.hallNumber}</p>
                </div>
                <span className="font-extrabold text-primary-600 dark:text-primary-400">{formatLKR(cls.monthlyFee)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Receipts */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>ගෙවීම් රිසිට්පත් ඉතිහාසය</span>
          </h3>

          <div className="space-y-2">
            {studentPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">ගෙවීම් සටහන් නොමැත</p>
            ) : (
              studentPayments.map(pay => (
                <div key={pay.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">#{pay.receiptNumber}</span>
                    <span className="text-[10px] text-slate-400">{pay.paymentDate} • {pay.month}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600">{formatLKR(pay.paidAmount)}</span>
                    <button
                      onClick={() => setActiveReceipt(pay)}
                      className="p-1.5 rounded-lg border hover:bg-slate-100"
                      title="රිසිට්පත මුද්‍රණය"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <StudentQRCardModal
        isOpen={isQRCardOpen}
        student={activeStudent}
        onClose={() => setIsQRCardOpen(false)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!activeReceipt}
        payment={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
