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
      'disclaimer', 'about this book', 'how to use', 'introduction',
      // Spanish keywords
      'página de título', 'derechos de autor', 'dedicatoria', 'agradecimientos',
      'prólogo', 'prefacio', 'tabla de contenidos', 'introducción', 'introduccion',
      // French keywords
      'page de titre', 'droits d\'auteur', 'dédicace', 'remerciements',
      'avant-propos', 'préface', 'table des matières', 'introduction',
      // German keywords
      'titelseite', 'urheberrecht', 'widmung', 'danksagung',
      'vorwort', 'einleitung', 'inhaltsverzeichnis',
      // Italian keywords
      'pagina del titolo', 'diritti d\'autore', 'dedica', 'ringraziamenti',
      'prefazione', 'introduzione', 'indice'
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
      /disclaimer/i,
      // Spanish patterns (handle accent corruption)
      /introducci[oó_]?n/i,
      /pr[oó]logo/i,
      /dedicatoria/i,
      /agradecimientos/i,
      // French patterns
      /introduction/i,
      /avant[_\s]propos/i,
      /remerciements/i,
      // German patterns
      /einleitung/i,
      /vorwort/i,
      /danksagung/i,
      // Italian patterns
      /introduzione/i,
      /prefazione/i,
      /ringraziamenti/i
    ],
    contentPatterns: [
      /^#\s*(title\s+page|copyright|dedication|acknowledgements?|foreword|preface|prologue)/i,
      /table\s+of\s+contents/i,
      /©|\(c\)|copyright/i,
      // Spanish patterns
      /^#\s*(introducción|introduccion|prólogo|prologo|dedicatoria|agradecimientos)/i,
      /derechos\s+de\s+autor|©/i,
      // French patterns
      /^#\s*(introduction|avant-propos|préface|remerciements)/i,
      /droits\s+d'auteur/i,
      // German patterns
      /^#\s*(einleitung|vorwort|danksagung)/i,
      /urheberrecht/i,
      // Italian patterns
      /^#\s*(introduzione|prefazione|ringraziamenti)/i,
      /diritti\s+d'autore/i
    ]
  },
  
  mainMatter: {
    keywords: [
      'chapter', 'part', 'section', 'book',
      // Spanish keywords
      'capítulo', 'capitulo', 'parte', 'sección', 'seccion', 'libro',
      // French keywords
      'chapitre', 'partie', 'section', 'livre',
      // German keywords
      'kapitel', 'teil', 'abschnitt', 'buch',
      // Italian keywords
      'capitolo', 'parte', 'sezione', 'libro'
    ],
    filenamePatterns: [
      /chapter[_\s]*\d+/i,
      /ch[_\s]*\d+/i,
      /part[_\s]*[ivx\d]+/i,
      /section[_\s]*\d+/i,
      /book[_\s]*\d+/i,
      // Spanish patterns
      /cap[íi]tulo[_\s]*\d+/i,
      /cap[_\s]*\d+/i,
      /parte[_\s]*[ivx\d]+/i,
      /secci[óo]n[_\s]*\d+/i,
      /libro[_\s]*\d+/i,
      // French patterns
      /chapitre[_\s]*\d+/i,
      /partie[_\s]*[ivx\d]+/i,
      /livre[_\s]*\d+/i,
      // German patterns
      /kapitel[_\s]*\d+/i,
      /teil[_\s]*[ivx\d]+/i,
      /abschnitt[_\s]*\d+/i,
      /buch[_\s]*\d+/i,
      // Italian patterns
      /capitolo[_\s]*\d+/i,
      /sezione[_\s]*\d+/i,
      /libro[_\s]*\d+/i
    ],
    contentPatterns: [
      /^#\s*chapter\s*\d+/i,
      /^#\s*ch\.\s*\d+/i,
      /^#\s*part\s*[ivx\d]+/i,
      /^#\s*section\s*\d+/i,
      /^#\s*book\s*\d+/i,
      // Spanish patterns
      /^#\s*capítulo\s*\d+/i,
      /^#\s*capitulo\s*\d+/i,
      /^#\s*cap\.\s*\d+/i,
      /^#\s*parte\s*[ivx\d]+/i,
      /^#\s*sección\s*\d+/i,
      /^#\s*seccion\s*\d+/i,
      // French patterns
      /^#\s*chapitre\s*\d+/i,
      /^#\s*partie\s*[ivx\d]+/i,
      // German patterns
      /^#\s*kapitel\s*\d+/i,
      /^#\s*teil\s*[ivx\d]+/i,
      /^#\s*abschnitt\s*\d+/i,
      // Italian patterns
      /^#\s*capitolo\s*\d+/i,
      /^#\s*sezione\s*\d+/i
    ]
  },
  
  backMatter: {
    keywords: [
      'conclusion', 'epilogue', 'afterword', 'references', 'bibliography',
      'index', 'glossary', 'appendix', 'about the author', 'resources',
      'bonus', 'additional', 'further reading', 'notes',
      // Spanish keywords
      'conclusión', 'conclusion', 'epílogo', 'epilogo', 'posfacio',
      'referencias', 'bibliografía', 'bibliografia', 'índice', 'indice',
      'glosario', 'apéndice', 'apendice', 'sobre el autor', 'recursos', 'notas',
      // French keywords
      'conclusion', 'épilogue', 'postface', 'références', 'bibliographie',
      'index', 'glossaire', 'appendice', 'à propos de l\'auteur', 'ressources',
      // German keywords
      'schluss', 'epilog', 'nachwort', 'referenzen', 'bibliographie',
      'index', 'glossar', 'anhang', 'über den autor', 'ressourcen',
      // Italian keywords
      'conclusione', 'epilogo', 'postfazione', 'riferimenti', 'bibliografia',
      'indice', 'glossario', 'appendice', 'sull\'autore', 'risorse'
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
      /notes/i,
      // Spanish patterns
      /conclusi[óo]n/i,
      /ep[íi]logo/i,
      /posfacio/i,
      /referencias/i,
      /bibliograf[íi]a/i,
      /[íi]ndice/i,
      /glosario/i,
      /ap[ée]ndice/i,
      /sobre[_\s]el[_\s]autor/i,
      /recursos/i,
      /notas/i,
      // French patterns
      /épilogue/i,
      /postface/i,
      /références/i,
      /bibliographie/i,
      /glossaire/i,
      /appendice/i,
      /ressources/i,
      // German patterns
      /schluss/i,
      /epilog/i,
      /nachwort/i,
      /referenzen/i,
      /bibliographie/i,
      /glossar/i,
      /anhang/i,
      /ressourcen/i,
      // Italian patterns
      /conclusione/i,
      /epilogo/i,
      /postfazione/i,
      /riferimenti/i,
      /bibliografia/i,
      /glossario/i,
      /appendice/i,
      /risorse/i
    ],
    contentPatterns: [
      /^#\s*(conclusion|epilogue|afterword|references?|bibliography|index|glossary|appendix)/i,
      /^#\s*(about\s+the\s+author|resources?|bonus|notes)/i,
      // Spanish patterns
      /^#\s*(conclusión|conclusion|epílogo|epilogo|posfacio|referencias|bibliografía|bibliografia)/i,
      /^#\s*(índice|indice|glosario|apéndice|apendice|sobre\s+el\s+autor|recursos|notas)/i,
      // French patterns
      /^#\s*(conclusion|épilogue|postface|références|bibliographie|glossaire|appendice)/i,
      /^#\s*(à\s+propos\s+de\s+l'auteur|ressources)/i,
      // German patterns
      /^#\s*(schluss|epilog|nachwort|referenzen|bibliographie|glossar|anhang)/i,
      /^#\s*(über\s+den\s+autor|ressourcen)/i,
      // Italian patterns
      /^#\s*(conclusione|epilogo|postfazione|riferimenti|bibliografia|glossario|appendice)/i,
      /^#\s*(sull'autore|risorse)/i
    ]
  }
};

