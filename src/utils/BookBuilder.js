/**
 * BookBuilder - Intelligent Document Classification and Import
 * Converts ZIP archives of documents into structured book format
 */



// Removed all complex classification patterns - we don't need them anymore!
// Simple filename-based import is much more reliable and works in any language.

/**
 * Improved document classification - handles Spanish and other languages better
 * @param {Array} documents - Array of {filename, content} objects
 * @returns {Object} Classification result with proper matter distribution
 */
function classifyDocuments(documents) {
  console.log('🔍 BookBuilder: Starting classification of', documents.length, 'documents');
  
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
  console.log('📊 BookBuilder: Extracted metadata:', result.metadata);

  // Process each document
  documents.forEach((doc, index) => {
    console.log(`📄 Processing document ${index + 1}:`, doc.filename);
    
    const extractedTitle = extractSectionTitle(doc.content);
    console.log(`📝 Extracted title: "${extractedTitle}"`);
    console.log(`📝 Content preview: "${doc.content.substring(0, 100)}..."`);
    
    const processedDoc = {
      ...doc,
      confidence: 1.0,
      suggestedOrder: index,
      title: extractedTitle
    };

    // Simple classification based on content patterns  
    const title = extractedTitle.toLowerCase();
    
    // Front matter: introductions, prefaces, etc.
    if (title.includes('introducción') || 
        title.includes('introduction') || 
        title.includes('prefacio') || 
        title.includes('preface') ||
        title.includes('prólogo') ||
        title.includes('prologue')) {
      console.log(`📋 Classified as FRONT matter: ${extractedTitle}`);
      result.frontMatter.push(processedDoc);
    }
    // Back matter: conclusions, appendices, etc.
    else if (title.includes('conclusión') || 
             title.includes('conclusion') || 
             title.includes('apéndice') || 
             title.includes('appendix') ||
             title.includes('bibliografía') ||
             title.includes('bibliography')) {
      console.log(`📋 Classified as BACK matter: ${extractedTitle}`);
      result.backMatter.push(processedDoc);
    }
    // Main matter: everything else
    else {
      console.log(`📋 Classified as MAIN matter: ${extractedTitle}`);
      result.mainMatter.push(processedDoc);
    }
  });

  console.log('✅ BookBuilder: Classification complete:', {
    front: result.frontMatter.length,
    main: result.mainMatter.length,
    back: result.backMatter.length
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
 * Convert BookBuilder result to PublishJockey book structure - with proper pinning
 * @param {Object} classificationResult - Result from classifyDocuments
 * @returns {Object} Book structure compatible with existing system
 */
function convertToBookStructure(classificationResult) {
  console.log('🔄 BookBuilder: Converting to book structure...');
  const { frontMatter, mainMatter, backMatter, metadata } = classificationResult;

  // Get localized structure for the detected language to ensure proper section names
  const { getLocalizedBookStructure } = require('./bookStructureLocalization');
  const localizedStructure = getLocalizedBookStructure(metadata.language || 'en');
  
  console.log('🌍 Using localized structure for language:', metadata.language);
  console.log('📋 Localized sections:', localizedStructure);

  // Create front matter with Title Page and Copyright pinned at top
  const frontSections = [];
  
  // Always add Title Page and Copyright at the top (localized names)
  frontSections.push(localizedStructure.front[0]); // Title Page (localized)
  frontSections.push(localizedStructure.front[1]); // Copyright (localized)
  
  // Add imported front matter sections after the pinned ones
  frontMatter.forEach(doc => {
    const sectionTitle = doc.title || extractSectionTitle(doc.content);
    frontSections.push(sectionTitle);
  });

  // Create structure with pinned sections
  const structure = {
    front: frontSections,
    main: mainMatter.map(doc => doc.title || extractSectionTitle(doc.content)),
    back: backMatter.map(doc => doc.title || extractSectionTitle(doc.content))
  };

  console.log('📋 BookBuilder: Created structure with pinned sections:', structure);

  const content = {};

  // Note: Title Page and Copyright content will be auto-generated by the system
  // We only add content for imported sections

  // Add imported front matter content (skip Title Page and Copyright - they're auto-generated)
  frontMatter.forEach((doc, index) => {
    const sectionName = doc.title || extractSectionTitle(doc.content);
    const contentKey = `front:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added front matter: "${sectionName}" (${doc.content.length} chars)`);
  });

  // Add all main matter content
  mainMatter.forEach((doc, index) => {
    const sectionName = structure.main[index];
    const contentKey = `main:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added main matter: "${sectionName}" (${doc.content.length} chars)`);
  });

  // Add all back matter content
  backMatter.forEach((doc, index) => {
    const sectionName = structure.back[index];
    const contentKey = `back:${sectionName}`;
    content[contentKey] = doc.content;
    console.log(`📝 Added back matter: "${sectionName}" (${doc.content.length} chars)`);
  });

  const result = {
    structure,
    content,
    metadata: {
      title: metadata.title,
      author: metadata.author,
      language: metadata.language
    },
    createdVia: 'book-builder' // Important: Mark as BookBuilder import
  };

  console.log('✅ BookBuilder: Conversion complete. Total content keys:', Object.keys(content).length);
  console.log('🏷️ BookBuilder: Content keys:', Object.keys(content));
  console.log('📌 Pinned sections: Title Page and Copyright at top of front matter');

  return result;
}

/**
 * Extract section title from markdown content - improved for Spanish and other languages
 * @param {string} content - Markdown content
 * @returns {string} Section title
 */
function extractSectionTitle(content) {
  if (!content || content.trim().length === 0) {
    return 'Untitled Section';
  }

  const lines = content.split('\n');
  
  // Look for any markdown header (# ## ### etc.)
  for (let line of lines) {
    line = line.trim();
    if (line.match(/^#+\s+/)) {
      return line.replace(/^#+\s+/, '').trim();
    }
  }

  // Look for first substantial line (not copyright, not metadata)
  for (let line of lines) {
    line = line.trim();
    if (line && 
        line.length > 2 && 
        line.length < 100 && 
        !line.startsWith('\\[') && 
        !line.startsWith('---') &&
        !line.toLowerCase().includes('copyright') &&
        !line.toLowerCase().includes('©') &&
        !line.toLowerCase().includes('derechos') &&
        !line.toLowerCase().includes('por juan') &&
        !line.toLowerCase().includes('by ') &&
        !line.toLowerCase().includes('por ') &&
        !line.match(/^\d{4}/) // Skip years
    ) {
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
