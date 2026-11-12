import React from 'react';

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let displayText = label || status;

  switch (status.toLowerCase()) {
    case 'active':
    case 'සක්‍රිය':
      colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      displayText = label || 'සක්‍රිය (Active)';
      break;
    case 'inactive':
    case 'අක්‍රිය':
      colorClasses = 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
      displayText = label || 'අක්‍රිය (Inactive)';
      break;
    case 'present':
    case 'පැමිණි':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 border border-green-200 dark:border-green-800';
      displayText = label || 'පැමිණියා (Present)';
      break;
    case 'late':
    case 'ප්‍රමාද':
      colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      displayText = label || 'ප්‍රමාදයි (Late)';
      break;
    case 'absent':
    case 'නොපැමිණි':
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800';
      displayText = label || 'නොපැමිණි (Absent)';
      break;
    case 'excused':
      colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      displayText = label || 'නිවාඩු (Excused)';
      break;
    case 'paid':
    case 'ගෙවා ඇත':
      colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      displayText = label || 'ගෙවා ඇත (Paid)';
      break;
    case 'partial':
    case 'අර්ධ':
      colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      displayText = label || 'අර්ධ ගෙවීම් (Partial)';
      break;
    case 'free_card':
    case 'නොමිලේ':
      colorClasses = 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      displayText = label || 'නොමිලේ (Free Card)';
      break;
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${colorClasses}`}>
      {displayText}
    </span>
  );
};
