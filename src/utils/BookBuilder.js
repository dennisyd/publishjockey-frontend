/**
 * BookBuilder - Intelligent Document Classification and Import
 * Converts ZIP archives of documents into structured book format
 */



/**
 * Classification patterns for different matter types
 */
const CLASSIFICATION_PATTERNS = {
  frontMatter: {
    keywords: [
      'title page', 'copyright', 'dedication', 'acknowledgement', 'acknowledgment',
      'foreword', 'preface', 'prologue', 'table of contents', 'toc',
      'disclaimer', 'about this book', 'how to use', 'introduction'
    ],
    filenamePatterns: [
      /title[_\s]page/i,
      /copyright/i,
      /dedication/i,
      /acknowledgement?s?/i,
      /foreword/i,
      /preface/i,
      /prologue/i,
      /toc|table[_\s]of[_\s]contents/i,
      /disclaimer/i
    ],
    contentPatterns: [
      /^#\s*(title\s+page|copyright|dedication|acknowledgements?|foreword|preface|prologue)/i,
      /table\s+of\s+contents/i,
      /©|\(c\)|copyright/i
    ]
  },
  
  mainMatter: {
    keywords: [
      'chapter', 'part', 'section', 'book'
    ],
    filenamePatterns: [
      /chapter[_\s]*\d+/i,
      /ch[_\s]*\d+/i,
      /part[_\s]*[ivx\d]+/i,
      /section[_\s]*\d+/i,
      /book[_\s]*\d+/i
    ],
    contentPatterns: [
      /^#\s*chapter\s*\d+/i,
      /^#\s*ch\.\s*\d+/i,
      /^#\s*part\s*[ivx\d]+/i,
      /^#\s*section\s*\d+/i,
      /^#\s*book\s*\d+/i
    ]
  },
  
  backMatter: {
    keywords: [
      'conclusion', 'epilogue', 'afterword', 'references', 'bibliography',
      'index', 'glossary', 'appendix', 'about the author', 'resources',
      'bonus', 'additional', 'further reading', 'notes'
    ],
    filenamePatterns: [
      /conclusion/i,
      /epilogue/i,
      /afterword/i,
      /references?/i,
      /bibliography/i,
      /index/i,
      /glossary/i,
      /appendix/i,
      /about[_\s]the?[_\s]author/i,
      /resources?/i,
      /bonus/i,
      /notes/i
    ],
    contentPatterns: [
      /^#\s*(conclusion|epilogue|afterword|references?|bibliography|index|glossary|appendix)/i,
      /^#\s*(about\s+the\s+author|resources?|bonus|notes)/i
    ]
  }
};

/**
 * Language detection patterns (basic implementation)
 */
const LANGUAGE_PATTERNS = {
  en: ['the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'it', 'you', 'for', 'with', 'on', 'as', 'are'],
  es: ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da'],
  fr: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce'],
  de: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für'],
  it: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'con', 'del', 'da', 'a', 'al', 'le']
};

/**
 * Classify documents into front matter, main matter, and back matter
 * @param {Array} documents - Array of {filename, content} objects
 * @returns {Object} Classification result with confidence scores
 */
function classifyDocuments(documents) {
  const result = {
    frontMatter: [],
    mainMatter: [],
    backMatter: [],
    metadata: {
      title: '',
      author: '',
      language: 'en',
      totalSections: documents.length
    }
  };

  // Extract metadata first
  result.metadata = extractMetadata(documents);

  // Classify each document
  documents.forEach((doc, index) => {
    const classification = classifySingleDocument(doc, index, documents.length);
    
    switch (classification.type) {
      case 'front':
        result.frontMatter.push({
          ...doc,
          confidence: classification.confidence,
          suggestedOrder: classification.order
        });
        break;
      case 'main':
        result.mainMatter.push({
          ...doc,
          confidence: classification.confidence,
          suggestedOrder: classification.order
        });
        break;
      case 'back':
        result.backMatter.push({
          ...doc,
          confidence: classification.confidence,
          suggestedOrder: classification.order
        });
        break;
    }
  });

  // Sort by suggested order
  result.frontMatter.sort((a, b) => a.suggestedOrder - b.suggestedOrder);
  result.mainMatter.sort((a, b) => a.suggestedOrder - b.suggestedOrder);
  result.backMatter.sort((a, b) => a.suggestedOrder - b.suggestedOrder);

  return result;
}

