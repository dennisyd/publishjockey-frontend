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
    result.mainMatter.push({
      ...doc,
      confidence: 1.0, // Always confident since we're not guessing
      suggestedOrder: index,
      title: extractSectionTitle(doc.content) // Extract clean title for display
    });
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
 * Convert BookBuilder result to PublishJockey book structure
 * @param {Object} classificationResult - Result from classifyDocuments
 * @returns {Object} Book structure compatible with existing system
 */
function convertToBookStructure(classificationResult) {
  const { frontMatter, mainMatter, backMatter, metadata } = classificationResult;

  // Get localized structure for the detected language
  const { getLocalizedBookStructure } = require('./bookStructureLocalization');
  const localizedStructure = getLocalizedBookStructure(metadata.language);
  
  // Get localized names for essential front matter sections
  const titlePageName = localizedStructure.front[0]; // Always "Title Page" equivalent
  const copyrightName = localizedStructure.front[1]; // Always "Copyright" equivalent

  // Convert to the structure expected by PublishJockey
  let frontSections = frontMatter.map(doc => extractSectionTitle(doc.content));
  
  // Ensure Title Page and Copyright are always first two sections
  const hasTitle = frontSections.some(section => 
    section.toLowerCase().includes('title') || 
    section.toLowerCase() === titlePageName.toLowerCase()
  );
  const hasCopyright = frontSections.some(section => 
    section.toLowerCase().includes('copyright') || 
    section.toLowerCase().includes('rights') ||
    section.toLowerCase() === copyrightName.toLowerCase()
  );

  // Add missing essential sections at the beginning
  if (!hasTitle) {
    frontSections.unshift(titlePageName);
  }
  if (!hasCopyright) {
    // Insert copyright after title page
    const titleIndex = frontSections.findIndex(s => 
      s.toLowerCase().includes('title') || s.toLowerCase() === titlePageName.toLowerCase()
    );
    frontSections.splice(titleIndex + 1, 0, copyrightName);
  }

  // Move Title Page and Copyright to correct positions if they exist but are in wrong order
  const titleIdx = frontSections.findIndex(s => 
    s.toLowerCase().includes('title') || s.toLowerCase() === titlePageName.toLowerCase()
  );
  const copyrightIdx = frontSections.findIndex(s => 
    s.toLowerCase().includes('copyright') || s.toLowerCase().includes('rights') || 
    s.toLowerCase() === copyrightName.toLowerCase()
  );

  if (titleIdx > 0) {
    // Move title to first position
    const titleSection = frontSections.splice(titleIdx, 1)[0];
    frontSections.unshift(titleSection);
  }

  if (copyrightIdx > 1 || copyrightIdx === -1) {
    // Move copyright to second position (or add if missing)
    const currentCopyrightIdx = frontSections.findIndex(s => 
      s.toLowerCase().includes('copyright') || s.toLowerCase().includes('rights') || 
      s.toLowerCase() === copyrightName.toLowerCase()
    );
    if (currentCopyrightIdx > 1) {
      const copyrightSection = frontSections.splice(currentCopyrightIdx, 1)[0];
      frontSections.splice(1, 0, copyrightSection);
    }
  }

  const structure = {
    front: frontSections,
    main: mainMatter.map(doc => extractSectionTitle(doc.content)),
    back: backMatter.map(doc => extractSectionTitle(doc.content))
  };

  const content = {};
  
  // Create a simple mapping of section titles to content
  const frontMatterMap = {};
  frontMatter.forEach(doc => {
    const sectionTitle = extractSectionTitle(doc.content);
    frontMatterMap[sectionTitle] = doc.content;
  });

  // Add front matter content (including auto-generated sections)
  structure.front.forEach(sectionName => {
    const key = `front:${sectionName}`;
    
    // Direct match first
    if (frontMatterMap[sectionName]) {
      content[key] = frontMatterMap[sectionName];
    } else {
      // Try fuzzy matching for edge cases
      const matchingContent = Object.keys(frontMatterMap).find(originalTitle => 
        originalTitle.toLowerCase().includes(sectionName.toLowerCase()) ||
        sectionName.toLowerCase().includes(originalTitle.toLowerCase()) ||
        (sectionName.toLowerCase().includes('title') && originalTitle.toLowerCase().includes('title')) ||
        (sectionName.toLowerCase().includes('copyright') && (originalTitle.toLowerCase().includes('copyright') || originalTitle.toLowerCase().includes('rights')))
      );

      if (matchingContent) {
        content[key] = frontMatterMap[matchingContent];
      } else {
        // Auto-generate content for missing essential sections
        if (sectionName.toLowerCase() === titlePageName.toLowerCase() || 
            sectionName.toLowerCase().includes('title')) {
          content[key] = generateTitlePageContent(metadata);
        } else if (sectionName.toLowerCase() === copyrightName.toLowerCase() || 
                   sectionName.toLowerCase().includes('copyright')) {
          content[key] = generateCopyrightContent(metadata);
        } else {
          content[key] = ''; // Empty content for other missing sections
        }
      }
    }
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

/**
 * Generate Title Page content using metadata
 * @param {Object} metadata - Book metadata
 * @returns {string} Generated title page markdown
 */
function generateTitlePageContent(metadata) {
  return `# ${metadata.title || 'Untitled Book'}

${metadata.author ? `**${metadata.author}**` : '**Author Name**'}

---

*Please update the project metadata to customize this title page*`;
}

/**
 * Generate Copyright content using metadata and language
 * @param {Object} metadata - Book metadata
 * @returns {string} Generated copyright markdown
 */
function generateCopyrightContent(metadata) {
  const year = new Date().getFullYear();
  const author = metadata.author || 'Author Name';
  const title = metadata.title || 'Untitled Book';
  
  // Basic copyright notice - will be enhanced by the system's copyright generation
  return `© ${year} ${author}

All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author.

**${title}**

---

*This copyright page will be automatically localized based on your selected language. Please update the project metadata to customize the author and title information.*`;
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
