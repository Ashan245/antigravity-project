import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  UserCheck, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  TrendingDown, 
  Award, 
  Building2, 
  BarChart3, 
  HardDriveDownload, 
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export type NavTab = 
  | 'dashboard'
  | 'attendance'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'payments'
  | 'expenses'
  | 'exams'
  | 'branches_subjects'
  | 'reports'
  | 'backup'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const { role } = useAuth();
  const { students, teachers, classes } = useData();

  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'පාලක පුවරුව',
      subLabel: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      id: 'attendance' as NavTab,
      label: 'QR පැමිණීම',
      subLabel: 'QR Attendance',
      icon: QrCode,
      roles: ['admin', 'teacher', 'student', 'parent'],
      badge: 'Live'
    },
    {
      id: 'students' as NavTab,
      label: 'සිසුන් කළමනාකරණය',
      subLabel: 'Students',
      icon: Users,
      roles: ['admin', 'teacher'],
      count: students.length
    },
    {
      id: 'teachers' as NavTab,
      label: 'ගුරුවරුන්',
      subLabel: 'Teachers',
      icon: UserCheck,
      roles: ['admin'],
      count: teachers.length
    },
    {
      id: 'classes' as NavTab,
      label: 'පන්ති සහ කාලසටහන',
      subLabel: 'Classes & Schedule',
      icon: Calendar,
      roles: ['admin', 'teacher', 'student', 'parent'],
      count: classes.length
    },
    {
      id: 'payments' as NavTab,
      label: 'ගාස්තු සහ රිසිට්පත්',
      subLabel: 'Fees & Receipts',
      icon: CreditCard,
      roles: ['admin', 'student', 'parent']
    },
    {
      id: 'expenses' as NavTab,
      label: 'වියදම් සහ වැටුප්',
      subLabel: 'Expenses & Salaries',
      icon: TrendingDown,
      roles: ['admin']
    },
    {
      id: 'exams' as NavTab,
      label: 'විභාග සහ ලකුණු',
      subLabel: 'Exams & Marks',
      icon: Award,
      roles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      id: 'branches_subjects' as NavTab,
      label: 'ශාඛා සහ විෂයයන්',
      subLabel: 'Branches & Subjects',
      icon: Building2,
      roles: ['admin']
    },
    {
      id: 'reports' as NavTab,
      label: 'වාර්තා සහ සංඛ්‍යාලේඛන',
      subLabel: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['admin', 'teacher']
    },
    {
      id: 'backup' as NavTab,
      label: 'උපස්ථ සහ ප්‍රතිසාධනය',
      subLabel: 'Backup & Restore',
      icon: HardDriveDownload,
      roles: ['admin']
    },
    {
      id: 'settings' as NavTab,
      label: 'Firebase සැකසුම්',
      subLabel: 'Firebase Settings',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar sidebar element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-primary-600 text-white font-black text-xl shadow-md">
              TP
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                TUITION PRO
              </h1>
              <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                පන්ති කළමනාකරණය
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400'}`} />
                  <div className="text-left truncate">
                    <p className="truncate text-[13px] leading-tight">{item.label}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-primary-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.subLabel}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 animate-pulse'}`}>
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && (
                  <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-500/10 to-primary-500/10 border border-primary-200/40 dark:border-primary-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                TUITION PRO v1.0
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              ශ්‍රී ලංකාවේ ප්‍රමුඛතම අධ්‍යාපන මෘදුකාංග පද්ධතිය
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