/**
 * Classify a single document
 * @param {Object} doc - Document object with filename and content
 * @param {number} index - Position in original array
 * @param {number} total - Total number of documents
 * @returns {Object} Classification with type, confidence, and order
 */
function classifySingleDocument(doc, index, total) {
  const scores = {
    front: 0,
    main: 0,
    back: 0
  };

  // Position-based scoring (earlier = more likely front, later = more likely back)
  const positionRatio = index / Math.max(total - 1, 1);
  if (positionRatio < 0.3) scores.front += 0.2;
  else if (positionRatio > 0.7) scores.back += 0.2;
  else scores.main += 0.1;

  // Filename-based scoring
  Object.keys(CLASSIFICATION_PATTERNS).forEach(matterType => {
    const patterns = CLASSIFICATION_PATTERNS[matterType];
    
    patterns.filenamePatterns.forEach(pattern => {
      if (pattern.test(doc.filename)) {
        scores[matterType === 'frontMatter' ? 'front' : matterType === 'mainMatter' ? 'main' : 'back'] += 0.4;
      }
    });
  });

  // Content-based scoring
  const content = doc.content.toLowerCase();
  const firstLine = doc.content.split('\n')[0] || '';

  Object.keys(CLASSIFICATION_PATTERNS).forEach(matterType => {
    const patterns = CLASSIFICATION_PATTERNS[matterType];
    const scoreKey = matterType === 'frontMatter' ? 'front' : matterType === 'mainMatter' ? 'main' : 'back';
    
    // Check content patterns
    patterns.contentPatterns.forEach(pattern => {
      if (pattern.test(firstLine)) {
        scores[scoreKey] += 0.5;
      }
    });

    // Check keywords in content
    patterns.keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        scores[scoreKey] += 0.1;
      }
    });
  });

  // Special cases for numbered sequences
  const chapterMatch = doc.filename.match(/chapter[_\s]*(\d+)/i);
  const partMatch = doc.filename.match(/part[_\s]*([ivx\d]+)/i);
  
  if (chapterMatch || partMatch) {
    scores.main += 0.6;
  }

  // Determine best classification
  const maxScore = Math.max(scores.front, scores.main, scores.back);
  let type = 'main'; // default
  
  if (maxScore === scores.front) type = 'front';
  else if (maxScore === scores.back) type = 'back';
  else type = 'main';

  // Calculate confidence (0-1)
  const confidence = Math.min(maxScore, 1.0);

  return {
    type,
    confidence,
    order: index // Use original order as suggested order
  };
}

/**
 * Extract metadata from documents
 * @param {Array} documents - Array of document objects
 * @returns {Object} Extracted metadata
 */
function extractMetadata(documents) {
  let title = '';
  let author = '';
  let language = 'en';

  // Look for title and author in various places
  documents.forEach(doc => {
    const content = doc.content;
    const lines = content.split('\n');

    // Check for title patterns
    if (!title) {
      // Look for main title in title page or introduction
      if (doc.filename.includes('title') || doc.filename.includes('introduction')) {
        lines.forEach(line => {
          line = line.trim();
          // Skip markdown headers and empty lines
          if (line && !line.startsWith('#') && !line.startsWith('\\[') && line.length > 3) {
            if (!title && line.length < 100) { // Reasonable title length
              title = line;
            }
          }
        });
      }
    }

    // Check for author patterns
    if (!author) {
      lines.forEach(line => {
        line = line.trim();
        // Look for "By Author Name" or "Dr. Name" patterns
        if (line.match(/^(by\s+)?(dr\.?\s+|prof\.?\s+)?[a-z]+\s+[a-z]+/i) && line.length < 50) {
          author = line.replace(/^by\s+/i, '').trim();
        }
      });
    }

    // Detect language from content
    if (doc.content.length > 100) { // Only analyze substantial content
      const detectedLang = detectLanguage(doc.content);
      if (detectedLang !== 'en') {
        language = detectedLang; // Override default if non-English detected
      }
    }
  });

  return {
    title: title || 'Untitled Book',
    author: author || 'Unknown Author',
    language,
    totalSections: documents.length
  };
}

/**
 * Simple language detection based on common words
 * @param {string} text - Text to analyze
 * @returns {string} Language code
 */
