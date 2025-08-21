import { ExportSettings } from '../components/ExportModal';

interface DocumentSection {
  id: string;
  title: string;
  content: string;
  type: 'titlePage' | 'mainContent';
  level: number;
}

/**
 * Handles the assembly of document sections into a structured book format
 * for exporting to PDF, EPUB, or DOCX.
 */
export class DocumentAssemblyService {
  
  /**
   * Assembles document sections according to the export settings
   * @param sections Array of document sections to be assembled
   * @param settings Export settings from the ExportModal
   * @returns The assembled document content
   */
  public static assembleDocument(
    sections: DocumentSection[],
    settings: ExportSettings
  ): string {
    // Clone the sections to avoid modifying the original
    const workingSections = [...sections];
    
    // Find or create title page
    let titlePage: DocumentSection | null = null;
    if (settings.includeTitlePage) {
      titlePage = workingSections.find(s => s.type === 'titlePage') || null;
      
      // Remove title page from sections if found
      if (titlePage) {
        const titlePageIndex = workingSections.findIndex(s => s.type === 'titlePage');
        if (titlePageIndex !== -1) {
          workingSections.splice(titlePageIndex, 1);
        }
      }
    }
    
    // Apply chapter labeling if enabled
    if (settings.useChapterPrefix) {
      workingSections.forEach((section, index) => {
        if (section.type === 'mainContent') {
          const chapterNumber = index + 1;
          section.title = this.formatChapterTitle(
            section.title,
            chapterNumber,
            settings.chapterLabelFormat
          );
        }
      });
    }
    
    // Create the document structure as a set of placeholder markers
    let documentTemplate = '';
    
    // Add title page if enabled
    if (settings.includeTitlePage && titlePage) {
      documentTemplate += '{{TITLE_PAGE}}\n\n';
    }
    
    // Add TOC placeholder if enabled
    if (settings.includeToc) {
      documentTemplate += '{{TOC}}\n\n';
    }
    
    // Add section placeholders
    workingSections.forEach((section, index) => {
      if (settings.noSeparatorPages || index === 0) {
        documentTemplate += `{{SECTION_${index + 1}}}\n\n`;
      } else {
        documentTemplate += `{{SECTION_${index + 1}}}\n\n`;
      }
    });
    
    // Replace placeholders with actual content
    let assembledDocument = documentTemplate;
    
    // Replace title page
    if (settings.includeTitlePage && titlePage) {
      assembledDocument = assembledDocument.replace('{{TITLE_PAGE}}', titlePage.content);
    }
    
    // Replace TOC with generated TOC
    if (settings.includeToc) {
      const toc = this.generateTableOfContents(workingSections, settings, settings.t);
      assembledDocument = assembledDocument.replace('{{TOC}}', toc);
    }
    
    // Replace section placeholders with content
    workingSections.forEach((section, index) => {
      assembledDocument = assembledDocument.replace(
        `{{SECTION_${index + 1}}}`,
        section.content
      );
    });
    
    return assembledDocument;
  }
  
  /**
   * Formats a chapter title based on the specified format
   * @param title Original section title
   * @param chapterNumber Chapter number
   * @param format Format for the chapter label
   * @returns Formatted chapter title
   */
  private static formatChapterTitle(
    title: string,
    chapterNumber: number,
    format: 'number' | 'text' | 'none'
  ): string {
    if (format === 'none') {
      return title;
    }
    
    let chapterLabel = '';
    
    if (format === 'number') {
      chapterLabel = `Chapter ${chapterNumber}: `;
    } else if (format === 'text') {
      chapterLabel = `Chapter ${this.numberToText(chapterNumber)}: `;
    }
    
    return `${chapterLabel}${title}`;
  }
  
  /**
   * Converts a number to its text representation (1 -> "One")
   * @param num Number to convert
   * @returns Text representation of the number
   */
  private static numberToText(num: number): string {
    const textNumbers = [
      'One', 'Two', 'Three', 'Four', 'Five', 
      'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
    ];
    
    if (num > 0 && num <= textNumbers.length) {
      return textNumbers[num - 1];
    }
    
    return num.toString();
  }
  
  /**
   * Generates a table of contents based on the document sections
   * @param sections Document sections
   * @param settings Export settings
   * @returns Generated table of contents HTML
   */
  private static generateTableOfContents(
    sections: DocumentSection[],
    settings: ExportSettings,
    t?: (key: string, fallback?: string) => string
  ): string {
    // TOC depth is now always 2 (h1 and h2)
    const levelFilter = 2;
    const tocTitle = t ? t('export.tableOfContents', 'Table of Contents') : 'Table of Contents';
    let tocHtml = `<h1>${tocTitle}</h1>\n<nav class="toc">\n<ul>\n`;
    
    sections.forEach((section, index) => {
      // Only include sections up to the specified heading level
      if (section.level <= levelFilter) {
        const indent = '  '.repeat(section.level - 1);
        const pageRef = `<span class="page-ref">${index + 1}</span>`;
        
        // Include numbered headings if enabled
        let entryTitle = section.title;
        if (settings.numberedHeadings) {
          // Use index+1 as chapter number, and potentially add sub-numbering
          // based on section nesting level (implementation would depend on document structure)
          const sectionNumber = `${index + 1}${section.level > 1 ? `.${section.level}` : ''}`;
          entryTitle = `${sectionNumber} ${entryTitle}`;
        }
        
        tocHtml += `${indent}<li><a href="#section-${index + 1}">${entryTitle}</a>${pageRef}</li>\n`;
      }
    });
    
    tocHtml += '</ul>\n</nav>';
    return tocHtml;
  }
  
  /**
   * Processes document content to add IDs to headings for TOC linking
   * @param content Document content (HTML)
   * @returns Processed content with heading IDs
   */
  public static processContentForToc(content: string): string {
    // This is a simplified implementation - in a real application, 
    // you would parse the HTML and properly add ID attributes to headings
    
    // Replace h1 tags with IDs for linking from TOC
    let processedContent = content;
    const h1Regex = /<h1>(.*?)<\/h1>/g;
    let match;
    let headingCount = 0;
    
    while ((match = h1Regex.exec(content)) !== null) {
      headingCount++;
      const headingText = match[1];
      const headingId = `heading-${headingCount}`;
      
      // Replace the original tag with one that has an ID attribute
      processedContent = processedContent.replace(
        match[0],
        `<h1 id="${headingId}">${headingText}</h1>`
      );
    }
    
    return processedContent;
  }
} 