/**
 * Detects if the text contains Hindi (Devanagari script) characters.
 * @param text The input string to check.
 * @returns 'hi' if Hindi characters are found, otherwise 'en'.
 */
export const detectLanguage = (text: string): 'en' | 'hi' => {
  // This regex checks for characters in the Devanagari Unicode range.
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(text) ? 'hi' : 'en';
};
