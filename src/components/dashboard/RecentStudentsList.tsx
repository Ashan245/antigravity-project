import React from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { Badge } from '../common/Badge';
import { Users, QrCode, ArrowRight } from 'lucide-react';
import { formatSinhalaDate } from '../../utils/formatters';

interface RecentStudentsListProps {
  onViewStudent: (student: Student) => void;
  onOpenQRCard: (student: Student) => void;
  onViewAllStudents: () => void;
}

export const RecentStudentsList: React.FC<RecentStudentsListProps> = ({
  onViewStudent,
  onOpenQRCard,
  onViewAllStudents
}) => {
  const { students } = useData();

  // Get 5 most recently created students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            මෑතකදී ලියාපදිංචි වූ සිසුන්
          </h3>
        </div>
        <button
          onClick={onViewAllStudents}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          <span>සියල්ල බලන්න</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {recentStudents.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">සිසුන් ලියාපදිංචි කර නොමැත</p>
        ) : (
          recentStudents.map((student) => (
            <div
              key={student.id}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      onClick={() => onViewStudent(student)}
                      className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-primary-600 cursor-pointer"
                    >
                      {student.sinhalaName || student.name}
                    </p>
                    <span className="text-[10px] text-slate-400">({student.id})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {student.school} • {student.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge status={student.status} size="sm" />
                <button
                  onClick={() => onOpenQRCard(student)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="QR හැඳුනුම්පත"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
