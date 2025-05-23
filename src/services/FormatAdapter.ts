/**
 * FormatAdapter - Service for adapting content between different expected formats
 * 
 * This service provides adapter functions to transform content between different
 * components that may expect different formats.
 */

import { CHAPTER_PATTERNS, TEMPLATES, EXPORT_FORMATS } from '../constants/FormatConstants';

/**
 * Adapter for transforming chapter headings between different formats
 */
export class FormatAdapter {
  /**
   * Adapts content to the standard internal chapter format: # Chapter X\nTitle
   * @param content The content to adapt
   * @returns Adapted content with standardized chapter headings
   */
  public static adaptToStandardFormat(content: string): string {
    if (!content) return '';

    // Look for different chapter heading formats and standardize them
    
    // Format 1: "# Chapter X Title" -> "# Chapter X\nTitle"
    const singleLineFormat = content.replace(
      /^# Chapter (\d+) ([^\n]+)$/gm,
      (_, num, title) => TEMPLATES.CHAPTER_HEADING(Number(num), title)
    );
    
    // Other formats can be added here as needed
    
    return singleLineFormat;
  }

  /**
   * Adapts content for export to a specific format
   * @param content The content to adapt
   * @param exportFormat The target export format (pdf, epub, etc.)
   * @returns Content adapted for the specific export format
   */
  public static adaptForExport(content: string, exportFormat: string): string {
    if (!content) return '';
    
    switch (exportFormat) {
      case EXPORT_FORMATS.PDF:
        return this.adaptForPdfExport(content);
      case EXPORT_FORMATS.EPUB:
        return this.adaptForEpubExport(content);
      case EXPORT_FORMATS.DOCX:
        return this.adaptForDocxExport(content);
      case EXPORT_FORMATS.HTML:
        return this.adaptForHtmlExport(content);
      default:
        // If unknown format, return standard format
        return this.adaptToStandardFormat(content);
    }
  }

  /**
   * Adapts content specifically for PDF export
   * @param content The content to adapt
   * @returns Content adapted for PDF export
   */
  private static adaptForPdfExport(content: string): string {
    // Start with standardized format
    let adaptedContent = this.adaptToStandardFormat(content);
    
    // Any PDF-specific adaptations would go here
    
    return adaptedContent;
  }

  /**
   * Adapts content specifically for EPUB export
   * @param content The content to adapt
   * @returns Content adapted for EPUB export
   */
  private static adaptForEpubExport(content: string): string {
    // Start with standardized format
    let adaptedContent = this.adaptToStandardFormat(content);
    
    // Any EPUB-specific adaptations would go here
    
    return adaptedContent;
  }

  /**
   * Adapts content specifically for DOCX export
   * @param content The content to adapt
   * @returns Content adapted for DOCX export
   */
  private static adaptForDocxExport(content: string): string {
    // Start with standardized format
    let adaptedContent = this.adaptToStandardFormat(content);
    
    // Any DOCX-specific adaptations would go here
    
    return adaptedContent;
  }

  /**
   * Adapts content specifically for HTML export
   * @param content The content to adapt
   * @returns Content adapted for HTML export
   */
  private static adaptForHtmlExport(content: string): string {
    // Start with standardized format
    let adaptedContent = this.adaptToStandardFormat(content);
    
    // Any HTML-specific adaptations would go here
    
    return adaptedContent;
  }

  /**
   * Adapts content for UI preview
   * @param content The content to adapt
   * @returns Content adapted for UI preview
   */
  public static adaptForPreview(content: string): string {
    if (!content) return '';
    
    // First ensure content is in standard format
    let standardized = this.adaptToStandardFormat(content);
    
    // Transform chapter headings to HTML for the preview
    let previewContent = standardized.replace(
      CHAPTER_PATTERNS.CHAPTER_HEADING,
      (_, chapterNum, title) => {
        return `<div style="text-align:center; margin-top: 3em;">
  <h1>Chapter ${chapterNum}</h1>
  <div style="font-size:14pt; font-weight:bold; margin-bottom: 2em;">${title}</div>
</div>`;
      }
    );
    
    // Handle the custom image format {{IMAGE:path|caption|scale}}
    previewContent = previewContent.replace(
      /{{IMAGE:([^|]+)\|([^|]*)\|([^}]*)}}/g,
      (match, path, caption, scale) => {
        return `<div style="text-align:center; margin: 1em 0;">
  <img src="${path}" alt="${caption}" style="max-width: ${parseFloat(scale) * 100}%; max-height: 400px;" />
  <div style="font-style: italic; margin-top: 0.5em;">${caption}</div>
</div>`;
      }
    );
    
    return previewContent;
  }
} 