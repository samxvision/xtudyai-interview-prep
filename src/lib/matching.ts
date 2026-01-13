
// @ts-nocheck

import { stringSimilarity } from './string-similarity';
import { searchAcronym } from './acronyms';

/**
 * A simplified and robust matching function.
 * It prioritizes direct string similarity for reliability.
 *
 * @param userQuery The user's input string.
 * @param dbQuestions The array of all questions from the database.
 * @returns An object containing the match results.
 */
export async function intelligentQuestionMatch(userQuery, dbQuestions) {
  const startTime = Date.now();

  // Step 1: Normalize the user query for matching
  const cleanedUserQuery = userQuery.toLowerCase().trim();

  if (!cleanedUserQuery) {
    return { success: false, topMatch: null, alternativeMatches: [] };
  }

  // Step 2: Calculate similarity score for each question in the database
  const allScores = dbQuestions.map(question => {
    // Check similarity against both English and Hindi normalized questions
    const simEn = stringSimilarity(cleanedUserQuery, question.normalized_en || "");
    const simHi = stringSimilarity(cleanedUserQuery, question.normalized_hi || "");
    
    // Use the higher of the two scores
    const topSim = Math.max(simEn, simHi);

    return {
      question,
      totalScore: topSim * 100, // Convert to percentage
      confidence: topSim > 0.85 ? 'VERY_HIGH' : topSim > 0.7 ? 'HIGH' : topSim > 0.55 ? 'MEDIUM' : 'LOW',
      breakdown: [{ component: 'STRING_SIMILARITY', score: topSim * 100, details: `Similarity: ${topSim.toFixed(2)}` }],
    };
  });

  // Step 3: Sort all questions by their similarity score in descending order
  allScores.sort((a, b) => b.totalScore - a.totalScore);

  // Step 4: Determine the threshold for a "good" match
  // For simplicity and reliability, we can use a fixed threshold.
  // A score of 60 means the strings are reasonably similar.
  const threshold = 60; 

  // Step 5: Filter out matches that are below the threshold
  const qualifiedMatches = allScores.filter(s => s.totalScore >= threshold);

  const processingTime = Date.now() - startTime;

  const result = {
    success: qualifiedMatches.length > 0,
    topMatch: qualifiedMatches[0] || null,
    alternativeMatches: qualifiedMatches.slice(1, 3),
    totalScanned: dbQuestions.length,
    totalMatched: qualifiedMatches.length,
    threshold,
    processingTime: `${processingTime}ms`,
    queryAnalysis: { cleaned: cleanedUserQuery },
    debugInfo: {
      topScores: allScores.slice(0, 5).map(s => ({
        questionId: s.question.id || 'N/A',
        questionEn: s.question.question_en,
        score: Math.round(s.totalScore),
        confidence: s.confidence,
      }))
    }
  };

  console.log('📊 Simple Search Results:');
  console.log(`   ├─ Threshold: ${threshold}`);
  console.log(`   ├─ Matched: ${qualifiedMatches.length}/${dbQuestions.length}`);
  console.log(`   ├─ Processing time: ${processingTime}ms`);
  
  if (result.topMatch) {
    console.log(`   └─ Top match: "${result.topMatch.question.question_en}" (${Math.round(result.topMatch.totalScore)}%)`);
  } else {
    console.log('   └─ No matches found above threshold.');
  }

  return result;
}
