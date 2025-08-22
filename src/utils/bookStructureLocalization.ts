import { useTranslation } from 'react-i18next';

// Default book structure in different languages
const localizedStructures = {
  en: {
    front: [
      "Title",
      "Title Page",
      "Copyright",
      "Dedication",
      "Acknowledgments",
      "Foreword",
      "Introduction"
    ],
    main: ["Chapter 1", "Chapter 2", "Chapter 3"],
    back: ["About the Author", "Appendix", "References", "Bibliography", "Index", "Glossary"]
  },
  es: {
    front: [
      "Título",
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Sobre el autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  fr: {
    front: [
      "Titre",
      "Page de titre",
      "Droits d'auteur",
      "Dédicace",
      "Remerciements",
      "Avant-propos",
      "Introduction"
    ],
    main: ["Chapitre 1", "Chapitre 2", "Chapitre 3"],
    back: ["À propos de l'auteur", "Annexe", "Références", "Bibliographie", "Index", "Glossaire"]
  },
  de: {
    front: [
      "Titel",
      "Titelseite",
      "Urheberrecht",
      "Widmung",
      "Danksagungen",
      "Vorwort",
      "Einleitung"
    ],
    main: ["Kapitel 1", "Kapitel 2", "Kapitel 3"],
    back: ["Über den Autor", "Anhang", "Referenzen", "Bibliographie", "Index", "Glossar"]
  },
  it: {
    front: [
      "Titolo",
      "Pagina del titolo",
      "Diritti d'autore",
      "Dedica",
      "Ringraziamenti",
      "Prefazione",
      "Introduzione"
    ],
    main: ["Capitolo 1", "Capitolo 2", "Capitolo 3"],
    back: ["Sull'autore", "Appendice", "Riferimenti", "Bibliografia", "Indice", "Glossario"]
  },
  ru: {
    front: [
      "Название",
      "Титульная страница",
      "Авторские права",
      "Посвящение",
      "Благодарности",
      "Предисловие",
      "Введение"
    ],
    main: ["Глава 1", "Глава 2", "Глава 3"],
    back: ["Об авторе", "Приложение", "Ссылки", "Библиография", "Указатель", "Глоссарий"]
  },
  ro: {
    front: [
      "Titlu",
      "Pagina de titlu",
      "Drepturi de autor",
      "Dedicație",
      "Mulțumiri",
      "Cuvânt înainte",
      "Introducere"
    ],
    main: ["Capitol 1", "Capitol 2", "Capitol 3"],
    back: ["Despre autor", "Anexă", "Referințe", "Bibliografie", "Index", "Glosar"]
  },
  ar: {
    front: [
      "العنوان",
      "صفحة العنوان",
      "حقوق النشر",
      "إهداء",
      "شكر وتقدير",
      "مقدمة",
      "مقدمة"
    ],
    main: ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"],
    back: ["عن المؤلف", "ملحق", "مراجع", "مصادر", "فهرس", "قاموس"]
  },

  ta: {
    front: [
      "தலைப்பு",
      "தலைப்பு பக்கம்",
      "பதிப்புரிமை",
      "அர்ப்பணிப்பு",
      "நன்றிகள்",
      "முன்னுரை",
      "அறிமுகம்"
    ],
    main: ["அத்தியாயம் 1", "அத்தியாயம் 2", "அத்தியாயம் 3"],
    back: ["எழுத்தாளர் பற்றி", "இணைப்பு", "குறிப்புகள்", "நூற்பட்டியல்", "அட்டவணை", "சொற்களஞ்சியம்"]
  }
};

// Hook to get localized book structure
export const useLocalizedBookStructure = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  // Get structure for current language, fallback to English
  const structure = localizedStructures[currentLang as keyof typeof localizedStructures] || localizedStructures.en;
  
  return structure;
};

// Function to get localized book structure (for use outside of React components)
export const getLocalizedBookStructure = (language: string = 'en') => {
  const structure = localizedStructures[language as keyof typeof localizedStructures] || localizedStructures.en;
  return structure;
};

// Function to get localized chapter name
export const getLocalizedChapterName = (chapterNumber: number, language: string = 'en') => {
  const chapterNames = {
    en: "Chapter",
    es: "Capítulo",
    fr: "Chapitre",
    de: "Kapitel",
    it: "Capitolo",
    ru: "Глава",
    ro: "Capitol",
    ar: "الفصل",
    ta: "அத்தியாயம்"
  };
  
  const chapterName = chapterNames[language as keyof typeof chapterNames] || chapterNames.en;
  return `${chapterName} ${chapterNumber}`;
};

// Function to get localized section names
export const getLocalizedSectionNames = (language: string = 'en') => {
  const sectionNames = {
    en: {
      frontMatter: "Front Matter",
      mainMatter: "Main Matter", 
      backMatter: "Back Matter"
    },
    es: {
      frontMatter: "Materiales preliminares",
      mainMatter: "Materiales principales",
      backMatter: "Materiales finales"
    },
    fr: {
      frontMatter: "Matériaux préliminaires",
      mainMatter: "Matériaux principaux", 
      backMatter: "Matériaux finaux"
    },
    de: {
      frontMatter: "Vormaterial",
      mainMatter: "Hauptmaterial",
      backMatter: "Nachmaterial"
    },
    it: {
      frontMatter: "Materiali preliminari",
      mainMatter: "Materiali principali",
      backMatter: "Materiali finali"
    },
    ru: {
      frontMatter: "Предварительные материалы",
      mainMatter: "Основные материалы",
      backMatter: "Заключительные материалы"
    },
    ro: {
      frontMatter: "Materiale preliminare",
      mainMatter: "Materiale principale",
      backMatter: "Materiale finale"
    },
    ar: {
      frontMatter: "المواد التمهيدية",
      mainMatter: "المواد الرئيسية",
      backMatter: "المواد الختامية"
    },
    ta: {
      frontMatter: "முன்னுரைப் பொருட்கள்",
      mainMatter: "முதன்மைப் பொருட்கள்",
      backMatter: "இறுதிப் பொருட்கள்"
    }
  };
  
  return sectionNames[language as keyof typeof sectionNames] || sectionNames.en;
};
