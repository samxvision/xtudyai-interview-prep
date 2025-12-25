
import type { Question } from '@/types';

// =================================================================
// Levenshtein Distance for Fuzzy String Matching
// =================================================================

/**
 * Calculates the Levenshtein distance between two strings.
 * This measures the number of edits (insertions, deletions, substitutions)
 * needed to change one string into the other.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The Levenshtein distance.
 */
function levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            matrix[i][j] = s1[i - 1] === s2[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
        }
    }
    return matrix[len1][len2];
}

/**
 * Calculates a similarity score between two strings based on Levenshtein distance.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns A similarity score between 0 and 100.
 */
function calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) {
        return 100.0;
    }

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length * 100;
}


// =================================================================
// DIRECT QUESTION-TO-QUESTION MATCHING
// =================================================================

export function findExactMatch(userQuery: string, candidateQuestions: Question[]) {
  const normalizedUserQuery = normalizeText(userQuery);
  const matches = [];

  for (const question of candidateQuestions) {
    // Normalize database questions for comparison
    const normalizedEn = normalizeText(question.question_en);
    const normalizedHi = normalizeText(question.question_hi);

    // Calculate similarity score with both English and Hinglish questions
    const scoreEn = calculateSimilarity(normalizedUserQuery, normalizedEn);
    const scoreHi = calculateSimilarity(normalizedUserQuery, normalizedHi);

    // Take the higher of the two scores
    const finalScore = Math.max(scoreEn, scoreHi);

    // If the score meets the 90% threshold, add it to the results
    if (finalScore >= 90) {
      matches.push({
        type: 'question' as const,
        document: question,
        score: finalScore,
        intent: [], // This can be deprecated or used differently
      });
    }
  }

  // Sort by score to get the best match first
  matches.sort((a, b) => b.score - a.score);

  return matches;
}


// =================================================================
// HELPER FUNCTIONS
// =================================================================

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // Remove punctuation but keep alphanumeric and space
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}
