import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AttendanceRecord, Student } from '../../types';
import { AttendanceScanner } from './AttendanceScanner';
import { AttendanceCorrectionModal } from './AttendanceCorrectionModal';
import { Badge } from '../common/Badge';
import { formatSinhalaDate, getTodayDateString } from '../../utils/formatters';
import { 
  QrCode, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserX, 
  MessageSquare, 
  Edit, 
  Download,
  Plus
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const { attendance, classes, students, markAttendance } = useData();

  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showScanner, setShowScanner] = useState<boolean>(false);

  // Correction modal
  const [selectedRecordToEdit, setSelectedRecordToEdit] = useState<AttendanceRecord | null>(null);

  // Filter attendance records
  const filteredRecords = attendance.filter(rec => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesClass = selectedClassId === 'all' || rec.classId === selectedClassId;
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesDate && matchesClass && matchesStatus;
  });

  // Calculate Absentees for selected class and date
  const absenteesList: Student[] = [];
  if (selectedClassId !== 'all') {
    const enrolledStudents = students.filter(
      s => s.status === 'active' && s.enrolledClassIds?.includes(selectedClassId)
    );
    const presentStudentIds = new Set(
      attendance
        .filter(a => a.classId === selectedClassId && a.date === selectedDate && (a.status === 'present' || a.status === 'late'))
        .map(a => a.studentId)
    );

    enrolledStudents.forEach(s => {
      if (!presentStudentIds.has(s.id)) {
        absenteesList.push(s);
      }
    });
  }

  // Summary counts
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;

  const currentClass = classes.find(c => c.id === selectedClassId);

  // Send WhatsApp notification to parent
  const handleSendWhatsAppNotification = (student: Student) => {
    const parentPhone = student.parentPhone || student.phone;
    const cleanPhone = parentPhone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '94' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `හිතවත් දෙමාපියනි,\nඔබගේ දරුවා වන ${student.sinhalaName || student.name} (${student.id}) අද දින (${selectedDate}) ${currentClass?.name || 'පන්තිය'} ට සහභාගී නොවූ බව කාරුණිකව දැනුම් දෙමු.\n- TUITION PRO ආයතනය -`
    );
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              QR පැමිණීමේ පද්ධතිය (QR Attendance)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            සජීවී කැමරා ස්කෑනරය, දෛනික වාර්තා, නොපැමිණි සිසුන් හඳුනාගැනීම සහ දෙමාපිය දැනුම්දීම්
          </p>
        </div>

        <button
          onClick={() => setShowScanner(!showScanner)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all self-start sm:self-auto ${
            showScanner
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{showScanner ? 'ස්කෑනරය වසන්න' : 'සජීවී QR Scanner අරඹන්න'}</span>
        </button>
      </div>

      {/* Embedded Live Scanner view if toggled */}
      {showScanner && (
        <AttendanceScanner
          initialClassId={selectedClassId !== 'all' ? selectedClassId : undefined}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Filter Row & KPI chips */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            දිනය (Date):
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            පන්තිය (Class):
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">සියලු පන්ති (All Classes)</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            තත්ත්වය (Status):
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">සියල්ල (All)</option>
            <option value="present">පැමිණි (Present)</option>
            <option value="late">ප්‍රමාද (Late)</option>
            <option value="absent">නොපැමිණි (Absent)</option>
            <option value="excused">නිවාඩු (Excused)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedDate(todayStr);
              setSelectedClassId('all');
              setStatusFilter('all');
            }}
            className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            පෙරහන් ඉවත් කරන්න
          </button>
        </div>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">පැමිණි සිසුන්</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{presentCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">ප්‍රමාද වූ සිසුන්</span>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{lateCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">නොපැමිණි සිසුන් (සටහන් වූ)</span>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{absentCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Absentees Alert Section if class is selected */}
      {selectedClassId !== 'all' && absenteesList.length > 0 && (
        <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-rose-950 dark:text-rose-100">
                අද දින මෙම පන්තියට නොපැමිණි සිසුන් ({absenteesList.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
              {currentClass?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {absenteesList.map(s => (
              <div
                key={s.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white truncate">{s.sinhalaName || s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{s.id} • {s.parentPhone || s.phone}</p>
                </div>

                <button
                  onClick={() => handleSendWhatsAppNotification(s)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm active:scale-95 transition-all shrink-0"
                  title="WhatsApp පණිවිඩයක් යවන්න"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            පැමිණීමේ සටහන් ලේඛනය ({filteredRecords.length})
          </h3>
          <span className="text-xs text-slate-500">
            {selectedDate ? formatSinhalaDate(selectedDate) : 'සියලු දින'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">සිසුවා (Student)</th>
                <th className="py-3.5 px-4">පන්තිය (Class)</th>
                <th className="py-3.5 px-4">දිනය & වේලාව</th>
                <th className="py-3.5 px-4">ක්‍රමය (Method)</th>
                <th className="py-3.5 px-4">තත්ත්වය (Status)</th>
                <th className="py-3.5 px-4 text-right">සංස්කරණය</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    පැමිණීම් සටහන් කිසිවක් හමු නොවීය.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => {
                  const student = students.find(s => s.id === rec.studentId);
                  const cls = classes.find(c => c.id === rec.classId);

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={student?.name}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">
                              {student?.sinhalaName || student?.name || rec.studentId}
                            </span>
                            <span className="text-[10px] font-mono text-primary-600 font-bold">
                              {rec.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {cls?.name || rec.classId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-800 dark:text-slate-200 block">{rec.date}</span>
                        <span className="text-[10px] font-mono text-slate-400">{rec.time}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {rec.method === 'qr_scanner' ? 'QR Camera Scanner' : 'Manual Entry'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={rec.status} size="sm" />
                        {rec.notes && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">{rec.notes}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecordToEdit(rec)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="පැමිණීම නිවැරදි කරන්න"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Correction Modal */}
      <AttendanceCorrectionModal
        isOpen={!!selectedRecordToEdit}
        record={selectedRecordToEdit}
        onClose={() => setSelectedRecordToEdit(null)}
      />
    </div>
  );
};
