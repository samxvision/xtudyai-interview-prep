
/**
 * ===========================================
 * LAYER 4: CONTEXT DETECTION
 * ===========================================
 */

const CONTEXT_PATTERNS = {
  IF_DAMAGED: {
    patterns: [
      /\b(agar\s+kharab|if\s+damaged|if\s+broken)\b/i,
      /\b(agar\s+damage|agar\s+fail|if\s+fail)\b/i,
      /\b(kharab\s+ho\s+jaye|damage\s+ho\s+jaye)\b/i,
      /\b(fail\s+ho\s+jaye)\b/i
    ],
    modifier: "CONDITIONAL_DAMAGE"
  },
  
  IF_LEAK: {
    patterns: [
      /\b(agar\s+leak|if\s+leak|if\s+leaking)\b/i,
      /\b(leak\s+ho\s+jaye|leakage\s+ho)\b/i,
      /\b(leak\s+aa\s+jaye|leak\s+aa\s+gaya)\b/i
    ],
    modifier: "CONDITIONAL_LEAK"
  },
  
  IF_CRACK: {
    patterns: [
      /\b(agar\s+crack|if\s+crack)\b/i,
      /\b(crack\s+aa\s+jaye|crack\s+ho\s+jaye)\b/i,
      /\b(crack\s+dikhe)\b/i
    ],
    modifier: "CONDITIONAL_CRACK"
  },
  
  DURING_OPERATION: {
    patterns: [
      /\b(operation\s+mein|during\s+operation)\b/i,
      /\b(running\s+mein|during\s+running)\b/i,
      /\b(chalne\s+par|chalte\s+samay)\b/i,
      /\b(service\s+mein|in\s+service)\b/i
    ],
    modifier: "DURING_OPERATION"
  },
  
  DURING_SHUTDOWN: {
    patterns: [
      /\b(shutdown\s+mein|during\s+shutdown)\b/i,
      /\b(turnaround\s+mein|ta\s+mein)\b/i,
      /\b(outage\s+mein|plant\s+shutdown)\b/i,
      /\b(band\s+hone\s+par)\b/i
    ],
    modifier: "DURING_SHUTDOWN"
  },
  
  BEFORE_INSTALL: {
    patterns: [
      /\b(installation\s+se\s+pehle|before\s+installation)\b/i,
      /\b(lagane\s+se\s+pehle|before\s+fitting)\b/i,
      /\b(assembly\s+se\s+pehle)\b/i
    ],
    modifier: "BEFORE_INSTALLATION"
  },
  
  AFTER_INSTALL: {
    patterns: [
      /\b(installation\s+ke\s+baad|after\s+installation)\b/i,
      /\b(lagane\s+ke\s+baad|after\s+fitting)\b/i,
      /\b(assembly\s+ke\s+baad)\b/i
    ],
    modifier: "AFTER_INSTALLATION"
  },
  
  PRE_CLEANING: {
    patterns: [
      /\b(pre\s+cleaning|cleaning\s+se\s+pehle)\b/i,
      /\b(before\s+cleaning|saaf\s+karne\s+se\s+pehle)\b/i
    ],
    modifier: "PRE_CLEANING"
  },
  
  POST_CLEANING: {
    patterns: [
      /\b(post\s+cleaning|cleaning\s+ke\s+baad)\b/i,
      /\b(after\s+cleaning|saaf\s+karne\s+ke\s+baad)\b/i
    ],
    modifier: "POST_CLEANING"
  },
  
  WHEN_NEW: {
    patterns: [
      /\b(naya|new|fresh)\b/i,
      /\b(first\s+time|pehli\s+baar)\b/i,
      /\b(commissioning\s+time)\b/i
    ],
    modifier: "WHEN_NEW"
  },
  
  WHEN_OLD: {
    patterns: [
      /\b(purana|old|aged)\b/i,
      /\b(long\s+service|bahut\s+time\s+se)\b/i,
      /\b(deteriorated)\b/i
    ],
    modifier: "WHEN_OLD"
  },
  
  REGULAR: {
    patterns: [
      /\b(regular|routine|daily)\b/i,
      /\b(har\s+baar|har\s+din|regular)\b/i,
      /\b(normally|usually)\b/i
    ],
    modifier: "REGULAR_CHECK"
  },
  
  FIRST_TIME: {
    patterns: [
      /\b(first\s+time|pehli\s+baar)\b/i,
      /\b(initially|pehle)\b/i,
      /\b(baseline)\b/i
    ],
    modifier: "FIRST_TIME"
  }
};

/**
 * Detect context from text
 */
export function detectContext(text) {
  const cleanedText = text.toLowerCase();
  const detectedContexts = [];
  
  for (const [contextName, contextData] of Object.entries(CONTEXT_PATTERNS)) {
    for (const pattern of contextData.patterns) {
      if (pattern.test(cleanedText)) {
        detectedContexts.push({
          context: contextName,
          modifier: contextData.modifier,
          matchedPattern: pattern.source
        });
        break;
      }
    }
  }
  
  return detectedContexts;
}
