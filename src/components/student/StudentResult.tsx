import React, { useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import { QUESTIONS, EXAM_METADATA, CATEGORIES } from '../../data/examData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2,
  FileCheck,
  ChevronDown
} from 'lucide-react';

export const StudentResult: React.FC = () => {
  const { currentStudent, lastSubmission, submissions, retakeExam, setCurrentView } = useExam();

  const activeStudentName = currentStudent?.name || '';
  const submission = lastSubmission || submissions[activeStudentName] || Object.values(submissions)[0];

  useEffect(() => {
    // Fire celebratory confetti if grade >= 7
    if (submission && submission.grade >= 7.0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error('Confetti error', e);
      }
    }
  }, [submission]);

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center max-w-md shadow-xl border border-slate-200">
          <p className="text-slate-600 mb-4">Nenhuma avaliação encontrada para exibição.</p>
          <button
            onClick={() => setCurrentView('student-login')}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
          >
            Ir para Início
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats by category
  const categoryStats = CATEGORIES.map(category => {
    const questionsInCategory = QUESTIONS.filter(q => q.category === category);
    const correctCount = questionsInCategory.filter(q => submission.answers[q.id] === q.correctAnswer).length;
    const total = questionsInCategory.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return {
      category,
      total,
      correctCount,
      percentage: pct
    };
  });

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isApproved = submission.grade >= EXAM_METADATA.passingGrade;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Certificate / Hero Result Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200 overflow-hidden relative">
          
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 -m-6 sm:-m-8 p-6 sm:p-8 mb-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              {submission.studentPhoto ? (
                <img
                  src={submission.studentPhoto}
                  alt={submission.studentName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl border-2 border-emerald-400">
                  {submission.studentName.slice(0, 2)}
                </div>
              )}
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Desempenho Individual PDG
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {submission.studentName}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200">
                  {EXAM_METADATA.course} • {EXAM_METADATA.professor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprovante</span>
              </button>
            </div>
          </div>

          {/* Key Score Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            
            {/* Grade */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Nota Final
              </p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">
                {submission.grade.toFixed(1)}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Escala de 0 a 10.0
              </p>
            </div>

            {/* Total Correct */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Acertos
              </p>
              <p className="text-3xl sm:text-4xl font-black text-slate-800">
                {submission.score}<span className="text-base text-slate-400 font-normal">/15</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {submission.percentage}% de acerto
              </p>
            </div>

            {/* Status */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Situação
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {isApproved ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5" /> Aprovado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Em Revisão
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Média mín: {EXAM_METADATA.passingGrade}
              </p>
            </div>

            {/* Time */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Tempo de Prova
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                {formatMinutes(submission.timeSpentSeconds)}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Finalizado com sucesso
              </p>
            </div>

          </div>

          {/* Teacher Feedback Quote */}
          {submission.teacherFeedback && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Parecer Pedagógico do Docente ({EXAM_METADATA.professor}):</span>
              </div>
              <p className="text-slate-800 text-xs sm:text-sm italic leading-relaxed">
                "{submission.teacherFeedback}"
              </p>
            </div>
          )}

          {/* Competency Mastery Breakdown */}
          <div className="border border-slate-200 rounded-2xl p-5 mb-6 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Desempenho por Eixo Temático:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryStats.map(cat => (
                <div key={cat.category} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-1.5">
                    <span className="truncate pr-2">{cat.category}</span>
                    <span className="font-bold text-emerald-700">{cat.correctCount}/{cat.total} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.percentage >= 80 ? 'bg-emerald-500' : cat.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={retakeExam}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Refazer Avaliação</span>
            </button>

            <button
              onClick={() => setCurrentView('teacher-dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all ml-auto"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Acessar Painel do Professor</span>
            </button>
          </div>

        </div>

        {/* Detailed Question Review / Gabarito Comentado */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Gabarito Comentado — Questão por Questão
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confira a justificativa pedagógica e o raciocínio de negociação de cada estudo de caso.
            </p>
          </div>

          <div className="space-y-6">
            {QUESTIONS.map((q) => {
              const selected = submission.answers[q.id];
              const isCorrect = selected === q.correctAnswer;
              const selectedOptionObj = q.options.find(o => o.id === selected);
              const correctOptionObj = q.options.find(o => o.id === q.correctAnswer);

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl p-5 border-2 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-white">
                        Questão {q.id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" /> Correta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                          <XCircle className="w-3.5 h-3.5" /> Incorreta
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statement */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-4 leading-relaxed">
                    {q.statement}
                  </p>

                  {/* Options display */}
                  <div className="space-y-2 mb-4">
                    {q.options.map(opt => {
                      const isUserChoice = selected === opt.id;
                      const isOfficialCorrect = opt.id === q.correctAnswer;

                      let rowClass = "bg-white border-slate-200 text-slate-600";
                      if (isOfficialCorrect) {
                        rowClass = "bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold";
                      } else if (isUserChoice && !isCorrect) {
                        rowClass = "bg-rose-100/70 border-rose-400 text-rose-950 font-semibold";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${rowClass}`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isOfficialCorrect
                              ? 'bg-emerald-700 text-white'
                              : isUserChoice
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isOfficialCorrect && (
                            <span className="text-[10px] font-bold text-emerald-800 uppercase px-1.5 py-0.5 bg-emerald-200 rounded">
                              Gabarito
                            </span>
                          )}
                          {isUserChoice && !isOfficialCorrect && (
                            <span className="text-[10px] font-bold text-rose-800 uppercase px-1.5 py-0.5 bg-rose-200 rounded">
                              Sua Escolha
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Teacher Commentary */}
                  <div className="bg-emerald-900 text-emerald-50 p-3.5 rounded-xl text-xs leading-relaxed border border-emerald-700">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Comentário do Professor Marcelo Saldanha:
                    </p>
                    <p className="text-emerald-100">
                      {q.explanation}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
