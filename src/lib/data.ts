import type { Question } from '@/types';
import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, getDocs, query, where, QuerySnapshot, DocumentData, limit } from 'firebase/firestore';
import { extractEntities } from './matching';

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
 * Pre-filters questions from Firestore based on entities extracted from the user query.
 * This significantly reduces the number of documents the client-side semantic search needs to process.
 * @param userQuery The raw user query string.
 * @returns A promise that resolves to an array of candidate questions.
 */
export async function getCandidateQuestions(userQuery: string): Promise<Question[]> {
  // Step 1: Extract entities from the user query to use as keywords.
  const { entities } = extractEntities(userQuery);

  if (entities.length === 0) {
    // If no specific entities are found, it's better to return an empty list
    // than to fetch the entire database. The search can then fallback to AI mode if needed.
    console.log("No specific entities found, returning no candidates to avoid full scan.");
    return [];
  }

  // Step 2: Use the extracted entities to query Firestore.
  // We use 'array-contains-any' which is efficient for this kind of matching.
  // We search in both English and Hindi keywords for broader matching.
  // Firestore limits 'array-contains-any' to 30 values, so we take the top 15 for each language.
  const { firestore } = initializeFirebase();
  const questionsRef = collection(firestore, 'questions');
  
  const enKeywords = entities.slice(0, 15);
  const hiKeywords = entities.slice(0, 15); // Assuming entities can be in either language

  // Create two separate queries and then merge the results.
  const queryEn = query(questionsRef, where('keywords_en', 'array-contains-any', enKeywords), limit(20));
  const queryHi = query(questionsRef, where('keywords_hi', 'array-contains-any', hiKeywords), limit(20));

  try {
    const [snapshotEn, snapshotHi] = await Promise.all([getDocs(queryEn), getDocs(queryHi)]);
    
    const candidateMap = new Map<string, Question>();

    snapshotEn.forEach(doc => {
      if (!candidateMap.has(doc.id)) {
        candidateMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
      }
    });

    snapshotHi.forEach(doc => {
      if (!candidateMap.has(doc.id)) {
        candidateMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
      }
    });

    const candidates = Array.from(candidateMap.values());
    console.log(`Found ${candidates.length} candidate questions for semantic search.`);
    return candidates;

  } catch (error) {
    console.error("Error fetching candidate questions from Firestore:", error);
    return []; // Return empty on error.
  }
}
