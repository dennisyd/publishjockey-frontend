// Quick console test for checking all language translations
// Run this in browser console: copy and paste this entire code

// All 55 language codes
const allLangCodes = ['bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'gl', 'gu', 'ha', 'hi', 'hr', 'hu', 'id', 'ig', 'is', 'it', 'ki', 'kn', 'lg', 'lt', 'lv', 'mg', 'mk', 'ml', 'ms', 'nl', 'no', 'or', 'pa', 'pl', 'pt', 'rn', 'ro', 'ru', 'rw', 'sk', 'sl', 'sn', 'sr', 'st', 'sv', 'sw', 'ta', 'te', 'tl', 'tn', 'tr', 'vi', 'xh', 'yo', 'zu'];

// Language names for reference
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

function quickTestAllLanguages() {
  console.log('🧪 QUICK LANGUAGE TRANSLATION CHECK');
  console.log('='.repeat(50));
  
  // Import the functions (assuming they're globally available)
  if (typeof getLocalizedSectionNames === 'undefined') {
    console.error('❌ getLocalizedSectionNames not found. Make sure you\'re on a page that imports bookStructureLocalization.');
    return;
  }
  
  const failed = [];
  const passed = [];
  
  allLangCodes.forEach((code, index) => {
    const num = (index + 1).toString().padStart(2, '0');
    const name = langNames[code] || code;
    
    try {
      // Test section names
      const sectionNames = getLocalizedSectionNames(code);
      const isEnglish = sectionNames.frontMatter === 'Front Matter';
      
      if (code === 'en') {
        // English should be English
        console.log(`${num}. ✅ ${name}: English (expected)`);
        passed.push(code);
      } else if (isEnglish) {
        console.log(`${num}. ❌ ${name}: Using English fallback`);
        failed.push(code);
      } else {
        console.log(`${num}. ✅ ${name}: "${sectionNames.frontMatter}"`);
        passed.push(code);
      }
    } catch (error) {
      console.log(`${num}. ❌ ${name}: Error - ${error.message}`);
      failed.push(code);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTS:');
  console.log(`Total: ${allLangCodes.length}`);
  console.log(`✅ Translated: ${passed.length}`);
  console.log(`❌ Missing: ${failed.length}`);
  console.log(`Success Rate: ${((passed.length / allLangCodes.length) * 100).toFixed(1)}%`);
  
  if (failed.length > 0) {
    console.log(`\n❌ Languages missing translations:`);
    console.log(failed.map(code => `${code} (${langNames[code]})`).join(', '));
  } else {
    console.log('\n🎉 ALL LANGUAGES HAVE TRANSLATIONS!');
  }
  
  return { passed, failed, total: allLangCodes.length };
}

// Auto-run the test
console.log('📋 Copy this into browser console on a project page:');
console.log('quickTestAllLanguages()');

// Make it available globally
window.quickTestAllLanguages = quickTestAllLanguages;
