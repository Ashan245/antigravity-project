import React, { useRef } from 'react';
import { Student } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, ShieldCheck, Phone, School, Sparkles } from 'lucide-react';
import { exportElementAsPDF, printElement } from '../../utils/pdfGenerator';

interface StudentQRCardModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const StudentQRCardModal: React.FC<StudentQRCardModalProps> = ({
  isOpen,
  student,
  onClose
}) => {
  if (!isOpen || !student) return null;

  const cardElementId = `student-card-${student.id}`;

  const handlePrint = () => {
    printElement(cardElementId);
  };

  const handleDownloadPDF = async () => {
    await exportElementAsPDF(cardElementId, `${student.id}_QR_CARD`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              ශිෂ්‍ය QR හැඳුනුම්පත (Student QR ID Card)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {student.name} • {student.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="my-6 flex justify-center">
          <div
            id={cardElementId}
            className="w-full max-w-md bg-white text-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative print:shadow-none print:border-none"
            style={{ width: '400px', minHeight: '260px' }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-primary-600 to-indigo-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">
                  TP
                </div>
                <div>
                  <h4 className="font-extrabold text-xs tracking-wider leading-none">
                    TUITION PRO
                  </h4>
                  <span className="text-[9px] text-indigo-100 uppercase tracking-widest">
                    ශිෂ්‍ය හැඳුනුම්පත • Student ID
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  2025/2026
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 grid grid-cols-3 gap-3 bg-gradient-to-b from-white to-slate-50">
              {/* Photo & Barcode column */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <img
                  src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={student.name}
                  className="w-20 h-24 object-cover rounded-xl border-2 border-primary-500 shadow-md"
                />
                <span className="mt-1 text-[9px] font-black text-slate-600 tracking-wider">
                  {student.barcode}
                </span>
              </div>

              {/* Details & QR Code column */}
              <div className="col-span-2 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-primary-100 text-primary-800 font-extrabold text-[10px]">
                    ID: {student.id}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-tight">
                    {student.name}
                  </h3>
                  {student.sinhalaName && (
                    <p className="text-xs font-semibold text-slate-600">
                      {student.sinhalaName}
                    </p>
                  )}

                  <div className="mt-1.5 space-y-0.5 text-[10px] text-slate-600">
                    <p><span className="font-bold">පාසල:</span> {student.school}</p>
                    <p><span className="font-bold">ශ්‍රේණිය:</span> {student.grade}</p>
                    <p><span className="font-bold">හදිසි ඇමතුම්:</span> {student.parentPhone || student.phone}</p>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified QR Code</span>
                  </div>
                  <div className="p-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <QRCodeSVG
                      value={student.qrCode}
                      size={60}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="bg-slate-900 px-4 py-1.5 text-white flex items-center justify-between text-[8px] font-medium">
              <span>TUITION PRO MANAGEMENT SYSTEM</span>
              <span>www.tuitionpro.lk</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            QR කේතය: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{student.qrCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>මුද්‍රණය කරන්න (Print)</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md shadow-primary-500/25 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>PDF බාගත කරන්න (Download)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
