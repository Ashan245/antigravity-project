import React, { useState, useEffect } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { X, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  record: AttendanceRecord | null;
  onClose: () => void;
}

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  isOpen,
  record,
  onClose
}) => {
  const { updateAttendance, deleteAttendance, students, classes } = useData();

  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      setStatus(record.status);
      setNotes(record.notes || '');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const student = students.find(s => s.id === record.studentId);
  const cls = classes.find(c => c.id === record.classId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAttendance(record.id, {
      status,
      notes: notes.trim()
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('මෙම පැමිණීමේ සටහන ඉවත් කිරීමට ඔබට විශ්වාසද?')) {
      deleteAttendance(record.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              පැමිණීම නිවැරදි කිරීම (Edit Attendance)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {student?.name} ({record.studentId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <p><span className="text-slate-500">පන්තිය:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{cls?.name}</span></p>
            <p><span className="text-slate-500">දිනය සහ වේලාව:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{record.date} {record.time}</span></p>
            <p><span className="text-slate-500">සටහන් කළ ක්‍රමය:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{record.method}</span></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              පැමිණීමේ තත්ත්වය (Status)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${status === 'present' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700'}`}>
                <input type="radio" name="status" value="present" checked={status === 'present'} onChange={() => setStatus('present')} />
                <span>පැමිණියා (Present)</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${status === 'late' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700'}`}>
                <input type="radio" name="status" value="late" checked={status === 'late'} onChange={() => setStatus('late')} />
                <span>ප්‍රමාදයි (Late)</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${status === 'absent' ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700'}`}>
                <input type="radio" name="status" value="absent" checked={status === 'absent'} onChange={() => setStatus('absent')} />
                <span>නොපැමිණි (Absent)</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${status === 'excused' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700'}`}>
                <input type="radio" name="status" value="excused" checked={status === 'excused'} onChange={() => setStatus('excused')} />
                <span>නිවාඩු (Excused)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              සටහන / හේතුව (Notes / Remarks)
            </label>
            <input
              type="text"
              placeholder="e.g. වෛද්‍ය හේතු මත නිවාඩු අනුමත විය"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="text-rose-600 hover:text-rose-700 font-bold"
            >
              ඉවත් කරන්න
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
              >
                සුරකින්න
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
