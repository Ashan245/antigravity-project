import React from 'react';
import { useData } from '../../context/DataContext';
import { PaymentRecord } from '../../types';
import { Badge } from '../common/Badge';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { CreditCard, Printer, ArrowRight } from 'lucide-react';

interface RecentPaymentsListProps {
  onPrintReceipt: (payment: PaymentRecord) => void;
  onViewAllPayments: () => void;
}

export const RecentPaymentsList: React.FC<RecentPaymentsListProps> = ({
  onPrintReceipt,
  onViewAllPayments
}) => {
  const { payments, students, classes } = useData();

  // Sort by recent payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            මෑතකදී ලැබුණු ගෙවීම්
          </h3>
        </div>
        <button
          onClick={onViewAllPayments}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          <span>සියල්ල බලන්න</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {recentPayments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">ගෙවීම් සටහන් වී නොමැත</p>
        ) : (
          recentPayments.map((payment) => {
            const student = students.find(s => s.id === payment.studentId);
            const cls = classes.find(c => c.id === payment.classId);

            return (
              <div
                key={payment.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {student?.sinhalaName || student?.name || payment.studentId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      #{payment.receiptNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {cls?.name || 'පන්ති ගාස්තු'} • {payment.paymentMethod.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {formatLKR(payment.paidAmount)}
                    </p>
                    <Badge status={payment.status} size="sm" />
                  </div>

                  <button
                    onClick={() => onPrintReceipt(payment)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="රිසිට්පත මුද්‍රණය"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