function detectLanguage(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const scores = {};
  
  Object.keys(LANGUAGE_PATTERNS).forEach(lang => {
    scores[lang] = 0;
    const commonWords = LANGUAGE_PATTERNS[lang];
    
    words.forEach(word => {
      if (commonWords.includes(word)) {
        scores[lang]++;
      }
    });
  });

  // Find language with highest score
  let bestLang = 'en';
  let bestScore = scores.en || 0;
  
  Object.keys(scores).forEach(lang => {
    if (scores[lang] > bestScore) {
      bestLang = lang;
      bestScore = scores[lang];
    }
  });

  return bestLang;
}

/**
 * Parse ZIP file structure
 * @param {Array} fileList - Array of file paths from ZIP
 * @returns {Object} Categorized file structure
 */
function parseZipStructure(fileList) {
  const result = {
    markdownFiles: [],
    imageFiles: [],
    otherFiles: []
  };

  fileList.forEach(filepath => {
    const extension = filepath.split('.').pop().toLowerCase();
    
    if (['md', 'txt', 'docx'].includes(extension)) {
      result.markdownFiles.push(filepath);
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      result.imageFiles.push(filepath);
    } else {
      result.otherFiles.push(filepath);
    }
  });

  return result;
}

/**
 * Convert BookBuilder result to PublishJockey book structure
 * @param {Object} classificationResult - Result from classifyDocuments
 * @returns {Object} Book structure compatible with existing system
 */
function convertToBookStructure(classificationResult) {
  const { frontMatter, mainMatter, backMatter, metadata } = classificationResult;

  // Convert to the structure expected by PublishJockey
  const structure = {
    front: frontMatter.map(doc => extractSectionTitle(doc.content)),
    main: mainMatter.map(doc => extractSectionTitle(doc.content)),
    back: backMatter.map(doc => extractSectionTitle(doc.content))
  };

  const content = {};
  
  // Add front matter content
  frontMatter.forEach((doc, index) => {
    const sectionName = structure.front[index];
    content[`front:${sectionName}`] = doc.content;
  });

  // Add main matter content
  mainMatter.forEach((doc, index) => {
    const sectionName = structure.main[index];
    content[`main:${sectionName}`] = doc.content;
  });

  // Add back matter content
  backMatter.forEach((doc, index) => {
    const sectionName = structure.back[index];
    content[`back:${sectionName}`] = doc.content;
  });

  return {
    structure,
    content,
    metadata: {
      title: metadata.title,
      author: metadata.author,
      language: metadata.language
    }
  };
}

/**
 * Extract section title from markdown content
 * @param {string} content - Markdown content
 * @returns {string} Section title
 */
function extractSectionTitle(content) {
  const lines = content.split('\n');
  
  // Look for first # header
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }

  // Fallback to first non-empty line
  for (let line of lines) {
    line = line.trim();
    if (line && !line.startsWith('\\[') && line.length < 100) {
      return line;
    }
  }

  return 'Untitled Section';
}

/**
 * Validate BookBuilder import data
 * @param {Object} bookData - Book data to validate
 * @returns {Object} Validation result with errors if any
 */
function validateImport(bookData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!bookData.metadata.title || bookData.metadata.title === 'Untitled Book') {
    warnings.push('No title detected - you may want to add one manually');
  }

  if (!bookData.metadata.author || bookData.metadata.author === 'Unknown Author') {
    warnings.push('No author detected - you may want to add one manually');
  }

  // Check structure
  if (bookData.structure.front.length === 0 && bookData.structure.main.length === 0) {
    errors.push('No content sections detected - please check your ZIP file');
  }

  if (bookData.structure.main.length === 0) {
    warnings.push('No main content detected - most books should have chapters or main sections');
  }

  // Check for duplicate section names
  const allSections = [...bookData.structure.front, ...bookData.structure.main, ...bookData.structure.back];
  const duplicates = allSections.filter((item, index) => allSections.indexOf(item) !== index);
  
  if (duplicates.length > 0) {
    errors.push(`Duplicate section names detected: ${duplicates.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ES6 exports for React
export {
  classifyDocuments,
  detectLanguage,
  parseZipStructure,
  convertToBookStructure,
  validateImport
};

// For Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    classifyDocuments,
    detectLanguage,
    parseZipStructure,
    convertToBookStructure,
    validateImport
  };
}
