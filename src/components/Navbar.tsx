import React from 'react';
import { useExam } from '../context/ExamContext';
import { 
  ShieldCheck, 
  Smartphone,
  Lock,
  LogOut
} from 'lucide-react';
import { EXAM_METADATA } from '../data/examData';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    submissions, 
    isTeacherAuthenticated,
    setIsAuthModalOpen,
    logoutTeacher
  } = useExam();

  const totalSubmissions = Object.keys(submissions).length;
  const isTeacherView = currentView === 'teacher-dashboard' || currentView === 'teacher-report';

  const handleTeacherTabClick = () => {
    if (isTeacherAuthenticated) {
      setCurrentView('teacher-dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg border-b border-emerald-700/50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Course info */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none" 
            onClick={() => {
              if (isTeacherView) {
                setCurrentView('teacher-dashboard');
              } else {
                setCurrentView('student-login');
              }
            }}
          >
            <div className="h-11 sm:h-12 px-2 bg-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-950/40">
              <img 
                src="/logo.png" 
                alt="Cooperalfa" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-wide text-white flex items-center gap-1.5">
                  PDG Cooperalfa
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 hidden sm:inline-block">
                  Pós-Graduação
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 line-clamp-1 font-medium">
                {EXAM_METADATA.course} • {EXAM_METADATA.professor}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Mode Switcher Tabs */}
            <div className="bg-emerald-950/60 p-1 rounded-xl border border-emerald-700/50 flex items-center text-xs sm:text-sm shadow-inner">
              <button
                onClick={() => setCurrentView('student-login')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  !isTeacherView
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Visão</span>
                <span>Aluno</span>
              </button>

              <button
                onClick={handleTeacherTabClick}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  isTeacherView
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                {isTeacherAuthenticated ? (
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
                ) : (
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                )}
                <span className="hidden xs:inline">Área do</span>
                <span>Professor</span>
                {totalSubmissions > 0 && isTeacherAuthenticated && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400">
                    {totalSubmissions}
                  </span>
                )}
              </button>
            </div>

            {/* Logout button for Teacher */}
            {isTeacherAuthenticated && isTeacherView && (
              <button
                onClick={logoutTeacher}
                title="Sair da Área do Professor (Bloquear com Senha)"
                className="p-2 rounded-xl bg-emerald-950/80 hover:bg-rose-900/60 text-emerald-200 hover:text-rose-200 border border-emerald-700/50 transition-all text-xs flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Bloquear</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
