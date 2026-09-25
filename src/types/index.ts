export interface Student {
  id: string;
  name: string;
  photo: string | null;
}

export interface QuestionOption {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
}

export interface Question {
  id: number;
  title: string;
  topic: string;
  category: 'Ecossistema Cooperativo' | 'Método de Harvard' | 'Comunicação Assertiva' | 'Estilos de Negociadores' | 'Gestão de Conflitos e Inadimplência' | 'Gestão da Informação e Liderança';
  statement: string;
  options: QuestionOption[];
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

export interface StudentAnswer {
  questionId: number;
  selectedOption: 'a' | 'b' | 'c' | 'd' | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface ExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string | null;
  startedAt: string;
  completedAt: string;
  answers: Record<number, 'a' | 'b' | 'c' | 'd'>;
  score: number; // 0 to 15
  percentage: number; // 0 to 100
  grade: number; // 0 to 10
  timeSpentSeconds: number;
  teacherFeedback?: string;
  status: 'concluido' | 'em_andamento' | 'pendente';
}

export interface CompetencySummary {
  category: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
}
