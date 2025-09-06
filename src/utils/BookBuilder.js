/**
 * BookBuilder - Intelligent Document Classification and Import
 * Converts ZIP archives of documents into structured book format
 */



// Removed all complex classification patterns - we don't need them anymore!
// Simple filename-based import is much more reliable and works in any language.

/**
 * Improved document classification - uses user-selected language
 * @param {Array} documents - Array of {filename, content} objects
 * @param {string} userLanguage - Language selected by user in dashboard
 * @returns {Object} Classification result with proper matter distribution
 */
function classifyDocuments(documents, userLanguage = 'en') {
  console.log('🔍 BookBuilder: Starting classification of', documents.length, 'documents');
  console.log('🌍 BookBuilder: Using user-selected language:', userLanguage);
  
  const result = {
    frontMatter: [],
    mainMatter: [],
    backMatter: [],
    metadata: {
      title: '',
      author: '',
      language: userLanguage,
      totalSections: documents.length
    }
  };

  // Extract metadata first (with user-selected language)
  result.metadata = extractMetadata(documents, userLanguage);
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
    
    // Skip system pages that should be managed by the app (case-insensitive)
    if (title.includes('title page') || 
        title.includes('página de título') ||
        title.includes('pagina de titulo') || // Without accent
        title.includes('page de titre') ||
        title.includes('titelseite') ||
        title.includes('portada') || // Spanish alternative
        title.includes('copyright') ||
        title.includes('derechos de autor') ||
        title.includes('derechos') ||
        title.includes('droits d\'auteur') ||
        title.includes('urheberrecht') ||
        title.includes('direitos autorais') ||
        title.includes('diritti d\'autore') ||
        // Also skip generic titles that might be system pages
        title === 'title' ||
        title === 'título' ||
        title === 'titulo') {
      console.log(`🚫 SKIPPED system page: ${extractedTitle} (will be auto-generated)`);
      return; // Skip this document entirely
    }
    
    // Define language-specific patterns
    const getLanguagePatterns = (lang) => {
      const patterns = {
        'es': {
          front: ['introducción', 'introduccion', 'prefacio', 'prólogo', 'prologo'],
          back: ['conclusión', 'conclusion', 'apéndice', 'apendice', 'bibliografía', 'bibliografia']
        },
        'en': {
          front: ['introduction', 'preface', 'prologue', 'foreword'],
          back: ['conclusion', 'appendix', 'bibliography', 'references']
        },
        'fr': {
          front: ['introduction', 'préface', 'prologue', 'avant-propos'],
          back: ['conclusion', 'appendice', 'bibliographie', 'références']
        },
        'de': {
          front: ['einleitung', 'vorwort', 'prolog'],
          back: ['schluss', 'anhang', 'bibliographie', 'literatur']
        },
        'pt': {
          front: ['introdução', 'introducao', 'prefácio', 'prefacio', 'prólogo', 'prologo'],
          back: ['conclusão', 'conclusao', 'apêndice', 'apendice', 'bibliografia']
        },
        'it': {
          front: ['introduzione', 'prefazione', 'prologo'],
          back: ['conclusione', 'appendice', 'bibliografia']
        }
        // Add more languages as needed
      };
      
      // Return patterns for the specified language, fallback to English
      return patterns[lang] || patterns['en'];
    };

    const langPatterns = getLanguagePatterns(userLanguage);
    console.log(`🌍 Using language patterns for "${userLanguage}":`, langPatterns);
    
    // Check if title matches front matter patterns for the current language ONLY
    const isFrontMatter = langPatterns.front.some(pattern => title.includes(pattern));
    const isBackMatter = langPatterns.back.some(pattern => title.includes(pattern));
    
    if (isFrontMatter) {
      console.log(`📋 Classified as FRONT matter: ${extractedTitle} (matched ${userLanguage} patterns)`);
      result.frontMatter.push(processedDoc);
    }
    else if (isBackMatter) {
      console.log(`📋 Classified as BACK matter: ${extractedTitle} (matched ${userLanguage} patterns)`);
      result.backMatter.push(processedDoc);
    }
    else {
      console.log(`📋 Classified as MAIN matter: ${extractedTitle} (no ${userLanguage} pattern match)`);
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
 * Extract metadata from documents - user controls language selection
 * @param {Array} documents - Array of document objects
 * @param {string} userLanguage - Language selected by user in dashboard
 * @returns {Object} Extracted metadata
 */
function extractMetadata(documents, userLanguage = 'en') {
  let title = '';
  let author = '';

  console.log('📊 BookBuilder: Using user-selected language:', userLanguage);

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

    // Look for author (multilingual patterns based on user language)
    if (!author) {
      for (let line of lines) {
        line = line.trim();
        // Multilingual author patterns
        const authorMatch = line.match(/^(by|por|par|von|di|door|przez|od|av|af|από|від|من|によって)\s+([a-záéíóúñüàèéêëîïôöùûüÿçñ\s]+)$/i);
        if (authorMatch && line.length < 50) {
          author = authorMatch[2].trim();
          break;
        }
        // Standalone name pattern (two words, proper case) - works for most languages
        if (line.match(/^[A-ZÁÉÍÓÚÑÜÀÈÉÊËÎÏÔÖÙÛÜŸÇ][a-záéíóúñüàèéêëîïôöùûüÿç]+\s+[A-ZÁÉÍÓÚÑÜÀÈÉÊËÎÏÔÖÙÛÜŸÇ][a-záéíóúñüàèéêëîïôöùûüÿç]+$/) && line.length < 30) {
          author = line;
          break;
        }
      }
    }
  });

  return {
    title: title || 'Untitled Book',
    author: author || 'Unknown Author',
    language: userLanguage, // Use user-selected language
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

  // Get localized structure ONLY for the pinned system pages (Title Page and Copyright)
  const { getLocalizedBookStructure } = require('./bookStructureLocalization');
  const localizedStructure = getLocalizedBookStructure(metadata.language || 'en');
  
  console.log('🌍 BookBuilder DEBUG: Using language:', metadata.language);
  console.log('🌍 BookBuilder DEBUG: Full localized structure:', localizedStructure);
  console.log('📋 BookBuilder DEBUG: System pages:', {
    titlePage: localizedStructure.front[0],
    copyright: localizedStructure.front[1],
    fullFrontArray: localizedStructure.front
  });

  // Create front matter with ONLY the 2 pinned system pages + imported content
  const frontSections = [];
  
  // Add ONLY the 2 pinned system pages (Title Page and Copyright)
  const titlePageName = localizedStructure.front[0]; // e.g., "Página de título"
  const copyrightName = localizedStructure.front[1];  // e.g., "Derechos de autor"
  
  frontSections.push(titlePageName);
  frontSections.push(copyrightName);
  
  console.log('📌 BookBuilder DEBUG: Added pinned system pages:', frontSections);
  console.log('📄 BookBuilder DEBUG: Imported frontMatter documents:', frontMatter.map(doc => ({
    filename: doc.filename,
    title: doc.title,
    extractedTitle: extractSectionTitle(doc.content),
    contentPreview: doc.content.substring(0, 100) + '...'
  })));
  
  // Add ONLY imported front matter sections (no default template sections)
  frontMatter.forEach(doc => {
    const sectionTitle = doc.title || extractSectionTitle(doc.content);
    frontSections.push(sectionTitle);
    console.log('📄 BookBuilder DEBUG: Added imported front matter:', sectionTitle);
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

  console.log('✅ BookBuilder DEBUG: Conversion complete. Total content keys:', Object.keys(content).length);
  console.log('🏷️ BookBuilder DEBUG: Content keys:', Object.keys(content));
  console.log('📌 BookBuilder DEBUG: Pinned sections: Title Page and Copyright at top of front matter');
  console.log('🔍 BookBuilder DEBUG: Final front sections breakdown:', {
    totalFrontSections: structure.front.length,
    sections: structure.front.map((section, index) => ({
      index,
      name: section,
      type: index < 2 ? 'PINNED_SYSTEM' : 'IMPORTED_USER'
    }))
  });

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

  // Look for first substantial line (not copyright, not metadata, not system pages)
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
        !line.toLowerCase().includes('title page') &&
        !line.toLowerCase().includes('página de título') &&
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

  // Inform about system page handling
  warnings.push('Title Page and Copyright are auto-generated - any imported title/copyright pages were skipped');

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
