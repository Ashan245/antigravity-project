import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { StudentModal } from './StudentModal';
import { StudentProfileModal } from './StudentProfileModal';
import { StudentQRCardModal } from './StudentQRCardModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  QrCode, 
  Edit, 
  Power, 
  Trash2, 
  Eye, 
  Download,
  CreditCard,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface StudentManagementProps {
  onCollectPayment?: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ onCollectPayment }) => {
  const { students, toggleStudentStatus, deleteStudent, classes } = useData();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [qrCardStudent, setQrCardStudent] = useState<Student | null>(null);

  // Deletion confirm state
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      student.name.toLowerCase().includes(q) ||
      (student.sinhalaName && student.sinhalaName.toLowerCase().includes(q)) ||
      student.id.toLowerCase().includes(q) ||
      student.phone.includes(q) ||
      student.school.toLowerCase().includes(q);

    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmStudent) {
      deleteStudent(deleteConfirmStudent.id);
      setDeleteConfirmStudent(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Sinhala Name', 'Gender', 'Phone', 'School', 'Grade', 'Stream', 'Status'];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.sinhalaName || ''}"`,
      s.gender,
      s.phone,
      `"${s.school}"`,
      `"${s.grade}"`,
      `"${s.stream || ''}"`,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TUITION_PRO_STUDENTS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              සිසුන් කළමනාකරණය
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            සිසුන් ලියාපදිංචිය, QR කාඩ්පත්, විස්තර සංස්කරණය සහ තත්ත්ව පාලනය
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors"
            title="CSV වාර්තාව බාගත කරන්න"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV අපනයනය</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>නව සිසුවෙකු ඇතුළත් කරන්න</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="නම, සිසු අංකය, පාසල හෝ දුරකථනය අනුව සොයන්න..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">සියලු ශ්‍රේණි (All Grades)</option>
            <option value="Grade 12 - 2026 A/L">Grade 12 - 2026 A/L</option>
            <option value="Grade 13 - 2025 A/L">Grade 13 - 2025 A/L</option>
            <option value="Grade 11 - O/L">Grade 11 - O/L</option>
            <option value="Grade 10">Grade 10</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">සියලු තත්ත්ව (All Status)</option>
            <option value="active">සක්‍රිය සිසුන් (Active)</option>
            <option value="inactive">අක්‍රිය සිසුන් (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">සිසුවා (Student)</th>
                <th className="py-3.5 px-4">අධ්‍යාපනික තොරතුරු</th>
                <th className="py-3.5 px-4">සම්බන්ධතා</th>
                <th className="py-3.5 px-4">පන්ති ගණන</th>
                <th className="py-3.5 px-4">තත්ත්වය</th>
                <th className="py-3.5 px-4 text-right">ක්‍රියාමාර්ග (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    ගැළපෙන සිසුන් හමු නොවීය.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {student.name}
                            </span>
                            {student.hasFreeCard && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 text-[10px] font-bold">
                                Free
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-primary-600 dark:text-primary-400 font-mono font-bold block">
                            {student.id}
                          </span>
                          {student.sinhalaName && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {student.sinhalaName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* School & Grade */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{student.grade}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{student.school}</p>
                      {student.stream && (
                        <span className="text-[10px] text-slate-400">{student.stream}</span>
                      )}
                    </td>

                    {/* Contacts */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{student.phone}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        දෙමාපිය: {student.parentPhone || '-'}
                      </p>
                    </td>

                    {/* Classes Count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                        {student.enrolledClassIds?.length || 0} පන්ති
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge status={student.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Profile Button */}
                        <button
                          onClick={() => setProfileStudent(student)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="සම්පූර්ණ තොරතුරු බලන්න"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* QR Card Button */}
                        <button
                          onClick={() => setQrCardStudent(student)}
                          className="p-1.5 rounded-lg border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950 text-primary-600 dark:text-primary-400"
                          title="QR කාඩ්පත මුද්‍රණය"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="සංස්කරණය"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Soft Delete / Toggle Status */}
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            student.status === 'active'
                              ? 'border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
                              : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                          }`}
                          title={student.status === 'active' ? 'අක්‍රිය කරන්න (Deactivate)' : 'නැවත සක්‍රිය කරන්න (Activate)'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Permanent Delete with confirmation */}
                        <button
                          onClick={() => setDeleteConfirmStudent(student)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400"
                          title="මකා දමන්න (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddEditOpen}
        studentToEdit={editingStudent}
        onClose={() => setIsAddEditOpen(false)}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!profileStudent}
        student={profileStudent}
        onClose={() => setProfileStudent(null)}
        onOpenQRCard={(s) => setQrCardStudent(s)}
        onCollectPayment={(s) => onCollectPayment && onCollectPayment(s)}
      />

      {/* QR Card Modal */}
      <StudentQRCardModal
        isOpen={!!qrCardStudent}
        student={qrCardStudent}
        onClose={() => setQrCardStudent(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmStudent}
        title="සිසුවා මකා දැමීම තහවුරු කරන්න"
        message={`${deleteConfirmStudent?.name} (${deleteConfirmStudent?.id}) පද්ධතියෙන් ස්ථිරවම මකා දැමීමට ඔබට විශ්වාසද? මෙයින් පසු මෙම දත්ත නැවත ලබාගත නොහැක. (මකාදැමීම වෙනුවට තාවකාලිකව අක්‍රිය කිරීම නිර්දේශ කෙරේ).`}
        confirmText="ඔව්, මකා දමන්න"
        cancelText="අවලංගු කරන්න"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmStudent(null)}
      />
    </div>
  );
};