/**
 * Section name mappings to prevent duplicates across languages
 */
const SECTION_MAPPINGS = {
  introduction: ['introduction', 'introducción', 'introduccion', 'introduction', 'einleitung', 'introduzione'],
  conclusion: ['conclusion', 'conclusión', 'conclusion', 'schluss', 'conclusione'],
  chapter: ['chapter', 'capítulo', 'capitulo', 'chapitre', 'kapitel', 'capitolo'],
  prologue: ['prologue', 'prólogo', 'prologo', 'prologue', 'prolog', 'prologo'],
  epilogue: ['epilogue', 'epílogo', 'epilogo', 'épilogue', 'epilog', 'epilogo'],
  preface: ['preface', 'prefacio', 'préface', 'vorwort', 'prefazione'],
  acknowledgments: ['acknowledgments', 'acknowledgements', 'agradecimientos', 'remerciements', 'danksagung', 'ringraziamenti'],
  bibliography: ['bibliography', 'bibliografía', 'bibliografia', 'bibliographie', 'bibliographie', 'bibliografia'],
  references: ['references', 'referencias', 'références', 'referenzen', 'riferimenti'],
  appendix: ['appendix', 'apéndice', 'apendice', 'appendice', 'anhang', 'appendice'],
  glossary: ['glossary', 'glosario', 'glossaire', 'glossar', 'glossario'],
  index: ['index', 'índice', 'indice', 'index', 'index', 'indice']
};

