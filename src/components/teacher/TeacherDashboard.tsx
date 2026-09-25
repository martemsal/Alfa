import React, { useState, useMemo } from 'react';
import { useExam } from '../../context/ExamContext';
import { STUDENTS_LIST, QUESTIONS, EXAM_METADATA, CATEGORIES } from '../../data/examData';
import { Student } from '../../types';
import { StudentDetailModal } from './StudentDetailModal';
import { 
  Users, 
  Award, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  Download, 
  Upload, 
  BarChart3, 
  LayoutGrid, 
  List, 
  Eye, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    submissions,
    teacherFeedbacks,
    loadDemoData,
    resetAllData,
    exportDataJSON,
    importDataJSON,
    setCurrentView
  } = useExam();

  const [activeTab, setActiveTab] = useState<'mirror' | 'analytics'>('mirror');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'high' | 'low'>('all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Aggregated Stats
  const totalStudents = STUDENTS_LIST.length;
  const completedList = useMemo(() => {
    return Object.values(submissions).filter(s => s.status === 'concluido');
  }, [submissions]);

  const completedCount = completedList.length;
  const pendingCount = totalStudents - completedCount;

  const averageGrade = useMemo(() => {
    if (completedCount === 0) return 0;
    const sum = completedList.reduce((acc, curr) => acc + curr.grade, 0);
    return Number((sum / completedCount).toFixed(1));
  }, [completedList, completedCount]);

  const highestGrade = useMemo(() => {
    if (completedCount === 0) return 0;
    return Math.max(...completedList.map(s => s.grade));
  }, [completedList, completedCount]);

  const lowestGrade = useMemo(() => {
    if (completedCount === 0) return 0;
    return Math.min(...completedList.map(s => s.grade));
  }, [completedList, completedCount]);

  const approvalRate = useMemo(() => {
    if (completedCount === 0) return 0;
    const passed = completedList.filter(s => s.grade >= EXAM_METADATA.passingGrade).length;
    return Math.round((passed / completedCount) * 100);
  }, [completedList, completedCount]);

  // Question error rate analytics
  const questionAnalytics = useMemo(() => {
    return QUESTIONS.map(q => {
      let correct = 0;
      let wrong = 0;
      completedList.forEach(sub => {
        if (sub.answers[q.id] === q.correctAnswer) {
          correct++;
        } else if (sub.answers[q.id]) {
          wrong++;
        }
      });
      const totalAnswered = correct + wrong;
      const successPct = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
      const errorPct = totalAnswered > 0 ? 100 - successPct : 0;
      return {
        ...q,
        correct,
        wrong,
        totalAnswered,
        successPct,
        errorPct
      };
    });
  }, [completedList]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return STUDENTS_LIST.filter(student => {
      const sub = submissions[student.name];
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (filterStatus === 'completed') return !!sub;
      if (filterStatus === 'pending') return !sub;
      if (filterStatus === 'high') return !!sub && sub.grade >= 8.5;
      if (filterStatus === 'low') return !!sub && sub.grade < 7.0;
      return true;
    });
  }, [searchTerm, filterStatus, submissions]);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cooperalfa_pdg_provas_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const content = re.target?.result as string;
          if (content && importDataJSON(content)) {
            alert('Dados importados com sucesso!');
          } else {
            alert('Erro ao importar arquivo JSON.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Painel de Controle do Docente</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {EXAM_METADATA.course}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {EXAM_METADATA.program} • {EXAM_METADATA.professor}
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setCurrentView('teacher-report')}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Gerar Relatório Coordenação (PDF)</span>
              </button>

              {completedCount === 0 && (
                <button
                  onClick={loadDemoData}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simular Turma (Demo)</span>
                </button>
              )}

              {/* Data Tools Menu */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={handleExport}
                  title="Exportar JSON das provas"
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button
                  onClick={handleImport}
                  title="Importar JSON de provas"
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Importar</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Deseja zerar todas as provas e recomeçar a avaliação da turma?")) {
                      resetAllData();
                    }
                  }}
                  title="Zerar todas as provas"
                  className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Zerar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
            
            {/* Total Students */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Total Turma</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800">{totalStudents}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Alunos matriculados</p>
            </div>

            {/* Completed */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Provas Feitas</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">
                {completedCount}<span className="text-sm font-normal text-slate-400">/{totalStudents}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {Math.round((completedCount / totalStudents) * 100)}% concluído
              </p>
            </div>

            {/* Average Grade */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Média Geral</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">
                {averageGrade.toFixed(1)}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Meta PDG: 7.0</p>
            </div>

            {/* Highest Grade */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Maior Nota</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800">
                {highestGrade > 0 ? highestGrade.toFixed(1) : '-'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Destaque da turma</p>
            </div>

            {/* Lowest Grade */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Menor Nota</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800">
                {lowestGrade > 0 ? lowestGrade.toFixed(1) : '-'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Ponto de apoio</p>
            </div>

            {/* Approval Rate */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase">Aprovação</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800">
                {approvalRate}%
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Aproveitamento geral</p>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('mirror')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'mirror'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Espelho da Turma ({STUDENTS_LIST.length} Alunos)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Análise Pedagógica & Competências</span>
            </button>
          </div>

          {activeTab === 'mirror' && (
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'}`}
                title="Visualização em Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'}`}
                title="Visualização em Tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: ESPELHO DA TURMA */}
        {activeTab === 'mirror' && (
          <div className="space-y-4">
            
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar aluno por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filtrar:
                </span>
                
                {[
                  { key: 'all', label: `Todos (${STUDENTS_LIST.length})` },
                  { key: 'completed', label: `Feitas (${completedCount})` },
                  { key: 'pending', label: `Pendentes (${pendingCount})` },
                  { key: 'high', label: 'Destaque (≥ 8.5)' },
                  { key: 'low', label: 'Atenção (< 7.0)' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilterStatus(f.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      filterStatus === f.key
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

            </div>

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStudents.map((student) => {
                  const sub = submissions[student.name];
                  const feedback = sub?.teacherFeedback || teacherFeedbacks[student.name];
                  const isDone = !!sub;

                  return (
                    <div
                      key={student.id}
                      className={`bg-white rounded-2xl border-2 p-4 shadow-md transition-all hover:shadow-lg flex flex-col justify-between relative overflow-hidden ${
                        isDone 
                          ? sub.grade >= 8.5 
                            ? 'border-emerald-300' 
                            : sub.grade >= 7.0 
                            ? 'border-slate-200' 
                            : 'border-amber-300'
                          : 'border-slate-200/80 bg-slate-50/40 opacity-80'
                      }`}
                    >
                      {/* Top student card info */}
                      <div>
                        <div className="flex items-start gap-3 mb-3">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                              {student.name.slice(0, 2)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={student.name}>
                              {student.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 block mb-1">
                              PDG Cooperalfa
                            </span>

                            {isDone ? (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sub.grade >= 8.5
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.grade >= 7.0
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                Nota {sub.grade.toFixed(1)} ({sub.score}/15)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                <Clock className="w-3 h-3" /> Aguardando Prova
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Feedback summary snippet */}
                        {feedback ? (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-3 text-[11px] text-slate-700 line-clamp-2 italic">
                            "{feedback}"
                          </div>
                        ) : (
                          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-dashed border-slate-200 mb-3 text-[10px] text-slate-400">
                            Sem parecer cadastrado ainda.
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedStudentForModal(student)}
                          className="flex-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isDone ? 'Ver Prova' : 'Avaliar'}</span>
                        </button>

                        <button
                          onClick={() => setSelectedStudentForModal(student)}
                          title="Editar Parecer"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Aluno(a)</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-center">Acertos</th>
                        <th className="py-3.5 px-4 text-center">Nota Final</th>
                        <th className="py-3.5 px-4">Parecer do Professor</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => {
                        const sub = submissions[student.name];
                        const feedback = sub?.teacherFeedback || teacherFeedbacks[student.name];

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition-all">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {student.photo ? (
                                  <img
                                    src={student.photo}
                                    alt={student.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                    {student.name.slice(0, 2)}
                                  </div>
                                )}
                                <span className="font-bold text-slate-800">{student.name}</span>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center">
                              {sub ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  Concluído
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                  Pendente
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center font-bold text-slate-700">
                              {sub ? `${sub.score}/15 (${sub.percentage}%)` : '-'}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {sub ? (
                                <span className="text-sm font-black text-emerald-700">
                                  {sub.grade.toFixed(1)}
                                </span>
                              ) : '-'}
                            </td>

                            <td className="py-3 px-4 max-w-xs truncate text-slate-600 italic">
                              {feedback || '—'}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedStudentForModal(student)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-200 transition-all"
                              >
                                Detalhes
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ANÁLISE PEDAGÓGICA */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Category Performance */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Domínio da Turma por Eixo Temático
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Aproveitamento agregado dos 25 alunos por área de conhecimento da ementa de Negociação Cooperativa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div key={category} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                        <span className="truncate pr-2">{category}</span>
                        <span className="text-emerald-700 font-black text-sm">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-teal-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {questionsInCat.length} {questionsInCat.length === 1 ? 'questão avaliada' : 'questões avaliadas'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question by Question Map */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Taxa de Acerto por Questão (Q1 a Q15)
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Identifique exatamente quais estudos de caso geraram maiores dúvidas no balcão e no campo.
              </p>

              <div className="space-y-4">
                {questionAnalytics.map(q => {
                  return (
                    <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                            Q{q.id}
                          </span>
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {q.title}
                          </span>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                            {q.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-emerald-700">
                            {q.successPct}% Acerto ({q.correct}/{completedCount})
                          </span>
                          {q.errorPct >= 20 && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              {q.errorPct}% Erro
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full"
                          style={{ width: `${q.successPct}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        <strong>Foco de Negociação:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Student Details Modal */}
      {selectedStudentForModal && (
        <StudentDetailModal
          student={selectedStudentForModal}
          submission={submissions[selectedStudentForModal.name]}
          onClose={() => setSelectedStudentForModal(null)}
        />
      )}

    </div>
  );
};
