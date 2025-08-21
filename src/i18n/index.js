import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import ar from './locales/ar.json';
import he from './locales/he.json';
import yi from './locales/yi.json';
import ta from './locales/ta.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  ru: { translation: ru },
  ro: { translation: ro },
  ar: { translation: ar },
  he: { translation: he },
  yi: { translation: yi },
  ta: { translation: ta }
};

i18n
  // Load translations from backend (optional - for dynamic loading)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // Cache user language on
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // Languages to not persist (cimode = "cimode" for testing)

      // Optional expire and domain for set cookie
      cookieExpirationDate: new Date(),
      cookieDomain: 'myDomain',
      cookieSecure: true, // Only send cookie over https

      // Optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement,

      // Optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
      cookieOptions: { path: '/', sameSite: 'strict' }
    },

    backend: {
      // For dynamic loading of translation files
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Special handling for RTL languages
    react: {
      useSuspense: false,
    }
  });

export default i18n;
