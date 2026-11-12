import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { TodaySchedule } from './TodaySchedule';
import { RecentStudentsList } from './RecentStudentsList';
import { RecentPaymentsList } from './RecentPaymentsList';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Clock, 
  QrCode,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatLKR, formatSinhalaDate, getCurrentMonthString, getTodayDateString, SINHALA_DAYS } from '../../utils/formatters';
import { Student, PaymentRecord } from '../../types';

interface DashboardOverviewProps {
  onNavigateTo: (tab: any) => void;
  onOpenQRScanner: (classId?: string) => void;
  onViewStudent: (student: Student) => void;
  onOpenQRCard: (student: Student) => void;
  onPrintReceipt: (payment: PaymentRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTo,
  onOpenQRScanner,
  onViewStudent,
  onOpenQRCard,
  onPrintReceipt
}) => {
  const { students, teachers, classes, attendance, payments, subjects } = useData();

  const todayStr = getTodayDateString();
  const currentMonthStr = getCurrentMonthString();

  const [filterMonth, setFilterMonth] = useState<string>(currentMonthStr);

  // 1. Total students
  const activeStudentsCount = students.filter(s => s.status === 'active').length;
  const totalStudentsCount = students.length;

  // 2. Total teachers
  const totalTeachersCount = teachers.filter(t => t.status === 'active').length;

  // 3. Today's classes
  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayClasses = classes.filter(c => c.dayOfWeek === todayDayName && c.status === 'active');
  const todayClassesCount = todayClasses.length;

  // 4. Today's present students
  const todayPresentAttendance = attendance.filter(
    a => a.date === todayStr && (a.status === 'present' || a.status === 'late')
  );
  // Count unique students present today
  const uniqueStudentsPresentToday = new Set(todayPresentAttendance.map(a => a.studentId)).size;

  // 5. Today's absent students (from today's scheduled classes)
  const todayEnrolledStudentIds = new Set(
    students
      .filter(s => s.status === 'active' && s.enrolledClassIds.some(cid => todayClasses.map(tc => tc.id).includes(cid)))
      .map(s => s.id)
  );
  const totalExpectedToday = todayEnrolledStudentIds.size;
  const todayAbsentCount = Math.max(0, totalExpectedToday - uniqueStudentsPresentToday);

  // 6. This month received income (LKR)
  const thisMonthPayments = payments.filter(
    p => p.month === filterMonth || p.paymentDate.startsWith(filterMonth)
  );
  const thisMonthIncome = thisMonthPayments.reduce((sum, p) => sum + p.paidAmount, 0);

  // 7. Pending / due payments (LKR)
  const thisMonthDue = thisMonthPayments.reduce((sum, p) => sum + p.dueAmount, 0);

  // 9. Class-wise distribution
  const classDistribution = classes.map(cls => {
    const count = students.filter(s => s.enrolledClassIds.includes(cls.id) && s.status === 'active').length;
    return {
      ...cls,
      studentCount: count
    };
  }).sort((a, b) => b.studentCount - a.studentCount);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-primary-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Sparkles className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatSinhalaDate(todayStr)} • {SINHALA_DAYS[todayDayName as any]}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ප්‍රධාන පරිපාලක පාලක පුවරුව
            </h2>
            <p className="text-sm text-indigo-100/90 max-w-xl">
              TUITION PRO හරහා ආයතනයේ පැමිණීම්, ආදායම්, සිසුන් හා ගුරු මණ්ඩලය සජීවීව පාලනය කරන්න.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQRScanner()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 font-bold text-sm shadow-lg shadow-black/10 hover:bg-indigo-50 active:scale-95 transition-all"
            >
              <QrCode className="w-5 h-5 text-indigo-700" />
              <span>QR පැමිණීම සටහන් කරන්න</span>
            </button>

            <button
              onClick={() => onNavigateTo('payments')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500/30 hover:bg-indigo-500/40 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <Wallet className="w-5 h-5" />
              <span>ගාස්තු අය කරන්න</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date & Month Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>දත්ත පෙරහන (Filter by Month):</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setFilterMonth(currentMonthStr)}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            වත්මන් මාසය
          </button>
        </div>
      </div>

      {/* 7 Required Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Students */}
        <StatCard
          title="TOTAL STUDENTS"
          sinhalaTitle="මුළු සිසුන් ගණන"
          value={totalStudentsCount}
          subValue={`සක්‍රිය: ${activeStudentsCount} | අක්‍රිය: ${totalStudentsCount - activeStudentsCount}`}
          icon={Users}
          colorScheme="indigo"
          onClick={() => onNavigateTo('students')}
        />

        {/* 2. Total Teachers */}
        <StatCard
          title="TOTAL TEACHERS"
          sinhalaTitle="මුළු ගුරුවරුන් ගණන"
          value={totalTeachersCount}
          subValue={`විෂයයන් ${subjects.length} ක් ආවරණය කරයි`}
          icon={UserCheck}
          colorScheme="sky"
          onClick={() => onNavigateTo('teachers')}
        />

        {/* 3. Today's Classes */}
        <StatCard
          title="TODAY'S CLASSES"
          sinhalaTitle="අද පැවැත්වෙන පන්ති"
          value={todayClassesCount}
          subValue={todayClassesCount > 0 ? `අද දින පන්ති ${todayClassesCount} ක් ක්‍රියාත්මකයි` : 'අද පන්ති නොමැත'}
          icon={Calendar}
          colorScheme="purple"
          onClick={() => onNavigateTo('classes')}
        />

        {/* 4. Today Present */}
        <StatCard
          title="TODAY'S ATTENDANCE"
          sinhalaTitle="අද පැමිණි සිසුන් ගණන"
          value={uniqueStudentsPresentToday}
          subValue={`අපේක්ෂිත සිසුන්: ${totalExpectedToday}`}
          icon={CheckCircle2}
          colorScheme="emerald"
          onClick={() => onNavigateTo('attendance')}
        />

        {/* 5. Today Absent */}
        <StatCard
          title="TODAY'S ABSENTEES"
          sinhalaTitle="අද නොපැමිණි සිසුන්"
          value={todayAbsentCount}
          subValue="නොපැමිණීමේ අනුපාතය"
          icon={XCircle}
          colorScheme="rose"
          onClick={() => onNavigateTo('attendance')}
        />

        {/* 6. This Month Income */}
        <StatCard
          title="MONTHLY REVENUE"
          sinhalaTitle="මෙම මාසයේ ලැබුණු මුදල්"
          value={formatLKR(thisMonthIncome)}
          subValue={`රිසිට්පත් ${thisMonthPayments.length} ක් නිකුත් කර ඇත`}
          icon={Wallet}
          colorScheme="emerald"
          onClick={() => onNavigateTo('payments')}
        />

        {/* 7. Pending / Due Payments */}
        <StatCard
          title="PENDING DUES"
          sinhalaTitle="ලැබීමට ඇති හිඟ මුදල්"
          value={formatLKR(thisMonthDue)}
          subValue="අර්ධ හා හිඟ ගෙවීම් ශේෂය"
          icon={Clock}
          colorScheme="amber"
          onClick={() => onNavigateTo('payments')}
        />

        {/* Quick Action: Start Scanner Card */}
        <div 
          onClick={() => onOpenQRScanner()}
          className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-primary-600 text-white shadow-md group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h4 className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            QR Scanner සක්‍රිය කරන්න
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            කැමරාව මගින් හෝ QR අංකය මගින් පැමිණීම ගන්න
          </p>
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Students per class breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                පන්ති අනුව සිසුන් සංඛ්‍යාව
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {classes.length} පන්ති
            </span>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto space-y-3 max-h-80">
            {classDistribution.map((cls) => {
              const maxClassStudents = Math.max(...classDistribution.map(c => c.studentCount), 1);
              const percent = Math.round((cls.studentCount / maxClassStudents) * 100);

              return (
                <div key={cls.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                      {cls.name}
                    </span>
                    <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0">
                      {cls.studentCount} සිසුන්
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-primary-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule component */}
      <TodaySchedule onOpenScanner={(classId) => onOpenQRScanner(classId)} />

      {/* Bottom Row: Recent Students & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentStudentsList
          onViewStudent={onViewStudent}
          onOpenQRCard={onOpenQRCard}
          onViewAllStudents={() => onNavigateTo('students')}
        />

        <RecentPaymentsList
          onPrintReceipt={onPrintReceipt}
          onViewAllPayments={() => onNavigateTo('payments')}
        />
      </div>
    </div>
  );
};
