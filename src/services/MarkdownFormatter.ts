/**
 * MarkdownFormatter - Utility class for formatting markdown content
 * 
 * This is the ONLY place in the codebase that should handle chapter formatting and headings.
 * All other formatting code should be removed from the system to avoid duplication.
 */

import { CHAPTER_PATTERNS, TEMPLATES } from '../constants/FormatConstants';
import { FormatAdapter } from './FormatAdapter';
import { ValidationService } from './ValidationService';

export class MarkdownFormatter {
  /**
   * Formats sections for export, handling chapter formatting and headings
   * 
   * @param sections Array of sections with content, title and matter properties
   * @param options Formatting options
   * @returns Array of properly formatted sections
   */
  public static formatSectionsForExport(
    sections: Array<{ 
      id: string, 
      title: string, 
      content: string, 
      matter: 'front' | 'main' | 'back' | string 
    }>,
    options: { 
      useChapterPrefix?: boolean,
      chapterLabelFormat?: 'number' | 'none'
    } = {}
  ): Array<{ id: string, title: string, content: string, matter: string }> {
    // Create a deep copy of sections to avoid mutating input
    const formattedSections = JSON.parse(JSON.stringify(sections));
    
    // Skip chapter formatting if useChapterPrefix is false OR chapterLabelFormat is 'none'
    if (!options.useChapterPrefix || options.chapterLabelFormat === 'none') {
      return formattedSections;
    }
    
    let chapterNumber = 1;
    
    // Process each section
    const result = formattedSections.map(section => {
      // Only process main matter sections
      if (section.matter !== 'main') {
        return section;
      }
      
      let content = section.content.trim();
      let title = section.title;
      
      // Skip processing if content is empty
      if (!content) {
        return section;
      }
      
      // Handle chapter formatting
      // Find first heading in content
      const headingMatch = content.match(CHAPTER_PATTERNS.LEVEL1_HEADING);
      
      // Always use 'Chapter X' label
      let chapterLabel = `Chapter ${chapterNumber}`;
      
      if (headingMatch) {
        // Content has a heading - replace it with chapter format
        const headingText = headingMatch[1];
        
        // Remove the original heading
        content = content.replace(/^# [^\n]+\n/, '').trim();
        
        // Add new formatted heading (using our template for consistency)
        content = TEMPLATES.CHAPTER_HEADING(chapterNumber, headingText) + '\n\n' + content;
        
        // Update title to reflect chapter label
        title = `${chapterLabel}: ${title}`;
      } else {
        // Content has no heading - add one using section title
        content = TEMPLATES.CHAPTER_HEADING(chapterNumber, title) + '\n\n' + content;
        title = `${chapterLabel}: ${title}`;
      }
      
      // Increment chapter number
      chapterNumber++;
      
      // Return updated section
      return {
        ...section,
        title: title,
        content: content
      };
    });
    
    // Validate the result to ensure we've produced valid output
    this.validateFormattedSections(result);
    
    return result;
  }
  
  /**
   * Validates that formatted sections meet the expected format
   * Logs warnings if any sections are invalid
   * @param sections The sections to validate
   */
  private static validateFormattedSections(sections: Array<{ 
    id: string, 
    title: string, 
    content: string, 
    matter: string 
  }>): void {
    sections.forEach(section => {
      if (section.matter === 'main') {
        const validation = ValidationService.validateSection(section);
        if (!validation.valid) {
          console.warn(`Validation warnings for section ${section.id}:`, validation.issues);
        }
      }
    });
  }
  
  /**
   * Convert a number to its word representation (e.g., 1 -> "One")
   * @param num The number to convert
   * @returns The word representation
   */
  private static numberToWords(num: number): string {
    const words = [
      'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 
      'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
    ];
    
    if (num >= 0 && num <= 20) {
      return words[num];
    }
    
    return num.toString(); // Fallback for numbers > 20
  }
  
  /**
   * Adds default title page content if needed
   * 
   * @param title Book title
   * @param author Book author
   * @param subtitle Optional subtitle
   * @returns Formatted title page markdown
   */
  public static generateTitlePage(
    title: string, 
    author: string, 
    subtitle?: string
  ): string {
    let markdown = `# ${title}\n\n`;
    
    if (subtitle) {
      markdown += `## ${subtitle}\n\n`;
    }
    
    markdown += `By ${author}\n\n`;
    
    return markdown;
  }
  
  /**
   * Formats content for preview in the UI
   * @param content The content to format for preview
   * @returns Formatted content for preview
   */
  public static formatForPreview(content: string): string {
    return FormatAdapter.adaptForPreview(content);
  }
} 