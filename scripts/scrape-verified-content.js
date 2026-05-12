/**
 * Scrape verified Quran occurrences and hadith for each of the 99 Names.
 *
 * Sources:
 *   - quran.com API  → exact verse counts + surah references
 *   - sunnah.com API → hadiths that actually mention the name
 *
 * Output: scripts/scraped-content.json
 *
 * Usage:
 *   node scripts/scrape-verified-content.js
 *   node scripts/scrape-verified-content.js --start 1 --end 10   (test a range)
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

const args  = process.argv.slice(2);
const get   = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : null; };
const START = parseInt(get('--start') || '1');
const END   = parseInt(get('--end')   || '99');

const names = require('../husna-mobile/data/names.json');

// ── HTTP helper ──────────────────────────────────────────────────────────────
function fetchJSON(hostname, pathStr, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path: pathStr, method: 'GET', headers: { 'Accept': 'application/json', ...headers } };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Strip ال prefix for search ───────────────────────────────────────────────
function stripArticle(arabic) {
  // Remove ال or ٱل at the start, and all diacritics
  return arabic
    .replace(/^(ٱلْ?|الْ?|ال)/, '')
    .replace(/[ً-ٰٟ]/g, '');
}

function stripDiacritics(text) {
  return text.replace(/[ً-ٰٟ]/g, '').replace(/ٱ/g, 'ا');
}

// ── Quran.com search ─────────────────────────────────────────────────────────
async function searchQuran(arabicName) {
  const clean = encodeURIComponent(stripDiacritics(arabicName));
  const data  = await fetchJSON(
    'api.quran.com',
    `/api/v4/search?q=${clean}&language=en&size=50`,
    { 'Accept': 'application/json' }
  );

  if (!data || !data.search || !data.search.results) return { count: 0, verses: [] };

  const verses = data.search.results.map(r => ({
    surah: r.verse_key.split(':')[0],
    verse: r.verse_key,
    text:  r.text,
  }));

  return { count: verses.length, verses };
}

// ── sunnah.com search ────────────────────────────────────────────────────────
const SUNNAH_KEY = 'SqD712P3E82xnwOAEOkGd5JZH8s9wRNarFXzmpv5'; // public key

async function searchSunnah(transliteration, arabicName) {
  // Search by transliteration (more likely to match English hadith text)
  const baseName = transliteration.replace(/^(Al-|Ar-|As-|Ad-|An-|Az-|At-|Ash-)/i, '');
  const query    = encodeURIComponent(baseName);

  const data = await fetchJSON(
    'api.sunnah.com',
    `/v1/hadiths/search?q=${query}&limit=3`,
    { 'X-API-Key': SUNNAH_KEY }
  );

  if (!data || !data.data) return [];
  return data.data.map(h => ({
    collection: h.collection,
    bookNumber: h.bookNumber,
    hadithNumber: h.hadithNumber,
    text: h.hadith?.[0]?.body || '',
  }));
}

// ── Surah name lookup ────────────────────────────────────────────────────────
const surahNames = {};
async function loadSurahNames() {
  const data = await fetchJSON('api.quran.com', '/api/v4/chapters?language=en');
  if (data && data.chapters) {
    data.chapters.forEach(c => { surahNames[c.id] = c.name_simple; });
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('Loading surah names...');
  await loadSurahNames();

  const subset  = names.filter(n => n.id >= START && n.id <= END);
  const results = {};

  // Load existing results so we can resume
  const outPath = path.join(__dirname, 'scraped-content.json');
  if (fs.existsSync(outPath)) {
    Object.assign(results, JSON.parse(fs.readFileSync(outPath, 'utf8')));
    console.log(`Resuming — ${Object.keys(results).length} already done\n`);
  }

  for (const name of subset) {
    if (results[name.id]) {
      console.log(`  [skip] ${name.id} — ${name.transliteration}`);
      continue;
    }

    process.stdout.write(`  [${name.id}] ${name.transliteration} ... `);

    // 1. Quran search
    const quranResult  = await searchQuran(name.arabic);
    await sleep(300);

    // 2. Sunnah search
    const hadithResult = await searchSunnah(name.transliteration, name.arabic);
    await sleep(300);

    // 3. Format surah refs
    const surahGroups = {};
    quranResult.verses.forEach(v => {
      const sNum = parseInt(v.surah);
      const sName = surahNames[sNum] || `Surah ${sNum}`;
      if (!surahGroups[sNum]) surahGroups[sNum] = { name: sName, verses: [] };
      surahGroups[sNum].verses.push(v.verse);
    });

    const surahSummary = Object.entries(surahGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([num, s]) => `${s.name} (${s.verses.join(', ')})`)
      .join('; ');

    results[name.id] = {
      id:            name.id,
      arabic:        name.arabic,
      transliteration: name.transliteration,
      quran_count:   quranResult.count,
      quran_surahs:  surahSummary || 'Not found as a direct divine name in this form',
      quran_verses:  quranResult.verses,
      hadiths:       hadithResult,
    };

    const status = `count=${quranResult.count} hadiths=${hadithResult.length}`;
    console.log(status);

    // Save after each name so we can resume on interruption
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    await sleep(200);
  }

  console.log(`\nDone. Results saved to scripts/scraped-content.json`);
  console.log(`Next: review the file and run the apply script to update the data.`);
}

run().catch(console.error);
