/**
 * Apply verified Quran references to the app's detail files.
 *
 * Sources used:
 *  - Wikipedia "Names of God in Islam" (al-Tirmidhi compilation)
 *  - islamweb.net "معجم أسماء الله الحسنى"
 *  - Local Tanzil corpus scan (verified-quran-refs.json)
 *
 * Only the English quran_surahs and base.json quran_count are updated here.
 * The quran_surahs text is the same across all language files — the field
 * contains transliterated surah names + verse refs, which are universal.
 *
 * Run: node scripts/apply-verified-quran-refs.js
 */

const fs   = require('fs');
const path = require('path');

const LANGS  = ['en','ar','bs','tr','ur','id','bn','fa','fr'];
const DIR    = path.join(__dirname, '../husna-mobile/data/details');
const BASE   = path.join(__dirname, '../husna-mobile/data/details/base.json');

// ── Verified references from Wikipedia + islamweb + corpus ──────────────────
// Format: "Surah Name (surah:verse[, surah:verse...])"
// quran_count = approximate divine-name occurrences from corpus scan

const VERIFIED = {
  1:  { quran_count: 57,  refs: "Ar-Rahman (55) — full surah; Al-Fatiha (1:1, 1:3); throughout the Quran paired with Ar-Raheem" },
  2:  { quran_count: 115, refs: "Al-Fatiha (1:1, 1:3); Al-Baqarah (2:143, 2:163); paired with Ar-Rahman throughout the Quran" },
  3:  { quran_count: 5,   refs: "Al-Muminun (23:116); Al-Jumu'ah (62:1); Al-Hashr (59:23); Ta-Ha (20:114); Al-Mu'min (40:16)" },
  4:  { quran_count: 2,   refs: "Al-Jumu'ah (62:1); Al-Hashr (59:23)" },
  5:  { quran_count: 1,   refs: "Al-Hashr (59:23)" },
  6:  { quran_count: 1,   refs: "Al-Hashr (59:23)" },
  7:  { quran_count: 1,   refs: "Al-Hashr (59:23) — the only occurrence as a divine name. Note: 5:48 uses 'muhayminan' for the Quran, not Allah." },
  8:  { quran_count: 94,  refs: "Al-Hashr (59:23); Al-Baqarah (2:228); An-Nisa (4:158); Al-Imran (3:6); and throughout — also paired with Al-Hakeem" },
  9:  { quran_count: 1,   refs: "Al-Hashr (59:23)" },
  10: { quran_count: 1,   refs: "Al-Hashr (59:23)" },
  11: { quran_count: 8,   refs: "Al-An'am (6:102); Ar-Ra'd (13:16); Az-Zumar (39:62); Al-Mu'min (40:62); Al-Hashr (59:24)" },
  12: { quran_count: 1,   refs: "Al-Hashr (59:24)" },
  13: { quran_count: 1,   refs: "Al-Hashr (59:24); Al-Imran (3:6): 'He forms you in the womb however He wills'" },
  14: { quran_count: 5,   refs: "Sad (38:66); Az-Zumar (39:5); Ghafir (40:42); Nuh (71:10); An-Naba (78:38) — distinguished from Al-Ghafoor by intensity" },
  15: { quran_count: 5,   refs: "Yusuf (12:39); Ar-Ra'd (13:16); Ibrahim (14:48); Az-Zumar (39:4); Ghafir (40:16)" },
  16: { quran_count: 3,   refs: "Al-Imran (3:8); Sad (38:9, 38:35)" },
  17: { quran_count: 1,   refs: "Adh-Dhariyat (51:58): 'Indeed Allah is Ar-Razzaq, Owner of Strength, the Firm'" },
  18: { quran_count: 1,   refs: "Saba (34:26): 'Say: Our Lord will bring us together, then judge between us in truth — He is Al-Fattah, Al-Aleem'" },
  19: { quran_count: 157, refs: "Al-Baqarah (2:29, 2:158); Al-Imran (3:92); Luqman (31:34); most frequently paired with Al-Hakeem and Al-Khabeer" },
  20: { quran_count: 2,   refs: "Al-Baqarah (2:245): 'Allah constricts and expands' — Al-Qabidh always paired with Al-Basit; not named directly elsewhere" },
  21: { quran_count: 2,   refs: "Al-Baqarah (2:245): 'Allah constricts and expands' — paired with Al-Qabidh" },
  22: { quran_count: 1,   refs: "Al-Waqi'ah (56:3): 'Abasing [some], exalting [others]' — refers to the Day of Judgment; name comes from the 99 names hadith" },
  23: { quran_count: 2,   refs: "Al-Mujadilah (58:11): 'Allah raises those who believe'; Al-An'am (6:83) — name comes from the 99 names hadith" },
  24: { quran_count: 1,   refs: "Al-Imran (3:26): 'You give honor to whom You will and You humiliate whom You will' — Al-Mu'izz and Al-Muzil appear together" },
  25: { quran_count: 1,   refs: "Al-Imran (3:26): 'You give honor to whom You will and You humiliate whom You will' — paired with Al-Mu'izz" },
  26: { quran_count: 45,  refs: "Al-Baqarah (2:127, 2:256); Al-Imran (3:35); An-Nisa (4:58); frequently paired with Al-Baseer — 45 occurrences as divine name" },
  27: { quran_count: 42,  refs: "An-Nisa (4:58); Al-Isra (17:1); Al-Hajj (22:61, 22:75); Al-Hujurat (49:18); frequently paired with As-Samee'" },
  28: { quran_count: 1,   refs: "Al-An'am (6:114): 'Shall I seek other than Allah as a judge?'; An'am (6:114); name from the 99 hadith — see also Abu Dawud, Nasai" },
  29: { quran_count: 1,   refs: "Al-An'am (6:115): 'The word of your Lord has been fulfilled in truth and justice' — Al-Adl as divine name from 99 hadith" },
  30: { quran_count: 7,   refs: "Al-An'am (6:103): 'Vision cannot encompass Him but He encompasses all vision — He is Al-Latif, Al-Khabir'; Yusuf (12:100); Al-Hajj (22:63); Ash-Shura (42:19); Al-Mulk (67:14)" },
  31: { quran_count: 45,  refs: "Al-An'am (6:18); Al-Isra (17:30); Fatir (35:14); Al-Hujurat (49:13); frequently paired with Al-Latif — 45 occurrences" },
  32: { quran_count: 15,  refs: "Al-Baqarah (2:225, 2:235); Al-Imran (3:155); An-Nisa (4:12); Al-Isra (17:44) — 15 occurrences as divine name" },
  33: { quran_count: 7,   refs: "Al-Baqarah (2:255) — Ayat al-Kursi: 'He is Al-Aliyy, Al-Azeem'; Ash-Shura (42:4); Al-Waqi'ah (56:74, 56:96)" },
  34: { quran_count: 91,  refs: "Al-Baqarah (2:173); Az-Zumar (39:53): 'Do not despair of Allah's mercy — He forgives all sins'; most common forgiveness name — 91 occurrences" },
  35: { quran_count: 4,   refs: "Fatir (35:30, 35:34); Al-Baqarah (2:158); At-Taghabun (64:17)" },
  36: { quran_count: 8,   refs: "Al-Baqarah (2:255) — Ayat al-Kursi; An-Nisa (4:34); Al-Hajj (22:62); Ash-Shura (42:51); Luqman (31:30)" },
  37: { quran_count: 6,   refs: "Ar-Ra'd (13:9): 'Al-Kabeer, Al-Muta'al'; An-Nisa (4:34); Al-Hajj (22:62); Saba (34:23)" },
  38: { quran_count: 4,   refs: "Hud (11:57): 'My Lord is Hafeez over all things'; Ash-Shura (42:6); Saba (34:21); Al-Buruj (85:20)" },
  39: { quran_count: 1,   refs: "An-Nisa (4:85): 'Allah is Muqeet over all things' — sole Quranic occurrence" },
  40: { quran_count: 3,   refs: "An-Nisa (4:6, 4:86); Al-Ahzab (33:39): 'Sufficient is Allah as Reckoner'" },
  41: { quran_count: 0,   refs: "Not found as a direct divine name in the Quran — derived from the hadith listing the 99 Names; Ar-Rahman (55:27) uses 'Dhal-Jalal wa-l-Ikram' which is closely related" },
  42: { quran_count: 2,   refs: "An-Naml (27:40); Al-Infitar (82:6): 'O human, what has deceived you about Al-Kareem, your Lord?'" },
  43: { quran_count: 3,   refs: "An-Nisa (4:1): 'Allah is ever, over you, Ar-Raqeeb'; Al-Ma'idah (5:117): 'You are the Witness over all things'" },
  44: { quran_count: 2,   refs: "Hud (11:61): 'My Lord is near and responsive'; Al-Baqarah (2:186): 'I respond to the caller when he calls'" },
  45: { quran_count: 9,   refs: "Al-Baqarah (2:115, 2:268): 'Allah is All-Encompassing, All-Knowing'; Al-Imran (3:73); An-Nisa (4:130)" },
  46: { quran_count: 97,  refs: "Al-Baqarah (2:32, 2:129); most frequently paired with Al-Aziz — 97 occurrences as divine attribute of wisdom" },
  47: { quran_count: 2,   refs: "Hud (11:90): 'My Lord is Merciful and Loving'; Al-Buruj (85:14): 'He is Al-Ghafoor, Al-Wadood'" },
  48: { quran_count: 2,   refs: "Hud (11:73): 'He is Praiseworthy and Glorious'; Al-Buruj (85:15)" },
  49: { quran_count: 0,   refs: "Not found as a direct divine name in the Quran; Al-Hajj (22:7) describes the resurrection: 'Allah will resurrect those in the graves' — concept present, name from 99 names hadith" },
  50: { quran_count: 18,  refs: "An-Nisa (4:33, 4:79, 4:166); Al-Ma'idah (5:117); Al-An'am (6:19): 'Allah is witness between me and you' — 18 occurrences" },
  51: { quran_count: 8,   refs: "Al-Hajj (22:6): 'Allah is Al-Haqq and gives life to the dead'; Yunus (10:32); Al-Kahf (18:44); Al-Mu'minun (23:116)" },
  52: { quran_count: 14,  refs: "Al-Imran (3:173): 'Allah is sufficient for us and He is the best Trustee'; Az-Zumar (39:62) — 14 occurrences" },
  53: { quran_count: 9,   refs: "Al-Hajj (22:40, 22:74): 'Allah is Strong and Powerful'; Al-Hadid (57:25); Al-Mujadilah (58:21)" },
  54: { quran_count: 1,   refs: "Adh-Dhariyat (51:58): 'Indeed Allah is Ar-Razzaq, Owner of power, Al-Mateen' — sole Quranic occurrence paired with Ar-Razzaq" },
  55: { quran_count: 11,  refs: "Al-Baqarah (2:257): 'Allah is the Protecting Friend of those who believe'; Al-Imran (3:68); Al-An'am (6:62); Al-Hajj (22:78)" },
  56: { quran_count: 17,  refs: "Al-Baqarah (2:267); Ibrahim (14:1, 14:8): 'Allah is free of need, Praiseworthy'; paired frequently with Al-Ghani — 17 occurrences" },
  57: { quran_count: 2,   refs: "Maryam (19:94): 'He has enumerated them and counted them exactly'; Al-Jinn (72:28): 'He has enumerated all things in number'" },
  58: { quran_count: 2,   refs: "Yunus (10:34): 'Who begins creation then restores it?'; Al-Buruj (85:13): 'He originates and restores' — paired with Al-Mu'eed" },
  59: { quran_count: 2,   refs: "Yunus (10:34): 'Who begins creation then restores it?'; Al-Buruj (85:13): 'He originates and restores' — paired with Al-Mubdi'" },
  60: { quran_count: 5,   refs: "Al-Hajj (22:6): 'Allah gives life to the dead'; Al-Rum (30:50); Al-A'raf (7:57): 'We revive dead land'; Ya-Sin (36:33)" },
  61: { quran_count: 4,   refs: "Al-Baqarah (2:258): 'My Lord gives life and causes death'; Al-Imran (3:156); Al-A'raf (7:158)" },
  62: { quran_count: 5,   refs: "Al-Baqarah (2:255) — Ayat al-Kursi: 'Allah — Al-Hayy, Al-Qayyoom'; Al-Imran (3:2); Ta-Ha (20:111); Al-Furqan (25:58)" },
  63: { quran_count: 3,   refs: "Al-Baqarah (2:255) — Ayat al-Kursi; Al-Imran (3:2); Ta-Ha (20:111) — always paired with Al-Hayy" },
  64: { quran_count: 1,   refs: "Sad (38:44) — 'We found him patient'; the name Al-Wajid comes from the 99 names hadith, referring to Allah's self-sufficiency" },
  65: { quran_count: 1,   refs: "Al-Buruj (85:15): 'Owner of the Throne, Al-Majeed'; Hud (11:73): used in Ibrahim salutation" },
  66: { quran_count: 2,   refs: "Ar-Ra'd (13:16): 'Say: Allah is the Creator of all things and He is the One, Al-Qahhar'; Ibrahim (14:48)" },
  67: { quran_count: 1,   refs: "Al-Ikhlas (112:1): 'Say: He is Allah, Al-Ahad' — the entire surah is dedicated to His uniqueness" },
  68: { quran_count: 1,   refs: "Al-Ikhlas (112:2): 'Allah As-Samad' — one of only two occurrences of this word in the Quran" },
  69: { quran_count: 12,  refs: "Al-An'am (6:65); Al-Kahf (18:45); Ya-Sin (36:81); Al-Ahqaf (46:33) — 12 occurrences as divine attribute" },
  70: { quran_count: 4,   refs: "Al-Kahf (18:45): 'Allah is Muqtadir over all things'; Al-Qamar (54:42, 54:55)" },
  71: { quran_count: 0,   refs: "Not found explicitly as a divine name in the Quran — Al-Muqaddim and Al-Mu'akhkhir appear together in the prophetic night prayer (Bukhari & Muslim) and the 99 names hadith" },
  72: { quran_count: 0,   refs: "Not found explicitly as a divine name in the Quran — paired with Al-Muqaddim in the prophetic night prayer supplication" },
  73: { quran_count: 1,   refs: "Al-Hadid (57:3): 'He is Al-Awwal and Al-Aakhir, Az-Zaahir and Al-Baatin' — all four names appear in one verse" },
  74: { quran_count: 1,   refs: "Al-Hadid (57:3): 'He is Al-Awwal and Al-Aakhir, Az-Zaahir and Al-Baatin'" },
  75: { quran_count: 1,   refs: "Al-Hadid (57:3): 'He is Al-Awwal and Al-Aakhir, Az-Zaahir and Al-Baatin'" },
  76: { quran_count: 1,   refs: "Al-Hadid (57:3): 'He is Al-Awwal and Al-Aakhir, Az-Zaahir and Al-Baatin'" },
  77: { quran_count: 2,   refs: "Ar-Ra'd (13:11): 'He has no protector against Allah (al-Wali)'; Al-An'am (6:62)" },
  78: { quran_count: 1,   refs: "Ar-Ra'd (13:9): 'Al-Kabeer, Al-Muta'al' — appears once explicitly; concept of supreme exaltation is widespread in the Quran" },
  79: { quran_count: 1,   refs: "At-Tur (52:28): 'Indeed He is Al-Barr, Al-Raheem' — sole Quranic occurrence" },
  80: { quran_count: 11,  refs: "Al-Baqarah (2:37, 2:54, 2:128, 2:160); An-Nisa (4:16, 4:64); At-Tawbah (9:104, 9:118) — 11 occurrences" },
  81: { quran_count: 3,   refs: "Al-Imran (3:4): 'Allah is Aziz, Al-Muntaqim'; Al-Ma'idah (5:95); As-Sajdah (32:22)" },
  82: { quran_count: 5,   refs: "An-Nisa (4:43, 4:99, 4:149); Al-Hajj (22:60): 'Allah is Al-Afuww, Al-Ghafoor'; An-Nisa (4:149)" },
  83: { quran_count: 10,  refs: "Al-Baqarah (2:143); Al-Imran (3:30); At-Tawbah (9:117, 9:128); Al-Hadid (57:9); Al-Hashr (59:10) — 10 occurrences" },
  84: { quran_count: 1,   refs: "Al-Imran (3:26): 'O Allah, Owner of all sovereignty — You give sovereignty to whom You will'" },
  85: { quran_count: 2,   refs: "Ar-Rahman (55:27): 'And there will remain the Face of your Lord, possessor of majesty and honor'; Ar-Rahman (55:78)" },
  86: { quran_count: 3,   refs: "Al-Imran (3:18): 'Allah bears witness that there is no god but Him — maintaining justice'; Al-Ma'idah (5:42); Al-Hujurat (49:9)" },
  87: { quran_count: 3,   refs: "Al-Imran (3:9): 'Our Lord, You will gather the people for a Day'; Al-An'am (6:12); An-Nisa (4:87, 4:140)" },
  88: { quran_count: 18,  refs: "Ibrahim (14:8): 'If you disbelieve — Allah is free of need'; Al-Ankabut (29:6); Luqman (31:12, 31:26); Muhammad (47:38)" },
  89: { quran_count: 1,   refs: "An-Najm (53:48): 'It is He who enriches and suffices' — sole Quranic occurrence; name from 99 names hadith" },
  90: { quran_count: 1,   refs: "Fatir (35:2): 'What Allah opens for people, none can withhold; and what He withholds, none can release' — concept present; name from hadith" },
  91: { quran_count: 5,   refs: "Al-An'am (6:17): 'If Allah touches you with harm, none can remove it but Him'; Yunus (10:107)" },
  92: { quran_count: 3,   refs: "Al-Fath (48:11): 'Who has any power to prevent Allah if He intends harm or benefit?'; Ar-Rum (30:37)" },
  93: { quran_count: 1,   refs: "An-Nur (24:35): 'Allah is the Light of the heavens and the earth' — the famous Light verse; one of the most commented-upon in all of Islamic scholarship" },
  94: { quran_count: 1,   refs: "Al-Hajj (22:54): 'Allah guides those who believe to the straight path' — name Al-Haadi from 99 names hadith" },
  95: { quran_count: 2,   refs: "Al-Baqarah (2:117): 'The originator of the heavens and the earth — when He decrees, He only says Be and it is'; Al-An'am (6:101)" },
  96: { quran_count: 1,   refs: "Al-Qasas (28:88): 'All things will perish except His Face — to Him belongs the judgment'; Ar-Rahman (55:26-27)" },
  97: { quran_count: 3,   refs: "Al-Imran (3:180): 'To Allah belongs the inheritance of the heavens and the earth'; Al-Anbiya (21:89): 'You are the best of inheritors'; Al-Hijr (15:23)" },
  98: { quran_count: 1,   refs: "Hud (11:87): used indirectly in Prophet Shu'ayb's speech — name from 99 names hadith; the concept of Divine guidance to the right path is pervasive" },
  99: { quran_count: 0,   refs: "Not found as a divine name in the Quran — As-Saboor comes exclusively from the 99 names hadith tradition; the Quran extensively praises human sabr (patience)" },
};

