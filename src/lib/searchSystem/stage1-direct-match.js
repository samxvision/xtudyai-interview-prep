
/**
 * STAGE 1: DIRECT MATCH SYSTEM
 * Checks if user query directly matches any question in database
 * Handles abbreviations: DPT = dpt = Dpt = Dye Penetrant Testing
 */

// ============================================
// ABBREVIATION NORMALIZATION MAP
// ============================================
const ABBREVIATION_EQUIVALENTS = {
  // NDT Testing
  'dpt': ['dpt', 'pt', 'dye penetrant testing', 'dye penetrant test', 'liquid penetrant testing', 'liquid penetrant test', 'penetrant testing', 'penetrant test'],
  'pt': ['pt', 'dpt', 'penetrant testing', 'penetrant test', 'dye penetrant testing', 'liquid penetrant testing'],
  'mpt': ['mpt', 'mt', 'magnetic particle testing', 'magnetic particle test', 'magnetic particle inspection'],
  'mt': ['mt', 'mpt', 'magnetic particle testing', 'magnetic particle test', 'magnetic particle inspection'],
  'ut': ['ut', 'ultrasonic testing', 'ultrasonic test', 'ultrasonic inspection'],
  'rt': ['rt', 'radiographic testing', 'radiography', 'radiographic test', 'x-ray testing', 'xray testing'],
  'vt': ['vt', 'vi', 'visual testing', 'visual inspection', 'visual examination'],
  'vi': ['vi', 'vt', 'visual inspection', 'visual testing', 'visual examination'],
  'ndt': ['ndt', 'non destructive testing', 'non destructive test', 'nondestructive testing'],
  'paut': ['paut', 'phased array ut', 'phased array ultrasonic testing', 'phased array'],
  'tofd': ['tofd', 'time of flight diffraction'],
  'ect': ['ect', 'eddy current testing', 'eddy current test'],
  
  // Equipment
  'hx': ['hx', 'he', 'heat exchanger', 'heat exchange'],
  'he': ['he', 'hx', 'heat exchanger', 'heat exchange'],
  'pv': ['pv', 'pressure vessel'],
  'sthe': ['sthe', 'shell and tube heat exchanger', 'shell and tube', 'shell tube heat exchanger'],
  'ache': ['ache', 'air cooled heat exchanger', 'air cooler', 'fin fan cooler'],
  'phe': ['phe', 'plate heat exchanger', 'plate exchanger'],
  
  // Documents
  'wps': ['wps', 'welding procedure specification', 'weld procedure specification'],
  'pqr': ['pqr', 'procedure qualification record', 'welding qualification record'],
  'wqt': ['wqt', 'welder qualification test', 'welder qualification'],
  'mtc': ['mtc', 'material test certificate', 'mill test certificate', 'material certificate'],
  'itp': ['itp', 'inspection and test plan', 'inspection test plan'],
  'ncr': ['ncr', 'non conformance report', 'non conformity report'],
  
  // Operations
  'rbi': ['rbi', 'risk based inspection'],
  'ffs': ['ffs', 'fitness for service'],
  'ta': ['ta', 'turnaround', 'plant turnaround'],
  'sd': ['sd', 'shutdown', 'plant shutdown'],
  
  // Rotating Equipment
  'cp': ['cp', 'centrifugal pump'],
  'rp': ['rp', 'reciprocating pump'],
  'cc': ['cc', 'centrifugal compressor'],
  'rc': ['rc', 'reciprocating compressor'],
  'st': ['st', 'steam turbine'],
  'gt': ['gt', 'gas turbine'],
  'em': ['em', 'electric motor']
};

/**
 * Build reverse lookup map for fast searching
 */
function buildReverseLookup() {
  const reverseLookup = {};
  
  for (const [key, equivalents] of Object.entries(ABBREVIATION_EQUIVALENTS)) {
    for (const equiv of equivalents) {
      const normalized = equiv.toLowerCase().trim();
      if (!reverseLookup[normalized]) {
        reverseLookup[normalized] = [];
      }
      // Add all equivalents
      reverseLookup[normalized].push(...equivalents.map(e => e.toLowerCase().trim()));
    }
  }
  
  // Remove duplicates
  for (const key in reverseLookup) {
    reverseLookup[key] = [...new Set(reverseLookup[key])];
  }
  
  return reverseLookup;
}

