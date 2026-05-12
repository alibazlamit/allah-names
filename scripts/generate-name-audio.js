/**
 * Generate Arabic audio for all 99 Names of Allah.
 * Uses Google Translate TTS — no account, no API key needed.
 *
 * Usage:
 *   node scripts/generate-name-audio.js
 *
 * Output:
 *   husna-mobile/assets/audio/names/1.mp3 ... 99.mp3
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const names = require('../husna-mobile/data/names.json');
const outDir = path.join(__dirname, '../husna-mobile/assets/audio/names');
fs.mkdirSync(outDir, { recursive: true });

function fetchAudio(text) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=gtx&ttsspeed=0.5`;

    const options = {
      hostname: 'translate.google.com',
      path: `/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=gtx&ttsspeed=0.5`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': '*/*',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // follow redirect
        const location = res.headers.location;
        https.get(location, { headers: options.headers }, (r) => {
          const chunks = [];
          r.on('data', c => chunks.push(c));
          r.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log(`Generating ${names.length} audio files → ${outDir}\n`);

  let ok = 0, skipped = 0, failed = 0;

  for (const name of names) {
    const outPath = path.join(outDir, `${name.id}.mp3`);

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`  [skip] ${name.id} — ${name.transliteration}`);
      skipped++;
      continue;
    }

    try {
      const audio = await fetchAudio(name.arabic);
      if (audio.length < 1000) throw new Error('Response too small — likely an error page');
      fs.writeFileSync(outPath, audio);
      console.log(`  [ok]   ${name.id} — ${name.transliteration}`);
      ok++;
    } catch (err) {
      console.error(`  [fail] ${name.id} — ${name.transliteration}: ${err.message}`);
      failed++;
    }

    // Pause between requests to avoid rate limiting
    await sleep(300);
  }

  console.log(`\nDone. ${ok} generated, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) {
    console.log('Re-run the script to retry failed ones — it skips already-saved files.');
  }
}

run();
