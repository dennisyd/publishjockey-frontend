/**
 * FormatConstants.ts - Single source of truth for formatting patterns
 * 
 * This file defines the contract for how content should be formatted throughout the application.
 * All components that create or parse formatted content should reference these constants
 * to ensure consistency across the application.
 */

/**
 * Chapter Formatting Contract:
 * 
 * 1. Chapter headings MUST follow the format: "# Chapter X\nTitle" where:
 *    - "# " is the Markdown level 1 heading marker
 *    - "Chapter X" is the literal text "Chapter" followed by a space and the chapter number
 *    - "\n" is a newline character
 *    - "Title" is the chapter title text on a new line
 * 
 * 2. When exporting, the MarkdownFormatter will convert content to this format
 * 
 * 3. When assembling for export, the BookAssemblers will look for this pattern and
 *    transform it to the appropriate format for each export type (PDF, EPUB, etc.)
 * 
 * 4. In the UI preview, this format will be transformed to centered chapter headings
 */

/**
 * Regex patterns for chapter headings
 */
export const CHAPTER_PATTERNS = {
  /**
   * Matches a chapter heading in the standard format: # Chapter X\nTitle
   * - Group 1: The chapter number
   * - Group 2: The chapter title
   */
  CHAPTER_HEADING: /^# Chapter (\d+)\n([^\n]+)/m,

  /**
   * Matches any level 1 heading: # Heading
   * - Group 1: The heading text
   */
  LEVEL1_HEADING: /^# ([^\n]+)$/m,

  /**
   * Identifies a heading that contains just "Chapter X" with no title
   */
  CHAPTER_ONLY: /^Chapter\s+\d+$/i,

  /**
   * Extracts chapter number and title from a heading that starts with "Chapter X"
   * - Group 1: The chapter number
   * - Group 2: The chapter title
   */
  CHAPTER_TITLE_EXTRACT: /^Chapter\s+(\d+)\s+(.*)/i
};

/**
 * Templates for generating formatted content
 */
export const TEMPLATES = {
  /**
   * Template for a chapter heading with number and title
   * @param chapterNumber The chapter number
   * @param title The chapter title
   * @returns Formatted chapter heading
   */
  CHAPTER_HEADING: (chapterNumber: number, title: string): string => {
    return `# Chapter ${chapterNumber}\n${title}`;
  },

  /**
   * Template for a chapter heading with just the number
   * @param chapterNumber The chapter number
   * @returns Formatted chapter heading
   */
  CHAPTER_ONLY: (chapterNumber: number): string => {
    return `# Chapter ${chapterNumber}`;
  }
};

/**
 * Validation functions to ensure content meets expected formats
 */
export const VALIDATORS = {
  /**
   * Validates if a string contains a properly formatted chapter heading
   * @param content The content to validate
   * @returns True if valid, false otherwise
   */
  IS_VALID_CHAPTER_HEADING: (content: string): boolean => {
    return CHAPTER_PATTERNS.CHAPTER_HEADING.test(content);
  },

  /**
   * Validates if a heading text is just "Chapter X" with no title
   * @param heading The heading text to validate
   * @returns True if it's just a chapter number, false otherwise
   */
  IS_CHAPTER_ONLY: (heading: string): boolean => {
    return CHAPTER_PATTERNS.CHAPTER_ONLY.test(heading);
  }
};

/**
 * Export formats and their special handling requirements
 */
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EPUB: 'epub',
  DOCX: 'docx',
  HTML: 'html'
}; 