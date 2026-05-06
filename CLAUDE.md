# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Husna** is an app for learning and memorizing the 99 Names of Allah (Asma ul-Husna). It consists of two sub-projects:

- `husna-mobile/` — Expo/React Native app (primary product, Android + Web)
- `husna-api/` — Node.js/Express REST API with SQLite (leaderboard backend)

## Commands

### Mobile App (`husna-mobile/`)
```bash
cd husna-mobile
npx expo start            # Dev server (scan QR with Expo Go)
npx expo start --web      # Web browser dev mode
npx expo run:android      # Run on Android device/emulator
npx expo export -p web    # Build web export
eas build --profile preview    # EAS APK build (internal testing)
eas build --profile production # EAS production build
```

### API Server (`husna-api/`)
```bash
cd husna-api
node server.js            # Start on port 3005 (or $PORT)
```
The SQLite database is auto-created at `husna-api/data/husna.db` on first start.

## Architecture

### Mobile App

**Entry point:** `index.js` → `App.js` → `HusnaApp` component

**Navigation:** State-based (no React Navigation). `App.js` holds `currentView` state (`'learn'`, `'memorize'`, `'oath'`, `'hall'`, `'dedication'`). Views are shown/hidden via `display: 'flex'/'none'` on wrapper Views rather than conditional rendering — this preserves component state across tab switches, which is critical for `MemorizeMode`.

**Global audio player:** Managed entirely in `App.js` using `expo-audio`. State (`isPlayingNasheed`, `currentAudioSource`, `loopA/loopB`) lives at the app level and is passed down to `AudioPlayer` as props. The audio player persists across all tabs.

**Components:**
- `LearnMode` — Scrollable FlatList of all 99 names with Arabic text, transliteration, localized meanings, and TTS playback via `expo-speech`
- `MemorizeMode` — Game mode: 3-column grid of flip tiles, text input that matches against names, timer, hint system
- `HallOfFame` — Dual-mode: `'oath'` (submit completion) and `'leaderboard'` (country/fastest tabs)
- `AudioPlayer` — Persistent bottom player with seek slider and A/B loop points
- `HelpModal` — Onboarding modal shown on first launch (persisted via `@has_onboarded` in AsyncStorage)

**Data:**
- `data/names.json` — Array of 99 names, each with `id`, `arabic`, `transliteration`
- `data/translations/*.json` — Per-language meaning strings, keyed by name `id` (9 languages)
- UI translations are inline in `i18n.js` (not in the `data/translations/` files)

**i18n:** `i18next` + `react-i18next`. Language selection persisted to AsyncStorage (`@app_language`). Custom `languageDetector` reads the persisted value on startup.

**User identity:** A random UUID is generated on first launch and stored at `user_uuid` in AsyncStorage. Name is cached at `user_name`.

**API communication (`HallOfFame.js`):**
- All leaderboard calls go to `https://husna.alibazlamit.com`
- POST submissions are signed with HMAC-SHA256 using `crypto-js`. The `API_SECRET` (`husna-secret-key-2026`) is intentionally identical on both client and server — it's lightweight anti-abuse, not authentication.
- Signature payload format: `${timestamp}${name}${country}${timeTaken}`

### Backend API

**Endpoints:**
- `GET /api/leaderboard?type=country|names` — Top entries grouped by country or top 20 fastest
- `GET /api/leaderboard/rank/:uuid` — User's personal rank and data
- `POST /api/leaderboard` — Submit oath completion (rate limited to 5/hour per IP, HMAC verified, 5-minute replay protection)

**Database:** SQLite via `sqlite3`. Schema: `leaderboard(id, name, country, swore_oath, user_uuid, time_taken, completed_at)`. `database.js` creates the table and indexes on startup.

## Key Implementation Details

**Name matching in MemorizeMode:** Arabic diacritics are stripped and Alif variants normalized before comparison. English transliteration strips Al-/Ar-/As-/Ad-/An-/Az-/At-/Ash- prefixes to handle variations (e.g., "Rahman" matches "Ar-Rahman"). The `lastMatchRef` prevents an autocomplete race condition where the OS fires a second `onChangeText` with stale text after a match clears the input.

**Hint system affects eligibility:** Completing with zero hints allows proceeding to the oath and Hall of Fame. Any hint usage locks that session out of the oath flow.

**Android edge-to-edge:** On Android, `NavigationBar.setPositionAsync('absolute')` and transparent background are set in `App.js` `useEffect` to achieve true edge-to-edge. The bottom nav bar uses `Math.max(insets.bottom, 30)` for safe area padding.

**Web variant:** `App.web.js` and `HallOfFame.web.js` exist as web-specific overrides (Metro resolves `.web.js` over `.js` on web platform).

## Versions and Deployment

- Current version: `1.0.19` (in `package.json` and `i18n.js` dedication strings)
- EAS project configured in `eas.json` with `development`, `preview` (APK), and `production` profiles
- API deployed at `husna.alibazlamit.com` behind a reverse proxy (Express trust proxy enabled)
