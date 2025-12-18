import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, getDocs, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';

/**
 * Fetches all questions from the Firestore 'questions' collection.
 * This is used for the initial data load.
 */
export const fetchAllQuestions = async (): Promise<Question[]> => {
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

/**
 * Searches Firestore for a question matching the normalized English or Hindi text.
 * @param normEn - Normalized English text.
 * @param normHi - Normalized Hindi text.
 * @returns The question data if found, otherwise null.
 */
export async function searchFirestore(normEn: string, normHi: string): Promise<Question | null> {
  const { firestore } = initializeFirebase();
  const ref = collection(firestore, 'questions');

  // Firestore's `in` query is limited to 30 items, which is fine here.
  // We query for either the English or Hindi normalized text matching.
  const q = query(
    ref,
    where('normalized_en', 'in', [normEn, normHi])
  );

  try {
    const snap = await getDocs(q);
    
    if (snap.empty) {
        // If no match on `normalized_en`, try `normalized_hi`
        const qHi = query(ref, where('normalized_hi', '==', normHi));
        const snapHi = await getDocs(qHi);
        if (snapHi.empty) {
            return null;
        }
        const doc = snapHi.docs[0];
        return { id: doc.id, ...doc.data() } as Question;
    }
    
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Question;
  } catch (error) {
    console.error("Error searching Firestore:", error);
    return null;
  }
}
