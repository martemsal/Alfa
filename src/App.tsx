import React from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { Navbar } from './components/Navbar';
import { StudentLogin } from './components/student/StudentLogin';
import { StudentExam } from './components/student/StudentExam';
import { StudentResult } from './components/student/StudentResult';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherReport } from './components/teacher/TeacherReport';
import { TeacherAuthModal } from './components/modals/TeacherAuthModal';

const ExamAppContent: React.FC = () => {
  const { currentView, isTeacherAuthenticated } = useExam();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'student-login' && <StudentLogin />}
        {currentView === 'student-test' && <StudentExam />}
        {currentView === 'student-result' && <StudentResult />}
        
        {/* Protected Teacher Views */}
        {currentView === 'teacher-dashboard' && (
          isTeacherAuthenticated ? <TeacherDashboard /> : <StudentLogin />
        )}
        {currentView === 'teacher-report' && (
          isTeacherAuthenticated ? <TeacherReport /> : <StudentLogin />
        )}
      </main>

      {/* Password Protection Modal */}
      <TeacherAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ExamProvider>
      <ExamAppContent />
    </ExamProvider>
  );
}
