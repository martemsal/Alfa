import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExamSubmission, Question, Student } from '../types';
import { QUESTIONS, STUDENTS_LIST, DEFAULT_FEEDBACK_TEMPLATES } from '../data/examData';

export type AppView = 
  | 'student-login' 
  | 'student-test' 
  | 'student-result' 
  | 'teacher-dashboard' 
  | 'teacher-report';

interface ExamContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  activeAnswers: Record<number, 'a' | 'b' | 'c' | 'd'>;
  flaggedQuestions: number[];
  currentQuestionIndex: number;
  testStartTime: number | null;
  submissions: Record<string, ExamSubmission>;
  lastSubmission: ExamSubmission | null;
  teacherFeedbacks: Record<string, string>;
  
  // Teacher Authentication
  isTeacherAuthenticated: boolean;
  loginTeacher: (password: string) => boolean;
  logoutTeacher: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Student actions
  startTest: (student: { id?: string; name: string; photo?: string | null }) => void;
  selectAnswer: (questionId: number, option: 'a' | 'b' | 'c' | 'd') => void;
  toggleFlagQuestion: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  submitExam: () => ExamSubmission;
  retakeExam: () => void;
  
  // Teacher actions
  updateTeacherFeedback: (studentKey: string, feedback: string) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  deleteSubmission: (studentKey: string) => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Student roster management
  students: Student[];
  excludedStudents: Student[];
  excludeStudent: (studentName: string) => void;
  restoreStudent: (studentName: string) => void;
  restoreOfficialData: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

import { OFFICIAL_REAL_SUBMISSIONS } from '../data/officialSubmissions';

const STORAGE_KEY_SUBMISSIONS = 'cooperalfa_pdg_submissions_v5';
const STORAGE_KEY_FEEDBACKS = 'cooperalfa_pdg_feedbacks_v5';
const STORAGE_KEY_AUTH = 'cooperalfa_teacher_auth_v5';
const STORAGE_KEY_EXCLUDED = 'cooperalfa_pdg_excluded_students_v5';

