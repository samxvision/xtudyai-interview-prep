// =================================================================
// 5-LAYER NATURAL LANGUAGE QUESTION MATCHING SYSTEM
// =================================================================

import type { Question } from '@/types';
import { AcronymData, OilGasAcronyms } from './acronyms';

// =================================================================
// LAYER 1: AGGRESSIVE EXPRESSION REMOVAL
// =================================================================

const IGNORE_PATTERNS = [
  // Polite phrases & greetings
  'please', 'de', 'give', 'do', 'a', 'the', 'is', 'in', 'of', 'for', 'on', 'at', 'to', 'by', 'with', 'from', 'as',
  'tell me', 'can you', 'could you', 'would you', 'do you know',
  'explain', 'describe', 'define', 'what is', 'what are', 'what\'s', 'whats',
  'meaning of', 'introduction to', 'about', 'regarding', 'concerning',
  
  // Hindi/Hinglish polite phrases & fillers
  'batao', 'bataiye', 'samjhao', 'kya', 'kaise', 'kyun', 'kab', 'kahan',
  'matlab', 'hota hai', 'hoti hai', 'hote hain', 'ke baare mein',
  'zara', 'accha', 'yaar', 'bhai', 'sir', 'madam',
  
  // Conversational fillers
  'well', 'so', 'like', 'you know', 'basically', 'actually', 'i mean',
  'okay', 'ok', 'right', 'fine', 'aur', 'and',
  
  // Question marks and other punctuation
  /\?+/g, /!+/g, /\.+/g, /,+/g, /"+/g, /'+/g,
];

/**
 * Aggressively removes common conversational and polite words from a query.
 * @param query The user's input string.
 * @returns A cleaned, more direct version of the query.
 */
