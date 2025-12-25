
import type { Question } from '@/types';

// =================================================================
// Levenshtein Distance for Fuzzy String Matching
// =================================================================

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

function calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 100.0;
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length * 100;
}

// =================================================================
// LAYER 1: AGGRESSIVE EXPRESSION REMOVAL
// =================================================================

const IGNORE_PATTERNS = {
    expressions: [
      "tum batao", "aap bataiye", "kripya bataiye",
      "mujhe batao", "hamko batao", "please tell",
      "can you tell", "could you explain",
      "i want to know", "mujhe janna hai",
      "help me", "guide me", "now tell me", "accha tum ab batao ki"
    ],
    fillers: [
      "ki", "ye", "wo", "yaar", "bhai",
      "accha", "ok", "thik hai", "dekho", "suno",
      "actually", "basically", "you know", "it's fine"
    ],
};
  
function aggressiveClean(text: string): string {
    let cleaned = text.toLowerCase().trim();
    for (const expr of IGNORE_PATTERNS.expressions) {
      cleaned = cleaned.replace(new RegExp(`\\b${expr}\\b`, 'gi'), ' ');
    }
    for (const filler of IGNORE_PATTERNS.fillers) {
      cleaned = cleaned.replace(new RegExp(`\\b${filler}\\b`, 'gi'), ' ');
    }
    cleaned = cleaned.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    return cleaned;
}

// Keywords that are variations of intent, not subject matter.
const SUPPORTIVE_KEYWORDS = new Set([
  'kya', 'hota', 'hai', 'what', 'is', 'explain', 'explanation', 
  'introduction', 'about', 'meaning', 'matlab', 'define', 'concept',
  'kaise', 'how', 'procedure', 'steps', 'working', 'principle',
  'difference', 'vs', 'compare', 'farak', 'types', 'prakar', 'kinds',
  'check', 'inspect', 'repair', 'fix', 'identify', 'detect', 'problem'
]);

// =================================================================
// HYBRID SEARCH FUNCTION
// =================================================================

export function findExactMatch(userQuery: string, candidateQuestions: Question[]) {
  const cleanedUserQuery = aggressiveClean(userQuery);

  // === STAGE 1: Direct Question Matching ===
  const directMatches = [];
  for (const question of candidateQuestions) {
    const normalizedEn = normalizeText(question.question_en);
    const normalizedHi = normalizeText(question.question_hi);
    const scoreEn = calculateSimilarity(cleanedUserQuery, normalizedEn);
    const scoreHi = calculateSimilarity(cleanedUserQuery, normalizedHi);
    const finalScore = Math.max(scoreEn, scoreHi);

    if (finalScore >= 85) {
      directMatches.push({
        type: 'question' as const,
        document: question,
        score: finalScore,
        intent: ['direct_match'], 
      });
    }
  }

  if (directMatches.length > 0) {
    directMatches.sort((a, b) => b.score - a.score);
    return directMatches;
  }

  // === STAGE 2: Advanced Keyword Fallback Matching ===
  const userKeywords = new Set(cleanedUserQuery.split(' ').filter(word => word.length > 1));
  const keywordMatches = [];

  for (const question of candidateQuestions) {
    const dbKeywords = new Set([
      ...question.keywords_en,
      ...question.keywords_hi
    ].map(k => k.toLowerCase()));

    // 1. All user keywords must be present in DB keywords
    let allUserKeywordsFound = true;
    for (const uKey of userKeywords) {
      if (!dbKeywords.has(uKey)) {
        allUserKeywordsFound = false;
        break;
      }
    }
    if (!allUserKeywordsFound) continue;

    // 2. Check extra keywords in the database
    const extraDbKeywords = new Set([...dbKeywords].filter(dbKey => !userKeywords.has(dbKey)));
    
    let hasExtraSubjectKeyword = false;
    for(const extraKey of extraDbKeywords) {
      // If the extra keyword is NOT a supportive word, it's a subject-changing keyword.
      if (!SUPPORTIVE_KEYWORDS.has(extraKey)) {
        hasExtraSubjectKeyword = true;
        break;
      }
    }
    
    // 3. If there's an extra subject keyword, it's not a match.
    if (hasExtraSubjectKeyword) continue;

    // If we passed all checks, it's a valid keyword match.
    // Score based on how many user keywords were found.
    const score = (userKeywords.size / userKeywords.size) * 100; // Will be 100 if it passes
    keywordMatches.push({
      type: 'question' as const,
      document: question,
      score: score,
      intent: ['keyword_match'],
    });
  }

  keywordMatches.sort((a, b) => b.score - a.score);
  return keywordMatches;
}

// =================================================================
// HELPER FUNCTIONS
// =================================================================

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ') 
    .trim();
};
