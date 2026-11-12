import React, { useState, useEffect } from 'react';
import { getSavedFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, isFirebaseConfigured } from '../../firebase/config';
import { FirebaseCustomConfig } from '../../types';
import { Database, CheckCircle2, AlertCircle, X, Shield, Key } from 'lucide-react';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const isConnected = isFirebaseConfigured();

  const [config, setConfig] = useState<FirebaseCustomConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  useEffect(() => {
    const saved = getSavedFirebaseConfig();
    if (saved) {
      setConfig(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.apiKey || !config.projectId) {
      alert('කරුණාකර API Key සහ Project ID ඇතුළත් කරන්න.');
      return;
    }
    saveFirebaseConfig(config);
    onClose();
  };

  const handleClear = () => {
    if (confirm('Firebase සැකසුම් ඉවත් කර දේශීය දත්ත ගබඩාව (Offline Storage) වෙත මාරු වීමට අවශ්‍යද?')) {
      clearFirebaseConfig();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Firebase දත්ත ගබඩා සැකසුම්
              </h3>
              <p className="text-xs text-slate-500">Firebase Cloud Firestore & Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className={`my-4 p-4 rounded-2xl border text-xs flex items-center justify-between ${
          isConnected
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}>
          <div className="flex items-center gap-2.5">
            {isConnected ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
            <div>
              <p className="font-bold">
                {isConnected ? 'Firebase සක්‍රියව සම්බන්ධ වී ඇත' : 'දේශීය නොබැඳි මාදිලිය (Local Offline Mode)'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isConnected ? `Project: ${config.projectId}` : 'දත්ත පරිගණකයේ ආරක්ෂිතව ගබඩා වී ක්‍රියාත්මක වේ.'}
              </p>
            </div>
          </div>
          {isConnected && (
            <button
              onClick={handleClear}
              className="text-[11px] font-bold text-rose-600 hover:underline"
            >
              ඉවත් කරන්න
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Firebase API Key *
            </label>
            <input
              type="text"
              required
              placeholder="AIzaSy..."
              value={config.apiKey}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project ID *
              </label>
              <input
                type="text"
                required
                placeholder="tuition-pro-project"
                value={config.projectId}
                onChange={e => setConfig({ ...config, projectId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                placeholder="project.firebaseapp.com"
                value={config.authDomain}
                onChange={e => setConfig({ ...config, authDomain: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                placeholder="project.appspot.com"
                value={config.storageBucket}
                onChange={e => setConfig({ ...config, storageBucket: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                App ID
              </label>
              <input
                type="text"
                placeholder="1:123456789:web:abcdef"
                value={config.appId}
                onChange={e => setConfig({ ...config, appId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-primary-600" />
              <span>ආරක්ෂණ රීති (Security Rules) සම්පූර්ණයි</span>
            </p>
            <p>
              ව්යාපෘතියේ `firestore.rules` ගොනුව දැනටමත් පරිපාලක, ගුරු සහ ශිෂ්‍ය අවසර සහිතව සකස් කර ඇත.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md shadow-primary-500/20 active:scale-95"
            >
              සැකසුම් සුරකින්න
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
