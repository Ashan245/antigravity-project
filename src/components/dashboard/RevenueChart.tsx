import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatLKR, SINHALA_MONTHS } from '../../utils/formatters';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const { payments, expenses } = useData();
  const [viewType, setViewType] = useState<'revenue' | 'net'>('revenue');

  // Calculate monthly figures for the last 6 months
  const now = new Date();
  const monthsData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${yyyy}-${mm}`;
    const monthName = SINHALA_MONTHS[d.getMonth()];

    // Payments in this month
    const totalIncome = payments
      .filter(p => p.month === monthKey || p.paymentDate.startsWith(monthKey))
      .reduce((sum, p) => sum + p.paidAmount, 0);

    // Expenses in this month
    const totalExpense = expenses
      .filter(e => e.date.startsWith(monthKey))
      .reduce((sum, e) => sum + e.amount, 0);

    const netProfit = totalIncome - totalExpense;

    monthsData.push({
      key: monthKey,
      name: monthName,
      year: yyyy,
      income: totalIncome,
      expense: totalExpense,
      net: netProfit
    });
  }

  // Find max for scaling
  const maxVal = Math.max(
    ...monthsData.map(m => Math.max(m.income, m.expense)),
    100000 // default scale baseline
  );

  const total6MonthIncome = monthsData.reduce((acc, m) => acc + m.income, 0);
  const total6MonthExpense = monthsData.reduce((acc, m) => acc + m.expense, 0);
  const total6MonthNet = total6MonthIncome - total6MonthExpense;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              මාසික ආදායම් සහ වියදම් ප්‍රස්ථාරය
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            පසුගිය මාස 6 තුළ මූල්‍ය ක්‍රියාකාරීත්වය (LKR)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewType('revenue')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewType === 'revenue'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            ආදායම් vs වියදම්
          </button>
          <button
            onClick={() => setViewType('net')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewType === 'net'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            ශුද්ධ ලාභය
          </button>
        </div>
      </div>

      {/* Summary KPI chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>මුළු ආදායම (Income)</span>
          </div>
          <p className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">
            {formatLKR(total6MonthIncome)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-medium">
            <ArrowDownRight className="w-4 h-4" />
            <span>මුළු වියදම (Expenses)</span>
          </div>
          <p className="text-lg font-extrabold text-rose-800 dark:text-rose-300 mt-1">
            {formatLKR(total6MonthExpense)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 text-xs font-medium">
            <DollarSign className="w-4 h-4" />
            <span>ශුද්ධ ලාභය (Net Profit)</span>
          </div>
          <p className={`text-lg font-extrabold mt-1 ${total6MonthNet >= 0 ? 'text-indigo-800 dark:text-indigo-300' : 'text-rose-700'}`}>
            {formatLKR(total6MonthNet)}
          </p>
        </div>
      </div>

      {/* Bar Chart Bars */}
      <div className="mt-6 pt-4">
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 sm:h-56 pb-2 border-b border-slate-200 dark:border-slate-800">
          {monthsData.map((item, index) => {
            const incomeHeight = Math.max(8, Math.round((item.income / maxVal) * 100));
            const expenseHeight = Math.max(8, Math.round((item.expense / maxVal) * 100));
            const netHeight = Math.max(8, Math.min(100, Math.round((Math.abs(item.net) / maxVal) * 100)));

            return (
              <div key={item.key} className="flex flex-col items-center justify-end h-full group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap">
                  <p className="font-bold">{item.name} {item.year}</p>
                  <p className="text-emerald-300">ආදායම: {formatLKR(item.income)}</p>
                  <p className="text-rose-300">වියදම: {formatLKR(item.expense)}</p>
                  <p className="text-indigo-200">ලාභය: {formatLKR(item.net)}</p>
                </div>

                {viewType === 'revenue' ? (
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Income bar */}
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-full max-w-[24px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-sm"
                    />
                    {/* Expense bar */}
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-full max-w-[24px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      style={{ height: `${netHeight}%` }}
                      className={`w-full max-w-[32px] rounded-t-md transition-all duration-500 shadow-sm ${
                        item.net >= 0
                          ? 'bg-gradient-to-t from-indigo-600 to-primary-400'
                          : 'bg-gradient-to-t from-rose-600 to-red-400'
                      }`}
                    />
                  </div>
                )}

                <span className="mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center truncate w-full">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>ආදායම් (LKR)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>වියදම් (LKR)</span>
          </div>
          {viewType === 'net' && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary-600" />
              <span>ශුද්ධ ලාභය (LKR)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
