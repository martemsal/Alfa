import React from 'react';
import { useExam } from '../../context/ExamContext';
import { STUDENTS_LIST, QUESTIONS, EXAM_METADATA, CATEGORIES } from '../../data/examData';
import { DEFAULT_PENDING_FEEDBACKS } from '../../data/officialSubmissions';
import { 
  Printer, 
  ChevronLeft, 
  Award, 
  CheckCircle2, 
  FileCheck, 
  TrendingUp, 
  Calendar, 
  Building2, 
  UserCheck 
} from 'lucide-react';

export const TeacherReport: React.FC = () => {
  const { submissions, teacherFeedbacks, setCurrentView, students, excludedStudents } = useExam();

  const totalStudents = students.length;
  const activeStudentNames = new Set(students.map(s => s.name));
  const completedList = Object.values(submissions).filter(s => s.status === 'concluido' && activeStudentNames.has(s.studentName));
  const completedCount = completedList.length;

  const averageGrade = completedCount > 0 
    ? Number((completedList.reduce((acc, c) => acc + c.grade, 0) / completedCount).toFixed(1)) 
    : 0;

  const approvalCount = completedList.filter(s => s.grade >= EXAM_METADATA.passingGrade).length;
  const approvalRate = completedCount > 0 ? Math.round((approvalCount / completedCount) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => setCurrentView('teacher-dashboard')}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Painel</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Dica: Clique abaixo para salvar como PDF oficial
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-800/20 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl print:rounded-none shadow-2xl print:shadow-none border border-slate-200 print:border-none p-6 sm:p-12 text-slate-800">
        
        {/* Document Header with Cooperalfa Styling */}
        <div className="border-b-2 border-emerald-800 pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 px-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="Cooperalfa" 
                  className="h-10 w-auto object-contain" 
                />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
                  COOPERALFA • COOPERATIVA AGROINDUSTRIAL ALFA
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  RELATÓRIO GERENCIAL DE AVALIAÇÃO DE DESEMPENHO
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  {EXAM_METADATA.program}
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 text-xs text-slate-500 space-y-0.5">
              <p><strong className="text-slate-800">Emissão:</strong> {currentDate}</p>
              <p><strong className="text-slate-800">Docente:</strong> {EXAM_METADATA.professor}</p>
              <p><strong className="text-slate-800">Carga Horária:</strong> {EXAM_METADATA.hours}</p>
            </div>
          </div>
        </div>

        {/* Course Identification Details */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Disciplina</span>
            <p className="font-bold text-slate-800 mt-0.5">{EXAM_METADATA.course}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Metodologia</span>
            <p className="font-bold text-slate-800 mt-0.5">Método de Harvard no Agro & Casos Cooperalfa</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total de Matriculados</span>
            <p className="font-bold text-slate-800 mt-0.5">{totalStudents} Alunos no Espelho da Turma</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Destinatário</span>
            <p className="font-bold text-slate-800 mt-0.5">Coordenação Geral do PDG Cooperalfa</p>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="mb-8">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-600 pl-3 mb-4">
            1. Sumário Executivo do Desempenho da Turma
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
            A presente avaliação calibrada para o nível gerencial do PDG Cooperalfa mensurou a competência negocial dos participantes através de 15 estudos de caso práticos de balcão e lavoura. Foram avaliados os eixos de <em>Ecossistema Cooperativo, Método de Harvard (Posições vs. Interesses, MAANA/BATNA e Ganho Mútuo), Estilos de Negociadores, Comunicação Assertiva, Gestão de Inadimplência e Resolução de Conflitos no Campo</em>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Média Geral da Turma</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800">{averageGrade.toFixed(1)}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Meta: 7.0 / 10.0</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Participação</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800">{completedCount}/{totalStudents}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {Math.round((completedCount / totalStudents) * 100)}% de adesão
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Taxa de Aprovação</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800">{approvalRate}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{approvalCount} alunos acima da média</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Carga Horária</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800">{EXAM_METADATA.hours}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Módulo Concluído</span>
            </div>
          </div>
        </div>

        {/* Section 2: Topic Mastery */}
        <div className="mb-8">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-600 pl-3 mb-4">
            2. Análise de Domínio por Eixo Temático
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(category => {
              const questionsInCat = QUESTIONS.filter(q => q.category === category);
              let totalCorrect = 0;
              let totalPossible = questionsInCat.length * completedCount;

              completedList.forEach(sub => {
                questionsInCat.forEach(q => {
                  if (sub.answers[q.id] === q.correctAnswer) {
                    totalCorrect++;
                  }
                });
              });

              const pct = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;

              return (
                <div key={category} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span className="text-slate-800">{category}</span>
                    <span className="text-emerald-800">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Student Roster with Photos & Feedback */}
        <div className="mb-8">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-600 pl-3 mb-4">
            3. Espelho Individual de Desempenho e Pareceres Pedagógicos
          </h2>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">Foto</th>
                  <th className="py-3 px-3">Aluno(a)</th>
                  <th className="py-3 px-3 text-center">Acertos</th>
                  <th className="py-3 px-3 text-center">Nota</th>
                  <th className="py-3 px-3">Parecer Avaliativo do Professor Marcelo Saldanha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student, idx) => {
                  const sub = submissions[student.name];
                  const feedback = sub?.teacherFeedback || teacherFeedbacks[student.name] || DEFAULT_PENDING_FEEDBACKS[student.name] || 'Participação ativa no módulo; bom domínio dos conceitos de balcão.';

                  return (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-2.5 px-3 text-center align-top">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-300 mx-auto"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center mx-auto">
                            {student.name.slice(0, 2)}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3 font-bold text-slate-900 align-top">
                        {student.name}
                      </td>

                      <td className="py-2.5 px-3 text-center text-slate-700 font-semibold align-top">
                        {sub ? `${sub.score}/15` : 'Pendente'}
                      </td>

                      <td className="py-2.5 px-3 text-center align-top">
                        {sub ? (
                          <span className={`font-black text-xs px-2 py-0.5 rounded ${
                            sub.grade >= 8.5
                              ? 'bg-emerald-100 text-emerald-900'
                              : sub.grade >= 7.0
                              ? 'bg-teal-100 text-teal-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {sub.grade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 text-[11px] leading-relaxed whitespace-pre-line align-top">
                        {feedback}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {excludedStudents.length > 0 && (
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-[10px] text-slate-500 italic">
                * Nota: {excludedStudents.length} aluno(s) desvinculado(s)/desistente(s) da turma ({excludedStudents.map(e => e.name).join(', ')}) foram formalmente excluídos e não constam nesta ata oficial de notas.
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Institutional Guidelines & Recommendations */}
        <div className="mb-10 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-700 space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 text-sm">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            4. Diretrizes Institucionais e Recomendações Finais para a Rede Alfa
          </h3>
          <div className="space-y-3 pt-1">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-emerald-900 mb-1 text-xs">Institucionalização da Abordagem Consultiva:</h4>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                As lideranças das filiais devem disseminar junto aos balconistas e agrônomos de campo a prática de investigação ativa de interesses antes de qualquer cotação. O antídoto contra a perda de clientes para multinacionais consiste na valorização do ciclo integrado: fornecimento seguro de insumos, assistência técnica presencial na lavoura, garantia de recebimento nos armazéns Alfa e retorno das sobras de exercício.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-emerald-900 mb-1 text-xs">Mitigação Preventiva de Inadimplência:</h4>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Incentivar que todas as operações a prazo safra sejam lastreadas em instrumentos de mercado formais (Cédulas de Produto Rural - CPR, Barter físico e alienação fiduciária). Em anos de adversidade climática, a renegociação deve focar na liquidação com estoques de grãos já depositados e na rolagem assistida, assegurando que o cooperado continue na atividade sem onerar o balanço da filial.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-emerald-900 mb-1 text-xs">Fortalecimento da Comunicação Assertiva:</h4>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Eliminar abordagens informais artificiais ou posturas defensivas. O cooperado deve ser tratado como sócio e coproprietário da cooperativa, exigindo transparência de dados, planejamento agronômico e cumprimento rigoroso da palavra empenhada.
              </p>
            </div>
          </div>
        </div>

        {/* Signature Block */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="w-48 h-0.5 bg-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-900">{EXAM_METADATA.professor}</p>
            <p className="text-slate-500">Docente Responsável — Negociação Estratégica</p>
          </div>

          <div>
            <div className="w-48 h-0.5 bg-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-900">Coordenação de Pós-Graduação</p>
            <p className="text-slate-500">Programa de Desenvolvimento Gerencial (PDG) — Cooperalfa</p>
          </div>
        </div>

      </div>
    </div>
  );
};