function aggressiveClean(query: string): string {
  let cleanedQuery = query.toLowerCase();
  for (const pattern of IGNORE_PATTERNS) {
    if (typeof pattern === 'string') {
      // Creates a regex to match the whole word
      cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${pattern}\\b`, 'gi'), '');
    } else {
      // If it's already a regex
      cleanedQuery = cleanedQuery.replace(pattern, '');
    }
  }
  // Remove multiple spaces left after replacement
  return cleanedQuery.replace(/\s+/g, ' ').trim();
}

// =================================================================
// LAYER 2 & 3: ENTITY EXTRACTION & KEYWORD GENERATION
// =================================================================

// Keywords that are important but often removed by cleaning.
// We protect these to ensure they are part of the matching process.
const PROTECTED_KEYWORDS = new Set(['wps', 'pqr', 'wqt', 'ndt', 'rt', 'ut', 'mt', 'pt']);

const SUPPORT_WORDS = new Set([
    'explain', 'description', 'introduction', 'tell', 'about', 'meaning',
    'kya', 'hai', 'hota', 'matlab', 'kaise'
]);

/**
 * Extracts key technical terms (entities) and leftover keywords from a query.
 * @param query The user's input string.
 * @returns An object containing entities and remaining keywords.
 */
function extractEntities(query: string): { entities: string[], keywords: string[] } {
  const lowerQuery = query.toLowerCase();
  const entities = new Set<string>();
  let remainingQuery = ` ${lowerQuery} `;

  // 1. Prioritize Acronyms and Technical Terms from our database
  for (const acronym of Object.keys(OilGasAcronyms)) {
    const lowerAcronym = acronym.toLowerCase();
    if (remainingQuery.includes(` ${lowerAcronym} `)) {
      entities.add(lowerAcronym);
      remainingQuery = remainingQuery.replace(` ${lowerAcronym} `, ' ');
    }
  }

  // 2. Add protected keywords if they exist
  for (const keyword of PROTECTED_KEYWORDS) {
    if (lowerQuery.includes(` ${keyword} `)) {
      entities.add(keyword);
    }
  }
  
  // 3. The rest are considered general keywords after cleaning
  const cleanedForKeywords = aggressiveClean(remainingQuery);
  const keywords = cleanedForKeywords.split(' ').filter(word => word.length > 1 && !entities.has(word));

  return {
    entities: Array.from(entities),
    keywords: keywords
  };
}

// =================================================================
// LAYER 4 & 5: HYBRID MATCHING LOGIC
// =================================================================

/**
 * First, attempts a direct, high-confidence match on the question text.
 * If that fails, it falls back to a more flexible keyword-based search.
 * @param userQuery The original query from the user.
 * @param candidateQuestions The list of all questions to search through.
 * @returns The best matching question or null if no satisfactory match is found.
 */
export function findExactMatch(
  userQuery: string,
  candidateQuestions: Question[]
): Question | null {
  if (!userQuery || candidateQuestions.length === 0) {
    return null;
  }

  const cleanedUserQuery = aggressiveClean(userQuery);

  // --- STAGE 1: Direct String Similarity Match ---
  const SIMILARITY_THRESHOLD = 0.85; // 85% match required

  for (const question of candidateQuestions) {
    const cleanedDbQuestionEn = aggressiveClean(question.question_en);
    const cleanedDbQuestionHi = aggressiveClean(question.question_hi);

    const similarityEn = calculateNormalizedSimilarity(cleanedUserQuery, cleanedDbQuestionEn);
    const similarityHi = calculateNormalizedSimilarity(cleanedUserQuery, cleanedDbQuestionHi);

    if (similarityEn >= SIMILARITY_THRESHOLD || similarityHi >= SIMILARITY_THRESHOLD) {
      return question; // High confidence match found, return immediately.
    }
  }

  // --- STAGE 2: Advanced Keyword Fallback Match ---
  const { entities: queryEntities, keywords: queryKeywords } = extractEntities(userQuery);
  const allQueryKeywords = new Set([...queryEntities, ...queryKeywords]);

  if (allQueryKeywords.size === 0) {
    return null; // No keywords to match against.
  }
  
  let bestMatch: { question: Question, score: number } | null = null;

  for (const question of candidateQuestions) {
    if (!question.keywords_en || !question.keywords_hi) continue;

    const dbKeywords = new Set([
      ...(Array.isArray(question.keywords_en) ? question.keywords_en : []),
      ...(Array.isArray(question.keywords_hi) ? question.keywords_hi : [])
    ].map(k => k.toLowerCase()));
    
    // Condition 1: All user keywords must be present in the DB keywords
    let allKeywordsFound = true;
    for (const userKeyword of allQueryKeywords) {
      if (!dbKeywords.has(userKeyword)) {
        allKeywordsFound = false;
        break;
      }
    }

    if (!allKeywordsFound) {
      continue; // Skip this question if not all user keywords are present
    }

    // Condition 2: Check "extra" keywords in the database
    const extraDbKeywords = [...dbKeywords].filter(k => !allQueryKeywords.has(k));
    
    const hasSubjectChangingKeyword = extraDbKeywords.some(extraKeyword => 
        // A keyword is "subject-changing" if it's not a generic support word
        !SUPPORT_WORDS.has(extraKeyword)
    );
    
    if (hasSubjectChangingKeyword) {
      continue; // This question has extra topics, so it's not a good match.
    }

    // If we reach here, it's a potential match.
    // We score it based on how few "extra" non-subject-changing keywords there are.
    // A lower number of extra support words is a better match.
    const score = 1 / (1 + extraDbKeywords.length);

    if (!bestMatch || score > bestMatch.score) {
        bestMatch = { question, score };
    }
  }

  return bestMatch ? bestMatch.question : null;
}


// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Calculates a similarity score between two strings based on common words.
 * @param str1 The first string.
 * @param str2 The second string.
 * @returns A score from 0 to 1.
 */
function calculateNormalizedSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));
  
  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter(word => words2.has(word)));
  
  // Jaccard similarity
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}
