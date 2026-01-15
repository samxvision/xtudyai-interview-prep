
/**
 * ===========================================
 * LAYER 1: ADVANCED NOISE REMOVAL & QUERY EXPANSION
 * ===========================================
 */

const DEEP_NOISE_PATTERNS = {
  metaTalk: [
    /tumne\s+(.+?)\s+(dekha|dekhaa|dekhi|suna|sunaa|kiya|padha|padhaa)\s+(hai|ho|tha)/gi,
    /aapne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho)/gi,
    /maine\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|tha)/gi,
    /mujhe\s+samajh\s+nahi\s+aa\s+raha/gi,
    /mujhe\s+samjh\s+nahi\s+aaya/gi,
    /samajh\s+me\s+nahi\s+aa\s+raha/gi,
    /interview\s+me\s+(poocha|pucha|aaya|question)/gi,
    /viva\s+me\s+poocha/gi,
    /exam\s+me\s+(aaya|tha)/gi,
    /koi\s+bata\s+sakta\s+hai/gi,
    /kya\s+aap\s+bata\s+sakte/gi,
    /agar\s+pata\s+ho\s+toh/gi,
    /thoda\s+help\s+karo/gi,
    /help\s+chahiye/gi
  ],
  
  conversationalStarters: [
    /tum\s+mujhe\s+(ab|abhi|jaldi|please|zara|thoda)?\s*/gi,
    /tum\s+hamko\s+(ab|abhi)?\s*/gi,
    /tum\s+batao\s+(ki|ke|yaar|bhai)?\s*/gi,
    /tum\s+bataiye\s+(ki|ke)?\s*/gi,
    /aap\s+mujhe\s+(ab|abhi|please|kripya)?\s*/gi,
    /aap\s+bataiye\s+(ki|ke|na)?\s*/gi,
    /mujhe\s+(ab|abhi|jaldi|please|zara)?\s+batao/gi,
    /mujhe\s+bataiye/gi,
    /mujhe\s+samjhao/gi,
    /mujhe\s+janna\s+hai\s+(ki|ke)?\s*/gi,
    /please\s+(tell|explain|describe|help)/gi,
    /can\s+you\s+(tell|explain|describe|help)/gi,
    /could\s+you\s+(tell|explain|describe)/gi,
    /i\s+want\s+to\s+know/gi,
    /i\s+need\s+to\s+know/gi,
    /batao\s+(ki|ke|yaar|bhai|na)?\s*/gi,
    /bataiye\s+(ki|ke|na)?\s*/gi,
    /yeah\s+batao/gi,
    /ye\s+batao/gi,
    /yeh\s+batao/gi,
    /^(toh|to|so|well|ok|okay|accha|achha|thik\s+hai)\s+/gi,
    /^(listen|suno|dekho|dekhiye)\s+/gi,
    /^(arre|yaar|bhai|sir|madam)\s+/gi
  ],
  
  questionAboutQuestion: [
    /iska\s+matlab\s+(kya\s+hai|batao|bataiye)/gi,
    /ka\s+kya\s+matlab\s+(hai|hota|batao)/gi,
    /ka\s+matlab\s+(kya|batao)/gi,
    /explain\s+karo/gi,
    /samjhao\s+(na|yaar|bhai)?\s*/gi,
    /definition\s+(do|batao)/gi,
    /define\s+karo/gi,
    /brief\s+me\s+batao/gi,
    /detail\s+me\s+batao/gi,
    /clearly\s+batao/gi,
    /ache\s+se\s+samjhao/gi
  ],
  
  pureFillers: [
    /\b(yaar|bhai|dost|sir|madam|ji)\b/gi,
    /\b(accha|achha|acha|theek|thik|ok|okay|okie)\b/gi,
    /\b(haan|han|nahi|nhi|na)\b/gi,
    /\b(arre|are|arey)\b/gi,
    /\b(dekho|dekhiye|suno|suniye|sunno)\b/gi,
    /\b(well|so|like|actually|basically|technically)\b/gi,
    /\b(you\s+know|i\s+mean|as\s+such)\b/gi,
    /\b(uh|uhh|um|umm|hmm|hmmm|ah|ahh|oh|ohh|err)\b/gi,
    /\b(jaldi|quickly|fast|abhi|ab|now|immediately)\b/gi,
    /\b(zara|thoda|little\s+bit|just)\b/gi
  ],
  
  politeness: [
    /\b(please|pls|kindly|kripya|kripaya)\b/gi,
    /\b(thanks|thank\s+you|dhanyavaad|shukriya)\b/gi,
    /\b(sorry|excuse\s+me|maaf\s+karo)\b/gi
  ],
  
  stepByStepRequests: [
    /step\s+by\s+step/gi,
    /step\s+wise/gi,
    /ek\s+ek\s+karke/gi,
    /sabse\s+pehle/gi,
    /first\s+to\s+last/gi,
    /puri\s+process/gi,
    /complete\s+process/gi,
    /detail\s+me/gi
  ]
};