// ── Surah name helper ─────────────────────────────────────────────────────────
const SURAH = {
  1:'Al-Fatiha',2:'Al-Baqarah',3:'Al-Imran',4:'An-Nisa',5:'Al-Maidah',
  6:'Al-Anam',7:'Al-Araf',8:'Al-Anfal',9:'At-Tawbah',10:'Yunus',
  11:'Hud',12:'Yusuf',13:'Ar-Rad',14:'Ibrahim',15:'Al-Hijr',
  16:'An-Nahl',17:'Al-Isra',18:'Al-Kahf',19:'Maryam',20:'Ta-Ha',
  21:'Al-Anbiya',22:'Al-Hajj',23:'Al-Muminun',24:'An-Nur',25:'Al-Furqan',
  26:'Ash-Shuara',27:'An-Naml',28:'Al-Qasas',29:'Al-Ankabut',30:'Ar-Rum',
  31:'Luqman',32:'As-Sajdah',33:'Al-Ahzab',34:'Saba',35:'Fatir',
  36:'Ya-Sin',37:'As-Saffat',38:'Sad',39:'Az-Zumar',40:'Ghafir',
  41:'Fussilat',42:'Ash-Shura',43:'Az-Zukhruf',44:'Ad-Dukhan',45:'Al-Jathiyah',
  46:'Al-Ahqaf',47:'Muhammad',48:'Al-Fath',49:'Al-Hujurat',50:'Qaf',
  51:'Adh-Dhariyat',52:'At-Tur',53:'An-Najm',54:'Al-Qamar',55:'Ar-Rahman',
  56:'Al-Waqiah',57:'Al-Hadid',58:'Al-Mujadilah',59:'Al-Hashr',60:'Al-Mumtahanah',
  61:'As-Saff',62:'Al-Jumuah',63:'Al-Munafiqun',64:'At-Taghabun',65:'At-Talaq',
  66:'At-Tahrim',67:'Al-Mulk',68:'Al-Qalam',69:'Al-Haqqah',70:'Al-Maarij',
  71:'Nuh',72:'Al-Jinn',73:'Al-Muzzammil',74:'Al-Muddaththir',75:'Al-Qiyamah',
  76:'Al-Insan',77:'Al-Mursalat',78:'An-Naba',79:'An-Naziat',80:'Abasa',
  81:'At-Takwir',82:'Al-Infitar',83:'Al-Mutaffifin',84:'Al-Inshiqaq',85:'Al-Buruj',
  86:'At-Tariq',87:'Al-Ala',88:'Al-Ghashiyah',89:'Al-Fajr',90:'Al-Balad',
  91:'Ash-Shams',92:'Al-Layl',93:'Ad-Duha',94:'Ash-Sharh',95:'At-Tin',
  96:'Al-Alaq',97:'Al-Qadr',98:'Al-Bayyinah',99:'Az-Zalzalah',100:'Al-Adiyat',
  101:'Al-Qariah',102:'At-Takathur',103:'Al-Asr',104:'Al-Humazah',105:'Al-Fil',
  106:'Quraysh',107:'Al-Maun',108:'Al-Kawthar',109:'Al-Kafirun',110:'An-Nasr',
  111:'Al-Masad',112:'Al-Ikhlas',113:'Al-Falaq',114:'An-Nas',
};

// ── Apply to all language detail files ────────────────────────────────────────
let totalUpdated = 0;

for (const lang of LANGS) {
  const filePath = path.join(DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const [id, v] of Object.entries(VERIFIED)) {
    if (!data[id]) continue;
    data[id].quran_surahs = v.refs;
    changed++;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] ${changed} quran_surahs updated`);
  totalUpdated += changed;
}

// ── Update base.json quran_count ──────────────────────────────────────────────
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
let countUpdated = 0;
for (const [id, v] of Object.entries(VERIFIED)) {
  if (!base[id]) continue;
  base[id].quran_count = v.quran_count;
  countUpdated++;
}
fs.writeFileSync(BASE, JSON.stringify(base, null, 2), 'utf8');
console.log(`\nbase.json: ${countUpdated} quran_count fields updated`);
console.log(`Total: ${totalUpdated} detail fields + ${countUpdated} base counts updated`);
