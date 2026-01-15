
/**
 * ===========================================
 * LAYER 3: INTENT DETECTION
 * ===========================================
 */

const ADVANCED_INTENT_PATTERNS = {
  DEFINITION: {
    strongPatterns: [
      /\b(kya hai|kya hota hai|what is|define)\b/i,
      /\b(definition|meaning|matlab)\b/i,
      /\b(ka\s+arth|ka\s+matlab\s+kya)\b/i,
      /\b(iska\s+matlab\s+kya\s+hai)\b/i
    ],
    weakPatterns: [
      /\b(bataiye|batao|explain|describe)\b/i,
      /\b(samjhao|samjhaiye|tell\s+me)\b/i,
      /\b(about|regarding)\b/i,
      /\b(introduction|intro)\b/i,
      /\b(yeh\s+kya\s+hai|ye\s+kya\s+hota)\b/i
    ],
    contextualClues: [
      /\bkya\s+(hai|hota|hoti)\b/i,
      /\bka\s+matlab\b/i,
      /\bmeaning\s+of\b/i,
      /\bdefine\s+/i,
      /\bwhat\s+is\s+/i
    ],
    weight: 50
  },
  
  WORKING: {
    strongPatterns: [
      /\b(kaise\s+kaam\s+karta|kaise\s+kaam\s+karti)\b/i,
      /\b(how\s+it\s+works|how\s+does\s+it\s+work)\b/i,
      /\b(working\s+principle|operating\s+principle)\b/i,
      /\b(function\s+kya|kaam\s+kya\s+hai)\b/i,
      /\b(mechanism\s+of)\b/i
    ],
    weakPatterns: [
      /\b(mechanism|logic|concept)\b/i,
      /\b(work\s+kaise)\b/i,
      /\b(process\s+behind)\b/i,
      /\b(system\s+kaise)\b/i,
      /\b(chalti\s+kaise)\b/i
    ],
    contextualClues: [
      /\bkaam\s+(kaise|kya)\b/i,
      /\bworking\s+principle\b/i,
      /\bhow\s+it\s+operates\b/i,
      /\bfunction\s+of\b/i
    ],
    weight: 48
  },
  
  PROCEDURE: {
    strongPatterns: [
      /\b(kaise\s+kare|kaise\s+karte|kaise\s+kiya)\b/i,
      /\b(how\s+to|how\s+do\s+we|how\s+to\s+perform)\b/i,
      /\b(step\s+by\s+step|stepwise|step\s+wise)\b/i,
      /\b(procedure|process|method|steps)\b/i,
      /\b(inspection\s+procedure|testing\s+procedure)\b/i,
      /\b(vidhi|pranali|tarika\s+kya\s+hai)\b/i
    ],
    weakPatterns: [
      /\b(tarika|tareeka)\b/i,
      /\b(process\s+samjhao)\b/i,
      /\b(complete\s+process|full\s+process)\b/i,
      /\b(sequence)\b/i,
      /\b(start\s+kaise|shuru\s+kaise)\b/i
    ],
    contextualClues: [
      /\bkaise\s+(kare|karte|kiya|karein)\b/i,
      /\bstep\s+wise\b/i,
      /\bpehle\s+kya\s+phir\s+kya\b/i,
      /\bprocedure\s+follow\b/i
    ],
    weight: 40
  },
  
  REPAIR: {
    strongPatterns: [
      /\b(repair|fix|thik\s+kar|theek\s+kar)\b/i,
      /\b(kaise\s+repair|how\s+to\s+repair)\b/i,
      /\b(rectify|rectification|sudhar)\b/i,
      /\b(maintenance|maintain\s+kaise)\b/i,
      /\b(kaise\s+theek\s+kare|kaise\s+thik\s+ho)\b/i
    ],
    weakPatterns: [
      /\b(resolve|solve|solution)\b/i,
      /\b(restore|restoration)\b/i,
      /\b(overhaul|rework)\b/i,
      /\b(maintenance\s+ka\s+tarika)\b/i
    ],
    contextualClues: [
      /\brepair\s+(method|procedure|process)\b/i,
      /\bthik\s+(kare|karna|karein)\b/i,
      /\bfix\s+kaise\b/i,
      /\brepair\s+karna\b/i
    ],
    weight: 45
  },
  
  PROBLEM: {
    strongPatterns: [
      /\b(problem|issue|fault|failure)\b/i,
      /\b(kharab|damage|defect|galti)\b/i,
      /\b(leak|leakage|crack|corrosion)\b/i,
      /\b(fail\s+ho|kharab\s+ho|damage\s+ho)\b/i,
      /\b(not\s+working|work\s+nahi\s+kar\s+raha)\b/i
    ],
    weakPatterns: [
      /\b(breakdown|malfunction)\b/i,
      /\b(abnormal|unusual)\b/i,
      /\b(deterioration|degradation)\b/i,
      /\b(wear|erosion|pitting)\b/i
    ],
    contextualClues: [
      /\bkharab\s+(ho|hai|hota)\b/i,
      /\bproblem\s+(aa|hai)\b/i,
      /\bfailure\s+of\b/i,
      /\bdamage\s+(in|to)\b/i
    ],
    weight: 35
  },
  
  IDENTIFICATION: {
    strongPatterns: [
      /\b(identify|identification|pehchan)\b/i,
      /\b(kaise\s+pata|how\s+to\s+identify)\b/i,
      /\b(inspect|inspection|check|examine)\b/i,
      /\b(detect|detection|find)\b/i,
      /\b(kaise\s+dekhte|kaise\s+dekhe|kaise\s+pata\s+kare)\b/i
    ],
    weakPatterns: [
      /\b(recognition|locate|location)\b/i,
      /\b(testing|test\s+kaise)\b/i,
      /\b(measurement|measure)\b/i,
      /\b(dekhna|dekhte|check\s+karna)\b/i
    ],
    contextualClues: [
      /\bkaise\s+(pata|check|detect|identify)\b/i,
      /\binspect\s+kaise\b/i,
      /\bhow\s+to\s+(identify|detect|inspect)\b/i,
      /\bcheck\s+(kare|karna)\b/i
    ],
    weight: 30
  },
  
  DECISION: {
    strongPatterns: [
      /\b(acceptable|acceptance\s+criteria|accept)\b/i,
      /\b(reject|rejection\s+criteria|rejection\s+limit)\b/i,
      /\b(pass|fail|pass\s+or\s+fail)\b/i,
      /\b(limit|allowable\s+limit|tolerance\s+limit)\b/i,
      /\b(as\s+per\s+code|as\s+per\s+standard)\b/i,
      /\b(acceptable\s+hai\s+ya\s+nahi|chal\s+jayega\s+ya\s+nahi)\b/i
    ],
    weakPatterns: [
      /\b(criteria|requirement|specification)\b/i,
      /\b(allowable|permissible|maximum|minimum)\b/i,
      /\b(tolerance|threshold)\b/i,
      /\b(limit\s+kya\s+hai|kitna\s+allowable)\b/i
    ],
    contextualClues: [
      /\bacceptable\s+(hai|limit|range)\b/i,
      /\brejection\s+(criteria|limit)\b/i,
      /\bas\s+per\s+(code|standard|asme|api)\b/i,
      /\bpass\s+or\s+fail\b/i
    ],
    weight: 32
  },
  
  COMPARISON: {
    strongPatterns: [
      /\b(difference\s+between|farak\s+kya)\b/i,
      /\b(compare|comparison|versus|vs)\b/i,
      /\b(which\s+is\s+better|konsa\s+better)\b/i,
      /\b(advantage|disadvantage|pros\s+and\s+cons)\b/i,
      /\b(konsa\s+best|which\s+one\s+is\s+better)\b/i
    ],
    weakPatterns: [
      /\b(better\s+than|worse\s+than)\b/i,
      /\b(selection\s+criteria|choose|choice)\b/i,
      /\b(preference|prefer)\b/i,
      /\b(best\s+kaun|acha\s+kaun)\b/i
    ],
    contextualClues: [
      /\bdifference\s+between\b/i,
      /\bcompare\s+(with|to)\b/i,
      /\bvs\s+/i,
      /\bkonsa\s+(better|best|acha)\b/i
    ],
    weight: 28
  },
  
  APPLICATION: {
    strongPatterns: [
      /\b(use|usage|application)\b/i,
      /\b(kaha\s+use\s+hota|where\s+used|where\s+is\s+it\s+used)\b/i,
      /\b(purpose|function|role)\b/i,
      /\b(kis\s+liye|kyu\s+use)\b/i,
      /\b(kaha\s+lagta|kaha\s+use\s+karte)\b/i
    ],
    weakPatterns: [
      /\b(practical\s+use|real\s+world\s+use)\b/i,
      /\b(industry\s+use|plant\s+use)\b/i,
      /\b(field\s+use)\b/i,
      /\b(lagta\s+kaha|use\s+hota\s+kaise)\b/i
    ],
    contextualClues: [
      /\bkaha\s+(use|lagta|istemal)\b/i,
      /\bwhere\s+(used|is\s+it\s+used)\b/i,
      /\bused\s+(for|in)\b/i,
      /\bpurpose\s+of\b/i
    ],
    weight: 26
  },
  
  TYPES: {
    strongPatterns: [
      /\b(types|types\s+of|kitne\s+type)\b/i,
      /\b(classification|categories|kinds)\b/i,
      /\b(prakar|kya\s+kya\s+types)\b/i,
      /\b(varieties|how\s+many\s+types)\b/i,
      /\b(kitne\s+prakar|kitni\s+category)\b/i
    ],
    weakPatterns: [
      /\b(category|class)\b/i,
      /\b(variant|version)\b/i,
      /\b(kitne\s+hote|kya\s+kya\s+hote)\b/i
    ],
    contextualClues: [
      /\btypes\s+of\b/i,
      /\bhow\s+many\s+types\b/i,
      /\bkitne\s+(type|prakar)\b/i,
      /\bclassification\s+of\b/i
    ],
    weight: 38
  },
  
  CAUSES: {
    strongPatterns: [
      /\b(reason|cause|causes|why)\b/i,
      /\b(kyu\s+hota|kyun\s+hota|karan)\b/i,
      /\b(why\s+does\s+it\s+happen|root\s+cause)\b/i,
      /\b(wajah|kaaran)\b/i,
      /\b(kyu\s+ho\s+jata|kyun\s+aa\s+jata)\b/i
    ],
    weakPatterns: [
      /\b(because|due\s+to)\b/i,
      /\b(factor|source)\b/i,
      /\b(kaise\s+hota|kaise\s+ho\s+jata)\b/i
    ],
    contextualClues: [
      /\bwhy\s+(does|is)\b/i,
      /\breason\s+(for|of)\b/i,
      /\bkyu\s+(hota|hai)\b/i,
      /\bcause\s+of\b/i
    ],
    weight: 33
  },
  
  SAFETY: {
    strongPatterns: [
      /\b(safety|precaution|risk|hazard)\b/i,
      /\b(danger|safety\s+measure|safety\s+precaution)\b/i,
      /\b(risk\s+involved|precaution\s+lena)\b/i,
      /\b(suraksha|kya\s+risk\s+hai)\b/i
    ],
    weakPatterns: [
      /\b(unsafe|unsafe\s+condition)\b/i,
      /\b(safe\s+practice|safe\s+procedure)\b/i,
      /\b(safety\s+ke\s+liye|risk\s+kya)\b/i
    ],
    contextualClues: [
      /\bsafety\s+(measure|precaution|risk)\b/i,
      /\brisk\s+(involved|hai)\b/i,
      /\bprecaution\s+(lena|kare)\b/i
    ],
    weight: 25
  }
};

