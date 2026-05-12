/**
 * Translate quran_surahs field from English into all 8 other languages.
 * Uses phrase-level replacement + surah name translation for Arabic.
 * Run: node scripts/translate-quran-refs.js
 */

const fs   = require('fs');
const path = require('path');
const DIR  = path.join(__dirname, '../husna-mobile/data/details');

// ── Surah name map for Arabic ─────────────────────────────────────────────────
const SURAH_AR = {
  'Al-Fatiha':'الفاتحة','Al-Baqarah':'البقرة','Al-Imran':'آل عمران',
  'An-Nisa':'النساء','Al-Maidah':'المائدة','Al-Anam':'الأنعام',
  "Al-An'am":'الأنعام','Al-Araf':'الأعراف','Al-Anfal':'الأنفال',
  'At-Tawbah':'التوبة','Yunus':'يونس','Hud':'هود','Yusuf':'يوسف',
  "Ar-Ra'd":'الرعد','Ibrahim':'إبراهيم','Al-Hijr':'الحجر',
  'An-Nahl':'النحل','Al-Isra':'الإسراء','Al-Kahf':'الكهف',
  'Maryam':'مريم','Ta-Ha':'طه','Al-Anbiya':'الأنبياء','Al-Hajj':'الحج',
  'Al-Muminun':'المؤمنون','An-Nur':'النور','Al-Furqan':'الفرقان',
  "Ash-Shu'ara":'الشعراء','An-Naml':'النمل','Al-Qasas':'القصص',
  'Al-Ankabut':'العنكبوت','Ar-Rum':'الروم','Luqman':'لقمان',
  'As-Sajdah':'السجدة','Al-Ahzab':'الأحزاب','Saba':'سبأ','Fatir':'فاطر',
  'Ya-Sin':'يس','As-Saffat':'الصافات','Sad':'ص','Az-Zumar':'الزمر',
  'Ghafir':'غافر','Fussilat':'فصلت','Ash-Shura':'الشورى',
  'Az-Zukhruf':'الزخرف','Ad-Dukhan':'الدخان','Al-Jathiyah':'الجاثية',
  'Al-Ahqaf':'الأحقاف','Muhammad':'محمد','Al-Fath':'الفتح',
  'Al-Hujurat':'الحجرات','Qaf':'ق','Adh-Dhariyat':'الذاريات',
  'At-Tur':'الطور','An-Najm':'النجم','Al-Qamar':'القمر',
  'Ar-Rahman':'الرحمن','Al-Waqiah':'الواقعة',"Al-Waqi'ah":'الواقعة',
  'Al-Hadid':'الحديد','Al-Mujadilah':'المجادلة','Al-Hashr':'الحشر',
  'Al-Mumtahanah':'الممتحنة','As-Saff':'الصف','Al-Jumuah':'الجمعة',
  "Al-Jumu'ah":'الجمعة','Al-Munafiqun':'المنافقون','At-Taghabun':'التغابن',
  'At-Talaq':'الطلاق','At-Tahrim':'التحريم','Al-Mulk':'الملك',
  'Al-Qalam':'القلم','Al-Haqqah':'الحاقة','Al-Maarij':'المعارج',
  'Nuh':'نوح','Al-Jinn':'الجن','Al-Muzzammil':'المزمل',
  'Al-Muddaththir':'المدثر','Al-Qiyamah':'القيامة','Al-Insan':'الإنسان',
  'Al-Mursalat':'المرسلات','An-Naba':'النبأ','An-Naziat':'النازعات',
  'Abasa':'عبس','At-Takwir':'التكوير','Al-Infitar':'الانفطار',
  'Al-Mutaffifin':'المطففين','Al-Inshiqaq':'الانشقاق','Al-Buruj':'البروج',
  'At-Tariq':'الطارق','Al-Ala':'الأعلى','Al-Ghashiyah':'الغاشية',
  'Al-Fajr':'الفجر','Al-Balad':'البلد','Ash-Shams':'الشمس',
  'Al-Layl':'الليل','Ad-Duha':'الضحى','Ash-Sharh':'الشرح','At-Tin':'التين',
  'Al-Alaq':'العلق','Al-Qadr':'القدر','Al-Bayyinah':'البينة',
  'Az-Zalzalah':'الزلزلة','Al-Adiyat':'العاديات','Al-Qariah':'القارعة',
  'At-Takathur':'التكاثر','Al-Asr':'العصر','Al-Humazah':'الهمزة',
  'Al-Fil':'الفيل','Quraysh':'قريش','Al-Maun':'الماعون',
  'Al-Kawthar':'الكوثر','Al-Kafirun':'الكافرون','An-Nasr':'النصر',
  'Al-Masad':'المسد','Al-Ikhlas':'الإخلاص','Al-Falaq':'الفلق','An-Nas':'الناس',
};

