
// This map stores common speech synthesis pronunciation issues and their corrections.
// Key: The word/phrase that is pronounced incorrectly.
// Value: A version of the word that the speech engine is more likely to pronounce correctly.

export const speechCorrectionMap = new Map<string, string>([
  // --- Hinglish Pronunciation ---
  ["kyun", "kyu"],
  ["hain", "hai"],
  ["nahin", "nahi"],
  ["kahan", "kaha"],
  
  // --- Technical Acronyms (spell them out) ---
  ["WPS", "W P S"],
  ["PQR", "P Q R"],
  ["NDT", "N D T"],
  ["DPT", "D P T"],
  ["PT", "P T"],
  ["MPT", "M P T"],
  ["MT", "M T"],
  ["UT", "U T"],
  ["RT", "R T"],
  ["VT", "V T"],
  ["VI", "V I"],
  ["PAUT", "P A U T"],
  ["ASME", "A S M E"],
  ["API", "A P I"],
  ["AWS", "A W S"],
  ["MTC", "M T C"],
  ["ITP", "I T P"],
  ["NCR", "N C R"],
  ["PWHT", "P W H T"],
  ["QA/QC", "Q A / Q C"],

  // --- Common Technical Words ---
  ["undercut", "under cut"],
  ["porosity", "poro-city"],
  ["lamination", "lami-nation"],
  ["slag", "slag"], // Often okay, but can be misread
]);
