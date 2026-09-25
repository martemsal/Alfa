import React from 'react';
import { useExam } from '../context/ExamContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  RotateCcw, 
  Sparkles,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { EXAM_METADATA } from '../data/examData';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentStudent, 
    submissions, 
    loadDemoData 
  } = useExam();

  const totalSubmissions = Object.keys(submissions).length;
  const isTeacherView = currentView === 'teacher-dashboard' || currentView === 'teacher-report';

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg border-b border-emerald-700/50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Course info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('student-login')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center shadow-md shadow-emerald-950/40 text-emerald-950 font-black text-xl tracking-tight">
              α
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

          {/* Center / Right controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Quick Demo button if empty */}
            {totalSubmissions === 0 && (
              <button
                onClick={loadDemoData}
                title="Carregar respostas simuladas para demonstrar o painel e relatório"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Carregar Demo (25 Alunos)</span>
              </button>
            )}

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
                onClick={() => setCurrentView('teacher-dashboard')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  isTeacherView
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
                <span className="hidden xs:inline">Painel</span>
                <span>Professor</span>
                {totalSubmissions > 0 && (
                  <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isTeacherView ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {totalSubmissions}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
