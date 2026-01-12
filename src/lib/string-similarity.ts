/**
 * Calculates the similarity between two strings using the Sørensen-Dice coefficient.
 * @param {string} str1 The first string.
 * @param {string} str2 The second string.
 * @returns {number} A value between 0 and 1, where 1 is a perfect match.
 */
export function stringSimilarity(str1: string, str2: string): number {
  str1 = str1.replace(/\s+/g, '').toLowerCase();
  str2 = str2.replace(/\s+/g, '').toLowerCase();

  if (!str1.length && !str2.length) return 1;
  if (!str1.length || !str2.length) return 0;
  if (str1 === str2) return 1;
  if (str1.length < 2 || str2.length < 2) return 0;

  const firstBigrams = new Map<string, number>();
  for (let i = 0; i < str1.length - 1; i++) {
    const bigram = str1.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram)! + 1 : 1;
    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < str2.length - 1; i++) {
    const bigram = str2.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram)! : 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (str1.length + str2.length - 2);
}
