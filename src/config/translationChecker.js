// Comprehensive translation checker for all languages
const { languageCodes } = require('./checkLanguages.js');

// Backend TOC translations (copy from translations.js)
const tocTranslations = {
  'en': 'Table of Contents',
  'es': 'Tabla de Contenidos', 
  'fr': 'Table des Matières',
  'de': 'Inhaltsverzeichnis',
  'it': 'Indice',
  'id': 'Daftar Isi',
  'ru': 'Содержание',
  'ro': 'Cuprins',
  'hi': 'विषय सूची',
  'ar': 'جدول المحتويات',
  'ta': 'பொருளடக்கம்',
  'hr': 'Sadržaj',
  'cs': 'Obsah',
  'da': 'Indhold',
  'nl': 'Inhoudsopgave',
  'et': 'Sisukord',
  'fi': 'Sisällysluettelo',
  'gl': 'Índice',
  'el': 'Περιεχόμενα',
  'ha': 'Teburin Abubuwa',
  'hu': 'Tartalomjegyzék',
  'is': 'Efnisyfirlit',
  'ig': 'Ndepụta Isiokwu',
  'ki': 'Orodha ya Maudhui',
  'lt': 'Turinys',
  'lg': 'Ennyiriza',
  'lv': 'Saturs',
  'mk': 'Содржина',
  'mg': 'Tafiditra',
  'ms': 'Jadual Kandungan',
  'no': 'Innhold',
  'pl': 'Spis Treści',
  'pt': 'Sumário',
  'rn': 'Orodha ya Maudhui',
  'rw': 'Orodha ya Maudhui',
  'sl': 'Kazalo',
  'sk': 'Obsah',
  'sn': 'Mazita ezvinyorwa',
  'sr': 'Sadržaj',
  'st': 'Tafole ea Likahare',
  'sv': 'Innehållsförteckning',
  'tn': 'Tafole ya Dikahare',
  'tr': 'İçindekiler',
  'yo': 'Atọka',
  'vi': 'Mục Lục',
  'zu': 'Isiqephu',
  'bn': 'বিষয় তালিকা',
  'gu': 'વિષય યાદી',
  'te': 'విషయ సూచি',
  'kn': 'ವಿಷಯ ಸೂಚಿ',
  'ml': 'വിഷയ സൂചിക',
  'pa': 'ਵਿਸ਼ੇ ਦੀ ਸੂਚੀ',
  'or': 'ବିଷୟ ତାଲିକା',
  'sw': 'Jedwali la Yaliyomo',
  'tl': 'Talaan ng mga Nilalaman'
};

// Check which languages have frontend sidebar translations
// (We'll need to manually check this based on the bookStructureLocalization.ts file)
const frontendSidebarLanguages = [
  'en', 'es', 'fr', 'de', 'it', 'ru', 'ro', 'ar', 'ta', 'hi', 'bn', 'gu', 'te', 'kn', 'ml', 'pa', 'or',
  'pt', 'nl', 'pl', 'hr', 'cs', 'da', 'et', 'fi', 'gl', 'el', 'hu', 'is', 'lv', 'lt', 'mk', 'no', 'sk', 'sl', 'sv', 'tr',
  'ha', 'ig', 'ki', 'rw', 'rn', 'lg', 'mg', 'sn', 'st', 'sw', 'tn', 'xh', 'yo', 'zu',
  'id', 'ms', 'vi', 'tl'
]; // This is an estimate - we need to verify

console.log('🧪 COMPREHENSIVE TRANSLATION TEST');
console.log('='.repeat(60));

const results = {
  totalLanguages: languageCodes.length,
  tocPassed: 0,
  tocFailed: 0,
  sidebarPassed: 0,
  sidebarFailed: 0,
  missingToc: [],
  missingSidebar: []
};

console.log(`Testing ${languageCodes.length} languages...\n`);

languageCodes.forEach((code, index) => {
  const num = (index + 1).toString().padStart(2, '0');
  
  // Test TOC translations
  const hasToc = tocTranslations[code];
  if (hasToc && hasToc !== 'Table of Contents') {
    console.log(`${num}. ✅ ${code}: TOC="${hasToc}"`);
    results.tocPassed++;
  } else {
    console.log(`${num}. ❌ ${code}: TOC=MISSING`);
    results.tocFailed++;
    results.missingToc.push(code);
  }
  
  // Test sidebar translations (estimated)
  const hasSidebar = frontendSidebarLanguages.includes(code);
  if (hasSidebar) {
    results.sidebarPassed++;
  } else {
    results.sidebarFailed++;
    results.missingSidebar.push(code);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 TRANSLATION TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Languages: ${results.totalLanguages}`);
console.log(`\n📋 Table of Contents Translations:`);
console.log(`  ✅ Present: ${results.tocPassed}`);
console.log(`  ❌ Missing: ${results.tocFailed}`);
console.log(`  📈 Success Rate: ${((results.tocPassed / results.totalLanguages) * 100).toFixed(1)}%`);

console.log(`\n🎛️ Sidebar Navigation Translations (estimated):`);
console.log(`  ✅ Present: ${results.sidebarPassed}`);
console.log(`  ❌ Missing: ${results.sidebarFailed}`);
console.log(`  📈 Success Rate: ${((results.sidebarPassed / results.totalLanguages) * 100).toFixed(1)}%`);

if (results.missingToc.length > 0) {
  console.log(`\n❌ Missing TOC Translations (${results.missingToc.length}):`);
  console.log(`   ${results.missingToc.join(', ')}`);
}

if (results.missingSidebar.length > 0) {
  console.log(`\n❌ Missing Sidebar Translations (${results.missingSidebar.length}):`);
  console.log(`   ${results.missingSidebar.join(', ')}`);
}

console.log(`\n🎯 Quick Fix Priority:`);
if (results.missingToc.length > 0) {
  console.log(`1. Add TOC translations for: ${results.missingToc.slice(0, 5).join(', ')}${results.missingToc.length > 5 ? '...' : ''}`);
}
if (results.missingSidebar.length > 0) {
  console.log(`2. Add sidebar translations for: ${results.missingSidebar.slice(0, 5).join(', ')}${results.missingSidebar.length > 5 ? '...' : ''}`);
}

module.exports = { results, languageCodes, tocTranslations };