/**
 * Detect intent with confidence
 */
export function detectIntentWithConfidence(text) {
  const detectedIntents = [];
  const cleanedText = text.toLowerCase();
  
  for (const [intentName, intentData] of Object.entries(ADVANCED_INTENT_PATTERNS)) {
    let confidence = 0;
    const matches = {
      strong: [],
      weak: [],
      contextual: []
    };
    
    // Check strong patterns (40 points max)
    for (const pattern of intentData.strongPatterns) {
      if (pattern.test(cleanedText)) {
        confidence += 40;
        matches.strong.push(pattern.source);
        break;
      }
    }
    
    // Check weak patterns (20 points max)
    if (confidence === 0) {
      for (const pattern of intentData.weakPatterns) {
        if (pattern.test(cleanedText)) {
          confidence += 20;
          matches.weak.push(pattern.source);
          break;
        }
      }
    }
    
    // Check contextual clues (15 points each, max 30)
    let contextualScore = 0;
    for (const clue of intentData.contextualClues) {
      if (clue.test(cleanedText)) {
        contextualScore += 15;
        matches.contextual.push(clue.source);
        if (contextualScore >= 30) break;
      }
    }
    confidence += Math.min(contextualScore, 30);
    
    if (confidence > 0) {
      const normalizedConfidence = Math.min((confidence / 70) * 100, 100);
      
      detectedIntents.push({
        intent: intentName,
        confidence: Math.round(normalizedConfidence),
        baseWeight: intentData.weight,
        matchType: matches.strong.length > 0 ? 'STRONG' :
                   matches.weak.length > 0 ? 'WEAK' : 'CONTEXTUAL',
        matches: matches,
        confidenceLevel: normalizedConfidence >= 70 ? 'HIGH' :
                        normalizedConfidence >= 40 ? 'MEDIUM' : 'LOW'
      });
    }
  }
  
  detectedIntents.sort((a, b) => b.confidence - a.confidence);
  
  return {
    intents: detectedIntents,
    primaryIntent: detectedIntents[0] || null,
    supportingIntents: detectedIntents.slice(1, 3),
    intentCount: detectedIntents.length
  };
}

