// Fixed language test - correct logic
// Run this in browser console on your project page

const allLangCodes = ['bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'gl', 'gu', 'ha', 'hi', 'hr', 'hu', 'id', 'ig', 'is', 'it', 'ki', 'kn', 'lg', 'lt', 'lv', 'mg', 'mk', 'ml', 'ms', 'nl', 'no', 'or', 'pa', 'pl', 'pt', 'rn', 'ro', 'ru', 'rw', 'sk', 'sl', 'sn', 'sr', 'st', 'sv', 'sw', 'ta', 'te', 'tl', 'tn', 'tr', 'vi', 'xh', 'yo', 'zu'];

const langNames = {
  'bn': 'Bengali', 'cs': 'Czech', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English',
  'es': 'Spanish', 'et': 'Estonian', 'fi': 'Finnish', 'fr': 'French', 'gl': 'Galician', 'gu': 'Gujarati',
  'ha': 'Hausa', 'hi': 'Hindi', 'hr': 'Croatian', 'hu': 'Hungarian', 'id': 'Indonesian', 'ig': 'Igbo',
  'is': 'Icelandic', 'it': 'Italian', 'ki': 'Kikuyu', 'kn': 'Kannada', 'lg': 'Luganda', 'lt': 'Lithuanian',
  'lv': 'Latvian', 'mg': 'Malagasy', 'mk': 'Macedonian', 'ml': 'Malayalam', 'ms': 'Malaysian', 'nl': 'Dutch',
  'no': 'Norwegian', 'or': 'Oriya', 'pa': 'Punjabi', 'pl': 'Polish', 'pt': 'Portuguese', 'rn': 'Kirundi',
  'ro': 'Romanian', 'ru': 'Russian', 'rw': 'Kinyarwanda', 'sk': 'Slovak', 'sl': 'Slovenian', 'sn': 'Shona',
  'sr': 'Serbian', 'st': 'Sotho', 'sv': 'Swedish', 'sw': 'Swahili', 'ta': 'Tamil', 'te': 'Telugu',
  'tl': 'Filipino', 'tn': 'Tswana', 'tr': 'Turkish', 'vi': 'Vietnamese', 'xh': 'Xhosa', 'yo': 'Yoruba', 'zu': 'Zulu'
};

function fixedLanguageTest() {
  console.log('🧪 FIXED LANGUAGE TEST - Checking All 55 Languages');
  console.log('='.repeat(60));
  
  if (typeof getLocalizedSectionNames === 'undefined') {
    console.error('❌ getLocalizedSectionNames not found. Make sure you\'re on the project workspace page.');
    return;
  }
  
  // Get English baseline for comparison
  const englishSectionNames = getLocalizedSectionNames('en');
  console.log('📋 English baseline:', englishSectionNames);
  
  const results = {
    translated: [],
    missing: [],
    errors: []
  };
  
  allLangCodes.forEach((code, index) => {
    const num = (index + 1).toString().padStart(2, '0');
    const name = langNames[code] || code;
    
    try {
      const sectionNames = getLocalizedSectionNames(code);
      
      if (code === 'en') {
        // English is the baseline
        console.log(`${num}. ✅ ${name}: "${sectionNames.frontMatter}" (baseline)`);
        results.translated.push(code);
      } else {
        // For other languages, check if they have different text than English
        const hasTranslation = 
          sectionNames.frontMatter !== englishSectionNames.frontMatter ||
          sectionNames.mainMatter !== englishSectionNames.mainMatter ||
          sectionNames.backMatter !== englishSectionNames.backMatter;
        
        if (hasTranslation) {
          console.log(`${num}. ✅ ${name}: "${sectionNames.frontMatter}", "${sectionNames.mainMatter}", "${sectionNames.backMatter}"`);
          results.translated.push(code);
        } else {
          console.log(`${num}. ❌ ${name}: Using English fallback`);
          results.missing.push(code);
        }
      }
    } catch (error) {
      console.log(`${num}. ❌ ${name}: Error - ${error.message}`);
      results.errors.push(code);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 CORRECTED RESULTS:');
  console.log(`Total Languages: ${allLangCodes.length}`);
  console.log(`✅ Translated: ${results.translated.length}`);
  console.log(`❌ Missing: ${results.missing.length}`);
  console.log(`⚠️ Errors: ${results.errors.length}`);
  console.log(`📈 Success Rate: ${((results.translated.length / allLangCodes.length) * 100).toFixed(1)}%`);
  
  if (results.missing.length > 0) {
    console.log(`\n❌ Languages missing translations (${results.missing.length}):`);
    const missingWithNames = results.missing.map(code => `${code} (${langNames[code]})`);
    console.log(missingWithNames.join(', '));
    
    console.log(`\n🛠️ Quick fix needed for: ${results.missing.join(', ')}`);
  }
  
  if (results.errors.length > 0) {
    console.log(`\n⚠️ Languages with errors: ${results.errors.join(', ')}`);
  }
  
  if (results.missing.length === 0 && results.errors.length === 0) {
    console.log('\n🎉 ALL LANGUAGES HAVE COMPLETE TRANSLATIONS!');
  }
  
  return results;
}

// Make it available globally and auto-run
window.fixedLanguageTest = fixedLanguageTest;
console.log('📋 Run: fixedLanguageTest()');
