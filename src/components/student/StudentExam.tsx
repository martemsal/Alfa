import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import { QUESTIONS, EXAM_METADATA } from '../../data/examData';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  Grid, 
  Send, 
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const StudentExam: React.FC = () => {
  const {
    currentStudent,
    activeAnswers,
    flaggedQuestions,
    currentQuestionIndex,
    testStartTime,
    selectAnswer,
    toggleFlagQuestion,
    goToQuestion,
    submitExam,
    setCurrentView
  } = useExam();

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (testStartTime) {
        setElapsedSeconds(Math.floor((Date.now() - testStartTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [testStartTime]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(activeAnswers).length;
  const isCurrentFlagged = flaggedQuestions.includes(currentQuestion.id);
  const selectedOption = activeAnswers[currentQuestion.id];

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      goToQuestion(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    submitExam();
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-28">
      
      {/* Sticky Header Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Student Info & Photo */}
          <div className="flex items-center gap-2.5 min-w-0">
            {currentStudent?.photo ? (
              <img
                src={currentStudent.photo}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentStudent?.name.slice(0, 2) || 'AL'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {currentStudent?.name || 'Aluno'}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold">
                Questão {currentQuestionIndex + 1} de {totalQuestions}
              </p>
            </div>
          </div>

          {/* Center: Progress & Timer */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Question Map Trigger */}
            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-all"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Mapa ({answeredCount}/{totalQuestions})</span>
            </button>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mt-2.5">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Question Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/90 relative">
          
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                Q{currentQuestion.id}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                {currentQuestion.category}
              </span>
            </div>

            {/* Flag / Bookmark Button */}
            <button
              onClick={() => toggleFlagQuestion(currentQuestion.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isCurrentFlagged
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isCurrentFlagged ? 'Marcada p/ Revisão' : 'Marcar p/ Revisar'}</span>
            </button>
          </div>

          {/* Subtitle / Topic */}
          <h2 className="text-sm sm:text-base font-bold text-emerald-950 mb-3">
            {currentQuestion.title}
          </h2>

          {/* Statement / Case Study */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50/80 border-l-4 border-emerald-500 p-4 rounded-r-2xl mb-6 font-medium">
            {currentQuestion.statement}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Selecione a alternativa correta:
            </p>

            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-700/5'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 bg-white'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {option.id.toUpperCase()}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isSelected ? 'text-emerald-950 font-semibold' : 'text-slate-700'
                  }`}>
                    {option.text}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </main>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg shadow-slate-900/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1 px-3 sm:px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {/* Quick status counter on mobile */}
          <span className="text-xs font-semibold text-slate-500 sm:hidden">
            {answeredCount}/15 Resp.
          </span>

          {/* Next / Submit Button */}
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <span>Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/30 transition-all animate-pulse"
            >
              <span>Finalizar Prova</span>
              <Send className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Question Map Modal Drawer */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-600" />
                Mapa de Questões (1 a 15)
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 my-4">
              {QUESTIONS.map((q, idx) => {
                const isAnswered = !!activeAnswers[q.id];
                const isCurrent = idx === currentQuestionIndex;
                const isFlagged = flaggedQuestions.includes(q.id);

                let btnClass = "bg-slate-100 text-slate-700 border-slate-200";
                if (isCurrent) {
                  btnClass = "ring-2 ring-emerald-500 font-black bg-emerald-50 text-emerald-900 border-emerald-400";
                } else if (isAnswered) {
                  btnClass = "bg-emerald-600 text-white font-bold border-emerald-600";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      goToQuestion(idx);
                      setShowMapModal(false);
                    }}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center text-xs relative transition-all ${btnClass}`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-600" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300" />
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Marcada</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => {
                  setShowMapModal(false);
                  setShowConfirmModal(true);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Concluir e Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
              Deseja finalizar sua prova?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              Você respondeu a <strong>{answeredCount}</strong> de <strong>{totalQuestions}</strong> questões.
              {answeredCount < totalQuestions && (
                <span className="block mt-1 text-amber-600 font-semibold">
                  Atenção: Existem {totalQuestions - answeredCount} questões sem resposta!
                </span>
              )}
              {flaggedQuestions.length > 0 && (
                <span className="block mt-0.5 text-slate-500">
                  Você possui {flaggedQuestions.length} questões marcadas para revisão.
                </span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
              >
                Voltar e Revisar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all"
              >
                Sim, Finalizar Prova
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
