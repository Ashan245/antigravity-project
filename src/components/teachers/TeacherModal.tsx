import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Teacher } from '../../types';
import { X, User, Phone, BookOpen, DollarSign, Building } from 'lucide-react';

interface TeacherModalProps {
  isOpen: boolean;
  teacherToEdit?: Teacher | null;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  teacherToEdit,
  onClose
}) => {
  const { subjects, addTeacher, updateTeacher, teachers } = useData();

  const [formData, setFormData] = useState({
    name: '',
    sinhalaName: '',
    phone: '',
    email: '',
    nic: '',
    qualifications: '',
    subjectIds: [] as string[],
    classIds: [] as string[],
    salaryType: 'percentage' as 'percentage' | 'fixed_per_student' | 'monthly_fixed',
    salaryRate: 80,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    status: 'active' as 'active' | 'inactive',
    bankDetails: {
      bank: 'Bank of Ceylon',
      branch: 'Nugegoda',
      accountNumber: '',
      accountName: ''
    },
    joinedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({
        name: teacherToEdit.name,
        sinhalaName: teacherToEdit.sinhalaName || '',
        phone: teacherToEdit.phone,
        email: teacherToEdit.email,
        nic: teacherToEdit.nic,
        qualifications: teacherToEdit.qualifications,
        subjectIds: teacherToEdit.subjectIds || [],
        classIds: teacherToEdit.classIds || [],
        salaryType: teacherToEdit.salaryType,
        salaryRate: teacherToEdit.salaryRate,
        photoUrl: teacherToEdit.photoUrl,
        status: teacherToEdit.status,
        bankDetails: teacherToEdit.bankDetails || {
          bank: 'Bank of Ceylon',
          branch: '',
          accountNumber: '',
          accountName: teacherToEdit.name
        },
        joinedDate: teacherToEdit.joinedDate,
        notes: teacherToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        sinhalaName: '',
        phone: '',
        email: '',
        nic: '',
        qualifications: '',
        subjectIds: [],
        classIds: [],
        salaryType: 'percentage',
        salaryRate: 80,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        status: 'active',
        bankDetails: {
          bank: 'Bank of Ceylon',
          branch: 'Nugegoda',
          accountNumber: '',
          accountName: ''
        },
        joinedDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [teacherToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('කරුණාකර ගුරුතුමාගේ / ගුරුතුමියගේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න.');
      return;
    }

    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, formData);
    } else {
      addTeacher(formData);
    }
    onClose();
  };

  const handleSubjectToggle = (subId: string) => {
    setFormData(prev => {
      const exists = prev.subjectIds.includes(subId);
      return {
        ...prev,
        subjectIds: exists ? prev.subjectIds.filter(id => id !== subId) : [...prev.subjectIds, subId]
      };
    });
  };

  const nextAutoId = `TCH-${String(teachers.length + 1).padStart(3, '0')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
              {teacherToEdit ? `ගුරු අංකය: ${teacherToEdit.id}` : `ස්වයංක්‍රීය අංකය: ${nextAutoId}`}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {teacherToEdit ? 'ගුරු තොරතුරු සංස්කරණය' : 'නව ගුරුවරයෙකු ලියාපදිංචි කිරීම'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 max-h-[75vh] overflow-y-auto pr-2">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                නම (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Nimal Senarathne"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                නම (සිංහලෙන්)
              </label>
              <input
                type="text"
                placeholder="e.g. ආචාර්ය නිමල් සේනාරත්න"
                value={formData.sinhalaName}
                onChange={e => setFormData({ ...formData, sinhalaName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                දුරකථන අංකය *
              </label>
              <input
                type="tel"
                required
                placeholder="07xxxxxxxx"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                විද්‍යුත් තැපෑල (Email)
              </label>
              <input
                type="email"
                placeholder="teacher@tuitionpro.lk"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ජාතික හැඳුනුම්පත් අංකය (NIC)
              </label>
              <input
                type="text"
                placeholder="e.g. 198512345678"
                value={formData.nic}
                onChange={e => setFormData({ ...formData, nic: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                සුදුසුකම් (Qualifications)
              </label>
              <input
                type="text"
                placeholder="B.Sc, M.Sc, etc."
                value={formData.qualifications}
                onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Teaching Subjects */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              උගන්වන විෂයයන් (Teaching Subjects)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-xl">
              {subjects.map(s => {
                const isSelected = formData.subjectIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-900 dark:text-primary-100'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSubjectToggle(s.id)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>{s.sinhalaName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Salary / Commission info */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ගුරු වැටුප් සහ කොමිස් තොරතුරු (Payment Scheme)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  ගෙවීම් ක්‍රමය (Salary Type)
                </label>
                <select
                  value={formData.salaryType}
                  onChange={e => setFormData({ ...formData, salaryType: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="percentage">ශිෂ්‍ය ගාස්තුවෙන් ප්‍රතිශතයක් (Percentage %)</option>
                  <option value="fixed_per_student">ශිෂ්‍යයෙකු සඳහා ස්ථාවර මුදලක් (Fixed Per Student)</option>
                  <option value="monthly_fixed">ස්ථාවර මාසික වැටුපක් (Monthly Fixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {formData.salaryType === 'percentage' ? 'ප්‍රතිශතය (%)' : 'මුදල (LKR)'}
                </label>
                <input
                  type="number"
                  value={formData.salaryRate}
                  onChange={e => setFormData({ ...formData, salaryRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary-600" />
              <span>බැංකු ගිණුම් විස්තර (Bank Details for Payouts)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">බැංකුව (Bank)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank of Ceylon"
                  value={formData.bankDetails.bank}
                  onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bank: e.target.value } })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">ශාඛාව (Branch)</label>
                <input
                  type="text"
                  placeholder="e.g. Nugegoda"
                  value={formData.bankDetails.branch}
                  onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, branch: e.target.value } })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">ගිණුම් අංකය</label>
                <input
                  type="text"
                  placeholder="e.g. 839201948"
                  value={formData.bankDetails.accountNumber}
                  onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">ගිණුමේ නම</label>
                <input
                  type="text"
                  placeholder="e.g. N. S. Senarathne"
                  value={formData.bankDetails.accountName}
                  onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountName: e.target.value } })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/25 active:scale-95 transition-all"
            >
              {teacherToEdit ? 'තොරතුරු යාවත්කාලීන කරන්න' : 'ගුරුවරයා ඇතුළත් කරන්න'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
