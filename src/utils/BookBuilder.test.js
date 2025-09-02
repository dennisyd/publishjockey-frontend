/**
 * BookBuilder Test Suite
 * Tests for intelligent document classification and import functionality
 */

import { classifyDocuments, parseZipStructure, detectLanguage } from './BookBuilder';

describe('BookBuilder Document Classification', () => {
  // Test data based on your actual markdown.zip structure
  const mockDocuments = [
    { filename: 'section1_introduction.md', content: '# Introduction\nVanquish the Noise\n\nTake Back Your Mind\n\nDr. Yancy Dennis' },
    { filename: 'section2_title_page.md', content: '# Title Page\n\n\\[TOC\\]' },
    { filename: 'section3_vanquish_the_noise.md', content: '# Vanquish the Noise\n\n## Take Back Your Mind\n\nBy Dr. Yancy Dennis' },
    { filename: 'section4_acknowledgements.md', content: '# Acknowledgements\n\nI would like to thank...' },
    { filename: 'section5_disclaimer.md', content: '# Disclaimer\n\nThe information in this book...' },
    { filename: 'section6_foreword.md', content: '# Foreword\n\nIn today\'s world...' },
    { filename: 'section7_introduction__the_age_of_overwhelm.md', content: '# Introduction: The Age of Overwhelm\n\nWe live in unprecedented times...' },
    { filename: 'section8_chapter_1__the_anatomy_of_noise.md', content: '# Chapter 1: The Anatomy of Noise\n\nThe car horn blaring...' },
    { filename: 'section9_part_i__understanding_the_noise.md', content: '# Part I: Understanding the Noise' },
    { filename: 'section10_chapter_2__the_brain_on_overload.md', content: '# Chapter 2: The Brain on Overload\n\nYour brain is not designed...' },
    { filename: 'section11_chapter_3__the_external_offenders.md', content: '# Chapter 3: The External Offenders\n\nLet\'s examine the noise...' },
    { filename: 'section12_part_ii__vanquish_mode_taking_back_control.md', content: '# Part II: Vanquish Mode - Taking Back Control' },
    { filename: 'section13_chapter_4__cut_the_static__digital_decluttering_.md', content: '# Chapter 4: Cut the Static - Digital Decluttering' },
    { filename: 'section20_conclusion__the_victory_is_yours.md', content: '# Conclusion: The Victory is Yours\n\nYou have reached the end...' },
    { filename: 'section21_references_and_resources.md', content: '# References and Resources\n\n## Books and Publications\n\nAllen, D. (2001)' },
    { filename: 'section22_bonus_resources.md', content: '# Bonus Resources\n\nHere are additional tools...' }
  ];

  describe('Section Classification', () => {
    test('should identify front matter sections correctly', () => {
      const result = classifyDocuments(mockDocuments);
      
      // Front matter should include: title page, acknowledgements, disclaimer, foreword
      expect(result.frontMatter).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ filename: 'section2_title_page.md' }),
          expect.objectContaining({ filename: 'section4_acknowledgements.md' }),
          expect.objectContaining({ filename: 'section5_disclaimer.md' }),
          expect.objectContaining({ filename: 'section6_foreword.md' })
        ])
      );
      expect(result.frontMatter.length).toBeGreaterThanOrEqual(4);
    });

    test('should identify main matter sections correctly', () => {
      const result = classifyDocuments(mockDocuments);
      
      // Main matter should include chapters and parts
      expect(result.mainMatter).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ filename: 'section8_chapter_1__the_anatomy_of_noise.md' }),
          expect.objectContaining({ filename: 'section10_chapter_2__the_brain_on_overload.md' }),
          expect.objectContaining({ filename: 'section9_part_i__understanding_the_noise.md' }),
          expect.objectContaining({ filename: 'section12_part_ii__vanquish_mode_taking_back_control.md' })
        ])
      );
      expect(result.mainMatter.length).toBeGreaterThanOrEqual(6);
    });

    test('should identify back matter sections correctly', () => {
      const result = classifyDocuments(mockDocuments);
      
      // Back matter should include references, resources, conclusion
      expect(result.backMatter).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ filename: 'section20_conclusion__the_victory_is_yours.md' }),
          expect.objectContaining({ filename: 'section21_references_and_resources.md' }),
          expect.objectContaining({ filename: 'section22_bonus_resources.md' })
        ])
      );
      expect(result.backMatter.length).toBeGreaterThanOrEqual(3);
    });

    test('should handle edge cases and ambiguous sections', () => {
      const ambiguousDocuments = [
        { filename: 'intro.md', content: '# Introduction\nThis could be front or main matter' },
        { filename: 'epilogue.md', content: '# Epilogue\nThis wraps up the story' },
        { filename: 'random_section.md', content: '# Some Random Content' }
      ];

      const result = classifyDocuments(ambiguousDocuments);
      
      // Should not crash and should classify everything somewhere
      const totalSections = result.frontMatter.length + result.mainMatter.length + result.backMatter.length;
      expect(totalSections).toBe(ambiguousDocuments.length);
    });
  });

  describe('Content Analysis', () => {
    test('should detect chapter patterns correctly', () => {
      const chapterPatterns = [
        'Chapter 1: The Beginning',
        'Chapter 2: The Middle', 
        'Chapter 10: Double Digits',
        'Ch. 5: Short Form',
        'CHAPTER ONE: All Caps',
        'Part I: Roman Numerals',
        'Part II: More Romans'
      ];

      chapterPatterns.forEach(title => {
        const isChapter = classifyDocuments([{ filename: 'test.md', content: `# ${title}` }]);
        expect(isChapter.mainMatter.length).toBeGreaterThan(0);
      });
    });

    test('should detect front matter keywords correctly', () => {
      const frontMatterKeywords = [
        'Acknowledgements',
        'Foreword', 
        'Preface',
        'Disclaimer',
        'Dedication',
        'Table of Contents',
        'Copyright'
      ];

      frontMatterKeywords.forEach(keyword => {
        const result = classifyDocuments([{ filename: 'test.md', content: `# ${keyword}` }]);
        expect(result.frontMatter.length).toBeGreaterThan(0);
      });
    });

    test('should detect back matter keywords correctly', () => {
      const backMatterKeywords = [
        'References',
        'Bibliography', 
        'Index',
        'Appendix',
        'About the Author',
        'Resources',
        'Conclusion',
        'Epilogue'
      ];

      backMatterKeywords.forEach(keyword => {
        const result = classifyDocuments([{ filename: 'test.md', content: `# ${keyword}` }]);
        expect(result.backMatter.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Language Detection', () => {
    test('should detect English content', () => {
      const englishContent = 'This is a test document in English with common words and phrases.';
      const language = detectLanguage(englishContent);
      expect(language).toBe('en');
    });

    test('should detect Spanish content', () => {
      const spanishContent = 'Este es un documento de prueba en español con palabras y frases comunes.';
      const language = detectLanguage(spanishContent);
      expect(language).toBe('es');
    });

    test('should handle mixed content', () => {
      const mixedContent = 'This is English. Esto es español. Mixed content here.';
      const language = detectLanguage(mixedContent);
      // Should default to most common language or 'en'
      expect(['en', 'es']).toContain(language);
    });
  });

  describe('ZIP Structure Parsing', () => {
    test('should parse file structure correctly', () => {
      const mockFileList = [
        'section1_introduction.md',
        'section2_title_page.md', 
        'section8_chapter_1.md',
        'images/cover.jpg',
        'styles/book.css'
      ];

      const result = parseZipStructure(mockFileList);
      
      expect(result.markdownFiles).toHaveLength(3);
      expect(result.imageFiles).toHaveLength(1);
      expect(result.otherFiles).toHaveLength(1);
    });

    test('should handle different file extensions', () => {
      const mixedFiles = [
        'chapter1.md',
        'chapter2.txt',
        'notes.docx',
        'image.png',
        'style.css',
        'data.json'
      ];

      const result = parseZipStructure(mixedFiles);
      
      expect(result.markdownFiles.length).toBeGreaterThan(0);
      expect(result.imageFiles.length).toBeGreaterThan(0);
      expect(result.otherFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Confidence Scoring', () => {
    test('should provide confidence scores for classifications', () => {
      const result = classifyDocuments(mockDocuments);
      
      // Each classified section should have a confidence score
      [...result.frontMatter, ...result.mainMatter, ...result.backMatter].forEach(section => {
        expect(section).toHaveProperty('confidence');
        expect(section.confidence).toBeGreaterThanOrEqual(0);
        expect(section.confidence).toBeLessThanOrEqual(1);
      });
    });

    test('should give high confidence to obvious classifications', () => {
      const obviousChapter = { filename: 'chapter_1.md', content: '# Chapter 1: Introduction' };
      const result = classifyDocuments([obviousChapter]);
      
      const classifiedSection = result.mainMatter[0];
      expect(classifiedSection.confidence).toBeGreaterThan(0.8);
    });

    test('should give lower confidence to ambiguous classifications', () => {
      const ambiguousSection = { filename: 'random.md', content: '# Random Content' };
      const result = classifyDocuments([ambiguousSection]);
      
      // Find where it was classified and check confidence
      const allSections = [...result.frontMatter, ...result.mainMatter, ...result.backMatter];
      const classifiedSection = allSections[0];
      expect(classifiedSection.confidence).toBeLessThan(0.7);
    });
  });
});

describe('BookBuilder Integration', () => {
  test('should create valid book structure', () => {
    const result = classifyDocuments(mockDocuments);
    
    // Should create a structure compatible with existing book system
    expect(result).toHaveProperty('frontMatter');
    expect(result).toHaveProperty('mainMatter'); 
    expect(result).toHaveProperty('backMatter');
    expect(result).toHaveProperty('metadata');
    
    // Metadata should include detected info
    expect(result.metadata).toHaveProperty('title');
    expect(result.metadata).toHaveProperty('author');
    expect(result.metadata).toHaveProperty('language');
  });

  test('should extract book metadata correctly', () => {
    const result = classifyDocuments(mockDocuments);
    
    // Should extract title and author from content
    expect(result.metadata.title).toContain('Vanquish the Noise');
    expect(result.metadata.author).toContain('Dr. Yancy Dennis');
    expect(result.metadata.language).toBe('en');
  });
});
