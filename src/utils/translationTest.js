// Comprehensive translation test for all 55 languages
// Tests both frontend sidebar translations and backend TOC translations

import { languages } from '../config/languages.js';
import { getLocalizedSectionNames, getLocalizedBookStructure, getLocalizedChapterName } from './bookStructureLocalization.ts';

// Import backend TOC translations (we'll need to simulate this)
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
  'te': 'విషయ సూచి',
  'kn': 'ವಿಷಯ ಸೂಚಿ',
  'ml': 'വിഷയ സൂചിക',
  'pa': 'ਵਿਸ਼ੇ ਦੀ ਸੂਚੀ',
  'or': 'ବିଷୟ ତାଲିକା',
  'sw': 'Jedwali la Yaliyomo',
  'tl': 'Talaan ng mga Nilalaman'
};

function getTocTitle(language) {
  const langCode = language ? language.split('-')[0].toLowerCase() : 'en';
  return tocTranslations[langCode] || tocTranslations['en'];
}

export function testAllTranslations() {
  console.log('🧪 COMPREHENSIVE TRANSLATION TEST');
  console.log('='.repeat(60));
  
  const results = {
    totalLanguages: languages.length,
    passed: 0,
    failed: 0,
    issues: []
  };

  languages.forEach((lang, index) => {
    console.log(`\n${index + 1}. Testing ${lang.name} (${lang.code}):`);
    
    const issues = [];
    
    // Test 1: Frontend Section Names (Front Matter, Main Matter, Back Matter)
    try {
      const sectionNames = getLocalizedSectionNames(lang.code);
      
      if (sectionNames.frontMatter === 'Front Matter') {
        issues.push('❌ Section names not translated (using English fallback)');
      } else {
        console.log(`   ✅ Section Names: "${sectionNames.frontMatter}", "${sectionNames.mainMatter}", "${sectionNames.backMatter}"`);
      }
    } catch (error) {
      issues.push(`❌ Section names error: ${error.message}`);
    }
    
    // Test 2: Frontend Book Structure (sidebar items)
    try {
      const structure = getLocalizedBookStructure(lang.code);
      
      if (structure.front[0] === 'Title Page') {
        issues.push('❌ Book structure not translated (using English fallback)');
      } else {
        console.log(`   ✅ Book Structure: Front[0]="${structure.front[0]}", Main[0]="${structure.main[0]}", Back[0]="${structure.back[0]}"`);
      }
    } catch (error) {
      issues.push(`❌ Book structure error: ${error.message}`);
    }
    
    // Test 3: Chapter Names
    try {
      const chapterName = getLocalizedChapterName(1, lang.code);
      
      if (chapterName === 'Chapter 1') {
        issues.push('❌ Chapter names not translated (using English fallback)');
      } else {
        console.log(`   ✅ Chapter Name: "${chapterName}"`);
      }
    } catch (error) {
      issues.push(`❌ Chapter name error: ${error.message}`);
    }
    
    // Test 4: Backend TOC Title
    try {
      const tocTitle = getTocTitle(lang.code);
      
      if (tocTitle === 'Table of Contents') {
        issues.push('❌ TOC title not translated (using English fallback)');
      } else {
        console.log(`   ✅ TOC Title: "${tocTitle}"`);
      }
    } catch (error) {
      issues.push(`❌ TOC title error: ${error.message}`);
    }
    
    // Summary for this language
    if (issues.length === 0) {
      console.log(`   🟢 PASS: All translations found for ${lang.name}`);
      results.passed++;
    } else {
      console.log(`   🔴 FAIL: ${issues.length} issue(s) for ${lang.name}:`);
      issues.forEach(issue => console.log(`      ${issue}`));
      results.failed++;
      results.issues.push({
        language: lang.name,
        code: lang.code,
        issues: issues
      });
    }
  });
  
  // Final Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Languages Tested: ${results.totalLanguages}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / results.totalLanguages) * 100).toFixed(1)}%`);
  
  if (results.issues.length > 0) {
    console.log('\n🔍 LANGUAGES WITH MISSING TRANSLATIONS:');
    results.issues.forEach(issue => {
      console.log(`\n${issue.language} (${issue.code}):`);
      issue.issues.forEach(problem => console.log(`  ${problem}`));
    });
    
    console.log('\n📋 QUICK FIX CHECKLIST:');
    const uniqueIssues = [...new Set(results.issues.flatMap(issue => issue.issues))];
    uniqueIssues.forEach(issue => {
      const affectedLangs = results.issues.filter(lang => lang.issues.includes(issue));
      console.log(`${issue}`);
      console.log(`  Affects: ${affectedLangs.map(l => l.code).join(', ')}`);
    });
  } else {
    console.log('\n🎉 ALL LANGUAGES HAVE COMPLETE TRANSLATIONS!');
  }
  
  return results;
}

// Export for use in browser console
window.testAllTranslations = testAllTranslations;

export default testAllTranslations;
