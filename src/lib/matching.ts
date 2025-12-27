
'use server';

import { ai } from '@/ai/genkit';
import { embed, type Embedder } from 'genkit';
import type { Question } from '@/types';
import type { EmbeddedQuestion } from '@/context/AppContext';

// =================================================================
// SEMANTIC SEARCH USING AI EMBEDDINGS
// =================================================================

const EMBEDDING_MODEL = 'googleai/text-embedding-004';

// Caching for embeddings to avoid re-calling the AI model for the same text
const embeddingCache = new Map<string, number[]>();

/**
 * Generates a vector embedding for a given text using an AI model.
 * @param text The text to embed.
 * @returns A promise that resolves to a numerical vector (embedding).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  try {
    const embedder: Embedder = ai.embedder(EMBEDDING_MODEL);
    const { embedding } = await embed({
      embedder,
      content: text,
    });
    embeddingCache.set(text, embedding);
    return embedding;
  } catch (error) {
    console.error(`Error generating embedding for text: "${text}"`, error);
    throw new Error('Failed to generate embedding.');
  }
}

/**
 * Calculates the cosine similarity between two vectors.
 * This measures how similar their "meaning" or "direction" is.
 * @param vecA The first vector.
 * @param vecB The second vector.
 * @returns A similarity score between -1 and 1 (1 means identical).
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
      return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Finds the best matching question from the database using semantic search.
 * @param userQuery The user's question.
 * @param allQuestions An array of all questions from the database.
 * @param questionEmbeddings An array of pre-computed embeddings for each question.
 * @returns The best matching question and its similarity score, or null if no good match is found.
 */
export async function findBestMatch(
  userQuery: string,
  allQuestions: Question[],
  questionEmbeddings: EmbeddedQuestion[]
): Promise<{ question: Question; similarity: number } | null> {
  if (!userQuery || questionEmbeddings.length === 0) {
    return null;
  }

  // Generate an embedding for the user's query
  const queryEmbedding = await generateEmbedding(userQuery);

  let bestMatch: { question: Question; similarity: number } | null = null;

  // Compare the user's query embedding with all pre-computed question embeddings
  for (const embeddedQuestion of questionEmbeddings) {
    const similarity = cosineSimilarity(queryEmbedding, embeddedQuestion.embedding);
    
    // If this match is better than the previous best one, update it
    if (!bestMatch || similarity > bestMatch.similarity) {
      bestMatch = {
        question: embeddedQuestion.question,
        similarity: similarity,
      };
    }
  }

  // Define a threshold for what is considered a "good" match.
  // Cosine similarity scores are typically high, so 0.75 is a reasonable starting point.
  const SIMILARITY_THRESHOLD = 0.75;

  if (bestMatch && bestMatch.similarity >= SIMILARITY_THRESHOLD) {
    return bestMatch;
  }

  return null;
}
