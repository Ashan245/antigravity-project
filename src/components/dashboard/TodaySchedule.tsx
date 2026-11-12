import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DayOfWeek, TuitionClass } from '../../types';
import { SINHALA_DAYS } from '../../utils/formatters';
import { Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

interface TodayScheduleProps {
  onOpenScanner?: (classId: string) => void;
}

const DAYS_LIST: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ onOpenScanner }) => {
  const { classes, teachers, subjects, attendance, students } = useData();
  
  // Current day of week
  const todayIndex = new Date().getDay();
  const currentDayName = DAYS_LIST[todayIndex];
  
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentDayName);

  const dayClasses = classes.filter(c => c.dayOfWeek === selectedDay && c.status === 'active');
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              පන්ති කාලසටහන
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedDay === currentDayName ? 'අද දින පැවැත්වෙන පන්ති' : `${SINHALA_DAYS[selectedDay]} පන්ති`}
          </p>
        </div>

        {/* Day selector tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {DAYS_LIST.map((day) => {
            const isSelected = day === selectedDay;
            const isToday = day === currentDayName;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {day.slice(0, 3)} {isToday && '•'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {dayClasses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              මෙම දිනයේ පැවැත්වෙන පන්ති නොමැත.
            </p>
          </div>
        ) : (
          dayClasses.map((cls) => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const subject = subjects.find(s => s.id === cls.subjectId);
            const enrolledCount = students.filter(s => s.enrolledClassIds.includes(cls.id) && s.status === 'active').length;
            const attendedCount = attendance.filter(a => a.classId === cls.id && a.date === todayStr && (a.status === 'present' || a.status === 'late')).length;

            return (
              <div key={cls.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                      {cls.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cls.name}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      <span>{cls.startTime} - {cls.endTime}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {teacher?.sinhalaName || teacher?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cls.hallNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{attendedCount} / {enrolledCount} පැමිණි</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      ගාස්තුව: රු. {cls.monthlyFee.toLocaleString()}
                    </span>
                  </div>

                  {onOpenScanner && (
                    <button
                      onClick={() => onOpenScanner(cls.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      QR ස්කෑන්
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
