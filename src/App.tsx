import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';

import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { AttendanceScanner } from './components/attendance/AttendanceScanner';
import { StudentManagement } from './components/students/StudentManagement';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { StudentQRCardModal } from './components/students/StudentQRCardModal';
import { TeacherManagement } from './components/teachers/TeacherManagement';
import { TeacherPayoutModal } from './components/finance/TeacherPayoutModal';
import { ClassManagement } from './components/classes/ClassManagement';
import { SubjectBranchManagement } from './components/subjects/SubjectBranchManagement';
import { PaymentManagement } from './components/finance/PaymentManagement';
import { CollectPaymentModal } from './components/finance/CollectPaymentModal';
import { ReceiptModal } from './components/finance/ReceiptModal';
import { ExpensesManagement } from './components/finance/ExpensesManagement';
import { ExamManagement } from './components/exams/ExamManagement';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';

import { TeacherPortal } from './components/portals/TeacherPortal';
import { StudentPortal } from './components/portals/StudentPortal';
import { ParentPortal } from './components/portals/ParentPortal';

import { FirebaseConfigModal } from './components/settings/FirebaseConfigModal';
import { BackupRestoreModal } from './components/backup/BackupRestoreModal';

import { Student, Teacher, PaymentRecord } from './types';

const MainAppContent: React.FC = () => {
  const { role } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global modals
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Common interactive modals across app
  const [activeQRStudent, setActiveQRStudent] = useState<Student | null>(null);
  const [activeProfileStudent, setActiveProfileStudent] = useState<Student | null>(null);
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<PaymentRecord | null>(null);
  const [collectPaymentStudent, setCollectPaymentStudent] = useState<Student | null>(null);
  const [isCollectPaymentOpen, setIsCollectPaymentOpen] = useState(false);
  const [activePayoutTeacher, setActivePayoutTeacher] = useState<Teacher | null>(null);

  // Scanner modal overlay from dashboard
  const [dashboardScannerClassId, setDashboardScannerClassId] = useState<string | null>(null);
  const [isDashboardScannerOpen, setIsDashboardScannerOpen] = useState(false);

  // Render role-specific direct view or standard admin tabs
  const renderContent = () => {
    // If student or parent role is selected, give their tailored portal directly when on dashboard
    if (role === 'student' && currentTab === 'dashboard') {
      return <StudentPortal />;
    }
    if (role === 'parent' && currentTab === 'dashboard') {
      return <ParentPortal />;
    }
    if (role === 'teacher' && currentTab === 'dashboard') {
      return <TeacherPortal />;
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            onNavigateTo={(tab) => setCurrentTab(tab)}
            onOpenQRScanner={(classId) => {
              setDashboardScannerClassId(classId || null);
              setIsDashboardScannerOpen(true);
            }}
            onViewStudent={(student) => setActiveProfileStudent(student)}
            onOpenQRCard={(student) => setActiveQRStudent(student)}
            onPrintReceipt={(payment) => setActiveReceiptPayment(payment)}
          />
        );
      case 'attendance':
        return <AttendanceManagement />;
      case 'students':
        return (
          <StudentManagement
            onCollectPayment={(student) => {
              setCollectPaymentStudent(student);
              setIsCollectPaymentOpen(true);
            }}
          />
        );
      case 'teachers':
        return (
          <TeacherManagement
            onOpenTeacherPayout={(teacher) => setActivePayoutTeacher(teacher)}
          />
        );
      case 'classes':
        return <ClassManagement />;
      case 'payments':
        return <PaymentManagement initialStudentForPayment={collectPaymentStudent} />;
      case 'expenses':
        return <ExpensesManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'branches_subjects':
        return <SubjectBranchManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'backup':
        return (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">උපස්ථ සහ දත්ත ප්‍රතිසාධනය</h3>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs"
            >
              උපස්ථ පාලක පුවරුව විවෘත කරන්න
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Firebase සැකසුම්</h3>
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs"
            >
              Firebase සැකසුම් විවෘත කරන්න
            </button>
          </div>
        );
      default:
        return <DashboardOverview onNavigateTo={setCurrentTab} onOpenQRScanner={() => setIsDashboardScannerOpen(true)} onViewStudent={setActiveProfileStudent} onOpenQRCard={setActiveQRStudent} onPrintReceipt={setActiveReceiptPayment} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'backup') {
            setIsBackupModalOpen(true);
          } else if (tab === 'settings') {
            setIsFirebaseModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-72">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      {/* Student QR Card Modal */}
      <StudentQRCardModal
        isOpen={!!activeQRStudent}
        student={activeQRStudent}
        onClose={() => setActiveQRStudent(null)}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!activeProfileStudent}
        student={activeProfileStudent}
        onClose={() => setActiveProfileStudent(null)}
        onOpenQRCard={(s) => setActiveQRStudent(s)}
        onCollectPayment={(s) => {
          setCollectPaymentStudent(s);
          setIsCollectPaymentOpen(true);
        }}
      />

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={!!activeReceiptPayment}
        payment={activeReceiptPayment}
        onClose={() => setActiveReceiptPayment(null)}
      />

      {/* Collect Payment Modal */}
      <CollectPaymentModal
        isOpen={isCollectPaymentOpen}
        preSelectedStudent={collectPaymentStudent}
        onClose={() => setIsCollectPaymentOpen(false)}
        onPaymentSuccess={(p) => setActiveReceiptPayment(p)}
      />

      {/* Teacher Payout Modal */}
      <TeacherPayoutModal
        isOpen={!!activePayoutTeacher}
        teacher={activePayoutTeacher}
        onClose={() => setActivePayoutTeacher(null)}
      />

      {/* Dashboard Instant QR Scanner Modal */}
      {isDashboardScannerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <AttendanceScanner
              initialClassId={dashboardScannerClassId || undefined}
              onClose={() => setIsDashboardScannerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
