// @ts-nocheck
import { stringSimilarity } from './string-similarity';
import { expandAcronyms } from './acronyms';
import type { Question } from '@/types';


// ===============================================
// LAYER 1: ADVANCED NOISE CANCELLATION
// ===============================================
const DEEP_NOISE_PATTERNS = {
  metaTalk: [/tumne\s+(.+?)\s+(dekha|dekhaa|dekhi|suna|sunaa|kiya|padha|padhaa)\s+(hai|ho|tha)/gi, /aapne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho)/gi, /maine\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|tha)/gi, /mujhe\s+samajh\s+nahi\s+aa\s+raha/gi, /mujhe\s+samjh\s+nahi\s+aaya/gi, /samajh\s+me\s+nahi\s+aa\s+raha/gi, /samjh\s+nahi\s+aati/gi, /interview\s+me\s+(poocha|pucha|aaya|question)/gi, /interview\s+question\s+(hai|tha)/gi, /viva\s+me\s+poocha/gi, /exam\s+me\s+(aaya|tha)/gi, /koi\s+bata\s+sakta\s+hai/gi, /kya\s+aap\s+bata\s+sakte/gi, /agar\s+pata\s+ho\s+toh/gi, /agar\s+aapko\s+pata\s+hai/gi, /thoda\s+help\s+karo/gi, /help\s+chahiye/gi],
  conversationalStarters: [/tum\s+mujhe\s+(ab|abhi|jaldi|please|zara|thoda)?\s*/gi, /tum\s+hamko\s+(ab|abhi)?\s*/gi, /tum\s+batao\s+(ki|ke|yaar|bhai)?\s*/gi, /tum\s+bataiye\s+(ki|ke)?\s*/gi, /tum\s+mujhe\s+(ab|abhi)?\s+(yeah|ye|yeh)?\s+batao/gi, /tum\s+mujhe\s+ab\s+batao/gi, /tum\s+ab\s+batao/gi, /aap\s+mujhe\s+(ab|abhi|please|kripya)?\s*/gi, /aap\s+bataiye\s+(ki|ke|na)?\s*/gi, /aap\s+batao\s+(ki|ke)?\s*/gi, /aapko\s+pata\s+hai\s+toh\s+batao/gi, /mujhe\s+(ab|abhi|jaldi|please|zara)?\s+batao/gi, /mujhe\s+bataiye/gi, /mujhe\s+samjhao/gi, /mujhe\s+samjhaiye/gi, /mujhe\s+janna\s+hai\s+(ki|ke)?\s*/gi, /mujhe\s+pata\s+karna\s+hai/gi, /mujhe\s+chahiye/gi, /please\s+(tell|explain|describe|help)/gi, /kindly\s+(tell|explain|describe)/gi, /can\s+you\s+(tell|explain|describe|help)/gi, /could\s+you\s+(tell|explain|describe)/gi, /would\s+you\s+(tell|explain|describe)/gi, /will\s+you\s+(tell|explain|describe)/gi, /i\s+want\s+to\s+know/gi, /i\s+wanna\s+know/gi, /i\s+need\s+to\s+know/gi, /i\s+would\s+like\s+to\s+know/gi, /i'd\s+like\s+to\s+know/gi, /batao\s+(ki|ke|yaar|bhai|na)?\s*/gi, /bataiye\s+(ki|ke|na)?\s*/gi, /bata\s+do\s+(ki|ke)?\s*/gi, /bata\s+dijiye\s+(ki|ke)?\s*/gi, /yeah\s+batao/gi, /ye\s+batao/gi, /yeh\s+batao/gi, /iska\s+batao/gi, /uska\s+batao/gi, /iske\s+baare\s+me\s+batao/gi, /^(toh|to|so|well|ok|okay|accha|achha|thik\s+hai)\s+/gi, /^(listen|suno|dekho|dekhiye)\s+/gi, /^(arre|yaar|bhai|sir|madam)\s+/gi],
  questionAboutQuestion: [/iska\s+matlab\s+(kya\s+hai|batao|bataiye)/gi, /ka\s+kya\s+matlab\s+(hai|hota|batao)/gi, /ka\s+matlab\s+(kya|batao)/gi, /explain\s+karo/gi, /explain\s+kijiye/gi, /samjhao\s+(na|yaar|bhai)?\s*/gi, /samjhaiye\s+(na)?\s*/gi, /definition\s+do/gi, /definition\s+batao/gi, /define\s+karo/gi, /define\s+kijiye/gi, /brief\s+me\s+batao/gi, /detail\s+me\s+batao/gi, /thoda\s+explain\s+karo/gi, /clearly\s+batao/gi, /ache\s+se\s+samjhao/gi, /properly\s+explain/gi],
  pureFillers: [/\b(yaar|bhai|dost|sir|madam|ji)\b/gi, /\b(accha|achha|acha|theek|thik|ok|okay|okie)\b/gi, /\b(haan|han|nahi|nhi|na)\b/gi, /\b(arre|are|arey)\b/gi, /\b(dekho|dekhiye|suno|suniye|sunno)\b/gi, /\b(well|so|like|actually|basically|technically)\b/gi, /\b(you\s+know|i\s+mean|as\s+such)\b/gi, /\b(right|correct|exactly)\b/gi, /\b(uh|uhh|um|umm|hmm|hmmm|ah|ahh|oh|ohh|err)\b/gi, /\b(jaldi|quickly|fast|abhi|ab|now|immediately)\b/gi, /\b(zara|thoda|little\s+bit|just)\b/gi],
  politeness: [/\b(please|pls|kindly|kripya|kripaya)\b/gi, /\b(thanks|thank\s+you|dhanyavaad|shukriya)\b/gi, /\b(sorry|excuse\s+me|maaf\s+karo)\b/gi],
  stepByStepRequests: [/step\s+by\s+step/gi, /step\s+wise/gi, /ek\s+ek\s+karke/gi, /sabse\s+pehle/gi, /first\s+to\s+last/gi, /start\s+se\s+end\s+tak/gi, /puri\s+process/gi, /complete\s+process/gi, /detail\s+me/gi, /detailed/gi]
};

