import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Subject, Branch } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatLKR } from '../../utils/formatters';
import { Building2, BookOpen, Plus, Trash2, Edit, MapPin, Phone, User, X } from 'lucide-react';

export const SubjectBranchManagement: React.FC = () => {
  const { subjects, branches, addSubject, updateSubject, deleteSubject, addBranch, updateBranch } = useData();

  const [activeTab, setActiveTab] = useState<'subjects' | 'branches'>('subjects');

  // Add Subject state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subSinhala, setSubSinhala] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subGrade, setSubGrade] = useState('A/L');
  const [subFee, setSubFee] = useState(3500);

  // Add Branch state
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchSinhala, setBranchSinhala] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchPerson, setBranchPerson] = useState('');

  // Delete confirm
  const [deleteSub, setDeleteSub] = useState<Subject | null>(null);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subSinhala.trim()) {
      alert('කරුණාකර විෂයයේ නම ඇතුළත් කරන්න.');
      return;
    }
    addSubject({
      name: subName.trim(),
      sinhalaName: subSinhala.trim(),
      code: subCode.trim() || 'SUB',
      grade: subGrade,
      defaultFee: subFee
    });
    setSubName('');
    setSubSinhala('');
    setSubCode('');
    setIsSubModalOpen(false);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !branchSinhala.trim()) {
      alert('කරුණාකර ශාඛාවේ නම ඇතුළත් කරන්න.');
      return;
    }
    addBranch({
      name: branchName.trim(),
      sinhalaName: branchSinhala.trim(),
      address: branchAddress.trim(),
      phone: branchPhone.trim(),
      contactPerson: branchPerson.trim()
    });
    setBranchName('');
    setBranchSinhala('');
    setBranchAddress('');
    setBranchPhone('');
    setBranchPerson('');
    setIsBranchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ශාඛා සහ විෂයයන් (Branches & Subjects)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ආයතනයේ ශාඛා ජාලය සහ උගන්වනු ලබන විෂය ධාරාවන් කළමනාකරණය
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            විෂයයන් (Subjects)
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'branches'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ශාඛා (Branches)
          </button>
        </div>
      </div>

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              විෂය ලැයිස්තුව ({subjects.length})
            </h3>
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>නව විෂයයක් එක් කරන්න</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div
                key={sub.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatLKR(sub.defaultFee)}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                    {sub.sinhalaName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sub.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{sub.grade} • {sub.stream || 'සාමාන්‍ය'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setDeleteSub(sub)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ආයතනයේ ශාඛා ({branches.length})
            </h3>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>නව ශාඛාවක් එක් කරන්න</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.map(branch => (
              <div
                key={branch.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {branch.sinhalaName}
                    </h4>
                    <p className="text-xs text-slate-500">{branch.name}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.contactPerson}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">නව විෂයයක් එක් කරන්න</h3>
              <button onClick={() => setIsSubModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddSubject} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">විෂයයේ නම (සිංහලෙන්) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ආර්ථික විද්‍යාව (Economics)"
                  value={subSinhala}
                  onChange={e => setSubSinhala(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">නම (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Economics"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">කේතය (Code)</label>
                  <input
                    type="text"
                    placeholder="e.g. ECON"
                    value={subCode}
                    onChange={e => setSubCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">සාමාන්‍ය ගාස්තුව (LKR)</label>
                  <input
                    type="number"
                    value={subFee}
                    onChange={e => setSubFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-bold text-emerald-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsSubModalOpen(false)} className="px-4 py-2 border rounded-xl">අවලංගු කරන්න</button>
                <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold">සුරකින්න</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">නව ශාඛාවක් එක් කරන්න</h3>
              <button onClick={() => setIsBranchModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddBranch} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ශාඛාවේ නම (සිංහලෙන්) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. කුරුණෑගල ශාඛාව"
                  value={branchSinhala}
                  onChange={e => setBranchSinhala(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">නම (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurunegala Branch"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ලිපිනය</label>
                <input
                  type="text"
                  placeholder="e.g. කොළඹ පාර, කුරුණෑගල"
                  value={branchAddress}
                  onChange={e => setBranchAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">දුරකථන අංකය</label>
                  <input
                    type="text"
                    value={branchPhone}
                    onChange={e => setBranchPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">කළමනාකරු</label>
                  <input
                    type="text"
                    value={branchPerson}
                    onChange={e => setBranchPerson(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsBranchModalOpen(false)} className="px-4 py-2 border rounded-xl">අවලංගු කරන්න</button>
                <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold">සුරකින්න</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subject Confirm */}
      <ConfirmModal
        isOpen={!!deleteSub}
        title="විෂය මකා දැමීම තහවුරු කරන්න"
        message={`'${deleteSub?.sinhalaName}' විෂය ඉවත් කිරීමට ඔබට විශ්වාසද?`}
        confirmText="ඔව්, මකා දමන්න"
        cancelText="අවලංගු කරන්න"
        isDestructive={true}
        onConfirm={() => {
          if (deleteSub) {
            deleteSubject(deleteSub.id);
            setDeleteSub(null);
          }
        }}
        onCancel={() => setDeleteSub(null)}
      />
    </div>
  );
};
