import React, { useState, useMemo } from 'react';
import { useExam } from '../../context/ExamContext';
import { STUDENTS_LIST, EXAM_METADATA } from '../../data/examData';
import { Student } from '../../types';
import { 
  User, 
  BookOpen, 
  Clock, 
  Award, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const StudentLogin: React.FC = () => {
  const { startTest, submissions, setCurrentView, setCurrentStudent } = useExam();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Filter student list
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return STUDENTS_LIST;
    return STUDENTS_LIST.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCustomName(student.name);
    setIsCustomMode(false);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      startTest(selectedStudent);
    } else if (customName.trim()) {
      startTest({
        name: customName.trim(),
        photo: null
      });
    }
  };

  const activeStudentName = selectedStudent?.name || (customName.trim() ? customName.toUpperCase() : null);
  const existingSubmission = activeStudentName ? submissions[activeStudentName] : null;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 mb-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Avaliação Individual PDG Cooperalfa</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              {EXAM_METADATA.course}
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm font-normal leading-relaxed mb-4">
              {EXAM_METADATA.program}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-600/50 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-100">
                <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                <span><strong>15</strong> Questões Práticas</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-100">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{EXAM_METADATA.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-100 col-span-2 sm:col-span-1">
                <User className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{EXAM_METADATA.professor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Identification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Identificação do(a) Aluno(a)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Localize seu nome abaixo para iniciar a sua prova individual.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-5">
            
            {/* Search / Select Student */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Selecione ou busque seu nome:
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Digite para filtrar seu nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Student Scrollable Selection Box */}
              <div className="mt-3 max-h-56 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50 p-1">
                {filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Nenhum aluno encontrado com esse nome.
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomMode(true);
                        setCustomName(searchTerm);
                      }}
                      className="block mx-auto mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Entrar com "{searchTerm}" como nome avulso
                    </button>
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudent?.id === student.id;

                    return (
                      <div
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {student.name.slice(0, 2)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm truncate">
                              {student.name}
                            </p>
                            <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                              PDG Cooperalfa
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Student Confirmation Display */}
            {selectedStudent && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in duration-200">
                {selectedStudent.photo ? (
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                    {selectedStudent.name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                    Aluno(a) Selecionado(a)
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    Clique abaixo para iniciar sua avaliação individual
                  </p>
                </div>
              </div>
            )}

            {/* If the current student already submitted on this device */}
            {existingSubmission && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-900">
                  <p className="font-bold">
                    Você já concluiu uma tentativa desta avaliação.
                  </p>
                  <p className="mt-0.5 text-amber-800">
                    Deseja refazer ou visualizar o seu gabarito comentado?
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStudent(selectedStudent);
                        setCurrentView('student-result');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-all"
                    >
                      Ver Meu Resultado
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions list */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Regras da Prova:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>15 estudos de caso práticos de balcão e lavoura.</li>
                <li>Você pode revisar e alterar suas respostas antes de finalizar.</li>
                <li>Ao término, o sistema calcula sua nota e apresenta o gabarito comentado.</li>
              </ul>
            </div>

            {/* Submit / Start Button */}
            <button
              type="submit"
              disabled={!selectedStudent && !customName.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-700/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
            >
              <span>{existingSubmission ? 'Refazer Avaliação' : 'Iniciar Prova Agora'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Cooperalfa © {new Date().getFullYear()} — Programa de Desenvolvimento Gerencial (PDG)
        </p>

      </div>
    </div>
  );
};
