/**
 * Islamic Content Audit
 * Verifies the accuracy of hadith citations, Quran references, and theological
 * content for all 99 Names of Allah using two sources:
 *
 *   1. Sunnah.com API  — searches whether the hadith text actually exists
 *   2. Claude API      — Islamic scholar review of theological accuracy
 *
 * Usage:
 *   node scripts/audit-islamic-content.js --key YOUR_ANTHROPIC_KEY
 *   node scripts/audit-islamic-content.js --key YOUR_KEY --start 1 --end 10
 *
 * Output:
 *   scripts/audit-report.json   — full machine-readable results
 *   scripts/audit-report.md     — human-readable summary with flags
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const args   = process.argv.slice(2);
const get    = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : null; };
const KEY    = get('--key');
const START  = parseInt(get('--start') || '1');
const END    = parseInt(get('--end')   || '99');

if (!KEY) {
  console.error('Usage: node audit-islamic-content.js --key YOUR_ANTHROPIC_KEY');
  process.exit(1);
}

const client   = new Anthropic({ apiKey: KEY });
const names    = require('../husna-mobile/data/names.json');
const details  = require('../husna-mobile/data/details/en.json');
const base     = require('../husna-mobile/data/details/base.json');

// ── Sunnah.com search ──────────────────────────────────────────────────────────
function searchSunnah(query) {
  return new Promise((resolve) => {
    // Extract first sentence / key phrase (max 80 chars) for the search
    const q = encodeURIComponent(query.split('.')[0].slice(0, 80));
    const options = {
      hostname: 'api.sunnah.com',
      path: `/v1/hadiths/search?q=${q}&limit=3`,
      method: 'GET',
      headers: {
        'X-API-Key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRNarFXzmpv5', // free public key
        'Accept': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({ found: data.data && data.data.length > 0, results: data.data || [] });
        } catch {
          resolve({ found: false, results: [] });
        }
      });
    });
    req.on('error', () => resolve({ found: false, results: [] }));
    req.end();
  });
}

// ── Claude Islamic scholar review ─────────────────────────────────────────────
const SYSTEM = `You are an expert Islamic scholar specializing in Asma ul-Husna (the 99 Names of Allah), hadith sciences, and Quranic tafsir. You have deep knowledge of classical works by Ibn al-Qayyim, Al-Ghazali, Ibn Kathir, and authentic hadith collections.

Your task: audit one of Allah's 99 Names for Islamic accuracy. Be critical and precise.

Return ONLY valid JSON in this exact format:
{
  "hadith_verdict": "verified|questionable|inaccurate|fabricated|loosely_connected",
  "hadith_notes": "specific issue or confirmation",
  "quran_verdict": "verified|questionable|inaccurate",
  "quran_notes": "specific issue or confirmation",
  "meaning_verdict": "verified|questionable|inaccurate",
  "meaning_notes": "specific issue or confirmation",
  "confidence": 1-10,
  "flags": ["list of specific concerns"],
  "corrections": "suggested fix or empty string"
}

Be especially strict about:
- Hadith citations that attribute a hadith to the wrong collector
- Hadith text that is paraphrased so loosely it misrepresents the original
- Verse numbers that are wrong
- Theological claims that contradict mainstream Sunni scholarship`;

async function reviewWithClaude(nameData, detail, baseInfo) {
  const prompt = `Review this content about Allah's name #${nameData.id}: ${nameData.transliteration} (${nameData.arabic})

Extended Meaning: ${detail.extended_meaning}

Quran Reference: ${detail.quran_surahs}
(Claimed Quran mentions: ${baseInfo.quran_count})

Hadith: ${detail.hadith}

Why it matters: ${detail.why_it_matters}

Reflection: ${detail.reflection}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const text = msg.content[0].text.trim();
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ───────────────────────────────────────────────────────────────────────
async function run() {
  const subset = names.filter(n => n.id >= START && n.id <= END);
  console.log(`Auditing names ${START}–${END} (${subset.length} names)\n`);

  const results = [];
  let flags = 0;

  for (const name of subset) {
    const detail  = details[String(name.id)];
    const baseInfo = base[String(name.id)] || {};

    if (!detail) {
      console.log(`  [skip] ${name.id} — no detail data`);
      continue;
    }

    process.stdout.write(`  [${name.id}] ${name.transliteration} ... `);

    // 1. Sunnah.com search
    const sunnahResult = await searchSunnah(detail.hadith || '');

    // 2. Claude review
    const review = await reviewWithClaude(name, detail, baseInfo);

    const result = {
      id: name.id,
      name: name.transliteration,
      arabic: name.arabic,
      sunnah_found: sunnahResult.found,
      sunnah_matches: sunnahResult.results.length,
      ...review,
    };

    results.push(result);

    const isFlagged = review && (
      review.hadith_verdict === 'fabricated' ||
      review.hadith_verdict === 'inaccurate' ||
      review.quran_verdict === 'inaccurate' ||
      review.meaning_verdict === 'inaccurate' ||
      review.confidence < 6 ||
      !sunnahResult.found
    );

    if (isFlagged) flags++;

    const icon = isFlagged ? '⚠' : '✓';
    console.log(`${icon}  hadith:${review?.hadith_verdict || '?'}  quran:${review?.quran_verdict || '?'}  confidence:${review?.confidence || '?'}/10`);

    await sleep(500); // avoid rate limits
  }

  // ── Write JSON report ────────────────────────────────────────────────────────
  const reportPath = path.join(__dirname, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // ── Write Markdown report ────────────────────────────────────────────────────
  const flagged = results.filter(r =>
    r.hadith_verdict === 'fabricated' ||
    r.hadith_verdict === 'inaccurate' ||
    r.quran_verdict === 'inaccurate' ||
    r.meaning_verdict === 'inaccurate' ||
    r.confidence < 6 ||
    !r.sunnah_found
  );

  let md = `# Islamic Content Audit Report\n`;
  md += `Generated: ${new Date().toISOString()}\n`;
  md += `Names audited: ${results.length} | Flagged: ${flagged.length}\n\n`;

  md += `## Summary\n`;
  md += `| Verdict | Count |\n|---|---|\n`;
  const verdicts = { verified:0, questionable:0, loosely_connected:0, inaccurate:0, fabricated:0 };
  results.forEach(r => { if (verdicts[r.hadith_verdict] !== undefined) verdicts[r.hadith_verdict]++; });
  Object.entries(verdicts).forEach(([k,v]) => { md += `| Hadith ${k} | ${v} |\n`; });
  md += `| Sunnah.com match found | ${results.filter(r=>r.sunnah_found).length}/${results.length} |\n\n`;

  if (flagged.length > 0) {
    md += `## ⚠ Flagged Names (need review)\n\n`;
    flagged.forEach(r => {
      md += `### ${r.id}. ${r.name} (${r.arabic})\n`;
      md += `- **Hadith**: ${r.hadith_verdict} — ${r.hadith_notes}\n`;
      md += `- **Quran**: ${r.quran_verdict} — ${r.quran_notes}\n`;
      md += `- **Meaning**: ${r.meaning_verdict} — ${r.meaning_notes}\n`;
      md += `- **Confidence**: ${r.confidence}/10\n`;
      md += `- **Sunnah.com**: ${r.sunnah_found ? 'found' : 'NOT FOUND'}\n`;
      if (r.flags?.length) md += `- **Flags**: ${r.flags.join(', ')}\n`;
      if (r.corrections) md += `- **Suggested fix**: ${r.corrections}\n`;
      md += '\n';
    });
  }

  md += `## All Results\n\n`;
  results.forEach(r => {
    const ok = r.confidence >= 7 && r.hadith_verdict !== 'fabricated' && r.hadith_verdict !== 'inaccurate';
    md += `| ${r.id} | ${r.name} | ${ok?'✅':'⚠'} | hadith:${r.hadith_verdict} | quran:${r.quran_verdict} | ${r.confidence}/10 |\n`;
  });

  const mdPath = path.join(__dirname, 'audit-report.md');
  fs.writeFileSync(mdPath, md);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Flagged: ${flags}/${results.length} names need review`);
  console.log(`Reports saved to:`);
  console.log(`  ${reportPath}`);
  console.log(`  ${mdPath}`);
}

run().catch(console.error);
