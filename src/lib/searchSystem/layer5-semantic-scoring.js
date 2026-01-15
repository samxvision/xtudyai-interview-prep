
import { deepClean, intelligentExpansion } from './layer1-noise-removal';
import { resolveEntity } from './layer2-entity-resolution';
import { detectIntentWithConfidence, resolveIntentConflicts } from './layer3-intent-detection';
import { detectContext } from './layer4-context-detection';
import { levenshteinDistance } from './helpers';

/**
 * ===========================================
 * LAYER 5: SEMANTIC SIMILARITY SCORING
 * ===========================================
 */

export function calculateSemanticSimilarity(userQuery, dbQuestion) {
  let totalScore = 0;
  const breakdown = [];
  
  // Process user query
  const cleaned = deepClean(userQuery);
  const expansionResult = intelligentExpansion(cleaned);
  const entityResult = resolveEntity(cleaned);
  const intentResult = detectIntentWithConfidence(cleaned);
  const intentResolution = resolveIntentConflicts(intentResult.intents);
  const contextResult = detectContext(cleaned);
  
  // Process DB question
  const dbEntityResult = resolveEntity(
    (dbQuestion.question_en || '') + ' ' + (dbQuestion.question_hi || '')
  );
  const dbIntentResult = detectIntentWithConfidence(
    (dbQuestion.question_en || '') + ' ' + (dbQuestion.question_hi || '')
  );
  const dbIntentResolution = resolveIntentConflicts(dbIntentResult.intents);
  const dbContextResult = detectContext(
    (dbQuestion.question_en || '') + ' ' + (dbQuestion.question_hi || '')
  );
  
  // ==========================================
  // SCORE 1: Entity Match (40 points MAX)
  // ==========================================
  let entityScore = 0;
  
  if (entityResult.entities.length > 0 && dbEntityResult.entities.length > 0) {
    const topUserEntity = entityResult.topEntity;
    const topDbEntity = dbEntityResult.topEntity;
    
    if (topUserEntity.entity === topDbEntity.entity) {
      const avgConfidence = (topUserEntity.confidence + topDbEntity.confidence) / 2;
      entityScore = (avgConfidence / 100) * 40;
      
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: entityScore,
        details: `Exact match: ${topUserEntity.displayName}`,
        userConfidence: topUserEntity.confidence,
        dbConfidence: topDbEntity.confidence
      });
    } else {
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: 0,
        details: `No match: ${topUserEntity.displayName} vs ${topDbEntity.displayName}`
      });
    }
  } else {
    // Fallback: keyword matching
    const userTokens = cleaned.split(' ').filter(w => w.length > 2);
    const dbKeywords = [
      ...(dbQuestion.keywords_en || []),
      ...(dbQuestion.keywords_hi || [])
    ].map(k => k.toLowerCase());
    
    let matches = 0;
    for (const token of userTokens) {
      if (dbKeywords.some(kw => kw.includes(token) || token.includes(kw))) {
        matches++;
      }
    }
    
    if (userTokens.length > 0) {
      entityScore = (matches / userTokens.length) * 40;
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: entityScore,
        details: `Keyword fallback: ${matches}/${userTokens.length} matches`
      });
    }
  }
  
  totalScore += entityScore;
  
  // ==========================================
  // SCORE 2: Intent Match (35 points MAX)
  // ==========================================
  let intentScore = 0;
  
  if (intentResolution.finalIntent && dbIntentResolution.finalIntent) {
    const userIntent = intentResolution.finalIntent.intent;
    const dbIntent = dbIntentResolution.finalIntent.intent;
    
    if (userIntent === dbIntent) {
      const avgConfidence = (
        intentResolution.finalIntent.confidence + 
        dbIntentResolution.finalIntent.confidence
      ) / 2;
      intentScore = (avgConfidence / 100) * 35;
      
      breakdown.push({
        component: 'INTENT_MATCH_PRIMARY',
        score: intentScore,
        details: `Exact intent match: ${userIntent}`,
        userConfidence: intentResolution.finalIntent.confidence,
        dbConfidence: dbIntentResolution.finalIntent.confidence
      });
    } else {
      // Check supporting intents
      const userIntents = [
        userIntent,
        ...intentResolution.supportingIntents.map(i => i.intent)
      ];
      const dbIntents = [
        dbIntent,
        ...dbIntentResolution.supportingIntents.map(i => i.intent)
      ];
      
      const commonIntents = userIntents.filter(ui => dbIntents.includes(ui));
      
      if (commonIntents.length > 0) {
        intentScore = (commonIntents.length / userIntents.length) * 20;
        breakdown.push({
          component: 'INTENT_MATCH_PARTIAL',
          score: intentScore,
          details: `Partial intent match: ${commonIntents.join(', ')}`
        });
      } else {
        breakdown.push({
          component: 'INTENT_MATCH',
          score: 0,
          details: `No match: ${userIntent} vs ${dbIntent}`
        });
      }
    }
  }
  
  totalScore += intentScore;
  
  // ==========================================
  // SCORE 3: Query Expansion Match (15 points MAX)
  // ==========================================
  let expansionScore = 0;
  const maxExpansionScore = 15;
  
  for (const expandedQuery of expansionResult.expansions) {
    const expandedTokens = expandedQuery.split(' ').filter(w => w.length > 2);
    const dbKeywords = [
      ...(dbQuestion.keywords_en || []),
      ...(dbQuestion.keywords_hi || [])
    ].map(k => k.toLowerCase());
    
    let matches = 0;
    for (const token of expandedTokens) {
      if (dbKeywords.some(kw => kw.includes(token) || token.includes(kw))) {
        matches++;
      }
    }
    
    if (expandedTokens.length > 0) {
      const score = (matches / expandedTokens.length) * maxExpansionScore;
      if (score > expansionScore) {
        expansionScore = score;
      }
    }
  }
  
  totalScore += expansionScore;
  breakdown.push({
    component: 'EXPANSION_MATCH',
    score: expansionScore,
    details: `Best of ${expansionResult.expansions.length} expansions`
  });
  
  // ==========================================
  // SCORE 4: Fuzzy Keyword Overlap (10 points MAX)
  // ==========================================
  const userTokens = cleaned.split(' ').filter(w => w.length > 2);
  const dbKeywords = [
    ...(dbQuestion.keywords_en || []),
    ...(dbQuestion.keywords_hi || [])
  ].map(k => k.toLowerCase());
  
  let fuzzyMatches = 0;
  for (const token of userTokens) {
    for (const keyword of dbKeywords) {
      if (token.length > 3 && keyword.length > 3) {
        if (levenshteinDistance(token, keyword) <= 2) {
          fuzzyMatches++;
          break;
        }
      }
    }
  }
  
  const fuzzyScore = userTokens.length > 0 
    ? (fuzzyMatches / userTokens.length) * 10 
    : 0;
    
  totalScore += fuzzyScore;
  breakdown.push({
    component: 'FUZZY_MATCH',
    score: fuzzyScore,
    details: `${fuzzyMatches}/${userTokens.length} fuzzy matches`
  });
  
  // Final score normalization
  totalScore = Math.min(totalScore, 100);
  
  return {
    totalScore: Math.round(totalScore),
    breakdown,
    userProcessing: {
      cleaned,
      entities: entityResult.entities,
      intents: intentResolution,
      contexts: contextResult,
      expansions: expansionResult.expansions
    },
    dbProcessing: {
      entities: dbEntityResult.entities,
      intents: dbIntentResolution,
      contexts: dbContextResult
    },
    confidence: totalScore >= 85 ? 'VERY_HIGH' :
                totalScore >= 70 ? 'HIGH' :
                totalScore >= 55 ? 'MEDIUM' : 'LOW'
  };
}
