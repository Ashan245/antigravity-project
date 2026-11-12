import React, { useRef, useState } from 'react';
import { useData } from '../../context/DataContext';
import { HardDriveDownload, Upload, RefreshCw, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose
}) => {
  const { exportBackupJSON, restoreFromJSON, resetToDefaultData } = useData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  // Handle Export Backup
  const handleExport = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TUITION_PRO_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'උපස්ථ ගොනුව (JSON Backup) සාර්ථකව බාගත විය.' });
  };

  // Handle Restore Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreFromJSON(content);
      if (success) {
        setStatusMessage({ text: 'දත්ත සාර්ථකව ප්‍රතිසාධනය (Restored) කරන ලදී!' });
      } else {
        setStatusMessage({ text: 'ගොනුව කියවීම අසාර්ථක විය. කරුණාකර වලංගු උපස්ථ ගොනුවක් තෝරන්න.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  // Reset demo data
  const handleReset = () => {
    if (confirm('ඔබට නැවත ආරම්භක ආදර්ශ දත්ත (Default Sample Data) වෙත මාරු වීමට අවශ්‍ය බව සහතිකද?')) {
      resetToDefaultData();
      setStatusMessage({ text: 'ආරම්භක ආදර්ශ දත්ත සාර්ථකව ප්‍රතිස්ථාපනය විය.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                උපස්ථ සහ දත්ත ප්‍රතිසාධනය
              </h3>
              <p className="text-xs text-slate-500">Backup & Restore Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`mt-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${statusMessage.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {statusMessage.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-6 space-y-4 text-xs">
          {/* Export JSON Option */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                සම්පූර්ණ උපස්ථයක් බාගත කරන්න (Export JSON)
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                සිසුන්, ගුරුවරුන්, පන්ති, පැමිණීම් සහ ගෙවීම් වාර්තා සියල්ල එකම JSON ගොනුවක් ලෙස සුරකින්න.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shrink-0 shadow-md shadow-primary-500/20 active:scale-95 transition-all"
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>බාගත කරන්න</span>
            </button>
          </div>

          {/* Import JSON Option */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                උපස්ථයකින් දත්ත ලබාගන්න (Restore from JSON)
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                කලින් ලබාගත් JSON උපස්ථ ගොනුවක් තෝරා පද්ධතිය වෙත නැවත පූරණය කරන්න.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold shrink-0 hover:bg-slate-100 transition-all"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>ගොනුව තෝරන්න</span>
            </button>
          </div>

          {/* Reset to Default Demo Data */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-rose-900 dark:text-rose-200">
                ආදර්ශ දත්ත ප්‍රතිස්ථාපනය (Reset to Sample Data)
              </h4>
              <p className="text-rose-700/80 dark:text-rose-300/80 mt-1">
                ශ්‍රී ලංකා පන්ති ආදර්ශ දත්ත, ගුරුවරුන්, සිසුන් හා පන්ති යළි සැකසීම.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>යළි පිහිටුවන්න</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            වසන්න
          </button>
        </div>
      </div>
    </div>
  );
};