/**
 * Deep clean user query
 */
export function deepClean(text) {
  let cleaned = text.toLowerCase().trim();
  
  // Special case extractions
  const metaMatch = cleaned.match(
    /(?:tumne|aapne|maine)\s+(.+?)\s+(?:dekha|suna|kiya|padha)\s+(?:hai|ho|tha)(.+?)(?:uska|iska)\s+(kaam|matlab|definition|working)/i
  );
  
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
  
  const conditionalMatch = cleaned.match(/agar\s+(.+?)\s+ho\s+jaye\s+to\s+(.+)/i);
  if (conditionalMatch) {
    const condition = conditionalMatch[1].trim();
    const action = conditionalMatch[2].trim();
    cleaned = `${condition} ${action}`;
  }
  
  // Remove all noise patterns
  const orderedPatterns = [
    ...DEEP_NOISE_PATTERNS.conversationalStarters,
    ...DEEP_NOISE_PATTERNS.metaTalk,
    ...DEEP_NOISE_PATTERNS.questionAboutQuestion,
    ...DEEP_NOISE_PATTERNS.stepByStepRequests,
    ...DEEP_NOISE_PATTERNS.politeness,
    ...DEEP_NOISE_PATTERNS.pureFillers
  ];
  
  for (const pattern of orderedPatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  
  // Clean punctuation and spaces
  cleaned = cleaned
    .replace(/[?!.,;:"'\(\)\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
}

/**
 * Query expansion map
 */
const QUERY_EXPANSION_MAP = {
  partialEntityExpansion: {
    "exchanger": {
      expansions: ["heat exchanger", "exchanger"],
      condition: "ALWAYS"
    },
    "vessel": {
      expansions: ["pressure vessel", "vessel"],
      condition: "ALWAYS"
    },
    "heat": {
      expansions: ["heat"],
      condition: "NEVER"
    },
    "pressure": {
      expansions: ["pressure"],
      condition: "NEVER"
    },
    "tube": {
      expansions: ["tube"],
      condition: "CHECK_ADJACENT",
      adjacentWords: ["bundle", "sheet", "side"],
      expandTo: {
        "bundle": "tube bundle",
        "sheet": "tube sheet",
        "side": "tube side"
      }
    },
    "dpt": {
      expansions: ["dye penetrant test", "liquid penetrant test", "dpt", "pt"],
      condition: "ALWAYS"
    },
    "pt": {
      expansions: ["penetrant test", "dye penetrant test", "pt"],
      condition: "CHECK_CONTEXT",
      contextWords: ["dye", "liquid", "ndt", "test", "testing"]
    },
    "mt": {
      expansions: ["magnetic particle test", "magnetic particle testing", "mt"],
      condition: "ALWAYS"
    },
    "mpt": {
      expansions: ["magnetic particle test", "magnetic particle testing", "mpt", "mt"],
      condition: "ALWAYS"
    },
    "ut": {
      expansions: ["ultrasonic testing", "ultrasonic test", "ut"],
      condition: "ALWAYS"
    },
    "rt": {
      expansions: ["radiography test", "radiographic testing", "rt"],
      condition: "CHECK_CONTEXT",
      contextWords: ["x-ray", "gamma", "ndt", "test"]
    },
    "vt": {
      expansions: ["visual testing", "visual inspection", "vt", "vi"],
      condition: "ALWAYS"
    },
    "vi": {
      expansions: ["visual inspection", "visual testing", "vi", "vt"],
      condition: "ALWAYS"
    },
    "ndt": {
      expansions: ["non destructive testing", "ndt"],
      condition: "ALWAYS"
    },
    "hx": {
      expansions: ["heat exchanger", "hx"],
      condition: "ALWAYS"
    },
    "he": {
      expansions: ["heat exchanger", "he"],
      condition: "ALWAYS"
    },
    "pv": {
      expansions: ["pressure vessel", "pv"],
      condition: "ALWAYS"
    },
    "sthe": {
      expansions: ["shell and tube heat exchanger", "sthe"],
      condition: "ALWAYS"
    },
    "ache": {
      expansions: ["air cooled heat exchanger", "ache", "air cooler"],
      condition: "ALWAYS"
    },
    "wps": {
      expansions: ["welding procedure specification", "wps"],
      condition: "ALWAYS"
    },
    "pqr": {
      expansions: ["procedure qualification record", "pqr"],
      condition: "ALWAYS"
    },
    "mtc": {
      expansions: ["material test certificate", "mtc"],
      condition: "ALWAYS"
    },
    "itp": {
      expansions: ["inspection and test plan", "itp"],
      condition: "ALWAYS"
    },
    "ncr": {
      expansions: ["non conformance report", "ncr"],
      condition: "ALWAYS"
    },
    "flange": {
      expansions: ["flange"],
      condition: "CHECK_ADJACENT",
      adjacentWords: ["face", "joint", "gasket", "bolt"],
      expandTo: {
        "face": "flange face",
        "joint": "flange joint",
        "gasket": "flange gasket",
        "bolt": "flange bolt"
      }
    },
    "column": {
      expansions: ["distillation column", "column", "tower"],
      condition: "ALWAYS"
    },
    "tower": {
      expansions: ["distillation column", "tower", "column"],
      condition: "ALWAYS"
    },
    "inspection": {
      expansions: ["inspection"],
      condition: "CHECK_ADJACENT",
      adjacentWords: ["visual", "internal", "external", "pre", "post"],
      expandTo: {
        "visual": "visual inspection",
        "internal": "internal inspection",
        "external": "external inspection",
        "pre": "pre inspection",
        "post": "post inspection"
      }
    }
  },
  
  intentExpansion: {
    "matlab": ["kya hai", "kya hota hai", "definition", "meaning", "what is"],
    "meaning": ["kya hai", "definition", "matlab", "what is"],
    "definition": ["kya hai", "what is", "meaning", "matlab"],
    "define": ["kya hai", "definition", "what is"],
    "kaam": ["working", "function", "operation", "kaise kaam karta"],
    "working": ["kaam", "function", "operation"],
    "function": ["kaam", "working", "operation"],
    "operation": ["working", "function", "kaam"],
    "procedure": ["kaise kare", "method", "steps", "process", "tarika"],
    "method": ["procedure", "kaise kare", "steps", "tarika"],
    "process": ["procedure", "method", "steps"],
    "tarika": ["procedure", "method", "kaise kare"],
    "steps": ["procedure", "method", "kaise kare"],
    "explain": ["kya hai", "definition", "samjhao", "bataiye"],
    "samjhao": ["explain", "kya hai", "bataiye"],
    "describe": ["explain", "bataiye", "definition"],
    "check": ["inspection", "verify", "examine", "dekhna"],
    "inspect": ["check", "examine", "dekhna"],
    "dekhna": ["check", "inspect", "examine"],
    "repair": ["thik kare", "fix", "rectify"],
    "fix": ["repair", "thik kare"],
    "thik": ["repair", "fix"],
    "identify": ["pehchan", "kaise pata", "detect"],
    "pehchan": ["identify", "kaise pata"],
    "detect": ["identify", "pehchan", "kaise pata"]
  }
};

/**
 * Intelligent expansion
 */
export function intelligentExpansion(cleaned) {
  const words = cleaned.split(' ');
  const expansions = [cleaned];
  
  // Entity expansion
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const entityConfig = QUERY_EXPANSION_MAP.partialEntityExpansion[word];
    
    if (!entityConfig) continue;
    
    if (entityConfig.condition === "NEVER") {
      continue;
    }
    
    if (entityConfig.condition === "ALWAYS") {
      for (const expanded of entityConfig.expansions) {
        if (expanded !== word) {
          const newQuery = words.slice();
          newQuery[i] = expanded;
          expansions.push(newQuery.join(' '));
        }
      }
    }
    
    if (entityConfig.condition === "CHECK_ADJACENT") {
      const prevWord = i > 0 ? words[i - 1] : null;
      const nextWord = i < words.length - 1 ? words[i + 1] : null;
      
      if (prevWord && entityConfig.adjacentWords?.includes(prevWord)) {
        const expandTo = entityConfig.expandTo[prevWord];
        if (expandTo) {
          const newQuery = words.slice();
          newQuery[i - 1] = expandTo;
          newQuery.splice(i, 1);
          expansions.push(newQuery.join(' '));
        }
      }
      
      if (nextWord && entityConfig.adjacentWords?.includes(nextWord)) {
        const expandTo = entityConfig.expandTo[nextWord];
        if (expandTo) {
          const newQuery = words.slice();
          newQuery[i] = expandTo;
          newQuery.splice(i + 1, 1);
          expansions.push(newQuery.join(' '));
        }
      }
    }
    
    if (entityConfig.condition === "CHECK_CONTEXT") {
      const hasContext = entityConfig.contextWords?.some(ctx => 
        cleaned.includes(ctx)
      );
      
      if (hasContext) {
        for (const expanded of entityConfig.expansions) {
          if (expanded !== word) {
            const newQuery = words.slice();
            newQuery[i] = expanded;
            expansions.push(newQuery.join(' '));
          }
        }
      }
    }
  }
  
  // Intent expansion
  for (const word of words) {
    if (QUERY_EXPANSION_MAP.intentExpansion[word]) {
      const expandedIntents = QUERY_EXPANSION_MAP.intentExpansion[word];
      
      for (const expanded of expandedIntents) {
        const newQuery = cleaned.replace(word, expanded);
        if (newQuery !== cleaned) {
          expansions.push(newQuery);
        }
      }
    }
  }
  
  return {
    expansions: [...new Set(expansions)],
    originalQuery: cleaned
  };
}
