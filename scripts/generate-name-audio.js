/**
 * Generate Arabic audio for all 99 Names of Allah using Azure TTS (free F0 tier).
 *
 * Setup (one time):
 *   1. Go to https://portal.azure.com
 *   2. Create a resource → search "Speech" → select "Speech" by Microsoft
 *   3. Pricing tier: Free F0  (no credit card required)
 *   4. After creation: go to resource → Keys and Endpoint
 *   5. Copy KEY 1 and the Region (e.g. "eastus")
 *
 * Usage:
 *   node scripts/generate-name-audio.js --key YOUR_KEY --region YOUR_REGION
 *
 * Output:
 *   husna-mobile/assets/audio/names/1.mp3 ... 99.mp3
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const keyIdx = args.indexOf('--key');
const regionIdx = args.indexOf('--region');

if (keyIdx === -1 || regionIdx === -1) {
  console.error('Usage: node generate-name-audio.js --key YOUR_AZURE_KEY --region YOUR_REGION');
  console.error('Example regions: eastus, westeurope, southeastasia');
  process.exit(1);
}

const AZURE_KEY = args[keyIdx + 1];
const AZURE_REGION = args[regionIdx + 1];
const VOICE = 'ar-SA-HamedNeural'; // male — or 'ar-SA-ZariyahNeural' for female

const names = require('../husna-mobile/data/names.json');

const outDir = path.join(__dirname, '../husna-mobile/assets/audio/names');
fs.mkdirSync(outDir, { recursive: true });

function buildSSML(arabicText) {
  return `<speak version='1.0' xml:lang='ar-SA'>
  <voice xml:lang='ar-SA' name='${VOICE}'>
    <prosody rate='0.85'>${arabicText}</prosody>
  </voice>
</speak>`;
}

function fetchAudio(arabicText) {
  return new Promise((resolve, reject) => {
    const ssml = buildSSML(arabicText);
    const options = {
      hostname: `${AZURE_REGION}.tts.speech.microsoft.com`,
      path: '/cognitiveservices/v1',
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'HusnaApp',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body}`)));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(ssml);
    req.end();
  });
}

async function run() {
  console.log(`Generating ${names.length} audio files → ${outDir}`);
  console.log(`Voice: ${VOICE}\n`);

  for (const name of names) {
    const outPath = path.join(outDir, `${name.id}.mp3`);

    if (fs.existsSync(outPath)) {
      console.log(`  [skip] ${name.id} — ${name.transliteration} (already exists)`);
      continue;
    }

    try {
      const audio = await fetchAudio(name.arabic);
      fs.writeFileSync(outPath, audio);
      console.log(`  [ok]   ${name.id} — ${name.transliteration}`);
    } catch (err) {
      console.error(`  [fail] ${name.id} — ${name.transliteration}: ${err.message}`);
    }

    // 100ms pause between requests to be polite to the API
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\nDone. Files saved to husna-mobile/assets/audio/names/');
}

run();
