
/**
 * ===========================================
 * LAYER 6: ADAPTIVE THRESHOLD & CONTEXTUAL BOOSTING
 * ===========================================
 */

/**
 * Calculate adaptive threshold based on score distribution
 */
export function adaptiveThreshold(allScores) {
  if (allScores.length === 0) return 90;
  
  const topScore = allScores[0].totalScore;
  const secondScore = allScores.length > 1 ? allScores[1].totalScore : 0;
  const thirdScore = allScores.length > 2 ? allScores[2].totalScore : 0;
  
  const gap1to2 = topScore - secondScore;
  
  // RULE 1: Clear winner with big gap
  if (gap1to2 > 30) {
    return 65;  // Very lenient - clear winner
  }
  
  // RULE 2: Good winner with decent gap
  if (gap1to2 > 20) {
    return 75;  // Moderate
  }
  
  // RULE 3: Close competition
  if (gap1to2 > 10) {
    return 85;  // Strict
  }
  
  // RULE 4: Very close - be very strict
  return 90;
}

/**
 * Apply contextual boost to match result
 */
export function contextualBoost(matchResult, userQuery, dbQuestion) {
  let boost = 0;
  const boostReasons = [];
  
  // ==========================================
  // BOOST 1: Category Match (5 points)
  // ==========================================
  if (dbQuestion.category) {
    const categoryKeywords = {
      'static-equipment': ['vessel', 'exchanger', 'column', 'tank', 'reactor', 'separator'],
      'rotating-equipment': ['pump', 'compressor', 'turbine', 'motor', 'blower'],
      'ndt': ['test', 'testing', 'inspection', 'dpt', 'ut', 'mt', 'rt', 'vt'],
      'piping': ['pipe', 'flange', 'gasket', 'bolt', 'fitting', 'valve'],
      'qa-qc': ['inspection', 'quality', 'report', 'document', 'wps', 'pqr']
    };
    
    const cat = Array.isArray(dbQuestion.category) ? dbQuestion.category[0] : dbQuestion.category;
    const catKeywords = categoryKeywords[cat] || [];
    if (catKeywords.some(k => userQuery.toLowerCase().includes(k))) {
      boost += 5;
      boostReasons.push('Category match');
    }
  }
  
  // ==========================================
  // BOOST 2: Question Complexity Match (3 points)
  // ==========================================
  const userComplexity = userQuery.split(' ').length;
  const dbComplexity = (dbQuestion.question_en || '').split(' ').length;
  const complexityDiff = Math.abs(userComplexity - dbComplexity);
  
  if (complexityDiff <= 2) {
    boost += 3;
    boostReasons.push('Similar complexity');
  } else if (complexityDiff <= 5) {
    boost += 1;
    boostReasons.push('Moderate complexity match');
  }
  
  // ==========================================
  // BOOST 3: Language Consistency (2 points)
  // ==========================================
  const hindiPattern = /[\u0900-\u097F]/;
  const hinglishPattern = /\b(kya|hai|kaise|kare|hota|mein|ke|ka)\b/i;
  
  const userHasHindi = hindiPattern.test(userQuery);
  const userHasHinglish = hinglishPattern.test(userQuery);
  const dbHasHindi = hindiPattern.test(dbQuestion.question_hi || '');
  
  if ((userHasHindi || userHasHinglish) && dbHasHindi) {
    boost += 2;
    boostReasons.push('Language consistency');
  }
  
  // ==========================================
  // BOOST 4: Tag Overlap (2 points)
  // ==========================================
  if (dbQuestion.tags && dbQuestion.tags.length > 0) {
    const userLower = userQuery.toLowerCase();
    const tagMatches = dbQuestion.tags.filter(tag => 
      userLower.includes(tag.toLowerCase())
    );
    
    if (tagMatches.length > 0) {
      boost += 2;
      boostReasons.push(`Tag match: ${tagMatches.join(', ')}`);
    }
  }
  
  // ==========================================
  // BOOST 5: Difficulty Match (2 points)
  // ==========================================
  if (dbQuestion.difficulty) {
    const userHasBasic = /\b(basic|simple|easy|introduction)\b/i.test(userQuery);
    const userHasAdvanced = /\b(advanced|complex|detailed|depth)\b/i.test(userQuery);
    
    if (userHasBasic && dbQuestion.difficulty === 'easy') {
      boost += 2;
      boostReasons.push('Difficulty match (easy)');
    } else if (userHasAdvanced && dbQuestion.difficulty === 'hard') {
      boost += 2;
      boostReasons.push('Difficulty match (hard)');
    } else if (!userHasBasic && !userHasAdvanced && dbQuestion.difficulty === 'medium') {
      boost += 1;
      boostReasons.push('Difficulty match (medium)');
    }
  }
  
  const newTotalScore = Math.min(matchResult.totalScore + boost, 100);

  return {
    ...matchResult,
    totalScore: newTotalScore,
    boost,
    boostReasons,
    finalConfidence: newTotalScore >= 85 ? 'VERY_HIGH' :
                     newTotalScore >= 70 ? 'HIGH' :
                     newTotalScore >= 55 ? 'MEDIUM' : 'LOW'
  };
}
