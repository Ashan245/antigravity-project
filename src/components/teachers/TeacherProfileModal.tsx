import React from 'react';
import { Teacher } from '../../types';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { formatLKR } from '../../utils/formatters';
import { X, Calendar, BookOpen, DollarSign, Building, Phone, Mail, Award } from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onCalculatePayout?: (teacher: Teacher) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onCalculatePayout
}) => {
  const { classes, subjects, students, expenses } = useData();

  if (!isOpen || !teacher) return null;

  const teacherClasses = classes.filter(c => c.teacherId === teacher.id);
  const teacherSubjects = subjects.filter(s => teacher.subjectIds?.includes(s.id));

  // Count total active students taught by this teacher across classes
  const teacherClassIds = teacherClasses.map(c => c.id);
  const totalStudents = students.filter(
    s => s.status === 'active' && s.enrolledClassIds?.some(cid => teacherClassIds.includes(cid))
  ).length;

  // Teacher payout history
  const teacherPayouts = expenses.filter(e => e.teacherId === teacher.id || e.category === 'teacher_payout' && e.paidTo?.includes(teacher.name));
  const totalPaidOut = teacherPayouts.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <img
              src={teacher.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
              alt={teacher.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-100 dark:ring-primary-950/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  {teacher.id}
                </span>
                <Badge status={teacher.status} size="sm" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {teacher.name}
              </h3>
              {teacher.sinhalaName && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {teacher.sinhalaName} • {teacher.qualifications}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500">පන්ති ගණන</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{teacherClasses.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500">ඉගෙනුම ලබන සිසුන්</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{totalStudents}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500">ගෙවූ වැටුප් (Total)</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{formatLKR(totalPaidOut)}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">දුරකථන අංකය:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{teacher.phone}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">විද්‍යුත් තැපෑල:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{teacher.email || '-'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">ජාතික හැඳුනුම්පත (NIC):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{teacher.nic || '-'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">ගෙවීම් ක්‍රමය & ප්‍රතිශතය:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {teacher.salaryType === 'percentage' ? `${teacher.salaryRate}% කොමිස්` : `රු. ${teacher.salaryRate} (Fixed)`}
              </span>
            </div>
          </div>

          {/* Classes Taught */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              පවත්වනු ලබන පන්ති ({teacherClasses.length})
            </h4>
            <div className="space-y-2">
              {teacherClasses.map(cls => (
                <div key={cls.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{cls.name}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cls.dayOfWeek} • {cls.startTime} - {cls.endTime} • {cls.hallNumber}</p>
                  </div>
                  <span className="font-bold text-primary-600">රු. {cls.monthlyFee.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          {teacher.bankDetails && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>බැංකු ගිණුම් විස්තර</span>
              </h4>
              <p><span className="text-slate-500">බැංකුව:</span> <span className="font-semibold">{teacher.bankDetails.bank}</span></p>
              <p><span className="text-slate-500">ශාඛාව:</span> <span className="font-semibold">{teacher.bankDetails.branch}</span></p>
              <p><span className="text-slate-500">ගිණුම් අංකය:</span> <span className="font-mono font-bold">{teacher.bankDetails.accountNumber}</span></p>
              <p><span className="text-slate-500">ගිණුමේ නම:</span> <span className="font-semibold">{teacher.bankDetails.accountName}</span></p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            වසන්න
          </button>
          {onCalculatePayout && (
            <button
              onClick={() => {
                onClose();
                onCalculatePayout(teacher);
              }}
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 active:scale-95"
            >
              වැටුප් ගණනය සහ ගෙවීම්
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
