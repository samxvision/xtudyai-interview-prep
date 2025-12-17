import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

export const fetchQuestions = async (): Promise<Question[]> => {
  const { firestore } = initializeFirebase();
  const questionsCollection = collection(firestore, 'questions');
  
  try {
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(questionsCollection);
    
    if (snapshot.empty) {
      console.log('No questions found in Firestore. Returning empty array.');
      return [];
    }

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Question, 'id'>
    }));
    
    return questions;
  } catch (error) {
    console.error("Error fetching questions from Firestore:", error);
    // In case of an error, return an empty array to prevent app crash
    return [];
  }
};
