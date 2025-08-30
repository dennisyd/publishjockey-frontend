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
  const normalizedLanguage = normalizeLang(language);
  console.log('[BOOK STRUCTURE] Input language:', language, 'Normalized:', normalizedLanguage);
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
    es: {
      frontMatter: 'Materia Preliminar',
      mainMatter: 'Materia Principal', 
      backMatter: 'Materia Final'
    },
    fr: {
      frontMatter: 'Matière Préliminaire',
      mainMatter: 'Matière Principale',
      backMatter: 'Matière Finale'
    },
    de: {
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
