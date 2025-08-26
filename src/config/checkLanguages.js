// Simple script to extract and check language codes
const fs = require('fs');
const path = require('path');

// Read the languages.js file content
const languagesFile = fs.readFileSync(path.join(__dirname, 'languages.js'), 'utf8');

// Extract language codes using regex
const codeMatches = languagesFile.match(/code:\s*'([^']+)'/g);
const languageCodes = codeMatches ? codeMatches.map(match => match.match(/'([^']+)'/)[1]) : [];

console.log('📋 ALL SUPPORTED LANGUAGES:');
console.log('Total languages:', languageCodes.length);
console.log('Language codes:', languageCodes.sort().join(', '));
console.log('');

// Count by regions (extract from file)
const africaMatch = languagesFile.match(/\/\/ African Languages([\s\S]*?)\/\/ European Languages/);
const europeMatch = languagesFile.match(/\/\/ European Languages([\s\S]*?)\/\/ Asian Languages/);
const asiaMatch = languagesFile.match(/\/\/ Asian Languages([\s\S]*?)\/\/ Special Script Languages/);
const specialMatch = languagesFile.match(/\/\/ Special Script Languages[\s\S]*?\/\/ Additional Languages/);
const additionalMatch = languagesFile.match(/\/\/ Additional Languages([\s\S]*?)\];/);

function countCodesInSection(sectionText) {
  if (!sectionText) return 0;
  const matches = sectionText[1].match(/code:\s*'[^']+'/g);
  return matches ? matches.length : 0;
}

const africaCount = countCodesInSection(africaMatch);
const europeCount = countCodesInSection(europeMatch);
const asiaCount = countCodesInSection(asiaMatch);
const specialCount = countCodesInSection(specialMatch);
const additionalCount = countCodesInSection(additionalMatch);

console.log('Count by region:');
console.log(`- Africa: ${africaCount} languages`);
console.log(`- Europe: ${europeCount} languages`);
console.log(`- Asia: ${asiaCount} languages`);
console.log(`- Special Scripts: ${specialCount} languages`);
console.log(`- Additional: ${additionalCount} languages`);
console.log(`Total calculated: ${africaCount + europeCount + asiaCount + specialCount + additionalCount}`);

// Export the codes for further testing
module.exports = { languageCodes };
