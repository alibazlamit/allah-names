---
name: islamic-content-audit
description: Use when auditing the 99 Names of Allah detail data for Islamic authenticity — checking hadith citations are real hadiths (not Quran verses), attributions are correct, connections to the name are genuine, and fixes propagate across all 9 supported languages.
---

# Islamic Content Audit

## Overview

The Husna app contains rich detail data for all 99 Names of Allah in 9 languages (`en`, `ar`, `bs`, `tr`, `ur`, `id`, `bn`, `fa`, `fr`). This data was AI-generated and must be audited for Islamic authenticity before shipping. **English is the reference language** — fix English first, then propagate.

## Data Structure

```
husna-mobile/data/details/
  en.json          ← reference source (fix this first)
  ar.json
  bs/tr/ur/id/bn/fa/fr.json

husna-mobile/data/details/base.json   ← quran_count + related name IDs
```

Each entry (keyed by name ID 1–99) has five fields:
- `extended_meaning` — etymology and theological explanation
- `quran_surahs` — Quranic occurrence details
- `hadith` — prophetic narration
- `why_it_matters` — practical relevance
- `reflection` — spiritual practice

## The Four Audit Checks

### 1. Quran verse in the `hadith` field ← most common error
A Quran verse is **not a hadith**. Signs:
- Text ends with `— Quran X:Y` or `Quran X:Y`
- Text is a direct divine statement (first person "I")
- No collector name (Bukhari, Muslim, Tirmidhi, etc.)

**Fix:** Move verse to `quran_surahs`, replace `hadith` with an authenticated narration.

### 2. Wrong attribution
Hadith is real but collector is wrong. Common mistakes:
- Abu Dawud hadith attributed to Muslim
- Tirmidhi hadith attributed to Bukhari
- A Quranic verse cited as "Hadith Qudsi" (Hadith Qudsi = Allah's words via Prophet, not Quran)

### 3. Loose / no connection to the name
A real, authentic hadith cited but it has no meaningful link to the specific name being discussed.
Example: Using the "be a stranger in this world" hadith for Ash-Shaheed (the Witness) — authentic but unrelated.

### 4. Vague / unverifiable citations
- "Referenced in prophetic commentary on..."
- "Part of prophetic glorifications"
- No collector, no book, no chain

## Audit Workflow

```
1. Read en.json fully — skim all 99 hadith fields
2. Flag by type: [A] Quran verse | [B] Wrong attribution | [C] Loose | [D] Vague
3. For each flag: find the correct authenticated replacement
4. Write fix with translations for all 9 languages
5. Run scripts/fix-islamic-content.js to apply
```

## Applying Fixes

The fix script `scripts/fix-islamic-content.js` applies patches to all 9 language files simultaneously.

Add a fix entry like this:

```js
const fixes = {
  42: {  // name ID
    hadith: {
      en: "\"Authentic text.\" — Collector (source)",
      ar: "«النص العربي.» — المصدر",
      bs: "\"Bosanski tekst.\" — Izvor",
      tr: "\"Türkçe metin.\" — Kaynak",
      ur: "\"اردو متن۔\" — ماخذ",
      id: "\"Teks Indonesia.\" — Sumber",
      bn: "\"বাংলা পাঠ্য।\" — উৎস",
      fa: "«متن فارسی.» — منبع",
      fr: "«Texte français.» — Source",
    },
  },
};
```

Then run:
```bash
node scripts/fix-islamic-content.js
```

## Known-Good Hadith Sources (for replacements)

| Collector | Typical format |
|---|---|
| Bukhari & Muslim | `— Bukhari & Muslim` |
| Muslim only | `— Muslim (from [narrator])` |
| Tirmidhi | `— Tirmidhi (authenticated)` |
| Abu Dawud | `— Abu Dawud` |
| Ibn Majah | `— Ibn Majah (authenticated)` |
| Hadith Qudsi | `— [Collector] (Hadith Qudsi)` — Allah's words via Prophet, NOT in Quran |

## Audit Report

Full findings at `scripts/audit-report.md`.

Previous round fixed (May 2026):
- 15 Quran verses moved from `hadith` field  
- 4 factual errors (Bismillah count, wrong name reference, fabricated citation)
- All fixes propagated to all 9 languages

Remaining:
- ~12 loosely connected hadiths (authenticated but indirect link)
- Quran verse counts in `base.json` unverified

## Quick Reference — Authentic Hadiths by Name Category

**Names of Mercy (Rahman, Raheem, Wadood, Barr, Ra'oof):**
- 100 mercies hadith — Muslim
- Mother's mercy hadith — Bukhari & Muslim
- "Allah is gentle and loves gentleness" — Bukhari & Muslim

**Names of Knowledge (Aleem, Khabir, Baseer, Samee'):**
- "Dua for beneficial knowledge" — Ibn Majah
- "Allah doesn't look at forms, looks at hearts" — Muslim
- Ihsan definition (Angel Jibril) — Bukhari & Muslim

**Names of Power (Aziz, Jabbar, Qahhar, Qawi, Mateen):**
- "None can withhold what You give" — Bukhari & Muslim
- "Greatness is My cloak" — Muslim (Hadith Qudsi)

**Names of Forgiveness (Ghaffar, Ghafoor, Afuww, Tawwaab):**
- "O My servants, you sin by night and day" — Muslim (Hadith Qudsi)
- "All children of Adam are sinners, best are those who repent" — Tirmidhi
- Laylat al-Qadr dua — Tirmidhi

**Names of Provision (Razzaq, Mughniy, Basit):**
- Birds hadith — Tirmidhi
- "True richness is richness of soul" — Bukhari & Muslim
