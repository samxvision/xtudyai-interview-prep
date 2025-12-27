
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface AppContextType {
  questions: Question[];
  areQuestionsLoading: boolean;
  getQuestionById: (id: string) => Question | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { firestore } = initializeFirebase();
    const questionsCollection = collection(firestore, 'questions');

    const unsubscribe = onSnapshot(questionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const newQuestions: Question[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Question, 'id'>
      }));
      setQuestions(newQuestions);
      setIsLoading(false);
    }, (error) => {
      console.error("Error with real-time question listener:", error);
      setQuestions([]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getQuestionById = useCallback(
    (id: string) => {
      return questions.find(q => q.id === id);
    },
    [questions]
  );
  
  const value = {
    questions,
    areQuestionsLoading,
    getQuestionById,
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
