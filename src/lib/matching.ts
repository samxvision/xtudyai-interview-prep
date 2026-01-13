// @ts-nocheck
import type { Question } from '@/types';
import { ENTITY_SEMANTIC_MAP } from './acronyms';

// 🔥 **LAYER 1: ADVANCED NOISE CANCELLATION + INTELLIGENT QUERY EXPANSION**
// ---

// **PHASE 1A: COMPREHENSIVE DEEP CLEANING**
const DEEP_NOISE_PATTERNS = {
  metaTalk: [
    /tumne\s+(.+?)\s+(dekha|dekhaa|dekhi|suna|sunaa|kiya|padha|padhaa)\s+(hai|ho|tha)/gi,
    /aapne\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|ho)/gi,
    /maine\s+(.+?)\s+(dekha|suna|kiya|padha)\s+(hai|tha)/gi,
    /mujhe\s+samajh\s+nahi\s+aa\s+raha/gi,
    /mujhe\s+samjh\s+nahi\s+aaya/gi,
    /samajh\s+me\s+nahi\s+aa\s+raha/gi,
    /samjh\s+nahi\s+aati/gi,
    /interview\s+me\s+(poocha|pucha|aaya|question)/gi,
    /interview\s+question\s+(hai|tha)/gi,
    /viva\s+me\s+poocha/gi,
    /exam\s+me\s+(aaya|tha)/gi,
    /koi\s+bata\s+sakta\s+hai/gi,
    /kya\s+aap\s+bata\s+sakte/gi,
    /agar\s+pata\s+ho\s+toh/gi,
    /agar\s+aapko\s+pata\s+hai/gi,
    /thoda\s+help\s+karo/gi,
    /help\s+chahiye/gi
  ],
  conversationalStarters: [
    /tum\s+mujhe\s+(ab|abhi|jaldi|please|zara|thoda)?\s*/gi,
    /tum\s+hamko\s+(ab|abhi)?\s*/gi,
    /tum\s+batao\s+(ki|ke|yaar|bhai)?\s*/gi,
    /tum\s+bataiye\s+(ki|ke)?\s*/gi,
    /tum\s+mujhe\s+(ab|abhi)?\s+(yeah|ye|yeh)?\s+batao/gi,
    /tum\s+mujhe\s+ab\s+batao/gi,
    /tum\s+ab\s+batao/gi,
    /aap\s+mujhe\s+(ab|abhi|please|kripya)?\s*/gi,
    /aap\s+bataiye\s+(ki|ke|na)?\s*/gi,
    /aap\s+batao\s+(ki|ke)?\s*/gi,
    /aapko\s+pata\s+hai\s+toh\s+batao/gi,
    /mujhe\s+(ab|abhi|jaldi|please|zara)?\s+batao/gi,
    /mujhe\s+bataiye/gi,
    /mujhe\s+samjhao/gi,
    /mujhe\s+samjhaiye/gi,
    /mujhe\s+janna\s+hai\s+(ki|ke)?\s*/gi,
    /mujhe\s+pata\s+karna\s+hai/gi,
    /mujhe\s+chahiye/gi,
    /please\s+(tell|explain|describe|help)/gi,
    /kindly\s+(tell|explain|describe)/gi,
    /can\s+you\s+(tell|explain|describe|help)/gi,
    /could\s+you\s+(tell|explain|describe)/gi,
    /would\s+you\s+(tell|explain|describe)/gi,
    /will\s+you\s+(tell|explain|describe)/gi,
    /i\s+want\s+to\s+know/gi,
    /i\s+wanna\s+know/gi,
    /i\s+need\s+to\s+know/gi,
    /i\s+would\s+like\s+to\s+know/gi,
    /i'd\s+like\s+to\s+know/gi,
    /batao\s+(ki|ke|yaar|bhai|na)?\s*/gi,
    /bataiye\s+(ki|ke|na)?\s*/gi,
    /bata\s+do\s+(ki|ke)?\s*/gi,
    /bata\s+dijiye\s+(ki|ke)?\s*/gi,
    /yeah\s+batao/gi,
    /ye\s+batao/gi,
    /yeh\s+batao/gi,
    /iska\s+batao/gi,
    /uska\s+batao/gi,
    /iske\s+baare\s+me\s+batao/gi,
    /^(toh|to|so|well|ok|okay|accha|achha|thik\s+hai)\s+/gi,
    /^(listen|suno|dekho|dekhiye)\s+/gi,
    /^(arre|yaar|bhai|sir|madam)\s+/gi
  ],
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
  pureFillers: [
    /\b(yaar|bhai|dost|sir|madam|ji)\b/gi,
    /\b(accha|achha|acha|theek|thik|ok|okay|okie)\b/gi,
    /\b(haan|han|nahi|nhi|na)\b/gi,
    /\b(arre|are|arey)\b/gi,
    /\b(dekho|dekhiye|suno|suniye|sunno)\b/gi,
    /\b(well|so|like|actually|basically|technically)\b/gi,
    /\b(you\s+know|i\s+mean|as\s+such)\b/gi,
    /\b(right|correct|exactly)\b/gi,
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
    /start\s+se\s+end\s+tak/gi,
    /puri\s+process/gi,
    /complete\s+process/gi,
    /detail\s+me/gi,
    /detailed/gi
  ]
}

