import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { Badge } from '../common/Badge';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  CreditCard, 
  Award, 
  Phone, 
  AlertCircle 
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const { students, classes, attendance, payments, exams } = useData();
  const { currentStudent, setCurrentStudent } = useAuth();

  const activeStudent: Student = currentStudent || students[0];

  const studentClasses = classes.filter(c => activeStudent.enrolledClassIds?.includes(c.id));
  const studentAttendance = attendance.filter(a => a.studentId === activeStudent.id);
  const studentPayments = payments.filter(p => p.studentId === activeStudent.id);

  // Today attendance check
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = studentAttendance.filter(a => a.date === todayStr);

  // Dues
  const totalDue = studentPayments.reduce((sum, p) => sum + p.dueAmount, 0);

  // Student exam marks
  const studentExams = exams.map(ex => {
    const markItem = ex.marksList.find(m => m.studentId === activeStudent.id);
    return { exam: ex, mark: markItem };
  }).filter(item => item.mark !== undefined);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>දෙමාපිය පිවිසුම (Parent Portal)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {activeStudent.parentName || 'දෙමාපිය භාරකරු'}
          </h2>
          <p className="text-xs text-purple-100">
            ඔබගේ දරුවා: <span className="font-bold underline">{activeStudent.sinhalaName || activeStudent.name}</span> ({activeStudent.id}) • {activeStudent.grade}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <label className="block text-[10px] font-bold text-purple-200 mb-1">දරුවා තෝරන්න:</label>
          <select
            value={activeStudent.id}
            onChange={(e) => {
              const s = students.find(st => st.id === e.target.value);
              if (s) setCurrentStudent(s);
            }}
            className="bg-purple-950 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900">
                {s.sinhalaName || s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Today Attendance Alert for Parent */}
      <div className={`p-5 rounded-3xl border ${todayRecords.length > 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${todayRecords.length > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {todayRecords.length > 0 ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm">
              {todayRecords.length > 0 ? 'අද දින පන්තියට පැමිණීම සටහන් වී ඇත' : 'අද දින තවමත් පැමිණීම සටහන් වී නොමැත'}
            </h4>
            <p className="text-xs opacity-80 mt-0.5">
              {todayRecords.length > 0
                ? `${todayRecords[0].time} වේලාවට QR මගින් සාර්ථකව පන්තියට ඇතුළත් විය.`
                : 'පන්ති ආරම්භයේදී QR ස්කෑන් කිරීමෙන් පසු මෙම තොරතුරු සජීවීව යාවත්කාලීන වේ.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2 columns: Exam Results & Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam marks */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>විභාග ප්‍රගතිය සහ ලකුණු (Exam Progress)</span>
          </h3>

          <div className="space-y-3">
            {studentExams.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">විභාග ලකුණු වාර්තා වී නොමැත</p>
            ) : (
              studentExams.map(({ exam, mark }) => (
                <div key={exam.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{exam.title}</h4>
                    <p className="text-[10px] text-slate-400">{exam.date}</p>
                    {mark?.remarks && <p className="text-[11px] text-primary-600 mt-1 italic">{mark.remarks}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">{mark?.marks}</span>
                    <span className="text-[10px] text-slate-400"> / {exam.totalMarks}</span>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[10px]">
                        Grade: {mark?.grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fee status */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>පන්ති ගාස්තු තත්ත්වය (Fee Status)</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">ගෙවීමට ඇති හිඟ මුදල්:</span>
              <p className={`text-xl font-black mt-1 ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {totalDue > 0 ? formatLKR(totalDue) : 'හිඟ මුදල් නොමැත (All Paid)'}
              </p>
            </div>
            {totalDue > 0 ? (
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">Due</span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Clear</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-2">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300">ආයතන සම්බන්ධතා:</h4>
            <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary-600" />
              <span>ප්‍රධාන කාර්යාලය: 011-2824500 (පෙ.ව. 8.00 - ප.ව. 5.00)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
