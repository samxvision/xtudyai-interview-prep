
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { generateEmbedding } from '@/lib/matching';

// An embedded question includes the original question data plus its vector embedding
export type EmbeddedQuestion = {
  question: Question;
  embedding: number[];
};

interface AppContextType {
  questions: Question[];
  questionEmbeddings: EmbeddedQuestion[];
  areQuestionsLoading: boolean;
  getQuestionById: (id: string) => Question | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionEmbeddings, setQuestionEmbeddings] = useState<EmbeddedQuestion[]>([]);
  const [areQuestionsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { firestore } = initializeFirebase();
    const questionsCollection = collection(firestore, 'questions');

    const unsubscribe = onSnapshot(questionsCollection, async (snapshot: QuerySnapshot<DocumentData>) => {
      setIsLoading(true);
      const newQuestions: Question[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Question, 'id'>
      }));
      setQuestions(newQuestions);

      console.log(`Generating embeddings for ${newQuestions.length} questions...`);
      try {
        const embeddings: EmbeddedQuestion[] = [];
        for (const q of newQuestions) {
          // We generate an embedding based on both English and Hindi questions for better semantic matching
          const textToEmbed = `${q.question_en}\n${q.question_hi}`;
          const embedding = await generateEmbedding(textToEmbed);
          embeddings.push({ question: q, embedding });
        }
        setQuestionEmbeddings(embeddings);
        console.log("Embeddings generated successfully.");
      } catch (error) {
        console.error("Error generating embeddings:", error);
        // Handle embedding generation failure if necessary
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error with real-time question listener:", error);
      setQuestions([]);
      setQuestionEmbeddings([]);
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
    questionEmbeddings,
    areQuestionsLoading,
    getQuestionById,
    // Deprecated, listener handles this
    addLearnedQuestion: () => {}, 
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
