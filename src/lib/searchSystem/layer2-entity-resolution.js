
import { levenshteinDistance } from './helpers';

/**
 * ===========================================
 * LAYER 2: ENTITY RESOLUTION
 * ===========================================
 */

export const ENTITY_SEMANTIC_MAP = {
  "heat_exchanger": {
    coreTerms: ["heat exchanger", "heat exchange"],
    partialTerms: ["exchanger"],
    relatedTerms: ["cooler", "heater", "hx unit", "thermal exchanger"],
    abbreviations: ["hx", "he"],
    commonTypos: [
      "heat excanger", "heat exchnger", "heat changer",
      "hate exchanger", "heat exg", "exchager"
    ]
  },
  
  "shell_and_tube_heat_exchanger": {
    coreTerms: ["shell and tube heat exchanger", "shell and tube"],
    partialTerms: ["shell tube exchanger"],
    relatedTerms: ["tube bundle", "tube sheet", "sthe"],
    abbreviations: ["sthe"],
    commonTypos: [
      "shell tube exchanger", "shell n tube", "shall and tube"
    ]
  },
  
  "plate_heat_exchanger": {
    coreTerms: ["plate heat exchanger", "plate exchanger"],
    partialTerms: ["plate type"],
    relatedTerms: ["gasket plate", "gasketed plate"],
    abbreviations: ["phe"],
    commonTypos: [
      "plate heat excanger", "plate hx", "pleat heat exchanger"
    ]
  },
  
  "air_cooled_heat_exchanger": {
    coreTerms: ["air cooled heat exchanger", "air cooler"],
    partialTerms: ["air cooled", "fin fan"],
    relatedTerms: ["fin fan cooler", "afc"],
    abbreviations: ["ache", "afc"],
    commonTypos: [
      "air cool heat exchanger", "finfan exchanger", "fin fan"
    ]
  },
  
  "pressure_vessel": {
    coreTerms: ["pressure vessel"],
    partialTerms: ["vessel"],
    relatedTerms: ["drum", "separator", "reactor"],
    abbreviations: ["pv"],
    commonTypos: [
      "presure vessel", "pressure vesal", "preasure vessel"
    ]
  },
  
  "separator": {
    coreTerms: ["separator"],
    partialTerms: ["separate"],
    relatedTerms: ["knock out drum", "ko drum"],
    abbreviations: [],
    commonTypos: [
      "seperator", "seprator", "saprator"
    ]
  },
  
  "column": {
    coreTerms: ["column", "tower"],
    partialTerms: ["column", "tower"],
    relatedTerms: ["tray column", "packed column", "distillation"],
    abbreviations: [],
    commonTypos: [
      "colum", "colmn", "collum"
    ]
  },
  
  "distillation_column": {
    coreTerms: ["distillation column", "distillation tower"],
    partialTerms: ["distillation", "fractionation"],
    relatedTerms: ["tray column", "fractionator"],
    abbreviations: ["dc"],
    commonTypos: [
      "distilation column", "destillation column"
    ]
  },
  
  "centrifugal_pump": {
    coreTerms: ["centrifugal pump"],
    partialTerms: ["centrifugal", "pump"],
    relatedTerms: ["process pump", "water pump"],
    abbreviations: ["cp"],
    commonTypos: [
      "centrifugal pamp", "centrifugel pump", "sentifugal pump"
    ]
  },
  
  "visual_testing": {
    coreTerms: ["visual testing", "visual inspection"],
    partialTerms: ["visual", "vt"],
    relatedTerms: ["eye inspection", "surface check", "vi"],
    abbreviations: ["vt", "vi"],
    commonTypos: [
      "vizual testing", "visual inspaction", "vt testing"
    ]
  },
  
  "ultrasonic_testing": {
    coreTerms: ["ultrasonic testing"],
    partialTerms: ["ultrasonic", "ultra sound"],
    relatedTerms: ["ut testing", "ut test"],
    abbreviations: ["ut"],
    commonTypos: [
      "ultra sonic testing", "ultrasonik testing", "ut test"
    ]
  },
  
  "magnetic_particle_testing": {
    coreTerms: ["magnetic particle testing", "magnetic particle inspection"],
    partialTerms: ["magnetic", "mt"],
    relatedTerms: ["mpi", "mt test"],
    abbreviations: ["mt", "mpi"],
    commonTypos: [
      "magnetic partical testing", "mpi testing", "magnatic particle"
    ]
  },
  
  "dye_penetrant_testing": {
    coreTerms: ["dye penetrant test", "liquid penetrant test"],
    partialTerms: ["penetrant", "pt", "dpt"],
    relatedTerms: ["liquid penetrant testing", "pt test"],
    abbreviations: ["pt", "lpt", "dpt"],
    commonTypos: [
      "die penetrant test", "penitrant testing", "pt testing"
    ]
  },
  
  "radiographic_testing": {
    coreTerms: ["radiographic testing", "radiography"],
    partialTerms: ["radiography", "rt", "xray"],
    relatedTerms: ["x ray test", "rt test"],
    abbreviations: ["rt"],
    commonTypos: [
      "radio graphic testing", "xray testing", "rt testing"
    ]
  },
  
  "welding_procedure_specification": {
    coreTerms: ["welding procedure specification"],
    partialTerms: ["wps"],
    relatedTerms: ["welding procedure", "weld procedure"],
    abbreviations: ["wps"],
    commonTypos: [
      "welding procedure spec", "weld procedure"
    ]
  },
  
  "procedure_qualification_record": {
    coreTerms: ["procedure qualification record"],
    partialTerms: ["pqr"],
    relatedTerms: ["welding qualification", "procedure record"],
    abbreviations: ["pqr"],
    commonTypos: [
      "procedure qualification recod", "welding pqr"
    ]
  },
  
  "corrosion": {
    coreTerms: ["corrosion"],
    partialTerms: ["rust", "corrode"],
    relatedTerms: ["metal loss", "rusting"],
    abbreviations: [],
    commonTypos: [
      "corosion", "corrossion", "corrusion"
    ]
  },
  
  "crack": {
    coreTerms: ["crack", "cracking"],
    partialTerms: ["crack"],
    relatedTerms: ["fracture", "crack indication"],
    abbreviations: [],
    commonTypos: [
      "crak", "crackng", "craking"
    ]
  },
  
  "leakage": {
    coreTerms: ["leakage", "leak"],
    partialTerms: ["leak"],
    relatedTerms: ["through wall", "leak point"],
    abbreviations: [],
    commonTypos: [
      "leakeg", "leekage", "leaking"
    ]
  },
  
  "flange": {
    coreTerms: ["flange"],
    partialTerms: ["flanged"],
    relatedTerms: ["pipe flange", "flange joint"],
    abbreviations: [],
    commonTypos: [
      "flang", "flenge", "flanj"
    ]
  },
  
  "gasket": {
    coreTerms: ["gasket"],
    partialTerms: ["sealing"],
    relatedTerms: ["flange gasket", "spiral wound"],
    abbreviations: [],
    commonTypos: [
      "gaskit", "gas kit", "gaskat"
    ]
  },
  
  "inspection_test_plan": {
    coreTerms: ["inspection test plan", "inspection and test plan"],
    partialTerms: ["itp"],
    relatedTerms: ["quality plan", "test plan"],
    abbreviations: ["itp"],
    commonTypos: [
      "inspection test paln", "inspaction test plan"
    ]
  },
  
  "material_test_certificate": {
    coreTerms: ["material test certificate"],
    partialTerms: ["mtc"],
    relatedTerms: ["mill certificate", "material certificate"],
    abbreviations: ["mtc"],
    commonTypos: [
      "material test certifcate", "mill test certificate"
    ]
  },
  
  "non_conformance_report": {
    coreTerms: ["non conformance report"],
    partialTerms: ["ncr"],
    relatedTerms: ["quality deviation", "ncr report"],
    abbreviations: ["ncr"],
    commonTypos: [
      "non conformity report", "quality ncr"
    ]
  }
};

