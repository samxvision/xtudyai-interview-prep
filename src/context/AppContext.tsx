
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Question } from '@/types';
import { fetchQuestions } from '@/lib/data';
import { findBestMatch as findBestMatchAlgorithm } from '@/lib/matching';

interface AppContextType {
  questions: Question[];
  isLoading: boolean;
  getQuestionById: (id: string) => Question | undefined;
  findBestMatch: (query: string) => { question: Question; score: number } | null;
  addLearnedQuestion: (question: Question) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    };
    loadQuestions();
  }, []);

  const getQuestionById = useCallback(
    (id: string) => {
      return questions.find(q => q.id === id);
    },
    [questions]
  );
  
  const addLearnedQuestion = useCallback((question: Question) => {
    // Avoid adding duplicates
    if (!questions.some(q => q.id === question.id)) {
      setQuestions(prevQuestions => [...prevQuestions, question]);
    }
  }, [questions]);

  const findBestMatch = (query: string) => {
    if (isLoading || questions.length === 0) return null;
    return findBestMatchAlgorithm(query, questions);
  };

  const value = {
    questions,
    isLoading,
    getQuestionById,
    findBestMatch,
    addLearnedQuestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

    