
/**
 * ===========================================
 * HELPER FUNCTIONS
 * ===========================================
 */

/**
 * Levenshtein Distance - Edit distance between two strings
 */
export function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],      // deletion
          dp[i][j-1],      // insertion
          dp[i-1][j-1]     // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

/**
 * Normalize text
 */
export function normalizeText(text) {
  return text.toLowerCase().trim();
}

/**
 * Word tokenizer
 */
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1);
}

/**
 * Calculate word overlap percentage
 */
export function calculateWordOverlap(text1, text2) {
  const words1 = new Set(tokenize(text1));
  const words2 = new Set(tokenize(text2));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  
  return (intersection.size / union.size) * 100;
}

/**
 * Check if string contains Hindi characters
 */
export function hasHindiCharacters(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text);
}

/**
 * Check if string contains Hinglish patterns
 */
export function hasHinglishPatterns(text) {
  const hinglishPattern = /\b(kya|hai|kaise|kare|hota|hoti|mein|ke|ka|ki|se|me|par|aur|ya|toh|to)\b/i;
  return hinglishPattern.test(text);
}

/**
 * Get language of text
 */
export function detectLanguage(text) {
  if (hasHindiCharacters(text)) {
    return 'HINDI';
  } else if (hasHinglishPatterns(text)) {
    return 'HINGLISH';
  } else {
    return 'ENGLISH';
  }
}

/**
 * Calculate Jaccard similarity
 */
export function jaccardSimilarity(text1, text2) {
  const set1 = new Set(tokenize(text1));
  const set2 = new Set(tokenize(text2));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  
  return (intersection.size / union.size) * 100;
}

/**
 * Sanitize text for safe comparison
 */
export function sanitizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text, minLength = 3) {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this',
    'hai', 'hota', 'hoti', 'ka', 'ki', 'ke', 'se', 'me', 'mein',
    'aur', 'ya', 'par', 'ko', 'kya', 'kaise'
  ]);
  
  return tokenize(text)
    .filter(word => word.length >= minLength && !stopWords.has(word));
}

/**
 * Calculate cosine similarity between two text strings
 */
export function cosineSimilarity(text1, text2) {
  const words1 = tokenize(text1);
  const words2 = tokenize(text2);
  
  // Create frequency maps
  const freq1 = {};
  const freq2 = {};
  
  words1.forEach(word => {
    freq1[word] = (freq1[word] || 0) + 1;
  });
  
  words2.forEach(word => {
    freq2[word] = (freq2[word] || 0) + 1;
  });
  
  // Get all unique words
  const allWords = new Set([...words1, ...words2]);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allWords.forEach(word => {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  });
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return (dotProduct / (magnitude1 * magnitude2)) * 100;
}