/**
 * Resolve entity from text
 */
export function resolveEntity(text) {
  const resolvedEntities = [];
  const textLower = text.toLowerCase();
  
  for (const [entityKey, semantics] of Object.entries(ENTITY_SEMANTIC_MAP)) {
    let score = 0;
    let matchType = null;
    let matchedTerm = null;
    
    // Priority 1: Core Terms (100 points)
    for (const core of semantics.coreTerms) {
      if (textLower.includes(core.toLowerCase())) {
        score = 100;
        matchType = 'CORE';
        matchedTerm = core;
        break;
      }
    }
    
    // Priority 2: Abbreviations (95 points)
    if (score === 0 && semantics.abbreviations.length > 0) {
      for (const abbr of semantics.abbreviations) {
        const regex = new RegExp(`\\b${abbr}\\b`, 'i');
        if (regex.test(textLower)) {
          score = 95;
          matchType = 'ABBREVIATION';
          matchedTerm = abbr;
          break;
        }
      }
    }
    
    // Priority 3: Typo Match (90 points)
    if (score === 0) {
      for (const typo of semantics.commonTypos) {
        if (textLower.includes(typo.toLowerCase())) {
          score = 90;
          matchType = 'TYPO';
          matchedTerm = typo;
          break;
        }
      }
    }
    
    // Priority 4: Related Terms (70 points)
    if (score === 0) {
      for (const related of semantics.relatedTerms) {
        if (textLower.includes(related.toLowerCase())) {
          score = 70;
          matchType = 'RELATED';
          matchedTerm = related;
          break;
        }
      }
    }
    
    // Priority 5: Partial Terms
    if (score === 0) {
      let partialMatches = 0;
      const matchedPartials = [];
      
      for (const partial of semantics.partialTerms) {
        const regex = new RegExp(`\\b${partial}\\b`, 'i');
        if (regex.test(textLower)) {
          partialMatches++;
          matchedPartials.push(partial);
        }
      }
      
      if (partialMatches >= 2) {
        score = 80;
        matchType = 'PARTIAL_MULTIPLE';
        matchedTerm = matchedPartials.join(' + ');
      } else if (partialMatches === 1) {
        const strongPartials = ['exchanger', 'vessel', 'column', 'tower'];
        if (strongPartials.some(sp => matchedPartials[0].includes(sp))) {
          score = 60;
          matchType = 'PARTIAL_STRONG';
          matchedTerm = matchedPartials[0];
        } else {
          score = 30;
          matchType = 'PARTIAL_WEAK';
          matchedTerm = matchedPartials[0];
        }
      }
    }
    
    // Priority 6: Fuzzy Match (50 points)
    if (score === 0) {
      const words = textLower.split(' ');
      for (const core of semantics.coreTerms) {
        const coreWords = core.toLowerCase().split(' ');
        for (const word of words) {
          for (const coreWord of coreWords) {
            if (word.length > 3 && coreWord.length > 3) {
              const distance = levenshteinDistance(word, coreWord);
              if (distance <= 2) {
                score = 50;
                matchType = 'FUZZY';
                matchedTerm = `${word} ≈ ${coreWord}`;
                break;
              }
            }
          }
          if (score > 0) break;
        }
        if (score > 0) break;
      }
    }
    
    // Add to results if score > 0
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
      });
    }
  }
  
  // Sort by confidence (highest first)
  resolvedEntities.sort((a, b) => b.confidence - a.confidence);
  
  return {
    entities: resolvedEntities,
    topEntity: resolvedEntities[0] || null,
    entityCount: resolvedEntities.length
  };
}