/**
 * Normalize section names to prevent duplicates
 * @param {string} sectionName - Original section name
 * @returns {string} Normalized section name
 */
function normalizeSectionName(sectionName) {
  const normalized = sectionName.toLowerCase().trim();
  
  // Check each mapping to find a match
  for (const [canonical, variants] of Object.entries(SECTION_MAPPINGS)) {
    if (variants.some(variant => normalized.includes(variant.toLowerCase()))) {
      // Return the canonical English name (capitalized)
      return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }
  
  // If no mapping found, return original (cleaned up)
  return sectionName.trim();
}

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
  
  // Create a mapping of normalized section names to imported documents
  const frontMatterMap = {};
  frontMatter.forEach(doc => {
    const sectionTitle = extractSectionTitle(doc.content);
    const normalizedTitle = normalizeSectionName(sectionTitle);
    frontMatterMap[normalizedTitle] = doc.content;
  });

  // Add front matter content (including auto-generated sections)
  structure.front.forEach(sectionName => {
    const key = `front:${sectionName}`;
    const normalizedSectionName = normalizeSectionName(sectionName);
    
    // Direct match with normalized names
    if (frontMatterMap[normalizedSectionName]) {
      content[key] = frontMatterMap[normalizedSectionName];
    } else {
      // Try fuzzy matching for edge cases
      const matchingContent = Object.keys(frontMatterMap).find(originalTitle => 
        originalTitle.toLowerCase().includes(normalizedSectionName.toLowerCase()) ||
        normalizedSectionName.toLowerCase().includes(originalTitle.toLowerCase()) ||
        (normalizedSectionName.toLowerCase().includes('title') && originalTitle.toLowerCase().includes('title')) ||
        (normalizedSectionName.toLowerCase().includes('copyright') && (originalTitle.toLowerCase().includes('copyright') || originalTitle.toLowerCase().includes('rights')))
      );

      if (matchingContent) {
        content[key] = frontMatterMap[matchingContent];
      } else {
        // Auto-generate content for missing essential sections
        if (normalizedSectionName.toLowerCase() === titlePageName.toLowerCase() || 
            normalizedSectionName.toLowerCase().includes('title')) {
          content[key] = generateTitlePageContent(metadata);
        } else if (normalizedSectionName.toLowerCase() === copyrightName.toLowerCase() || 
                   normalizedSectionName.toLowerCase().includes('copyright')) {
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
 * Extract section title from markdown content
 * @param {string} content - Markdown content
 * @returns {string} Section title
 */
function extractSectionTitle(content) {
  const lines = content.split('\n');
  let rawTitle = '';
  
  // Look for first # header
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('# ')) {
      rawTitle = line.substring(2).trim();
      break;
    }
  }

  // Fallback to first non-empty line
  if (!rawTitle) {
    for (let line of lines) {
      line = line.trim();
      if (line && !line.startsWith('\\[') && line.length < 100) {
        rawTitle = line;
        break;
      }
    }
  }

  if (!rawTitle) {
    return 'Untitled Section';
  }

  // Normalize the section name to prevent duplicates
  return normalizeSectionName(rawTitle);
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
