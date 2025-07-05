/**
 * ValidationService - Service for validating content against expected formats
 * 
 * This service provides validation functions to ensure content meets expected formats
 * before being passed between components.
 */

import { CHAPTER_PATTERNS } from '../constants/FormatConstants';

/**
 * Interface for validation results
 */
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

/**
 * Interface for validation issues
 */
export interface ValidationIssue {
  code: string;
  message: string;
  location?: string;
}

/**
 * Validation service for checking content against expected formats
 */
export class ValidationService {
  /**
   * Validates that content meets the expected format for chapter headings
   * @param content The content to validate
   * @returns Validation result with any issues found
   */
  public static validateChapterHeadings(content: string): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      issues: []
    };

    if (!content) {
      return result;
    }

    // Find all level 1 headings
    const headings = [];
    let match;
    const regex = new RegExp(CHAPTER_PATTERNS.LEVEL1_HEADING, 'gm');
    
    while ((match = regex.exec(content)) !== null) {
      headings.push({
        text: match[1],
        index: match.index
      });
    }

    // Check each heading for proper chapter format
    headings.forEach((heading, idx) => {
      // If heading starts with "Chapter", check format
      if (heading.text.startsWith('Chapter')) {
        // Check if it matches expected format "Chapter X"
        const chapterMatch = heading.text.match(CHAPTER_PATTERNS.CHAPTER_TITLE_EXTRACT);
        
        if (!chapterMatch) {
          result.valid = false;
          result.issues.push({
            code: 'INVALID_CHAPTER_FORMAT',
            message: `Chapter heading '${heading.text}' does not match expected format 'Chapter X Title'`,
            location: `index ${heading.index}`
          });
        }
        
        // Check if the chapter has a title on the next line for multi-line format
        const lineAfterHeading = content.substring(
          heading.index + heading.text.length + 3, // +3 for "# " and newline
          content.indexOf('\n', heading.index + heading.text.length + 3)
        ).trim();
        
        if (!lineAfterHeading && !heading.text.includes(' ')) {
          result.valid = false;
          result.issues.push({
            code: 'MISSING_CHAPTER_TITLE',
            message: `Chapter heading '${heading.text}' is missing a title on the next line`,
            location: `index ${heading.index}`
          });
        }
      }
    });

    return result;
  }

  /**
   * Validates content structure before export
   * @param content The content to validate
   * @returns Validation result with any issues found
   */
  public static validateForExport(content: string): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      issues: []
    };

    if (!content) {
      result.valid = false;
      result.issues.push({
        code: 'EMPTY_CONTENT',
        message: 'Content is empty'
      });
      return result;
    }

    // Check for chapter headings
    const chapterValidation = this.validateChapterHeadings(content);
    if (!chapterValidation.valid) {
      result.valid = false;
      result.issues.push(...chapterValidation.issues);
    }

    // Add more export validations as needed

    return result;
  }

  /**
   * Validates a section against expected format
   * @param section The section to validate
   * @returns Validation result with any issues found
   */
  public static validateSection(
    section: { id: string, title: string, content: string, matter: string }
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      issues: []
    };

    // Validate section content
    if (!section.content) {
      result.valid = false;
      result.issues.push({
        code: 'EMPTY_SECTION',
        message: `Section ${section.id} has empty content`
      });
    }

    // For main matter sections, validate chapter headings
    if (section.matter === 'main') {
      const chapterValidation = this.validateChapterHeadings(section.content);
      if (!chapterValidation.valid) {
        result.valid = false;
        result.issues.push({
          code: 'INVALID_CHAPTER_FORMAT',
          message: `Section ${section.id} has invalid chapter format`,
          location: section.id
        });
      }
    }

    return result;
  }
} 