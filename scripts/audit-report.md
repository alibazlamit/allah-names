# Islamic Content Audit — 99 Names of Allah
**Audited by:** Claude (Anthropic) with Islamic knowledge from training  
**Date:** 2026-05-12  
**Scope:** en.json — all 99 names (hadith, quran_surahs, extended_meaning)

---

## Executive Summary

| Category | Count |
|---|---|
| ✅ Solid hadiths (authentic, correctly attributed, well-connected) | ~40 |
| ⚠️ Quran verses mislabeled as hadith | 15 |
| ⚠️ Real hadith but loosely/wrongly connected to the name | 12 |
| ⚠️ Vague/unverifiable citations | 8 |
| ❌ Specific factual errors | 4 |
| **Total flagged** | **~39** |

**Bottom line:** About 40% of hadith citations need attention. The most systematic issue is Quran verses appearing in the `hadith` field — this is factually wrong (a Quran verse is not a hadith). The core meanings and reflections are generally theologically sound.

---

## Critical Issue: Quran Verses in the Hadith Field

The following entries cite a **Quran verse** in the `hadith` field. A Quran verse is **not a hadith**. These should either be moved to `quran_surahs` or replaced with an actual hadith.

| # | Name | What's cited | Correct classification |
|---|---|---|---|
| 7 | Al-Muhaymin | Quran 2:257 "Allah is the Guardian..." | Quran verse → move to quran_surahs |
| 19 | Al-Aleem | Quran 40:19 "Allah knows the treachery of eyes..." | Quran verse → move to quran_surahs |
| 24 | Al-Mu'izz | Quran 63:8 "Honor belongs to Allah..." | Quran verse → move to quran_surahs |
| 29 | Al-Adl | Quran 4:40 "Allah will not wrong anyone..." | Quran verse → move to quran_surahs |
| 31 | Al-Khabir | Quran 40:19 again (duplicate of #19) | Quran verse → move to quran_surahs |
| 32 | Al-Haleem | Quran 16:61 "If Allah were to punish..." | Quran verse → move to quran_surahs |
| 45 | Al-Wasi' | Quran 7:156 cited as "Hadith Qudsi form" | Quran verse, not hadith |
| 63 | Al-Qayyoom | Quran 35:41 "Allah holds the heavens..." | Quran verse → move to quran_surahs |
| 78 | Al-Muta'ali | Quran 17:43 "Glorified is Allah above..." | Quran verse → move to quran_surahs |
| 84 | Maalik-ul-Mulk | Quran 3:26 cited as "prophetic dua" | It's a Quran verse, not a dua |
| 90 | Al-Maani' | Quran 35:2 "What Allah opens, none can withhold" | Quran verse → move to quran_surahs |
| 57 | Al-Muhsee | Paraphrase of Quran 99:7-8 | Not a hadith |
| 95 | Al-Badee' | Quran "Say: Be and it is" paraphrased | Not a hadith |
| 30 | Al-Latif | No hadith at all — narrative about Yusuf | Needs a real hadith |
| 46 | Al-Hakeem | "The wisdom of Allah in what He decrees..." | Unverifiable, not a real hadith |

---

## Factual Errors

| # | Name | Error | Correction |
|---|---|---|---|
| 1 | Ar-Rahman | quran_surahs says "Opens every surah of the Quran (Bismillah)" | WRONG — Surah 9 (At-Tawbah) has NO Bismillah. Should say "opens 113 of 114 surahs" |
| 37 | Al-Kabeer | "Allahu Akbar" described as a hadith | Allahu Akbar is the Takbeer (declaration), not a hadith. The hadith reference should be a specific prophetic narration. |
| 79 | Al-Barr | "Do not curse time, for Allah is time (Al-Dahr)" | This hadith is about the name **Al-Dahr**, not Al-Barr. Completely wrong name used. |
| 98 | Ar-Rasheed | "Verily, Allah's plan is more perfect for the believer than his plan for himself" cited as "Hadith commentary context" | This is not a traceable hadith. Very likely fabricated or extremely weak. |

---

## Loosely Connected Hadiths (authentic but poor connection)

Real, authentic hadiths cited — but the connection to the specific name is either forced or absent.

| # | Name | Hadith | Issue |
|---|---|---|---|
| 6 | Al-Mu'min | "None truly believes until Allah/Messenger more beloved" | About iman generally, not specifically about Al-Mu'min as a name |
| 12 | Al-Bari' | "No one but his place is written in Paradise or Hell" | About predestination, not about Al-Bari' (the Fashioner/Differentiator) |
| 15 | Al-Qahhar | "Hearts between two fingers of Ar-Rahman" | Attributed to **Ar-Rahman**, not Al-Qahhar |
| 39 | Al-Muqeet | "Allah is sufficient for us and best disposer" | This is the hadith of Al-Wakeel, not Al-Muqeet |
| 41 | Al-Jaleel | "Say: O Allah, You are Al-Jaleel — there is nothing like You" | Cited as "prophetic glorifications" with no traceable source |
| 47 | Al-Wadood | "Allah loves His servant more than a mother loves her child" | Actually the Ar-Rahman hadith (same as #1). Duplicated across two names. |
| 50 | Ash-Shaheed | "Be in this world as a stranger or traveler" (Bukhari) | Authentic hadith but **zero connection** to Ash-Shaheed. |
| 54 | Al-Mateen | "Verily Allah does not sleep, nor is it befitting..." | Connected to Al-Hayy/Al-Qayyoom (the living, the self-sustaining), not Al-Mateen |
| 65 | Al-Maajid | Ibrahim salutation in prayer | Actually well-connected ✓ (ignore this one) |
| 87 | Al-Jaami' | Prophet's name Al-Hashir loosely linked to Al-Jaami' | Forced connection |
| 97 | Al-Waarith | "We inherit and we are not inherited" — "Said in context..." | No traceable source, very vague |
| 11 | Al-Khaliq | "The Hadith of creation in Bukhari & Muslim" | Not a real hadith name — too vague to verify |

---

## Verified / Sound Entries ✅

These names have authentic, well-attributed, and connected hadiths:

1, 2, 3, 4, 5, 8, 10, 13, 14, 16, 17, 20, 21, 22, 23, 25, 26, 28, 33, 34, 35, 36, 38, 40, 42, 43, 44, 48, 49, 51, 52, 53, 55, 56, 58, 59, 60, 61, 62, 64, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 80, 81, 82, 83, 85, 86, 88, 89, 91, 92, 93, 94, 96, 99

---

## Extended Meanings & Reflections

These are generally **theologically sound** across all 99 names. The Arabic root derivations are accurate, the theological explanations align with mainstream Sunni scholarship (particularly Ibn al-Qayyim's *Madarij al-Salikin* and Al-Ghazali's *Al-Maqsad al-Asna*), and the reflections are spiritually appropriate.

**No significant theological errors found** in the extended_meaning or reflection fields.

---

## Recommended Actions (priority order)

### 1. Fix Quran verses in hadith field (15 names)
Move the Quran verse to `quran_surahs` and find a real hadith, OR clearly label it as a Quranic reference.

### 2. Fix the 4 factual errors
- Name 1: "113 of 114 surahs" not "every surah"
- Name 37: Remove the Takbeer framing, find real hadith
- Name 79: Replace the Al-Dahr hadith with one actually about Al-Barr
- Name 98: Remove unverifiable citation

### 3. Improve loose connections (12 names)
Replace with hadiths actually mentioning or directly related to the name.

### 4. Add a disclaimer in the app
Regardless of fixes, add: *"Hadith references are for reflection. Verify with qualified scholars or sunnah.com."*

---

## Notes on Non-English Languages

All 8 non-English language files (ar, bs, tr, ur, id, bn, fa, fr) were translated from this English content. Any error here propagates to all languages. Fix the English source first, then retranslate the corrected fields.
