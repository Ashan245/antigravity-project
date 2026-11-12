import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Teacher } from '../../types';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { TeacherModal } from './TeacherModal';
import { TeacherProfileModal } from './TeacherProfileModal';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Edit, 
  Power, 
  Trash2, 
  Eye, 
  DollarSign, 
  BookOpen, 
  Calendar 
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

interface TeacherManagementProps {
  onOpenTeacherPayout?: (teacher: Teacher) => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({ onOpenTeacherPayout }) => {
  const { teachers, toggleTeacherStatus, deleteTeacher, subjects, classes } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [profileTeacher, setProfileTeacher] = useState<Teacher | null>(null);

  const [deleteConfirmTeacher, setDeleteConfirmTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(q) ||
      (t.sinhalaName && t.sinhalaName.toLowerCase().includes(q)) ||
      t.id.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      t.nic.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setIsAddEditOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTeacher) {
      deleteTeacher(deleteConfirmTeacher.id);
      setDeleteConfirmTeacher(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ගුරුවරුන් කළමනාකරණය
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ආයතනයේ ගුරු මණ්ඩලය, විෂයයන්, වැටුප් ප්‍රතිශත සහ බැංකු ගිණුම් කළමනාකරණය
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>නව ගුරුවරයෙකු ලියාපදිංචි කරන්න</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ගුරුවරයාගේ නම, ගුරු අංකය, NIC හෝ දුරකථනය අනුව සොයන්න..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">සියලු තත්ත්ව (All Status)</option>
            <option value="active">සක්‍රිය ගුරුවරුන් (Active)</option>
            <option value="inactive">අක්‍රිය ගුරුවරුන් (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            ගැළපෙන ගුරුවරුන් හමු නොවීය.
          </div>
        ) : (
          filteredTeachers.map(teacher => {
            const teacherClasses = classes.filter(c => c.teacherId === teacher.id);
            const teacherSubs = subjects.filter(s => teacher.subjectIds?.includes(s.id));

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-mono">
                          {teacher.id}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 leading-snug">
                          {teacher.name}
                        </h3>
                        {teacher.sinhalaName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {teacher.sinhalaName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge status={teacher.status} size="sm" />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium line-clamp-1">
                    {teacher.qualifications}
                  </p>

                  {/* Teaching subjects pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {teacherSubs.map(sub => (
                      <span
                        key={sub.id}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                      >
                        {sub.sinhalaName}
                      </span>
                    ))}
                  </div>

                  {/* Class count & Scheme */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-primary-600" />
                      <span>{teacherClasses.length} පන්ති</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        {teacher.salaryType === 'percentage'
                          ? `${teacher.salaryRate}% කොමිස්`
                          : `රු. ${teacher.salaryRate} (Fixed)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setProfileTeacher(teacher)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>විස්තර</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onOpenTeacherPayout && (
                      <button
                        onClick={() => onOpenTeacherPayout(teacher)}
                        className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                        title="වැටුප් ගෙවීම"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="සංස්කරණය"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleTeacherStatus(teacher.id)}
                      className={`p-1.5 rounded-xl border ${
                        teacher.status === 'active'
                          ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={teacher.status === 'active' ? 'අක්‍රිය කරන්න' : 'සක්‍රිය කරන්න'}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmTeacher(teacher)}
                      className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40"
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

      {/* Add / Edit Teacher Modal */}
      <TeacherModal
        isOpen={isAddEditOpen}
        teacherToEdit={editingTeacher}
        onClose={() => setIsAddEditOpen(false)}
      />

      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={!!profileTeacher}
        teacher={profileTeacher}
        onClose={() => setProfileTeacher(null)}
        onCalculatePayout={(t) => onOpenTeacherPayout && onOpenTeacherPayout(t)}
      />

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmTeacher}
        title="ගුරුවරයා මකා දැමීම තහවුරු කරන්න"
        message={`${deleteConfirmTeacher?.name} (${deleteConfirmTeacher?.id}) පද්ධතියෙන් ස්ථිරවම මකා දැමීමට ඔබට විශ්වාසද? මෙයින් පසු මෙම දත්ත නැවත ලබාගත නොහැක.`}
        confirmText="ඔව්, මකා දමන්න"
        cancelText="අවලංගු කරන්න"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmTeacher(null)}
      />
    </div>
  );
};
