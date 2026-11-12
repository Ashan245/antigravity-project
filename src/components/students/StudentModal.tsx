import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { X, User, Phone, MapPin, School, BookOpen, Upload, Calendar } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  studentToEdit?: Student | null;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  studentToEdit,
  onClose
}) => {
  const { classes, addStudent, updateStudent, students } = useData();

  const [formData, setFormData] = useState({
    name: '',
    sinhalaName: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    school: '',
    grade: 'Grade 12 - 2026 A/L',
    stream: 'Physical Science',
    parentName: '',
    parentPhone: '',
    enrolledClassIds: [] as string[],
    enrollmentDate: new Date().toISOString().split('T')[0],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    status: 'active' as 'active' | 'inactive',
    hasFreeCard: false,
    discountPercent: 0,
    notes: ''
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name,
        sinhalaName: studentToEdit.sinhalaName || '',
        gender: studentToEdit.gender,
        phone: studentToEdit.phone,
        whatsapp: studentToEdit.whatsapp || '',
        email: studentToEdit.email || '',
        address: studentToEdit.address,
        school: studentToEdit.school,
        grade: studentToEdit.grade,
        stream: studentToEdit.stream || '',
        parentName: studentToEdit.parentName,
        parentPhone: studentToEdit.parentPhone,
        enrolledClassIds: studentToEdit.enrolledClassIds || [],
        enrollmentDate: studentToEdit.enrollmentDate,
        photoUrl: studentToEdit.photoUrl,
        status: studentToEdit.status,
        hasFreeCard: !!studentToEdit.hasFreeCard,
        discountPercent: studentToEdit.discountPercent || 0,
        notes: studentToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        sinhalaName: '',
        gender: 'male',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        school: '',
        grade: 'Grade 12 - 2026 A/L',
        stream: 'Physical Science',
        parentName: '',
        parentPhone: '',
        enrolledClassIds: [],
        enrollmentDate: new Date().toISOString().split('T')[0],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        status: 'active',
        hasFreeCard: false,
        discountPercent: 0,
        notes: ''
      });
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('කරුණාකර සිසුවාගේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න.');
      return;
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, formData);
    } else {
      addStudent(formData);
    }
    onClose();
  };

  const handleClassToggle = (classId: string) => {
    setFormData(prev => {
      const exists = prev.enrolledClassIds.includes(classId);
      return {
        ...prev,
        enrolledClassIds: exists
          ? prev.enrolledClassIds.filter(id => id !== classId)
          : [...prev.enrolledClassIds, classId]
      };
    });
  };

  const nextAutoId = `STU-${String(students.length + 1).padStart(3, '0')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
              {studentToEdit ? `සිසු අංකය: ${studentToEdit.id}` : `ස්වයංක්‍රීය අංකය: ${nextAutoId}`}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {studentToEdit ? 'සිසුවාගේ තොරතුරු සංස්කරණය' : 'නව සිසුවෙකු ලියාපදිංචි කිරීම'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>මූලික තොරතුරු (Personal Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  සම්පූර්ණ නම (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  නම (සිංහලෙන්)
                </label>
                <input
                  type="text"
                  placeholder="e.g. කසුන් පෙරේරා"
                  value={formData.sinhalaName}
                  onChange={e => setFormData({ ...formData, sinhalaName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ස්ත්‍රී / පුරුෂ භාවය (Gender)
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="male">පුරුෂ (Male)</option>
                  <option value="female">ස්ත්‍රී (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ඡායාරූප සබැඳිය (Photo URL)
                </label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>සම්බන්ධතා තොරතුරු (Contact Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp අංකය
                </label>
                <input
                  type="tel"
                  placeholder="07xxxxxxxx"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ස්ථිර ලිපිනය (Address)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45, විජේරාම පාර, නුගේගොඩ"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <School className="w-4 h-4" />
              <span>පාසල සහ අධ්‍යාපනික තොරතුරු (Academic Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  පාසල (School)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ආනන්ද විද්‍යාලය, කොළඹ"
                  value={formData.school}
                  onChange={e => setFormData({ ...formData, school: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ශ්‍රේණිය (Grade)
                </label>
                <select
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="Grade 12 - 2026 A/L">Grade 12 - 2026 A/L</option>
                  <option value="Grade 13 - 2025 A/L">Grade 13 - 2025 A/L</option>
                  <option value="Grade 11 - O/L">Grade 11 - O/L</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Other">වෙනත්</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  හදාරන අංශය (Stream)
                </label>
                <select
                  value={formData.stream}
                  onChange={e => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="Physical Science">භෞතික විද්‍යා (Maths)</option>
                  <option value="Biological Science">ජීව විද්‍යා (Biology)</option>
                  <option value="Commerce">වාණිජ (Commerce)</option>
                  <option value="Arts">කලා (Arts)</option>
                  <option value="Technology">තාක්ෂණවේදය (Technology)</option>
                  <option value="Ordinary Level">සාමාන්‍ය පෙළ (O/L)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ඇතුළත් වූ දිනය
                </label>
                <input
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={e => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>දෙමාපිය / භාරකරු තොරතුරු (Parent Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  දෙමාපිය / භාරකරුගේ නම
                </label>
                <input
                  type="text"
                  placeholder="e.g. සුනිල් පෙරේරා"
                  value={formData.parentName}
                  onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  දෙමාපිය දුරකථන අංකය
                </label>
                <input
                  type="tel"
                  placeholder="07xxxxxxxx"
                  value={formData.parentPhone}
                  onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Enrolled Classes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>ලියාපදිංචි වන පන්ති (Enrolled Classes)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-2xl">
              {classes.map(cls => {
                const isSelected = formData.enrolledClassIds.includes(cls.id);
                return (
                  <div
                    key={cls.id}
                    onClick={() => handleClassToggle(cls.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{cls.name}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{cls.dayOfWeek} • {cls.startTime}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">රු. {cls.monthlyFee.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special discount / Scholarship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="freeCard"
                checked={formData.hasFreeCard}
                onChange={e => setFormData({ ...formData, hasFreeCard: e.target.checked })}
                className="rounded w-4 h-4 text-primary-600"
              />
              <label htmlFor="freeCard" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                ශිෂ්‍යත්ව හිමි නොමිලේ කාඩ්පත (Free Card)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                විශේෂ වට්ටම් ප්‍රතිශතය (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
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
              {studentToEdit ? 'තොරතුරු යාවත්කාලීන කරන්න' : 'සිසුවා ලියාපදිංචි කරන්න'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
