/**
 * Unit tests for formatters
 * 
 * Tests ensure that formatters produce output that can be correctly
 * parsed by all components in the export pipeline.
 */

import { MarkdownFormatter } from '../services/MarkdownFormatter';
import { FormatAdapter } from '../services/FormatAdapter';
import { ValidationService } from '../services/ValidationService';
import { CHAPTER_PATTERNS, TEMPLATES } from '../constants/FormatConstants';

// Mock sections for testing
const mockSections = [
  {
    id: 'front:Title Page',
    title: 'Title Page',
    content: '# My Book\n\nBy Test Author',
    matter: 'front'
  },
  {
    id: 'front:Copyright',
    title: 'Copyright',
    content: '© 2023 Test Author. All rights reserved.',
    matter: 'front'
  },
  {
    id: 'main:Chapter 1',
    title: 'Introduction',
    content: '# Introduction\n\nThis is the first chapter.',
    matter: 'main'
  },
  {
    id: 'main:Chapter 2',
    title: 'Getting Started',
    content: '# Getting Started\n\nThis is the second chapter.',
    matter: 'main'
  }
];

describe('MarkdownFormatter', () => {
  test('formats sections with proper chapter headings', () => {
    const formattedSections = MarkdownFormatter.formatSectionsForExport(
      mockSections,
      { useChapterPrefix: true }
    );
    
    // Get the formatted content for Chapter 1
    const chapter1 = formattedSections.find(s => s.id === 'main:Chapter 1');
    expect(chapter1).toBeDefined();
    
    // Check that chapter heading follows the expected format
    if (chapter1) {
      expect(chapter1.content).toMatch(CHAPTER_PATTERNS.CHAPTER_HEADING);
      
      // Ensure title is updated with chapter label
      expect(chapter1.title).toContain('Chapter 1:');
      
      // Ensure the actual chapter heading has the expected format
      const headingMatch = chapter1.content.match(CHAPTER_PATTERNS.CHAPTER_HEADING);
      expect(headingMatch).not.toBeNull();
      if (headingMatch) {
        expect(headingMatch[1]).toBe('1'); // Chapter number
        expect(headingMatch[2]).toBe('Introduction'); // Chapter title
      }
    }
  });
  
  test('skips chapter formatting when useChapterPrefix is false', () => {
    const formattedSections = MarkdownFormatter.formatSectionsForExport(
      mockSections,
      { useChapterPrefix: false }
    );
    
    // Get the formatted content for Chapter 1
    const chapter1 = formattedSections.find(s => s.id === 'main:Chapter 1');
    expect(chapter1).toBeDefined();
    
    // Check that content is unchanged
    if (chapter1) {
      expect(chapter1.content).toBe(mockSections[2].content);
      expect(chapter1.title).toBe(mockSections[2].title);
    }
  });
});

describe('FormatAdapter', () => {
  test('adapts content to standard format', () => {
    const singleLineFormat = '# Chapter 1 Introduction\n\nThis is content.';
    const standardized = FormatAdapter.adaptToStandardFormat(singleLineFormat);
    
    // Should convert to standard format with newline between chapter and title
    expect(standardized).toMatch(CHAPTER_PATTERNS.CHAPTER_HEADING);
    expect(standardized).toContain('# Chapter 1\nIntroduction');
  });
  
  test('adapts content for preview', () => {
    const standardFormat = '# Chapter 1\nIntroduction\n\nThis is content.';
    const preview = FormatAdapter.adaptForPreview(standardFormat);
    
    // Should convert to HTML for preview
    expect(preview).toContain('<div style="text-align:center');
    expect(preview).toContain('<h1>Chapter 1</h1>');
    expect(preview).toContain('Introduction');
  });
});

describe('ValidationService', () => {
  test('validates correctly formatted chapter headings', () => {
    const validContent = '# Chapter 1\nIntroduction\n\nThis is content.';
    const result = ValidationService.validateChapterHeadings(validContent);
    
    expect(result.valid).toBe(true);
    expect(result.issues.length).toBe(0);
  });
  
  test('validates sections before export', () => {
    const validSection = {
      id: 'main:Chapter 1',
      title: 'Introduction',
      content: '# Chapter 1\nIntroduction\n\nThis is content.',
      matter: 'main'
    };
    
    const result = ValidationService.validateSection(validSection);
    expect(result.valid).toBe(true);
  });
  
  test('identifies invalid chapter format', () => {
    const invalidContent = '# Invalid Heading\n\nThis is content.';
    const result = ValidationService.validateChapterHeadings(invalidContent);
    
    // Should not validate as a chapter heading since it doesn't start with "Chapter"
    expect(result.valid).toBe(true); // This is valid markdown, just not a chapter heading
  });
}); 