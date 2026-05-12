/**
 * Build verified Quran references for the 99 Names using the local
 * quran-simple.txt file (Tanzil corpus) + sunnah.com API for hadiths.
 *
 * Disambiguation: raw text search will include non-divine uses of words
 * like "العزيز". We flag those for manual review and apply context
 * heuristics to identify likely divine-name uses.
 *
 * Usage:
 *   node scripts/build-verified-content.js               # all 99
 *   node scripts/build-verified-content.js --id 7        # one name
 *   node scripts/build-verified-content.js --start 1 --end 10
 *
 * Output: scripts/verified-quran-refs.json
 */

const fs     = require('fs');
const path   = require('path');
const https  = require('https');

const args   = process.argv.slice(2);
const get    = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : null; };
const ID     = get('--id') ? parseInt(get('--id')) : null;
const START  = ID || parseInt(get('--start') || '1');
const END    = ID || parseInt(get('--end')   || '99');

const names   = require('../husna-mobile/data/names.json');
const outPath = path.join(__dirname, 'verified-quran-refs.json');
const results = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath)) : {};

// ── Load surah names ─────────────────────────────────────────────────────────
const SURAH_NAMES = {
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

// ── Load and parse Quran corpus ───────────────────────────────────────────────
console.log('Loading Quran corpus...');
const quranLines = fs.readFileSync(
  path.join(__dirname, '../quran-simple.txt'), 'utf8'
).split('\n').filter(l => l.trim() && !l.startsWith('#'));

const quranVerses = [];
for (const line of quranLines) {
  const parts = line.split('|');
  if (parts.length < 3) continue;
  quranVerses.push({
    surah: parseInt(parts[0]),
    verse: parseInt(parts[1]),
    text:  parts.slice(2).join('|'),
  });
}
console.log(`Loaded ${quranVerses.length} verses\n`);

// ── Text helpers ──────────────────────────────────────────────────────────────
function stripDiacritics(t) {
  return t
    .replace(/[ً-ٰٟ]/g, '')    // all harakat (U+064B–U+0670)
    .replace(/ـ/g, '')     // tatweel/kashida (ـ) — present in "رَحْمَـٰنِ"
    .replace(/ٱ/g, 'ا')        // wasla alef → regular alef
    .replace(/أ|إ|آ/g, 'ا')   // alef variants → regular alef
    .replace(/ى/g, 'ي')        // alef maqsura → ya
    .replace(/ة/g, 'ه');       // ta marbuta → ha
}

// Known "non-divine" contexts: when a name is used for a human/non-Allah entity
// These are surah:verse pairs known to use the word in a non-divine sense
const NON_DIVINE_VERSES = new Set([
  '12:30',  // Al-Aziz (Yusuf's minister's wife context)
  '12:51',  // Al-Aziz (Yusuf's minister)
  '12:78',  // Al-Aziz (Yusuf addressed as minister)
  '12:88',  // Al-Aziz
  '12:41',  // Al-Aziz in prison context
]);

// Context clues that suggest divine name use
function isDivineName(verse, searchWord) {
  const clean = stripDiacritics(verse.text);
  // Verse contains "الله" near the name — likely divine
  if (clean.includes('الله')) return 'likely';
  // Verse contains "هو" + the name at start of sentence
  if (clean.includes('هو' + searchWord)) return 'likely';
  // Verse contains other known divine names alongside it
  const divineMarkers = ['الرحمن','الرحيم','الملك','العليم','الحكيم','الخبير','القدير'];
  if (divineMarkers.some(m => clean.includes(m))) return 'likely';
  // Check non-divine list
  if (NON_DIVINE_VERSES.has(`${verse.surah}:${verse.verse}`)) return 'non-divine';
  return 'uncertain';
}

// ── Search Quran for a name ───────────────────────────────────────────────────
function searchQuran(name) {
  const searchBase = stripDiacritics(
    name.arabic
      .replace(/^(ٱلْ?|الْ?|ال)/, '') // strip the article
  );
  const searchFull = stripDiacritics(name.arabic);

  const matches = [];
  for (const verse of quranVerses) {
    const clean = stripDiacritics(verse.text);
    if (!clean.includes(searchBase) && !clean.includes(searchFull)) continue;

    const key = `${verse.surah}:${verse.verse}`;
    const surahName = SURAH_NAMES[verse.surah] || `Surah ${verse.surah}`;
    const divinity  = isDivineName(verse, searchBase);

    matches.push({
      ref: key,
      surahName,
      surahNum: verse.surah,
      verseNum: verse.verse,
      divinity,
      text: verse.text.substring(0, 80) + '…',
    });
  }
  return matches;
}

// ── Format quran_surahs string ────────────────────────────────────────────────
function formatSurahString(matches) {
  // Group by surah, only include 'likely' divine uses
  const divine = matches.filter(m => m.divinity === 'likely');
  const uncertain = matches.filter(m => m.divinity === 'uncertain');
  const all = divine.length > 0 ? divine : uncertain;

  const grouped = {};
  for (const m of all) {
    if (!grouped[m.surahName]) grouped[m.surahName] = [];
    grouped[m.surahName].push(m.ref);
  }

  return Object.entries(grouped)
    .map(([s, refs]) => `${s} (${refs.join(', ')})`)
    .join('; ');
}

// ── sunnah.com hadith search ──────────────────────────────────────────────────
const SUNNAH_KEY = 'SqD712P3E82xnwOAEOkGd5JZH8s9wRNarFXzmpv5';

function searchSunnah(transliteration) {
  const base = transliteration.replace(/^(Al-|Ar-|As-|Ad-|An-|Az-|At-|Ash-)/i, '');
  const q = encodeURIComponent(base);
  return new Promise(resolve => {
    const req = https.request({
      hostname: 'api.sunnah.com',
      path: `/v1/hadiths/search?q=${q}&limit=5`,
      method: 'GET',
      headers: { 'X-API-Key': SUNNAH_KEY, 'Accept': 'application/json' },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve((data.data || []).map(h => ({
            collection: h.collection,
            number: h.hadithNumber,
            text: (h.hadith?.[0]?.body || '').substring(0, 200),
          })));
        } catch { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const subset = names.filter(n => n.id >= START && n.id <= END);

  for (const name of subset) {
    if (results[name.id] && !ID) {
      console.log(`  [skip] ${name.id} — ${name.transliteration}`);
      continue;
    }

    process.stdout.write(`  [${name.id}] ${name.transliteration} ... `);

    const quranMatches = searchQuran(name);
    const hadiths      = await searchSunnah(name.transliteration);
    await sleep(300);

    const divineCount  = quranMatches.filter(m => m.divinity === 'likely').length;
    const totalCount   = quranMatches.length;

    results[name.id] = {
      id:            name.id,
      transliteration: name.transliteration,
      arabic:        name.arabic,
      quran_count_raw:    totalCount,
      quran_count_divine: divineCount,
      quran_surahs_suggested: formatSurahString(quranMatches),
      quran_matches:  quranMatches,
      hadiths_found:  hadiths,
      needs_review:   quranMatches.some(m => m.divinity === 'uncertain') || quranMatches.some(m => m.divinity === 'non-divine'),
    };

    console.log(`verses=${totalCount} (divine≈${divineCount}) hadiths=${hadiths.length}` +
      (results[name.id].needs_review ? ' ⚠ REVIEW' : ''));

    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  }

  // ── Summary report ────────────────────────────────────────────────────────
  const reviewNeeded = Object.values(results).filter(r => r.needs_review);
  console.log(`\n✓ Done. ${Object.keys(results).length} names processed.`);
  console.log(`⚠ ${reviewNeeded.length} names need manual disambiguation review.`);
  console.log(`\nResults: scripts/verified-quran-refs.json`);
  console.log(`Next: run apply-verified-content.js to update the app data.`);
}

run().catch(console.error);