// Master Password for Professor Marcelo Saldanha
const TEACHER_MASTER_PASSWORDS = ['alfa2026', 'cooperalfa', 'profmarcelo', 'pdg2026', '123456'];

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('student-login');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeAnswers, setActiveAnswers] = useState<Record<number, 'a' | 'b' | 'c' | 'd'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [lastSubmission, setLastSubmission] = useState<ExamSubmission | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Start with official real submissions consolidated from PDFs
  const [submissions, setSubmissions] = useState<Record<string, ExamSubmission>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      const parsed = saved ? JSON.parse(saved) : {};
      return { ...OFFICIAL_REAL_SUBMISSIONS, ...parsed };
    } catch {
      return OFFICIAL_REAL_SUBMISSIONS;
    }
  });

  const [teacherFeedbacks, setTeacherFeedbacks] = useState<Record<string, string>>(() => {
    const initialFeedbacks: Record<string, string> = {};
    Object.values(OFFICIAL_REAL_SUBMISSIONS).forEach(sub => {
      if (sub.teacherFeedback) {
        initialFeedbacks[sub.studentName] = sub.teacherFeedback;
      }
    });
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
      const parsed = saved ? JSON.parse(saved) : {};
      return { ...initialFeedbacks, ...parsed };
    } catch {
      return initialFeedbacks;
    }
  });

  // Track students who no longer attend the course / dropped out
  const [excludedNames, setExcludedNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXCLUDED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Derived student lists
  const students = STUDENTS_LIST.filter(s => !excludedNames.includes(s.name));
  const excludedStudents = STUDENTS_LIST.filter(s => excludedNames.includes(s.name));

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed to save submissions', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(teacherFeedbacks));
    } catch (e) {
      console.error('Failed to save feedbacks', e);
    }
  }, [teacherFeedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXCLUDED, JSON.stringify(excludedNames));
    } catch (e) {
      console.error('Failed to save excluded students', e);
    }
  }, [excludedNames]);

  // Sync across tabs via BroadcastChannel if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cooperalfa_exam_channel_v2');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_SUBMISSIONS') {
          setSubmissions(event.data.payload);
        } else if (event.data?.type === 'SYNC_EXCLUDED') {
          setExcludedNames(event.data.payload);
        } else if (event.data?.type === 'SYNC_FEEDBACKS') {
          setTeacherFeedbacks(event.data.payload);
        }
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  const broadcastSync = (newSubmissions: Record<string, ExamSubmission>) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('cooperalfa_exam_channel_v2');
        channel.postMessage({ type: 'SYNC_SUBMISSIONS', payload: newSubmissions });
        channel.close();
      } catch (e) {
        console.error('Broadcast error:', e);
      }
    }
  };

  const loginTeacher = (password: string): boolean => {
    const cleanPass = password.trim().toLowerCase();
    if (TEACHER_MASTER_PASSWORDS.includes(cleanPass)) {
      setIsTeacherAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {}
      setIsAuthModalOpen(false);
      setCurrentView('teacher-dashboard');
      return true;
    }
    return false;
  };

  const logoutTeacher = () => {
    setIsTeacherAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
    setCurrentView('student-login');
  };

  const startTest = (student: { id?: string; name: string; photo?: string | null }) => {
    const existing = STUDENTS_LIST.find(
      s => s.name.toLowerCase().trim() === student.name.toLowerCase().trim()
    );
    const finalStudent: Student = {
      id: student.id || existing?.id || `std_custom_${Date.now()}`,
      name: student.name.trim().toUpperCase(),
      photo: student.photo || existing?.photo || null
    };

    setCurrentStudent(finalStudent);
    setActiveAnswers({});
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
    setTestStartTime(Date.now());
    setCurrentView('student-test');
  };

  const selectAnswer = (questionId: number, option: 'a' | 'b' | 'c' | 'd') => {
    setActiveAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < QUESTIONS.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const submitExam = (): ExamSubmission => {
    if (!currentStudent) {
      throw new Error('No student active');
    }

    const now = Date.now();
    const timeSpentSeconds = testStartTime ? Math.max(10, Math.round((now - testStartTime) / 1000)) : 120;

    let correctCount = 0;
    QUESTIONS.forEach(q => {
      if (activeAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = QUESTIONS.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const grade = Number(((correctCount / totalQuestions) * 10).toFixed(1));

    const existingFeedback = teacherFeedbacks[currentStudent.name] || 
      (grade >= 8.5 
        ? DEFAULT_FEEDBACK_TEMPLATES.high 
        : grade >= 7.0 
        ? DEFAULT_FEEDBACK_TEMPLATES.medium 
        : DEFAULT_FEEDBACK_TEMPLATES.needsImprovement);

    const submission: ExamSubmission = {
      id: `sub_${currentStudent.id}_${now}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentPhoto: currentStudent.photo,
      startedAt: testStartTime ? new Date(testStartTime).toISOString() : new Date(now - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date(now).toISOString(),
      answers: activeAnswers,
      score: correctCount,
      percentage,
      grade,
      timeSpentSeconds,
      teacherFeedback: existingFeedback,
      status: 'concluido'
    };

    setSubmissions(prev => {
      const updated = {
        ...prev,
        [currentStudent.name]: submission
      };
      broadcastSync(updated);
      return updated;
    });

    setLastSubmission(submission);
    setCurrentView('student-result');
    return submission;
  };

  const retakeExam = () => {
    setActiveAnswers({});
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
    setTestStartTime(Date.now());
    setCurrentView('student-test');
  };

  const updateTeacherFeedback = (studentKey: string, feedback: string) => {
    setTeacherFeedbacks(prev => ({
      ...prev,
      [studentKey]: feedback
    }));

    setSubmissions(prev => {
      if (prev[studentKey]) {
        const updated = {
          ...prev,
          [studentKey]: {
            ...prev[studentKey],
            teacherFeedback: feedback
          }
        };
        broadcastSync(updated);
        return updated;
      }
      return prev;
    });
  };

  const deleteSubmission = (studentKey: string) => {
    setSubmissions(prev => {
      const updated = { ...prev };
      delete updated[studentKey];
      broadcastSync(updated);
      return updated;
    });
  };

  const excludeStudent = (studentName: string) => {
    setExcludedNames(prev => {
      const updated = prev.includes(studentName) ? prev : [...prev, studentName];
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('cooperalfa_exam_channel_v2');
          channel.postMessage({ type: 'SYNC_EXCLUDED', payload: updated });
          channel.close();
        } catch {}
      }
      return updated;
    });

    setSubmissions(prev => {
      const updated = { ...prev };
      delete updated[studentName];
      broadcastSync(updated);
      return updated;
    });
  };

  const restoreStudent = (studentName: string) => {
    setExcludedNames(prev => {
      const updated = prev.filter(name => name !== studentName);
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('cooperalfa_exam_channel_v2');
          channel.postMessage({ type: 'SYNC_EXCLUDED', payload: updated });
          channel.close();
        } catch {}
      }
      return updated;
    });

    if (OFFICIAL_REAL_SUBMISSIONS[studentName]) {
      setSubmissions(prev => {
        const updated = {
          ...prev,
          [studentName]: OFFICIAL_REAL_SUBMISSIONS[studentName]
        };
        broadcastSync(updated);
        return updated;
      });
    }
  };

  const restoreOfficialData = () => {
    setSubmissions(OFFICIAL_REAL_SUBMISSIONS);
    const initialFeedbacks: Record<string, string> = {};
    Object.values(OFFICIAL_REAL_SUBMISSIONS).forEach(sub => {
      if (sub.teacherFeedback) {
        initialFeedbacks[sub.studentName] = sub.teacherFeedback;
      }
    });
    setTeacherFeedbacks(initialFeedbacks);
    setExcludedNames([]);
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(OFFICIAL_REAL_SUBMISSIONS));
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(initialFeedbacks));
      localStorage.setItem(STORAGE_KEY_EXCLUDED, JSON.stringify([]));
    } catch {}
    broadcastSync(OFFICIAL_REAL_SUBMISSIONS);
  };

  // Demo generator only available inside the protected Teacher dashboard
  const loadDemoData = () => {
    const demoSubmissions: Record<string, ExamSubmission> = {};
    const demoFeedbacks: Record<string, string> = {};

    const scorePresets = [
      15, 14, 14, 13, 15, 12, 11, 14, 13, 10, 15, 14, 12, 13, 14, 11, 13, 15, 14, 12, 13, 14, 12, 14, 15
    ];

    STUDENTS_LIST.forEach((student, index) => {
      const targetScore = scorePresets[index % scorePresets.length];
      const answers: Record<number, 'a' | 'b' | 'c' | 'd'> = {};

      const incorrectOptions: Record<number, ('a' | 'b' | 'c' | 'd')[]> = {
        1: ['a', 'c', 'd'],
        2: ['a', 'c', 'd'],
        3: ['a', 'b', 'd'],
        4: ['a', 'c', 'd'],
        5: ['a', 'c', 'd'],
        6: ['a', 'c', 'd'],
        7: ['a', 'c', 'd'],
        8: ['a', 'b', 'd'],
        9: ['a', 'b', 'd'],
        10: ['a', 'c', 'd'],
        11: ['b', 'c', 'd'],
        12: ['a', 'c', 'd'],
        13: ['a', 'c', 'd'],
        14: ['a', 'c', 'd'],
        15: ['a', 'c', 'd']
      };

      const wrongCount = 15 - targetScore;
      const wrongQuestionIds = new Set<number>();
      while (wrongQuestionIds.size < wrongCount) {
        const pick = [4, 9, 13, 2, 7, 10, 14][wrongQuestionIds.size % 7] || Math.floor(Math.random() * 15) + 1;
        wrongQuestionIds.add(pick);
      }

      QUESTIONS.forEach(q => {
        if (wrongQuestionIds.has(q.id)) {
          const wrongs = incorrectOptions[q.id] || ['a', 'c'];
          answers[q.id] = wrongs[Math.floor(Math.random() * wrongs.length)];
        } else {
          answers[q.id] = q.correctAnswer;
        }
      });

      const grade = Number(((targetScore / 15) * 10).toFixed(1));
      const percentage = Math.round((targetScore / 15) * 100);
      const timeSpentSeconds = 600 + (index * 47) % 500;

      let feedback = "";
      if (grade >= 9.0) {
        feedback = `Excelente visão estratégica e liderança cooperativista. Demonstrou domínio total do Método de Harvard e das particularidades do associado Cooperalfa.`;
      } else if (grade >= 7.5) {
        feedback = `Bom desempenho e assertividade nas decisões de campo. Recomenda-se aprofundar na metodologia de opções de ganho mútuo e cálculo de MAANA.`;
      } else {
        feedback = `Apresentou bom engajamento, com pontos de atenção na diferenciação entre posições e interesses em situações de cobrança e inadimplência.`;
      }

      demoFeedbacks[student.name] = feedback;

      demoSubmissions[student.name] = {
        id: `demo_sub_${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentPhoto: student.photo,
        startedAt: new Date(Date.now() - 3600000 - index * 60000).toISOString(),
        completedAt: new Date(Date.now() - index * 60000).toISOString(),
        answers,
        score: targetScore,
        percentage,
        grade,
        timeSpentSeconds,
        teacherFeedback: feedback,
        status: 'concluido'
      };
    });

    setSubmissions(demoSubmissions);
    setTeacherFeedbacks(demoFeedbacks);
    broadcastSync(demoSubmissions);
  };

  const resetAllData = () => {
    setSubmissions({});
    setTeacherFeedbacks({});
    setExcludedNames([]);
    setActiveAnswers({});
    setFlaggedQuestions([]);
    setCurrentStudent(null);
    setLastSubmission(null);
    try {
      localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
      localStorage.removeItem(STORAGE_KEY_FEEDBACKS);
      localStorage.removeItem(STORAGE_KEY_EXCLUDED);
    } catch {}
    broadcastSync({});
  };

  const exportDataJSON = () => {
    return JSON.stringify({
      version: 3,
      exportedAt: new Date().toISOString(),
      submissions,
      teacherFeedbacks,
      excludedNames
    }, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.submissions) {
        setSubmissions(parsed.submissions);
      }
      if (parsed.teacherFeedbacks) {
        setTeacherFeedbacks(parsed.teacherFeedbacks);
      }
      if (parsed.excludedNames) {
        setExcludedNames(parsed.excludedNames);
      }
      broadcastSync(parsed.submissions || {});
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <ExamContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentStudent,
        setCurrentStudent,
        activeAnswers,
        flaggedQuestions,
        currentQuestionIndex,
        testStartTime,
        submissions,
        lastSubmission,
        teacherFeedbacks,
        isTeacherAuthenticated,
        loginTeacher,
        logoutTeacher,
        isAuthModalOpen,
        setIsAuthModalOpen,
        startTest,
        selectAnswer,
        toggleFlagQuestion,
        goToQuestion,
        submitExam,
        retakeExam,
        updateTeacherFeedback,
        loadDemoData,
        resetAllData,
        deleteSubmission,
        exportDataJSON,
        importDataJSON,
        students,
        excludedStudents,
        excludeStudent,
        restoreStudent,
        restoreOfficialData
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
