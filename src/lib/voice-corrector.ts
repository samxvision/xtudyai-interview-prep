
import { correctionMap } from './voice-recognition-corrections';

/**
 * Corrects a user's voice query by replacing known misrecognition patterns.
 * @param query The raw query from the speech-to-text engine.
 * @returns A corrected version of the query.
 */
export function correctVoiceQuery(query: string): string {
  if (!query) return '';

  let correctedQuery = query.toLowerCase();
  
  // Iterate through the correction map and replace all occurrences
  for (let [incorrect, correct] of correctionMap.entries()) {
    // Use a regex to replace all instances of the incorrect phrase
    // The 'gi' flags make it global (replace all) and case-insensitive
    const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
    if (regex.test(correctedQuery)) {
        correctedQuery = correctedQuery.replace(regex, correct);
    }
  }

  return correctedQuery;
}
