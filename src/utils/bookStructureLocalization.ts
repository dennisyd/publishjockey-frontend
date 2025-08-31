// Yancy Dennis

const localizedStructures = {
  en: {
    front: [
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
  // Spanish (Spain) - European Spanish
  'es-ES': {
    front: [
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
  // Spanish (Mexico) - Mexican Spanish
  'es-MX': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Argentina) - Argentinian Spanish
  'es-AR': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Colombia) - Colombian Spanish
  'es-CO': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Chile) - Chilean Spanish
  'es-CL': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Peru) - Peruvian Spanish
  'es-PE': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Venezuela) - Venezuelan Spanish
  'es-VE': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  // Spanish (Puerto Rico) - Puerto Rican Spanish
  'es-PR': {
    front: [
      "Página de título",
      "Derechos de autor",
      "Dedicatoria",
      "Agradecimientos",
      "Prólogo",
      "Introducción"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Acerca del autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  fr: {
    front: [
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
  // French (France) - Metropolitan French
  'fr-FR': {
    front: [
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
  // French (Canada) - Québécois French
  'fr-CA': {
    front: [
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
  // French (Belgium) - Belgian French
  'fr-BE': {
    front: [
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
  // French (Switzerland) - Swiss French
  'fr-CH': {
    front: [
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
  // French (Senegal) - Senegalese French
  'fr-SN': {
    front: [
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
  // French (Ivory Coast) - Ivorian French
  'fr-CI': {
    front: [
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
  // French (Morocco) - Moroccan French
  'fr-MA': {
    front: [
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
  // French (Haiti) - Haitian French
  'fr-HT': {
    front: [
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
  ca: {
    front: [
      "Pàgina de títol",
      "Drets d'autor",
      "Dedicatòria",
      "Agraïments",
      "Prefaci",
      "Introducció"
    ],
    main: ["Capítol 1", "Capítol 2", "Capítol 3"],
    back: ["Sobre l'autor", "Apèndix", "Referències", "Bibliografia", "Índex", "Glossari"]
  },
  oc: {
    front: [
      "Pagina de títol",
      "Dreches d'autor",
      "Dedicatòria",
      "Mercejaments",
      "Prefàcia",
      "Introduccion"
    ],
    main: ["Capítol 1", "Capítol 2", "Capítol 3"],
    back: ["A prepaus de l'autor", "Apèndix", "Referéncias", "Bibliografia", "Indèx", "Glossari"]
  },
    pt: {
    front: [
      "Página de Título",
      "Direitos Autorais",
      "Dedicatória",
      "Agradecimentos",
      "Prefácio",
      "Introdução"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Sobre o Autor", "Apêndice", "Referências", "Bibliografia", "Índice", "Glossário"]
  },
  // Brazilian Portuguese (same structure as Portuguese for now)
  'pt-BR': {
    front: [
      "Página de Título",
      "Direitos Autorais",
      "Dedicatória",
      "Agradecimentos",
      "Prefácio",
      "Introdução"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Sobre o Autor", "Apêndice", "Referências", "Bibliografia", "Índice", "Glossário"]
  },
  // European Portuguese (same structure as Portuguese for now)
  'pt-PT': {
    front: [
      "Página de Título",
      "Direitos Autorais",
      "Dedicatória",
      "Agradecimentos",
      "Prefácio",
      "Introdução"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Sobre o Autor", "Apêndice", "Referências", "Bibliografia", "Índice", "Glossário"]
  },
  de: {
    front: [
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
  // German (Germany) - Standard German
  'de-DE': {
    front: [
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
  // German (Austria) - Austrian German
  'de-AT': {
    front: [
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
  // German (Switzerland) - Swiss German
  'de-CH': {
    front: [
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
  hr: {
    front: [
      "Naslovna Stranica",
      "Autorska Prava",
      "Posveta",
      "Zahvale",
      "Predgovor",
      "Uvod"
    ],
    main: ["Poglavlje 1", "Poglavlje 2", "Poglavlje 3"],
    back: ["O Autoru", "Dodatak", "Reference", "Bibliografija", "Indeks", "Rječnik"]
  },
  is: {
    front: [
      "Titilsíða",
      "Höfundarréttur",
      "Tileinkunn",
      "Þakkarorð",
      "Formáli",
      "Inngangur"
    ],
    main: ["Kafli 1", "Kafli 2", "Kafli 3"],
    back: ["Um Höfundinn", "Viðauki", "Tilvísanir", "Heimildaskrá", "Efnisskrá", "Orðalisti"]
  },
  ig: {
    front: [
      "Ihu Akwukwo",
      "Ikike Nke Onye Odee",
      "Nraranye",
      "Ekele",
      "Okwu Mmalite",
      "Okwu Mmalite"
    ],
    main: ["Isi 1", "Isi 2", "Isi 3"],
    back: ["Banyere onye odee", "Mgbakwunye", "Ntụaka", "Akwụkwọ ndetu", "Ndeksi", "Nkọwa okwu"]
  },
  ro: {
    front: [
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
      "صفحة العنوان",
      "حقوق النشر",
      "إهداء",
      "شكر وتقدير",
      "مقدمة"
    ],
    main: ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"],
    back: ["عن المؤلف", "ملحق", "مراجع", "مصادر", "فهرس", "قاموس"]
  },

  ta: {
    front: [
      "தலைப்பு பக்கம்",
      "பதிப்புரிமை",
      "அர்ப்பணிப்பு",
      "நன்றிகள்",
      "முன்னுரை",
      "அறிமுகம்"
    ],
    main: ["அத்தியாயம் 1", "அத்தியாயம் 2", "அத்தியாயம் 3"],
    back: ["எழுத்தாளர் பற்றி", "இணைப்பு", "குறிப்புகள்", "நூற்பட்டியல்", "அட்டவணை", "சொற்களஞ்சியம்"]
  },
  
  // Indic Languages
  hi: {
    front: [
      "शीर्षक पृष्ठ",
      "कॉपीराइट",
      "समर्पण",
      "आभार",
      "प्राक्कथन",
      "परिचय"
    ],
    main: ["अध्याय 1", "अध्याय 2", "अध्याय 3"],
    back: ["लेखक के बारे में", "परिशिष्ट", "संदर्भ", "ग्रंथ सूची", "सूचकांक", "शब्दकोश"]
  },
  bn: {
    front: [
      "শিরোনাম পৃষ্ঠা",
      "কপিরাইট",
      "উৎসর্গ",
      "কৃতজ্ঞতা",
      "ভূমিকা",
      "প্রারম্ভিক"
    ],
    main: ["অধ্যায় ১", "অধ্যায় ২", "অধ্যায় ৩"],
    back: ["লেখক সম্পর্কে", "পরিশিষ্ট", "তথ্যসূত্র", "গ্রন্থপঞ্জি", "সূচক", "শব্দকোষ"]
  },
  gu: {
    front: [
      "શીર્ષક પૃષ્ઠ",
      "કોપીરાઇટ",
      "સમર્પણ",
      "આભાર",
      "પ્રસ્તાવના",
      "પરિચય"
    ],
    main: ["પ્રકરણ 1", "પ્રકરણ 2", "પ્રકરણ 3"],
    back: ["લેખક વિશે", "પરિશિષ્ટ", "સંદર્ભો", "ગ્રંથસૂચી", "અનુક્રમણિકા", "શબ્દકોશ"]
  },
  te: {
    front: [
      "శీర్షిక పేజీ",
      "కాపీరైట్",
      "అంకితం",
      "కృతజ్ఞతలు",
      "ముందుమాట",
      "పరిచయం"
    ],
    main: ["అధ్యాయం 1", "అధ్యాయం 2", "అధ్యాయం 3"],
    back: ["రచయిత గురించి", "అనుబంధం", "సూచనలు", "గ్రంథ జాబితా", "సూచిక", "పదకోశం"]
  },
  kn: {
    front: [
      "ಶೀರ್ಷಿಕೆ ಪುಟ",
      "ಕೃತಿಸ್ವಾಮ್ಯ",
      "ಅರ್ಪಣೆ",
      "ಕೃತಜ್ಞತೆಗಳು",
      "ಮುನ್ನುಡಿ",
      "ಪರಿಚಯ"
    ],
    main: ["ಅಧ್ಯಾಯ 1", "ಅಧ್ಯಾಯ 2", "ಅಧ್ಯಾಯ 3"],
    back: ["ಲೇಖಕರ ಬಗ್ಗೆ", "ಅನುಬಂಧ", "ಉಲ್ಲೇಖಗಳು", "ಗ್ರಂಥ ಪಟ್ಟಿ", "ಸೂಚಿ", "ಪದಕೋಶ"]
  },
  ml: {
    front: [
      "തലക്കെട്ട് പേജ്",
      "പകർപ്പവകാശം",
      "സമർപ്പണം",
      "നന്ദി",
      "മുഖവുര",
      "ആമുഖം"
    ],
    main: ["അധ്യായം 1", "അധ്യായം 2", "അധ്യായം 3"],
    back: ["എഴുത്തുകാരനെക്കുറിച്ച്", "അനുബന്ധം", "റഫറൻസുകൾ", "ഗ്രന്ഥസൂചി", "സൂചിക", "നിഘണ്ടു"]
  },
  pa: {
    front: [
      "ਸਿਰਲੇਖ ਸਫ਼ਾ",
      "ਕਾਪੀਰਾਈਟ",
      "ਸਮਰਪਣ",
      "ਸ਼ੁਕਰਾਨਾ",
      "ਮੁਖਬੰਧ",
      "ਜਾਣ-ਪਛਾਣ"
    ],
    main: ["ਅਧਿਆਇ 1", "ਅਧਿਆਇ 2", "ਅਧਿਆਇ 3"],
    back: ["ਲੇਖਕ ਬਾਰੇ", "ਅਨੁਲੱਗਣ", "ਹਵਾਲੇ", "ਗਰੰਥ ਸੂਚੀ", "ਸੂਚਕਾਂਕ", "ਸ਼ਬਦਕੋਸ਼"]
  },
  or: {
    front: [
      "ଶୀର୍ଷକ ପୃଷ୍ଠା",
      "କପିରାଇଟ୍",
      "ଉତ୍ସର୍ଗ",
      "କୃତଜ୍ଞତା",
      "ଭୂମିକା",
      "ପରିଚୟ"
    ],
    main: ["ଅଧ୍ୟାୟ 1", "ଅଧ୍ୟାୟ 2", "ଅଧ୍ୟାୟ 3"],
    back: ["ଲେଖକ ବିଷୟରେ", "ପରିଶିଷ୍ଟ", "ସନ୍ଦର୍ଭ", "ଗ୍ରନ୍ଥ ତାଲିକା", "ସୂଚକାଙ୍କ", "ଶବ୍ଦକୋଶ"]
  },

  // Additional Major Languages
  nl: {
    front: [
      "Titelpagina",
      "Auteursrechten",
      "Opdracht",
      "Dankwoord",
      "Voorwoord",
      "Inleiding"
    ],
    main: ["Hoofdstuk 1", "Hoofdstuk 2", "Hoofdstuk 3"],
    back: ["Over de Auteur", "Bijlage", "Referenties", "Bibliografie", "Index", "Woordenlijst"]
  },
  pl: {
    front: [
      "Strona Tytułowa",
      "Prawa Autorskie",
      "Dedykacja",
      "Podziękowania",
      "Przedmowa",
      "Wprowadzenie"
    ],
    main: ["Rozdział 1", "Rozdział 2", "Rozdział 3"],
    back: ["O Autorze", "Dodatek", "Bibliografia", "Spis treści", "Indeks", "Słownik"]
  },
  cs: {
    front: [
      "Titulní Strana",
      "Autorská Práva",
      "Věnování",
      "Poděkování",
      "Předmluva",
      "Úvod"
    ],
    main: ["Kapitola 1", "Kapitola 2", "Kapitola 3"],
    back: ["O Autorovi", "Příloha", "Reference", "Bibliografie", "Index", "Slovník"]
  },
  sv: {
    front: [
      "Titelsida",
      "Upphovsrätt",
      "Tillägnan",
      "Tack",
      "Förord",
      "Introduktion"
    ],
    main: ["Kapitel 1", "Kapitel 2", "Kapitel 3"],
    back: ["Om Författaren", "Bilaga", "Referenser", "Bibliografi", "Index", "Ordlista"]
  },
  da: {
    front: [
      "Titelside",
      "Ophavsret",
      "Dedikation",
      "Tak",
      "Forord",
      "Introduktion"
    ],
    main: ["Kapitel 1", "Kapitel 2", "Kapitel 3"],
    back: ["Om Forfatteren", "Appendiks", "Referencer", "Bibliografi", "Indeks", "Ordliste"]
  },
  no: {
    front: [
      "Tittelside",
      "Opphavsrett",
      "Dedikasjon",
      "Takk",
      "Forord",
      "Introduksjon"
    ],
    main: ["Kapittel 1", "Kapittel 2", "Kapittel 3"],
    back: ["Om Forfatteren", "Appendiks", "Referanser", "Bibliografi", "Indeks", "Ordliste"]
  },

  // Additional European Languages
  et: {
    front: [
      "Tiitelleht",
      "Autoriõigus",
      "Pühendus",
      "Tänuavaldused",
      "Eessõna",
      "Sissejuhatus"
    ],
    main: ["Peatükk 1", "Peatükk 2", "Peatükk 3"],
    back: ["Autorist", "Lisa", "Viited", "Bibliograafia", "Register", "Sõnastik"]
  },
  fi: {
    front: [
      "Otsikkosivu",
      "Tekijänoikeus",
      "Omistus",
      "Kiitokset",
      "Esipuhe",
      "Johdanto"
    ],
    main: ["Luku 1", "Luku 2", "Luku 3"],
    back: ["Tekijästä", "Liite", "Viitteet", "Bibliografia", "Hakemisto", "Sanasto"]
  },
  gl: {
    front: [
      "Páxina de Título",
      "Dereitos de Autor",
      "Dedicatoria",
      "Agradecementos",
      "Prólogo",
      "Introdución"
    ],
    main: ["Capítulo 1", "Capítulo 2", "Capítulo 3"],
    back: ["Sobre o Autor", "Apéndice", "Referencias", "Bibliografía", "Índice", "Glosario"]
  },
  el: {
    front: [
      "Σελίδα Τίτλου",
      "Πνευματικά Δικαιώματα",
      "Αφιέρωση",
      "Ευχαριστίες",
      "Πρόλογος",
      "Εισαγωγή"
    ],
    main: ["Κεφάλαιο 1", "Κεφάλαιο 2", "Κεφάλαιο 3"],
    back: ["Για τον Συγγραφέα", "Παράρτημα", "Αναφορές", "Βιβλιογραφία", "Ευρετήριο", "Γλωσσάριο"]
  },
  hu: {
    front: [
      "Címlap",
      "Szerzői Jog",
      "Ajánlás",
      "Köszönetnyilvánítás",
      "Előszó",
      "Bevezetés"
    ],
    main: ["1. Fejezet", "2. Fejezet", "3. Fejezet"],
    back: ["A Szerzőről", "Függelék", "Hivatkozások", "Bibliográfia", "Tárgymutató", "Szótár"]
  },
  lv: {
    front: [
      "Titullapas",
      "Autortiesības",
      "Veltījums",
      "Pateicības",
      "Priekšvārds",
      "Ievads"
    ],
    main: ["1. nodaļa", "2. nodaļa", "3. nodaļa"],
    back: ["Par Autoru", "Pielikums", "Atsauces", "Bibliogrāfija", "Rādītājs", "Vārdnīca"]
  },
  lt: {
    front: [
      "Titulinis Puslapis",
      "Autorių Teisės",
      "Dedikacija",
      "Padėka",
      "Pratarmė",
      "Įvadas"
    ],
    main: ["1 skyrius", "2 skyrius", "3 skyrius"],
    back: ["Apie Autorių", "Priedas", "Nuorodos", "Bibliografija", "Indeksas", "Žodynas"]
  },
  mk: {
    front: [
      "Наслovna Страна",
      "Авторски Права",
      "Посвета",
      "Благодарности",
      "Предговор",
      "Вовед"
    ],
    main: ["Поглавје 1", "Поглавје 2", "Поглавје 3"],
    back: ["За Авторот", "Додаток", "Референци", "Библиографија", "Индекс", "Речник"]
  },
  sr: {
    front: [
      "Naslovna Strana",
      "Autorska Prava",
      "Posveta",
      "Zahvalnice",
      "Predgovor",
      "Uvod"
    ],
    main: ["Poglavlje 1", "Poglavlje 2", "Poglavlje 3"],
    back: ["O Autoru", "Dodatak", "Reference", "Bibliografija", "Indeks", "Rečnik"]
  },
  sk: {
    front: [
      "Titulná Strana",
      "Autorské Práva",
      "Venovanie",
      "Poďakovanie",
      "Predhovor",
      "Úvod"
    ],
    main: ["Kapitola 1", "Kapitola 2", "Kapitola 3"],
    back: ["O Autorovi", "Príloha", "Referencie", "Bibliografia", "Index", "Slovník"]
  },
  sl: {
    front: [
      "Naslovna Stran",
      "Avtorske Pravice",
      "Posvetilo",
      "Zahvale",
      "Predgovor",
      "Uvod"
    ],
    main: ["Poglavje 1", "Poglavje 2", "Poglavje 3"],
    back: ["O Avtorju", "Dodatek", "Reference", "Bibliografija", "Kazalo", "Slovar"]
  },
  tr: {
    front: [
      "Başlık Sayfası",
      "Telif Hakkı",
      "İthaf",
      "Teşekkürler",
      "Önsöz",
      "Giriş"
    ],
    main: ["Bölüm 1", "Bölüm 2", "Bölüm 3"],
    back: ["Yazar Hakkında", "Ek", "Kaynaklar", "Bibliyografya", "Dizin", "Sözlük"]
  },

  // Asian Languages
  id: {
    front: [
      "Halaman Judul",
      "Hak Cipta",
      "Persembahan",
      "Ucapan Terima Kasih",
      "Kata Pengantar",
      "Pendahuluan"
    ],
    main: ["Bab 1", "Bab 2", "Bab 3"],
    back: ["Tentang Penulis", "Lampiran", "Referensi", "Bibliografi", "Indeks", "Glosarium"]
  },
  ms: {
    front: [
      "Halaman Tajuk",
      "Hak Cipta",
      "Dedikasi",
      "Penghargaan",
      "Kata Pengantar",
      "Pengenalan"
    ],
    main: ["Bab 1", "Bab 2", "Bab 3"],
    back: ["Mengenai Pengarang", "Lampiran", "Rujukan", "Bibliografi", "Indeks", "Glosari"]
  },
  vi: {
    front: [
      "Trang Tiêu Đề",
      "Bản Quyền",
      "Tặng",
      "Lời Cảm Ơn",
      "Lời Nói Đầu",
      "Giới Thiệu"
    ],
    main: ["Chương 1", "Chương 2", "Chương 3"],
    back: ["Về Tác Giả", "Phụ Lục", "Tài Liệu Tham Khảo", "Thư Mục", "Chỉ Mục", "Từ Điển"]
  },
  tl: {
    front: [
      "Title Page",
      "Copyright",
      "Paglalaan",
      "Pagkilala",
      "Panimula",
      "Introduksyon"
    ],
    main: ["Kabanata 1", "Kabanata 2", "Kabanata 3"],
    back: ["Tungkol sa May-akda", "Apendiks", "Mga Sanggunian", "Bibliyograpiya", "Talatuntunan", "Talahuluganan"]
  },

  // African Languages
  ha: {
    front: [
      "Shafin Taken",
      "Haƙƙin Marubuta",
      "Sadaka",
      "Godiya",
      "Gabatarwa",
      "Shiga"
    ],
    main: ["Babi na 1", "Babi na 2", "Babi na 3"],
    back: ["Game da Marubuci", "Kari", "Nassoshi", "Littattafai", "Fihirisa", "Kamus"]
  },

  ki: {
    front: [
      "Mũrango wa Rĩĩtwa",
      "Kĩhooto kĩa Mwandĩki",
      "Wĩheanĩre",
      "Ngaatho",
      "Mbere ya Ũhoro",
      "Ũtaambĩrĩria"
    ],
    main: ["Gĩthemba 1", "Gĩthemba 2", "Gĩthemba 3"],
    back: ["Ũhoro wa Mwandĩki", "Ũrũngi", "Marũgamano", "Ibuku cia Marũgamano", "Rũgano", "Kamusi"]
  },
  rw: {
    front: [
      "Urupapuro rw'Umutwe",
      "Uburenganzira bw'Umwanditsi",
      "Icyubahiro",
      "Imbabazi",
      "Ijambo ry'Ibanze",
      "Intangiriro"
    ],
    main: ["Igice cya 1", "Igice cya 2", "Igice cya 3"],
    back: ["Uko Umwanditsi Ameze", "Inyongera", "Aho Byakuye", "Urutonde rw'Ibitabo", "Urutonde", "Inkoranya"]
  },
  rn: {
    front: [
      "Urupapuro rw'Umutwe",
      "Uburenganzira bw'Umwanditsi",
      "Icyubahiro",
      "Imbabazi",
      "Ijambo ry'Ibanze",
      "Intangiriro"
    ],
    main: ["Umutwe wa 1", "Umutwe wa 2", "Umutwe wa 3"],
    back: ["Ivyo Umwanditsi Ari", "Inyongera", "Ivyavuye", "Urutonde rw'Ibitabo", "Urutonde", "Inkoranya"]
  },
  lg: {
    front: [
      "Lupapula lw'Omutwe",
      "Eddembe ly'Omuwandiisi",
      "Okuwaayo",
      "Okwebaza",
      "Ekigambo eky'Omu Maaso",
      "Okutandika"
    ],
    main: ["Essuula 1", "Essuula 2", "Essuula 3"],
    back: ["Ku Muwandiisi", "Ebyongerwako", "Ensonga", "Olukalala lw'Ebitabo", "Olukalala", "Ennyinyonnyola"]
  },
  mg: {
    front: [
      "Pejin'ny Lohateny",
      "Zo Ara-Javatra",
      "Fanokafana",
      "Fisaorana",
      "Teny Fampidirana",
      "Fampidirana"
    ],
    main: ["Toko 1", "Toko 2", "Toko 3"],
    back: ["Momba ny Mpanoratra", "Fanampia", "Firesahana", "Bibliografika", "Fanondroana", "Rakibolana"]
  },
  sn: {
    front: [
      "Peji reMusoro",
      "Kodzero dzeMunyori",
      "Kukumikidza",
      "Kutenda",
      "Chinyorwa chekutanga",
      "Sumo"
    ],
    main: ["Chitsauko 1", "Chitsauko 2", "Chitsauko 3"],
    back: ["Nezve Munyori", "Chinyorwa chekuwedzera", "Zvirevo", "Rondedzero yemabhuku", "Rondedzero", "Duramazwi"]
  },
  st: {
    front: [
      "Leqephe la Sehlooho",
      "Litokelo tsa Mongoli",
      "Tlhomoloso",
      "Leboha",
      "Mantsoe a pele",
      "Selelekela"
    ],
    main: ["Khaolo 1", "Khaolo 2", "Khaolo 3"],
    back: ["Ka Mongoli", "Tlatsetso", "Diphuputso", "Lenane la libuka", "Tšupiso", "Bukantswe"]
  },
  sw: {
    front: [
      "Ukurasa wa Kichwa",
      "Hakimiliki ya Mwandishi",
      "Utungo",
      "Shukrani",
      "Utangulizi",
      "Utambulisho"
    ],
    main: ["Sura ya 1", "Sura ya 2", "Sura ya 3"],
    back: ["Kuhusu Mwandishi", "Kiambatisho", "Marejeleo", "Orodha ya Vitabu", "Faharasa", "Kamusi"]
  },
  tn: {
    front: [
      "Tsebe ya Setlhogo",
      "Ditshwanelo tsa Mokwadi",
      "Tshupiso",
      "Leboga",
      "Mafoko a Simolola",
      "Matseno"
    ],
    main: ["Kgaolo 1", "Kgaolo 2", "Kgaolo 3"],
    back: ["Ka Mokwadi", "Tlatsetso", "Dikgoge", "Lenaane la Dibuka", "Tshupiso", "Bukantswe"]
  },
  xh: {
    front: [
      "Iphepha Lesihloko",
      "Amalungelo Ombhali",
      "Unikezelo",
      "Ukubulela",
      "Intshayelelo",
      "Ingeniso"
    ],
    main: ["Isahluko 1", "Isahluko 2", "Isahluko 3"],
    back: ["Ngombhali", "Isihlomelo", "Izalathiso", "Uluhlu Lweencwadi", "Isalathiso", "Isichazi-magama"]
  },
  yo: {
    front: [
      "Ojú-ìwé Àkọlé",
      "Ẹ̀tọ́ Onkọ̀wé",
      "Ìgbékalẹ̀",
      "Ọpẹ́",
      "Ọ̀rọ̀ Ìbẹ̀rẹ̀",
      "Ìfihàn"
    ],
    main: ["Orí 1", "Orí 2", "Orí 3"],
    back: ["Nípa Onkọ̀wé", "Àfikún", "Ìtọ́kasí", "Àkójọ Ìwé", "Àtọ́kajọ", "Ìtumọ̀"]
  },
  zu: {
    front: [
      "Ikhasi Lesihloko",
      "Amalungelo Ombhali",
      "Ukunikezela",
      "Ukubonga",
      "Isingeniso",
      "Ukwethulwa"
    ],
    main: ["Isahluko 1", "Isahluko 2", "Isahluko 3"],
    back: ["Ngombhali", "Isinyathelo", "Izinkomba", "Uhla Lwezincwadi", "Uhla", "Isichazamazwi"]
  }
};

// ------------------------------------------------------------------
// Helpers and Exports (single declarations with inline debug logs)
// ------------------------------------------------------------------

/** Normalize language code like "pt-BR" -> "pt" */
export function normalizeLang(language?: string): string {
  if (!language || typeof language !== "string") return "en";
  const normalized = language.split("-")[0].toLowerCase();
  console.log('[NORMALIZE] Input language:', language, 'Normalized:', normalized);
  
  return normalized;
}

/** Languages written RTL */
const RTL_LANGS = new Set(["ar", "fa", "ur", "he", "yi"]);
export function isRTL(language?: string): boolean {
  const normalized = normalizeLang(language);
  const rtl = RTL_LANGS.has(normalized);
  console.log('[RTL CHECK] Input language:', language, 'Normalized:', normalized, 'Is RTL?', rtl);
  return rtl;
}

/**
 * Get localized book structure for a given language.
 * Returns {front, main, back}.
 */
export function getLocalizedBookStructure(language?: string) {
  console.log('[BOOK STRUCTURE] Input language:', language);
  
  // First try exact match (e.g., pt-BR, pt-PT)
  if (language && (localizedStructures as any)[language]) {
    console.log('[BOOK STRUCTURE] Found exact match for:', language);
    return (localizedStructures as any)[language];
  }
  
  // Then try normalized version (e.g., pt-BR -> pt)
  const normalizedLanguage = normalizeLang(language);
  console.log('[BOOK STRUCTURE] Normalized:', normalizedLanguage);
  
  const structure = (localizedStructures as any)[normalizedLanguage] || (localizedStructures as any)["en"];
  console.log('[BOOK STRUCTURE] Returning structure for:', normalizedLanguage, structure);
  
  return structure;
}

/**
 * Get all unique section labels (flattened front+main+back) for a language.
 */
export function getLocalizedSectionNames(language?: string): string[] {
  const normalizedLanguage = normalizeLang(language);
  console.log('[SECTION NAMES] Input language:', language, 'Normalized:', normalizedLanguage);
  const structure = getLocalizedBookStructure(normalizedLanguage);
  const names = [...(structure.front || []), ...(structure.main || []), ...(structure.back || [])];
  console.log('[SECTION NAMES] Returning', names.length, 'names');
  return names;
}

/**
 * Get section names as an object with frontMatter, mainMatter, and backMatter properties.
 * This is used by the ProjectWorkspace component for sidebar display.
 */
export function getLocalizedSectionNamesObject(language?: string): {
  frontMatter: string;
  mainMatter: string;
  backMatter: string;
} {
  const normalizedLanguage = normalizeLang(language);
  console.log('[SECTION NAMES OBJECT] Input language:', language, 'Normalized:', normalizedLanguage);
  
  // Default English labels
  const defaultLabels = {
    frontMatter: 'Front Matter',
    mainMatter: 'Main Matter', 
    backMatter: 'Back Matter'
  };
  
  // Language-specific labels
  const localizedLabels: Record<string, { frontMatter: string; mainMatter: string; backMatter: string }> = {
      pt: {
    frontMatter: 'Matéria Preliminar',
    mainMatter: 'Matéria Principal',
    backMatter: 'Matéria Final'
  },
  'pt-BR': {
    frontMatter: 'Matéria Preliminar',
    mainMatter: 'Matéria Principal',
    backMatter: 'Matéria Final'
  },
  'pt-PT': {
    frontMatter: 'Matéria Preliminar',
    mainMatter: 'Matéria Principal',
    backMatter: 'Matéria Final'
  },
    es: {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-ES': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-MX': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-AR': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-CO': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-CL': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-PE': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-VE': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    'es-PR': {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    fr: {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-FR': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-CA': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-BE': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-CH': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-SN': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-CI': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-MA': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    'fr-HT': {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    ca: {
      frontMatter: 'Matèria Preliminar',
      mainMatter: 'Matèria Principal',
      backMatter: 'Matèria Final'
    },
    oc: {
      frontMatter: 'Matèria Preliminara',
      mainMatter: 'Matèria Principala',
      backMatter: 'Matèria Finala'
    },
    de: {
      frontMatter: 'Vorspann',
      mainMatter: 'Hauptteil',
      backMatter: 'Nachspann'
    },
    'de-DE': {
      frontMatter: 'Vorspann',
      mainMatter: 'Hauptteil',
      backMatter: 'Nachspann'
    },
    'de-AT': {
      frontMatter: 'Vorspann',
      mainMatter: 'Hauptteil',
      backMatter: 'Nachspann'
    },
    'de-CH': {
      frontMatter: 'Vorspann',
      mainMatter: 'Hauptteil',
      backMatter: 'Nachspann'
    },
    it: {
      frontMatter: 'Materia Preliminare',
      mainMatter: 'Materia Principale',
      backMatter: 'Materia Finale'
    },
    ru: {
      frontMatter: 'Предварительная часть',
      mainMatter: 'Основная часть',
      backMatter: 'Заключительная часть'
    },
    ar: {
      frontMatter: 'المادة التمهيدية',
      mainMatter: 'المادة الرئيسية',
      backMatter: 'المادة الختامية'
    },
    hi: {
      frontMatter: 'प्रारंभिक सामग्री',
      mainMatter: 'मुख्य सामग्री',
      backMatter: 'अंतिम सामग्री'
    },
    ta: {
      frontMatter: 'முன்னுரைப் பகுதி',
      mainMatter: 'முதன்மைப் பகுதி',
      backMatter: 'இறுதிப் பகுதி'
    }
  };
  
  const result = localizedLabels[normalizedLanguage] || defaultLabels;
  console.log('[SECTION NAMES OBJECT] Returning labels for:', normalizedLanguage, result);
  return result;
}

/**
 * Generate a localized chapter title for a given index and language.
 */
export function getLocalizedChapterName(
  index: number,
  language?: string,
  options?: { style?: "number" | "roman-upper" | "roman-lower"; prefixOverride?: string; zeroPad?: number }
): string {
  // sanitize index
  const safeIndex = Number.isFinite(index) ? Math.max(1, Math.floor(index)) : 1;

  // Normalize language code
  const normalizedLanguage = normalizeLang(language);
  console.log('[CHAPTER NAME] Input:', index, 'Language:', language, 'Normalized:', normalizedLanguage);

  const structure = getLocalizedBookStructure(normalizedLanguage);
  let defaultPrefix = "Chapter";
  if (structure?.main?.length) {
    const first = structure.main[0];
    // capture leading letters/marks/spaces across scripts
    const match = first.match(/^[\p{L}\p{M}\s]+/u);
    if (match) defaultPrefix = match[0].trim();
  }
  const prefix = options?.prefixOverride || defaultPrefix;
  const style = options?.style || "number";
  const zeroPad = Math.max(0, options?.zeroPad || 0);

  const toRoman = (num: number): string => {
    const map: Array<[number, string]> = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let n = Math.max(1, Math.floor(num));
    let out = "";
    for (const [v, s] of map) {
      while (n >= v) { out += s; n -= v; }
    }
    return out;
  };

  const pad = (num: number, width: number) =>
    width > 0 ? String(num).padStart(width, "0") : String(num);

  let numeral: string;
  if (style === "roman-upper" || style === "roman-lower") {
    const r = toRoman(safeIndex);
    numeral = style === "roman-lower" ? r.toLowerCase() : r;
  } else {
    numeral = pad(safeIndex, zeroPad);
  }

  const result = `${prefix} ${numeral}`;
  console.log('[CHAPTER NAME] Result:', result);
  return result;
}

// Localized metadata field labels
export const localizedMetadata = {
  en: {
    title: 'Title',
    author: 'Author',
    subtitle: 'Subtitle (optional)',
    isbn: 'ISBN (optional)',
    metadata: 'Title Page Metadata',
    required: 'Metadata Required',
    copyright: 'Copyright © {year} by {author}. All rights reserved.'
  },
  // Spanish variants
  es: {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-ES': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-MX': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-AR': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-CO': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-CL': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-PE': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-VE': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  'es-PR': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos de la Página de Título',
    required: 'Metadatos Requeridos',
    copyright: 'Copyright © {year} por {author}. Todos los derechos reservados.'
  },
  // French variants
  fr: {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-FR': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-CA': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-BE': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-CH': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-SN': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-CI': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-MA': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  'fr-HT': {
    title: 'Titre',
    author: 'Auteur',
    subtitle: 'Sous-titre (optionnel)',
    isbn: 'ISBN (optionnel)',
    metadata: 'Métadonnées de la Page de Titre',
    required: 'Métadonnées Requises',
    copyright: 'Copyright © {year} par {author}. Tous droits réservés.'
  },
  // German variants
  de: {
    title: 'Titel',
    author: 'Autor',
    subtitle: 'Untertitel (optional)',
    isbn: 'ISBN (optional)',
    metadata: 'Titelseiten-Metadaten',
    required: 'Metadaten Erforderlich',
    copyright: 'Copyright © {year} von {author}. Alle Rechte vorbehalten.'
  },
  'de-DE': {
    title: 'Titel',
    author: 'Autor',
    subtitle: 'Untertitel (optional)',
    isbn: 'ISBN (optional)',
    metadata: 'Titelseiten-Metadaten',
    required: 'Metadaten Erforderlich'
  },
  'de-AT': {
    title: 'Titel',
    author: 'Autor',
    subtitle: 'Untertitel (optional)',
    isbn: 'ISBN (optional)',
    metadata: 'Titelseiten-Metadaten',
    required: 'Metadaten Erforderlich'
  },
  'de-CH': {
    title: 'Titel',
    author: 'Autor',
    subtitle: 'Untertitel (optional)',
    isbn: 'ISBN (optional)',
    metadata: 'Titelseiten-Metadaten',
    required: 'Metadaten Erforderlich'
  },
  // Portuguese variants
  pt: {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadados da Página de Título',
    required: 'Metadados Obrigatórios',
    copyright: 'Copyright © {year} por {author}. Todos os direitos reservados.'
  },
  'pt-PT': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadados da Página de Título',
    required: 'Metadados Obrigatórios'
  },
  'pt-BR': {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadados da Página de Título',
    required: 'Metadados Obrigatórios'
  },
  // Italian
  it: {
    title: 'Titolo',
    author: 'Autore',
    subtitle: 'Sottotitolo (opzionale)',
    isbn: 'ISBN (opzionale)',
    metadata: 'Metadati della Pagina del Titolo',
    required: 'Metadati Richiesti',
    copyright: 'Copyright © {year} di {author}. Tutti i diritti riservati.'
  },
  // Catalan & Occitan
  ca: {
    title: 'Títol',
    author: 'Autor',
    subtitle: 'Subtítol (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadades de la Pàgina de Títol',
    required: 'Metadades Requerides',
    copyright: 'Copyright © {year} per {author}. Tots els drets reservats.'
  },
  oc: {
    title: 'Títol',
    author: 'Autor',
    subtitle: 'Sostítol (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadonadas de la Pagina de Títol',
    required: 'Metadonadas Requeridas',
    copyright: 'Copyright © {year} per {author}. Totes los dreches reservats.'
  },
  // Russian
  ru: {
    title: 'Название',
    author: 'Автор',
    subtitle: 'Подзаголовок (необязательно)',
    isbn: 'ISBN (необязательно)',
    metadata: 'Метаданные Титульной Страницы',
    required: 'Метаданные Обязательны',
    copyright: 'Copyright © {year} {author}. Все права защищены.'
  },
  // Hindi
  hi: {
    title: 'शीर्षक',
    author: 'लेखक',
    subtitle: 'उपशीर्षक (वैकल्पिक)',
    isbn: 'ISBN (वैकल्पिक)',
    metadata: 'शीर्षक पृष्ठ मेटाडेटा',
    required: 'मेटाडेटा आवश्यक',
    copyright: 'कॉपीराइट © {year} {author}। सभी अधिकार सुरक्षित।'
  },
  // Add more key languages
  zh: {
    title: '标题',
    author: '作者',
    subtitle: '副标题 (可选)',
    isbn: 'ISBN (可选)',
    metadata: '标题页元数据',
    required: '元数据必需',
    copyright: 'Copyright © {year} {author}。版权所有。'
  },
  ja: {
    title: 'タイトル',
    author: '著者',
    subtitle: 'サブタイトル (オプション)',
    isbn: 'ISBN (オプション)',
    metadata: 'タイトルページメタデータ',
    required: 'メタデータ必須',
    copyright: 'Copyright © {year} {author}。無断転載を禁じます。'
  },
  ar: {
    title: 'العنوان',
    author: 'المؤلف',
    subtitle: 'العنوان الفرعي (اختياري)',
    isbn: 'ISBN (اختياري)',
    metadata: 'بيانات صفحة العنوان',
    required: 'بيانات مطلوبة',
    copyright: 'حقوق الطبع والنشر © {year} {author}. جميع الحقوق محفوظة.'
  },
  // African Languages
  ha: {
    title: 'Taken',
    author: 'Marubucin',
    subtitle: 'Karamin taken (na zaɓi)',
    isbn: 'ISBN (na zaɓi)',
    metadata: 'Bayanan Shafin Taken',
    required: 'Bayanan da ake bukata',
    copyright: 'Copyright © {year} ta {author}. Duk wani hakki an kiyaye.'
  },
  ig: {
    title: 'Aha',
    author: 'Onye dere ya',
    subtitle: 'Aha nta (nhọrọ)',
    isbn: 'ISBN (nhọrọ)',
    metadata: 'Metadata nke Peeji Aha',
    required: 'Metadata achọrọ',
    copyright: 'Copyright © {year} site na {author}. Ikike niile echekwara.'
  },
  sw: {
    title: 'Kichwa',
    author: 'Mwandishi',
    subtitle: 'Kichwa kidogo (si lazima)',
    isbn: 'ISBN (si lazima)',
    metadata: 'Metadata ya Ukurasa wa Kichwa',
    required: 'Metadata inahitajika',
    copyright: 'Hakimiliki © {year} na {author}. Haki zote zimehifadhiwa.'
  },
  yo: {
    title: 'Akọle',
    author: 'Onkọwe',
    subtitle: 'Akọle kekere (yiyan)',
    isbn: 'ISBN (yiyan)',
    metadata: 'Metadata ti Oju-iwe Akọle',
    required: 'Metadata ti o nilo',
    copyright: 'Copyright © {year} nipasẹ {author}. Gbogbo ẹtọ ni a pa mọ.'
  },
  zu: {
    title: 'Isihloko',
    author: 'Umbhali',
    subtitle: 'Isihloko esincane (ukukhetha)',
    isbn: 'ISBN (ukukhetha)',
    metadata: 'I-Metadata Yekhasi Lesihloko',
    required: 'I-Metadata eyadingeka',
    copyright: 'Copyright © {year} ngu-{author}. Wonke amalungelo agodliwe.'
  },
  xh: {
    title: 'Isihloko',
    author: 'Umbhali',
    subtitle: 'Isihloko esincinci (ukukhetha)',
    isbn: 'ISBN (ukukhetha)',
    metadata: 'I-Metadata Yephepha Lesihloko',
    required: 'I-Metadata efunekayo',
    copyright: 'Copyright © {year} ngu-{author}. Onke amalungelo agodliwe.'
  },
  // Other African Languages
  ki: {
    title: 'Mũtwe',
    author: 'Mwandĩki',
    subtitle: 'Mũtwe mũnini (gũthuura)',
    isbn: 'ISBN (gũthuura)',
    metadata: 'Metadata ya Rũrĩrĩ rwa Mũtwe',
    required: 'Metadata ĩrĩa ĩbataire',
    copyright: 'Copyright © {year} nĩ {author}. Mĩthiirĩre yothe nĩyagĩrĩirwo.'
  },
  rw: {
    title: 'Umutwe',
    author: 'Uwanditse',
    subtitle: 'Umutwe muto (guhitamo)',
    isbn: 'ISBN (guhitamo)',
    metadata: 'Metadata y\'urupapuro rw\'umutwe',
    required: 'Metadata ikenewe',
    copyright: 'Uburenganzira © {year} bwa {author}. Uburenganzira bwose burarinzwe.'
  },
  rn: {
    title: 'Umutwe',
    author: 'Uwanditse',
    subtitle: 'Umutwe muto (guhitamo)',
    isbn: 'ISBN (guhitamo)',
    metadata: 'Metadata y\'urupapuro rw\'umutwe',
    required: 'Metadata ikenewe',
    copyright: 'Uburenganzira © {year} bwa {author}. Uburenganzira bwose burarinzwe.'
  },
  lg: {
    title: 'Omutwe',
    author: 'Omuwandiisi',
    subtitle: 'Omutwe omuto (okulonda)',
    isbn: 'ISBN (okulonda)',
    metadata: 'Metadata y\'olupapula lw\'omutwe',
    required: 'Metadata eyeetaagisa',
    copyright: 'Copyright © {year} wa {author}. Eddembe lyonna liriko.'
  },
  mg: {
    title: 'Lohateny',
    author: 'Mpanoratra',
    subtitle: 'Lohateny kely (safidy)',
    isbn: 'ISBN (safidy)',
    metadata: 'Metadata an\'ny pejy lohateny',
    required: 'Metadata ilaina',
    copyright: 'Copyright © {year} an\'i {author}. Ny zo rehetra voatahiry.'
  },
  sn: {
    title: 'Musoro',
    author: 'Munyori',
    subtitle: 'Musoro mudiki (kusarudza)',
    isbn: 'ISBN (kusarudza)',
    metadata: 'Metadata yepeji remusoro',
    required: 'Metadata inodiwa',
    copyright: 'Copyright © {year} na {author}. Kodzero dzose dzakachengetwa.'
  },
  st: {
    title: 'Sehlooho',
    author: 'Mongodi',
    subtitle: 'Sehlooho se senyane (khetho)',
    isbn: 'ISBN (khetho)',
    metadata: 'Metadata ea leqephe la sehlooho',
    required: 'Metadata e hlokahalang',
    copyright: 'Copyright © {year} ea {author}. Litokelo tsohle li bolokiloe.'
  },
  tn: {
    title: 'Setlhogo',
    author: 'Mokwadi',
    subtitle: 'Setlhogo se sennye (tlhopho)',
    isbn: 'ISBN (tlhopho)',
    metadata: 'Metadata ya tsebe ya setlhogo',
    required: 'Metadata e e tlhokegang',
    copyright: 'Copyright © {year} ya {author}. Ditshwanelo tsotlhe di boloketswe.'
  },
  // European Languages (missing ones)
  hr: {
    title: 'Naslov',
    author: 'Autor',
    subtitle: 'Podnaslov (neobavezno)',
    isbn: 'ISBN (neobavezno)',
    metadata: 'Metapodaci stranice naslova',
    required: 'Potrebni metapodaci',
    copyright: 'Copyright © {year} {author}. Sva prava pridržana.'
  },
  cs: {
    title: 'Název',
    author: 'Autor',
    subtitle: 'Podtitul (volitelné)',
    isbn: 'ISBN (volitelné)',
    metadata: 'Metadata titulní stránky',
    required: 'Požadovaná metadata',
    copyright: 'Copyright © {year} {author}. Všechna práva vyhrazena.'
  },
  da: {
    title: 'Titel',
    author: 'Forfatter',
    subtitle: 'Undertitel (valgfri)',
    isbn: 'ISBN (valgfri)',
    metadata: 'Metadata for titelside',
    required: 'Påkrævet metadata',
    copyright: 'Copyright © {year} af {author}. Alle rettigheder forbeholdes.'
  },
  nl: {
    title: 'Titel',
    author: 'Auteur',
    subtitle: 'Ondertitel (optioneel)',
    isbn: 'ISBN (optioneel)',
    metadata: 'Metadata van titelpagina',
    required: 'Vereiste metadata',
    copyright: 'Copyright © {year} door {author}. Alle rechten voorbehouden.'
  },
  et: {
    title: 'Pealkiri',
    author: 'Autor',
    subtitle: 'Alapealkiri (valikuline)',
    isbn: 'ISBN (valikuline)',
    metadata: 'Tiitellehe metaandmed',
    required: 'Nõutavad metaandmed',
    copyright: 'Copyright © {year} {author}. Kõik õigused kaitstud.'
  },
  fi: {
    title: 'Otsikko',
    author: 'Kirjoittaja',
    subtitle: 'Alaotsikko (valinnainen)',
    isbn: 'ISBN (valinnainen)',
    metadata: 'Otsikkosivun metatiedot',
    required: 'Vaaditut metatiedot',
    copyright: 'Copyright © {year} {author}. Kaikki oikeudet pidätetään.'
  },
  gl: {
    title: 'Título',
    author: 'Autor',
    subtitle: 'Subtítulo (opcional)',
    isbn: 'ISBN (opcional)',
    metadata: 'Metadatos da páxina de título',
    required: 'Metadatos requiridos',
    copyright: 'Copyright © {year} por {author}. Todos os dereitos reservados.'
  },
  el: {
    title: 'Τίτλος',
    author: 'Συγγραφέας',
    subtitle: 'Υπότιτλος (προαιρετικό)',
    isbn: 'ISBN (προαιρετικό)',
    metadata: 'Μεταδεδομένα σελίδας τίτλου',
    required: 'Απαιτούμενα μεταδεδομένα',
    copyright: 'Copyright © {year} {author}. Όλα τα δικαιώματα διατηρούνται.'
  },
  hu: {
    title: 'Cím',
    author: 'Szerző',
    subtitle: 'Alcím (opcionális)',
    isbn: 'ISBN (opcionális)',
    metadata: 'Címlap metaadatai',
    required: 'Szükséges metaadatok',
    copyright: 'Copyright © {year} {author}. Minden jog fenntartva.'
  },
  is: {
    title: 'Titill',
    author: 'Höfundur',
    subtitle: 'Undirtitill (valfrjáls)',
    isbn: 'ISBN (valfrjáls)',
    metadata: 'Lýsigögn titilsíðu',
    required: 'Nauðsynleg lýsigögn',
    copyright: 'Höfundarréttur © {year} {author}. Öll réttindi áskilin.'
  },
  lv: {
    title: 'Nosaukums',
    author: 'Autors',
    subtitle: 'Apakšnosaukums (pēc izvēles)',
    isbn: 'ISBN (pēc izvēles)',
    metadata: 'Titullapas metadati',
    required: 'Nepieciešamie metadati',
    copyright: 'Copyright © {year} {author}. Visas tiesības aizsargātas.'
  },
  lt: {
    title: 'Pavadinimas',
    author: 'Autorius',
    subtitle: 'Paantraštė (pasirinktinai)',
    isbn: 'ISBN (pasirinktinai)',
    metadata: 'Titulinio puslapio metaduomenys',
    required: 'Reikalingi metaduomenys',
    copyright: 'Copyright © {year} {author}. Visos teisės saugomos.'
  },
  mk: {
    title: 'Наслов',
    author: 'Автор',
    subtitle: 'Поднаслов (опционално)',
    isbn: 'ISBN (опционално)',
    metadata: 'Метаподатоци на насловна страница',
    required: 'Потребни метаподатоци',
    copyright: 'Copyright © {year} {author}. Сите права задржани.'
  },
  no: {
    title: 'Tittel',
    author: 'Forfatter',
    subtitle: 'Undertittel (valgfri)',
    isbn: 'ISBN (valgfri)',
    metadata: 'Metadata for tittelside',
    required: 'Påkrevd metadata',
    copyright: 'Copyright © {year} av {author}. Alle rettigheter forbeholdt.'
  },
  pl: {
    title: 'Tytuł',
    author: 'Autor',
    subtitle: 'Podtytuł (opcjonalny)',
    isbn: 'ISBN (opcjonalny)',
    metadata: 'Metadane strony tytułowej',
    required: 'Wymagane metadane',
    copyright: 'Copyright © {year} {author}. Wszelkie prawa zastrzeżone.'
  },
  ro: {
    title: 'Titlu',
    author: 'Autor',
    subtitle: 'Subtitlu (opțional)',
    isbn: 'ISBN (opțional)',
    metadata: 'Metadate pagină de titlu',
    required: 'Metadate necesare',
    copyright: 'Copyright © {year} {author}. Toate drepturile rezervate.'
  },
  sr: {
    title: 'Наслов',
    author: 'Аутор',
    subtitle: 'Поднаслов (опционо)',
    isbn: 'ISBN (опционо)',
    metadata: 'Метаподаци насловне стране',
    required: 'Потребни метаподаци',
    copyright: 'Copyright © {year} {author}. Сва права задржана.'
  },
  sk: {
    title: 'Názov',
    author: 'Autor',
    subtitle: 'Podtitul (voliteľné)',
    isbn: 'ISBN (voliteľné)',
    metadata: 'Metaúdaje titulnej stránky',
    required: 'Požadované metaúdaje',
    copyright: 'Copyright © {year} {author}. Všetky práva vyhradené.'
  },
  sl: {
    title: 'Naslov',
    author: 'Avtor',
    subtitle: 'Podnaslov (neobvezno)',
    isbn: 'ISBN (neobvezno)',
    metadata: 'Metapodatki naslovne strani',
    required: 'Zahtevani metapodatki',
    copyright: 'Copyright © {year} {author}. Vse pravice pridržane.'
  },
  sv: {
    title: 'Titel',
    author: 'Författare',
    subtitle: 'Undertitel (valfri)',
    isbn: 'ISBN (valfri)',
    metadata: 'Metadata för titelsida',
    required: 'Nödvändig metadata',
    copyright: 'Copyright © {year} av {author}. Alla rättigheter förbehållna.'
  },
  tr: {
    title: 'Başlık',
    author: 'Yazar',
    subtitle: 'Alt başlık (isteğe bağlı)',
    isbn: 'ISBN (isteğe bağlı)',
    metadata: 'Başlık sayfası meta verileri',
    required: 'Gerekli meta veriler',
    copyright: 'Copyright © {year} {author}. Tüm hakları saklıdır.'
  },
  // Asian Languages (missing ones)
  id: {
    title: 'Judul',
    author: 'Penulis',
    subtitle: 'Subjudul (opsional)',
    isbn: 'ISBN (opsional)',
    metadata: 'Metadata halaman judul',
    required: 'Metadata diperlukan',
    copyright: 'Hak Cipta © {year} oleh {author}. Semua hak dilindungi.'
  },
  ms: {
    title: 'Tajuk',
    author: 'Pengarang',
    subtitle: 'Subtajuk (pilihan)',
    isbn: 'ISBN (pilihan)',
    metadata: 'Metadata muka surat tajuk',
    required: 'Metadata diperlukan',
    copyright: 'Hak Cipta © {year} oleh {author}. Semua hak terpelihara.'
  },
  vi: {
    title: 'Tiêu đề',
    author: 'Tác giả',
    subtitle: 'Phụ đề (tùy chọn)',
    isbn: 'ISBN (tùy chọn)',
    metadata: 'Siêu dữ liệu trang tiêu đề',
    required: 'Siêu dữ liệu bắt buộc',
    copyright: 'Bản quyền © {year} bởi {author}. Mọi quyền được bảo lưu.'
  },
  tl: {
    title: 'Pamagat',
    author: 'May-akda',
    subtitle: 'Subtitle (opsyonal)',
    isbn: 'ISBN (opsyonal)',
    metadata: 'Metadata ng pahina ng pamagat',
    required: 'Kinakailangang metadata',
    copyright: 'Copyright © {year} ni {author}. Lahat ng karapatan ay nakalaan.'
  },
  // Indian Languages (missing ones)
  bn: {
    title: 'শিরোনাম',
    author: 'লেখক',
    subtitle: 'উপশিরোনাম (ঐচ্ছিক)',
    isbn: 'ISBN (ঐচ্ছিক)',
    metadata: 'শিরোনাম পৃষ্ঠার মেটাডেটা',
    required: 'প্রয়োজনীয় মেটাডেটা',
    copyright: 'কপিরাইট © {year} {author}। সমস্ত অধিকার সংরক্ষিত।'
  },
  gu: {
    title: 'શીર્ષક',
    author: 'લેખક',
    subtitle: 'ઉપશીર્ષક (વૈકલ્પિક)',
    isbn: 'ISBN (વૈકલ્પિક)',
    metadata: 'શીર્ષક પૃષ્ઠ મેટાડેટા',
    required: 'આવશ્યક મેટાડેટા',
    copyright: 'કૉપિરાઇટ © {year} {author}. બધા અધિકારો આરક્ષિત.'
  },
  te: {
    title: 'శీర్షిక',
    author: 'రచయిత',
    subtitle: 'ఉపశీర్షిక (ఐచ్ఛిక)',
    isbn: 'ISBN (ఐచ్ఛిక)',
    metadata: 'శీర్షిక పేజీ మెటాడేటా',
    required: 'అవసరమైన మెటాడేటా',
    copyright: 'కాపీరైట్ © {year} {author}. అన్ని హక్కులు రక్షించబడ్డాయి.'
  },
  kn: {
    title: 'ಶೀರ್ಷಿಕೆ',
    author: 'ಲೇಖಕ',
    subtitle: 'ಉಪಶೀರ್ಷಿಕೆ (ಐಚ್ಛಿಕ)',
    isbn: 'ISBN (ಐಚ್ಛಿಕ)',
    metadata: 'ಶೀರ್ಷಿಕೆ ಪುಟದ ಮೆಟಾಡೇಟಾ',
    required: 'ಅಗತ್ಯವಿರುವ ಮೆಟಾಡೇಟಾ',
    copyright: 'ಹಕ್ಕುಸ್ವಾಮ್ಯ © {year} {author}. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
  },
  ml: {
    title: 'ശീർഷകം',
    author: 'രചയിതാവ്',
    subtitle: 'ഉപശീർഷകം (ഓപ്ഷണൽ)',
    isbn: 'ISBN (ഓപ്ഷണൽ)',
    metadata: 'ശീർഷക പേജ് മെറ്റാഡാറ്റ',
    required: 'ആവശ്യമായ മെറ്റാഡാറ്റ',
    copyright: 'പകർപ്പവകാശം © {year} {author}. എല്ലാ അവകാശങ്ങളും സംരക്ഷിച്ചിരിക്കുന്നു.'
  },
  pa: {
    title: 'ਸਿਰਲੇਖ',
    author: 'ਲੇਖਕ',
    subtitle: 'ਉਪ-ਸਿਰਲੇਖ (ਵਿਕਲਪਿਕ)',
    isbn: 'ISBN (ਵਿਕਲਪਿਕ)',
    metadata: 'ਸਿਰਲੇਖ ਪੰਨਾ ਮੈਟਾਡੇਟਾ',
    required: 'ਲੋੜੀਂਦਾ ਮੈਟਾਡੇਟਾ',
    copyright: 'ਕਾਪੀਰਾਈਟ © {year} {author}। ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ ਹਨ।'
  },
  or: {
    title: 'ଶୀର୍ଷକ',
    author: 'ଲେଖକ',
    subtitle: 'ଉପଶୀର୍ଷକ (ଇଚ୍ଛାଧୀନ)',
    isbn: 'ISBN (ଇଚ୍ଛାଧୀନ)',
    metadata: 'ଶୀର୍ଷକ ପୃଷ୍ଠା ମେଟାଡାଟା',
    required: 'ଆବଶ୍ୟକ ମେଟାଡାଟା',
    copyright: 'କପିରାଇଟ୍ © {year} {author}। ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।'
  },
  ta: {
    title: 'தலைப்பு',
    author: 'ஆசிரியர்',
    subtitle: 'துணைத்தலைப்பு (விருப்பம்)',
    isbn: 'ISBN (விருப்பம்)',
    metadata: 'தலைப்பு பக்க மெட்டாடேட்டா',
    required: 'தேவையான மெட்டாடேட்டா',
    copyright: 'பதிப்புரிமை © {year} {author}। அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன।'
  }
};

// Helper function to get localized metadata labels
export const getLocalizedMetadata = (languageCode: string) => {
  const normalizedLang = normalizeLang(languageCode);
  
  // Try exact match first, then normalized, then fallback to English
  return localizedMetadata[languageCode] || 
         localizedMetadata[normalizedLang] || 
         localizedMetadata['en'];
};

// Helper function to generate localized copyright notice
export const generateCopyrightNotice = (languageCode: string, author: string, year?: number) => {
  const metadata = getLocalizedMetadata(languageCode);
  const currentYear = year || new Date().getFullYear();
  
  if (!author || author.trim() === '') {
    return '';
  }
  
  return metadata.copyright
    .replace('{year}', currentYear.toString())
    .replace('{author}', author.trim());
};