function deepClean(text) {
  let cleaned = text.toLowerCase().trim();
  const metaMatch = cleaned.match(/(?:tumne|aapne|maine)\s+(.+?)\s+(?:dekha|dekhaa|suna|kiya|padha)\s+(?:hai|ho|tha)(.+?)(?:uska|iska|us\s+ka|is\s+ka)\s+(kaam|matlab|definition|working|function|use|application)\s+(?:kya|kaise)/i);
  if (metaMatch) {
    const entity = metaMatch[1].trim();
    const property = metaMatch[3].trim();
    cleaned = `${entity} ${property} kya hota`;
  }
  const jannaMatch = cleaned.match(/mujhe\s+janna\s+hai\s+ki\s+(.+)/i);
  if (jannaMatch) {
    cleaned = jannaMatch[1].trim();
  }
  const bataoMatch = cleaned.match(/(?:tum|aap)\s+mujhe\s+(?:ab|abhi)?\s*(?:ye|yeh|yeah)?\s*batao\s+ki\s+(.+)/i);
  if (bataoMatch) {
    cleaned = bataoMatch[1].trim();
  }
  const orderedPatterns = [...DEEP_NOISE_PATTERNS.conversationalStarters, ...DEEP_NOISE_PATTERNS.metaTalk, ...DEEP_NOISE_PATTERNS.questionAboutQuestion, ...DEEP_NOISE_PATTERNS.stepByStepRequests, ...DEEP_NOISE_PATTERNS.politeness, ...DEEP_NOISE_PATTERNS.pureFillers];
  for (const pattern of orderedPatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  cleaned = cleaned.replace(/[?!.,;:"'\(\)\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned;
}

// Levenshtein distance function (for fuzzy matching)
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}


// ===============================================
// LAYER 5: SEMANTIC SIMILARITY SCORING
// ===============================================
function calculateSemanticSimilarity(userQuery, dbQuestion) {
  const cleanedQuery = deepClean(userQuery);
  
  let totalScore = 0;
  const breakdown = [];

  // Layer 3: Keyword Extraction & Matching
  const userKeywords = cleanedQuery.split(' ').filter(w => w.length > 2);
  const dbKeywordsEn = dbQuestion.keywords_en?.map(k => k.toLowerCase()) || [];
  const dbKeywordsHi = dbQuestion.keywords_hi?.map(k => k.toLowerCase()) || [];
  const allDbKeywords = [...new Set([...dbKeywordsEn, ...dbKeywordsHi])];
  
  let keywordMatches = 0;
  userKeywords.forEach(uk => {
    if (allDbKeywords.some(dk => dk.includes(uk) || uk.includes(dk))) {
      keywordMatches++;
    }
  });
  const keywordScore = userKeywords.length > 0 ? (keywordMatches / userKeywords.length) * 40 : 0;
  totalScore += keywordScore;
  breakdown.push({ component: 'KEYWORD_MATCH', score: keywordScore, details: `${keywordMatches}/${userKeywords.length} keywords matched` });

  // Layer 4 & 5: Semantic & String Similarity
  const simEn = stringSimilarity(cleanedQuery, dbQuestion.normalized_en || "");
  const simHi = stringSimilarity(cleanedQuery, dbQuestion.normalized_hi || "");
  const topSim = Math.max(simEn, simHi);
  const similarityScore = topSim * 35;
  totalScore += similarityScore;
  breakdown.push({ component: 'STRING_SIMILARITY', score: similarityScore, details: `Max similarity: ${topSim.toFixed(2)}` });

  // Layer 6: Contextual Boosting (Simplified)
  let boost = 0;
  if (dbQuestion.category) {
      const catKeywords = Array.isArray(dbQuestion.category) ? dbQuestion.category : [dbQuestion.category];
      if (catKeywords.some(k => cleanedQuery.includes(k.toLowerCase()))) {
          boost += 5;
      }
  }
  if (dbQuestion.difficulty && cleanedQuery.includes(dbQuestion.difficulty)) {
      boost += 5;
  }
  totalScore += boost;
  
  // Layer 7: Final Scoring
  return {
    totalScore: Math.min(totalScore, 100),
    breakdown,
    confidence: totalScore >= 85 ? 'VERY_HIGH' : totalScore >= 70 ? 'HIGH' : totalScore >= 55 ? 'MEDIUM' : 'LOW'
  };
}

// ===============================================
// FINAL INTELLIGENT MATCHING ENGINE
// ===============================================
export async function intelligentQuestionMatch(userQuery: string, dbQuestions: Question[]) {
  const startTime = Date.now();

  // --- STEP 1: High-Confidence Direct Match (with Acronym Expansion) ---
  const DIRECT_MATCH_THRESHOLD = 0.90;
  const expandedUserQuery = expandAcronyms(userQuery);

  const directMatchScores = dbQuestions.map(question => {
    const simEn = stringSimilarity(expandedUserQuery, question.normalized_en || "");
    const simHi = stringSimilarity(expandedUserQuery, question.normalized_hi || "");
    const score = Math.max(simEn, simHi);
    return { question, score };
  }).sort((a, b) => b.score - a.score);

  const bestDirectMatch = directMatchScores[0];

  if (bestDirectMatch && bestDirectMatch.score >= DIRECT_MATCH_THRESHOLD) {
    console.log(`⚡ Direct Match Found: "${bestDirectMatch.question.question_en}" with score ${bestDirectMatch.score.toFixed(2)}`);
    return {
      success: true,
      topMatch: { question: bestDirectMatch.question, totalScore: bestDirectMatch.score * 100 },
      alternativeMatches: directMatchScores.slice(1, 3).filter(m => m.score > 0.7).map(m => ({ question: m.question, totalScore: m.score * 100 })),
      processingTime: `${Date.now() - startTime}ms`,
      matchType: 'Direct',
    };
  }

  console.log(`⚠️ No direct match found. Falling back to 7-layer system...`);

  // --- STEP 2: Fallback to 7-Layer Semantic Analysis ---
  const allScores = dbQuestions.map(question => {
    const semanticResult = calculateSemanticSimilarity(userQuery, question);
    return {
      question,
      ...semanticResult
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
  
  const topScore = allScores[0]?.totalScore || 0;
  let threshold = 65; 
  if (topScore > 90) threshold = 80;
  else if (topScore > 80) threshold = 70;


  const qualifiedMatches = allScores.filter(s => s.totalScore >= threshold);
  const processingTime = Date.now() - startTime;

  const result = {
    success: qualifiedMatches.length > 0,
    topMatch: qualifiedMatches[0] || null,
    alternativeMatches: qualifiedMatches.slice(1, 3).filter(m => m.totalScore > threshold - 15),
    totalScanned: dbQuestions.length,
    totalMatched: qualifiedMatches.length,
    threshold,
    processingTime: `${processingTime}ms`,
    matchType: 'Semantic',
    debugInfo: {
      topScores: allScores.slice(0, 5).map(s => ({
        questionId: s.question.id || 'N/A',
        questionEn: s.question.question_en,
        score: s.totalScore,
        confidence: s.confidence,
        breakdown: s.breakdown
      }))
    }
  };

  console.log('📊 Semantic Search Results:');
  console.log(`   ├─ Threshold: ${threshold}`);
  console.log(`   ├─ Matched: ${qualifiedMatches.length}/${dbQuestions.length}`);
  console.log(`   ├─ Processing time: ${processingTime}ms`);
  
  if (result.topMatch) {
    console.log(`   └─ Top match: "${result.topMatch.question.question_en}" (${result.topMatch.totalScore}%)`);
  } else {
    console.log('   └─ No matches found.');
  }

  return result;
}

    