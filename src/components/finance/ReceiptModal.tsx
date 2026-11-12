import React from 'react';
import { PaymentRecord } from '../../types';
import { useData } from '../../context/DataContext';
import { formatLKR, formatSinhalaDate } from '../../utils/formatters';
import { exportElementAsPDF, printElement } from '../../utils/pdfGenerator';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  payment: PaymentRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  payment,
  onClose
}) => {
  const { students, classes, branches } = useData();

  if (!isOpen || !payment) return null;

  const student = students.find(s => s.id === payment.studentId);
  const cls = classes.find(c => c.id === payment.classId);
  const receiptElementId = `official-receipt-${payment.id}`;

  const handlePrint = () => {
    printElement(receiptElementId);
  };

  const handleDownloadPDF = async () => {
    await exportElementAsPDF(receiptElementId, `${payment.receiptNumber}_RECEIPT`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              නිල මුදල් ලැබීම් රිසිට්පත (Official Payment Receipt)
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              #{payment.receiptNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="my-6 flex justify-center">
          <div
            id={receiptElementId}
            className="w-full bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg text-xs"
            style={{ minHeight: '380px' }}
          >
            {/* Receipt Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                TUITION PRO HIGHER EDUCATION INSTITUTE
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                ශ්‍රී ලංකා පන්ති කළමනාකරණ ආයතනය
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                නුගේගොඩ • ගම්පහ • මහනුවර | දුරකථන: 011-2824500 | Email: accounts@tuitionpro.lk
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-md font-bold uppercase tracking-wider text-[11px] border border-slate-300">
                මුදල් ලැබීම් රිසිට්පත • CASH RECEIPT
              </div>
            </div>

            {/* Receipt Metadata Row */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200">
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-500">රිසිට්පත් අංකය:</span> <span className="font-mono font-bold">{payment.receiptNumber}</span></p>
                <p><span className="font-semibold text-slate-500">දිනය සහ වේලාව:</span> <span className="font-bold">{payment.paymentDate}</span></p>
                <p><span className="font-semibold text-slate-500">අදාළ මාසය:</span> <span className="font-bold">{payment.month}</span></p>
              </div>
              <div className="space-y-1 text-right">
                <p><span className="font-semibold text-slate-500">සිසු අංකය:</span> <span className="font-mono font-bold text-primary-700">{student?.id}</span></p>
                <p><span className="font-semibold text-slate-500">සිසුවාගේ නම:</span> <span className="font-bold">{student?.name}</span></p>
                <p><span className="font-semibold text-slate-500">ශ්‍රේණිය:</span> <span>{student?.grade}</span></p>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-4 border-b border-slate-200">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase">
                    <th className="py-2">විස්තරය (Description)</th>
                    <th className="py-2 text-right">නියමිත ගාස්තුව</th>
                    <th className="py-2 text-right">වට්ටම්</th>
                    <th className="py-2 text-right">ගෙවූ මුදල (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5">
                      <p className="font-bold text-slate-900">{cls?.name || 'පන්ති ගාස්තු'}</p>
                      <p className="text-[10px] text-slate-500">මාසික පන්ති ගාස්තුව • {payment.month}</p>
                    </td>
                    <td className="py-2.5 text-right font-medium">{formatLKR(payment.feeAmount)}</td>
                    <td className="py-2.5 text-right font-medium">{formatLKR(payment.discount)}</td>
                    <td className="py-2.5 text-right font-black">{formatLKR(payment.paidAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            <div className="pt-4 flex justify-between items-start">
              <div className="space-y-1">
                <p><span className="font-bold text-slate-600">ගෙවීම් ක්‍රමය:</span> <span className="font-semibold uppercase">{payment.paymentMethod}</span></p>
                <p><span className="font-bold text-slate-600">කැෂියර්:</span> <span>{payment.cashierName}</span></p>
                {payment.notes && <p className="text-[10px] text-slate-500 italic">සටහන: {payment.notes}</p>}
              </div>

              <div className="space-y-1 text-right">
                <p className="text-sm"><span className="font-bold">ගෙවූ මුළු මුදල:</span> <span className="font-black text-base text-slate-900">{formatLKR(payment.paidAmount)}</span></p>
                {payment.dueAmount > 0 && (
                  <p className="text-xs text-rose-700 font-bold">
                    හිඟ මුදල (Due Balance): {formatLKR(payment.dueAmount)}
                  </p>
                )}
                <div className="pt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{payment.status === 'paid' ? 'සම්පූර්ණයෙන් ගෙවා ඇත' : payment.status === 'partial' ? 'අර්ධ ගෙවීමකි' : 'නොමිලේ කාඩ්පත'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex items-end justify-between text-[10px] text-slate-500">
              <div>
                <p>පද්ධතිය මගින් නිකුත් කරන ලද නිල ලේඛනයකි.</p>
                <p>www.tuitionpro.lk</p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-700">බලයලත් අත්සන (Cashier)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>මුද්‍රණය කරන්න (Print)</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>PDF රිසිට්පත බාගත කරන්න</span>
          </button>
        </div>
      </div>
    </div>
  );
};
