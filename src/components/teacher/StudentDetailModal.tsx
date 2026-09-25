import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { QUESTIONS, EXAM_METADATA } from '../../data/examData';
import { Student, ExamSubmission } from '../../types';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  MessageSquare, 
  Save, 
  BookOpen, 
  User, 
  Trash2,
  Check
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  submission?: ExamSubmission;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  submission,
  onClose
}) => {
  const { updateTeacherFeedback, deleteSubmission, teacherFeedbacks } = useExam();

  const [feedbackText, setFeedbackText] = useState(
    submission?.teacherFeedback || teacherFeedbacks[student.name] || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveFeedback = () => {
    updateTeacherFeedback(student.name, feedbackText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Deseja realmente apagar a prova de ${student.name}?`)) {
      deleteSubmission(student.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-400">
                {student.name.slice(0, 2)}
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full inline-block mb-1">
                Espelho do Aluno • PDG Cooperalfa
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {student.name}
              </h2>
              <p className="text-xs text-emerald-200">
                {EXAM_METADATA.course}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          
          {/* Status & Scores */}
          {submission ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase text-emerald-800">Nota Final</p>
                <p className="text-2xl font-black text-emerald-700">{submission.grade.toFixed(1)}</p>
                <p className="text-[10px] text-emerald-600">Escala 0-10</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-500">Acertos</p>
                <p className="text-2xl font-black text-slate-800">{submission.score}/15</p>
                <p className="text-[10px] text-slate-500">{submission.percentage}% aproveitamento</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-500">Tempo de Prova</p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {Math.floor(submission.timeSpentSeconds / 60)}m {submission.timeSpentSeconds % 60}s
                </p>
                <p className="text-[10px] text-slate-500">Concluído</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Situação</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full mx-auto ${
                  submission.grade >= 7.0 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {submission.grade >= 7.0 ? 'Aprovado' : 'Em Análise'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-amber-900 text-xs sm:text-sm">
              <p className="font-bold">Aluno ainda não iniciou a prova.</p>
              <p className="text-amber-700 mt-0.5">O status mudará automaticamente assim que ele enviar as respostas pelo celular ou computador.</p>
            </div>
          )}

          {/* Teacher Feedback Editor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Feedback Individual do Professor Marcelo Saldanha:
              </label>

              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Salvo com sucesso!
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Digite um feedback personalizado sobre o desempenho do aluno neste módulo do PDG..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />

            {/* Quick feedback templates */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold self-center">Sugestões rápidas:</span>
              <button
                type="button"
                onClick={() => setFeedbackText("Excelente domínio do Método de Harvard e foco nas relações de longo prazo com o cooperado.")}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              >
                + Excelente Harvard
              </button>
              <button
                type="button"
                onClick={() => setFeedbackText("Bom desempenho comercial. Recomenda-se aprofundar na técnica de MAANA e separação de pessoas e problemas.")}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              >
                + Reforçar MAANA
              </button>
              <button
                type="button"
                onClick={() => setFeedbackText("Boa postura empática no atendimento a produtores tradicionais e assertividade no balcão Alfa.")}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              >
                + Postura Empática
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Feedback</span>
              </button>
            </div>
          </div>

          {/* Question-by-Question Response Audit if completed */}
          {submission && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Respostas Assinaladas (15 Questões):
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {QUESTIONS.map(q => {
                  const studentAns = submission.answers[q.id];
                  const isCorrect = studentAns === q.correctAnswer;
                  const correctOpt = q.options.find(o => o.id === q.correctAnswer);
                  const studentOpt = q.options.find(o => o.id === studentAns);

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">Q{q.id}: {q.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-1 line-clamp-1">
                          {q.statement}
                        </p>
                        <p className="text-[11px] text-slate-800">
                          <strong>Resposta do Aluno:</strong> {studentAns ? `${studentAns.toUpperCase()}) ${studentOpt?.text}` : 'Não respondida'}
                        </p>
                        {!isCorrect && (
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            <strong>Gabarito Correto:</strong> {q.correctAnswer.toUpperCase()}) {correctOpt?.text}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3 h-3" /> Acertou
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            <XCircle className="w-3 h-3" /> Errou
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          {submission ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Prova Deste Aluno</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
