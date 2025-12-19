
// ============================================
// ENHANCED QUESTION MATCHING WITH ACRONYMS
// Handles: Questions + Acronyms + Full Names
// ============================================

import type { Question } from '@/types';
import { OilGasAcronyms, searchAcronym as searchAcronymInDB, AcronymData } from './acronyms';

class EnhancedQuestionMatcher {
  private acronymsDB: Record<string, AcronymData>;
  private questionTypes: Record<string, string[]>;
  private intentWords: Set<string>;
  private stopwords: Set<string>;
  private phoneticMap: Record<string, string>;

  constructor() {
    this.acronymsDB = OilGasAcronyms;
    
    this.questionTypes = {
      'what': ['kya', 'what', 'kaunsa', 'konsa', 'define'],
      'why': ['kyun', 'kyu', 'why', 'reason', 'wajah', 'karan'],
      'how': ['kaise', 'kese', 'how', 'tarika', 'method', 'process'],
      'where': ['kahan', 'kaha', 'where', 'jagah'],
      'when': ['kab', 'when', 'samay'],
      'which': ['kaun', 'which', 'konsa']
    };
    
    this.intentWords = new Set([
      'kya', 'kyun', 'kyu', 'kaise', 'kese', 'kab', 'kahan', 'kaun',
      'what', 'why', 'how', 'when', 'where', 'which', 'define'
    ]);
    
    this.stopwords = new Set([
      'hai', 'hota', 'hote', 'hoti', 'ka', 'ke', 'ki', 'ko', 
      'se', 'me', 'mein', 'par', 'is', 'the', 'a', 'an', 
      'in', 'on', 'at', 'to', 'of', 'for', 'and', 'or', 'are'
    ]);
    
    this.phoneticMap = {
      'sarration': 'serration',
      'hydrostetic': 'hydrostatic',
      'exhanger': 'exchanger',
      'piping': 'piping',
      'testing': 'testing',
      'kese': 'kaise',
      'kyu': 'kyun'
    };
  }

  detectAndExpandAcronyms(text: string) {
    const words = text.split(/\s+/);
    const acronymsFound: string[] = [];
    const expandedTerms: string[] = [];
    
    for (const word of words) {
      const upper = word.toUpperCase().replace(/[^\w]/g, '');
      
      if (this.acronymsDB[upper]) {
        acronymsFound.push(upper);
        expandedTerms.push(this.acronymsDB[upper].full.toLowerCase());
      }
    }
    
    return {
      acronyms: acronymsFound,
      expandedTerms: expandedTerms,
      hasAcronyms: acronymsFound.length > 0
    };
  }

  detectQuestionIntent(text: string) {
    const words = text.toLowerCase().split(/\s+/);
    const intents: string[] = [];
    
    for (const [type, keywords] of Object.entries(this.questionTypes)) {
      for (const keyword of keywords) {
        if (words.includes(keyword)) {
          intents.push(type);
          break;
        }
      }
    }
    
    return intents.length > 0 ? intents : ['what'];
  }

  extractCoreSubject(text: string): string[] {
    const normalized = text.toLowerCase().trim()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');
    
    const words = normalized.split(' ');
    
    return words
      .filter(w => w.length > 1 && !this.stopwords.has(w))
      .map(w => this.phoneticMap[w] || w);
  }

  levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = Array(len1 + 1).fill(null)
      .map(() => Array(len2 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        matrix[i][j] = s1[i-1] === s2[j-1]
          ? matrix[i-1][j-1]
          : Math.min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j]) + 1;
      }
    }
    
    return matrix[len1][len2];
  }

  calculateWordSimilarity(w1: string, w2: string): number {
    const maxLen = Math.max(w1.length, w2.length);
    if (maxLen === 0) return 1;
    return (maxLen - this.levenshteinDistance(w1, w2)) / maxLen;
  }

  calculateIntentMatchScore(userIntent: string[], dbIntent: string[]): number {
    const userSet = new Set(userIntent);
    const dbSet = new Set(dbIntent);
    const intersection = [...userSet].filter(x => dbSet.has(x));
    return intersection.length > 0 ? 100 : 0;
  }

  calculateSubjectScore(userSubject: string[], dbSubject: string[], userAcronyms: string[] = [], dbAcronyms: string[] = []): number {
    if (userSubject.length === 0 && userAcronyms.length === 0) return 0;
    
    let exactMatches = 0;
    let fuzzyMatches = 0;
    let acronymMatches = 0;
    
    for (const uAcro of userAcronyms) {
      if (dbAcronyms.includes(uAcro)) {
        acronymMatches++;
      } else {
        const acronymData = this.acronymsDB[uAcro];
        if (acronymData) {
          const fullFormWords = acronymData.full.toLowerCase().split(/\s+/);
          const hasMatch = fullFormWords.some(fw => 
            dbSubject.some(ds => this.calculateWordSimilarity(fw, ds) > 0.8)
          );
          if (hasMatch) acronymMatches += 0.8;
        }
      }
    }
    
    for (const userWord of userSubject) {
      if (dbSubject.includes(userWord)) {
        exactMatches++;
        continue;
      }
      
      for (const dbWord of dbSubject) {
        if (this.calculateWordSimilarity(userWord, dbWord) > 0.8) {
          fuzzyMatches++;
          break;
        }
      }
    }
    
    const totalMatches = (exactMatches * 1.0) + (fuzzyMatches * 0.8) + (acronymMatches * 1.5);
    const totalTerms = userSubject.length + userAcronyms.length;
    
    if (totalTerms === 0) return 0;
    
    const coverage = totalMatches / totalTerms;
    const dbTerms = dbSubject.length + dbAcronyms.length;
    const precision = dbTerms === 0 ? 0 : totalMatches / dbTerms;
    
    if (coverage + precision === 0) return 0;
    return (2 * coverage * precision / (coverage + precision)) * 100;
  }

  searchInDocument(userQuery: string, doc: Question): number {
    const userAcronymData = this.detectAndExpandAcronyms(userQuery);
    const userIntent = this.detectQuestionIntent(userQuery);
    let userSubject = this.extractCoreSubject(userQuery);
    
    if (userAcronymData.expandedTerms.length > 0) {
      userSubject.push(...userAcronymData.expandedTerms.join(' ').split(/\s+/));
      userSubject = [...new Set(userSubject)]; // Remove duplicates
    }
    
    const fields = [
      doc.question_en,
      doc.question_hi,
      doc.normalized_en,
      doc.normalized_hi
    ].filter(Boolean);
    
    const scores = fields.map(field => {
      const dbAcronymData = this.detectAndExpandAcronyms(field);
      const dbIntent = this.detectQuestionIntent(field);
      let dbSubject = this.extractCoreSubject(field);
      
      if (dbAcronymData.expandedTerms.length > 0) {
        dbSubject.push(...dbAcronymData.expandedTerms.join(' ').split(/\s+/));
        dbSubject = [...new Set(dbSubject)]; // Remove duplicates
      }
      
      const intentScore = this.calculateIntentMatchScore(userIntent, dbIntent);
      const subjectScore = this.calculateSubjectScore(
        userSubject, 
        dbSubject,
        userAcronymData.acronyms,
        dbAcronymData.acronyms
      );
      
      const intentWeight = userAcronymData.hasAcronyms ? 0.2 : 0.3;
      const subjectWeight = 1 - intentWeight;
      
      return intentScore * intentWeight + subjectScore * subjectWeight;
    });
    
    return Math.max(...scores, 0);
  }

  findBestMatch(userQuery: string, documents: Question[], threshold = 60) {
    const acronymResult = searchAcronymInDB(userQuery);
    if (acronymResult && userQuery.trim().split(/\s+/).length <= 3) {
      return [{
        type: 'acronym' as const,
        acronym: acronymResult.acronym,
        data: acronymResult,
        score: 100
      }];
    }
    
    const results = documents
      .map(doc => ({
        type: 'question' as const,
        document: doc,
        score: this.searchInDocument(userQuery, doc),
        intent: this.detectQuestionIntent(userQuery),
        subject: this.extractCoreSubject(userQuery),
        acronyms: this.detectAndExpandAcronyms(userQuery).acronyms
      }))
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score);
    
    return results;
  }
}

const matcher = new EnhancedQuestionMatcher();

export const findBestMatch = (userQuery: string, questions: Question[]) => {
    return matcher.findBestMatch(userQuery, questions, 60);
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}
