import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TuitionClass, DayOfWeek } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatLKR, SINHALA_DAYS } from '../../utils/formatters';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock, 
  User, 
  MapPin, 
  Users, 
  BookOpen,
  X
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassManagement: React.FC = () => {
  const { classes, teachers, subjects, branches, students, addClass, updateClass, deleteClass } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('all');

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TuitionClass | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    grade: 'Grade 12 - 2026 A/L',
    dayOfWeek: 'Sunday' as DayOfWeek,
    startTime: '08:00',
    endTime: '12:00',
    hallNumber: 'ශාලාව 01',
    monthlyFee: 3500,
    branchId: branches[0]?.id || 'BR-01',
    status: 'active' as 'active' | 'inactive'
  });

  // Students list modal for a class
  const [viewStudentsClass, setViewStudentsClass] = useState<TuitionClass | null>(null);

  // Delete confirm
  const [deleteConfirmClass, setDeleteConfirmClass] = useState<TuitionClass | null>(null);

  const filteredClasses = classes.filter(cls => {
    const q = searchQuery.toLowerCase();
    const teacher = teachers.find(t => t.id === cls.teacherId);
    const subject = subjects.find(s => s.id === cls.subjectId);

    const matchesSearch =
      cls.name.toLowerCase().includes(q) ||
      cls.id.toLowerCase().includes(q) ||
      (teacher && teacher.name.toLowerCase().includes(q)) ||
      (subject && subject.name.toLowerCase().includes(q));

    const matchesDay = dayFilter === 'all' || cls.dayOfWeek === dayFilter;
    return matchesSearch && matchesDay;
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      grade: 'Grade 12 - 2026 A/L',
      dayOfWeek: 'Sunday',
      startTime: '08:00',
      endTime: '12:00',
      hallNumber: 'ශාලාව 01',
      monthlyFee: 3500,
      branchId: branches[0]?.id || 'BR-01',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: TuitionClass) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      subjectId: cls.subjectId,
      teacherId: cls.teacherId,
      grade: cls.grade,
      dayOfWeek: cls.dayOfWeek,
      startTime: cls.startTime,
      endTime: cls.endTime,
      hallNumber: cls.hallNumber,
      monthlyFee: cls.monthlyFee,
      branchId: cls.branchId,
      status: cls.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('කරුණාකර පන්තියේ නම ඇතුළත් කරන්න.');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmClass) {
      deleteClass(deleteConfirmClass.id);
      setDeleteConfirmClass(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              පන්ති සහ කාලසටහන (Classes & Timetable)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            පන්ති ආරම්භ කිරීම, දින හා වේලාවන්, ශාලා වෙන්කිරීම සහ ශිෂ්‍ය නාමලේඛන
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>නව පන්තියක් ආරම්භ කරන්න</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="පන්තියේ නම, ගුරුතුමා හෝ විෂය අනුව සොයන්න..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">සියලු දින (All Days)</option>
            {DAYS.map(day => (
              <option key={day} value={day}>{SINHALA_DAYS[day]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            පන්ති කිසිවක් හමු නොවීය.
          </div>
        ) : (
          filteredClasses.map(cls => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const subject = subjects.find(s => s.id === cls.subjectId);
            const enrolledStudents = students.filter(s => s.enrolledClassIds?.includes(cls.id) && s.status === 'active');

            return (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                      {cls.id}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatLKR(cls.monthlyFee)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 leading-tight">
                    {cls.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-1">
                    {subject?.sinhalaName} • {cls.grade}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {teacher?.sinhalaName || teacher?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{cls.dayOfWeek} • {cls.startTime} - {cls.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{cls.hallNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setViewStudentsClass(cls)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{enrolledStudents.length} සිසුන්</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      title="සංස්කරණය"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmClass(cls)}
                      className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="මකා දමන්න"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Class Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingClass ? 'පන්ති තොරතුරු සංස්කරණය' : 'නව පන්තියක් ආරම්භ කිරීම'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">පන්තියේ නම *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 A/L සංයුක්ත ගණිතය (Theory)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">විෂය (Subject)</label>
                  <select
                    value={formData.subjectId}
                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.sinhalaName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ගුරුතුමා (Teacher)</label>
                  <select
                    value={formData.teacherId}
                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.sinhalaName || t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">පැවැත්වෙන දිනය</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{SINHALA_DAYS[d]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">මාසික ගාස්තුව (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyFee}
                    onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ආරම්භක වේලාව</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">අවසන් වන වේලාව</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ශාලාව (Hall / Room)</label>
                  <input
                    type="text"
                    value={formData.hallNumber}
                    onChange={e => setFormData({ ...formData, hallNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ශාඛාව (Branch)</label>
                  <select
                    value={formData.branchId}
                    onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.sinhalaName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  සුරකින්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Students Roster Modal */}
      {viewStudentsClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {viewStudentsClass.name}
                </h3>
                <p className="text-xs text-slate-500">ලියාපදිංචි ශිෂ්‍ය නාමලේඛනය</p>
              </div>
              <button onClick={() => setViewStudentsClass(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {students
                .filter(s => s.enrolledClassIds?.includes(viewStudentsClass.id) && s.status === 'active')
                .map((student, idx) => (
                  <div key={student.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-slate-400 w-5">{idx + 1}.</span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{student.sinhalaName || student.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{student.id} • {student.phone}</p>
                      </div>
                    </div>
                    {student.hasFreeCard && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">Free Card</span>
                    )}
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setViewStudentsClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs"
              >
                වසන්න
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmClass}
        title="පන්තිය මකා දැමීම තහවුරු කරන්න"
        message={`'${deleteConfirmClass?.name}' (${deleteConfirmClass?.id}) පන්තිය පද්ධතියෙන් ඉවත් කිරීමට ඔබට විශ්වාසද?`}
        confirmText="ඔව්, මකා දමන්න"
        cancelText="අවලංගු කරන්න"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmClass(null)}
      />
    </div>
  );
};
