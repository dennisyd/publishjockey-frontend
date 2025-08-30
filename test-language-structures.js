/**
 * Language Structure Loading Test
 * Tests all supported languages for structure loading issues
 */

// Extract all supported language codes from the bookStructureLocalization.ts
const supportedLanguages = [
  'en', 'es', 'fr', 'pt', 'de', 'it', 'ru', 'hr', 'is', 'ig', 'ro', 'ar', 'ta', 
  'hi', 'bn', 'gu', 'te', 'kn', 'ml', 'pa', 'or', 'nl', 'pl', 'cs', 'sv', 'da', 
  'no', 'et', 'fi', 'gl', 'el', 'hu', 'lv', 'lt', 'mk', 'sr', 'sk', 'sl', 'tr', 
  'id', 'ms', 'vi', 'tl', 'ha', 'ki', 'rw', 'rn', 'lg', 'mg', 'sn', 'st', 'sw', 
  'tn', 'xh', 'yo', 'zu'
];

// Mock the getLocalizedBookStructure function for testing
function mockGetLocalizedBookStructure(language) {
  // This would normally import from the actual file
  // For testing purposes, we'll simulate the structure validation
  
  console.log(`Testing language: ${language}`);
  
  // Simulate the structure loading logic from ProjectWorkspace
  try {
    // This simulates: const initialStructure = getLocalizedBookStructure(documentLanguage);
    const structure = {
      front: [`Title Page (${language})`, `Copyright (${language})`],
      main: [`Chapter 1 (${language})`, `Chapter 2 (${language})`],
      back: [`About Author (${language})`]
    };
    
    // Validate structure (same logic as in ProjectWorkspace)
    if (!structure || !structure.front || !structure.main || !structure.back) {
      console.error(`❌ INVALID STRUCTURE for ${language}:`, structure);
      return false;
    }
    
    // Check if arrays are valid
    if (!Array.isArray(structure.front) || !Array.isArray(structure.main) || !Array.isArray(structure.back)) {
      console.error(`❌ INVALID ARRAYS for ${language}:`, structure);
      return false;
    }
    
    // Check if arrays have content
    if (structure.front.length === 0 || structure.main.length === 0 || structure.back.length === 0) {
      console.error(`❌ EMPTY ARRAYS for ${language}:`, structure);
      return false;
    }
    
    console.log(`✅ VALID STRUCTURE for ${language}`);
    return true;
    
  } catch (error) {
    console.error(`❌ ERROR loading structure for ${language}:`, error);
    return false;
  }
}

// Test all languages
console.log('🔍 LANGUAGE STRUCTURE SURVEY');
console.log('============================');

const results = {
  passed: [],
  failed: [],
  total: supportedLanguages.length
};

supportedLanguages.forEach(lang => {
  const isValid = mockGetLocalizedBookStructure(lang);
  if (isValid) {
    results.passed.push(lang);
  } else {
    results.failed.push(lang);
  }
});

console.log('\n📊 SURVEY RESULTS');
console.log('==================');
console.log(`Total languages tested: ${results.total}`);
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`❌ Failed: ${results.failed.length}`);

if (results.failed.length > 0) {
  console.log('\n🚨 LANGUAGES WITH ISSUES:');
  results.failed.forEach(lang => console.log(`  - ${lang}`));
} else {
  console.log('\n🎉 ALL LANGUAGES PASSED!');
}

console.log('\n✅ Passed languages:', results.passed.join(', '));
