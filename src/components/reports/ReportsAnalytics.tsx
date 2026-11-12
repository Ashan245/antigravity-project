import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatLKR, formatSinhalaDate, getCurrentMonthString } from '../../utils/formatters';
import { exportElementAsPDF, printElement } from '../../utils/pdfGenerator';
import { 
  BarChart3, 
  Printer, 
  Download, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { students, teachers, classes, attendance, payments, expenses } = useData();

  const [reportMonth, setReportMonth] = useState(getCurrentMonthString());
  const reportElementId = 'comprehensive-monthly-report';

  // Monthly stats
  const monthlyPayments = payments.filter(p => p.month === reportMonth || p.paymentDate.startsWith(reportMonth));
  const totalIncome = monthlyPayments.reduce((sum, p) => sum + p.paidAmount, 0);

  const monthlyExpenses = expenses.filter(e => e.date.startsWith(reportMonth));
  const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const monthlyAttendance = attendance.filter(a => a.date.startsWith(reportMonth));
  const presentCount = monthlyAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = monthlyAttendance.length > 0
    ? Math.round((presentCount / monthlyAttendance.length) * 100)
    : 100;

  const handlePrint = () => {
    printElement(reportElementId);
  };

  const handleDownloadPDF = async () => {
    await exportElementAsPDF(reportElementId, `TUITION_PRO_REPORT_${reportMonth}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              වාර්තා සහ සංඛ්‍යාලේඛන (Reports & Analytics)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ආයතනයේ සමස්ත මූල්‍ය, පැමිණීම්, සහ අධ්‍යාපනික ප්‍රගති වාර්තා බාගත කිරීම
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100"
          >
            <Printer className="w-4 h-4" />
            <span>මුද්‍රණය කරන්න</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>PDF වාර්තාව බාගත කරන්න</span>
          </button>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">වාර්තා මාසය:</span>
        <input
          type="month"
          value={reportMonth}
          onChange={(e) => setReportMonth(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
        />
      </div>

      {/* Printable Report Canvas */}
      <div id={reportElementId} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            TUITION PRO • මාසික ප්‍රගති සහ මූල්‍ය වාර්තාව
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            ශ්‍රී ලංකා පන්ති කළමනාකරණ පද්ධතිය • වාර්තාගත කාලසීමාව: {reportMonth}
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500">සමස්ත සිසුන්</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{students.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-emerald-600">මුළු ආදායම</span>
            <p className="text-xl font-black text-emerald-600 mt-1">{formatLKR(totalIncome)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-rose-600">මුළු වියදම</span>
            <p className="text-xl font-black text-rose-600 mt-1">{formatLKR(totalExpense)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-indigo-600">ශුද්ධ ලාභය</span>
            <p className={`text-xl font-black mt-1 ${netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
              {formatLKR(netProfit)}
            </p>
          </div>
        </div>

        {/* Detailed Section: Class Performance */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            පන්ති අනුව පැමිණීම් සහ ආදායම් සාරාංශය
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">පන්තිය (Class)</th>
                  <th className="py-2.5 px-3">ගුරුවරයා</th>
                  <th className="py-2.5 px-3">ශිෂ්‍ය සංඛ්‍යාව</th>
                  <th className="py-2.5 px-3">මාසික ගාස්තුව</th>
                  <th className="py-2.5 px-3 text-right">එකතු වූ මුදල</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {classes.map(cls => {
                  const teacher = teachers.find(t => t.id === cls.teacherId);
                  const enrolledCount = students.filter(s => s.enrolledClassIds?.includes(cls.id) && s.status === 'active').length;
                  const collected = payments
                    .filter(p => p.classId === cls.id && (p.month === reportMonth || p.paymentDate.startsWith(reportMonth)))
                    .reduce((sum, p) => sum + p.paidAmount, 0);

                  return (
                    <tr key={cls.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{cls.name}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{teacher?.sinhalaName || teacher?.name}</td>
                      <td className="py-2.5 px-3 font-semibold">{enrolledCount} සිසුන්</td>
                      <td className="py-2.5 px-3">{formatLKR(cls.monthlyFee)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-600">{formatLKR(collected)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>TUITION PRO COMPREHENSIVE REPORTING SUITE</span>
          <span>වාර්තාව සැකසූ දිනය: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
