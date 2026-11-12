import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Shield,
  UserCheck,
  User,
  Users
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isFirebaseConfigured } from '../../firebase/config';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenFirebaseModal: () => void;
  onOpenBackupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onOpenFirebaseModal
}) => {
  const { theme, toggleTheme } = useTheme();
  const { role, switchUserSimulated } = useAuth();
  const { notifications, markNotificationRead, clearNotifications, branches } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const isFbConnected = isFirebaseConfigured();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchUserSimulated(e.target.value as UserRole);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          title="මෙනුව විවෘත කරන්න"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-primary-500 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
                TUITION <span className="text-primary-600 dark:text-primary-400">PRO</span>
              </span>
              <span className="rounded-md bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                LKA
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              ශ්‍රී ලංකා පන්ති කළමනාකරණ පද්ධතිය
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Branch Selector (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          ශාඛාව:
        </span>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">සියලු ශාඛා (All Branches)</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.sinhalaName}</option>
          ))}
        </select>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher for instant testing */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {role === 'admin' && <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
          {role === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          {role === 'student' && <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
          {role === 'parent' && <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
          <select
            value={role}
            onChange={handleRoleChange}
            className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            title="භූමිකාව මාරු කරන්න"
          >
            <option value="admin" className="dark:bg-slate-900">පරිපාලක (Admin)</option>
            <option value="teacher" className="dark:bg-slate-900">ගුරු (Teacher)</option>
            <option value="student" className="dark:bg-slate-900">සිසු (Student)</option>
            <option value="parent" className="dark:bg-slate-900">දෙමාපිය (Parent)</option>
          </select>
        </div>

        {/* Firebase Status Badge */}
        <button
          onClick={onOpenFirebaseModal}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
            isFbConnected 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' 
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
          }`}
          title="Firebase Configuration Settings"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {isFbConnected ? 'Firebase සක්‍රියයි' : 'දේශීය දත්ත ගබඩාව (Offline)'}
          </span>
          {isFbConnected ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-amber-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            title="දැනුම්දීම්"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">දැනුම්දීම් (Notifications)</h4>
                  {unreadCount > 0 && (
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {unreadCount} නව
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    සියල්ල ඉවත් කරන්න
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">නව දැනුම්දීම් නොමැත</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                        notif.read ? 'opacity-60 hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-50 dark:hover:bg-primary-950/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                        {!notif.read && <span className="h-2 w-2 rounded-full bg-primary-600 mt-1 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title={theme === 'dark' ? 'ආලෝක තේමාව' : 'අඳුරු තේමාව'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
