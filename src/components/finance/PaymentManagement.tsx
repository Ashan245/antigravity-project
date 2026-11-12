import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PaymentRecord, Student } from '../../types';
import { CollectPaymentModal } from './CollectPaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { Badge } from '../common/Badge';
import { formatLKR, formatSinhalaDate, getCurrentMonthString } from '../../utils/formatters';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Wallet,
  ArrowRight
} from 'lucide-react';

interface PaymentManagementProps {
  initialStudentForPayment?: Student | null;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ initialStudentForPayment }) => {
  const { payments, students, classes } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState(getCurrentMonthString());
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Modals
  const [isCollectOpen, setIsCollectOpen] = useState(!!initialStudentForPayment);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  // Filter payments
  const filteredPayments = payments.filter(pay => {
    const q = searchQuery.toLowerCase();
    const student = students.find(s => s.id === pay.studentId);
    const cls = classes.find(c => c.id === pay.classId);

    const matchesSearch =
      pay.receiptNumber.toLowerCase().includes(q) ||
      pay.studentId.toLowerCase().includes(q) ||
      (student && (student.name.toLowerCase().includes(q) || (student.sinhalaName && student.sinhalaName.toLowerCase().includes(q)))) ||
      (cls && cls.name.toLowerCase().includes(q));

    const matchesMonth = !filterMonth || pay.month === filterMonth || pay.paymentDate.startsWith(filterMonth);
    const matchesStatus = statusFilter === 'all' || pay.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || pay.paymentMethod === methodFilter;

    return matchesSearch && matchesMonth && matchesStatus && matchesMethod;
  });

  // KPI Calculations
  const totalCollected = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDues = filteredPayments.reduce((sum, p) => sum + p.dueAmount, 0);

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Month', 'Student ID', 'Student Name', 'Class', 'Fee Amount', 'Paid Amount', 'Due Amount', 'Method', 'Status'];
    const rows = filteredPayments.map(p => {
      const s = students.find(st => st.id === p.studentId);
      const c = classes.find(cl => cl.id === p.classId);
      return [
        p.receiptNumber,
        p.paymentDate,
        p.month,
        p.studentId,
        `"${s?.name || ''}"`,
        `"${c?.name || ''}"`,
        p.feeAmount,
        p.paidAmount,
        p.dueAmount,
        p.paymentMethod,
        p.status
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAYMENT_RECORDS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ගාස්තු සහ මුදල් ලැබීම් (Fees & Payments)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ශිෂ්‍ය පන්ති ගාස්තු අය කිරීම, නිල රිසිට්පත් නිකුත් කිරීම සහ හිඟ මුදල් පාලනය
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV අපනයනය</span>
          </button>

          <button
            onClick={() => setIsCollectOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ගාස්තු අය කරන්න (Collect Fee)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ලැබුණු මුළු මුදල (Collected)</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatLKR(totalCollected)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ලැබීමට ඇති හිඟ මුදල් (Dues)</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {formatLKR(totalDues)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">නිකුත් කළ රිසිට්පත්</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {filteredPayments.length} රිසිට්පත්
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="රිසිට්පත් අංකය, සිසු නම හෝ අංකය අනුව සොයන්න..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">සියලු තත්ත්ව (All Status)</option>
            <option value="paid">සම්පූර්ණයෙන් ගෙවූ (Paid)</option>
            <option value="partial">හිඟ මුදල් සහිත (Partial)</option>
            <option value="free_card">නොමිලේ (Free Card)</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">රිසිට්පත් අංකය</th>
                <th className="py-3.5 px-4">සිසුවා (Student)</th>
                <th className="py-3.5 px-4">පන්තිය & මාසය</th>
                <th className="py-3.5 px-4">ගෙවූ මුදල (LKR)</th>
                <th className="py-3.5 px-4">ක්‍රමය</th>
                <th className="py-3.5 px-4">තත්ත්වය</th>
                <th className="py-3.5 px-4 text-right">රිසිට්පත</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ගෙවීම් සටහන් කිසිවක් හමු නොවීය.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const student = students.find(s => s.id === payment.studentId);
                  const cls = classes.find(c => c.id === payment.classId);

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-slate-900 dark:text-white block">
                          {payment.receiptNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{payment.paymentDate}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 dark:text-white block">
                          {student?.sinhalaName || student?.name || payment.studentId}
                        </span>
                        <span className="text-[10px] font-mono text-primary-600 font-bold">
                          {payment.studentId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {cls?.name || 'පන්ති ගාස්තු'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{payment.month} මාසය</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 block">
                          {formatLKR(payment.paidAmount)}
                        </span>
                        {payment.dueAmount > 0 && (
                          <span className="text-[10px] text-rose-600 font-bold">
                            හිඟ: {formatLKR(payment.dueAmount)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase text-[10px]">
                          {payment.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={payment.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveReceipt(payment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs shadow-sm ml-auto"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>රිසිට්පත</span>
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

      {/* Collect Payment Modal */}
      <CollectPaymentModal
        isOpen={isCollectOpen}
        preSelectedStudent={initialStudentForPayment}
        onClose={() => setIsCollectOpen(false)}
        onPaymentSuccess={(newPayment) => {
          setActiveReceipt(newPayment);
        }}
      />

      {/* Receipt View & Print Modal */}
      <ReceiptModal
        isOpen={!!activeReceipt}
        payment={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
