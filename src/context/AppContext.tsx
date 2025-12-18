
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface AppContextType {
  questions: Question[];
  areQuestionsLoading: boolean;
  getQuestionById: (id: string) => Question | undefined;
  addLearnedQuestion: (question: Question) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const { firestore } = initializeFirebase();
    const questionsCollection = collection(firestore, 'questions');
    
    const unsubscribe = onSnapshot(
      questionsCollection, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          console.log('No questions found in Firestore. Listening for updates.');
          setQuestions([]);
        } else {
          const fetchedQuestions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Question, 'id'>
          }));
          setQuestions(fetchedQuestions);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching questions from Firestore:", error);
        setQuestions([]);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getQuestionById = useCallback(
    (id: string) => {
      return questions.find(q => q.id === id);
    },
    [questions]
  );
  
  const addLearnedQuestion = useCallback((question: Question) => {
    // This is now handled by the real-time listener, but we can keep it
    // for optimistic updates if needed, though it might cause race conditions.
    // For now, we'll let the listener handle state updates.
    if (!questions.some(q => q.id === question.id)) {
        // Optimistically add to local state to make it searchable immediately
        setQuestions(prevQuestions => [...prevQuestions, question]);
    }
  }, [questions]);


  const value = {
    questions,
    areQuestionsLoading,
    getQuestionById,
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
