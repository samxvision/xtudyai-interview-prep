import type { Question } from '@/types';
import { detectLanguage } from './language';

// --- Helper Functions ---

/**
 * Normalizes text by converting to lowercase, removing punctuation, and trimming whitespace.
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[?!.,।]/g, '') // Remove common punctuation for both English and Hindi
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

/**
 * Calculates the Levenshtein distance between two strings.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
  if (s1.length > s2.length) {
    [s1, s2] = [s2, s1];
  }

  const distances = Array.from({ length: s1.length + 1 }, (_, i) => i);

  for (let j = 0; j < s2.length; j++) {
    let previousDiagonal = distances[0];
    distances[0]++;
    for (let i = 0; i < s1.length; i++) {
      const currentDiagonal = distances[i + 1];
      if (s1[i] === s2[j]) {
        distances[i + 1] = previousDiagonal;
      } else {
        distances[i + 1] = Math.min(previousDiagonal, distances[i], distances[i + 1]) + 1;
      }
      previousDiagonal = currentDiagonal;
    }
  }

  return distances[s1.length];
};

/**
 * Generates n-grams for a given string.
 */
const getNgrams = (str: string, n: number): Set<string> => {
  const ngrams = new Set<string>();
  if (str.length < n) return ngrams;
  for (let i = 0; i <= str.length - n; i++) {
    ngrams.add(str.substring(i, i + n));
  }
  return ngrams;
};

/**
 * Calculates Jaccard similarity between two sets of n-grams.
 */
const ngramSimilarity = (s1: string, s2: string, n: number = 2): number => {
  const ngrams1 = getNgrams(s1, n);
  const ngrams2 = getNgrams(s2, n);
  
  if (ngrams1.size === 0 && ngrams2.size === 0) return 1.0;
  if (ngrams1.size === 0 || ngrams2.size === 0) return 0.0;

  const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
  const union = new Set([...ngrams1, ...ngrams2]);
  
  return intersection.size / union.size;
};


// --- Scoring Layers ---

// Layer 1: Exact Normalized Match (Weight: 1000)
const calculateExactMatchScore = (normalizedQuery: string, normalizedQuestion: string): number => {
  return normalizedQuery === normalizedQuestion ? 1000 : 0;
};

// Layer 2: Keyword-based Scoring (Weight: 10 per keyword)
const calculateKeywordScore = (normalizedQuery: string, keywords: string[]): number => {
  if (!keywords || keywords.length === 0) return 0;
  const queryWords = normalizedQuery.split(' ').filter(word => word.length >= 3);
  let score = 0;
  
  for (const keyword of keywords) {
    for (const word of queryWords) {
      if (keyword.toLowerCase().includes(word)) {
        score += 10;
      }
    }
  }
  return score;
};

// Layer 3: Fuzzy Matching (Typo Tolerance) (Weight: 0-100)
const calculateFuzzyMatchScore = (normalizedQuery: string, normalizedQuestion: string): number => {
  const distance = levenshteinDistance(normalizedQuery, normalizedQuestion);
  const score = Math.max(0, 100 - distance * 5);
  return score;
};

// Layer 4: N-gram Similarity (Weight: 0-100)
const calculateNgramScore = (normalizedQuery: string, normalizedQuestion: string): number => {
  return ngramSimilarity(normalizedQuery, normalizedQuestion, 2) * 100;
};


// --- Main Matching Function ---

/**
 * The Multi-Layer Intelligent Question Matcher.
 * Calculates a total score based on 4 layers of matching techniques.
 */
export const findBestMatch = (
  userQuery: string,
  questions: Question[]
): { question: Question; score: number } | null => {
  if (!userQuery.trim()) return null;
  
  const queryLang = detectLanguage(userQuery);
  const normalizedQuery = normalizeText(userQuery);
  
  let bestMatch: { question: Question; score: number } | null = null;

  for (const question of questions) {
    const normalizedQuestion = queryLang === 'hi' ? question.normalized_hi : question.normalized_en;
    const keywords = queryLang === 'hi' ? question.keywords_hi : question.keywords_en;

    const exactMatchScore = calculateExactMatchScore(normalizedQuery, normalizedQuestion);
    
    // If we have an exact match, we can consider it the best possible result.
    if (exactMatchScore === 1000) {
        return { question, score: 1000 };
    }

    const keywordScore = calculateKeywordScore(normalizedQuery, keywords);
    const fuzzyScore = calculateFuzzyMatchScore(normalizedQuery, normalizedQuestion);
    const ngramScore = calculateNgramScore(normalizedQuery, normalizedQuestion);
    
    const totalScore = exactMatchScore + keywordScore + fuzzyScore + ngramScore;

    if (!bestMatch || totalScore > bestMatch.score) {
      bestMatch = { question, score: totalScore };
    }
  }

  if (bestMatch && bestMatch.score > 50) {
    return bestMatch;
  }

  return null;
};
