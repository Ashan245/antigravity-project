import React, { useState } from 'react';
import { Student } from '../../types';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { 
  X, 
  User, 
  Calendar, 
  CreditCard, 
  Award, 
  Phone, 
  School, 
  MapPin, 
  QrCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onOpenQRCard: (student: Student) => void;
  onCollectPayment: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  student,
  onClose,
  onOpenQRCard,
  onCollectPayment
}) => {
  const { classes, attendance, payments, exams } = useData();
  const [activeTab, setActiveTab] = useState<'info' | 'attendance' | 'payments' | 'exams'>('info');

  if (!isOpen || !student) return null;

  const studentClasses = classes.filter(c => student.enrolledClassIds?.includes(c.id));
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentPayments = payments.filter(p => p.studentId === student.id);

  // Student exam marks
  const studentExams = exams.map(ex => {
    const markItem = ex.marksList.find(m => m.studentId === student.id);
    return {
      exam: ex,
      mark: markItem
    };
  }).filter(item => item.mark !== undefined);

  // Attendance rate
  const presentCount = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : 100;

  // Total paid
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDue = studentPayments.reduce((sum, p) => sum + p.dueAmount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <img
              src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-100 dark:ring-primary-950/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  {student.id}
                </span>
                <Badge status={student.status} size="sm" />
                {student.hasFreeCard && <Badge status="free_card" size="sm" />}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {student.name}
              </h3>
              {student.sinhalaName && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {student.sinhalaName} • {student.school}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQRCard(student)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="QR කාඩ්පත බලන්න"
            >
              <QrCode className="w-5 h-5 text-primary-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 my-4 pb-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'info'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            තොරතුරු (Details)
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>පැමිණීම ({studentAttendance.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ගෙවීම් ({studentPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'exams'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>විභාග ලකුණු ({studentExams.length})</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="max-h-[55vh] overflow-y-auto pr-1">
          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Quick stats chips */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">පැමිණීමේ ප්‍රතිශතය</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{attendanceRate}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">මුළු ගෙවූ මුදල</span>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{formatLKR(totalPaid)}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">හිඟ මුදල්</span>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{formatLKR(totalDue)}</p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">දුරකථන අංකය:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">WhatsApp අංකය:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.whatsapp || '-'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">දෙමාපිය නම & දුරකථනය:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.parentName} ({student.parentPhone})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">ලිපිනය:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.address || '-'}</span>
                </div>
              </div>

              {/* Registered Classes */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ලියාපදිංචි වී ඇති පන්ති ({studentClasses.length})
                </h4>
                <div className="space-y-2">
                  {studentClasses.map(cls => (
                    <div key={cls.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{cls.name}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{cls.dayOfWeek} • {cls.startTime} - {cls.endTime} • {cls.hallNumber}</p>
                      </div>
                      <span className="font-extrabold text-primary-600 dark:text-primary-400">
                        රු. {cls.monthlyFee.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-2">
              {studentAttendance.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">පැමිණීම් සටහන් වී නොමැත</p>
              ) : (
                studentAttendance.map(att => {
                  const cls = classes.find(c => c.id === att.classId);
                  return (
                    <div key={att.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{cls?.name || att.classId}</p>
                        <p className="text-[11px] text-slate-400">{att.date} • වේලාව: {att.time} ({att.method})</p>
                      </div>
                      <Badge status={att.status} size="sm" />
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-2">
              {studentPayments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">ගෙවීම් සටහන් වී නොමැත</p>
              ) : (
                studentPayments.map(pay => {
                  const cls = classes.find(c => c.id === pay.classId);
                  return (
                    <div key={pay.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#{pay.receiptNumber}</span>
                          <span className="text-[10px] text-slate-400">{pay.paymentDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{cls?.name || 'පන්ති ගාස්තු'} • {pay.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{formatLKR(pay.paidAmount)}</span>
                        <div><Badge status={pay.status} size="sm" /></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-2">
              {studentExams.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">විභාග ලකුණු සටහන් වී නොමැත</p>
              ) : (
                studentExams.map(({ exam, mark }) => (
                  <div key={exam.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{exam.title}</p>
                      <p className="text-[11px] text-slate-400">{exam.date} • මුළු ලකුණු: {exam.totalMarks}</p>
                      {mark?.remarks && <p className="text-[10px] text-primary-600 mt-0.5">{mark.remarks}</p>}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{mark?.marks}</span>
                      <span className="text-[10px] text-slate-400"> / {exam.totalMarks}</span>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 text-xs">
                          Grade: {mark?.grade}
                        </span>
                        {mark?.rank && (
                          <span className="font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 text-xs">
                            Rank: {mark.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <button
            onClick={() => onOpenQRCard(student)}
            className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
          >
            <QrCode className="w-4 h-4" />
            <span>QR කාඩ්පත ලබාගන්න</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onCollectPayment(student);
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            ගාස්තු අය කරන්න (Collect Fee)
          </button>
        </div>
      </div>
    </div>
  );
};
