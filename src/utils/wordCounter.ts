/**
 * Word counting utilities for frontend
 */

/**
 * Count words in a text string
 * @param text - The text to count words in
 * @returns Number of words
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  
  // Split by whitespace and filter out empty strings
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Count words in project content object
 * @param content - Project content object with key-value pairs
 * @returns Total word count across all content
 */
export function countProjectWords(content: Record<string, string>): number {
  if (!content || typeof content !== 'object') {
    return 0;
  }
  
  let totalWords = 0;
  
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string') {
      totalWords += countWords(value);
    }
  }
  
  return totalWords;
}

/**
 * Check if project exceeds word limit
 * @param content - Project content object
 * @param wordLimit - Word limit (null means unlimited)
 * @returns Result object with isValid, wordCount, and wordLimit
 */
export function validateWordLimit(content: Record<string, string>, wordLimit: number | null) {
  const wordCount = countProjectWords(content);
  
  return {
    isValid: wordLimit === null || wordCount <= wordLimit,
    wordCount,
    wordLimit,
    wordsRemaining: wordLimit ? Math.max(0, wordLimit - wordCount) : null
  };
}
