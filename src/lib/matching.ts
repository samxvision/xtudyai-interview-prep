// @ts-nocheck

function deepClean(text) {
  let cleaned = text.toLowerCase().trim();
  const noisePatterns = [
    // Meta conversation
    /tumne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho|tha)/gi,
    /aapne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho)/gi,
    /mujhe\s+samajh\s+nahi\s+aa\s+raha/gi,
    /interview\s+me\s+(poocha|pucha|aaya|question)/gi,
    // Conversational starters
    /tum\s+mujhe/gi,
    /aap\s+mujhe/gi,
    /mujhe\s+(batao|bataiye|samjhao|janna\s+hai)/gi,
    /please\s+(tell|explain|describe|help)/gi,
    /i\s+want\s+to\s+know/gi,
    /batao\s+(ki|ke)?/gi,
    // Question about question
    /iska\s+matlab\s+(kya\s+hai|batao)/gi,
    /ka\s+kya\s+matlab/gi,
    // Fillers and politeness
    /\b(yaar|bhai|sir|please|pls|kindly|thanks|thank\s+you)\b/gi,
    /\b(toh|to|so|well|ok|okay|accha|achha|thik\s+hai)\b/gi,
  ];

  for (const pattern of noisePatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }

  return cleaned.replace(/[?!.,;:"'()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
}

const ENTITY_SEMANTIC_MAP = {
  "heat_exchanger": { coreTerms: ["heat exchanger", "heat exchange"], abbreviations: ["hx", "he"] },
  "shell_and_tube_heat_exchanger": { coreTerms: ["shell and tube heat exchanger", "shell and tube"], abbreviations: ["sthe"] },
  "pressure_vessel": { coreTerms: ["pressure vessel"], abbreviations: ["pv"] },
  "corrosion": { coreTerms: ["corrosion"], partialTerms: ["rust", "corrode"] },
  "corrosion_under_insulation": { coreTerms: ["corrosion under insulation"], abbreviations: ["cui"] },
  "wps": { coreTerms: ["welding procedure specification", "wps"] },
  "pqr": { coreTerms: ["procedure qualification record", "pqr"] },
  "ndt": { coreTerms: ["non-destructive testing", "ndt"] },
  "dpt": { coreTerms: ["dye penetrant test", "dpt", "pt"] },
  "ut": { coreTerms: ["ultrasonic testing", "ut"] },
  "rt": { coreTerms: ["radiographic testing", "rt"] },
  "mt": { coreTerms: ["magnetic particle testing", "mt", "mpt"] },
  "flow": { coreTerms: ["flow"] },
  "counter_flow": { coreTerms: ["counter flow", "counter-flow", "countercurrent flow"] },
  "cross_flow": { coreTerms: ["cross flow", "cross-flow"] },
  "serration_area": { coreTerms: ["serration area", "serration"] },
  "floating_head": { coreTerms: ["floating head"] },
  "multi_pass_heat_exchanger": { coreTerms: ["multi pass heat exchanger", "multi-pass"] }
};


function resolveEntities(text) {
  const resolved = new Set();
  const textLower = text.toLowerCase();
  for (const [entityKey, semantics] of Object.entries(ENTITY_SEMANTIC_MAP)) {
    const terms = [...(semantics.coreTerms || []), ...(semantics.abbreviations || []), ...(semantics.partialTerms || [])];
    for (const term of terms) {
      if (textLower.includes(term.toLowerCase())) {
        resolved.add(entityKey);
      }
    }
  }
  return Array.from(resolved);
}

function calculateScore(userQuery, dbQuestion) {
  const cleanedUserQuery = deepClean(userQuery);
  const cleanedDbQuestion = deepClean(dbQuestion.question_en + " " + dbQuestion.question_hi);

  const userEntities = resolveEntities(cleanedUserQuery);
  const dbEntities = resolveEntities(cleanedDbQuestion);

  // Strict check: if entity counts don't match, it's not a good match.
  // This is the core fix.
  if (userEntities.length !== dbEntities.length) {
    return 0;
  }

  // Check for entity equality
  const entitiesMatch = userEntities.every(e => dbEntities.includes(e)) && dbEntities.every(e => userEntities.includes(e));
  if (!entitiesMatch) {
    return 0;
  }
  
  // If entities match perfectly, give a high base score
  let score = 80;

  // Add bonus points for keyword overlap in the remaining text
  const userTokens = cleanedUserQuery.split(' ');
  const dbTokens = cleanedDbQuestion.split(' ');
  const commonTokens = userTokens.filter(token => dbTokens.includes(token));
  
  // Give bonus for non-entity keyword matches
  const nonEntityUserTokens = userTokens.filter(t => !userEntities.some(e => e.includes(t)));
  const nonEntityDbTokens = dbTokens.filter(t => !dbEntities.some(e => e.includes(t)));
  const commonNonEntityTokens = nonEntityUserTokens.filter(token => nonEntityDbTokens.includes(token));

  if (nonEntityUserTokens.length > 0) {
      score += (commonNonEntityTokens.length / nonEntityUserTokens.length) * 20;
  }


  return Math.min(score, 100);
}


export async function intelligentQuestionMatch(userQuery, dbQuestions) {
  const allScores = [];

  const cleanedUserQuery = deepClean(userQuery);
  const userEntities = resolveEntities(cleanedUserQuery);

  // 1. Filter questions by exact entity count first. This is the main fix.
  const filteredQuestions = dbQuestions.filter(q => {
    const dbText = (q.question_en || '') + ' ' + (q.question_hi || '');
    const dbEntities = resolveEntities(deepClean(dbText));
    return dbEntities.length === userEntities.length;
  });

  // 2. Score only the filtered questions
  for (const question of filteredQuestions) {
    let score = 0;
    const dbText = (question.question_en || '') + ' ' + (question.question_hi || '');
    const dbEntities = resolveEntities(deepClean(dbText));
    
    // Check if entities are exactly the same
    const entitiesMatch = userEntities.every(e => dbEntities.includes(e)) && dbEntities.every(e => userEntities.includes(e));

    if (entitiesMatch) {
        score = 80; // High base score for perfect entity match

        // Simple word overlap for the rest of the query for tie-breaking
        const userTokens = cleanedUserQuery.split(' ');
        const dbTokens = deepClean(dbText).split(' ');
        const commonTokens = userTokens.filter(token => dbTokens.includes(token) && !userEntities.some(e => e.includes(token)));
        const uniqueUserTokens = userTokens.filter(t => !userEntities.some(e => e.includes(t)));

        if (uniqueUserTokens.length > 0) {
            score += (commonTokens.length / uniqueUserTokens.length) * 20;
        }
    }
    
    if (score > 0) {
        allScores.push({
            question,
            totalScore: score,
        });
    }
  }

  if (allScores.length === 0) {
    return { success: false, topMatch: null, alternativeMatches: [] };
  }

  // 3. Sort by score
  allScores.sort((a, b) => b.totalScore - a.totalScore);

  const topMatch = allScores[0] || null;
  const alternativeMatches = allScores.slice(1, 3);

  return {
    success: true,
    topMatch: topMatch,
    alternativeMatches: alternativeMatches,
  };
}