/**
 * Resolve intent conflicts
 */
export function resolveIntentConflicts(detectedIntents) {
  if (!detectedIntents || detectedIntents.length === 0) {
    return {
      finalIntent: null,
      supportingIntents: [],
      confidence: 0
    };
  }
  
  // PROBLEM and CAUSES are always supporting
  const filtered = detectedIntents.filter(i => i.intent !== 'PROBLEM' && i.intent !== 'CAUSES');
  const problemIntent = detectedIntents.find(i => i.intent === 'PROBLEM');
  const causesIntent = detectedIntents.find(i => i.intent === 'CAUSES');
  
  // DECISION gets +10 boost
  const boosted = filtered.map(intent => {
    if (intent.intent === 'DECISION') {
      return {
        ...intent,
        confidence: Math.min(intent.confidence + 10, 100)
      };
    }
    return intent;
  });
  
  boosted.sort((a, b) => b.confidence - a.confidence);
  
  const primaryIntent = boosted[0] || detectedIntents[0];
  const supportingIntents = [];
  
  // Add high-confidence supporting intents
  for (let i = 1; i < boosted.length && i < 3; i++) {
    if (boosted[i].confidence >= 40) {
      supportingIntents.push(boosted[i]);
    }
  }
  
  // Always include PROBLEM and CAUSES if detected
  if (problemIntent) {
    supportingIntents.push({ ...problemIntent, role: 'CONTEXT' });
  }
  if (causesIntent) {
    supportingIntents.push({ ...causesIntent, role: 'CONTEXT' });
  }
  
  return {
    finalIntent: primaryIntent,
    supportingIntents: supportingIntents,
    confidence: primaryIntent.confidence,
    intentCombination: [
      primaryIntent.intent,
      ...supportingIntents.map(i => i.intent)
    ].join(' + ')
  };
}
