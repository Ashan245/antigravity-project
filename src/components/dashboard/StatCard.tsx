import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  sinhalaTitle: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  sinhalaTitle,
  title,
  value,
  subValue,
  icon: Icon,
  colorScheme,
  onClick
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-600 text-white'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-600 text-white'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
      iconBg: 'bg-amber-600 text-white'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
      iconBg: 'bg-rose-600 text-white'
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-100 dark:border-sky-900/50',
      iconBg: 'bg-sky-600 text-white'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
      iconBg: 'bg-purple-600 text-white'
    }
  };

  const current = colorMap[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border ${current.border} bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-600' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${current.iconBg} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {sinhalaTitle}
        </h4>
        <p className={`mt-1 text-2xl font-extrabold tracking-tight ${current.text}`}>
          {value}
        </p>
      </div>

      {subValue && (
        <div className="mt-2.5 flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>{subValue}</span>
        </div>
      )}
    </div>
  );
};
