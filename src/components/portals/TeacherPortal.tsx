import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Teacher } from '../../types';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { AttendanceScanner } from '../attendance/AttendanceScanner';
import { 
  UserCheck, 
  Calendar, 
  Users, 
  QrCode, 
  DollarSign, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const { teachers, classes, students, attendance, expenses } = useData();
  const { currentTeacher, setCurrentTeacher } = useAuth();

  // Pick teacher if not set
  const activeTeacher: Teacher = currentTeacher || teachers[0];

  const [scannerClassId, setScannerClassId] = useState<string | null>(null);

  const teacherClasses = classes.filter(c => c.teacherId === activeTeacher.id);
  const teacherClassIds = teacherClasses.map(c => c.id);

  const enrolledStudents = students.filter(
    s => s.status === 'active' && s.enrolledClassIds?.some(cid => teacherClassIds.includes(cid))
  );

  const teacherPayouts = expenses.filter(e => e.teacherId === activeTeacher.id);
  const totalEarnings = teacherPayouts.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Teacher Switcher */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={activeTeacher.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
            alt={activeTeacher.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>ගුරු පිවිසුම (Teacher Portal)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {activeTeacher.sinhalaName || activeTeacher.name}
            </h2>
            <p className="text-xs text-emerald-100">
              {activeTeacher.qualifications} • {activeTeacher.id}
            </p>
          </div>
        </div>

        {/* Change Teacher Dropdown for quick testing */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <label className="block text-[10px] font-bold text-emerald-200 mb-1">
            ගුරු ගිණුම මාරු කරන්න:
          </label>
          <select
            value={activeTeacher.id}
            onChange={(e) => {
              const t = teachers.find(tch => tch.id === e.target.value);
              if (t) setCurrentTeacher(t);
            }}
            className="bg-emerald-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/40 focus:outline-none"
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.sinhalaName || t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">පවත්වන පන්ති</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{teacherClasses.length} පන්ති</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">මුළු සිසුන් සංඛ්‍යාව</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{enrolledStudents.length} සිසුන්</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">ගෙවීම් ක්‍රමය</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {activeTeacher.salaryType === 'percentage' ? `${activeTeacher.salaryRate}% කොමිස්` : `රු. ${activeTeacher.salaryRate}`}
          </p>
        </div>
      </div>

      {/* Embedded Scanner if active */}
      {scannerClassId && (
        <AttendanceScanner
          initialClassId={scannerClassId}
          onClose={() => setScannerClassId(null)}
        />
      )}

      {/* Teacher Classes */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          <span>ඔබගේ පන්ති කාලසටහන සහ QR පැමිණීම</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacherClasses.map(cls => {
            const classStudentsCount = students.filter(s => s.enrolledClassIds?.includes(cls.id) && s.status === 'active').length;
            const todayStr = new Date().toISOString().split('T')[0];
            const presentTodayCount = attendance.filter(a => a.classId === cls.id && a.date === todayStr && (a.status === 'present' || a.status === 'late')).length;

            return (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {cls.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{cls.grade}</span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">
                    {cls.name}
                  </h4>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{cls.dayOfWeek} • {cls.startTime} - {cls.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{cls.hallNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{presentTodayCount} / {classStudentsCount}</span>
                    <span className="text-slate-400 ml-1">අද පැමිණි</span>
                  </div>

                  <button
                    onClick={() => setScannerClassId(cls.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR ස්කෑනරය අරඹන්න</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
