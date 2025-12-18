
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, getDocs, QuerySnapshot, DocumentData, onSnapshot } from 'firebase/firestore';

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
    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const { firestore } = initializeFirebase();
            const questionsCollection = collection(firestore, 'questions');
            const snapshot = await getDocs(questionsCollection);
            
            if (snapshot.empty) {
                console.log('No questions found in Firestore. Setting up a listener for future additions.');
                setQuestions([]);
            } else {
                const fetchedQuestions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as Omit<Question, 'id'>
                }));
                setQuestions(fetchedQuestions);
            }
        } catch (error) {
            console.error("Error fetching initial questions from Firestore:", error);
            setQuestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    fetchQuestions();

    // Set up a real-time listener to catch questions added *after* the initial load.
    const { firestore } = initializeFirebase();
    const questionsCollection = collection(firestore, 'questions');
    const unsubscribe = onSnapshot(questionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
        const newQuestions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Question, 'id'>
          }));
        // This keeps the local state in sync with the database without a full refetch
        setQuestions(newQuestions);
    }, (error) => {
        console.error("Error with real-time question listener:", error);
    });

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
