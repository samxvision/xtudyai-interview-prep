
import { findDirectMatches } from './stage1-direct-match';
import { deepClean, intelligentExpansion } from './layer1-noise-removal';
import { calculateSemanticSimilarity } from './layer5-semantic-scoring';
import { adaptiveThreshold, contextualBoost } from './layer6-adaptive-threshold';
import { intelligentQuestionMatch as semanticMatch } from './layer7-intelligent-matching';

/**
 * ===========================================
 * MAIN 2-STAGE SEARCH FUNCTION
 * ===========================================
 * Stage 1: Direct Match (with abbreviation support)
 * Stage 2: 7-Layer Semantic Matching
 */
export async function searchQuestions(userQuery, dbQuestions) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 2-STAGE INTELLIGENT SEARCH SYSTEM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📝 Query: "${userQuery}"`);
  console.log(`📚 Database: ${dbQuestions.length} questions`);
  
  const overallStartTime = Date.now();
  
  // ============================================
  // STAGE 1: DIRECT MATCH
  // ============================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 STAGE 1: DIRECT MATCH');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const directMatchResult = findDirectMatches(userQuery, dbQuestions);
  
  // If a high-confidence direct match is found, return it immediately.
  if (directMatchResult.success && directMatchResult.matches[0].confidence >= 90) {
    console.log('\n✅ HIGH-CONFIDENCE DIRECT MATCH FOUND!');
    console.log(`   Top Match: "${directMatchResult.matches[0].question.question_en}"`);
    console.log(`   Confidence: ${directMatchResult.matches[0].confidence}%`);
    console.log(`   Type: ${directMatchResult.matches[0].matchType}`);
    
    const totalTime = Date.now() - overallStartTime;
    
    return {
      success: true,
      topMatch: directMatchResult.matches[0].question,
      alternativeMatches: directMatchResult.matches.slice(1, 3).map(m => m.question),
      matchType: 'DIRECT_MATCH',
    };
  }
  
  console.log('\n❌ No high-confidence direct match found');
  console.log('   → Proceeding to Stage 2: 7-Layer Semantic Matching');
  
  // ============================================
  // STAGE 2: 7-LAYER SEMANTIC MATCHING
  // ============================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧠 STAGE 2: 7-LAYER SEMANTIC MATCHING');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const stage2StartTime = Date.now();
  
  const cleaned = deepClean(userQuery);
  const semanticResult = await semanticMatch(userQuery, dbQuestions, cleaned);
  
  const stage2Time = Date.now() - stage2StartTime;
  
  if (semanticResult.success) {
    console.log('\n✅ SEMANTIC MATCH FOUND!');
    console.log(`   Top Match: "${semanticResult.matches[0].question.question_en}"`);
    console.log(`   Score: ${semanticResult.matches[0].totalScore}%`);
    console.log(`   Confidence: ${semanticResult.matches[0].finalConfidence}`);
    
    return {
      success: true,
      topMatch: semanticResult.matches[0].question,
      alternativeMatches: semanticResult.matches.slice(1, 3).map(m => m.question),
      matchType: 'SEMANTIC_MATCH',
    };
  }
  
  console.log('\n❌ NO MATCHES FOUND AFTER ALL STAGES');
  
  return {
    success: false,
    topMatch: null,
    alternativeMatches: [],
  };
}
