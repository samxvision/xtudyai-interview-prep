
import { calculateSemanticSimilarity } from './layer5-semantic-scoring';
import { adaptiveThreshold, contextualBoost } from './layer6-adaptive-threshold';
import { intelligentExpansion } from './layer1-noise-removal';

/**
 * ===========================================
 * LAYER 7: INTELLIGENT MATCHING ENGINE
 * ===========================================
 */

export async function intelligentQuestionMatch(userQuery, dbQuestions, cleaned) {
  console.log('\n📍 Layer 2-5: Processing entities, intents, and scoring');
  
  const startTime = Date.now();
  
  // Get query expansions
  const expansionResult = intelligentExpansion(cleaned);
  console.log(`   Query expansions: ${expansionResult.expansions.length}`);
  
  const allScores = [];
  
  // Score all questions with all expansions
  for (const question of dbQuestions) {
    let bestScore = null;
    
    // Try all query variations
    for (const queryVariation of expansionResult.expansions) {
      let matchResult = calculateSemanticSimilarity(queryVariation, question);
      matchResult = contextualBoost(matchResult, queryVariation, question);
      
      if (!bestScore || matchResult.totalScore > bestScore.totalScore) {
        bestScore = matchResult;
      }
    }
    
    if (bestScore) {
      allScores.push({
        question,
        ...bestScore
      });
    }
  }
  
  // Sort by score
  allScores.sort((a, b) => b.totalScore - a.totalScore);
  
  console.log('\n📍 Layer 6: Adaptive Threshold Calculation');
  const threshold = adaptiveThreshold(allScores);
  console.log(`   Calculated threshold: ${threshold}%`);
  
  console.log('\n📍 Layer 7: Final Matching & Filtering');
  const qualifiedMatches = allScores.filter(s => s.totalScore >= threshold);
  console.log(`   Qualified matches: ${qualifiedMatches.length}/${dbQuestions.length}`);
  
  if (qualifiedMatches.length > 0) {
    console.log(`   Top match score: ${qualifiedMatches[0].totalScore}%`);
  }
  
  const processingTime = Date.now() - startTime;
  
  return {
    success: qualifiedMatches.length > 0,
    matches: qualifiedMatches,
    threshold,
    processingTime: `${processingTime}ms`,
    allScores: allScores.slice(0, 5) // Top 5 for debugging
  };
}
