/**
 * Generate Arabic audio for all 99 Names of Allah.
 * Uses Azure Cognitive Services TTS — ar-SA-HamedNeural voice.
 *
 * Usage:
 *   node scripts/generate-name-audio.js --key YOUR_KEY --region YOUR_REGION
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const KEY    = get('--key');
const REGION = get('--region');

if (!KEY || !REGION) {
  console.error('Usage: node generate-name-audio.js --key YOUR_AZURE_KEY --region YOUR_REGION');
  process.exit(1);
}

const VOICE = 'ar-SA-HamedNeural';
const names = require('../husna-mobile/data/names.json');
const outDir = path.join(__dirname, '../husna-mobile/assets/audio/names');
fs.mkdirSync(outDir, { recursive: true });

function stripDiacritics(text) {
  // Remove all Arabic diacritical marks (U+064B to U+065F) and superscript alef (U+0670)
  return text.replace(/[ً-ٰٟ]/g, '');
}

function buildSSML(text) {
  // Only replace wasla alef (ٱ → ا) — keep harakat so Azure pronounces with proper tajweed
  const clean = text.replace(/ٱ/g, 'ا');
  return `<speak version='1.0' xml:lang='ar-SA'><voice name='${VOICE}'><prosody rate='-10%'>${clean}</prosody></voice></speak>`;
}

function fetchAudio(text) {
  return new Promise((resolve, reject) => {
    const ssml = buildSSML(text);
    const options = {
      hostname: `${REGION}.tts.speech.microsoft.com`,
      path: '/cognitiveservices/v1',
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
        'User-Agent': 'HusnaApp',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`)));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(ssml);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log(`Voice: ${VOICE}  |  Region: ${REGION}\n`);
  let ok = 0, skipped = 0, failed = 0;

  for (const name of names) {
    const outPath = path.join(outDir, `${name.id}.mp3`);

    if (fs.existsSync(outPath)) {
      console.log(`  [skip] ${name.id} — ${name.transliteration}`);
      skipped++; continue;
    }

    try {
      const audio = await fetchAudio(name.arabic);
      fs.writeFileSync(outPath, audio);
      console.log(`  [ok]   ${name.id} — ${name.transliteration} (${(audio.length/1024).toFixed(0)}KB)`);
      ok++;
    } catch (err) {
      console.error(`  [fail] ${name.id} — ${name.transliteration}: ${err.message}`);
      failed++;
    }

    await sleep(150);
  }

  console.log(`\nDone. ${ok} generated, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) console.log('Re-run to retry failed ones.');
}

run();
