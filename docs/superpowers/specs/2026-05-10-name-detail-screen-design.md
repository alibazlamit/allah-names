# Name Detail Screen — Design Spec
**Date:** 2026-05-10
**Feature:** Phase 1 of the Husna retention roadmap
**Status:** Approved

---

## Overview

When a user taps any name card in Learn mode, a bottom sheet modal slides up showing rich scholarly content about that name. The modal is fully localized into all 9 supported languages. All content is pre-generated and shipped with the app — no runtime API calls.

---

## Content Fields (per name, per language)

| Field | Description | Localized? |
|---|---|---|
| `extended_meaning` | 2–3 sentence deep meaning, Arabic root etymology | Yes |
| `quran_count` | Number of times the name appears in the Quran | No (shared) |
| `quran_surahs` | Key surahs/ayahs where it appears | Yes |
| `hadith` | One key hadith referencing this name, with source | Yes |
| `why_it_matters` | Why knowing this name is spiritually important | Yes |
| `reflection` | A practical reflection or dua tip for the believer | Yes |
| `related` | Array of related name IDs (e.g. Ar-Rahman → [2]) | No (shared) |

---

## Data Architecture

Follows the identical pattern as `data/translations/*.json`.

```
husna-mobile/
  data/
    details/
      base.json        ← language-neutral: quran_count, related[] for all 99 names
      en.json          ← English prose fields for all 99 names
      ar.json
      bs.json
      tr.json
      ur.json
      id.json
      bn.json
      fa.json
      fr.json
```

### `base.json` shape
```json
{
  "1": { "quran_count": 57, "related": [2] },
  "2": { "quran_count": 95, "related": [1] }
}
```

### Per-language file shape (e.g. `en.json`)
```json
{
  "1": {
    "extended_meaning": "Derived from Rahmah (رحمة)...",
    "quran_surahs": "Al-Fatiha (1:1), Surah Ar-Rahman (55)",
    "hadith": "\"Allah has divided mercy into 100 parts...\" — Bukhari",
    "why_it_matters": "Knowing this name reminds us that Allah's mercy is vast...",
    "reflection": "Begin every important action with Bismillah Ar-Rahman Ar-Raheem..."
  }
}
```

---

## Content Generation

A one-time script `husna-mobile/scripts/generate-name-details.js` produces all 10 files (1 base + 9 language). The output is committed to the repo. No runtime generation.

The script:
1. Reads `data/names.json` for the 99 names
2. Contains hardcoded scholarly content for all 99 names in English (based on classical Islamic scholarship — Ibn Kathir, Al-Ghazali's *Al-Maqsad Al-Asna*, Hadith collections)
3. Translates prose fields into the 8 other languages using accurate Islamic translations (not generic machine translation — the translations reflect established Islamic terminology in each language)
4. Writes `data/details/base.json` and `data/details/{lang}.json` for each language

The script is also useful for future updates — if content needs correction, edit the script source and re-run.

---

## UI Changes

### 1. `LearnMode.js` — Card becomes tappable

- Wrap each card `View` in a `TouchableOpacity`
- `onPress` → sets `selectedName` state to the tapped item
- The existing play button `TouchableOpacity` (for TTS) remains unchanged — React Native inner touchables correctly intercept their own touches without triggering the parent
- Add a subtle "Tap to learn more" hint line below `meaningText` in dimmed gold

### 2. New `NameDetailModal.js` component

A new standalone component. Receives `name` (the full name object) and `onClose` as props.

**Structure:**
```
Modal (animationType="slide", presentationStyle="pageSheet")
  └─ SafeAreaView
      └─ View (drag handle bar)
      └─ ScrollView
          └─ Arabic text (large, gold)
          └─ Transliteration + "#N" subtitle
          └─ Section: Meaning
          └─ Section: In the Quran  (count badge + surahs)
          └─ Section: Why it matters
          └─ Section: Hadith  (italic quote style)
          └─ Section: Reflection
          └─ Row: Related names (tappable chips → scroll Learn list to that name)
          └─ TTS play button (same as card)
      └─ Close button (× top right, or swipe-down gesture via Modal's onRequestClose)
```

**Styling:** Same dark background (`#1a1a2e` / `#252540`), gold accents (`#d4af37`), consistent with existing app aesthetic.

### 3. `App.js` — No changes needed

`selectedName` state and the modal live entirely inside `LearnMode.js`. No app-level changes.

---

## Language Handling

`NameDetailModal.js` uses a static require map — the same pattern `LearnMode.js` already uses for translations. Metro bundler cannot resolve dynamic `require()` paths at build time.

```js
const detailsMap = {
  en: require('../data/details/en.json'),
  ar: require('../data/details/ar.json'),
  bs: require('../data/details/bs.json'),
  tr: require('../data/details/tr.json'),
  ur: require('../data/details/ur.json'),
  id: require('../data/details/id.json'),
  bn: require('../data/details/bn.json'),
  fa: require('../data/details/fa.json'),
  fr: require('../data/details/fr.json'),
};
const base = require('../data/details/base.json');

// inside component:
const lang = i18n.language;
const detail = detailsMap[lang]?.[name.id] ?? detailsMap['en'][name.id];
```

RTL layout (Arabic, Urdu, Farsi) should be manually verified during testing — the app already supports these languages so RTL handling is assumed to be in place, but the modal's scroll direction and text alignment must be confirmed on-device.

---

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `husna-mobile/scripts/generate-name-details.js` |
| Create | `husna-mobile/data/details/base.json` |
| Create | `husna-mobile/data/details/en.json` (+ 8 other languages) |
| Create | `husna-mobile/components/NameDetailModal.js` |
| Modify | `husna-mobile/components/LearnMode.js` |

---

## Out of Scope

- No backend changes
- No app version bump (content-only update, no new native dependencies)
- No changes to MemorizeMode, HallOfFame, or AudioPlayer
- "Related names" chips navigate by scrolling the FlatList to the target name's index (using `FlatList.scrollToIndex`) — they do not open a second modal

---

## Success Criteria

- Tapping any of the 99 name cards opens the detail modal
- All 6 content sections are populated for all 99 names
- Content displays correctly in all 9 languages
- RTL layout works for Arabic, Urdu, Farsi
- Play button on the card still triggers TTS without opening the modal
- Modal closes on swipe-down or pressing ×
- Related name chips scroll the Learn list to the correct position
