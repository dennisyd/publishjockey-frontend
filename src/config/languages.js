// Comprehensive language configuration for Publish Jockey
// Supports 50+ languages with searchable selector functionality

export const languages = [
  // African Languages
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'Africa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', region: 'Africa' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ', flag: '🇰🇪', region: 'Africa' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', region: 'Africa' },
  { code: 'rn', name: 'Kirundi', nativeName: 'Ikirundi', flag: '🇧🇮', region: 'Africa' },
  { code: 'lg', name: 'Luganda', nativeName: 'Luganda', flag: '🇺🇬', region: 'Africa' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', region: 'Africa' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', region: 'Africa' },
  { code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho', flag: '🇱🇸', region: 'Africa' },
  { code: 'nso', name: 'Northern Sotho', nativeName: 'Sepedi', flag: '🇿🇦', region: 'Africa' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', region: 'Africa' },
  { code: 'tn', name: 'Tswana', nativeName: 'Setswana', flag: '🇧🇼', region: 'Africa' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'Africa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'Africa' },

  // European Languages
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Europe' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Europe' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Europe' },
  { code: 'fr-FR', name: 'French (France)', nativeName: 'Français (France)', flag: '🇫🇷', region: 'Europe' },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', flag: '🇨🇦', region: 'North America' },
  { code: 'fr-BE', name: 'French (Belgium)', nativeName: 'Français (Belgique)', flag: '🇧🇪', region: 'Europe' },
  { code: 'fr-CH', name: 'French (Switzerland)', nativeName: 'Français (Suisse)', flag: '🇨🇭', region: 'Europe' },
  { code: 'fr-SN', name: 'French (Senegal)', nativeName: 'Français (Sénégal)', flag: '🇸🇳', region: 'Africa' },
  { code: 'fr-CI', name: 'French (Ivory Coast)', nativeName: 'Français (Côte d\'Ivoire)', flag: '🇨🇮', region: 'Africa' },
  { code: 'fr-MA', name: 'French (Morocco)', nativeName: 'Français (Maroc)', flag: '🇲🇦', region: 'Africa' },
  { code: 'fr-HT', name: 'French (Haiti)', nativeName: 'Français (Haïti)', flag: '🇭🇹', region: 'North America' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Europe' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿', region: 'Europe' },
  { code: 'oc', name: 'Occitan', nativeName: 'Occitan', flag: '🇫🇷', region: 'Europe' },
  { code: 'de-DE', name: 'German (Germany)', nativeName: 'Deutsch (Deutschland)', flag: '🇩🇪', region: 'Europe' },
  { code: 'de-AT', name: 'German (Austria)', nativeName: 'Deutsch (Österreich)', flag: '🇦🇹', region: 'Europe' },
  { code: 'de-CH', name: 'German (Switzerland)', nativeName: 'Deutsch (Schweiz)', flag: '🇨🇭', region: 'Europe' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europe' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Europe' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹', region: 'Europe' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', region: 'South America' },
  { code: 'pt-AO', name: 'Portuguese (Angola)', nativeName: 'Português (Angola)', flag: '🇦🇴', region: 'Africa' },
  { code: 'pt-MZ', name: 'Portuguese (Mozambique)', nativeName: 'Português (Moçambique)', flag: '🇲🇿', region: 'Africa' },
  { code: 'pt-CV', name: 'Portuguese (Cape Verde)', nativeName: 'Português (Cabo Verde)', flag: '🇨🇻', region: 'Africa' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europe' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Europe' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Europe' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Europe' },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (España)', flag: '🇪🇸', region: 'Europe' },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', flag: '🇲🇽', region: 'North America' },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español (Argentina)', flag: '🇦🇷', region: 'South America' },
  { code: 'es-CO', name: 'Spanish (Colombia)', nativeName: 'Español (Colombia)', flag: '🇨🇴', region: 'South America' },
  { code: 'es-CL', name: 'Spanish (Chile)', nativeName: 'Español (Chile)', flag: '🇨🇱', region: 'South America' },
  { code: 'es-PE', name: 'Spanish (Peru)', nativeName: 'Español (Perú)', flag: '🇵🇪', region: 'South America' },
  { code: 'es-VE', name: 'Spanish (Venezuela)', nativeName: 'Español (Venezuela)', flag: '🇻🇪', region: 'South America' },
  { code: 'es-PR', name: 'Spanish (Puerto Rico)', nativeName: 'Español (Puerto Rico)', flag: '🇵🇷', region: 'North America' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Europe' },

  // Asian Languages
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'ms', name: 'Malaysian', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },

  // Special Script Languages (already supported)
  // Note: RTL languages (Arabic, Hebrew, Yiddish) coming soon!
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Asia' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Asia' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Asia' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Asia' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Asia' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Asia' },
  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Asia' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Asia' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },

  // Additional Languages
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', region: 'Asia' }
];

// Helper functions for language selection
export const getLanguageByCode = (code) => {
  return languages.find(lang => lang.code === code);
};

export const searchLanguages = (query) => {
  const searchTerm = query.toLowerCase();
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm) ||
    lang.nativeName.toLowerCase().includes(searchTerm) ||
    lang.code.toLowerCase().includes(searchTerm)
  );
};

export const getLanguagesByRegion = (region) => {
  return languages.filter(lang => lang.region === region);
};

export const getRecentLanguages = () => {
  // Get recently used languages from localStorage
  try {
    const recent = localStorage.getItem('recentLanguages');
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
};

export const addRecentLanguage = (languageCode) => {
  try {
    const recent = getRecentLanguages();
    const updated = [languageCode, ...recent.filter(code => code !== languageCode)].slice(0, 5);
    localStorage.setItem('recentLanguages', JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};

// Language groups for organized display
export const languageGroups = [
  {
    name: 'Popular Languages',
    languages: ['en', 'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'fr-FR', 'fr-CA', 'fr-BE', 'de-DE', 'de-AT', 'de-CH', 'it', 'pt-PT', 'pt-BR', 'ru', 'ar', 'zh', 'ja']
  },
  {
    name: 'European Languages',
    languages: languages.filter(lang => lang.region === 'Europe').map(lang => lang.code)
  },
  {
    name: 'African Languages',
    languages: languages.filter(lang => lang.region === 'Africa').map(lang => lang.code)
  },
  {
    name: 'Asian Languages',
    languages: languages.filter(lang => lang.region === 'Asia').map(lang => lang.code)
  },
  {
    name: 'South American Languages',
    languages: languages.filter(lang => lang.region === 'South America').map(lang => lang.code)
  },
  {
    name: 'North American Languages',
    languages: languages.filter(lang => lang.region === 'North America').map(lang => lang.code)
  },
  {
    name: 'African Languages',
    languages: languages.filter(lang => lang.region === 'Africa').map(lang => lang.code)
  }
];

export default languages;
