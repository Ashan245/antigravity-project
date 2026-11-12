import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { sounds } from '../../utils/audio';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  User, 
  Calendar,
  X
} from 'lucide-react';

interface AttendanceScannerProps {
  initialClassId?: string;
  onClose?: () => void;
}

export const AttendanceScanner: React.FC<AttendanceScannerProps> = ({
  initialClassId,
  onClose
}) => {
  const { classes, students, markAttendance } = useData();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId || classes[0]?.id || ''
  );
  const [manualStudentId, setManualStudentId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scan feedback state
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    studentName?: string;
    studentId?: string;
    photoUrl?: string;
    time?: string;
    message: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastScannedCodeRef = useRef<string | null>(null);
  const lastScanTimestampRef = useRef<number>(0);

  // Stop camera stream helper
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Start camera stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('කැමරාව ආරම්භ කිරීමට නොහැකි විය. කරුණාකර කැමරා අවසරය පරීක්ෂා කරන්න හෝ පහත ඇති අංක ඇතුළත් කිරීමේ ක්‍රමය භාවිත කරන්න.');
      setIsScanning(false);
    }
  };

  // Frame scanning loop
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const rawPayload = code.data.trim();
        const now = Date.now();

        // Prevent rapid re-scanning of same code within 3 seconds
        if (lastScannedCodeRef.current !== rawPayload || (now - lastScanTimestampRef.current) > 3000) {
          lastScannedCodeRef.current = rawPayload;
          lastScanTimestampRef.current = now;
          handleProcessQR(rawPayload);
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleProcessQR = (qrString: string) => {
    if (!selectedClassId) {
      alert('කරුණාකර පළමුව පන්තිය තෝරන්න.');
      return;
    }

    // Process token (e.g. "TP-STU-001" or "STU-001")
    let studentId = qrString;
    if (studentId.startsWith('TP-')) {
      studentId = studentId.replace('TP-', '');
    }

    const student = students.find(s => s.id === studentId || s.qrCode === qrString);

    if (!student) {
      if (soundEnabled) sounds.playError();
      setLastScanResult({
        success: false,
        message: `වලංගු නොවන QR කේතයකි (${qrString}). සිසුවා හමු නොවීය.`
      });
      return;
    }

    // Call markAttendance
    const res = markAttendance(student.id, selectedClassId, 'present', 'qr_scanner');

    if (res.success) {
      if (soundEnabled) sounds.playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {}

      setLastScanResult({
        success: true,
        studentName: student.name,
        studentId: student.id,
        photoUrl: student.photoUrl,
        time: res.record?.time,
        message: res.message
      });
    } else {
      if (soundEnabled) sounds.playError();
      setLastScanResult({
        success: false,
        studentName: student.name,
        studentId: student.id,
        photoUrl: student.photoUrl,
        message: res.message
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId.trim()) return;
    handleProcessQR(manualStudentId.trim().toUpperCase());
    setManualStudentId('');
  };

  const currentClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              සජීවී QR පැමිණීමේ ස්කෑනරය (Live QR Scanner)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            කැමරාව මගින් හෝ අංකය මගින් එකවර පැමිණීම සටහන් කිරීම සහ දෙවරක් සටහන් වීම වැළැක්වීම
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            title="ශබ්දය සක්‍රිය/අක්‍රිය"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-rose-600" />}
            <span className="hidden sm:inline">{soundEnabled ? 'ශබ්දය On' : 'ශබ්දය Mute'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Class Selection & Quick Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            පැමිණීම ගන්නා පන්තිය තෝරන්න (Select Class) *
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name} ({c.dayOfWeek} {c.startTime})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {isScanning ? (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              <CameraOff className="w-4 h-4" />
              <span>කැමරාව නවතන්න (Stop Camera)</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>කැමරාව ක්‍රියාත්මක කරන්න (Start Camera)</span>
            </button>
          )}
        </div>
      </div>

      {/* Camera Viewport & Live Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Camera Feed / Viewport */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-black overflow-hidden relative min-h-[340px] flex flex-col items-center justify-center shadow-lg">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover max-h-[420px] ${!isScanning ? 'hidden' : 'block'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Overlay Guide Box */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-64 h-64 border-2 border-emerald-400 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                {/* Scanning laser animation bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                <div className="absolute -top-6 left-0 right-0 text-center text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  QR කේතය මෙම කොටුව තුළට යොමු කරන්න
                </div>
              </div>
            </div>
          )}

          {/* Camera Idle State */}
          {!isScanning && (
            <div className="p-8 text-center text-white space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-200">
                කැමරාව ක්‍රියාවිරහිතයි
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                කැමරාව මගින් QR ස්කෑන් කිරීම ආරම්භ කිරීමට 'කැමරාව ක්‍රියාත්මක කරන්න' බොත්තම ඔබන්න.
              </p>
              <button
                onClick={startCamera}
                className="mt-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all"
              >
                කැමරාව අරඹන්න
              </button>
            </div>
          )}

          {/* Camera error message */}
          {cameraError && (
            <div className="absolute bottom-4 left-4 right-4 bg-rose-900/90 text-rose-100 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-300" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Right: Manual Input & Instant Scan Feedback */}
        <div className="space-y-6">
          {/* Manual Student ID / QR Code form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary-600" />
              <span>අතින් ඇතුළත් කිරීම (Manual Entry / Barcode Gun)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Barcode Reader යන්ත්‍රයකින් හෝ සිසු අංකය (STU-001) ටයිප් කර Enter කරන්න
            </p>

            <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="e.g. STU-001 හෝ TP-STU-001"
                value={manualStudentId}
                onChange={(e) => setManualStudentId(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/25 active:scale-95 transition-all"
              >
                සටහන් කරන්න
              </button>
            </form>
          </div>

          {/* Live Scan Result Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              අවසන් ස්කෑන් ප්‍රතිඵලය (Last Scan Result)
            </h3>

            {lastScanResult ? (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  lastScanResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  {lastScanResult.photoUrl ? (
                    <img
                      src={lastScanResult.photoUrl}
                      alt={lastScanResult.studentName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shrink-0 shadow-md"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${lastScanResult.success ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {lastScanResult.success ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${lastScanResult.success ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800' : 'bg-rose-200 dark:bg-rose-900 text-rose-800'}`}>
                        {lastScanResult.success ? 'සාර්ථකයි (Verified)' : 'අසාර්ථකයි (Rejected)'}
                      </span>
                      {lastScanResult.time && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {lastScanResult.time}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold truncate">
                      {lastScanResult.studentName || 'හඳුනා නොගත් සිසුවෙකි'}
                    </h4>

                    {lastScanResult.studentId && (
                      <p className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                        {lastScanResult.studentId}
                      </p>
                    )}

                    <p className="text-xs mt-1 font-medium">
                      {lastScanResult.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                තවමත් QR කේතයක් ස්කෑන් කර නොමැත.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
