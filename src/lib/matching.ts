
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
// 5-LAYER SEARCH SYSTEM
// =================================================================

// LAYER 1: AGGRESSIVE EXPRESSION REMOVAL
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
    // Remove expressions and fillers
    for (const pattern of [...IGNORE_PATTERNS.expressions, ...IGNORE_PATTERNS.fillers]) {
      cleaned = cleaned.replace(new RegExp(`\\b${pattern}\\b`, 'gi'), ' ');
    }
    // Remove punctuation and extra spaces
    cleaned = cleaned.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    return cleaned;
}

// LAYER 2: INTENT WORD EXTRACTION
const INTENT_WORD_MAP: Record<string, string[]> = {
    "kya hai": ["definition", "kya hai", "meaning"],
    "kya hota hai": ["definition", "kya hota hai", "meaning"],
    "what is": ["definition", "what is", "meaning"],
    "define": ["definition", "define"],
    "meaning": ["definition", "meaning"],
    "matlab": ["definition", "matlab", "meaning"],
    "kaise kaam karta": ["working", "kaise kaam karta", "principle"],
    "kaise kaam karti": ["working", "kaise kaam karti", "principle"],
    "how it works": ["working", "how works", "principle"],
    "working principle": ["working", "principle"],
    "kaise kare": ["procedure", "kaise kare", "method", "steps"],
    "kaise karte": ["procedure", "kaise karte", "method"],
    "how to": ["procedure", "how to", "method"],
    "procedure": ["procedure", "method", "steps"],
    "steps": ["procedure", "steps", "method"],
    "repair": ["repair", "fix", "thik karna"],
    "thik kare": ["repair", "thik kare", "fix"],
    "theek kare": ["repair", "theek kare", "fix"],
    "fix": ["repair", "fix"],
    "inspect": ["inspection", "check", "examine"],
    "check": ["inspection", "check", "verify"],
    "dekhte": ["inspection", "dekhte", "check"],
    "dekhna": ["inspection", "dekhna", "check"],
    "identify": ["identify", "detect", "pehchan"],
    "pehchan": ["identify", "pehchan", "detect"],
    "kaise pata": ["identify", "kaise pata", "detect"],
    "problem": ["problem", "issue", "fault"],
    "kharab": ["problem", "kharab", "damage"],
    "damage": ["problem", "damage", "defect"],
    "leak": ["problem", "leak", "leakage"],
    "difference": ["comparison", "difference", "vs"],
    "farak": ["comparison", "farak", "difference"],
    "compare": ["comparison", "compare", "vs"],
    "vs": ["comparison", "vs", "versus"],
    "types": ["types", "classification", "kinds"],
    "kitne type": ["types", "kitne type", "kinds"],
    "prakar": ["types", "prakar", "kinds"]
};

function extractIntentWords(text: string) {
    const intentKeywords: string[] = [];
    const sortedPatterns = Object.keys(INTENT_WORD_MAP).sort((a, b) => b.length - a.length);
    
    for (const pattern of sortedPatterns) {
        if (text.includes(pattern)) {
            intentKeywords.push(...INTENT_WORD_MAP[pattern]);
            text = text.replace(pattern, ' ');
            break;
        }
    }
    
    return {
        intentKeywords,
        remainingText: text.replace(/\s+/g, ' ').trim()
    };
}


// LAYER 3: ENTITY EXTRACTION (Improved)
function extractEntities(text: string): { entities: string[], remainingText: string } {
    const words = text.split(' ');
    const entities = new Set<string>();

    words.forEach(word => {
        // Treat short, all-caps words as potential acronyms/entities
        if (word.length > 1 && word.length <= 4 && word === word.toUpperCase()) {
            entities.add(word.toLowerCase());
        }
        // Add any word longer than 3 chars as a potential entity
        else if (word.length > 3) {
             entities.add(word);
        }
        // Add specific short words that are entities
        else if (['cui', 'wps', 'pqr', 'ndt', 'rt', 'ut', 'mt', 'pt'].includes(word)) {
            entities.add(word);
        }
    });

    return {
        entities: Array.from(entities),
        remainingText: text // We don't remove entities from text anymore for keyword generation
    };
}


// LAYER 4: GENERATE SEARCH KEYWORDS
function generateSearchKeywords(originalQuery: string): string[] {
    const cleaned = aggressiveClean(originalQuery);
    const { intentKeywords, remainingText: afterIntent } = extractIntentWords(cleaned);
    const { entities } = extractEntities(afterIntent);
    
    const remainingWords = afterIntent.split(' ').filter(word => word.length > 2);

    const searchKeywords = [
        ...entities,
        ...intentKeywords,
        ...remainingWords
    ];
    
    return [...new Set(searchKeywords.map(k => k.toLowerCase()))];
}


// Keywords that are variations of intent, not subject matter.
const SUPPORTIVE_KEYWORDS = new Set([
    'kya', 'hota', 'hai', 'what', 'is', 'explain', 'explanation', 
    'introduction', 'about', 'meaning', 'matlab', 'define', 'concept',
    'kaise', 'how', 'procedure', 'steps', 'working', 'principle',
    'difference', 'vs', 'compare', 'farak', 'types', 'prakar', 'kinds',
    'check', 'inspect', 'repair', 'fix', 'identify', 'detect', 'problem'
]);


// LAYER 5: HYBRID MATCHING
export function findExactMatch(userQuery: string, candidateQuestions: Question[]) {
    const cleanedUserQuery = aggressiveClean(userQuery);

    // === STAGE 1: Direct Question Matching ===
    const directMatches = [];
    for (const question of candidateQuestions) {
        const simEn = calculateSimilarity(cleanedUserQuery, normalizeText(question.question_en));
        const simHi = calculateSimilarity(cleanedUserQuery, normalizeText(question.question_hi));
        const score = Math.max(simEn, simHi);

        if (score >= 85) {
            directMatches.push({ type: 'question', document: question, score, intent: ['direct_match'] });
        }
    }
    if (directMatches.length > 0) {
        directMatches.sort((a, b) => b.score - a.score);
        return directMatches;
    }

    // === STAGE 2: Advanced Keyword Fallback Matching ===
    const searchKeywords = new Set(generateSearchKeywords(userQuery));
    if (searchKeywords.size === 0) return [];
    
    const keywordMatches = [];
    for (const question of candidateQuestions) {
        const dbKeywords = new Set([
            ...(question.keywords_en || []),
            ...(question.keywords_hi || [])
        ].map(k => k.toLowerCase()));
        
        if (dbKeywords.size === 0) continue;

        let allUserKeywordsFound = true;
        for (const uKey of searchKeywords) {
            if (!dbKeywords.has(uKey)) {
                allUserKeywordsFound = false;
                break;
            }
        }
        if (!allUserKeywordsFound) continue;

        const extraDbKeywords = new Set([...dbKeywords].filter(dbKey => !searchKeywords.has(dbKey)));
        
        let hasExtraSubjectKeyword = false;
        for (const extraKey of extraDbKeywords) {
            if (!SUPPORTIVE_KEYWORDS.has(extraKey)) {
                hasExtraSubjectKeyword = true;
                break;
            }
        }
        
        if (hasExtraSubjectKeyword) continue;
        
        const score = 100;
        keywordMatches.push({ type: 'question', document: question, score, intent: ['keyword_match'] });
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
