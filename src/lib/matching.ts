// @ts-nocheck

const DEEP_NOISE_PATTERNS = {
  // ============================================
  // META CONVERSATION (about the conversation)
  // ============================================
  metaTalk: [
    // "Tumne X dekha/suna/kiya hai" patterns
    /tumne\s+(.+?)\s+(dekha|dekhaa|dekhi|suna|sunaa|kiya|padha|padhaa)\s+(hai|ho|tha)/gi,
    /aapne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho)/gi,
    /maine\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|tha)/gi,
    
    // "Mujhe samajh nahi aa raha" type
    /mujhe\s+samajh\s+nahi\s+aa\s+raha/gi,
    /mujhe\s+samjh\s+nahi\s+aaya/gi,
    /samajh\s+me\s+nahi\s+aa\s+raha/gi,
    /samjh\s+nahi\s+aati/gi,
    
    // Interview context
    /interview\s+me\s+(poocha|pucha|aaya|question)/gi,
    /interview\s+question\s+(hai|tha)/gi,
    /viva\s+me\s+poocha/gi,
    /exam\s+me\s+(aaya|tha)/gi,
    
    // Permission/request patterns
    /koi\s+bata\s+sakta\s+hai/gi,
    /kya\s+aap\s+bata\s+sakte/gi,
    /agar\s+pata\s+ho\s+toh/gi,
    /agar\s+aapko\s+pata\s+hai/gi,
    /thoda\s+help\s+karo/gi,
    /help\s+chahiye/gi
  ],
  
  // ============================================
  // CONVERSATIONAL STARTERS (Before main question)
  // ============================================
  conversationalStarters: [
    // "Tum mujhe" type
    /tum\s+mujhe\s+(ab|abhi|jaldi|please|zara|thoda)?\s*/gi,
    /tum\s+hamko\s+(ab|abhi)?\s*/gi,
    /tum\s+batao\s+(ki|ke|yaar|bhai)?\s*/gi,
    /tum\s+bataiye\s+(ki|ke)?\s*/gi,
    /tum\s+mujhe\s+(ab|abhi)?\s+(yeah|ye|yeh)?\s+batao/gi,
    /tum\s+mujhe\s+ab\s+batao/gi,
    /tum\s+ab\s+batao/gi,
    
    // "Aap mujhe" type
    /aap\s+mujhe\s+(ab|abhi|please|kripya)?\s*/gi,
    /aap\s+bataiye\s+(ki|ke|na)?\s*/gi,
    /aap\s+batao\s+(ki|ke)?\s*/gi,
    /aapko\s+pata\s+hai\s+toh\s+batao/gi,
    
    // "Mujhe X batao" type
    /mujhe\s+(ab|abhi|jaldi|please|zara)?\s+batao/gi,
    /mujhe\s+bataiye/gi,
    /mujhe\s+samjhao/gi,
    /mujhe\s+samjhaiye/gi,
    /mujhe\s+janna\s+hai\s+(ki|ke)?\s*/gi,
    /mujhe\s+pata\s+karna\s+hai/gi,
    /mujhe\s+chahiye/gi,
    
    // "Please tell" type
    /please\s+(tell|explain|describe|help)/gi,
    /kindly\s+(tell|explain|describe)/gi,
    /can\s+you\s+(tell|explain|describe|help)/gi,
    /could\s+you\s+(tell|explain|describe)/gi,
    /would\s+you\s+(tell|explain|describe)/gi,
    /will\s+you\s+(tell|explain|describe)/gi,
    
    // "I want to know" type
    /i\s+want\s+to\s+know/gi,
    /i\s+wanna\s+know/gi,
    /i\s+need\s+to\s+know/gi,
    /i\s+would\s+like\s+to\s+know/gi,
    /i'd\s+like\s+to\s+know/gi,
    
    // "Batao ki" type
    /batao\s+(ki|ke|yaar|bhai|na)?\s*/gi,
    /bataiye\s+(ki|ke|na)?\s*/gi,
    /bata\s+do\s+(ki|ke)?\s*/gi,
    /bata\s+dijiye\s+(ki|ke)?\s*/gi,
    
    // "Yeah/Ye batao" type
    /yeah\s+batao/gi,
    /ye\s+batao/gi,
    /yeh\s+batao/gi,
    /iska\s+batao/gi,
    /uska\s+batao/gi,
    /iske\s+baare\s+me\s+batao/gi,
    
    // Starting words
    /^(toh|to|so|well|ok|okay|accha|achha|thik\s+hai)\s+/gi,
    /^(listen|suno|dekho|dekhiye)\s+/gi,
    /^(arre|yaar|bhai|sir|madam)\s+/gi
  ],
  
  // ============================================
  // QUESTION ABOUT QUESTION
  // ============================================
  questionAboutQuestion: [
    /iska\s+matlab\s+(kya\s+hai|batao|bataiye)/gi,
    /ka\s+kya\s+matlab\s+(hai|hota|batao)/gi,
    /ka\s+matlab\s+(kya|batao)/gi,
    /explain\s+karo/gi,
    /explain\s+kijiye/gi,
    /samjhao\s+(na|yaar|bhai)?\s*/gi,
    /samjhaiye\s+(na)?\s*/gi,
    /definition\s+do/gi,
    /definition\s+batao/gi,
    /define\s+karo/gi,
    /define\s+kijiye/gi,
    /brief\s+me\s+batao/gi,
    /detail\s+me\s+batao/gi,
    /thoda\s+explain\s+karo/gi,
    /clearly\s+batao/gi,
    /ache\s+se\s+samjhao/gi,
    /properly\s+explain/gi
  ],
  
  // ============================================
  // PURE FILLER SENTENCES
  // ============================================
  pureFillers: [
    // Hinglish fillers
    /\b(yaar|bhai|dost|sir|madam|ji)\b/gi,
    /\b(accha|achha|acha|theek|thik|ok|okay|okie)\b/gi,
    /\b(haan|han|nahi|nhi|na)\b/gi,
    /\b(arre|are|arey)\b/gi,
    /\b(dekho|dekhiye|suno|suniye|sunno)\b/gi,
    
    // English fillers
    /\b(well|so|like|actually|basically|technically)\b/gi,
    /\b(you\s+know|i\s+mean|as\s+such)\b/gi,
    /\b(right|correct|exactly)\b/gi,
    
    // Hesitation
    /\b(uh|uhh|um|umm|hmm|hmmm|ah|ahh|oh|ohh|err)\b/gi,
    
    // Time/urgency fillers
    /\b(jaldi|quickly|fast|abhi|ab|now|immediately)\b/gi,
    /\b(zara|thoda|little\s+bit|just)\b/gi
  ],
  
  // ============================================
  // POLITENESS MARKERS
  // ============================================
  politeness: [
    /\b(please|pls|kindly|kripya|kripaya)\b/gi,
    /\b(thanks|thank\s+you|dhanyavaad|shukriya)\b/gi,
    /\b(sorry|excuse\s+me|maaf\s+karo)\b/gi
  ],
  
  // ============================================
  // STEP-BY-STEP REQUEST PATTERNS
  // ============================================
  stepByStepRequests: [
    /step\s+by\s+step/gi,
    /step\s+wise/gi,
    /ek\s+ek\s+karke/gi,
    /sabse\s+pehle/gi,
    /first\s+to\s+last/gi,
    /start\s+se\s+end\s+tak/gi,
    /puri\s+process/gi,
    /complete\s+process/gi,
    /detail\s+me/gi,
    /detailed/gi
  ]
}

