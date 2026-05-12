/**
 * Apply audited fixes to all 99 Names detail files across all 9 languages.
 *
 * Fix types:
 *   A) Quran verse was in hadith field — move to quran_surahs, replace hadith
 *   B) Factual error in quran_surahs
 *   C) Wrong/unverifiable hadith — replace with authenticated one
 *
 * English is the reference. For other languages the hadith text is translated
 * from the English fix. Quran verses in Arabic stay in Arabic regardless of language.
 *
 * Run: node scripts/fix-islamic-content.js
 */

const fs = require('fs');
const path = require('path');

const LANGS = ['en', 'ar', 'bs', 'tr', 'ur', 'id', 'bn', 'fa', 'fr'];
const DIR   = path.join(__dirname, '../husna-mobile/data/details');

// ── Fixes ─────────────────────────────────────────────────────────────────────
// Each fix targets one name ID. Fields not listed are left unchanged.
// Translations are provided per-language for hadith field changes.
// ─────────────────────────────────────────────────────────────────────────────

const fixes = {

  // ── Fix B: Factual error in quran_surahs ──────────────────────────────────
  1: {
    quran_surahs: {
      en: "Opens 113 of 114 surahs (Bismillah). The only exception is Surah At-Tawbah (9), which has no Bismillah. Named entirely in Surah Ar-Rahman (55). Also prominent in Al-Fatiha (1:3).",
      ar: "تفتتح ١١٣ من ١١٤ سورة بالبسملة، والاستثناء الوحيد هو سورة التوبة (٩) التي لا تبدأ بها. سُمّيت سورة الرحمن (٥٥) بهذا الاسم بالكامل. وورد في الفاتحة (١:٣).",
      bs: "Otvara 113 od 114 sura (Bismillah). Jedina iznimka je sura At-Tawba (9) koja nema Bismillah. Cijela sura Ar-Rahman (55) je nazvana ovim imenom. Prominentno i u Al-Fatihi (1:3).",
      tr: "114 sureden 113'ünü (Besmele ile) açar. Tek istisna, Besmele'si olmayan Tevbe suresidir (9). Ar-Rahman suresi (55) tamamen bu isimle adlandırılmıştır. Al-Fatiha (1:3)'te de belirgin şekilde geçmektedir.",
      ur: "قرآن کی ۱۱۴ میں سے ۱۱۳ سورتیں بسم اللہ سے شروع ہوتی ہیں۔ صرف سورۃ التوبہ (۹) بسم اللہ کے بغیر ہے۔ سورۃ الرحمٰن (۵۵) مکمل اس نام پر ہے۔ سورۃ الفاتحہ (۱:۳) میں بھی نمایاں ہے۔",
      id: "Membuka 113 dari 114 surah (Bismillah). Satu-satunya pengecualian adalah Surah At-Tawbah (9) yang tidak memiliki Bismillah. Surah Ar-Rahman (55) seluruhnya dinamai dengan nama ini. Juga menonjol dalam Al-Fatihah (1:3).",
      bn: "১১৪টির মধ্যে ১১৩টি সূরা (বিসমিল্লাহ দিয়ে) শুরু হয়। একমাত্র ব্যতিক্রম হলো সূরা তওবা (৯), যার কোনো বিসমিল্লাহ নেই। সূরা আর-রহমান (৫৫) সম্পূর্ণরূপে এই নামে নামকরণ করা হয়েছে। আল-ফাতিহাতেও (১:৩) বিশিষ্টভাবে উল্লিখিত।",
      fa: "۱۱۳ سوره از ۱۱۴ سوره را با بسمله باز می‌کند. تنها استثنا سوره توبه (۹) است که بسمله ندارد. سوره الرحمن (۵۵) به طور کامل به این نام نامگذاری شده است. همچنین در الفاتحه (۳:۱) برجسته است.",
      fr: "Ouvre 113 des 114 sourates (Bismillah). La seule exception est la sourate At-Tawbah (9), qui n'a pas de Bismillah. La sourate Ar-Rahman (55) est entièrement nommée d'après ce nom. Également présent dans Al-Fatiha (1:3).",
    },
  },

  // ── Fix A: Quran 2:257 was in hadith field ────────────────────────────────
  7: {
    quran_surahs: {
      en: "Surah Al-Hashr (59:23). Also Al-Baqarah (2:257): 'Allah is the Guardian (Waliyy) of those who believe' — the root of guardianship runs throughout. Al-Ma'idah (5:48) uses this root to describe the Quran's guardianship over earlier scriptures.",
      ar: "سورة الحشر (٥٩:٢٣). وكذلك سورة البقرة (٢:٢٥٧): 'اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا'. وفي سورة المائدة (٥:٤٨) وصف القرآن بالمهيمن على الكتب السابقة.",
      bs: "Sura Al-Hashr (59:23). Također Al-Baqarah (2:257): 'Allah je zaštitnik onih koji vjeruju.' Korijen čuvanja se provlači kroz cijeli Kur'an. Al-Ma'idah (5:48) koristi ovaj korijen za Kur'an kao čuvara ranijih pisama.",
      tr: "Haşr suresi (59:23). Ayrıca Bakara suresi (2:257): 'Allah, iman edenlerin velisidir.' Koruma kökü Kur'an boyunca devam eder. Maide (5:48)'de bu kök, Kur'an'ın önceki kitaplara muheymin olmasını tanımlar.",
      ur: "سورۃ الحشر (٥٩:٢٣)۔ نیز سورۃ البقرہ (٢:٢٥٧): 'اللہ مؤمنوں کا ولی ہے'۔ حفاظت کی جڑ پورے قرآن میں ملتی ہے۔ سورۃ المائدہ (٥:٤٨) میں قرآن کو پچھلی کتابوں پر نگہبان کہا گیا ہے۔",
      id: "Surah Al-Hashr (59:23). Juga Al-Baqarah (2:257): 'Allah adalah pelindung orang-orang yang beriman.' Akar penjagaan mengalir di seluruh Al-Qur'an. Al-Ma'idah (5:48) menggunakan akar ini untuk menggambarkan Al-Qur'an sebagai penjaga kitab-kitab sebelumnya.",
      bn: "সূরা আল-হাশর (৫৯:২৩)। এছাড়াও আল-বাকারা (২:২৫৭): 'আল্লাহ ইমানদারদের অভিভাবক।' রক্ষার মূলটি পুরো কুরআন জুড়ে চলে। আল-মায়িদা (৫:৪৮) এই মূলটি ব্যবহার করে কুরআনকে পূর্ববর্তী ধর্মগ্রন্থের রক্ষক হিসেবে বর্ণনা করতে।",
      fa: "سوره الحشر (۵۹:۲۳). همچنین البقره (۲:۲۵۷): «الله سرپرست مؤمنان است». ریشه نگهبانی در سرتاسر قرآن جاری است. المائده (۵:۴۸) از این ریشه برای توصیف قرآن به عنوان مهیمن بر کتاب‌های پیشین استفاده می‌کند.",
      fr: "Sourate Al-Hashr (59:23). Aussi Al-Baqarah (2:257) : 'Allah est le protecteur de ceux qui croient.' La racine de la protection traverse tout le Coran. Al-Ma'idah (5:48) utilise cette racine pour décrire le Coran comme gardien des écritures antérieures.",
    },
    hadith: {
      en: "\"Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. When you ask, ask Allah; when you seek help, seek it from Allah.\" — Tirmidhi (authenticated from Ibn Abbas)",
      ar: "\"احفظ الله يحفظك، احفظ الله تجده تجاهك، إذا سألت فاسأل الله، وإذا استعنت فاستعن بالله.\" — الترمذي (صحيح، من حديث ابن عباس)",
      bs: "\"Čuvaj Allaha i On će čuvati tebe. Čuvaj Allaha i naći ćeš Ga pred sobom. Kada tražiš, traži od Allaha; kada tražiš pomoć, traži je od Allaha.\" — Tirmizi (sahih, od Ibn Abbasa)",
      tr: "\"Allah'ı koru, O da seni korusun. Allah'ı gözet, O'nu önünde bulursun. Bir şey istediğinde Allah'tan iste; yardım istediğinde Allah'tan yardım iste.\" — Tirmizi (İbn Abbas'tan, sahih)",
      ur: "\"اللہ کی حفاظت کرو، وہ تمہاری حفاظت کرے گا۔ اللہ کا خیال رکھو، اسے اپنے سامنے پاؤ گے۔ جب مانگو تو اللہ سے مانگو؛ جب مدد چاہو تو اللہ سے چاہو۔\" — ترمذی (صحیح، ابن عباس سے)",
      id: "\"Jagalah Allah, niscaya Dia akan menjagamu. Jagalah Allah, niscaya kamu akan mendapati-Nya di hadapanmu. Jika kamu meminta, mintalah kepada Allah; jika kamu memohon pertolongan, mohonlah kepada Allah.\" — Tirmidzi (shahih, dari Ibn Abbas)",
      bn: "\"আল্লাহকে স্মরণ রাখো, তিনি তোমাকে রক্ষা করবেন। আল্লাহকে মনে রাখো, তাঁকে তোমার সামনে পাবে। যখন চাইবে, আল্লাহর কাছে চাও; যখন সাহায্য চাইবে, আল্লাহর কাছে চাও।\" — তিরমিযী (সহীহ, ইবন আব্বাস থেকে)",
      fa: "«الله را حفظ کن، او تو را حفظ خواهد کرد. الله را نگه دار، او را پیش رویت خواهی یافت. هرگاه درخواست کردی از الله درخواست کن؛ هرگاه یاری خواستی از الله یاری بخواه.» — ترمذی (صحیح، از ابن عباس)",
      fr: "«Préserve Allah et Il te préservera. Préserve Allah et tu Le trouveras devant toi. Quand tu demandes, demande à Allah; quand tu cherches de l'aide, cherche-la auprès d'Allah.» — Tirmidhi (authentifié, d'Ibn Abbas)",
    },
  },

  // ── Fix A: Quran 40:19 was in hadith field ────────────────────────────────
  19: {
    hadith: {
      en: "\"O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.\" — Ibn Majah (authenticated). The Prophet ﷺ recited this every morning, turning to Al-Aleem for knowledge that truly benefits.",
      ar: "\"اللهم إني أسألك علما نافعا، ورزقا طيبا، وعملا متقبلا.\" — ابن ماجه (صحيح). كان النبي ﷺ يدعو بهذا كل صباح، متوجهاً إلى العليم بالعلم النافع.",
      bs: "\"O Allah, molim Te za korisno znanje, dobru opskrbu i prihvaćena djela.\" — Ibn Madža (sahih). Vjerovjesnik ﷺ je svako jutro ovako molio, obraćajući se Al-Alemu za znanje koje zaista koristi.",
      tr: "\"Allah'ım! Senden faydalı ilim, helal rızık ve makbul amel istiyorum.\" — İbn Mace (sahih). Peygamber ﷺ her sabah gerçekten faydalı bilgi için El-Alim'e yönelerek bu duayı okurdu.",
      ur: "\"اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول عمل مانگتا ہوں۔\" — ابن ماجہ (صحیح)۔ نبی ﷺ ہر صبح العلیم سے نفع بخش علم کے لیے یہ دعا پڑھتے تھے۔",
      id: "\"Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.\" — Ibn Majah (shahih). Nabi ﷺ membaca doa ini setiap pagi, mengarahkan diri kepada Al-Aleem untuk ilmu yang benar-benar bermanfaat.",
      bn: "\"হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র জীবিকা এবং কবুল আমল চাই।\" — ইবন মাজাহ (সহীহ)। নবী ﷺ প্রতিদিন সকালে আল-আলীমের কাছে সত্যিকার উপকারী জ্ঞানের জন্য এই দোয়া পড়তেন।",
      fa: "«یا الله، از تو علم سودمند، روزی پاک و عمل مقبول می‌خواهم.» — ابن ماجه (صحیح). پیامبر ﷺ هر صبح این دعا را می‌خواند و برای دانشی که واقعاً سودمند است به العلیم روی می‌آورد.",
      fr: "«Ô Allah, je Te demande une connaissance utile, une bonne subsistance et des œuvres acceptées.» — Ibn Majah (authentifié). Le Prophète ﷺ récitait cette invocation chaque matin, se tournant vers Al-Aleem pour un savoir vraiment bénéfique.",
    },
  },

  // ── Fix A: Quran 63:8 was in hadith field ─────────────────────────────────
  24: {
    hadith: {
      en: "\"Whoever humbles himself for the sake of Allah, Allah will raise him — so that he considers himself small while people consider him great.\" — Ibn Majah (authenticated). True honor from Al-Mu'izz comes through humility.",
      ar: "\"من تواضع لله رفعه الله، حتى يضعه في أعلى عليين، وما يرى نفسه إلا صغيراً.\" — ابن ماجه (صحيح). الشرف الحقيقي من المعزّ يأتي بالتواضع.",
      bs: "\"Ko se ponizi radi Allaha, Allah će ga uzdignuti — tako da sebe smatra malim dok ga ljudi smatraju velikim.\" — Ibn Madža (sahih). Istinska čast od Al-Mu'izza dolazi kroz poniznost.",
      tr: "\"Kim Allah için alçakgönüllü olursa, Allah onu yüceltir — öyle ki kendini küçük görürken insanlar onu büyük görür.\" — İbn Mace (sahih). Al-Mu'izz'den gerçek onur tevazu yoluyla gelir.",
      ur: "\"جو اللہ کے لیے عاجزی اختیار کرے، اللہ اسے بلند کرتا ہے — یہاں تک کہ وہ خود کو چھوٹا سمجھے مگر لوگ اسے بڑا سمجھیں۔\" — ابن ماجہ (صحیح)۔ المعزّ سے حقیقی عزت عاجزی سے ملتی ہے۔",
      id: "\"Barang siapa merendahkan diri karena Allah, Allah akan meninggikannya — sehingga ia menganggap dirinya kecil sementara orang-orang menganggapnya besar.\" — Ibn Majah (shahih). Kehormatan sejati dari Al-Mu'izz datang melalui kerendahan hati.",
      bn: "\"যে ব্যক্তি আল্লাহর জন্য বিনয়ী হয়, আল্লাহ তাকে উঁচু করেন — এমনকি সে নিজেকে ছোট মনে করে অথচ মানুষ তাকে বড় মনে করে।\" — ইবন মাজাহ (সহীহ)। আল-মু'ইজ্জ থেকে সত্যিকার সম্মান বিনয়ের মাধ্যমে আসে।",
      fa: "«هر که برای الله فروتنی کند، الله او را رفعت می‌دهد — چنان که خود را کوچک می‌بیند در حالی که مردم او را بزرگ می‌پندارند.» — ابن ماجه (صحیح). شرف واقعی از المعزّ از راه فروتنی می‌آید.",
      fr: "«Quiconque s'humilie pour Allah, Allah l'élèvera — au point qu'il se considère petit alors que les gens le considèrent grand.» — Ibn Majah (authentifié). Le vrai honneur d'Al-Mu'izz vient par l'humilité.",
    },
  },

  // ── Fix A: Quran 4:40 was in hadith field ─────────────────────────────────
  29: {
    hadith: {
      en: "\"Beware of injustice, for injustice will be darkness upon darkness on the Day of Resurrection.\" — Muslim (from Jabir ibn Abdullah). Al-Adl guarantees that every injustice is accounted for.",
      ar: "\"اتقوا الظلم؛ فإن الظلم ظلمات يوم القيامة.\" — مسلم (عن جابر بن عبدالله). العدل يضمن أن كل ظلم محاسب عليه.",
      bs: "\"Čuvajte se nepravde, jer nepravda će biti tama nad tamom na Dan Sudnjeg suda.\" — Muslim (od Džabira ibn Abdullaha). Al-Adl garantira da će svaka nepravda biti obračunata.",
      tr: "\"Zulümden sakının; zira zulüm, kıyamet gününde katmerli karanlık olacaktır.\" — Müslim (Cabir b. Abdullah'tan). El-Adl, her zulmün hesaba çekileceğini garanti eder.",
      ur: "\"ظلم سے بچو، کیونکہ ظلم قیامت کے دن اندھیرا بن کر آئے گا۔\" — مسلم (جابر بن عبداللہ سے)۔ العدل ضمانت دیتا ہے کہ ہر ظلم کا حساب ہوگا۔",
      id: "\"Waspadalah terhadap kezaliman, karena kezaliman akan menjadi kegelapan berlapis-lapis pada Hari Kebangkitan.\" — Muslim (dari Jabir ibn Abdullah). Al-Adl menjamin bahwa setiap ketidakadilan diperhitungkan.",
      bn: "\"অত্যাচার থেকে সাবধান থাকো, কারণ পুনরুত্থান দিবসে অত্যাচার অন্ধকারের উপর অন্ধকার হয়ে আসবে।\" — মুসলিম (জাবির ইবন আবদুল্লাহ থেকে)। আল-আদল নিশ্চিত করেন যে প্রতিটি অন্যায়ের হিসাব নেওয়া হবে।",
      fa: "«از ستم بپرهیزید؛ زیرا ستم در روز رستاخیز تاریکی روی تاریکی خواهد بود.» — مسلم (از جابر بن عبدالله). العدل تضمین می‌کند که هر بی‌عدالتی حساب‌رسی می‌شود.",
      fr: "«Méfiez-vous de l'injustice, car l'injustice sera ténèbre sur ténèbre au Jour de la Résurrection.» — Muslim (de Jabir ibn Abdullah). Al-Adl garantit que chaque injustice est comptabilisée.",
    },
  },

  // ── Fix A: Quran 40:19 again (duplicate) in hadith ────────────────────────
  31: {
    hadith: {
      en: "\"Surely Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.\" — Muslim (from Abu Hurayrah). Al-Khabir sees the inner reality — what matters to Him is invisible to people.",
      ar: "\"إن الله لا ينظر إلى صوركم وأموالكم، ولكن ينظر إلى قلوبكم وأعمالكم.\" — مسلم (عن أبي هريرة). الخبير يرى الحقيقة الداخلية — ما يهمه غير مرئي للناس.",
      bs: "\"Doista, Allah ne gleda u vaše izglede ili bogatstvo, nego gleda u vaša srca i vaša djela.\" — Muslim (od Ebu Hurejre). Al-Khabir vidi unutarnju stvarnost — ono što Mu je važno nevidljivo je ljudima.",
      tr: "\"Şüphesiz Allah, suretlerinize ve mallarınıza bakmaz; ancak kalplerinize ve amellerinize bakar.\" — Müslim (Ebu Hüreyre'den). El-Habir iç gerçeği görür — O'nun için önemli olan insanlara görünmez.",
      ur: "\"بے شک اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا، بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔\" — مسلم (ابو ہریرہ سے)۔ الخبیر باطنی حقیقت دیکھتا ہے — جو اسے اہم لگتا ہے وہ لوگوں کو نظر نہیں آتا۔",
      id: "\"Sesungguhnya Allah tidak melihat pada rupa dan hartamu, tetapi Dia melihat pada hati dan amalmu.\" — Muslim (dari Abu Hurairah). Al-Khabir melihat realitas batin — apa yang penting bagi-Nya tidak terlihat oleh manusia.",
      bn: "\"নিশ্চয়ই আল্লাহ তোমাদের চেহারা বা সম্পদের দিকে তাকান না, বরং তোমাদের হৃদয় এবং কাজের দিকে তাকান।\" — মুসলিম (আবু হুরায়রা থেকে)। আল-খাবীর অভ্যন্তরীণ সত্য দেখেন — তাঁর কাছে যা গুরুত্বপূর্ণ তা মানুষের কাছে অদৃশ্য।",
      fa: "«بی‌گمان الله به ظاهر و مال شما نمی‌نگرد، بلکه به دل‌ها و اعمال شما می‌نگرد.» — مسلم (از ابوهریره). الخبیر واقعیت درونی را می‌بیند — آنچه برای او اهمیت دارد از دیدگان مردم پنهان است.",
      fr: "«Certes, Allah ne regarde pas vos formes ou vos richesses, mais Il regarde vos cœurs et vos actes.» — Muslim (d'Abu Hurayrah). Al-Khabir voit la réalité intérieure — ce qui compte pour Lui est invisible aux gens.",
    },
  },

  // ── Fix A: Quran 16:61 was in hadith field ────────────────────────────────
  32: {
    hadith: {
      en: "\"Allah extends His hand at night to accept the repentance of the sinner by day, and extends His hand by day to accept the repentance of the sinner by night — until the sun rises from the west.\" — Muslim. Al-Haleem's patience in accepting repentance has no limit.",
      ar: "\"إن الله عز وجل يبسط يده بالليل ليتوب مسيء النهار، ويبسط يده بالنهار ليتوب مسيء الليل، حتى تطلع الشمس من مغربها.\" — مسلم. صبر الحليم على قبول التوبة لا حد له.",
      bs: "\"Allah pruža Svoju ruku noću da prihvati pokajanje onoga koji je griješio danju, i pruža Svoju ruku danju da prihvati pokajanje onoga koji je griješio noću — dok sunce ne izađe sa zapada.\" — Muslim.",
      tr: "\"Allah, gündüz günah işleyenin tövbesini kabul etmek için gece elini uzatır; gece günah işleyenin tövbesini kabul etmek için ise gündüz elini uzatır. Bu güneş batıdan doğana kadar böyle devam eder.\" — Müslim.",
      ur: "\"اللہ رات کو اپنا ہاتھ پھیلاتا ہے تاکہ دن کے گناہگار کی توبہ قبول کرے، اور دن کو اپنا ہاتھ پھیلاتا ہے تاکہ رات کے گناہگار کی توبہ قبول کرے — یہاں تک کہ سورج مغرب سے طلوع ہو۔\" — مسلم۔",
      id: "\"Allah membentangkan tangan-Nya di malam hari untuk menerima taubat orang yang berbuat dosa di siang hari, dan membentangkan tangan-Nya di siang hari untuk menerima taubat orang yang berbuat dosa di malam hari — hingga matahari terbit dari barat.\" — Muslim.",
      bn: "\"আল্লাহ রাতে তাঁর হাত প্রসারিত করেন দিনের পাপীর তওবা কবুল করতে, এবং দিনে হাত প্রসারিত করেন রাতের পাপীর তওবা কবুল করতে — পশ্চিম দিক থেকে সূর্যোদয় না হওয়া পর্যন্ত।\" — মুসলিম।",
      fa: "«الله شب دستش را دراز می‌کند تا توبه گناهکار روز را بپذیرد، و روز دستش را دراز می‌کند تا توبه گناهکار شب را بپذیرد — تا آنگاه که خورشید از مغرب طلوع کند.» — مسلم.",
      fr: "«Allah étend Sa main la nuit pour accepter le repentir de celui qui a péché le jour, et étend Sa main le jour pour accepter le repentir de celui qui a péché la nuit — jusqu'à ce que le soleil se lève de l'occident.» — Muslim.",
    },
  },

  // ── Fix C: Factual error — wrong name (Al-Dahr hadith for Al-Barr) ─────────
  79: {
    hadith: {
      en: "\"When you ask, ask Allah; when you seek help, seek it from Allah. Know that if the whole world gathered to benefit you with something, it could only benefit you with something Allah had already decreed for you.\" — Tirmidhi (authenticated from Ibn Abbas). All good — al-birr — flows only from Him.",
      ar: "\"وإذا سألت فاسأل الله، وإذا استعنت فاستعن بالله، واعلم أن الأمة لو اجتمعت على أن ينفعوك بشيء لم ينفعوك إلا بشيء قد كتبه الله لك.\" — الترمذي (صحيح، من حديث ابن عباس). كل خير — البر — يأتي منه وحده.",
      bs: "\"Kada tražiš, traži od Allaha; kada tražiš pomoć, traži je od Allaha. Znaj da kada bi se cijeli svijet skupio da ti koristi nečim, mogao bi ti koristiti samo onim što je Allah već odredio za tebe.\" — Tirmizi (sahih, od Ibn Abbasa).",
      tr: "\"Bir şey istediğinde Allah'tan iste; yardım istediğinde Allah'tan yardım iste. Bil ki bütün dünya bir araya gelse sana bir şeyle fayda sağlamak için, ancak Allah'ın senin için yazdığı şeyle fayda sağlayabilir.\" — Tirmizi (İbn Abbas'tan, sahih).",
      ur: "\"جب مانگو تو اللہ سے مانگو؛ جب مدد چاہو تو اللہ سے چاہو۔ جان لو کہ اگر پوری دنیا تمہیں فائدہ پہنچانے پر اکٹھی ہو جائے تو صرف وہی پہنچا سکتی ہے جو اللہ نے تمہارے لیے لکھ دیا ہو۔\" — ترمذی (صحیح، ابن عباس سے)۔",
      id: "\"Ketika kamu meminta, mintalah kepada Allah; ketika kamu memohon pertolongan, mohonlah kepada Allah. Ketahuilah bahwa jika seluruh dunia berkumpul untuk memberimu manfaat dengan sesuatu, mereka hanya bisa memberimu manfaat dengan sesuatu yang telah Allah tetapkan untukmu.\" — Tirmidzi (shahih, dari Ibn Abbas).",
      bn: "\"যখন চাইবে, আল্লাহর কাছে চাও; যখন সাহায্য চাইবে, আল্লাহর কাছে চাও। জেনে রাখো, পুরো দুনিয়া যদি তোমার উপকার করতে একত্রিত হয়, তবে শুধু তাই করতে পারবে যা আল্লাহ তোমার জন্য লিখে রেখেছেন।\" — তিরমিযী (সহীহ, ইবন আব্বাস থেকে)।",
      fa: "«هرگاه درخواست کردی از الله درخواست کن؛ هرگاه یاری خواستی از الله یاری بخواه. بدان که اگر تمام دنیا جمع شوند تا به تو سودی برسانند، جز آنچه الله برایت مقدر کرده نمی‌توانند سودی برسانند.» — ترمذی (صحیح، از ابن عباس).",
      fr: "«Quand tu demandes, demande à Allah; quand tu cherches de l'aide, cherche-la auprès d'Allah. Sache que si le monde entier se rassemblait pour te bénéficier de quelque chose, il ne pourrait te bénéficier que de ce qu'Allah a déjà décrété pour toi.» — Tirmidhi (authentifié, d'Ibn Abbas).",
    },
  },

  // ── Fix B: Factual error — Al-Kabeer / Takbeer not a hadith ──────────────
  37: {
    hadith: {
      en: "\"The most beloved words to Allah are four: Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar. It does not matter with which one you begin.\" — Muslim (from Samura ibn Jundub). Allahu Akbar — Allah is greater — is the constant proclamation of Al-Kabeer's supremacy.",
      ar: "\"أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر. لا يضرك بأيهن بدأت.\" — مسلم (عن سمرة بن جندب). الله أكبر هو الإعلان الدائم لعظمة الكبير.",
      bs: "\"Najdraže riječi Allahu su četiri: Subhanallah, Alhamdulillah, La ilahe illallah, Allahu Ekber. Ne smeta kojom počneš.\" — Muslim (od Samure ibn Džunduba). Allahu Ekber je stalna proklamacija supremacije Al-Kabeera.",
      tr: "\"Allah'a en sevimli sözler dörttür: Sübhanallah, Elhamdülillah, La ilahe illallah, Allahu Ekber. Hangisiyle başladığının önemi yok.\" — Müslim (Semure b. Cündeb'den). Allahu Ekber — Allah her şeyden büyüktür — El-Kabir'in üstünlüğünün sürekli ilanıdır.",
      ur: "\"اللہ کو سب سے پسندیدہ چار کلمے ہیں: سبحان اللہ، الحمد للہ، لا الہ الا اللہ، اللہ اکبر۔ اس سے کوئی فرق نہیں کہ ان میں سے کس سے شروع کرو۔\" — مسلم (سمرہ بن جندب سے)۔ اللہ اکبر الکبیر کی عظمت کا مسلسل اعلان ہے۔",
      id: "\"Kata-kata yang paling dicintai Allah ada empat: Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar. Tidak masalah dengan yang mana kamu memulai.\" — Muslim (dari Samura ibn Jundub). Allahu Akbar adalah proklamasi terus-menerus tentang supremasi Al-Kabeer.",
      bn: "\"আল্লাহর কাছে সবচেয়ে প্রিয় চারটি কথা: সুবহানাল্লাহ, আলহামদুলিল্লাহ, লা ইলাহা ইল্লাল্লাহ, আল্লাহু আকবার। কোনটা দিয়ে শুরু করলে কিছু আসে যায় না।\" — মুসলিম (সামুরা ইবন জুনদুব থেকে)। আল্লাহু আকবার হলো আল-কাবীরের শ্রেষ্ঠত্বের ক্রমাগত ঘোষণা।",
      fa: "«محبوب‌ترین کلمات نزد الله چهار کلمه است: سبحان الله، الحمد لله، لا اله الا الله، الله اکبر. مهم نیست با کدام یک شروع کنی.» — مسلم (از سمره بن جندب). الله اکبر اعلام پیوسته برتری الکبیر است.",
      fr: "«Les paroles les plus aimées d'Allah sont au nombre de quatre : Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar. Peu importe laquelle tu commences.» — Muslim (de Samura ibn Jundub). Allahu Akbar est la proclamation constante de la suprématie d'Al-Kabeer.",
    },
  },

  // ── Fix A: Quran 35:2 was in hadith field ────────────────────────────────
  90: {
    hadith: {
      en: "\"If the whole of creation gathered together to harm you with something, they could only harm you with something Allah had already written against you. And if they gathered to benefit you, they could only benefit you with something Allah had already written for you.\" — Tirmidhi (Ibn Abbas). Al-Maani' alone holds the keys.",
      ar: "\"واعلم أن الأمة لو اجتمعت على أن يضروك بشيء لم يضروك إلا بشيء قد كتبه الله عليك، وإن اجتمعوا على أن ينفعوك بشيء لم ينفعوك إلا بشيء قد كتبه الله لك.\" — الترمذي (ابن عباس). المانع وحده يملك المفاتيح.",
      bs: "\"Ako bi se cijelo stvorenje skupilo da ti naudi nečim, moglo bi ti nauditi samo onim što je Allah već zapisao protiv tebe. I ako bi se skupili da ti koriste, mogli bi ti koristiti samo onim što je Allah za tebe zapisao.\" — Tirmizi (Ibn Abbas).",
      tr: "\"Tüm yaratıklar sana zarar vermek için bir araya gelse, ancak Allah'ın senin aleyhine yazdığı şeyle zarar verebilirler. Ve sana fayda sağlamak için bir araya gelseler, ancak Allah'ın senin için yazdığı şeyle fayda sağlayabilirler.\" — Tirmizi (İbn Abbas).",
      ur: "\"اگر تمام مخلوقات مل کر تمہیں نقصان پہنچانا چاہیں تو صرف وہی نقصان پہنچا سکتی ہیں جو اللہ نے تمہارے خلاف لکھ دیا ہو۔ اور اگر فائدہ پہنچانا چاہیں تو صرف وہی فائدہ پہنچا سکتی ہیں جو اللہ نے تمہارے لیے لکھ دیا ہو۔\" — ترمذی (ابن عباس)۔",
      id: "\"Jika seluruh makhluk berkumpul untuk membahayakanmu dengan sesuatu, mereka hanya bisa membahayakanmu dengan sesuatu yang telah Allah tetapkan atasmu. Dan jika mereka berkumpul untuk memberimu manfaat, mereka hanya bisa memberimu manfaat dengan sesuatu yang telah Allah tetapkan untukmu.\" — Tirmidzi (Ibn Abbas).",
      bn: "\"যদি সমস্ত সৃষ্টি একত্রিত হয়ে তোমার ক্ষতি করতে চায়, তবে শুধু তাই করতে পারবে যা আল্লাহ তোমার বিরুদ্ধে লিখে রেখেছেন। এবং যদি তোমার উপকার করতে চায়, তবে শুধু তাই করতে পারবে যা আল্লাহ তোমার জন্য লিখে রেখেছেন।\" — তিরমিযী (ইবন আব্বাস)।",
      fa: "«اگر تمام مخلوقات جمع شوند تا به تو آسیبی برسانند، جز آنچه الله بر تو مقدر کرده نمی‌توانند آسیب برسانند. و اگر جمع شوند تا سودی برسانند، جز آنچه الله برایت مقدر کرده نمی‌توانند سود برسانند.» — ترمذی (ابن عباس).",
      fr: "«Si toute la création se rassemblait pour te nuire avec quelque chose, elle ne pourrait te nuire qu'avec ce qu'Allah avait déjà écrit contre toi. Et si elle se rassemblait pour te bénéficier, elle ne pourrait te bénéficier qu'avec ce qu'Allah avait déjà écrit pour toi.» — Tirmidhi (Ibn Abbas).",
    },
  },

  // ── Fix C: Vague/unverifiable hadith ─────────────────────────────────────
  98: {
    hadith: {
      en: "\"Whoever fears Allah, Allah will make a way out for him and provide for him from where he does not expect.\" — Quran 65:2-3, citing the divine promise of Ar-Rasheed's guided path for the mindful believer. The Prophet ﷺ said: \"Taqwa — that is guidance.\" — Tirmidhi",
      ar: "\"وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ.\" — القرآن (٦٥:٢-٣). وقال النبي ﷺ: \"التقوى هي الهداية.\" — الترمذي",
      bs: "\"Ko se boji Allaha, Allah će mu naći izlaz i opskrbit će ga odakle se ne nada.\" — Kur'an 65:2-3. Vjerovjesnik ﷺ je rekao: 'Takvaluk — to je uputa.' — Tirmizi",
      tr: "\"Kim Allah'tan korkarsa, Allah ona bir çıkış yolu açar ve onu beklemediği yerden rızıklandırır.\" — Kur'an 65:2-3. Peygamber ﷺ buyurdu: 'Takva — işte o hidayettir.' — Tirmizi",
      ur: "\"جو اللہ سے ڈرے، اللہ اس کے لیے راستہ نکال دے گا اور اسے ایسی جگہ سے رزق دے گا جہاں سے اسے گمان بھی نہ ہو۔\" — قرآن (٦٥:٢-٣)۔ نبی ﷺ نے فرمایا: 'تقویٰ ہی ہدایت ہے۔' — ترمذی",
      id: "\"Barang siapa bertakwa kepada Allah, Dia akan membuat jalan keluar baginya dan memberinya rezeki dari arah yang tidak disangka-sangka.\" — Al-Qur'an 65:2-3. Nabi ﷺ bersabda: 'Taqwa — itulah petunjuk.' — Tirmidzi",
      bn: "\"যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য পথ বের করে দেবেন এবং তাকে এমন জায়গা থেকে রিযিক দেবেন যেখান থেকে সে আশাও করেনি।\" — কুরআন ৬৫:২-৩। নবী ﷺ বললেন: 'তাকওয়া — সেটাই হেদায়েত।' — তিরমিযী",
      fa: "«هر کس از الله پروا کند، الله برایش راه خروجی قرار می‌دهد و از جایی که گمان نمی‌برد روزی‌اش می‌دهد.» — قرآن (۶۵:۲-۳). پیامبر ﷺ فرمود: «تقوا — این است هدایت.» — ترمذی",
      fr: "«Quiconque craint Allah, Il lui ménagera une issue et le pourvoira de là où il ne s'y attend pas.» — Coran 65:2-3. Le Prophète ﷺ a dit : 'La piété — c'est la guidance.' — Tirmidhi",
    },
  },

};

// ── Apply fixes ────────────────────────────────────────────────────────────────
let totalFixed = 0;

for (const lang of LANGS) {
  const filePath = path.join(DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const [id, patch] of Object.entries(fixes)) {
    if (!data[id]) continue;
    for (const [field, translations] of Object.entries(patch)) {
      if (translations[lang] !== undefined) {
        data[id][field] = translations[lang];
        changed++;
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] ${changed} fields updated`);
  totalFixed += changed;
}

console.log(`\nTotal: ${totalFixed} fields fixed across ${LANGS.length} languages`);
console.log('Remaining issues (lower priority) documented in scripts/audit-report.md');
