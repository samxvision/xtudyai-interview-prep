/**
 * Detects if the text contains common Hinglish words or is primarily Devanagari script.
 * @param text The input string to check.
 * @returns 'hi' if Hinglish/Hindi is detected, otherwise 'en'.
 */
export const detectLanguage = (text: string): 'en' | 'hi' => {
  const lower = text.toLowerCase();
  
  // Rule 1: Check for common Hinglish helper words.
  // This helps catch Romanized Hindi questions.
  const hinglishWords = ['kya', 'kaise', 'kab', 'kyu', 'kyun', 'kahan', 'hai', 'hota', 'hoti', 'hote', 'ka'];
  if (hinglishWords.some(w => lower.split(' ').includes(w))) {
    return 'hi';
  }

  // Rule 2: Check for Devanagari script for pure Hindi.
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    return 'hi';
  }
  
  return 'en';
};
