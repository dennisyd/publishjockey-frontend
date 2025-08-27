// Comprehensive test to check all 55 languages for sidebar translations
import { getLocalizedSectionNames, getLocalizedBookStructure, getLocalizedChapterName } from './bookStructureLocalization';
import { languages } from '../config/languages';

interface LanguageTestResult {
  code: string;
  name: string;
  nativeName: string;
  sectionNames: {
    frontMatter: string;
    mainMatter: string;
    backMatter: string;
  };
  bookStructure: {
    front: string[];
    main: string[];
    back: string[];
  };
  chapterName: string;
  issues: string[];
}

export function testAllLanguageTranslations(): {
  results: LanguageTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    failedLanguages: string[];
  };
} {
  console.log('🧪 COMPREHENSIVE LANGUAGE TEST - ALL 55 LANGUAGES');
  console.log('='.repeat(70));
  
  const results: LanguageTestResult[] = [];
  const failedLanguages: string[] = [];
  
  languages.forEach((lang, index) => {
    const num = (index + 1).toString().padStart(2, '0');
    console.log(`\n${num}. Testing ${lang.name} (${lang.code}) - ${lang.nativeName}:`);
    
    const issues: string[] = [];
    
    // Test section names (Front Matter, Main Matter, Back Matter)
    const sectionNames = getLocalizedSectionNames(lang.code);
    const isEnglishSectionNames = 
      sectionNames.frontMatter === 'Front Matter' || 
      sectionNames.mainMatter === 'Main Matter' || 
      sectionNames.backMatter === 'Back Matter';
    
    if (isEnglishSectionNames) {
      issues.push('❌ Section names using English fallback');
      console.log(`   ❌ Section Names: Using English fallback`);
    } else {
      console.log(`   ✅ Section Names: "${sectionNames.frontMatter}", "${sectionNames.mainMatter}", "${sectionNames.backMatter}"`);
    }
    
    // Test book structure (sidebar items)
    const bookStructure = getLocalizedBookStructure(lang.code);
    const isEnglishStructure = 
      bookStructure.front[0] === 'Title Page' ||
      bookStructure.main[0] === 'Chapter 1' ||
      bookStructure.back[0] === 'About the Author';
    
    if (isEnglishStructure) {
      issues.push('❌ Book structure using English fallback');
      console.log(`   ❌ Book Structure: Using English fallback`);
    } else {
      console.log(`   ✅ Book Structure: Front[0]="${bookStructure.front[0]}", Main[0]="${bookStructure.main[0]}", Back[0]="${bookStructure.back[0]}"`);
    }
    
    // Test chapter names
    const chapterName = getLocalizedChapterName(1, lang.code);
    const isEnglishChapter = chapterName === 'Chapter 1';
    
    if (isEnglishChapter) {
      issues.push('❌ Chapter names using English fallback');
      console.log(`   ❌ Chapter Name: Using English fallback`);
    } else {
      console.log(`   ✅ Chapter Name: "${chapterName}"`);
    }
    
    // Overall result
    if (issues.length === 0) {
      console.log(`   🟢 PASS: All translations found for ${lang.name}`);
    } else {
      console.log(`   🔴 FAIL: ${issues.length} issue(s) for ${lang.name}`);
      failedLanguages.push(lang.code);
    }
    
    results.push({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      sectionNames,
      bookStructure,
      chapterName,
      issues
    });
  });
  
  // Summary
  const summary = {
    total: languages.length,
    passed: results.filter(r => r.issues.length === 0).length,
    failed: results.filter(r => r.issues.length > 0).length,
    failedLanguages
  };
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Languages Tested: ${summary.total}`);
  console.log(`✅ Fully Translated: ${summary.passed}`);
  console.log(`❌ Missing Translations: ${summary.failed}`);
  console.log(`📈 Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%`);
  
  if (summary.failed > 0) {
    console.log(`\n🔍 LANGUAGES WITH ISSUES (${summary.failed}):`);
    
    const issuesByType: Record<string, string[]> = {};
    
    results.filter(r => r.issues.length > 0).forEach(result => {
      console.log(`\n${result.name} (${result.code}):`);
      result.issues.forEach(issue => {
        console.log(`  ${issue}`);
        
        // Group by issue type
        if (!issuesByType[issue]) {
          issuesByType[issue] = [];
        }
        issuesByType[issue].push(result.code);
      });
    });
    
    console.log(`\n📋 ISSUES BY TYPE:`);
    Object.entries(issuesByType).forEach(([issue, codes]) => {
      console.log(`${issue}:`);
      console.log(`  Affects: ${codes.join(', ')} (${codes.length} languages)`);
    });
    
    console.log(`\n🛠️ QUICK FIXES NEEDED:`);
    if (issuesByType['❌ Section names using English fallback']) {
      console.log(`1. Add sectionNames entries in bookStructureLocalization.ts for: ${issuesByType['❌ Section names using English fallback'].join(', ')}`);
    }
    if (issuesByType['❌ Book structure using English fallback']) {
      console.log(`2. Add localizedStructures entries in bookStructureLocalization.ts for: ${issuesByType['❌ Book structure using English fallback'].join(', ')}`);
    }
    if (issuesByType['❌ Chapter names using English fallback']) {
      console.log(`3. Add chapterNames entries in bookStructureLocalization.ts for: ${issuesByType['❌ Chapter names using English fallback'].join(', ')}`);
    }
  } else {
    console.log('\n🎉 ALL 55 LANGUAGES HAVE COMPLETE TRANSLATIONS!');
  }
  
  return { results, summary };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAllLanguageTranslations = testAllLanguageTranslations;
}