function deepClean(text) {
  let cleaned = text.toLowerCase().trim()
  
  // ============================================
  // SPECIAL CASE 1: Extract entity from meta talk
  // ============================================
  // Pattern: "tumne X dekha hai uska/iska kaam/matlab kya hota"
  const metaMatch = cleaned.match(
    /(?:tumne|aapne|maine)\s+(.+?)\s+(?:dekha|dekhaa|suna|kiya|padha)\s+(?:hai|ho|tha)(.+?)(?:uska|iska|us\s+ka|is\s+ka)\s+(kaam|matlab|definition|working|function|use|application)\s+(?:kya|kaise)/i
  )
  
  if (metaMatch) {
    const entity = metaMatch[1].trim()
    const property = metaMatch[3].trim()
    cleaned = `${entity} ${property} kya hota`
  }
  
  // ============================================
  // SPECIAL CASE 2: "Mujhe janna hai ki X"
  // ============================================
  const jannaMatch = cleaned.match(/mujhe\s+janna\s+hai\s+ki\s+(.+)/i)
  if (jannaMatch) {
    cleaned = jannaMatch[1].trim()
  }
  
  // ============================================
  // SPECIAL CASE 3: "Tum mujhe ab ye batao ki X"
  // ============================================
  const bataoMatch = cleaned.match(/(?:tum|aap)\s+mujhe\s+(?:ab|abhi)?\s*(?:ye|yeh|yeah)?\s*batao\s+ki\s+(.+)/i)
  if (bataoMatch) {
    cleaned = bataoMatch[1].trim()
  }
  
  // ============================================
  // Remove all noise patterns in order
  // ============================================
  const orderedPatterns = [
    ...DEEP_NOISE_PATTERNS.conversationalStarters,
    ...DEEP_NOISE_PATTERNS.metaTalk,
    ...DEEP_NOISE_PATTERNS.questionAboutQuestion,
    ...DEEP_NOISE_PATTERNS.stepByStepRequests,
    ...DEEP_NOISE_PATTERNS.politeness,
    ...DEEP_NOISE_PATTERNS.pureFillers
  ]
  
  for (const pattern of orderedPatterns) {
    cleaned = cleaned.replace(pattern, ' ')
  }
  
  // ============================================
  // Clean up punctuation and spaces
  // ============================================
  cleaned = cleaned
    .replace(/[?!.,;:"'\(\)\[\]{}]/g, ' ')  // Remove punctuation
    .replace(/\s+/g, ' ')                    // Multiple spaces to single
    .trim()
  
  return cleaned
}

const QUERY_EXPANSION_MAP = {
  // ============================================
  // ENTITY EXPANSION (Context-Aware)
  // ============================================
  partialEntityExpansion: {
    // RULE: Only expand if context suggests the full entity
    
    // "exchanger" alone → likely means heat exchanger
    "exchanger": {
      expansions: ["heat exchanger", "exchanger"],
      confidence: "HIGH",
      condition: "ALWAYS"  // Always expand
    },
    
    // "vessel" alone → likely means pressure vessel
    "vessel": {
      expansions: ["pressure vessel", "vessel"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    
    // "heat" alone → DON'T expand (could mean temperature)
    "heat": {
      expansions: ["heat"],  // NO expansion
      confidence: "LOW",
      condition: "NEVER",
      note: "Could mean temperature, thermal energy, etc."
    },
    
    // "pressure" alone → DON'T expand (could mean pressure measurement)
    "pressure": {
      expansions: ["pressure"],  // NO expansion
      confidence: "LOW",
      condition: "NEVER",
      note: "Could mean pressure value, pressure test, etc."
    },
    
    // "tube" with "bundle" → tube bundle
    "tube": {
      expansions: ["tube"],
      confidence: "MEDIUM",
      condition: "CHECK_ADJACENT",
      adjacentWords: ["bundle", "sheet", "side"],
      expandTo: {
        "bundle": "tube bundle",
        "sheet": "tube sheet",
        "side": "tube side"
      }
    },
    
    // Abbreviations → Always expand
    "hx": {
      expansions: ["heat exchanger", "hx"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "he": {
      expansions: ["heat exchanger", "he"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    
    "pv": {
      expansions: ["pressure vessel", "pv"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    // NDT abbreviations → Always expand
    "dpt": {
      expansions: ["dye penetrant test", "liquid penetrant test", "dpt", "pt"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "pt": {
      expansions: ["penetrant test", "dye penetrant test", "pt"],
      confidence: "HIGH",
      condition: "CHECK_CONTEXT",
      contextWords: ["dye", "liquid", "ndt", "test", "testing"]
    },
    
    "mt": {
      expansions: ["magnetic particle test", "magnetic particle testing", "mt"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "mpt": {
      expansions: ["magnetic particle test", "magnetic particle testing", "mpt", "mt"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "ut": {
      expansions: ["ultrasonic testing", "ultrasonic test", "ut"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "rt": {
      expansions: ["radiography test", "radiographic testing", "rt"],
      confidence: "HIGH",
      condition: "CHECK_CONTEXT",
      contextWords: ["x-ray", "gamma", "ndt", "test"]
    },
    
    "vt": {
      expansions: ["visual testing", "visual inspection", "vt", "vi"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "vi": {
      expansions: ["visual inspection", "visual testing", "vi", "vt"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    "ndt": {
      expansions: ["non destructive testing", "ndt"],
      confidence: "VERY_HIGH",
      condition: "ALWAYS"
    },
    
    // Flange components
    "flange": {
      expansions: ["flange"],
      confidence: "MEDIUM",
      condition: "CHECK_ADJACENT",
      adjacentWords: ["face", "joint", "gasket", "bolt"],
      expandTo: {
        "face": "flange face",
        "joint": "flange joint",
        "gasket": "flange gasket",
        "bolt": "flange bolt"
      }
    },
    
    // Column/Tower
    "column": {
      expansions: ["distillation column", "column", "tower"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    
    "tower": {
      expansions: ["distillation column", "tower", "column"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    
    // Inspection types
    "inspection": {
      expansions: ["inspection"],
      confidence: "HIGH",
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
  
  // ============================================
  // INTENT WORD EXPANSION
  // ============================================
  intentExpansion: {
    // Definition intents
    "matlab": ["kya hai", "kya hota hai", "definition", "meaning", "what is"],
    "meaning": ["kya hai", "definition", "matlab", "what is"],
    "definition": ["kya hai", "what is", "meaning", "matlab"],
    "define": ["kya hai", "definition", "what is"],
    
    // Working/Function intents
    "kaam": ["working", "function", "operation", "kaise kaam karta", "kaise kaam karti"],
    "working": ["kaam", "function", "operation", "kaise kaam karta"],
    "function": ["kaam", "working", "operation"],
    "operation": ["working", "function", "kaam"],
    
    // Procedure intents
    "procedure": ["kaise kare", "method", "steps", "process", "tarika"],
    "method": ["procedure", "kaise kare", "steps", "tarika"],
    "process": ["procedure", "method", "steps"],
    "tarika": ["procedure", "method", "kaise kare"],
    "steps": ["procedure", "method", "kaise kare"],
    
    // Explanation intents
    "explain": ["kya hai", "definition", "samjhao", "bataiye"],
    "samjhao": ["explain", "kya hai", "bataiye"],
    "describe": ["explain", "bataiye", "definition"],
    
    // Inspection/Check intents
    "check": ["inspection", "verify", "examine", "dekhna"],
    "inspect": ["check", "examine", "dekhna"],
    "dekhna": ["check", "inspect", "examine"],
    
    // Repair intents
    "repair": ["thik kare", "fix", "rectify"],
    "fix": ["repair", "thik kare"],
    "thik": ["repair", "fix"],
    
    // Identification intents
    "identify": ["pehchan", "kaise pata", "detect"],
    "pehchan": ["identify", "kaise pata"],
    "detect": ["identify", "pehchan", "kaise pata"]
  }
}

function intelligentExpansion(cleaned) {
  const words = cleaned.split(' ')
  const expansions = [cleaned]
  let expansionLog = []
  
  // ============================================
  // STEP 1: Entity Expansion (Context-Aware)
  // ============================================
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const entityConfig = QUERY_EXPANSION_MAP.partialEntityExpansion[word]
    
    if (!entityConfig) continue
    
    // Check expansion condition
    if (entityConfig.condition === "NEVER") {
      // Don't expand
      expansionLog.push(`❌ Skipped "${word}" (could be ambiguous)`)
      continue
    }
    
    if (entityConfig.condition === "ALWAYS") {
      // Always expand
      for (const expanded of entityConfig.expansions) {
        if (expanded !== word) {
          const newQuery = words.slice()
          newQuery[i] = expanded
          expansions.push(newQuery.join(' '))
          expansionLog.push(`✅ Expanded "${word}" → "${expanded}"`)
        }
      }
    }
    
    if (entityConfig.condition === "CHECK_ADJACENT") {
      // Check adjacent words
      const prevWord = i > 0 ? words[i - 1] : null
      const nextWord = i < words.length - 1 ? words[i + 1] : null
      
      let expanded = false
      
      // Check previous word
      if (prevWord && entityConfig.adjacentWords?.includes(prevWord)) {
        const expandTo = entityConfig.expandTo[prevWord]
        if (expandTo) {
          const newQuery = words.slice()
          newQuery[i - 1] = expandTo
          newQuery.splice(i, 1) // Remove current word
          expansions.push(newQuery.join(' '))
          expansionLog.push(`✅ Combined "${prevWord} ${word}" → "${expandTo}"`)
          expanded = true
        }
      }
      
      // Check next word
      if (nextWord && entityConfig.adjacentWords?.includes(nextWord)) {
        const expandTo = entityConfig.expandTo[nextWord]
        if (expandTo) {
          const newQuery = words.slice()
          newQuery[i] = expandTo
          newQuery.splice(i + 1, 1) // Remove next word
          expansions.push(newQuery.join(' '))
          expansionLog.push(`✅ Combined "${word} ${nextWord}" → "${expandTo}"`)
          expanded = true
        }
      }
      
      if (!expanded) {
        expansionLog.push(`⚠️ "${word}" needs adjacent context - no expansion`)
      }
    }
    
    if (entityConfig.condition === "CHECK_CONTEXT") {
      // Check if context words present
      const hasContext = entityConfig.contextWords?.some(ctx => 
        cleaned.includes(ctx)
      )
      
      if (hasContext) {
        for (const expanded of entityConfig.expansions) {
          if (expanded !== word) {
            const newQuery = words.slice()
            newQuery[i] = expanded
            expansions.push(newQuery.join(' '))
            expansionLog.push(`✅ Expanded "${word}" → "${expanded}" (context found)`)
          }
        }
      } else {
        expansionLog.push(`⚠️ "${word}" needs context - no expansion`)
      }
    }
  }
  
  // ============================================
  // STEP 2: Intent Expansion
  // ============================================
  for (const word of words) {
    if (QUERY_EXPANSION_MAP.intentExpansion[word]) {
      const expandedIntents = QUERY_EXPANSION_MAP.intentExpansion[word]
      
      for (const expanded of expandedIntents) {
        const newQuery = cleaned.replace(word, expanded)
        if (newQuery !== cleaned) {
          expansions.push(newQuery)
          expansionLog.push(`📝 Intent "${word}" → "${expanded}"`)
        }
      }
    }
  }
  
  // Remove duplicates
  const uniqueExpansions = [...new Set(expansions)]
  
  return {
    expansions: uniqueExpansions,
    log: expansionLog,
    originalQuery: cleaned
  }
}

function layer1Processing(userQuery) {
  console.log('🔍 Original Query:', userQuery)
  
  // Phase 1A: Deep Clean
  const cleaned = deepClean(userQuery)
  console.log('🧹 After Cleaning:', cleaned)
  
  // Phase 1B: Intelligent Expansion
  const expansionResult = intelligentExpansion(cleaned)
  console.log('🔄 Expansions:', expansionResult.expansions)
  console.log('📋 Expansion Log:', expansionResult.log)
  
  return {
    original: userQuery,
    cleaned: cleaned,
    expansions: expansionResult.expansions,
    expansionLog: expansionResult.log
  }
}

const ENTITY_SEMANTIC_MAP = {
  
  /* ========================================
     HEAT EXCHANGERS
     ======================================== */
  
  "heat_exchanger": {
    coreTerms: ["heat exchanger", "heat exchange"],
    partialTerms: ["exchanger"], // ✅ NOT "heat" alone
    relatedTerms: ["cooler", "heater", "hx unit", "thermal exchanger"],
    abbreviations: ["hx", "he"],
    commonTypos: [
      "heat excanger", "heat exchnger", "heat ex changer",
      "heat changer", "he at exchanger", "hate exchanger",
      "hate ex changer", "hit exchanger", "heat exg",
      "heat extanger", "heat exchangr", "heat exchange unit",
      "exchager", "exchnager"
    ]
  },

  "shell_and_tube_heat_exchanger": {
    coreTerms: ["shell and tube heat exchanger", "shell and tube"],
    partialTerms: ["shell tube exchanger"],
    relatedTerms: ["tube bundle", "tube sheet", "sthe"],
    abbreviations: ["sthe"],
    commonTypos: [
      "shell tube exchanger", "shell n tube", "shell & tube",
      "shall and tube", "shell end tube", "shell tube hx",
      "cell and tube exchanger", "shell and tub"
    ]
  },

  "plate_heat_exchanger": {
    coreTerms: ["plate heat exchanger", "plate exchanger"],
    partialTerms: ["plate type"],
    relatedTerms: ["gasket plate", "gasketed plate", "compact exchanger"],
    abbreviations: ["phe"],
    commonTypos: [
      "plate heat excanger", "plate hx", "pleat heat exchanger",
      "flate heat exchanger", "plate heat exchange", "plat exchanger"
    ]
  },

  "air_cooled_heat_exchanger": {
    coreTerms: ["air cooled heat exchanger", "air cooler"],
    partialTerms: ["air cooled", "fin fan"],
    relatedTerms: ["fin fan cooler", "afc"],
    abbreviations: ["ache", "afc"],
    commonTypos: [
      "air cool heat exchanger", "air cooled hx", "air cooler exchanger",
      "finfan exchanger", "fan fin exchanger", "air colled exchanger",
      "fin fan", "air fin cooler"
    ]
  },

  "double_pipe_heat_exchanger": {
    coreTerms: ["double pipe heat exchanger", "double pipe"],
    partialTerms: ["double pipe"],
    relatedTerms: ["pipe in pipe", "hairpin exchanger"],
    abbreviations: [],
    commonTypos: [
      "double pipe exchanger", "double pipe hx", "pipe pipe exchanger",
      "double line exchanger", "double piping exchanger"
    ]
  },

  /* ========================================
     PRESSURE VESSELS & SEPARATORS
     ======================================== */

  "pressure_vessel": {
    coreTerms: ["pressure vessel"],
    partialTerms: ["vessel"], // ✅ "vessel" alone can expand
    relatedTerms: ["drum", "separator", "reactor"],
    abbreviations: ["pv"],
    commonTypos: [
      "presure vessel", "pressure vesal", "preasure vessel",
      "pressure vassel", "pressur vessel", "pv vessel",
      "pressre vessel"
    ]
  },

  "horizontal_pressure_vessel": {
    coreTerms: ["horizontal pressure vessel", "horizontal vessel"],
    partialTerms: ["horizontal"],
    relatedTerms: ["saddle support", "saddle mounted"],
    abbreviations: [],
    commonTypos: [
      "horizontal pv", "horizental vessel", "horizontal pressure vesal",
      "horizental pv"
    ]
  },

  "vertical_pressure_vessel": {
    coreTerms: ["vertical pressure vessel", "vertical vessel"],
    partialTerms: ["vertical"],
    relatedTerms: ["skirt support", "skirt mounted"],
    abbreviations: [],
    commonTypos: [
      "vertical pv", "vartical vessel", "vertical pressure vesal",
      "vartical pv"
    ]
  },

  "separator": {
    coreTerms: ["separator"],
    partialTerms: ["separate"],
    relatedTerms: ["knock out drum", "ko drum", "separation vessel"],
    abbreviations: [],
    commonTypos: [
      "seperator", "seprator", "saprator", "separator vessel",
      "separate drum", "separater"
    ]
  },

  "knock_out_drum": {
    coreTerms: ["knock out drum", "knockout drum"],
    partialTerms: ["ko drum"],
    relatedTerms: ["separator", "kod"],
    abbreviations: ["kod"],
    commonTypos: [
      "knok out drum", "noak out drum", "ko dram",
      "knockout dram", "knock-out drum"
    ]
  },

  "flash_drum": {
    coreTerms: ["flash drum", "flash separator"],
    partialTerms: ["flash"],
    relatedTerms: ["flash vessel", "separator"],
    abbreviations: [],
    commonTypos: [
      "flask drum", "flash dram", "flesh drum",
      "flash drum vessel", "flash seperator"
    ]
  },

  "reactor": {
    coreTerms: ["reactor", "reactor vessel"],
    partialTerms: ["react"],
    relatedTerms: ["process vessel", "reaction vessel"],
    abbreviations: [],
    commonTypos: [
      "reacter", "reactar", "reactor vessel",
      "reaction drum", "reactr"
    ]
  },

  /* ========================================
     COLUMNS & TOWERS
     ======================================== */

  "column": {
    coreTerms: ["column", "tower"],
    partialTerms: ["column", "tower"],
    relatedTerms: ["tray column", "packed column", "distillation"],
    abbreviations: [],
    commonTypos: [
      "colum", "colmn", "collum", "tower column",
      "colom", "coloum"
    ]
  },

  "distillation_column": {
    coreTerms: ["distillation column", "distillation tower"],
    partialTerms: ["distillation", "fractionation"],
    relatedTerms: ["tray column", "fractionator", "frac column"],
    abbreviations: ["dc"],
    commonTypos: [
      "distilation column", "destillation column",
      "distilition column", "distill column", "distilation tower"
    ]
  },

  "absorption_column": {
    coreTerms: ["absorption column", "absorber"],
    partialTerms: ["absorption", "absorber"],
    relatedTerms: ["gas absorber", "absorption tower"],
    abbreviations: [],
    commonTypos: [
      "absorbtion column", "absortion column", "absorb column",
      "absober", "absorption tower"
    ]
  },

  "stripper_column": {
    coreTerms: ["stripper column", "stripper"],
    partialTerms: ["stripper", "stripping"],
    relatedTerms: ["regeneration column", "stripper tower"],
    abbreviations: [],
    commonTypos: [
      "striper column", "striping column", "stripper tower",
      "strip column"
    ]
  },

  "packed_column": {
    coreTerms: ["packed column", "packed tower"],
    partialTerms: ["packing", "packed"],
    relatedTerms: ["structured packing", "random packing"],
    abbreviations: [],
    commonTypos: [
      "packet column", "pack column", "packed colum",
      "packing column", "packing tower"
    ]
  },

  "tray_column": {
    coreTerms: ["tray column", "tray tower"],
    partialTerms: ["tray"],
    relatedTerms: ["bubble cap", "sieve tray", "valve tray"],
    abbreviations: [],
    commonTypos: [
      "trey column", "tray colum", "tray colmn",
      "tree column", "tray tower"
    ]
  },

  /* ========================================
     STORAGE TANKS
     ======================================== */

  "storage_tank": {
    coreTerms: ["storage tank", "tank"],
    partialTerms: ["tank", "storage"],
    relatedTerms: ["oil tank", "product tank"],
    abbreviations: [],
    commonTypos: [
      "store tank", "storage tonk", "storag tank",
      "tank vessel", "storage tanker"
    ]
  },

  "fixed_roof_tank": {
    coreTerms: ["fixed roof tank", "cone roof tank"],
    partialTerms: ["fixed roof"],
    relatedTerms: ["storage tank", "atmospheric tank"],
    abbreviations: [],
    commonTypos: [
      "fix roof tank", "fixed rout tank", "fixed tank roof",
      "fixed roof storage"
    ]
  },

  "floating_roof_tank": {
    coreTerms: ["floating roof tank"],
    partialTerms: ["floating roof"],
    relatedTerms: ["storage tank", "frt", "external floating roof"],
    abbreviations: ["frt", "efrt"],
    commonTypos: [
      "floating rout tank", "float roof tank", "floating tank roof",
      "floatng roof tank"
    ]
  },

  "internal_floating_roof_tank": {
    coreTerms: ["internal floating roof tank"],
    partialTerms: ["internal floating roof", "ifr"],
    relatedTerms: ["ifrt", "storage tank"],
    abbreviations: ["ifrt", "ifr"],
    commonTypos: [
      "internal floating rout", "internal float roof",
      "ifr tank", "internal floating"
    ]
  },

  "spherical_tank": {
    coreTerms: ["spherical tank", "sphere"],
    partialTerms: ["sphere tank"],
    relatedTerms: ["pressure storage", "horton sphere"],
    abbreviations: [],
    commonTypos: [
      "spherecal tank", "spherical tonk", "sphere vessel",
      "sperical tank"
    ]
  },

  "bullet_tank": {
    coreTerms: ["bullet tank", "bullet"],
    partialTerms: ["bullet"],
    relatedTerms: ["lpg tank", "lpg bullet", "pressure storage"],
    abbreviations: [],
    commonTypos: [
      "bulit tank", "bullet tonk", "bullet vessel",
      "lpg bullet"
    ]
  },

  /* ========================================
     FURNACES & BOILERS
     ======================================== */

  "furnace": {
    coreTerms: ["furnace", "process heater"],
    partialTerms: ["heater"],
    relatedTerms: ["fired heater", "process furnace"],
    abbreviations: [],
    commonTypos: [
      "furnes", "furnace heater", "farnas", "furnance",
      "furnas"
    ]
  },

  "process_heater": {
    coreTerms: ["process heater", "fired heater"],
    partialTerms: ["heater"],
    relatedTerms: ["furnace", "process furnace"],
    abbreviations: [],
    commonTypos: [
      "process hiter", "proces heater", "process heatr",
      "fired hiter"
    ]
  },

  "boiler": {
    coreTerms: ["boiler", "steam boiler"],
    partialTerms: ["steam boiler"],
    relatedTerms: ["steam generator", "water tube boiler"],
    abbreviations: [],
    commonTypos: [
      "boilar", "boiller", "steam boler", "boyler"
    ]
  },

  "waste_heat_boiler": {
    coreTerms: ["waste heat boiler"],
    partialTerms: ["whb"],
    relatedTerms: ["heat recovery", "hrsg"],
    abbreviations: ["whb"],
    commonTypos: [
      "waste heat boler", "waste heater boiler",
      "west heat boiler", "waste heat recovery boiler"
    ]
  },

  "heat_recovery_steam_generator": {
    coreTerms: ["heat recovery steam generator"],
    partialTerms: ["hrsg"],
    relatedTerms: ["waste heat boiler", "steam generator"],
    abbreviations: ["hrsg"],
    commonTypos: [
      "heat recovery steam genrator", "hrsg unit",
      "heat recovery boiler", "heat recovery generator"
    ]
  },

  /* ========================================
     ROTATING EQUIPMENT
     ======================================== */

  "centrifugal_pump": {
    coreTerms: ["centrifugal pump"],
    partialTerms: ["centrifugal", "pump"],
    relatedTerms: ["process pump", "water pump"],
    abbreviations: ["cp"],
    commonTypos: [
      "centrifugal pamp", "centrifugal pum", "centrifugel pump",
      "sentifugal pump", "central pump", "centrifugal pumping",
      "pump centrifugal", "centrifugul pump"
    ]
  },

  "reciprocating_pump": {
    coreTerms: ["reciprocating pump"],
    partialTerms: ["reciprocating", "recip"],
    relatedTerms: ["plunger pump", "piston pump", "recip pump"],
    abbreviations: ["rp"],
    commonTypos: [
      "reciprocate pump", "reciprocating pamp", "resiprocating pump",
      "recip pump", "piston pamp", "plunger pamp"
    ]
  },

  "gear_pump": {
    coreTerms: ["gear pump"],
    partialTerms: ["gear"],
    relatedTerms: ["positive displacement pump", "pd pump"],
    abbreviations: [],
    commonTypos: [
      "gear pamp", "geer pump", "gear pumping",
      "gear type pump", "geer pamp"
    ]
  },

  "screw_pump": {
    coreTerms: ["screw pump"],
    partialTerms: ["screw"],
    relatedTerms: ["pd pump", "positive displacement"],
    abbreviations: [],
    commonTypos: [
      "screew pump", "screw pamp", "skrew pump",
      "screw type pump"
    ]
  },

  "centrifugal_compressor": {
    coreTerms: ["centrifugal compressor"],
    partialTerms: ["centrifugal", "compressor"],
    relatedTerms: ["process compressor", "turbo compressor"],
    abbreviations: ["cc"],
    commonTypos: [
      "centrifugal compresor", "centrifugel compressor",
      "sentifugal compressor", "compressor centrifugal",
      "centrifugal comprsr"
    ]
  },

  "reciprocating_compressor": {
    coreTerms: ["reciprocating compressor"],
    partialTerms: ["reciprocating", "compressor"],
    relatedTerms: ["piston compressor", "recip compressor"],
    abbreviations: ["rc"],
    commonTypos: [
      "reciprocate compressor", "recip compressor",
      "resiprocating compressor", "piston compresor"
    ]
  },

  "screw_compressor": {
    coreTerms: ["screw compressor"],
    partialTerms: ["screw"],
    relatedTerms: ["air compressor", "rotary screw"],
    abbreviations: [],
    commonTypos: [
      "screw compresor", "skrew compressor", "screw comprsr",
      "screw air compressor"
    ]
  },

  "steam_turbine": {
    coreTerms: ["steam turbine"],
    partialTerms: ["steam", "turbine"],
    relatedTerms: ["driver turbine", "turbine driver"],
    abbreviations: ["st"],
    commonTypos: [
      "steam terbine", "steam turbin", "steam turbine driver",
      "stem turbine", "steem turbine"
    ]
  },

  "gas_turbine": {
    coreTerms: ["gas turbine"],
    partialTerms: ["gas", "turbine"],
    relatedTerms: ["power turbine", "gt"],
    abbreviations: ["gt"],
    commonTypos: [
      "gas terbine", "gas turbin", "gass turbine",
      "gas turbine engine"
    ]
  },

  "electric_motor": {
    coreTerms: ["electric motor", "motor"],
    partialTerms: ["motor"],
    relatedTerms: ["drive motor", "induction motor"],
    abbreviations: ["em"],
    commonTypos: [
      "electrical motor", "electric moter", "electrik motor",
      "motor electric", "elektric motor"
    ]
  },

  /* ========================================
     NDT TESTING
     ======================================== */

  "visual_testing": {
    coreTerms: ["visual testing", "visual inspection"],
    partialTerms: ["visual", "vt"],
    relatedTerms: ["eye inspection", "surface check", "vi"],
    abbreviations: ["vt", "vi"],
    commonTypos: [
      "vizual testing", "visual testng", "visual inspaction",
      "vt testing", "visual chek", "visual cheking"
    ]
  },

  "ultrasonic_testing": {
    coreTerms: ["ultrasonic testing"],
    partialTerms: ["ultrasonic", "ultra sound"],
    relatedTerms: ["ut testing", "ut test"],
    abbreviations: ["ut"],
    commonTypos: [
      "ultra sonic testing", "ultrasonik testing",
      "ultra sound test", "ut test", "ultra sonic test",
      "ultrasound testing"
    ]
  },

  "ultrasonic_thickness_testing": {
    coreTerms: ["ultrasonic thickness testing", "thickness measurement"],
    partialTerms: ["thickness", "ut thickness"],
    relatedTerms: ["wall thickness", "thickness gauging"],
    abbreviations: ["utt", "utg"],
    commonTypos: [
      "ultrasonic thicknes testing", "thikness test ut",
      "ut thickness test", "ultrasonic thickness"
    ]
  },

  "phased_array_ut": {
    coreTerms: ["phased array ut", "phased array ultrasonic"],
    partialTerms: ["phased array", "paut"],
    relatedTerms: ["advanced ut", "pa ut"],
    abbreviations: ["paut"],
    commonTypos: [
      "phase array ut", "phased arrey ut", "pased array ut",
      "phased ut", "paut testing"
    ]
  },

  "time_of_flight_diffraction": {
    coreTerms: ["time of flight diffraction"],
    partialTerms: ["tofd"],
    relatedTerms: ["advanced ut", "tofd testing"],
    abbreviations: ["tofd"],
    commonTypos: [
      "time of flight defraction", "tofd test", "tofd ut",
      "time flight ut", "time of fligt"
    ]
  },

  "magnetic_particle_testing": {
    coreTerms: ["magnetic particle testing", "magnetic particle inspection"],
    partialTerms: ["magnetic", "mt"],
    relatedTerms: ["mpi", "mt test"],
    abbreviations: ["mt", "mpi"],
    commonTypos: [
      "magnetic partical testing", "magnetic test mt",
      "mpi testing", "magnetic particle test", "magnatic particle"
    ]
  },

  "dye_penetrant_testing": {
    coreTerms: ["dye penetrant test", "liquid penetrant test"],
    partialTerms: ["penetrant", "pt", "dpt"],
    relatedTerms: ["liquid penetrant testing", "pt test"],
    abbreviations: ["pt", "lpt", "dpt"],
    commonTypos: [
      "die penetrant test", "penitrant testing", "penetrent test",
      "pt testing", "dpt testing", "liquid penetrant"
    ]
  },

  "radiographic_testing": {
    coreTerms: ["radiographic testing", "radiography"],
    partialTerms: ["radiography", "rt", "xray"],
    relatedTerms: ["x ray test", "rt test"],
    abbreviations: ["rt"],
    commonTypos: [
      "radio graphic testing", "radiography test",
      "xray testing", "x-ray test", "rt testing"
    ]
  },

  "eddy_current_testing": {
    coreTerms: ["eddy current testing"],
    partialTerms: ["eddy current", "ect"],
    relatedTerms: ["ect test"],
    abbreviations: ["ect"],
    commonTypos: [
      "eddy curent testing", "eddy current test",
      "eddy currant test", "ect testing"
    ]
  },

  /* ========================================
     PRESSURE TESTING
     ======================================== */

  "hydrostatic_testing": {
    coreTerms: ["hydrostatic testing", "hydrotest"],
    partialTerms: ["hydro test", "hydrostatic"],
    relatedTerms: ["pressure test", "water test"],
    abbreviations: [],
    commonTypos: [
      "hydro statik testing", "hydro pressure test",
      "hydro testing", "hydrostatic test", "hydrotesting"
    ]
  },

  "pneumatic_test": {
    coreTerms: ["pneumatic test", "pneumatic testing"],
    partialTerms: ["pneumatic"],
    relatedTerms: ["air test", "air pressure test"],
    abbreviations: [],
    commonTypos: [
      "pnumatic test", "newmatic test", "pneumetic test",
      "air pressure test", "pneumatic testing"
    ]
  },

  "leak_test": {
    coreTerms: ["leak test", "leak testing"],
    partialTerms: ["leak"],
    relatedTerms: ["soap test", "bubble test"],
    abbreviations: [],
    commonTypos: [
      "leak tast", "leek test", "leakage test",
      "lick test", "leak testing"
    ]
  },

  "vacuum_box_testing": {
    coreTerms: ["vacuum box testing", "vacuum box test"],
    partialTerms: ["vacuum test", "vacuum box"],
    relatedTerms: ["leak test", "weld testing"],
    abbreviations: [],
    commonTypos: [
      "vacum box testing", "vacuum leak test",
      "vacuum box test", "vacuum testing"
    ]
  },

  /* ========================================
     DEFECTS & DAMAGE
     ======================================== */

  "corrosion": {
    coreTerms: ["corrosion"],
    partialTerms: ["rust", "corrode"],
    relatedTerms: ["metal loss", "rusting"],
    abbreviations: [],
    commonTypos: [
      "corosion", "corrossion", "corrusion",
      "corrosion damage", "rusting corrosion"
    ]
  },

  "pitting_corrosion": {
    coreTerms: ["pitting corrosion", "pitting"],
    partialTerms: ["pitting", "pit"],
    relatedTerms: ["localized corrosion", "pit corrosion"],
    abbreviations: [],
    commonTypos: [
      "piting corrosion", "petting corrosion",
      "pit corrosion", "pitting rust"
    ]
  },

  "erosion_corrosion": {
    coreTerms: ["erosion corrosion"],
    partialTerms: ["erosion", "corrosion"],
    relatedTerms: ["high velocity damage", "flow damage"],
    abbreviations: [],
    commonTypos: [
      "erosion corosion", "erosion corrosion damage",
      "flow corrosion", "erosive corrosion"
    ]
  },

  "crack": {
    coreTerms: ["crack", "cracking"],
    partialTerms: ["crack"],
    relatedTerms: ["fracture", "crack indication"],
    abbreviations: [],
    commonTypos: [
      "crak", "crackng", "metal crack",
      "surface crack", "craking"
    ]
  },

  "stress_corrosion_cracking": {
    coreTerms: ["stress corrosion cracking"],
    partialTerms: ["scc"],
    relatedTerms: ["chloride cracking", "scc damage"],
    abbreviations: ["scc"],
    commonTypos: [
      "stress corosion cracking", "stress cracking",
      "s c c", "scc cracking"
    ]
  },

  "leakage": {
    coreTerms: ["leakage", "leak"],
    partialTerms: ["leak"],
    relatedTerms: ["through wall", "leak point"],
    abbreviations: [],
    commonTypos: [
      "leakeg", "leekage", "leaking",
      "leak problem", "leakeage"
    ]
  },

  /* ========================================
     HEAT EXCHANGER INTERNALS
     ======================================== */

  "tube_bundle": {
    coreTerms: ["tube bundle"],
    partialTerms: ["bundle"],
    relatedTerms: ["tube assembly", "heat exchanger bundle"],
    abbreviations: [],
    commonTypos: [
      "tube bundel", "tube bungle", "tub bundle",
      "bundle tube", "tube bundal"
    ]
  },

  "tube_sheet": {
    coreTerms: ["tube sheet", "tubesheet"],
    partialTerms: ["tubesheet"],
    relatedTerms: ["tube to sheet", "tube plate"],
    abbreviations: [],
    commonTypos: [
      "tube sheat", "tube shhet", "tube sheet plate",
      "tube sit", "tube sheat"
    ]
  },

  "baffle": {
    coreTerms: ["baffle", "baffle plate"],
    partialTerms: ["baffle"],
    relatedTerms: ["support baffle", "segmental baffle"],
    abbreviations: [],
    commonTypos: [
      "baffel", "baffel plates", "baffle plate",
      "baffal", "baffale"
    ]
  },

  "channel_head": {
    coreTerms: ["channel head"],
    partialTerms: ["channel"],
    relatedTerms: ["front head", "channel cover"],
    abbreviations: [],
    commonTypos: [
      "channel hed", "channel haid", "channel cover head",
      "channal head"
    ]
  },

  "floating_head": {
    coreTerms: ["floating head"],
    partialTerms: ["floating"],
    relatedTerms: ["rear head", "back head"],
    abbreviations: [],
    commonTypos: [
      "floating hed", "floating haid", "floating end head",
      "floatin head"
    ]
  },
/* ========================================
     FLANGE COMPONENTS
     ======================================== */

  "flange": {
    coreTerms: ["flange"],
    partialTerms: ["flanged"],
    relatedTerms: ["pipe flange", "flange joint"],
    abbreviations: [],
    commonTypos: [
      "flang", "flenge", "flange joint",
      "flanj", "flanged"
    ]
  },

  "flange_face": {
    coreTerms: ["flange face"],
    partialTerms: ["face"],
    relatedTerms: ["gasket seating", "flange surface"],
    abbreviations: [],
    commonTypos: [
      "flange fes", "flange surface", "flange face area",
      "flang face"
    ]
  },

  "serration_area": {
    coreTerms: ["serration area", "serration"],
    partialTerms: ["serration"],
    relatedTerms: ["grooved joint", "flange finish"],
    abbreviations: [],
    commonTypos: [
      "sarration", "sarration area", "seration area",
      "serrated zone", "serration groov", "serration"
    ]
  },

  "gasket": {
    coreTerms: ["gasket"],
    partialTerms: ["sealing"],
    relatedTerms: ["flange gasket", "spiral wound"],
    abbreviations: [],
    commonTypos: [
      "gaskit", "gas kit", "gasket seal",
      "gaskat", "gaskket"
    ]
  },

  /* ========================================
     COLUMN INTERNALS
     ======================================== */

  "tray": {
    coreTerms: ["tray", "column tray"],
    partialTerms: ["tray"],
    relatedTerms: ["internal tray", "distillation tray"],
    abbreviations: [],
    commonTypos: [
      "trey", "tray plate", "tray internal",
      "tray colum", "tre"
    ]
  },

  "bubble_cap_tray": {
    coreTerms: ["bubble cap tray"],
    partialTerms: ["bubble cap"],
    relatedTerms: ["tray type", "bubble tray"],
    abbreviations: [],
    commonTypos: [
      "bubble cap trey", "bubblecap tray", "bubble cup tray",
      "bubbel cap"
    ]
  },

  "sieve_tray": {
    coreTerms: ["sieve tray"],
    partialTerms: ["sieve"],
    relatedTerms: ["perforated tray", "hole tray"],
    abbreviations: [],
    commonTypos: [
      "seive tray", "siv tray", "sieve trey",
      "sive tray"
    ]
  },

  "packing": {
    coreTerms: ["packing", "column packing"],
    partialTerms: ["packing"],
    relatedTerms: ["structured packing", "random packing"],
    abbreviations: [],
    commonTypos: [
      "packng", "packing material", "packing column",
      "paking"
    ]
  },

  "downcomer": {
    coreTerms: ["downcomer"],
    partialTerms: ["down comer"],
    relatedTerms: ["liquid downflow", "tray downcomer"],
    abbreviations: [],
    commonTypos: [
      "down comer", "downcomar", "down camber",
      "downcomber"
    ]
  },

  /* ========================================
     INSPECTION & QA/QC
     ======================================== */

  "internal_inspection": {
    coreTerms: ["internal inspection"],
    partialTerms: ["internal"],
    relatedTerms: ["inside inspection", "internal check"],
    abbreviations: [],
    commonTypos: [
      "internel inspection", "internal inspaction",
      "inside check", "internal inspaction"
    ]
  },

  "external_inspection": {
    coreTerms: ["external inspection"],
    partialTerms: ["external"],
    relatedTerms: ["outside inspection", "external check"],
    abbreviations: [],
    commonTypos: [
      "externel inspection", "external inspaction",
      "outside check"
    ]
  },

  "shutdown_inspection": {
    coreTerms: ["shutdown inspection"],
    partialTerms: ["shutdown"],
    relatedTerms: ["plant shutdown", "turnaround"],
    abbreviations: ["ta"],
    commonTypos: [
      "shut down inspection", "shutdown inspaction",
      "sd inspection", "shutdwn inspection"
    ]
  },

  "thickness_measurement": {
    coreTerms: ["thickness measurement"],
    partialTerms: ["thickness"],
    relatedTerms: ["ut thickness", "wall thickness", "thickness check"],
    abbreviations: ["tmm"],
    commonTypos: [
      "thikness measurement", "thickness measurment",
      "thickness checking", "thicknes measurement"
    ]
  },

  "weld_inspection": {
    coreTerms: ["weld inspection"],
    partialTerms: ["weld"],
    relatedTerms: ["welding inspection", "weld check"],
    abbreviations: [],
    commonTypos: [
      "weld inspaction", "welding inspaction",
      "weld checking", "weild inspection"
    ]
  },

  /* ========================================
     OPERATIONS & MAINTENANCE
     ======================================== */

  "bundle_extraction": {
    coreTerms: ["bundle extraction", "bundle pulling"],
    partialTerms: ["bundle pull"],
    relatedTerms: ["bundle removal", "tube bundle removal"],
    abbreviations: [],
    commonTypos: [
      "bundle extraction", "bundle pulling",
      "tube bundle removal", "bundle pull out"
    ]
  },

  "retubing": {
    coreTerms: ["retubing"],
    partialTerms: ["re tubing"],
    relatedTerms: ["tube replacement", "tube change"],
    abbreviations: [],
    commonTypos: [
      "re tubbing", "re tubing work",
      "tube change", "retubing work"
    ]
  },

  "tube_plugging": {
    coreTerms: ["tube plugging"],
    partialTerms: ["plugging"],
    relatedTerms: ["tube isolation", "plug tube"],
    abbreviations: [],
    commonTypos: [
      "tube pluging", "tube plug",
      "plugging tube", "tube blocking"
    ]
  },

  "chemical_cleaning": {
    coreTerms: ["chemical cleaning"],
    partialTerms: ["chemical clean"],
    relatedTerms: ["acid cleaning", "chemical wash"],
    abbreviations: [],
    commonTypos: [
      "chemical cleanning", "chemical wash",
      "acid cleaning", "chemicle cleaning"
    ]
  },

  "mechanical_cleaning": {
    coreTerms: ["mechanical cleaning"],
    partialTerms: ["mechanical clean"],
    relatedTerms: ["manual cleaning", "physical cleaning"],
    abbreviations: [],
    commonTypos: [
      "mechanical cleanning", "manual cleaning",
      "mechanical wash", "mechanic cleaning"
    ]
  },

  /* ========================================
     DOCUMENTS
     ======================================== */

  "inspection_test_plan": {
    coreTerms: ["inspection test plan", "inspection and test plan"],
    partialTerms: ["itp"],
    relatedTerms: ["quality plan", "test plan"],
    abbreviations: ["itp"],
    commonTypos: [
      "inspection test paln", "inspaction test plan",
      "i t p", "inspection testing plan"
    ]
  },

  "welding_procedure_specification": {
    coreTerms: ["welding procedure specification"],
    partialTerms: ["wps"],
    relatedTerms: ["welding procedure", "weld procedure"],
    abbreviations: ["wps"],
    commonTypos: [
      "welding procedure spec", "w p s",
      "weld procedure", "welding procedur"
    ]
  },

  "procedure_qualification_record": {
    coreTerms: ["procedure qualification record"],
    partialTerms: ["pqr"],
    relatedTerms: ["welding qualification", "procedure record"],
    abbreviations: ["pqr"],
    commonTypos: [
      "procedure qualification recod", "p q r",
      "welding pqr", "procedur qualification"
    ]
  },

  "material_test_certificate": {
    coreTerms: ["material test certificate"],
    partialTerms: ["mtc"],
    relatedTerms: ["mill certificate", "material certificate"],
    abbreviations: ["mtc"],
    commonTypos: [
      "material test certifcate", "m t c",
      "mill test certificate", "mtc certificate"
    ]
  },

  "non_conformance_report": {
    coreTerms: ["non conformance report"],
    partialTerms: ["ncr"],
    relatedTerms: ["quality deviation", "ncr report"],
    abbreviations: ["ncr"],
    commonTypos: [
      "non conformity report", "n c r",
      "quality ncr", "non conformance"
    ]
  },

  /* ========================================
     RBI & FFS
     ======================================== */

  "risk_based_inspection": {
    coreTerms: ["risk based inspection"],
    partialTerms: ["rbi"],
    relatedTerms: ["risk assessment", "rbi assessment"],
    abbreviations: ["rbi"],
    commonTypos: [
      "risk base inspection", "risk based inspaction",
      "r b i", "rbi inspection"
    ]
  },

  "fitness_for_service": {
    coreTerms: ["fitness for service"],
    partialTerms: ["ffs"],
    relatedTerms: ["integrity assessment", "ffs assessment"],
    abbreviations: ["ffs"],
    commonTypos: [
      "fitnes for service", "fitness service",
      "f f s", "ffs assessment"
    ]
  },

  "remaining_life_assessment": {
    coreTerms: ["remaining life assessment"],
    partialTerms: ["remaining life"],
    relatedTerms: ["life calculation", "life assessment"],
    abbreviations: [],
    commonTypos: [
      "remaning life", "remaining life calc",
      "balance life", "remaining life assesment"
    ]
  }
}

function resolveEntity(text) {
  const resolvedEntities = []
  const textLower = text.toLowerCase()
  
  for (const [entityKey, semantics] of Object.entries(ENTITY_SEMANTIC_MAP)) {
    let score = 0
    let matchType = null
    let matchedTerm = null
    
    // ==========================================
    // PRIORITY 1: Core Terms (100 points)
    // ==========================================
    for (const core of semantics.coreTerms) {
      if (textLower.includes(core.toLowerCase())) {
        score = 100
        matchType = 'CORE'
        matchedTerm = core
        break
      }
    }
    
    // ==========================================
    // PRIORITY 2: Abbreviations (95 points)
    // ==========================================
    if (score === 0 && semantics.abbreviations.length > 0) {
      for (const abbr of semantics.abbreviations) {
        // Word boundary check for abbreviations
        const regex = new RegExp(`\\b${abbr}\\b`, 'i')
        if (regex.test(textLower)) {
          score = 95
          matchType = 'ABBREVIATION'
          matchedTerm = abbr
          break
        }
      }
    }
    
    // ==========================================
    // PRIORITY 3: Typo Match (90 points)
    // ==========================================
    if (score === 0) {
      for (const typo of semantics.commonTypos) {
        if (textLower.includes(typo.toLowerCase())) {
          score = 90
          matchType = 'TYPO'
          matchedTerm = typo
          break
        }
      }
    }
    
    // ==========================================
    // PRIORITY 4: Related Terms (70 points)
    // ==========================================
    if (score === 0) {
      for (const related of semantics.relatedTerms) {
        if (textLower.includes(related.toLowerCase())) {
          score = 70
          matchType = 'RELATED'
          matchedTerm = related
          break
        }
      }
    }
    
    // ==========================================
    // PRIORITY 5: Partial Terms (CONTEXT-AWARE)
    // ==========================================
    if (score === 0) {
      let partialMatches = 0
      const matchedPartials = []
      
      for (const partial of semantics.partialTerms) {
        // Word boundary check
        const regex = new RegExp(`\\b${partial}\\b`, 'i')
        if (regex.test(textLower)) {
          partialMatches++
          matchedPartials.push(partial)
        }
      }
      
      // RULE: Need at least 2 partial matches OR 1 strong partial
      if (partialMatches >= 2) {
        score = 80  // High confidence with multiple partials
        matchType = 'PARTIAL_MULTIPLE'
        matchedTerm = matchedPartials.join(' + ')
      } else if (partialMatches === 1) {
        // Check if it's a strong partial (like "exchanger" or "vessel")
        const strongPartials = ['exchanger', 'vessel', 'column', 'tower']
        if (strongPartials.some(sp => matchedPartials[0].includes(sp))) {
          score = 60  // Medium confidence
          matchType = 'PARTIAL_STRONG'
          matchedTerm = matchedPartials[0]
        } else {
          score = 30  // Low confidence
          matchType = 'PARTIAL_WEAK'
          matchedTerm = matchedPartials[0]
        }
      }
    }
    
    // ==========================================
    // PRIORITY 6: Fuzzy Match (for typos) (50 points)
    // ==========================================
    if (score === 0) {
      const words = textLower.split(' ')
      for (const core of semantics.coreTerms) {
        const coreWords = core.toLowerCase().split(' ')
        for (const word of words) {
          for (const coreWord of coreWords) {
            if (word.length > 3 && coreWord.length > 3) {
              const distance = levenshteinDistance(word, coreWord)
              if (distance <= 2) {
                score = 50
                matchType = 'FUZZY'
                matchedTerm = `${word} ≈ ${coreWord}`
                break
              }
            }
          }
          if (score > 0) break
        }
        if (score > 0) break
      }
    }
    
    // ==========================================
    // Add to results if score > 0
    // ==========================================
    if (score > 0) {
      resolvedEntities.push({
        entity: entityKey,
        displayName: semantics.coreTerms[0],
        confidence: score,
        matchType: matchType,
        matchedTerm: matchedTerm,
        confidenceLevel: score >= 90 ? 'VERY_HIGH' :
                        score >= 70 ? 'HIGH' :
                        score >= 50 ? 'MEDIUM' : 'LOW'
      })
    }
  }
  
  // Sort by confidence (highest first)
  resolvedEntities.sort((a, b) => b.confidence - a.confidence)
  
  return {
    entities: resolvedEntities,
    topEntity: resolvedEntities[0] || null,
    entityCount: resolvedEntities.length
  }
}

function levenshteinDistance(str1, str2) {
  const m = str1.length
  const n = str2.length
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0))
  
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],      // deletion
          dp[i][j-1],      // insertion
          dp[i-1][j-1]     // substitution
        )
      }
    }
  }
  
  return dp[m][n]
}

const ADVANCED_INTENT_PATTERNS = {

  // =====================================================
  // 1️⃣ DEFINITION / BASIC MEANING / INTRODUCTION
  // =====================================================
  DEFINITION: {
    strongPatterns: [
      // Direct definition
      /\b(kya hai|kya hota hai|what is|define)\b/i,
      /\b(definition|meaning|matlab)\b/i,
      /\b(explain\s+what\s+is)\b/i,
      /\b(can\s+you\s+define|please\s+define)\b/i,
      /\b(what\s+do\s+you\s+mean\s+by)\b/i,
      /\b(meaning\s+of)\b/i,
      
      // Hindi/Hinglish direct
      /\b(ka\s+arth|ka\s+matlab\s+kya)\b/i,
      /\b(iska\s+matlab\s+kya\s+hai)\b/i,
      /\b(define\s+karo|define\s+kijiye)\b/i
    ],

    weakPatterns: [
      // Soft asks
      /\b(bataiye|batao|explain|describe)\b/i,
      /\b(samjhao|samjhaiye|tell\s+me)\b/i,
      /\b(about|regarding)\b/i,
      /\b(introduction|intro)\b/i,
      /\b(basic\s+idea|basic\s+knowledge|basic\s+concept)\b/i,
      /\b(short\s+note|brief\s+note)\b/i,
      /\b(overview)\b/i,
      
      // Hinglish casual
      /\b(yeh\s+kya\s+hai|ye\s+kya\s+hota)\b/i,
      /\b(iska\s+matlab|uska\s+matlab)\b/i,
      /\b(iske\s+baare\s+me|uske\s+baare\s+me)\b/i,
      /\b(kya\s+cheez\s+hai)\b/i
    ],

   contextualClues: [
      /\bkya\s+(hai|hota|hoti)\b/i,
      /\bka\s+matlab\b/i,
      /\bmeaning\s+of\b/i,
      /\bdefine\s+/i,
      /\bwhat\s+is\s+/i,
      /\bintroduction\s+(of|to)\b/i,
      /\babout\s+the\b/i,
      /\bexplain\s+the\s+term\b/i
    ],
    
    weight: 50
  },

  // =====================================================
  // 2️⃣ WORKING / FUNCTION / PRINCIPLE / OPERATION
  // =====================================================
  WORKING: {
    strongPatterns: [
      /\b(kaise\s+kaam\s+karta|kaise\s+kaam\s+karti)\b/i,
      /\b(how\s+it\s+works|how\s+does\s+it\s+work)\b/i,
      /\b(working\s+principle|operating\s+principle)\b/i,
      /\b(function\s+kya|kaam\s+kya\s+hai)\b/i,
      /\b(principle\s+of\s+working|principle\s+of\s+operation)\b/i,
      /\b(functioning\s+of)\b/i,
      /\b(mechanism\s+of)\b/i,
      
      // Hindi/Hinglish
      /\b(kaam\s+kaise\s+karta|kaam\s+kaise\s+karti)\b/i,
      /\b(operate\s+kaise\s+hota)\b/i
    ],

    weakPatterns: [
      /\b(mechanism|logic|concept)\b/i,
      /\b(work\s+kaise)\b/i,
      /\b(flow\s+kaise)\b/i,
      /\b(process\s+behind)\b/i,
      /\b(system\s+kaise)\b/i,
      /\b(operate\s+kaise)\b/i,
      /\b(internal\s+working)\b/i,
      
      // Hinglish
      /\b(andar\s+kaise\s+kaam)\b/i,
      /\b(kaam\s+karne\s+ka\s+tarika)\b/i,
      /\b(chalti\s+kaise)\b/i,
      /\b(kaam\s+karne\s+ki\s+vidhi)\b/i
    ],

    contextualClues: [
      /\bkaam\s+(kaise|kya)\b/i,
      /\bworking\s+principle\b/i,
      /\bhow\s+it\s+operates\b/i,
      /\boperate\s+kaise\b/i,
      /\bflow\s+mechanism\b/i,
      /\bfunction\s+of\b/i,
      /\binside\s+working\b/i,
      /\bhow\s+does\s+this\s+system\b/i
    ],
    
    weight: 48
  },

  // =====================================================
  // 3️⃣ PROCEDURE / HOW TO / STEP BY STEP / METHOD
  // =====================================================
  PROCEDURE: {
    strongPatterns: [
      /\b(kaise\s+kare|kaise\s+karte|kaise\s+kiya)\b/i,
      /\b(how\s+to|how\s+do\s+we|how\s+to\s+perform)\b/i,
      /\b(step\s+by\s+step|stepwise|step\s+wise)\b/i,
      /\b(procedure|process|method|steps)\b/i,
      
      // Inspection specific
      /\b(inspection\s+procedure|testing\s+procedure)\b/i,
      /\b(repair\s+procedure|installation\s+procedure)\b/i,
      /\b(cleaning\s+procedure|maintenance\s+procedure)\b/i,
      /\b(removal\s+procedure|assembly\s+procedure)\b/i,
      
      // Hindi/Hinglish
      /\b(vidhi|pranali|tarika\s+kya\s+hai)\b/i,
      /\b(procedure\s+kya\s+hai)\b/i
    ],

    weakPatterns: [
      /\b(tarika|tareeka)\b/i,
      /\b(process\s+samjhao)\b/i,
      /\b(complete\s+process|full\s+process|puri\s+process)\b/i,
      /\b(sequence)\b/i,
      /\b(kaam\s+ka\s+tarika)\b/i,
      /\b(standard\s+method)\b/i,
      
      // Casual Hinglish
      /\b(start\s+kaise|shuru\s+kaise)\b/i,
      /\b(kaise\s+shuru\s+kare)\b/i,
      /\b(pehle\s+kya\s+phir\s+kya)\b/i
    ],

    contextualClues: [
      /\bkaise\s+(kare|karte|kiya|karein)\b/i,
      /\bstep\s+wise\b/i,
      /\bpehle\s+kya\s+phir\s+kya\b/i,
      /\bstart\s+to\s+end\b/i,
      /\bfollow\s+the\s+steps\b/i,
      /\bprocedure\s+follow\b/i,
      /\bone\s+by\s+one\b/i,
      /\bek\s+ek\s+karke\b/i
    ],
    
    weight: 40
  },

  // =====================================================
  // 4️⃣ REPAIR / FIX / RECTIFICATION / MAINTENANCE
  // =====================================================
  REPAIR: {
    strongPatterns: [
      /\b(repair|fix|thik\s+kar|theek\s+kar)\b/i,
      /\b(kaise\s+repair|how\s+to\s+repair)\b/i,
      /\b(rectify|rectification|sudhar)\b/i,
      /\b(repair\s+kaise|thik\s+kaise)\b/i,
      /\b(maintenance|maintain\s+kaise)\b/i,
      /\b(corrective\s+action|remedial\s+action)\b/i,
      
      // Hindi/Hinglish
      /\b(kaise\s+theek\s+kare|kaise\s+thik\s+ho)\b/i,
      /\b(sudharna|sudharne\s+ka\s+tarika)\b/i,
      /\b(repair\s+karenge|fix\s+karenge)\b/i
    ],

    weakPatterns: [
      /\b(resolve|solve|solution)\b/i,
      /\b(restore|restoration)\b/i,
      /\b(overhaul|rework)\b/i,
      /\b(rebuild|refurbish)\b/i,
      
      // Hinglish
      /\b(ठीक\s+karna|ठीक\s+kare)\b/i,
      /\b(maintenance\s+ka\s+tarika)\b/i
    ],

    contextualClues: [
      /\brepair\s+(method|procedure|process)\b/i,
      /\bthik\s+(kare|karna|karein)\b/i,
      /\bkaise\s+theek\b/i,
      /\bfix\s+kaise\b/i,
      /\bsudhar\s+(kaise|kare)\b/i,
      /\brepair\s+karna\b/i
    ],
    
    weight: 45
  },

  // =====================================================
  // 5️⃣ PROBLEM / ISSUE / FAILURE / DAMAGE / DEFECT
  // =====================================================
  PROBLEM: {
    strongPatterns: [
      /\b(problem|issue|fault|failure)\b/i,
      /\b(kharab|damage|defect|galti)\b/i,
      /\b(leak|leakage|crack|corrosion)\b/i,
      /\b(fail\s+ho|kharab\s+ho|damage\s+ho)\b/i,
      /\b(not\s+working|work\s+nahi\s+kar\s+raha)\b/i,
      
      // Hindi/Hinglish
      /\b(kharabi|खराबी|problem\s+aa\s+raha)\b/i,
      /\b(issue\s+aa\s+rahi)\b/i
    ],

    weakPatterns: [
      /\b(breakdown|malfunction)\b/i,
      /\b(abnormal|unusual)\b/i,
      /\b(deterioration|degradation)\b/i,
      /\b(wear|erosion|pitting)\b/i,
      
      // Hinglish
      /\b(kharab\s+hona|damage\s+hona)\b/i,
      /\b(galti\s+hona)\b/i
    ],

    contextualClues: [
      /\bkharab\s+(ho|hai|hota)\b/i,
      /\bproblem\s+(aa|hai)\b/i,
      /\bissue\s+(hai|aa)\b/i,
      /\bfailure\s+of\b/i,
      /\bdamage\s+(in|to)\b/i,
      /\bdefect\s+in\b/i
    ],
    
    weight: 35
  },

  // =====================================================
  // 6️⃣ INSPECTION / CHECK / IDENTIFICATION / DETECTION
  // =====================================================
  IDENTIFICATION: {
    strongPatterns: [
      /\b(identify|identification|pehchan)\b/i,
      /\b(kaise\s+pata|how\s+to\s+identify)\b/i,
      /\b(inspect|inspection|check|examine)\b/i,
      /\b(detect|detection|find)\b/i,
      /\b(kaise\s+check|kaise\s+inspect)\b/i,
      /\b(verify|verification)\b/i,
      
      // Hindi/Hinglish
      /\b(kaise\s+dekhte|kaise\s+dekhe|kaise\s+pata\s+kare)\b/i,
      /\b(pehchan\s+kaise)\b/i
    ],

    weakPatterns: [
      /\b(recognition|locate|location)\b/i,
      /\b(testing|test\s+kaise)\b/i,
      /\b(measurement|measure)\b/i,
      
      // Hinglish
      /\b(dekhna|dekhte|check\s+karna)\b/i,
      /\b(pata\s+lagana|pata\s+lagaye)\b/i
    ],

    contextualClues: [
      /\bkaise\s+(pata|check|detect|identify)\b/i,
      /\binspect\s+kaise\b/i,
      /\bhow\s+to\s+(identify|detect|inspect)\b/i,
      /\bcheck\s+(kare|karna)\b/i,
      /\bpehchan\s+(kaise|kare)\b/i
    ],
    
    weight: 30
  },

  // =====================================================
  // 7️⃣ ACCEPTANCE / REJECTION / LIMIT / CRITERIA / CODE
  // =====================================================
  DECISION: {
    strongPatterns: [
      /\b(acceptable|acceptance\s+criteria|accept)\b/i,
      /\b(reject|rejection\s+criteria|rejection\s+limit)\b/i,
      /\b(pass|fail|pass\s+or\s+fail)\b/i,
      /\b(limit|allowable\s+limit|tolerance\s+limit)\b/i,
      /\b(as\s+per\s+code|as\s+per\s+standard|code\s+requirement)\b/i,
      
      // Hindi/Hinglish
      /\b(acceptable\s+hai\s+ya\s+nahi|chal\s+jayega\s+ya\s+nahi)\b/i,
      /\b(use\s+kar\s+sakte\s+ya\s+nahi)\b/i,
      /\b(standard\s+ke\s+according|code\s+ke\s+hisab\s+se)\b/i
    ],

    weakPatterns: [
      /\b(criteria|requirement|specification)\b/i,
      /\b(allowable|permissible|maximum|minimum)\b/i,
      /\b(tolerance|threshold)\b/i,
      
      // Hinglish
      /\b(limit\s+kya\s+hai|kitna\s+allowable)\b/i
    ],

    contextualClues: [
      /\bacceptable\s+(hai|limit|range)\b/i,
      /\brejection\s+(criteria|limit)\b/i,
      /\bas\s+per\s+(code|standard|asme|api)\b/i,
      /\bpass\s+or\s+fail\b/i,
      /\bchal\s+jayega\b/i,
      /\buse\s+kar\s+sakte\b/i
    ],
    
    weight: 32
  },

  // =====================================================
  // 8️⃣ COMPARISON / DIFFERENCE / VS / BETTER / SELECTION
  // =====================================================
  COMPARISON: {
    strongPatterns: [
      /\b(difference\s+between|farak\s+kya)\b/i,
      /\b(compare|comparison|versus|vs)\b/i,
      /\b(which\s+is\s+better|konsa\s+better)\b/i,
      /\b(advantage|disadvantage|pros\s+and\s+cons)\b/i,
      /\b(benefit|limitation|drawback)\b/i,
      
      // Hindi/Hinglish
      /\b(konsa\s+best|which\s+one\s+is\s+better)\b/i,
      /\b(kisme\s+farak|kya\s+difference)\b/i
    ],

    weakPatterns: [
      /\b(better\s+than|worse\s+than)\b/i,
      /\b(selection\s+criteria|choose|choice)\b/i,
      /\b(preference|prefer)\b/i,
      
      // Hinglish
      /\b(best\s+kaun|acha\s+kaun)\b/i
    ],

    contextualClues: [
      /\bdifference\s+between\b/i,
      /\bcompare\s+(with|to)\b/i,
      /\bvs\s+/i,
      /\bversus\s+/i,
      /\bkonsa\s+(better|best|acha)\b/i,
      /\bfarak\s+(kya|hai)\b/i
    ],
    
    weight: 28
  },

  // =====================================================
  // 9️⃣ APPLICATION / USAGE / WHERE USED / PURPOSE
  // =====================================================
  APPLICATION: {
    strongPatterns: [
      /\b(use|usage|application)\b/i,
      /\b(kaha\s+use\s+hota|where\s+used|where\s+is\s+it\s+used)\b/i,
      /\b(purpose|function|role)\b/i,
      /\b(kis\s+liye|kyu\s+use)\b/i,
      /\b(used\s+for|used\s+in)\b/i,
      
      // Hindi/Hinglish
      /\b(kaha\s+lagta|kaha\s+use\s+karte)\b/i,
      /\b(upyog|istemal)\b/i
    ],

    weakPatterns: [
      /\b(practical\s+use|real\s+world\s+use)\b/i,
      /\b(industry\s+use|plant\s+use)\b/i,
      /\b(field\s+use)\b/i,
      
      // Hinglish
      /\b(lagta\s+kaha|use\s+hota\s+kaise)\b/i
    ],

    contextualClues: [
      /\bkaha\s+(use|lagta|istemal)\b/i,
      /\bwhere\s+(used|is\s+it\s+used)\b/i,
      /\bused\s+(for|in)\b/i,
      /\bpurpose\s+of\b/i,
      /\bfunction\s+of\b/i,
      /\bkis\s+liye\b/i
    ],
    
    weight: 26
  },

  // =====================================================
  // 🔟 TYPES / CLASSIFICATION / CATEGORIES / KINDS
  // =====================================================
  TYPES: {
    strongPatterns: [
      /\b(types|types\s+of|kitne\s+type)\b/i,
      /\b(classification|categories|kinds)\b/i,
      /\b(prakar|kya\s+kya\s+types)\b/i,
      /\b(varieties|how\s+many\s+types)\b/i,
      /\b(different\s+types)\b/i,
      
      // Hindi/Hinglish
      /\b(kitne\s+prakar|kitni\s+category)\b/i
    ],

    weakPatterns: [
      /\b(category|class)\b/i,
      /\b(variant|version)\b/i,
      
      // Hinglish
      /\b(kitne\s+hote|kya\s+kya\s+hote)\b/i
    ],

    contextualClues: [
      /\btypes\s+of\b/i,
      /\bhow\s+many\s+types\b/i,
      /\bkitne\s+(type|prakar)\b/i,
      /\bclassification\s+of\b/i,
      /\bkya\s+kya\s+types\b/i
    ],
    
    weight: 38
  },

  // =====================================================
  // 1️⃣1️⃣ CAUSES / REASON / WHY / ROOT CAUSE
  // =====================================================
  CAUSES: {
    strongPatterns: [
      /\b(reason|cause|causes|why)\b/i,
      /\b(kyu\s+hota|kyun\s+hota|karan)\b/i,
      /\b(why\s+does\s+it\s+happen|root\s+cause)\b/i,
      /\b(wajah|kaaran)\b/i,
      
      // Hindi/Hinglish
      /\b(kyu\s+ho\s+jata|kyun\s+aa\s+jata)\b/i
    ],

    weakPatterns: [
      /\b(because|due\s+to)\b/i,
      /\b(factor|source)\b/i,
      
      // Hinglish
      /\b(kaise\s+hota|kaise\s+ho\s+jata)\b/i
    ],

    contextualClues: [
      /\bwhy\s+(does|is)\b/i,
      /\breason\s+(for|of)\b/i,
      /\bkyu\s+(hota|hai)\b/i,
      /\bcause\s+of\b/i,
      /\bkaran\s+kya\b/i
    ],
    
    weight: 33
  },

  // =====================================================
  // 1️⃣2️⃣ SAFETY / PRECAUTION / RISK / HAZARD
  // =====================================================
  SAFETY: {
    strongPatterns: [
      /\b(safety|precaution|risk|hazard)\b/i,
      /\b(danger|safety\s+measure|safety\s+precaution)\b/i,
      /\b(risk\s+involved|precaution\s+lena)\b/i,
      /\b(safe\s+hai\s+ya\s+nahi)\b/i,
      
      // Hindi/Hinglish
      /\b(suraksha|kya\s+risk\s+hai)\b/i
    ],

    weakPatterns: [
      /\b(unsafe|unsafe\s+condition)\b/i,
      /\b(safe\s+practice|safe\s+procedure)\b/i,
      
      // Hinglish
      /\b(safety\s+ke\s+liye|risk\s+kya)\b/i
    ],

    contextualClues: [
      /\bsafety\s+(measure|precaution|risk)\b/i,
      /\brisk\s+(involved|hai)\b/i,
      /\bprecaution\s+(lena|kare)\b/i,
      /\bhazard\s+of\b/i
    ],
    
    weight: 25
  },

  // =====================================================
  // 1️⃣3️⃣ COST / TIME / FEASIBILITY / ECONOMICS
  // =====================================================
  COST_TIME: {
    strongPatterns: [
      /\b(cost|expense|kharcha|kitna\s+paisa)\b/i,
      /\b(time\s+lagega|kitna\s+time|duration)\b/i,
      /\b(downtime|budget|economical)\b/i,
      /\b(feasible|practical\s+hai|possible\s+hai)\b/i,
      /\b(viable)\b/i
    ],

    weakPatterns: [
      /\b(affordable|cheap|expensive)\b/i,
      /\b(quick|fast|slow)\b/i,
      
      // Hinglish
      /\b(jaldi\s+hoga|time\s+kitna)\b/i
    ],

    contextualClues: [
      /\bcost\s+of\b/i,
      /\bhow\s+much\s+(time|cost)\b/i,
      /\bkitna\s+(time|paisa)\b/i,
      /\beconomical\s+hai\b/i
    ],
    
    weight: 22
  },

  // =====================================================
  // 1️⃣4️⃣ REPORTING / DOCUMENTATION / FORMAT
  // =====================================================
  REPORTING: {
    strongPatterns: [
      /\b(report|reporting|format)\b/i,
      /\b(kaise\s+likhe|kaise\s+banaye|how\s+to\s+write)\b/i,
      /\b(documentation|record)\b/i,
      /\b(inspection\s+report|repair\s+report|ndt\s+report)\b/i,
      
      // Hindi/Hinglish
      /\b(report\s+kaise\s+banaye|observation\s+kaise\s+likhe)\b/i,
      /\b(remark\s+kaise\s+likhe|comment\s+kaise\s+likhe)\b/i
    ],

    weakPatterns: [
      /\b(document|paperwork)\b/i,
      /\b(form|template)\b/i,
      
      // Hinglish
      /\b(kaise\s+fill\s+kare|format\s+kya)\b/i
    ],

    contextualClues: [
      /\breport\s+(format|kaise|banaye)\b/i,
      /\bhow\s+to\s+write\s+report\b/i,
      /\bdocumentation\s+(process|kaise)\b/i,
      /\bkaise\s+(likhe|banaye)\b/i
    ],
    
    weight: 24
  }
}

function detectIntentWithConfidence(text) {
  const detectedIntents = []
  const cleanedText = text.toLowerCase()
  
  for (const [intentName, intentData] of Object.entries(ADVANCED_INTENT_PATTERNS)) {
    let confidence = 0
    const matches = {
      strong: [],
      weak: [],
      contextual: []
    }
    
    // ==========================================
    // CHECK STRONG PATTERNS (40 points max)
    // ==========================================
    for (const pattern of intentData.strongPatterns) {
      if (pattern.test(cleanedText)) {
        confidence += 40
        matches.strong.push(pattern.source)
        break // Only count first strong match
      }
    }
    
    // ==========================================
    // CHECK WEAK PATTERNS (20 points max)
    // ==========================================
    if (confidence === 0) {
      for (const pattern of intentData.weakPatterns) {
        if (pattern.test(cleanedText)) {
          confidence += 20
          matches.weak.push(pattern.source)
          break // Only count first weak match
        }
      }
    }
    
    // ==========================================
    // CHECK CONTEXTUAL CLUES (15 points each, max 30)
    // ==========================================
    let contextualScore = 0
    for (const clue of intentData.contextualClues) {
      if (clue.test(cleanedText)) {
        contextualScore += 15
        matches.contextual.push(clue.source)
        if (contextualScore >= 30) break // Cap at 30
      }
    }
    confidence += Math.min(contextualScore, 30)
    
    // ==========================================
    // ADD TO RESULTS IF CONFIDENCE > 0
    // ==========================================
    if (confidence > 0) {
      // Normalize confidence to 0-100 scale
      const normalizedConfidence = Math.min(
        (confidence / 70) * 100, // 70 is max possible (40+20+10)
        100
      )
      
      detectedIntents.push({
        intent: intentName,
        confidence: Math.round(normalizedConfidence),
        baseWeight: intentData.weight,
        matchType: matches.strong.length > 0 ? 'STRONG' :
                   matches.weak.length > 0 ? 'WEAK' : 'CONTEXTUAL',
        matches: matches,
        confidenceLevel: normalizedConfidence >= 70 ? 'HIGH' :
                        normalizedConfidence >= 40 ? 'MEDIUM' : 'LOW'
      })
    }
  }
  
  // Sort by confidence (highest first)
  detectedIntents.sort((a, b) => b.confidence - a.confidence)
  
  return {
    intents: detectedIntents,
    primaryIntent: detectedIntents[0] || null,
    supportingIntents: detectedIntents.slice(1, 3),
    intentCount: detectedIntents.length
  }
}

function resolveIntentConflicts(detectedIntents) {
  if (!detectedIntents || detectedIntents.length === 0) {
    return {
      finalIntent: null,
      supportingIntents: [],
      confidence: 0
    }
  }
  
  // ==========================================
  // RULE 1: PROBLEM intent is always supporting
  // ==========================================
  const filtered = detectedIntents.filter(i => i.intent !== 'PROBLEM')
  const problemIntent = detectedIntents.find(i => i.intent === 'PROBLEM')
  
  // ==========================================
  // RULE 2: CAUSES intent is always supporting
  // ==========================================
  const finalFiltered = filtered.filter(i => i.intent !== 'CAUSES')
  const causesIntent = filtered.find(i => i.intent === 'CAUSES')
  
  // ==========================================
  // RULE 3: DECISION gets +10 boost if present
  // ==========================================
  const boosted = finalFiltered.map(intent => {
    if (intent.intent === 'DECISION') {
      return {
        ...intent,
        confidence: Math.min(intent.confidence + 10, 100)
      }
    }
    return intent
  })
  
  // Sort again after boosting
  boosted.sort((a, b) => b.confidence - a.confidence)
  
  // ==========================================
  // FINAL RESULT
  // ==========================================
  const primaryIntent = boosted[0] || detectedIntents[0]
  const supportingIntents = []
  
  // Add other high-confidence intents as supporting
  for (let i = 1; i < boosted.length && i < 3; i++) {
    if (boosted[i].confidence >= 40) {
      supportingIntents.push(boosted[i])
    }
  }
  
  // Always include PROBLEM if detected
  if (problemIntent) {
    supportingIntents.push({
      ...problemIntent,
      role: 'CONTEXT'
    })
  }
  
  // Always include CAUSES if detected
  if (causesIntent) {
    supportingIntents.push({
      ...causesIntent,
      role: 'CONTEXT'
    })
  }
  
  return {
    finalIntent: primaryIntent,
    supportingIntents: supportingIntents,
    confidence: primaryIntent.confidence,
    intentCombination: [
      primaryIntent.intent,
      ...supportingIntents.map(i => i.intent)
    ].join(' + ')
  }
}

function routeAnswerBasedOnIntent(intentResolution) {
  const { finalIntent, supportingIntents } = intentResolution
  
  if (!finalIntent) {
    return {
      answerType: 'GENERAL',
      sections: ['shortAnswer'],
      priority: 'LOW'
    }
  }
  
  // ==========================================
  // ROUTING MAP
  // ==========================================
  const routingMap = {
    DEFINITION: {
      answerType: 'DEFINITION',
      sections: ['shortAnswer', 'longAnswer', 'summaryPoints'],
      priority: 'HIGH'
    },
    
    WORKING: {
      answerType: 'WORKING',
      sections: ['longAnswer', 'summaryPoints'],
      priority: 'HIGH'
    },
    
    PROCEDURE: {
      answerType: 'PROCEDURE',
      sections: ['longAnswer', 'summaryPoints'],
      requiresSteps: true,
      priority: 'HIGH'
    },
    
    REPAIR: {
      answerType: 'REPAIR',
      sections: ['longAnswer', 'summaryPoints'],
      requiresSteps: true,
      includeProblem: true,
      priority: 'CRITICAL'
    },
    
    IDENTIFICATION: {
      answerType: 'INSPECTION',
      sections: ['longAnswer', 'summaryPoints'],
      requiresChecklist: true,
      priority: 'HIGH'
    },
    
    DECISION: {
      answerType: 'DECISION',
      sections: ['shortAnswer', 'longAnswer'],
      requiresLimits: true,
      priority: 'CRITICAL'
    },
    
    COMPARISON: {
      answerType: 'COMPARISON',
      sections: ['longAnswer', 'summaryPoints'],
      requiresTable: true,
      priority: 'HIGH'
    },
    
    TYPES: {
      answerType: 'TYPES',
      sections: ['shortAnswer', 'longAnswer', 'summaryPoints'],
      requiresList: true,
      priority: 'HIGH'
    },
    
    APPLICATION: {
      answerType: 'APPLICATION',
      sections: ['shortAnswer', 'longAnswer'],
      priority: 'MEDIUM'
    },
    
    CAUSES: {
      answerType: 'CAUSES',
      sections: ['longAnswer', 'summaryPoints'],
      requiresList: true,
      priority: 'MEDIUM'
    },
    
    SAFETY: {
      answerType: 'SAFETY',
      sections: ['longAnswer', 'summaryPoints'],
      requiresWarning: true,
      priority: 'CRITICAL'
    },
    
    COST_TIME: {
      answerType: 'ESTIMATION',
      sections: ['shortAnswer'],
      priority: 'LOW'
    },
    
    REPORTING: {
      answerType: 'REPORTING',
      sections: ['longAnswer', 'summaryPoints'],
      requiresTemplate: true,
      priority: 'MEDIUM'
    }
  }
  
  const baseRoute = routingMap[finalIntent.intent] || {
    answerType: 'GENERAL',
    sections: ['shortAnswer', 'longAnswer'],
    priority: 'MEDIUM'
  }
  
  // ==========================================
  // ENHANCE WITH SUPPORTING INTENTS
  // ==========================================
  const enhancements = []
  
  for (const supportIntent of supportingIntents) {
    if (supportIntent.intent === 'PROBLEM') {
      enhancements.push('SHOW_PROBLEM_CONTEXT')
    }
    if (supportIntent.intent === 'PROCEDURE') {
      enhancements.push('SHOW_STEPS')
    }
    if (supportIntent.intent === 'CAUSES') {
      enhancements.push('SHOW_CAUSES')
    }
  }
  
  return {
    ...baseRoute,
    enhancements,
    intentCombination: intentResolution.intentCombination,
    confidence: intentResolution.confidence
  }
}

const CONTEXT_PATTERNS = {
  // ==========================================
  // CONDITIONAL SITUATIONS
  // ==========================================
  IF_DAMAGED: {
    patterns: [
      /\b(agar\s+kharab|if\s+damaged|if\s+broken)\b/i,
      /\b(agar\s+damage|agar\s+fail|if\s+fail)\b/i,
      /\b(kharab\s+ho\s+jaye|damage\s+ho\s+jaye)\b/i,
      /\b(kharab\s+ho\s+gaya|damage\s+ho\s+gaya)\b/i,
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
  
  // ==========================================
  // OPERATIONAL TIMING
  // ==========================================
  DURING_OPERATION: {
    patterns: [
      /\b(operation\s+mein|during\s+operation)\b/i,
      /\b(running\s+mein|during\s+running)\b/i,
      /\b(chalne\s+par|chalte\s+samay)\b/i,
      /\b(service\s+mein|in\s+service)\b/i,
      /\b(working\s+condition)\b/i
    ],
    modifier: "DURING_OPERATION"
  },
  
  DURING_SHUTDOWN: {
    patterns: [
      /\b(shutdown\s+mein|during\s+shutdown)\b/i,
      /\b(turnaround\s+mein|ta\s+mein)\b/i,
      /\b(outage\s+mein|plant\s+shutdown)\b/i,
      /\b(band\s+hone\s+par|shutdown\s+ke\s+time)\b/i
    ],
    modifier: "DURING_SHUTDOWN"
  },
  
  BEFORE_INSTALL: {
    patterns: [
      /\b(installation\s+se\s+pehle|before\s+installation)\b/i,
      /\b(lagane\s+se\s+pehle|before\s+fitting)\b/i,
      /\b(assembly\s+se\s+pehle)\b/i,
      /\b(pehle|before)\b/i
    ],
    modifier: "BEFORE_INSTALLATION"
  },
  
  AFTER_INSTALL: {
    patterns: [
      /\b(installation\s+ke\s+baad|after\s+installation)\b/i,
      /\b(lagane\s+ke\s+baad|after\s+fitting)\b/i,
      /\b(assembly\s+ke\s+baad)\b/i,
      /\b(baad\s+mein|after)\b/i
    ],
    modifier: "AFTER_INSTALLATION"
  },
  
  PRE_CLEANING: {
    patterns: [
      /\b(pre\s+cleaning|cleaning\s+se\s+pehle)\b/i,
      /\b(before\s+cleaning|saaf\s+karne\s+se\s+pehle)\b/i,
      /\b(pre\s+inspection)\b/i
    ],
    modifier: "PRE_CLEANING"
  },
  
  POST_CLEANING: {
    patterns: [
      /\b(post\s+cleaning|cleaning\s+ke\s+baad)\b/i,
      /\b(after\s+cleaning|saaf\s+karne\s+ke\s+baad)\b/i,
      /\b(post\s+inspection)\b/i
    ],
    modifier: "POST_CLEANING"
  },
  
  PRE_SHUTDOWN: {
    patterns: [
      /\b(pre\s+shutdown|shutdown\s+se\s+pehle)\b/i,
      /\b(before\s+shutdown)\b/i,
      /\b(band\s+karne\s+se\s+pehle)\b/i
    ],
    modifier: "PRE_SHUTDOWN"
  },
  
  POST_SHUTDOWN: {
    patterns: [
      /\b(post\s+shutdown|shutdown\s+ke\s+baad)\b/i,
      /\b(after\s+shutdown)\b/i,
      /\b(band\s+karne\s+ke\s+baad)\b/i
    ],
    modifier: "POST_SHUTDOWN"
  },
  
  // ==========================================
  // EQUIPMENT STATE
  // ==========================================
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
  
  // ==========================================
  // FREQUENCY
  // ==========================================
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
}

function detectContext(text) {
  const cleanedText = text.toLowerCase()
  const detectedContexts = []
  
  for (const [contextName, contextData] of Object.entries(CONTEXT_PATTERNS)) {
    for (const pattern of contextData.patterns) {
      if (pattern.test(cleanedText)) {
        detectedContexts.push({
          context: contextName,
          modifier: contextData.modifier,
          matchedPattern: pattern.source
        })
        break // One match per context type
      }
    }
  }
  
  return detectedContexts
}

function calculateSemanticSimilarity(userQuery, dbQuestion) {
  let totalScore = 0;
  const breakdown = [];

  const cleanedUserQuery = deepClean(userQuery);
  const userEntityResult = resolveEntity(cleanedUserQuery);

  const dbText = `${dbQuestion.question_en || ''} ${dbQuestion.question_hi || ''}`;
  const cleanedDbText = deepClean(dbText);
  const dbEntityResult = resolveEntity(cleanedDbText);

  // Strict Entity Count Matching
  if (userEntityResult.entityCount !== dbEntityResult.entityCount) {
    return {
      totalScore: 0,
      breakdown: [{
        component: 'ENTITY_COUNT_MISMATCH',
        score: 0,
        details: `User entities: ${userEntityResult.entityCount}, DB entities: ${dbEntityResult.entityCount}`
      }],
      confidence: 'NO_MATCH'
    };
  }

  // If entity counts match, proceed with scoring
  const expansionResult = intelligentExpansion(cleanedUserQuery);
  const intentResult = detectIntentWithConfidence(cleanedUserQuery);
  const intentResolution = resolveIntentConflicts(intentResult.intents);
  const contextResult = detectContext(cleanedUserQuery);

  const dbIntentResult = detectIntentWithConfidence(cleanedDbText);
  const dbIntentResolution = resolveIntentConflicts(dbIntentResult.intents);
  const dbContextResult = detectContext(cleanedDbText);
  
  // SCORE 1: Entity Match (40 points MAX)
  let entityScore = 0;
  if (userEntityResult.entities.length > 0 && dbEntityResult.entities.length > 0) {
    const topUserEntity = userEntityResult.topEntity;
    const topDbEntity = dbEntityResult.topEntity;

    if (topUserEntity.entity === topDbEntity.entity) {
      const avgConfidence = (topUserEntity.confidence + topDbEntity.confidence) / 2;
      entityScore = (avgConfidence / 100) * 40;
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: entityScore,
        details: `Exact match: ${topUserEntity.displayName}`,
        userConfidence: topUserEntity.confidence,
        dbConfidence: topDbEntity.confidence,
      });
    } else {
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: 0,
        details: `No match: ${topUserEntity.displayName} vs ${topDbEntity.displayName}`,
      });
    }
  } else {
    // Fallback: Direct keyword matching using question text
    const userTokens = cleanedUserQuery.split(' ').filter(w => w.length > 2);
    const dbTokens = cleanedDbText.split(' ').filter(w => w.length > 2);
    let matches = 0;
    for (const token of userTokens) {
      if (dbTokens.some(dbToken => dbToken.includes(token) || token.includes(dbToken))) {
        matches++;
      }
    }
    if (userTokens.length > 0) {
      entityScore = (matches / userTokens.length) * 40;
      breakdown.push({
        component: 'ENTITY_MATCH_KEYWORD',
        score: entityScore,
        details: `Keyword fallback: ${matches}/${userTokens.length} matches`,
      });
    }
  }
  totalScore += entityScore;

  // SCORE 2: Intent Match (35 points MAX)
  let intentScore = 0;
  if (intentResolution.finalIntent && dbIntentResolution.finalIntent) {
    const userIntent = intentResolution.finalIntent.intent;
    const dbIntent = dbIntentResolution.finalIntent.intent;

    if (userIntent === dbIntent) {
      const avgConfidence = (intentResolution.finalIntent.confidence + dbIntentResolution.finalIntent.confidence) / 2;
      intentScore = (avgConfidence / 100) * 35;
      breakdown.push({
        component: 'INTENT_MATCH_PRIMARY',
        score: intentScore,
        details: `Exact intent match: ${userIntent}`,
      });
    } else {
      const userIntents = [userIntent, ...intentResolution.supportingIntents.map(i => i.intent)];
      const dbIntents = [dbIntent, ...dbIntentResolution.supportingIntents.map(i => i.intent)];
      const commonIntents = userIntents.filter(ui => dbIntents.includes(ui));
      if (commonIntents.length > 0) {
        intentScore = (commonIntents.length / userIntents.length) * 20;
        breakdown.push({
          component: 'INTENT_MATCH_PARTIAL',
          score: intentScore,
          details: `Partial intent match: ${commonIntents.join(', ')}`,
        });
      }
    }
  }
  totalScore += intentScore;

  // SCORE 3: Query Expansion Match (15 points MAX)
  let expansionScore = 0;
  const maxExpansionScore = 15;
  const dbTextForExpansion = cleanedDbText;
  for (const expandedQuery of expansionResult.expansions) {
    const expandedTokens = expandedQuery.split(' ').filter(w => w.length > 2);
    let matches = 0;
    for (const token of expandedTokens) {
      if (dbTextForExpansion.includes(token)) {
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
    details: `Best of ${expansionResult.expansions.length} expansions`,
  });

  // SCORE 4: Fuzzy Keyword Overlap (10 points MAX)
  const userTokens = cleanedUserQuery.split(' ').filter(w => w.length > 2);
  const dbTokens = cleanedDbText.split(' ').filter(w => w.length > 2);
  let fuzzyMatches = 0;
  for (const token of userTokens) {
    for (const dbToken of dbTokens) {
      if (token.length > 3 && dbToken.length > 3) {
        if (levenshteinDistance(token, dbToken) <= 2) {
          fuzzyMatches++;
          break;
        }
      }
    }
  }
  const fuzzyScore = userTokens.length > 0 ? (fuzzyMatches / userTokens.length) * 10 : 0;
  totalScore += fuzzyScore;
  breakdown.push({
    component: 'FUZZY_MATCH',
    score: fuzzyScore,
    details: `${fuzzyMatches}/${userTokens.length} fuzzy matches`,
  });

  totalScore = Math.min(totalScore, 100);

  return {
    totalScore: Math.round(totalScore),
    breakdown,
    userProcessing: {
      cleaned: cleanedUserQuery,
      entities: userEntityResult.entities,
      intents: intentResolution,
      contexts: contextResult,
      expansions: expansionResult.expansions,
    },
    dbProcessing: {
      entities: dbEntityResult.entities,
      intents: dbIntentResolution,
      contexts: dbContextResult,
    },
    confidence: totalScore >= 85 ? 'VERY_HIGH' : totalScore >= 70 ? 'HIGH' : totalScore >= 55 ? 'MEDIUM' : 'LOW',
  };
}

function adaptiveThreshold(allScores) {
  if (allScores.length === 0) return 90
  
  const topScore = allScores[0].totalScore
  const secondScore = allScores.length > 1 ? allScores[1].totalScore : 0
  const thirdScore = allScores.length > 2 ? allScores[2].totalScore : 0
  
  const gap1to2 = topScore - secondScore
  const gap2to3 = secondScore - thirdScore
  
  // ==========================================
  // RULE 1: Clear winner with big gap
  // ==========================================
  if (gap1to2 > 30) {
    return 65  // Very lenient - clear winner
  }
  
  // ==========================================
  // RULE 2: Good winner with decent gap
  // ==========================================
  if (gap1to2 > 20) {
    return 75  // Moderate
  }
  
  // ==========================================
  // RULE 3: Close competition
  // ==========================================
  if (gap1to2 > 10) {
    return 85  // Strict
  }
  
  // ==========================================
  // RULE 4: Very close - be very strict
  // ==========================================
  return 90
}

function contextualBoost(matchResult, userQuery, dbQuestion) {
  let boost = 0
  const boostReasons = []
  
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
    }
    
    const catKeywords = categoryKeywords[dbQuestion.category] || []
    if (catKeywords.some(k => userQuery.toLowerCase().includes(k))) {
      boost += 5
      boostReasons.push('Category match')
    }
  }
  
  // ==========================================
  // BOOST 2: Question Complexity Match (3 points)
  // ==========================================
  const userComplexity = userQuery.split(' ').length
  const dbComplexity = (dbQuestion.question_en || '').split(' ').length
  const complexityDiff = Math.abs(userComplexity - dbComplexity)
  
  if (complexityDiff <= 2) {
    boost += 3
    boostReasons.push('Similar complexity')
  } else if (complexityDiff <= 5) {
    boost += 1
    boostReasons.push('Moderate complexity match')
  }
  
  // ==========================================
  // BOOST 3: Language Consistency (2 points)
  // ==========================================
  const hindiPattern = /[\u0900-\u097F]/
  const hinglishPattern = /\b(kya|hai|kaise|kare|hota|mein|ke|ka)\b/i
  
  const userHasHindi = hindiPattern.test(userQuery)
  const userHasHinglish = hinglishPattern.test(userQuery)
  const dbHasHindi = hindiPattern.test(dbQuestion.question_hi || '')
  
  if ((userHasHindi || userHasHinglish) && dbHasHindi) {
    boost += 2
    boostReasons.push('Language consistency')
  }
  
  // ==========================================
  // BOOST 4: Tag Overlap (2 points)
  // ==========================================
  if (dbQuestion.tags && dbQuestion.tags.length > 0) {
    const userLower = userQuery.toLowerCase()
    const tagMatches = dbQuestion.tags.filter(tag => 
      userLower.includes(tag.toLowerCase())
    )
    
    if (tagMatches.length > 0) {
      boost += 2
      boostReasons.push(`Tag match: ${tagMatches.join(', ')}`)
    }
  }
  
  // ==========================================
  // BOOST 5: Difficulty Match (2 points)
  // ==========================================
  if (dbQuestion.difficulty) {
    const userHasBasic = /\b(basic|simple|easy|introduction)\b/i.test(userQuery)
    const userHasAdvanced = /\b(advanced|complex|detailed|depth)\b/i.test(userQuery)
    
    if (userHasBasic && dbQuestion.difficulty === 'easy') {
      boost += 2
      boostReasons.push('Difficulty match (easy)')
    } else if (userHasAdvanced && dbQuestion.difficulty === 'hard') {
      boost += 2
      boostReasons.push('Difficulty match (hard)')
    } else if (!userHasBasic && !userHasAdvanced && dbQuestion.difficulty === 'medium') {
      boost += 1
      boostReasons.push('Difficulty match (medium)')
    }
  }
  
  return {
    ...matchResult,
    totalScore: Math.min(matchResult.totalScore + boost, 100),
    boost,
    boostReasons,
    finalConfidence: matchResult.totalScore + boost >= 85 ? 'VERY_HIGH' :
                     matchResult.totalScore + boost >= 70 ? 'HIGH' :
                     matchResult.totalScore + boost >= 55 ? 'MEDIUM' : 'LOW'
  }
}

export async function intelligentQuestionMatch(userQuery, dbQuestions) {
  console.log('🔍 Starting intelligent search for:', userQuery)
  
  const startTime = Date.now()
  const allScores = []
  
  // ==========================================
  // STEP 1: Score all questions
  // ==========================================
  for (const question of dbQuestions) {
    let matchResult = calculateSemanticSimilarity(userQuery, question)
    
    // Only boost if the score is not 0 (i.e., it passed the entity count check)
    if (matchResult.totalScore > 0) {
        matchResult = contextualBoost(matchResult, userQuery, question)
    }
    
    allScores.push({
      question,
      ...matchResult
    })
  }
  
  // ==========================================
  // STEP 2: Sort by score
  // ==========================================
  allScores.sort((a, b) => b.totalScore - a.totalScore)
  
  // ==========================================
  // STEP 3: Calculate adaptive threshold
  // ==========================================
  const threshold = adaptiveThreshold(allScores)
  
  // ==========================================
  // STEP 4: Filter qualified matches
  // ==========================================
  const qualifiedMatches = allScores.filter(s => s.totalScore >= threshold)
  
  // ==========================================
  // STEP 5: Prepare result
  // ==========================================
  const processingTime = Date.now() - startTime
  
  const result = {
    success: qualifiedMatches.length > 0,
    topMatch: qualifiedMatches[0] || null,
    alternativeMatches: qualifiedMatches.slice(1, 3),
    totalScanned: dbQuestions.length,
    totalMatched: qualifiedMatches.length,
    threshold,
    processingTime: `${processingTime}ms`,
    
    // User query processing details
    queryAnalysis: qualifiedMatches[0]?.userProcessing || null,
    
    // Top 5 scores for debugging
    debugInfo: {
      topScores: allScores.slice(0, 5).map(s => ({
        questionId: s.question.id || 'N/A',
        questionEn: s.question.question_en,
        score: s.totalScore,
        confidence: s.finalConfidence,
        breakdown: s.breakdown,
        boost: s.boost,
        boostReasons: s.boostReasons
      }))
    }
  }
  
  // ==========================================
  // STEP 6: Log results
  // ==========================================
  console.log('📊 Search Results:')
  console.log(`   ├─ Threshold: ${threshold}`)
  console.log(`   ├─ Matched: ${qualifiedMatches.length}/${dbQuestions.length}`)
  console.log(`   ├─ Processing time: ${processingTime}ms`)
  
  if (result.topMatch) {
    console.log(`   └─ Top match: "${result.topMatch.question.question_en}" (${result.topMatch.totalScore}%)`)
  } else {
    console.log(`   └─ No matches found`)
  }
  
  return result
}

    