import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Student, PaymentRecord, PaymentMethod, PaymentStatus } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { formatLKR, getCurrentMonthString } from '../../utils/formatters';
import { X, CreditCard, DollarSign, User, Calendar, CheckCircle2 } from 'lucide-react';

interface CollectPaymentModalProps {
  isOpen: boolean;
  preSelectedStudent?: Student | null;
  onClose: () => void;
  onPaymentSuccess?: (payment: PaymentRecord) => void;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  isOpen,
  preSelectedStudent,
  onClose,
  onPaymentSuccess
}) => {
  const { students, classes, addPayment } = useData();

  const [studentId, setStudentId] = useState(preSelectedStudent?.id || students[0]?.id || '');
  const [classId, setClassId] = useState('');
  const [month, setMonth] = useState(getCurrentMonthString());
  const [feeAmount, setFeeAmount] = useState(3500);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(3500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashierName, setCashierName] = useState('කැෂියර් 01');
  const [notes, setNotes] = useState('');

  const selectedStudent = students.find(s => s.id === studentId);

  // When selected student changes, update classes and discount
  useEffect(() => {
    if (selectedStudent) {
      const studentClassId = selectedStudent.enrolledClassIds?.[0] || classes[0]?.id || '';
      setClassId(studentClassId);

      const targetCls = classes.find(c => c.id === studentClassId);
      const regularFee = targetCls?.monthlyFee || 3500;
      setFeeAmount(regularFee);

      if (selectedStudent.hasFreeCard) {
        setDiscount(regularFee);
        setPaidAmount(0);
      } else if (selectedStudent.discountPercent && selectedStudent.discountPercent > 0) {
        const disc = (regularFee * selectedStudent.discountPercent) / 100;
        setDiscount(disc);
        setPaidAmount(regularFee - disc);
      } else {
        setDiscount(0);
        setPaidAmount(regularFee);
      }
    }
  }, [studentId, selectedStudent, classes]);

  // When class changes
  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    const targetCls = classes.find(c => c.id === newClassId);
    const regularFee = targetCls?.monthlyFee || 3500;
    setFeeAmount(regularFee);

    if (selectedStudent?.hasFreeCard) {
      setDiscount(regularFee);
      setPaidAmount(0);
    } else if (selectedStudent?.discountPercent && selectedStudent.discountPercent > 0) {
      const disc = (regularFee * selectedStudent.discountPercent) / 100;
      setDiscount(disc);
      setPaidAmount(regularFee - disc);
    } else {
      setDiscount(0);
      setPaidAmount(regularFee);
    }
  };

  if (!isOpen) return null;

  const dueAmount = Math.max(0, feeAmount - discount - paidAmount);

  let status: PaymentStatus = 'paid';
  if (selectedStudent?.hasFreeCard || (discount === feeAmount && paidAmount === 0)) {
    status = 'free_card';
  } else if (dueAmount > 0) {
    status = 'partial';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !classId) {
      alert('කරුණාකර සිසුවා සහ පන්තිය තෝරන්න.');
      return;
    }

    const newPayment = addPayment({
      studentId,
      classId,
      month,
      feeAmount,
      discount,
      paidAmount,
      dueAmount,
      paymentMethod,
      status,
      cashierName,
      notes: notes.trim()
    });

    sounds.playPayment();
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    if (onPaymentSuccess) {
      onPaymentSuccess(newPayment);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                පන්ති ගාස්තු අය කිරීම (Fee Collection)
              </h3>
              <p className="text-xs text-slate-500">ගාස්තු ගෙවීම සහ ක්ෂණික රිසිට්පත් නිකුත් කිරීම</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              සිසුවා තෝරන්න (Select Student) *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.sinhalaName || s.name} ({s.grade}) {s.hasFreeCard ? '[Free Card]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              පන්තිය තෝරන්න (Select Class) *
            </label>
            <select
              value={classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name} (රු. {c.monthlyFee.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              අදාළ මාසය (Payment Month) *
            </label>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Fee & Calculation Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  මාසික ගාස්තුව (Fee Amount)
                </label>
                <input
                  type="number"
                  min="0"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  වට්ටම් (Discount LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-emerald-600 mb-1">
                  දැන් ගෙවන මුදල (Paid Amount LKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-900 px-3 py-1.5 font-black text-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  හිඟ මුදල (Due Balance)
                </label>
                <div className={`px-3 py-2 rounded-xl font-black text-sm ${dueAmount > 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-950' : 'text-slate-400 bg-white dark:bg-slate-900'}`}>
                  {formatLKR(dueAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ගෙවීම් ක්‍රමය (Method)
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-slate-900 dark:text-white"
              >
                <option value="cash">මුදලින් (Cash)</option>
                <option value="card">කාඩ්පත් (Card / POS)</option>
                <option value="bank_transfer">බැංකු තැන්පතු (Bank Transfer)</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                කැෂියර්ගේ නම
              </label>
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              සටහන් (Notes)
            </label>
            <input
              type="text"
              placeholder="e.g. අත්තිකාරම් මුදලක් ලෙස ලබාගන්නා ලදී"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              ගෙවීම සටහන් කර රිසිට්පත නිකුත් කරන්න
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
