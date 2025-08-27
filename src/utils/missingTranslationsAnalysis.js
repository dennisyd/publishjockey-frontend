// Analysis to find missing translations in bookStructureLocalization.ts
// All 55 supported language codes
const allLanguageCodes = ['bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'gl', 'gu', 'ha', 'hi', 'hr', 'hu', 'id', 'ig', 'is', 'it', 'ki', 'kn', 'lg', 'lt', 'lv', 'mg', 'mk', 'ml', 'ms', 'nl', 'no', 'or', 'pa', 'pl', 'pt', 'rn', 'ro', 'ru', 'rw', 'sk', 'sl', 'sn', 'sr', 'st', 'sv', 'sw', 'ta', 'te', 'tl', 'tn', 'tr', 'vi', 'xh', 'yo', 'zu'];

// What I can see in sectionNames based on the file (lines visible in the read)
const sectionNamesLanguages = [
  'en', 'es', 'fr', 'de', 'it', 'ru', 'ro', 'ar', 'ta', 'hi', 'bn', 'gu', 'te', 'kn', 'ml', 'pa', 'or',
  'pt', 'nl', 'pl', 'hr', 'cs', 'da', 'et', 'fi', 'gl', 'el', 'hu', 'is', 'lv', 'lt', 'mk', 'no', 'sk', 'sl', 'sv', 'tr',
  'ha', 'ig', 'ki', 'rw', 'rn', 'lg', 'mg', 'sn', 'st', 'sw', 'tn', 'xh', 'yo', 'zu',
  'id', 'ms', 'vi', 'tl'
];

console.log('🔍 MISSING TRANSLATIONS ANALYSIS');
console.log('='.repeat(50));

console.log(`📊 Total supported languages: ${allLanguageCodes.length}`);
console.log(`📊 Languages with sectionNames: ${sectionNamesLanguages.length}`);

// Find missing languages
const missingFromSectionNames = allLanguageCodes.filter(code => !sectionNamesLanguages.includes(code));

if (missingFromSectionNames.length > 0) {
  console.log(`\n❌ Missing from sectionNames (${missingFromSectionNames.length}):`);
  missingFromSectionNames.forEach(code => {
    console.log(`   ${code} - Add sectionNames entry`);
  });
} else {
  console.log('\n✅ All languages have sectionNames entries');
}

// Check for extra languages
const extraInSectionNames = sectionNamesLanguages.filter(code => !allLanguageCodes.includes(code));
if (extraInSectionNames.length > 0) {
  console.log(`\n⚠️ Extra in sectionNames (not in supported list): ${extraInSectionNames.join(', ')}`);
}

console.log(`\n📋 Languages by region (for reference):`);
console.log(`African (14): ha, ig, ki, rw, rn, lg, mg, sn, st, sw, tn, xh, yo, zu`);
console.log(`European (28): hr, cs, da, nl, en, et, fi, fr, gl, de, el, hu, is, it, lv, lt, mk, no, pl, pt, ro, ru, sr, sk, sl, es, sv, tr`);
console.log(`Asian (13): id, ms, vi, hi, bn, gu, te, kn, ml, pa, or, ta, tl`);

module.exports = { 
  allLanguageCodes, 
  sectionNamesLanguages, 
  missingFromSectionNames, 
  extraInSectionNames 
};
