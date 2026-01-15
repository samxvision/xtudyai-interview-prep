
import { findDirectMatches } from './stage1-direct-match';
import { deepClean, intelligentExpansion } from './layer1-noise-removal';
import { intelligentQuestionMatch } from './layer7-intelligent-matching';

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
  
  // Only return if a HIGH-CONFIDENCE direct match is found.
  if (directMatchResult.success && directMatchResult.matches[0].confidence >= 90) {
    console.log('\n✅ HIGH-CONFIDENCE DIRECT MATCH FOUND!');
    console.log(`   Top Match: "${directMatchResult.matches[0].question.question_en}"`);
    console.log(`   Confidence: ${directMatchResult.matches[0].confidence}%`);
    console.log(`   Type: ${directMatchResult.matches[0].matchType}`);
    
    const totalTime = Date.now() - overallStartTime;
    
    const topMatch = {
        question: directMatchResult.matches[0].question,
        totalScore: directMatchResult.matches[0].confidence,
    }

    return {
      success: true,
      topMatch: topMatch,
      alternativeMatches: directMatchResult.matches.slice(1, 3).map(m => ({question: m.question, totalScore: m.confidence})),
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
  
  // Layer 1: Clean query
  const cleaned = deepClean(userQuery);
  
  // Layers 2-7: Intelligent matching
  const semanticResult = await intelligentQuestionMatch(userQuery, dbQuestions, cleaned);
  
  if (semanticResult.success) {
    console.log('\n✅ SEMANTIC MATCH FOUND!');
    console.log(`   Top Match: "${semanticResult.matches[0].question.question_en}"`);
    console.log(`   Score: ${semanticResult.matches[0].totalScore}%`);
    console.log(`   Confidence: ${semanticResult.matches[0].finalConfidence}`);
    
    return {
      success: true,
      topMatch: semanticResult.matches[0],
      alternativeMatches: semanticResult.matches.slice(1, 3),
    };
  }
  
  console.log('\n❌ NO MATCHES FOUND AFTER ALL STAGES');
  
  return {
    success: false,
    topMatch: null,
    alternativeMatches: [],
  };
}