function deepClean(text) {
  let cleaned = text.toLowerCase().trim()
  const metaMatch = cleaned.match(
    /(?:tumne|aapne|maine)\s+(.+?)\s+(?:dekha|dekhaa|suna|kiya|padha)\s+(?:hai|ho|tha)(.+?)(?:uska|iska|us\s+ka|is\s+ka)\s+(kaam|matlab|definition|working|function|use|application)\s+(?:kya|kaise)/i
  )
  if (metaMatch) {
    const entity = metaMatch[1].trim()
    const property = metaMatch[3].trim()
    cleaned = `${entity} ${property} kya hota`
  }
  const jannaMatch = cleaned.match(/mujhe\s+janna\s+hai\s+ki\s+(.+)/i)
  if (jannaMatch) {
    cleaned = jannaMatch[1].trim()
  }
  const bataoMatch = cleaned.match(/(?:tum|aap)\s+mujhe\s+(?:ab|abhi)?\s*(?:ye|yeh|yeah)?\s*batao\s+ki\s+(.+)/i)
  if (bataoMatch) {
    cleaned = bataoMatch[1].trim()
  }
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
  cleaned = cleaned
    .replace(/[?!.,;:"'\(\)\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned
}

// **PHASE 1B: INTELLIGENT QUERY EXPANSION (CONTEXT-AWARE)**
const QUERY_EXPANSION_MAP = {
  partialEntityExpansion: {
    "exchanger": {
      expansions: ["heat exchanger", "exchanger"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    "vessel": {
      expansions: ["pressure vessel", "vessel"],
      confidence: "HIGH",
      condition: "ALWAYS"
    },
    "heat": {
      expansions: ["heat"],
      confidence: "LOW",
      condition: "NEVER",
      note: "Could mean temperature, thermal energy, etc."
    },
    "pressure": {
      expansions: ["pressure"],
      confidence: "LOW",
      condition: "NEVER",
      note: "Could mean pressure value, pressure test, etc."
    },
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
  intentExpansion: {
    "matlab": ["kya hai", "kya hota hai", "definition", "meaning", "what is"],
    "meaning": ["kya hai", "definition", "matlab", "what is"],
    "definition": ["kya hai", "what is", "meaning", "matlab"],
    "define": ["kya hai", "definition", "what is"],
    "kaam": ["working", "function", "operation", "kaise kaam karta", "kaise kaam karti"],
    "working": ["kaam", "function", "operation", "kaise kaam karta"],
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
}

function intelligentExpansion(cleaned) {
  const words = cleaned.split(' ')
  const expansions = [cleaned]
  let expansionLog = []
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const entityConfig = QUERY_EXPANSION_MAP.partialEntityExpansion[word]
    if (!entityConfig) continue
    if (entityConfig.condition === "NEVER") {
      expansionLog.push(`❌ Skipped "${word}" (could be ambiguous)`)
      continue
    }
    if (entityConfig.condition === "ALWAYS") {
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
      const prevWord = i > 0 ? words[i - 1] : null
      const nextWord = i < words.length - 1 ? words[i + 1] : null
      let expanded = false
      if (prevWord && entityConfig.adjacentWords?.includes(prevWord)) {
        const expandTo = entityConfig.expandTo[prevWord]
        if (expandTo) {
          const newQuery = words.slice()
          newQuery[i - 1] = expandTo
          newQuery.splice(i, 1)
          expansions.push(newQuery.join(' '))
          expansionLog.push(`✅ Combined "${prevWord} ${word}" → "${expandTo}"`)
          expanded = true
        }
      }
      if (nextWord && entityConfig.adjacentWords?.includes(nextWord)) {
        const expandTo = entityConfig.expandTo[nextWord]
        if (expandTo) {
          const newQuery = words.slice()
          newQuery[i] = expandTo
          newQuery.splice(i + 1, 1)
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
  const uniqueExpansions = [...new Set(expansions)]
  return {
    expansions: uniqueExpansions,
    log: expansionLog,
    originalQuery: cleaned
  }
}

// **COMPLETE LAYER 1 FUNCTION**
function layer1Processing(userQuery) {
  // console.log('🔍 Original Query:', userQuery)
  const cleaned = deepClean(userQuery)
  // console.log('🧹 After Cleaning:', cleaned)
  const expansionResult = intelligentExpansion(cleaned)
  // console.log('🔄 Expansions:', expansionResult.expansions)
  // console.log('📋 Expansion Log:', expansionResult.log)
  return {
    original: userQuery,
    cleaned: cleaned,
    expansions: expansionResult.expansions,
    expansionLog: expansionResult.log
  }
}

// ---
// 🔥 **LAYER 2: ADVANCED SEMANTIC ENTITY RESOLUTION**
// ---

// **🧠 LAYER 2: ENTITY RESOLUTION ENGINE**
function resolveEntity(text) {
  const resolvedEntities = []
  const textLower = text.toLowerCase()
  for (const [entityKey, semantics] of Object.entries(ENTITY_SEMANTIC_MAP)) {
    let score = 0
    let matchType = null
    let matchedTerm = null
    for (const core of semantics.coreTerms) {
      if (textLower.includes(core.toLowerCase())) {
        score = 100
        matchType = 'CORE'
        matchedTerm = core
        break
      }
    }
    if (score === 0 && semantics.abbreviations.length > 0) {
      for (const abbr of semantics.abbreviations) {
        const regex = new RegExp(`\\b${abbr}\\b`, 'i')
        if (regex.test(textLower)) {
          score = 95
          matchType = 'ABBREVIATION'
          matchedTerm = abbr
          break
        }
      }
    }
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
    if (score === 0) {
      let partialMatches = 0
      const matchedPartials = []
      for (const partial of semantics.partialTerms) {
        const regex = new RegExp(`\\b${partial}\\b`, 'i')
        if (regex.test(textLower)) {
          partialMatches++
          matchedPartials.push(partial)
        }
      }
      if (partialMatches >= 2) {
        score = 80
        matchType = 'PARTIAL_MULTIPLE'
        matchedTerm = matchedPartials.join(' + ')
      } else if (partialMatches === 1) {
        const strongPartials = ['exchanger', 'vessel', 'column', 'tower']
        if (strongPartials.some(sp => matchedPartials[0].includes(sp))) {
          score = 60
          matchType = 'PARTIAL_STRONG'
          matchedTerm = matchedPartials[0]
        } else {
          score = 30
          matchType = 'PARTIAL_WEAK'
          matchedTerm = matchedPartials[0]
        }
      }
    }
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
  resolvedEntities.sort((a, b) => b.confidence - a.confidence)
  return {
    entities: resolvedEntities,
    topEntity: resolvedEntities[0] || null,
    entityCount: resolvedEntities.length
  }
}

// **🔧 HELPER: LEVENSHTEIN DISTANCE**
function levenshteinDistance(str1, str2) {
  const m = str1.length
  const n = str2.length
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        )
      }
    }
  }
  return dp[m][n]
}

// 🔥 **LAYER 3: ADVANCED MULTI-INTENT DETECTION WITH CONFIDENCE**
// ---

// **📋 COMPLETE INTENT PATTERN DICTIONARY**
const ADVANCED_INTENT_PATTERNS = {
  DEFINITION: {
    strongPatterns: [
      /\b(kya hai|kya hota hai|what is|define)\b/i,
      /\b(definition|meaning|matlab)\b/i,
      /\b(explain\s+what\s+is)\b/i,
      /\b(can\s+you\s+define|please\s+define)\b/i,
      /\b(what\s+do\s+you\s+mean\s+by)\b/i,
      /\b(meaning\s+of)\b/i,
      /\b(ka\s+arth|ka\s+matlab\s+kya)\b/i,
      /\b(iska\s+matlab\s+kya\s+hai)\b/i,
      /\b(define\s+karo|define\s+kijiye)\b/i
    ],
    weakPatterns: [
      /\b(bataiye|batao|explain|describe)\b/i,
      /\b(samjhao|samjhaiye|tell\s+me)\b/i,
      /\b(about|regarding)\b/i,
      /\b(introduction|intro)\b/i,
      /\b(basic\s+idea|basic\s+knowledge|basic\s+concept)\b/i,
      /\b(short\s+note|brief\s+note)\b/i,
      /\b(overview)\b/i,
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
  WORKING: {
    strongPatterns: [
      /\b(kaise\s+kaam\s+karta|kaise\s+kaam\s+karti)\b/i,
      /\b(how\s+it\s+works|how\s+does\s+it\s+work)\b/i,
      /\b(working\s+principle|operating\s+principle)\b/i,
      /\b(function\s+kya|kaam\s+kya\s+hai)\b/i,
      /\b(principle\s+of\s+working|principle\s+of\s+operation)\b/i,
      /\b(functioning\s+of)\b/i,
      /\b(mechanism\s+of)\b/i,
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
  PROCEDURE: {
    strongPatterns: [
      /\b(kaise\s+kare|kaise\s+karte|kaise\s+kiya)\b/i,
      /\b(how\s+to|how\s+do\s+we|how\s+to\s+perform)\b/i,
      /\b(step\s+by\s+step|stepwise|step\s+wise)\b/i,
      /\b(procedure|process|method|steps)\b/i,
      /\b(inspection\s+procedure|testing\s+procedure)\b/i,
      /\b(repair\s+procedure|installation\s+procedure)\b/i,
      /\b(cleaning\s+procedure|maintenance\s+procedure)\b/i,
      /\b(removal\s+procedure|assembly\s+procedure)\b/i,
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
  REPAIR: {
    strongPatterns: [
      /\b(repair|fix|thik\s+kar|theek\s+kar)\b/i,
      /\b(kaise\s+repair|how\s+to\s+repair)\b/i,
      /\b(rectify|rectification|sudhar)\b/i,
      /\b(repair\s+kaise|thik\s+kaise)\b/i,
      /\b(maintenance|maintain\s+kaise)\b/i,
      /\b(corrective\s+action|remedial\s+action)\b/i,
      /\b(kaise\s+theek\s+kare|kaise\s+thik\s+ho)\b/i,
      /\b(sudharna|sudharne\s+ka\s+tarika)\b/i,
      /\b(repair\s+karenge|fix\s+karenge)\b/i
    ],
    weakPatterns: [
      /\b(resolve|solve|solution)\b/i,
      /\b(restore|restoration)\b/i,
      /\b(overhaul|rework)\b/i,
      /\b(rebuild|refurbish)\b/i,
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
  PROBLEM: {
    strongPatterns: [
      /\b(problem|issue|fault|failure)\b/i,
      /\b(kharab|damage|defect|galti)\b/i,
      /\b(leak|leakage|crack|corrosion)\b/i,
      /\b(fail\s+ho|kharab\s+ho|damage\s+ho)\b/i,
      /\b(not\s+working|work\s+nahi\s+kar\s+raha)\b/i,
      /\b(kharabi|खराबी|problem\s+aa\s+raha)\b/i,
      /\b(issue\s+aa\s+rahi)\b/i
    ],
    weakPatterns: [
      /\b(breakdown|malfunction)\b/i,
      /\b(abnormal|unusual)\b/i,
      /\b(deterioration|degradation)\b/i,
      /\b(wear|erosion|pitting)\b/i,
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
  IDENTIFICATION: {
    strongPatterns: [
      /\b(identify|identification|pehchan)\b/i,
      /\b(kaise\s+pata|how\s+to\s+identify)\b/i,
      /\b(inspect|inspection|check|examine)\b/i,
      /\b(detect|detection|find)\b/i,
      /\b(kaise\s+check|kaise\s+inspect)\b/i,
      /\b(verify|verification)\b/i,
      /\b(kaise\s+dekhte|kaise\s+dekhe|kaise\s+pata\s+kare)\b/i,
      /\b(pehchan\s+kaise)\b/i
    ],
    weakPatterns: [
      /\b(recognition|locate|location)\b/i,
      /\b(testing|test\s+kaise)\b/i,
      /\b(measurement|measure)\b/i,
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
  DECISION: {
    strongPatterns: [
      /\b(acceptable|acceptance\s+criteria|accept)\b/i,
      /\b(reject|rejection\s+criteria|rejection\s+limit)\b/i,
      /\b(pass|fail|pass\s+or\s+fail)\b/i,
      /\b(limit|allowable\s+limit|tolerance\s+limit)\b/i,
      /\b(as\s+per\s+code|as\s+per\s+standard|code\s+requirement)\b/i,
      /\b(acceptable\s+hai\s+ya\s+nahi|chal\s+jayega\s+ya\s+nahi)\b/i,
      /\b(use\s+kar\s+sakte\s+ya\s+nahi)\b/i,
      /\b(standard\s+ke\s+according|code\s+ke\s+hisab\s+se)\b/i
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
      /\bpass\s+or\s+fail\b/i,
      /\bchal\s+jayega\b/i,
      /\buse\s+kar\s+sakte\b/i
    ],
    weight: 32
  },
  COMPARISON: {
    strongPatterns: [
      /\b(difference\s+between|farak\s+kya)\b/i,
      /\b(compare|comparison|versus|vs)\b/i,
      /\b(which\s+is\s+better|konsa\s+better)\b/i,
      /\b(advantage|disadvantage|pros\s+and\s+cons)\b/i,
      /\b(benefit|limitation|drawback)\b/i,
      /\b(konsa\s+best|which\s+one\s+is\s+better)\b/i,
      /\b(kisme\s+farak|kya\s+difference)\b/i
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
      /\bversus\s+/i,
      /\bkonsa\s+(better|best|acha)\b/i,
      /\bfarak\s+(kya|hai)\b/i
    ],
    weight: 28
  },
  APPLICATION: {
    strongPatterns: [
      /\b(use|usage|application)\b/i,
      /\b(kaha\s+use\s+hota|where\s+used|where\s+is\s+it\s+used)\b/i,
      /\b(purpose|function|role)\b/i,
      /\b(kis\s+liye|kyu\s+use)\b/i,
      /\b(used\s+for|used\s+in)\b/i,
      /\b(kaha\s+lagta|kaha\s+use\s+karte)\b/i,
      /\b(upyog|istemal)\b/i
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
      /\bpurpose\s+of\b/i,
      /\bfunction\s+of\b/i,
      /\bkis\s+liye\b/i
    ],
    weight: 26
  },
  TYPES: {
    strongPatterns: [
      /\b(types|types\s+of|kitne\s+type)\b/i,
      /\b(classification|categories|kinds)\b/i,
      /\b(prakar|kya\s+kya\s+types)\b/i,
      /\b(varieties|how\s+many\s+types)\b/i,
      /\b(different\s+types)\b/i,
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
      /\bclassification\s+of\b/i,
      /\bkya\s+kya\s+types\b/i
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
      /\bcause\s+of\b/i,
      /\bkaran\s+kya\b/i
    ],
    weight: 33
  },
  SAFETY: {
    strongPatterns: [
      /\b(safety|precaution|risk|hazard)\b/i,
      /\b(danger|safety\s+measure|safety\s+precaution)\b/i,
      /\b(risk\s+involved|precaution\s+lena)\b/i,
      /\b(safe\s+hai\s+ya\s+nahi)\b/i,
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
      /\bprecaution\s+(lena|kare)\b/i,
      /\bhazard\s+of\b/i
    ],
    weight: 25
  },
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
  REPORTING: {
    strongPatterns: [
      /\b(report|reporting|format)\b/i,
      /\b(kaise\s+likhe|kaise\s+banaye|how\s+to\s+write)\b/i,
      /\b(documentation|record)\b/i,
      /\b(inspection\s+report|repair\s+report|ndt\s+report)\b/i,
      /\b(report\s+kaise\s+banaye|observation\s+kaise\s+likhe)\b/i,
      /\b(remark\s+kaise\s+likhe|comment\s+kaise\s+likhe)\b/i
    ],
    weakPatterns: [
      /\b(document|paperwork)\b/i,
      /\b(form|template)\b/i,
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

// **🧠 INTENT DETECTION ENGINE**
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
    for (const pattern of intentData.strongPatterns) {
      if (pattern.test(cleanedText)) {
        confidence += 40
        matches.strong.push(pattern.source)
        break
      }
    }
    if (confidence === 0) {
      for (const pattern of intentData.weakPatterns) {
        if (pattern.test(cleanedText)) {
          confidence += 20
          matches.weak.push(pattern.source)
          break
        }
      }
    }
    let contextualScore = 0
    for (const clue of intentData.contextualClues) {
      if (clue.test(cleanedText)) {
        contextualScore += 15
        matches.contextual.push(clue.source)
        if (contextualScore >= 30) break
      }
    }
    confidence += Math.min(contextualScore, 30)
    if (confidence > 0) {
      const normalizedConfidence = Math.min(
        (confidence / 70) * 100,
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
  detectedIntents.sort((a, b) => b.confidence - a.confidence)
  return {
    intents: detectedIntents,
    primaryIntent: detectedIntents[0] || null,
    supportingIntents: detectedIntents.slice(1, 3),
    intentCount: detectedIntents.length
  }
}

// **⚖️ INTENT CONFLICT RESOLUTION**
function resolveIntentConflicts(detectedIntents) {
  if (!detectedIntents || detectedIntents.length === 0) {
    return {
      finalIntent: null,
      supportingIntents: [],
      confidence: 0
    }
  }
  const filtered = detectedIntents.filter(i => i.intent !== 'PROBLEM')
  const problemIntent = detectedIntents.find(i => i.intent === 'PROBLEM')
  const finalFiltered = filtered.filter(i => i.intent !== 'CAUSES')
  const causesIntent = filtered.find(i => i.intent === 'CAUSES')
  const boosted = finalFiltered.map(intent => {
    if (intent.intent === 'DECISION') {
      return {
        ...intent,
        confidence: Math.min(intent.confidence + 10, 100)
      }
    }
    return intent
  })
  boosted.sort((a, b) => b.confidence - a.confidence)
  const primaryIntent = boosted[0] || detectedIntents[0]
  const supportingIntents = []
  for (let i = 1; i < boosted.length && i < 3; i++) {
    if (boosted[i].confidence >= 40) {
      supportingIntents.push(boosted[i])
    }
  }
  if (problemIntent) {
    supportingIntents.push({
      ...problemIntent,
      role: 'CONTEXT'
    })
  }
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

// **🎯 ANSWER ROUTING LOGIC**
function routeAnswerBasedOnIntent(intentResolution) {
  const { finalIntent, supportingIntents } = intentResolution
  if (!finalIntent) {
    return {
      answerType: 'GENERAL',
      sections: ['shortAnswer'],
      priority: 'LOW'
    }
  }
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

// 🔥 **LAYER 4, 5, 6, 7: COMPLETE SEMANTIC MATCHING SYSTEM**
// ---

// 🔥 **LAYER 4: CONTEXT DETECTION & MODIFIERS**
const CONTEXT_PATTERNS = {
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
        break
      }
    }
  }
  return detectedContexts
}

// 🔥 **LAYER 5: SEMANTIC SIMILARITY SCORING**
function calculateSemanticSimilarity(userQuery, dbQuestion) {
  let totalScore = 0
  const breakdown = []
  const cleaned = deepClean(userQuery)
  const expansionResult = intelligentExpansion(cleaned)
  const entityResult = resolveEntity(cleaned)
  const intentResult = detectIntentWithConfidence(cleaned)
  const intentResolution = resolveIntentConflicts(intentResult.intents)
  const contextResult = detectContext(cleaned)
  const dbEntityResult = resolveEntity(
    dbQuestion.question_en + ' ' + dbQuestion.question_hi
  )
  const dbIntentResult = detectIntentWithConfidence(
    dbQuestion.question_en + ' ' + dbQuestion.question_hi
  )
  const dbIntentResolution = resolveIntentConflicts(dbIntentResult.intents)
  const dbContextResult = detectContext(
    dbQuestion.question_en + ' ' + dbQuestion.question_hi
  )
  let entityScore = 0
  if (entityResult.entities.length > 0 && dbEntityResult.entities.length > 0) {
    const topUserEntity = entityResult.topEntity
    const topDbEntity = dbEntityResult.topEntity
    if (topUserEntity.entity === topDbEntity.entity) {
      const avgConfidence = (topUserEntity.confidence + topDbEntity.confidence) / 2
      entityScore = (avgConfidence / 100) * 40
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: entityScore,
        details: `Exact match: ${topUserEntity.displayName}`,
        userConfidence: topUserEntity.confidence,
        dbConfidence: topDbEntity.confidence
      })
    } else {
      entityScore = 0
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: 0,
        details: `No match: ${topUserEntity.displayName} vs ${topDbEntity.displayName}`
      })
    }
  } else {
    const userTokens = cleaned.split(' ').filter(w => w.length > 2)
    const dbKeywords = [
      ...(dbQuestion.keywords_en || []),
      ...(dbQuestion.keywords_hi || [])
    ].map(k => k.toLowerCase())
    let matches = 0
    for (const token of userTokens) {
      if (dbKeywords.some(kw => kw.includes(token) || token.includes(kw))) {
        matches++
      }
    }
    if (userTokens.length > 0) {
      entityScore = (matches / userTokens.length) * 40
      breakdown.push({
        component: 'ENTITY_MATCH',
        score: entityScore,
        details: `Keyword fallback: ${matches}/${userTokens.length} matches`
      })
    }
  }
  totalScore += entityScore
  let intentScore = 0
  if (intentResolution.finalIntent && dbIntentResolution.finalIntent) {
    const userIntent = intentResolution.finalIntent.intent
    const dbIntent = dbIntentResolution.finalIntent.intent
    if (userIntent === dbIntent) {
      const avgConfidence = (
        intentResolution.finalIntent.confidence +
        dbIntentResolution.finalIntent.confidence
      ) / 2
      intentScore = (avgConfidence / 100) * 35
      breakdown.push({
        component: 'INTENT_MATCH_PRIMARY',
        score: intentScore,
        details: `Exact intent match: ${userIntent}`,
        userConfidence: intentResolution.finalIntent.confidence,
        dbConfidence: dbIntentResolution.finalIntent.confidence
      })
    } else {
      const userIntents = [
        userIntent,
        ...intentResolution.supportingIntents.map(i => i.intent)
      ]
      const dbIntents = [
        dbIntent,
        ...dbIntentResolution.supportingIntents.map(i => i.intent)
      ]
      const commonIntents = userIntents.filter(ui => dbIntents.includes(ui))
      if (commonIntents.length > 0) {
        intentScore = (commonIntents.length / userIntents.length) * 20
        breakdown.push({
          component: 'INTENT_MATCH_PARTIAL',
          score: intentScore,
          details: `Partial intent match: ${commonIntents.join(', ')}`
        })
      } else {
        breakdown.push({
          component: 'INTENT_MATCH',
          score: 0,
          details: `No match: ${userIntent} vs ${dbIntent}`
        })
      }
    }
  }
  totalScore += intentScore
  let expansionScore = 0
  const maxExpansionScore = 15
  for (const expandedQuery of expansionResult.expansions) {
    const expandedTokens = expandedQuery.split(' ').filter(w => w.length > 2)
    const dbKeywords = [
      ...(dbQuestion.keywords_en || []),
      ...(dbQuestion.keywords_hi || [])
    ].map(k => k.toLowerCase())
    let matches = 0
    for (const token of expandedTokens) {
      if (dbKeywords.some(kw => kw.includes(token) || token.includes(kw))) {
        matches++
      }
    }
    if (expandedTokens.length > 0) {
      const score = (matches / expandedTokens.length) * maxExpansionScore
      if (score > expansionScore) {
        expansionScore = score
      }
    }
  }
  totalScore += expansionScore
  breakdown.push({
    component: 'EXPANSION_MATCH',
    score: expansionScore,
    details: `Best of ${expansionResult.expansions.length} expansions`
  })
  const userTokens = cleaned.split(' ').filter(w => w.length > 2)
  const dbKeywords = [
    ...(dbQuestion.keywords_en || []),
    ...(dbQuestion.keywords_hi || [])
  ].map(k => k.toLowerCase())
  let fuzzyMatches = 0
  for (const token of userTokens) {
    for (const keyword of dbKeywords) {
      if (token.length > 3 && keyword.length > 3) {
        if (levenshteinDistance(token, keyword) <= 2) {
          fuzzyMatches++
          break
        }
      }
    }
  }
  const fuzzyScore = userTokens.length > 0
    ? (fuzzyMatches / userTokens.length) * 10
    : 0
  totalScore += fuzzyScore
  breakdown.push({
    component: 'FUZZY_MATCH',
    score: fuzzyScore,
    details: `${fuzzyMatches}/${userTokens.length} fuzzy matches`
  })
  totalScore = Math.min(totalScore, 100)
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
  }
}

// 🔥 **LAYER 6: ADAPTIVE THRESHOLD & CONTEXTUAL BOOSTING**
function adaptiveThreshold(allScores) {
  if (allScores.length === 0) return 90
  const topScore = allScores[0].totalScore
  const secondScore = allScores.length > 1 ? allScores[1].totalScore : 0
  const gap1to2 = topScore - secondScore
  if (gap1to2 > 30) {
    return 65
  }
  if (gap1to2 > 20) {
    return 75
  }
  if (gap1to2 > 10) {
    return 85
  }
  return 90
}

function contextualBoost(matchResult, userQuery, dbQuestion) {
  let boost = 0
  const boostReasons = []
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
  const userComplexity = userQuery.split(' ').length
  const dbComplexity = dbQuestion.question_en.split(' ').length
  const complexityDiff = Math.abs(userComplexity - dbComplexity)
  if (complexityDiff <= 2) {
    boost += 3
    boostReasons.push('Similar complexity')
  } else if (complexityDiff <= 5) {
    boost += 1
    boostReasons.push('Moderate complexity match')
  }
  const hindiPattern = /[\u0900-\u097F]/
  const hinglishPattern = /\b(kya|hai|kaise|kare|hota|mein|ke|ka)\b/i
  const userHasHindi = hindiPattern.test(userQuery)
  const userHasHinglish = hinglishPattern.test(userQuery)
  const dbHasHindi = hindiPattern.test(dbQuestion.question_hi)
  if ((userHasHindi || userHasHinglish) && dbHasHindi) {
    boost += 2
    boostReasons.push('Language consistency')
  }
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

// 🔥 **LAYER 7: FINAL INTELLIGENT MATCHING ENGINE**
export async function intelligentQuestionMatch(userQuery, dbQuestions) {
    // console.log('🔍 Starting intelligent search for:', userQuery);
    
    // Quick direct match first
    const expandedQuery = (resolveEntity(userQuery).topEntity?.displayName || userQuery)
    for (const question of dbQuestions) {
        const directSimEn = stringSimilarity(expandedQuery, question.normalized_en);
        const directSimHi = stringSimilarity(expandedQuery, question.normalized_hi);
        if (Math.max(directSimEn, directSimHi) > 0.9) {
            // console.log(`⚡ Direct Match Found: "${question.question_en}"`);
            return {
                success: true,
                topMatch: { question, totalScore: Math.max(directSimEn, directSimHi) * 100 },
                alternativeMatches: [],
                processingTime: '10ms',
                matchType: 'Direct',
            };
        }
    }


    const startTime = Date.now();
    const allScores = [];

    for (const question of dbQuestions) {
        let matchResult = calculateSemanticSimilarity(userQuery, question);
        matchResult = contextualBoost(matchResult, userQuery, question);
        allScores.push({
            question,
            ...matchResult
        });
    }

    allScores.sort((a, b) => b.totalScore - a.score);

    const threshold = adaptiveThreshold(allScores);
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
        queryAnalysis: qualifiedMatches[0]?.userProcessing || null,
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
    };

    // console.log('📊 Search Results:');
    // console.log(`   ├─ Threshold: ${threshold}`);
    // console.log(`   ├─ Matched: ${qualifiedMatches.length}/${dbQuestions.length}`);
    // console.log(`   ├─ Processing time: ${processingTime}ms`);
    // if (result.topMatch) {
    //     console.log(`   └─ Top match: "${result.topMatch.question.question_en}" (${result.topMatch.totalScore}%)`);
    // } else {
    //     console.log(`   └─ No matches found`);
    // }

    return result;
}

function stringSimilarity(str1, str2) {
  str1 = str1.replace(/\s+/g, '').toLowerCase();
  str2 = str2.replace(/\s+/g, '').toLowerCase();

  if (!str1.length && !str2.length) return 1;
  if (!str1.length || !str2.length) return 0;
  if (str1 === str2) return 1;
  if (str1.length < 2 || str2.length < 2) return 0;

  const firstBigrams = new Map();
  for (let i = 0; i < str1.length - 1; i++) {
    const bigram = str1.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < str2.length - 1; i++) {
    const bigram = str2.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (str1.length + str2.length - 2);
}