const REVERSE_LOOKUP = buildReverseLookup();

/**
 * Normalize text for direct matching
 * - Lowercase
 * - Remove extra spaces
 * - Keep only alphanumeric and spaces
 */
function normalizeForDirectMatch(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ')  // Replace punctuation with space
    .replace(/\s+/g, ' ')      // Multiple spaces to single
    .trim();
}

/**
 * Get all equivalent forms of a word (including abbreviations)
 */
function getEquivalentForms(word) {
  const normalized = word.toLowerCase().trim();
  
  // Check if this word has known equivalents
  if (REVERSE_LOOKUP[normalized]) {
    return REVERSE_LOOKUP[normalized];
  }
  
  // Return just the word itself
  return [normalized];
}

/**
 * Check if two texts match (considering abbreviations)
 */
function isDirectMatch(userText, dbText) {
  const userNormalized = normalizeForDirectMatch(userText);
  const dbNormalized = normalizeForDirectMatch(dbText);
  
  // Exact match after normalization
  if (userNormalized === dbNormalized) {
    return { match: true, type: 'EXACT', confidence: 100 };
  }
  
  // Word-by-word abbreviation match
  const userWords = userNormalized.split(' ').filter(w => w.length > 0);
  const dbWords = dbNormalized.split(' ').filter(w => w.length > 0);
  
  // If word count differs significantly, not a match
  if (Math.abs(userWords.length - dbWords.length) > 2) {
    return { match: false, type: 'NO_MATCH', confidence: 0 };
  }
  
  let matchedWords = 0;
  const totalWords = Math.max(userWords.length, dbWords.length);
  
  // Create an array of equivalent word lists for the user query
  const userEquivalentsList = userWords.map(getEquivalentForms);

  for (const dbWord of dbWords) {
      const dbEquivalents = getEquivalentForms(dbWord);
      
      // Check if any of the dbWord's equivalents can be found in the user's equivalents list
      let foundMatch = false;
      for (let i = 0; i < userEquivalentsList.length; i++) {
          const userEquivalents = userEquivalentsList[i];
          if (userEquivalents.some(ue => dbEquivalents.includes(ue))) {
              matchedWords++;
              // Remove this list so it can't be matched again
              userEquivalentsList.splice(i, 1);
              foundMatch = true;
              break;
          }
      }
      if (foundMatch) continue;
  }
  
  const matchPercentage = totalWords > 0 ? (matchedWords / totalWords) * 100 : 0;
  
  if (matchPercentage >= 80) {
    return { 
      match: true, 
      type: 'ABBREVIATION_MATCH', 
      confidence: Math.round(matchPercentage),
      matchedWords,
      totalWords
    };
  }
  
  return { match: false, type: 'NO_MATCH', confidence: Math.round(matchPercentage) };
}

/**
 * MAIN DIRECT MATCH FUNCTION
 * Returns direct matches from database
 */
export function findDirectMatches(userQuery, dbQuestions) {
  console.log('🎯 STAGE 1: Direct Match Search');
  console.log('   Query:', userQuery);
  
  const startTime = Date.now();
  const matches = [];
  
  for (const question of dbQuestions) {
    // Check against English question
    const enMatch = isDirectMatch(userQuery, question.question_en || '');
    if (enMatch.match) {
      matches.push({
        question,
        matchType: 'DIRECT_ENGLISH',
        confidence: enMatch.confidence,
        matchDetails: enMatch
      });
      continue; // Skip Hindi check if English matched
    }
    
    // Check against Hindi/Hinglish question
    const hiMatch = isDirectMatch(userQuery, question.question_hi || '');
    if (hiMatch.match) {
      matches.push({
        question,
        matchType: 'DIRECT_HINDI',
        confidence: hiMatch.confidence,
        matchDetails: hiMatch
      });
    }
  }
  
  const processingTime = Date.now() - startTime;
  
  // Sort by confidence
  matches.sort((a, b) => b.confidence - a.confidence);
  
  console.log(`   Found ${matches.length} direct matches in ${processingTime}ms`);
  
  return {
    success: matches.length > 0,
    matches,
    processingTime: `${processingTime}ms`
  };
}