// ── Phrase-level translations ──────────────────────────────────────────────────
// Each entry: [search_regex_string, replacement_per_lang]
const PHRASES = [
  ['full surah', {ar:'السورة كاملة',bs:'cijela sura',tr:'tam sure',ur:'مکمل سورہ',id:'seluruh surah',bn:'পুরো সূরা',fa:'کل سوره',fr:'sourate entière'}],
  ['throughout the Quran paired with', {ar:'في القرآن مقترناً بـ',bs:'kroz cijeli Kur\'an uparen sa',tr:'Kur\'an boyunca ile eşleştirilmiş',ur:'پورے قرآن میں اس کے ساتھ',id:'di seluruh Al-Quran dipasangkan dengan',bn:'কুরআন জুড়ে সাথে জুটিবদ্ধ',fa:'در سراسر قرآن همراه با',fr:'tout au long du Coran associé à'}],
  ['paired with Ar-Rahman throughout the Quran', {ar:'مقترناً بالرحمن في أنحاء القرآن',bs:'uparen sa Ar-Rahmanom kroz cijeli Kur\'an',tr:'Kur\'an boyunca Ar-Rahman ile eşleştirilmiş',ur:'پورے قرآن میں الرحمن کے ساتھ',id:'dipasangkan dengan Ar-Rahman di seluruh Al-Quran',bn:'কুরআন জুড়ে আর-রহমানের সাথে',fa:'در سراسر قرآن همراه با الرحمن',fr:'associé à Ar-Rahman tout au long du Coran'}],
  ['and throughout', {ar:'وفي أنحائه',bs:'i kroz cijeli',tr:'ve genelinde',ur:'اور پورے',id:'dan di seluruhnya',bn:'এবং সর্বত্র',fa:'و در سراسر',fr:'et tout au long'}],
  ['also paired with Al-Hakeem', {ar:'أيضاً مقترناً بالحكيم',bs:'također uparen sa Al-Hakimom',tr:'aynı zamanda Al-Hakeem ile eşleştirilmiş',ur:'الحکیم کے ساتھ بھی',id:'juga dipasangkan dengan Al-Hakeem',bn:'আল-হাকীমের সাথেও',fa:'همچنین همراه با الحکیم',fr:'également associé à Al-Hakeem'}],
  ['frequently paired with Al-Baseer', {ar:'كثيراً ما يقترن بالبصير',bs:'često uparen sa Al-Basirom',tr:'sıklıkla Al-Baseer ile eşleştirilmiş',ur:'کثرت سے البصیر کے ساتھ',id:'sering dipasangkan dengan Al-Baseer',bn:'প্রায়শই আল-বাসীরের সাথে',fa:'اغلب همراه با البصیر',fr:'souvent associé à Al-Baseer'}],
  ['frequently paired with Al-Latif', {ar:'كثيراً ما يقترن باللطيف',bs:'često uparen sa Al-Latifom',tr:'sıklıkla Al-Latif ile eşleştirilmiş',ur:'کثرت سے اللطیف کے ساتھ',id:'sering dipasangkan dengan Al-Latif',bn:'প্রায়শই আল-লতীফের সাথে',fa:'اغلب همراه با اللطیف',fr:'souvent associé à Al-Latif'}],
  ['most frequently paired with Al-Aziz', {ar:'الأكثر اقتراناً بالعزيز',bs:'najčešće uparen sa Al-Azizom',tr:'en sık Al-Aziz ile eşleştirilmiş',ur:'سب سے زیادہ العزیز کے ساتھ',id:'paling sering dipasangkan dengan Al-Aziz',bn:'প্রায়শই আল-আযীযের সাথে',fa:'بیشترین همراهی با العزیز',fr:'le plus souvent associé à Al-Aziz'}],
  ['most frequently paired with Al-Hakeem and Al-Khabeer', {ar:'الأكثر اقتراناً بالحكيم والخبير',bs:'najčešće uparen sa Al-Hakimom i Al-Habirom',tr:'en sık Al-Hakeem ve Al-Khabeer ile',ur:'اکثر الحکیم اور الخبیر کے ساتھ',id:'paling sering dipasangkan dengan Al-Hakeem dan Al-Khabeer',bn:'প্রায়শই আল-হাকীম ও আল-খাবীরের সাথে',fa:'بیشترین همراهی با الحکیم و الخبیر',fr:'le plus souvent associé à Al-Hakeem et Al-Khabeer'}],
  ['Al-Qabidh always paired with Al-Basit; not named directly elsewhere', {ar:'القابض دائماً مقترن بالباسط؛ ولا يُذكر منفرداً في مكان آخر',bs:'Al-Qabidh uvijek uparen sa Al-Basidom; ne pojavljuje se direktno drugdje',tr:'Al-Qabidh her zaman Al-Basit ile eşleştirilmiş; başka yerde doğrudan geçmez',ur:'القابض ہمیشہ الباسط کے ساتھ؛ کہیں اور براہ راست نہیں',id:'Al-Qabidh selalu dipasangkan dengan Al-Basit; tidak disebut langsung di tempat lain',bn:'আল-কাবিদ সবসময় আল-বাসিতের সাথে; অন্য কোথাও সরাসরি উল্লিখিত নয়',fa:'القابض همیشه همراه الباسط است؛ در جای دیگری مستقیماً نیامده',fr:'Al-Qabidh toujours associé à Al-Basit; pas mentionné directement ailleurs'}],
  ['paired with Al-Qabidh', {ar:'مقترناً بالقابض',bs:'uparen sa Al-Qabidoom',tr:'Al-Qabidh ile eşleştirilmiş',ur:'القابض کے ساتھ',id:'dipasangkan dengan Al-Qabidh',bn:'আল-কাবিদের সাথে',fa:'همراه با القابض',fr:'associé à Al-Qabidh'}],
  ["refers to the Day of Judgment; name comes from the 99 names hadith", {ar:'تشير إلى يوم القيامة؛ الاسم مأخوذ من حديث الأسماء التسعة والتسعين',bs:'odnosi se na Sudnji dan; ime dolazi iz hadisa o 99 Božijih imena',tr:'Kıyamet Günü\'ne atıfta bulunur; isim 99 isim hadisinden alınmıştır',ur:'یوم القیامت کی طرف اشارہ؛ نام 99 اسماء کی حدیث سے',id:'mengacu pada Hari Kiamat; nama berasal dari hadits 99 Nama',bn:'কিয়ামত দিবসের ব্যাপারে; নামটি ৯৯ নামের হাদিস থেকে',fa:'به روز قیامت اشاره دارد؛ نام از حدیث ۹۹ اسم',fr:'se réfère au Jour du Jugement; nom tiré du hadith des 99 Noms'}],
  ['name comes from the 99 names hadith', {ar:'الاسم مأخوذ من حديث الأسماء التسعة والتسعين',bs:'ime dolazi iz hadisa o 99 Božijih imena',tr:'isim 99 isim hadisinden alınmıştır',ur:'نام 99 اسماء کی حدیث سے ماخوذ',id:'nama berasal dari hadits 99 Nama',bn:'নামটি ৯৯ নামের হাদিস থেকে',fa:'نام از حدیث ۹۹ اسم',fr:'nom tiré du hadith des 99 Noms'}],
  ['name from 99 names hadith', {ar:'الاسم من حديث الأسماء التسعة والتسعين',bs:'ime iz hadisa o 99 imena',tr:'isim 99 isimler hadisinden',ur:'نام 99 اسماء کی حدیث سے',id:'nama dari hadits 99 Nama',bn:'নামটি ৯৯ নামের হাদিস থেকে',fa:'نام از حدیث ۹۹ اسم',fr:'nom du hadith des 99 Noms'}],
  ['name from the 99 names hadith', {ar:'الاسم من حديث الأسماء التسعة والتسعين',bs:'ime iz hadisa o 99 Božijih imena',tr:'isim 99 isim hadisinden',ur:'نام 99 اسماء کی حدیث سے',id:'nama dari hadits 99 Nama',bn:'নামটি ৯৯ নামের হাদিস থেকে',fa:'نام از حدیث ۹۹ اسم',fr:'nom du hadith des 99 Noms'}],
  ['Al-Mu\'izz and Al-Muzil appear together', {ar:'المعزّ والمذلّ يظهران معاً',bs:'Al-Mu\'izz i Al-Muzil pojavljuju se zajedno',tr:'Al-Mu\'izz ve Al-Muzil birlikte geçer',ur:'المعزّ اور المذلّ ساتھ آتے ہیں',id:'Al-Mu\'izz dan Al-Muzil muncul bersama',bn:'আল-মু\'ইজ্জ ও আল-মুযিল একসাথে উল্লিখিত',fa:'المعزّ و المذلّ با هم ذکر می‌شوند',fr:'Al-Mu\'izz et Al-Muzil apparaissent ensemble'}],
  ['sole Quranic occurrence; name from 99 names hadith', {ar:'الوقوع القرآني الوحيد؛ الاسم من حديث التسعة والتسعين',bs:'jedino kur\'ansko pojavljivanje; ime iz hadisa o 99 imena',tr:'tek Kur\'ani geçiş; isim 99 isimler hadisinden',ur:'واحد قرآنی وقوع؛ نام 99 اسماء حدیث سے',id:'satu-satunya kemunculan Al-Quran; nama dari hadits 99 Nama',bn:'কুরআনের একমাত্র উল্লেখ; নামটি ৯৯ নামের হাদিস থেকে',fa:'تنها وقوع قرآنی؛ نام از حدیث ۹۹ اسم',fr:'unique occurrence coranique; nom du hadith des 99 Noms'}],
  ['sole Quranic occurrence', {ar:'الوقوع القرآني الوحيد',bs:'jedino kur\'ansko pojavljivanje',tr:'tek Kur\'ani geçiş',ur:'واحد قرآنی وقوع',id:'satu-satunya kemunculan dalam Al-Quran',bn:'কুরআনের একমাত্র উল্লেখ',fa:'تنها وقوع قرآنی',fr:'unique occurrence coranique'}],
  ['Not found as a direct divine name in the Quran — derived from the hadith listing the 99 Names', {ar:'لم يُذكر مباشرةً كاسم إلهي في القرآن — مستمد من حديث تعداد الأسماء التسعة والتسعين',bs:'Ne pojavljuje se direktno kao božansko ime u Kur\'anu — izvedeno iz hadisa koji nabraja 99 Božijih Imena',tr:'Kur\'an\'da doğrudan ilahi isim olarak geçmez — 99 İsmi listeleyen hadisten alınmıştır',ur:'قرآن میں براہ راست الہٰی نام کے طور پر نہیں آیا — 99 اسماء کی فہرست والی حدیث سے ماخوذ',id:'Tidak ditemukan sebagai nama ilahi secara langsung dalam Al-Quran — berasal dari hadits yang mencantumkan 99 Nama',bn:'কুরআনে সরাসরি ঐশ্বরিক নাম হিসেবে পাওয়া যায়নি — ৯৯ নামের তালিকা করা হাদিস থেকে নেওয়া',fa:'به طور مستقیم به عنوان اسم الهی در قرآن نیامده — از حدیث فهرست ۹۹ اسم',fr:'Absent comme nom divin direct dans le Coran — tiré du hadith listant les 99 Noms'}],
  ['Not found as a direct divine name in the Quran', {ar:'لم يُذكر مباشرةً كاسم إلهي في القرآن',bs:'Ne pojavljuje se direktno kao božansko ime u Kur\'anu',tr:'Kur\'an\'da doğrudan ilahi isim olarak geçmez',ur:'قرآن میں براہ راست الہٰی نام کے طور پر نہیں آیا',id:'Tidak ditemukan sebagai nama ilahi secara langsung dalam Al-Quran',bn:'কুরআনে সরাসরি ঐশ্বরিক নাম হিসেবে পাওয়া যায়নি',fa:'به طور مستقیم به عنوان اسم الهی در قرآن نیامده',fr:'Absent comme nom divin direct dans le Coran'}],
  ['Not found explicitly as a divine name in the Quran', {ar:'لم يُذكر صراحةً كاسم إلهي في القرآن',bs:'Ne pojavljuje se eksplicitno kao božansko ime u Kur\'anu',tr:'Kur\'an\'da açıkça ilahi isim olarak geçmez',ur:'قرآن میں صراحتاً الہٰی نام کے طور پر نہیں آیا',id:'Tidak secara eksplisit ditemukan sebagai nama ilahi dalam Al-Quran',bn:'কুরআনে স্পষ্টভাবে ঐশ্বরিক নাম হিসেবে পাওয়া যায়নি',fa:'به صراحت به عنوان اسم الهی در قرآن نیامده',fr:'Absent explicitement comme nom divin dans le Coran'}],
  ['Not found as a divine name in the Quran', {ar:'لم يُذكر كاسم إلهي في القرآن',bs:'Ne pojavljuje se kao božansko ime u Kur\'anu',tr:'Kur\'an\'da ilahi isim olarak geçmez',ur:'قرآن میں الہٰی نام کے طور پر نہیں آیا',id:'Tidak ditemukan sebagai nama ilahi dalam Al-Quran',bn:'কুরআনে ঐশ্বরিক নাম হিসেবে পাওয়া যায়নি',fa:'به عنوان اسم الهی در قرآن نیامده',fr:'Absent comme nom divin dans le Coran'}],
  ['the only occurrence as a divine name. Note: 5:48 uses \'muhayminan\' for the Quran, not Allah.', {ar:'الوقوع الوحيد كاسم إلهي. ملاحظة: في ٥:٤٨ جاء «مُهَيْمِنًا» وصفاً للقرآن لا لله.',bs:'jedina pojava kao božansko ime. Napomena: u 5:48 koristi se \'muhayminan\' za Kur\'an, a ne za Allaha.',tr:'ilahi isim olarak tek geçiş. Not: 5:48\'de \'muhayminan\' Kur\'an için kullanılmış, Allah için değil.',ur:'بطور الہٰی نام واحد وقوع۔ نوٹ: ٥:٤٨ میں \"مُہیمناً\" قرآن کے لیے ہے، اللہ کے لیے نہیں۔',id:'satu-satunya kemunculan sebagai nama ilahi. Catatan: 5:48 menggunakan \'muhayminan\' untuk Al-Quran, bukan Allah.',bn:'ঐশ্বরিক নাম হিসেবে একমাত্র উল্লেখ। টীকা: ৫:৪৮-এ \'মুহাইমিনান\' কুরআনের জন্য ব্যবহৃত, আল্লাহর জন্য নয়।',fa:'تنها وقوع به عنوان اسم الهی. توجه: در ۵:۴۸ «مهیمناً» برای قرآن است نه برای الله.',fr:'la seule occurrence comme nom divin. Note: en 5:48, \'muhayminan\' désigne le Coran, pas Allah.'}],
  ['the only occurrence as a divine name', {ar:'الوقوع الوحيد كاسم إلهي',bs:'jedina pojava kao božansko ime',tr:'ilahi isim olarak tek geçiş',ur:'بطور الہٰی نام واحد وقوع',id:'satu-satunya kemunculan sebagai nama ilahi',bn:'ঐশ্বরিক নাম হিসেবে একমাত্র উল্লেখ',fa:'تنها وقوع به عنوان اسم الهی',fr:'la seule occurrence comme nom divin'}],
  ['all four names appear in one verse', {ar:'تظهر الأسماء الأربعة في آية واحدة',bs:'sva četiri imena pojavljuju se u jednom ajetu',tr:'dört ismin tamamı tek bir ayette geçer',ur:'چاروں نام ایک ہی آیت میں آتے ہیں',id:'keempat nama muncul dalam satu ayat',bn:'চারটি নামই একটি আয়াতে উল্লিখিত',fa:'هر چهار اسم در یک آیه آمده‌اند',fr:'les quatre noms apparaissent dans un seul verset'}],
  ['always paired with Al-Hayy', {ar:'دائماً مقترناً بالحي',bs:'uvijek uparen sa Al-Hayyom',tr:'her zaman Al-Hayy ile eşleştirilmiş',ur:'ہمیشہ الحي کے ساتھ',id:'selalu dipasangkan dengan Al-Hayy',bn:'সবসময় আল-হাইয়ের সাথে',fa:'همیشه همراه با الحی',fr:'toujours associé à Al-Hayy'}],
  ['the famous Light verse; one of the most commented-upon in all of Islamic scholarship', {ar:'آية النور المشهورة؛ من أكثر الآيات تفسيراً في التراث الإسلامي',bs:'poznati Ajet o Svjetlosti; jedan od najkomentarisanijih u islamskoj znanosti',tr:'meşhur Nur Ayeti; İslami ilimde en çok yorumlananlardan',ur:'مشہور آیت النور؛ اسلامی علم میں سب سے زیادہ تفسیر شدہ آیات میں سے',id:'Ayat Cahaya yang terkenal; salah satu yang paling banyak dikomentari dalam ilmu Islam',bn:'বিখ্যাত আয়াতুন নূর; ইসলামিক বৃত্তিতে সর্বাধিক ব্যাখ্যাকৃত',fa:'آیه نور معروف؛ یکی از پرتفسیرترین در علوم اسلامی',fr:'le célèbre Verset de la Lumière; l\'un des plus commentés dans la tradition islamique'}],
  ['occurrences as divine name', {ar:'وقوعاً كاسم إلهي',bs:'pojave kao božansko ime',tr:'geçiş ilahi isim olarak',ur:'بطور الہٰی نام وقوعات',id:'kemunculan sebagai nama ilahi',bn:'ঐশ্বরিক নাম হিসেবে উল্লেখ',fa:'وقوع به عنوان اسم الهی',fr:'occurrences comme nom divin'}],
  ['occurrences as divine attribute of wisdom', {ar:'وقوعاً كصفة إلهية للحكمة',bs:'pojave kao božanska osobina mudrosti',tr:'geçiş ilahi hikmet sıfatı olarak',ur:'حکمت کی الہٰی صفت کے طور پر وقوعات',id:'kemunculan sebagai atribut ilahi kebijaksanaan',bn:'জ্ঞানের ঐশ্বরিক গুণ হিসেবে উল্লেখ',fa:'وقوع به عنوان صفت الهی حکمت',fr:'occurrences comme attribut divin de la sagesse'}],
  ['occurrences', {ar:'وقوعاً',bs:'pojave',tr:'geçiş',ur:'وقوعات',id:'kemunculan',bn:'উল্লেখ',fa:'وقوع',fr:'occurrences'}],
  ['appears once explicitly; concept of supreme exaltation is widespread in the Quran', {ar:'يظهر مرة واحدة صراحةً؛ ومفهوم التعالي السامي منتشر في القرآن',bs:'pojavljuje se jedanput eksplicitno; koncept uzvišenosti raširena je u Kur\'anu',tr:'bir kez açıkça geçer; yüce yücelik kavramı Kur\'an\'da yaygındır',ur:'صراحتاً ایک بار آتا ہے؛ سر تعالی کا مفہوم قرآن میں عام ہے',id:'muncul sekali secara eksplisit; konsep keagungan tertinggi tersebar luas dalam Al-Quran',bn:'স্পষ্টভাবে একবার উল্লিখিত; পরম উচ্চতার ধারণা কুরআন জুড়ে',fa:'یک بار به صراحت آمده؛ مفهوم تعالی عالی در سراسر قرآن گسترده است',fr:'apparaît une seule fois explicitement; le concept de l\'exaltation suprême est répandu dans le Coran'}],
  ['used in Ibrahim salutation', {ar:'وارد في الصلاة الإبراهيمية',bs:'koristi se u Ibrahimovoj salavatnoj formuli',tr:'İbrahim salavâtında kullanılmış',ur:'ابراہیمی صلاۃ میں آتا ہے',id:'digunakan dalam shalawat Ibrahim',bn:'ইবরাহীমী সালামে ব্যবহৃত',fa:'در صلوات ابراهیمی آمده',fr:'utilisé dans la salutation ibrahimique'}],
  ['the entire surah is dedicated to His uniqueness', {ar:'السورة بأكملها مكرّسة لوحدانيته',bs:'cijela sura posvećena je Njegovoj jedinstvenosti',tr:'surenin tamamı O\'nun tekliğine adanmıştır',ur:'پوری سورہ اس کی وحدانیت کے لیے وقف ہے',id:'seluruh surah didedikasikan untuk keunikan-Nya',bn:'পুরো সূরাটি তাঁর অনন্যতার জন্য উৎসর্গিত',fa:'کل سوره به یگانگی او اختصاص دارد',fr:'la sourate entière est consacrée à Son unicité'}],
  ['one of only two occurrences of this word in the Quran', {ar:'أحد وقوعين فقط لهذه الكلمة في القرآن',bs:'jedna od samo dva pojavljivanja ove riječi u Kur\'anu',tr:'bu kelimenin Kur\'an\'daki yalnızca iki geçişinden biri',ur:'قرآن میں اس لفظ کے صرف دو وقوعات میں سے ایک',id:'salah satu dari hanya dua kemunculan kata ini dalam Al-Quran',bn:'কুরআনে এই শব্দের মাত্র দুটি উল্লেখের একটি',fa:'یکی از تنها دو وقوع این کلمه در قرآن',fr:'l\'une des seulement deux occurrences de ce mot dans le Coran'}],
  ['Ayat al-Kursi', {ar:'آية الكرسي',bs:'Ajetul-Kursija',tr:'Ayetel-Kürsi',ur:'آیت الکرسی',id:'Ayat Kursi',bn:'আয়াতুল কুরসী',fa:'آیت‌الکرسی',fr:'l\'Ayat al-Kursi'}],
  ['concept present', {ar:'المفهوم موجود',bs:'koncept prisutan',tr:'kavram mevcut',ur:'مفہوم موجود',id:'konsep hadir',bn:'ধারণা বিদ্যমান',fa:'مفهوم موجود است',fr:'concept présent'}],
  ['refers to Allah\'s self-sufficiency', {ar:'يشير إلى استغناء الله',bs:'odnosi se na Allahovu samodostatnost',tr:'Allah\'ın kendi kendine yeterliliğine atıfta bulunur',ur:'اللہ کی خودکفالت کی طرف اشارہ',id:'mengacu pada kecukupan diri Allah',bn:'আল্লাহর স্বনির্ভরতার ব্যাপারে',fa:'به خودبسندگی الله اشاره دارد',fr:'se réfère à l\'autosuffisance d\'Allah'}],
  ['used indirectly in Prophet Shu\'ayb\'s speech — name from 99 names hadith', {ar:'وارد بصورة غير مباشرة في خطاب النبي شعيب — الاسم من حديث التسعة والتسعين',bs:'koristi se indirektno u govoru Vjerovjesnika Šuajba — ime iz hadisa o 99 Božijih imena',tr:'Peygamber Şuayb\'ın konuşmasında dolaylı olarak geçmektedir — isim 99 isim hadisinden',ur:'نبی شعیب علیہ السلام کے خطاب میں بالواسطہ — نام 99 اسماء حدیث سے',id:'digunakan secara tidak langsung dalam pidato Nabi Syu\'ayb — nama dari hadits 99 Nama',bn:'নবী শু\'আইবের বক্তৃতায় পরোক্ষভাবে ব্যবহৃত — নামটি ৯৯ নামের হাদিস থেকে',fa:'به طور غیرمستقیم در سخن پیامبر شعیب آمده — نام از حدیث ۹۹ اسم',fr:'utilisé indirectement dans le discours du Prophète Shu\'ayb — nom du hadith des 99 Noms'}],
  ['comes exclusively from the 99 names hadith tradition', {ar:'مستمد حصراً من تقليد حديث الأسماء التسعة والتسعين',bs:'dolazi isključivo iz tradicije hadisa o 99 Božijih Imena',tr:'yalnızca 99 isim hadisi geleneğinden gelmektedir',ur:'صرف 99 اسماء کی حدیث روایت سے ماخوذ',id:'berasal semata-mata dari tradisi hadits 99 Nama',bn:'একমাত্র ৯৯ নামের হাদিস ঐতিহ্য থেকে',fa:'صرفاً از سنت حدیث ۹۹ اسم',fr:'vient exclusivement de la tradition du hadith des 99 Noms'}],
  ['distinguished from Al-Ghaffar by intensity', {ar:'يتميز عن الغفار بالدرجة والكثرة',bs:'razlikuje se od Al-Ghaffara po intenzitetu',tr:'Al-Ghaffar\'dan yoğunlukla ayırt edilmektedir',ur:'شدت کے لحاظ سے الغفار سے ممتاز',id:'dibedakan dari Al-Ghaffar berdasarkan intensitas',bn:'তীব্রতায় আল-গাফ্ফার থেকে আলাদা',fa:'از الغفار به لحاظ شدت متمایز است',fr:'distingué d\'Al-Ghaffar par l\'intensité'}],
  ['most common forgiveness name', {ar:'اسم المغفرة الأكثر شيوعاً',bs:'najčešće ime oprosta',tr:'en yaygın bağışlama ismi',ur:'مغفرت کا سب سے عام نام',id:'nama pengampunan yang paling umum',bn:'ক্ষমার সবচেয়ে সাধারণ নাম',fa:'متداول‌ترین اسم آمرزش',fr:'le nom de pardon le plus fréquent'}],
  ['paired frequently with Al-Ghani', {ar:'كثيراً ما يقترن بالغني',bs:'često uparen sa Al-Ghanijem',tr:'Al-Ghani ile sıklıkla eşleştirilmiş',ur:'کثرت سے الغنی کے ساتھ',id:'sering dipasangkan dengan Al-Ghani',bn:'প্রায়শই আল-গনীর সাথে',fa:'اغلب همراه با الغنی',fa:'اغلب همراه با الغنی',fr:'souvent associé à Al-Ghani'}],
];

// ── Apply to a language's text ─────────────────────────────────────────────────
function translate(text, lang) {
  if (lang === 'en') return text;
  let result = text;
  for (const [phrase, translations] of PHRASES) {
    if (translations[lang] && result.includes(phrase)) {
      result = result.split(phrase).join(translations[lang]);
    }
  }
  if (lang === 'ar') {
    // Replace surah names with Arabic
    for (const [en, ar] of Object.entries(SURAH_AR)) {
      const re = new RegExp('\\b' + en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'g');
      result = result.replace(re, ar);
    }
  }
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));

const LANGS = ['ar','bs','tr','ur','id','bn','fa','fr'];

for (const lang of LANGS) {
  const filePath = path.join(DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const id of Object.keys(en)) {
    const enText = en[id]?.quran_surahs || '';
    if (!enText) continue;
    const translated = translate(enText, lang);
    if (data[id] && translated !== data[id].quran_surahs) {
      data[id].quran_surahs = translated;
      changed++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] ${changed} quran_surahs translated`);
}

console.log('\nDone. Sample Arabic (name 7):');
const ar = JSON.parse(fs.readFileSync(path.join(DIR, 'ar.json')));
console.log(ar['7'].quran_surahs);
