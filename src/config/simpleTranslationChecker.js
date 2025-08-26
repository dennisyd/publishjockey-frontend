// Simple translation checker for all 55 languages
const allLanguageCodes = ['bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'gl', 'gu', 'ha', 'hi', 'hr', 'hu', 'id', 'ig', 'is', 'it', 'ki', 'kn', 'lg', 'lt', 'lv', 'mg', 'mk', 'ml', 'ms', 'nl', 'no', 'or', 'pa', 'pl', 'pt', 'rn', 'ro', 'ru', 'rw', 'sk', 'sl', 'sn', 'sr', 'st', 'sv', 'sw', 'ta', 'te', 'tl', 'tn', 'tr', 'vi', 'xh', 'yo', 'zu'];

// Backend TOC translations (from translations.js)
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
  'xh': 'Uluhlu Lweziqulatho',
  'yo': 'Atọka',
  'vi': 'Mục Lục',
  'zu': 'Isiqephu',
  'bn': 'বিষয় তালিকা',
  'gu': 'વિષય યાદી',
  'te': 'విষయ সূচি',
  'kn': 'ವಿಷಯ ಸೂಚಿ',
  'ml': 'വിഷയ സൂചിക',
  'pa': 'ਵਿਸ਼ੇ ਦੀ ਸੂਚੀ',
  'or': 'ବିଷୟ ତାଲିକା',
  'sw': 'Jedwali la Yaliyomo',
  'tl': 'Talaan ng mga Nilalaman'
};

console.log('🧪 TRANSLATION CHECK FOR ALL 55 LANGUAGES');
console.log('='.repeat(60));

const missingToc = [];
const presentToc = [];

allLanguageCodes.forEach((code, index) => {
  const num = (index + 1).toString().padStart(2, '0');
  const translation = tocTranslations[code];
  
  if (code === 'en') {
    // English is the fallback language - it should return 'Table of Contents'
    console.log(`${num}. ✅ ${code}: "Table of Contents" (fallback)`);
    presentToc.push(code);
  } else if (translation && translation !== 'Table of Contents') {
    console.log(`${num}. ✅ ${code}: "${translation}"`);
    presentToc.push(code);
  } else {
    console.log(`${num}. ❌ ${code}: MISSING TOC TRANSLATION`);
    missingToc.push(code);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESULTS SUMMARY');
console.log('='.repeat(60));
console.log(`Total Languages: ${allLanguageCodes.length}`);
console.log(`✅ TOC Translations Present: ${presentToc.length}`);
console.log(`❌ TOC Translations Missing: ${missingToc.length}`);
console.log(`📈 Success Rate: ${((presentToc.length / allLanguageCodes.length) * 100).toFixed(1)}%`);

if (missingToc.length > 0) {
  console.log(`\n❌ MISSING TOC TRANSLATIONS:`);
  console.log(`   ${missingToc.join(', ')}`);
  
  console.log(`\n📝 QUICK FIX - Add these to translations.js:`);
  missingToc.forEach(code => {
    console.log(`   '${code}': 'TABLE_OF_CONTENTS_IN_${code.toUpperCase()}',`);
  });
}

console.log(`\n🔍 Next: Check frontend sidebar translations in bookStructureLocalization.ts`);
console.log(`     Look for: sectionNames object with ${allLanguageCodes.length} language entries`);

module.exports = { allLanguageCodes, missingToc, presentToc };
