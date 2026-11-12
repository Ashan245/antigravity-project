import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Teacher } from '../../types';
import { formatLKR, getCurrentMonthString } from '../../utils/formatters';
import { X, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';

interface TeacherPayoutModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
}

export const TeacherPayoutModal: React.FC<TeacherPayoutModalProps> = ({
  isOpen,
  teacher,
  onClose
}) => {
  const { classes, students, payments, addExpense } = useData();

  const [month, setMonth] = useState(getCurrentMonthString());
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (teacher) {
      const teacherClassIds = classes.filter(c => c.teacherId === teacher.id).map(c => c.id);
      
      // Calculate total student fee revenue collected for this teacher in this month
      const relevantPayments = payments.filter(
        p => teacherClassIds.includes(p.classId) && (p.month === month || p.paymentDate.startsWith(month))
      );
      const totalCollected = relevantPayments.reduce((sum, p) => sum + p.paidAmount, 0);

      let payout = 0;
      if (teacher.salaryType === 'percentage') {
        payout = Math.round((totalCollected * teacher.salaryRate) / 100);
      } else if (teacher.salaryType === 'fixed_per_student') {
        // Enrolled active students count
        const enrolledStudents = students.filter(
          s => s.status === 'active' && s.enrolledClassIds?.some(cid => teacherClassIds.includes(cid))
        ).length;
        payout = enrolledStudents * teacher.salaryRate;
      } else {
        payout = teacher.salaryRate;
      }

      setAmount(payout);
      setNotes(`${teacher.sinhalaName || teacher.name} - ${month} මාසික ගුරු වැටුප`);
      setIsCalculated(true);
    }
  }, [teacher, month, classes, payments, students, isOpen]);

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('කරුණාකර වලංගු මුදලක් ඇතුළත් කරන්න.');
      return;
    }

    addExpense({
      title: `${teacher.sinhalaName || teacher.name} - ගුරු ගෙවීම (${month})`,
      category: 'teacher_payout',
      amount,
      date: new Date().toISOString().split('T')[0],
      paidTo: teacher.name,
      teacherId: teacher.id,
      receiptRef: `TCH-${Date.now().toString().slice(-5)}`,
      notes
    });

    alert(`${teacher.name} සඳහා රු. ${amount.toLocaleString()} ක ගෙවීම සාර්ථකව වියදම් ලේඛනයට එක් කරන ලදී.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ගුරු වැටුප් ගණනය (Teacher Payout)
              </h3>
              <p className="text-xs text-slate-500">{teacher.name} ({teacher.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              අදාළ මාසය (Payout Month)
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">ගෙවීම් ක්‍රමය:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {teacher.salaryType === 'percentage' ? `${teacher.salaryRate}% කොමිස් ප්‍රතිශතය` : `රු. ${teacher.salaryRate} (Fixed)`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-indigo-200/50">
              <span className="font-bold text-slate-800 dark:text-slate-200">ගණනය කළ ශුද්ධ මුදල:</span>
              <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                {formatLKR(amount)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ගෙවන මුදල (LKR)
            </label>
            <input
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              සටහන් / බැංකු විස්තර
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
            />
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              ගෙවීම තහවුරු කරන්න
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
