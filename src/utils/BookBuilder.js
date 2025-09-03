/**
 * BookBuilder - Intelligent Document Classification and Import
 * Converts ZIP archives of documents into structured book format
 */



// Removed all complex classification patterns - we don't need them anymore!
// Simple filename-based import is much more reliable and works in any language.

/**
 * Simple filename-based document import - much more reliable!
 * @param {Array} documents - Array of {filename, content} objects
 * @returns {Object} Classification result with all docs in main matter
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

  // Simple approach: Import all documents as main matter in filename order
  // Users can reorganize in the UI - much more reliable than AI guessing!
  documents.forEach((doc, index) => {
    const extractedTitle = extractSectionTitle(doc.content);
    console.log(`📚 Processing document ${index + 1}:`, {
      filename: doc.filename,
      extractedTitle,
      contentPreview: doc.content.substring(0, 100) + '...'
    });
    
    result.mainMatter.push({
      ...doc,
      confidence: 1.0, // Always confident since we're not guessing
      suggestedOrder: index,
      title: extractedTitle // Extract clean title for display
    });
  });
  
  console.log(`📊 Classification Result:`, {
    frontMatter: result.frontMatter.length,
    mainMatter: result.mainMatter.length,
    backMatter: result.backMatter.length,
    mainMatterTitles: result.mainMatter.map(doc => doc.title)
  });

  return result;
}

// Removed complex classification function - we don't need it anymore!
// The simple filename-based approach is much more reliable.

/**
 * Extract metadata from documents - simplified and more reliable
 * @param {Array} documents - Array of document objects
 * @returns {Object} Extracted metadata
 */
function extractMetadata(documents) {
  let title = '';
  let author = '';
  let language = 'en';

  // Simple approach: Look for title and author in any document
  documents.forEach(doc => {
    const lines = doc.content.split('\n');

    // Look for title (first substantial non-header line)
    if (!title) {
      for (let line of lines) {
        line = line.trim();
        if (line && !line.startsWith('#') && line.length > 3 && line.length < 100) {
          // Skip common non-title patterns
          if (!line.toLowerCase().includes('copyright') && 
              !line.toLowerCase().includes('©') &&
              !line.toLowerCase().includes('derechos') &&
              !line.toLowerCase().includes('por ')) {
            title = line;
            break;
          }
        }
      }
    }

    // Look for author (lines with "By" or "Por" or standalone names)
    if (!author) {
      for (let line of lines) {
        line = line.trim();
        // Spanish: "Por Juan Carlos" or English: "By John Smith"
        const authorMatch = line.match(/^(by|por)\s+([a-záéíóúñü\s]+)$/i);
        if (authorMatch && line.length < 50) {
          author = authorMatch[2].trim();
          break;
        }
        // Standalone name pattern (two words, proper case)
        if (line.match(/^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+\s+[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+$/) && line.length < 30) {
          author = line;
          break;
        }
      }
    }

    // Simple language detection
    if (doc.content.length > 50) {
      const content = doc.content.toLowerCase();
      if (content.includes('el ') || content.includes('la ') || content.includes('de ') || content.includes('que ')) {
        language = 'es';
      } else if (content.includes('le ') || content.includes('de ') || content.includes('et ')) {
        language = 'fr';
      } else if (content.includes('der ') || content.includes('die ') || content.includes('und ')) {
        language = 'de';
      } else if (content.includes('o ') || content.includes('a ') || content.includes('de ') || content.includes('que ')) {
        language = 'pt';
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

// Removed complex language detection - simplified version in extractMetadata is better!

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
 * Convert BookBuilder result to PublishJockey book structure - MUCH SIMPLER!
 * @param {Object} classificationResult - Result from classifyDocuments
 * @returns {Object} Book structure compatible with existing system
 */
function convertToBookStructure(classificationResult) {
  const { frontMatter, mainMatter, backMatter, metadata } = classificationResult;
  
  console.log(`🔄 Converting to book structure:`, {
    frontMatter: frontMatter.length,
    mainMatter: mainMatter.length,
    backMatter: backMatter.length,
    mainMatterTitles: mainMatter.map(doc => doc.title || extractSectionTitle(doc.content))
  });

  // Simple approach: Create structure directly from imported content
  const structure = {
    front: frontMatter.map(doc => doc.title || extractSectionTitle(doc.content)),
    main: mainMatter.map(doc => doc.title || extractSectionTitle(doc.content)),
    back: backMatter.map(doc => doc.title || extractSectionTitle(doc.content))
  };
  
  console.log(`📋 Final structure created:`, structure);

  const content = {};

  // Add all front matter content
  frontMatter.forEach((doc, index) => {
    const sectionName = structure.front[index];
    const contentKey = `front:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added front matter: ${contentKey} (${doc.content.length} chars)`);
  });

  // Add all main matter content
  mainMatter.forEach((doc, index) => {
    const sectionName = structure.main[index];
    const contentKey = `main:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added main matter: ${contentKey} (${doc.content.length} chars)`);
  });

  // Add all back matter content
  backMatter.forEach((doc, index) => {
    const sectionName = structure.back[index];
    const contentKey = `back:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added back matter: ${contentKey} (${doc.content.length} chars)`);
  });
  
  console.log(`✅ Final content keys:`, Object.keys(content));

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
 * Extract section title from markdown content - keep it simple!
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

// Removed auto-generation functions - users import their own content!

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
  parseZipStructure,
  convertToBookStructure,
  validateImport
};

// For Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    classifyDocuments,
    parseZipStructure,
    convertToBookStructure,
    validateImport
  };
}
