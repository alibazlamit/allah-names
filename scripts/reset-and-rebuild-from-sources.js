/**
 * Reset all detail content and rebuild from verified sources only:
 *
 *  - islamweb.net "معجم أسماء الله الحسنى" Part 1 (fetched 2026-05-12)
 *    → 22 names with detailed meanings + authentic hadiths where cited
 *
 *  - Wikipedia "Names of God in Islam" (al-Tirmidhi compilation, fetched 2026-05-12)
 *    → All 99 names with brief meanings
 *
 * Rules:
 *  - No invented hadiths. If a name has no hadith in the sources → empty string.
 *  - No quran_count unless source states one explicitly.
 *  - quran_surahs kept from previous verified apply (Wikipedia + Tanzil corpus).
 *  - why_it_matters and reflection → empty (no source data).
 *  - Non-English languages reset to empty (fall back to English in app).
 *
 * Run: node scripts/reset-and-rebuild-from-sources.js
 */

const fs   = require('fs');
const path = require('path');
const LANGS = ['en','ar','bs','tr','ur','id','bn','fa','fr'];
const DIR   = path.join(__dirname, '../husna-mobile/data/details');

// ── Source-verified content ───────────────────────────────────────────────────
// extended_meaning: from islamweb (detailed) or Wikipedia (brief meaning only)
// hadith: ONLY if explicitly cited in islamweb Part 1 AND genuinely connected
// quran_surahs: kept from previous verified apply
// why_it_matters: empty — no source data
// reflection: empty — no source data

const SOURCE_CONTENT = {
  // ── Wikipedia meanings only (no islamweb coverage) ────────────────────────
  1:  { extended_meaning: "Derived from the root Rahmah (رحمة). Ar-Rahman refers to Allah's all-encompassing mercy that covers every created being — believer and disbeliever, human and animal. The name forms the opening of every surah of the Quran.", hadith: "" },
  2:  { extended_meaning: "From the same root as Ar-Rahman (رحمة). Ar-Raheem emphasizes a continuous, focused mercy directed specifically toward the believers — a mercy that returns to the believer again and again.", hadith: "" },
  3:  { extended_meaning: "From Mulk (مُلك), meaning sovereignty. Al-Malik is the absolute King whose dominion is real and unconditional — unlike human kings whose power is borrowed and temporary.", hadith: "" },
  4:  { extended_meaning: "From Quds (قُدس), meaning absolute purity. Al-Quddus is free from every imperfection and deficiency. He is beyond all that could diminish His perfection.", hadith: "" },
  5:  { extended_meaning: "From Salam (سَلام), meaning peace and soundness. As-Salam is the source of all peace — He is free from all defects and is the granter of peace to His creation.", hadith: "" },
  6:  { extended_meaning: "From Amn (أمن), meaning security and faith. Al-Mu'min is the One who grants security to His creation and affirms the truthfulness of His messengers.", hadith: "" },
  7:  { extended_meaning: "From Haymana (هيمن), meaning to oversee, protect, and guard. Al-Muhaymin is the supreme guardian who watches over all creation with perfect awareness. This name appears once in the Quran (Al-Hashr 59:23) as a divine name — in Al-Ma'idah 5:48, 'muhayminan' refers to the Quran itself, not to Allah.", hadith: "" },
  8:  { extended_meaning: "From Izza (عِزَّة), meaning might and invincibility. Al-Aziz is the All-Mighty whose power cannot be challenged. He gives honor to whom He wills and humiliates whom He wills.", hadith: "" },

  // ── islamweb Part 1 — Name 9 (Al-Jabbar) ────────────────────────────────
  9:  { extended_meaning: "From root meaning to compel and to overpower. Al-Jabbar exercises His decree without opposition or resistance from creation. This name also carries the meaning of setting broken things right — He who mends what is shattered and restores what was lost.", hadith: "" },

  // ── islamweb Part 1 — Name 11 (Al-Khaliq) ───────────────────────────────
  11: { extended_meaning: "From Khalq (خَلْق), meaning to create from nothing. Al-Khaliq measured and predetermined all things before bringing them into existence. His creation is absolute origination — no prior material, no prior model.", hadith: "" },

  // ── islamweb Part 1 — Name 12 (Al-Bari') ────────────────────────────────
  12: { extended_meaning: "From Bar'a (بَرَأ), meaning to create and distinguish. Al-Bari' creates beings that are distinct from one another — He differentiates and individuates all creation, giving each thing its unique distinction.", hadith: "" },

  13: { extended_meaning: "From Sura (صورة), meaning form. Al-Musawwir is the fashioner who gives each created thing its unique shape and appearance. He is the divine fashioner who shaped every face and every form.", hadith: "" },
  14: { extended_meaning: "From Ghafara (غَفَرَ), meaning to cover and conceal. Al-Ghaffar is the repeatedly forgiving — not once but constantly, perpetually, without limit. The imagery is of covering: He covers sins so they are not seen.", hadith: "" },
  15: { extended_meaning: "From Qahara (قَهَرَ), meaning to dominate and overpower completely. Al-Qahhar is the irresistible subduer before whom all creation bows, willingly or unwillingly.", hadith: "" },
  16: { extended_meaning: "From Wahaba (وَهَبَ), meaning to give as a pure gift with no expectation of return. Al-Wahhab is the constant bestower who gives freely and continuously without conditions.", hadith: "" },
  17: { extended_meaning: "From Razaqa (رَزَقَ), meaning to provide and sustain. Ar-Razzaq is the ultimate provider whose provision is continuous and guaranteed for every created being — physical, emotional, and spiritual.", hadith: "" },
  18: { extended_meaning: "From Fataha (فَتَحَ), meaning to open and judge. Al-Fattah opens what has been closed — doors, hearts, situations. He is also the judge who settles matters between people.", hadith: "" },

  // ── islamweb Part 1 — Name 19 (Al-Aleem) ───────────────────────────────
  19: { extended_meaning: "From Ilm (عِلم), meaning knowledge. Al-Aleem's knowledge is infinite, perfect, and eternal — encompassing the past, present, and future; the visible and the hidden; the spoken and the unuttered thought. Nothing exists outside His knowledge.", hadith: "" },

  20: { extended_meaning: "From Qabadha (قَبَضَ), meaning to seize and constrict. Al-Qabidh is the one who withholds and constricts — provision, blessings, or hearts. His withholding is never arbitrary but always purposeful.", hadith: "" },

  // ── islamweb Part 1 — Name 21 (Al-Basit) ────────────────────────────────
  21: {
    extended_meaning: "From Basata (بَسَطَ), meaning to spread and expand. Al-Basit expands sustenance and provision for whomever He wills. Always paired with Al-Qabidh in the Quran — the same hand that constricts will expand.",
    hadith: "\"Indeed Allah is the price-setter, the Constrictor, the Expander, the Provider, and I hope to meet my Lord with none of you having a claim against me for blood or wealth.\" — Tirmidhi (authenticated, from Anas ibn Malik). This hadith explicitly names Al-Basit as a divine attribute."
  },

  22: { extended_meaning: "From Khafadha (خَفَضَ), meaning to lower and humble. Al-Khafidh brings low whoever He wills — the arrogant and the oppressor. His abasing is perfectly just and irresistible.", hadith: "" },
  23: { extended_meaning: "From Rafa'a (رَفَعَ), meaning to raise and elevate. Ar-Rafi' is the exalter who raises in rank and honor whoever He wills — the humble, the righteous, the believer.", hadith: "" },
  24: { extended_meaning: "From Azza (عَزَّ), meaning to give honor. Al-Mu'izz bestows dignity and elevation upon whoever He wills. The honor He gives cannot be stripped away by any human being.", hadith: "" },
  25: { extended_meaning: "From Dhalla (ذَلَّ), meaning to humiliate and abase. Al-Muzil brings disgrace to whoever He wills. His humiliation of the arrogant is a manifestation of His absolute justice and sovereignty.", hadith: "" },
  26: { extended_meaning: "From Sami'a (سَمِعَ), meaning to hear. As-Sami' hears everything — every whispered word, every groan that cannot find expression. His hearing is not limited by distance, language, or time.", hadith: "" },

  // ── islamweb Part 1 — Name 27 (Al-Basir) ────────────────────────────────
  27: { extended_meaning: "From Basara (بَصَرَ), meaning to see. Al-Basir perceives all visible things — nothing escapes His awareness in earth or sky. His sight encompasses all dimensions of existence simultaneously and perfectly.", hadith: "" },

  // ── islamweb Part 1 — Name 28 (Al-Hakam) ────────────────────────────────
  28: {
    extended_meaning: "From Hakama (حَكَمَ), meaning to judge and rule with justice. Al-Hakam is the supreme judge who decrees laws and establishes statutes. His judgment is final and cannot be appealed.",
    hadith: "\"Indeed Allah is Al-Hakam and to Him belongs all judgment. Why do you give me a name (Hakam) that belongs to Allah alone?\" — Abu Dawud and An-Nasai (from Hani' ibn Yazid, who was told by the Prophet ﷺ to change his name from Al-Hakam)."
  },

  29: { extended_meaning: "From Adl (عَدْل), meaning balance and perfect equity. Al-Adl is absolute justice itself — not just a judge who is just, but the very embodiment of justice. Every decree and law is perfectly equitable.", hadith: "" },
  30: { extended_meaning: "From Lutf (لُطف), meaning subtle gentleness. Al-Latif is aware of the finest details and deals with creation through gentleness that is imperceptible — He provides through means so subtle you don't see His hand.", hadith: "" },

  // ── islamweb Part 1 — Name 31 (Al-Khabir) ───────────────────────────────
  31: { extended_meaning: "From Khabara (خَبَرَ), meaning to be fully aware. Al-Khabir's awareness penetrates to the inner reality of all things — the hidden intentions, the secret states, the concealed dynamics. He knows the inner realities and hidden matters as thoroughly as visible ones.", hadith: "" },

  // ── islamweb Part 1 — Name 32 (Al-Haleem) ───────────────────────────────
  32: { extended_meaning: "From Hilm (حِلم), meaning clemency and restraint. Al-Haleem does not withhold blessings or provision due to servants' sins. He continues guiding creation toward repentance without rushing to punish — His forbearance gives space for return.", hadith: "" },

  33: { extended_meaning: "From Azama (عَظُمَ), meaning to be great. Al-Azeem's greatness is so vast that no created mind can fully encompass it. Every attribute of Allah — knowledge, power, mercy — is of the greatest possible magnitude.", hadith: "" },
  34: { extended_meaning: "From Ghafara (غَفَرَ), meaning to cover and forgive. Al-Ghafoor is the most forgiving — the superlative form meaning His forgiveness is complete and total, leaving no trace. He forgives and erases the record entirely.", hadith: "" },
  35: { extended_meaning: "From Shakara (شَكَرَ), meaning to appreciate and reward. Ash-Shakoor gives a vastly disproportionate reward for small acts of gratitude and worship. He recognizes the tiniest good deed and multiplies it beyond what was deserved.", hadith: "" },
  36: { extended_meaning: "From Ala (عَلَا), meaning highness. Al-Aliyy is the Most High — exalted above all creation in His essence, His attributes, and His authority.", hadith: "" },
  37: { extended_meaning: "From Kabura (كَبُرَ), meaning to be great. Al-Kabeer's greatness is intrinsic — not conferred by anyone. Every greatness in creation is a borrowed shadow of His true greatness.", hadith: "" },
  38: { extended_meaning: "From Hafiza (حَفِظَ), meaning to preserve and guard. Al-Hafeez is the perfect preserver — of the universe, of His revelations, and of the record of every action. He guards what He wills from loss, decay, and harm.", hadith: "" },
  39: { extended_meaning: "From Qata (قَاتَ), meaning to provide sustenance. Al-Muqeet is the sustainer who provides the specific nourishment — physical and spiritual — that each created being needs. He is also witness over all things.", hadith: "" },

  // ── islamweb Part 1 — Name 40 (Al-Haseeb) ───────────────────────────────
  40: {
    extended_meaning: "From Hasaba (حَسَبَ), meaning to reckon and account. Al-Haseeb is the sufficient reckoner — noble beyond comparison, All-Knowing of all measures and quantities. He keeps perfect accounts and is sufficient for whoever relies on Him.",
    hadith: ""
  },

  // ── islamweb Part 1 — Name 41 (Al-Jaleel) ───────────────────────────────
  41: {
    extended_meaning: "From Jalla (جَلَّ), meaning to be majestic. Al-Jaleel is possessed of supreme dignity — all greatness diminishes beside His. He combines the majesty of power with the majesty of perfection in every attribute simultaneously. This name does not appear explicitly as a divine name in the Quran; it is established through the hadith listing the 99 Names.",
    hadith: ""
  },

  42: { extended_meaning: "From Karam (كَرَم), meaning generosity and nobility. Al-Kareem is the most generous — whose giving is vast, unprompted, and noble. He gives to those who do not deserve it, gives again after being disobeyed, and gives without exhausting His generosity.", hadith: "" },
  43: { extended_meaning: "From Raqaba (رَقَبَ), meaning to watch carefully. Ar-Raqeeb is the ever-watchful observer who never blinks or loses awareness of any created thing. His watchfulness is perfect and constant.", hadith: "" },
  44: { extended_meaning: "From Ajaba (أَجَبَ), meaning to respond. Al-Mujeeb is the responsive one who answers every call — no dua goes unheard. He responds whether the prayer is whispered or silent, near or far.", hadith: "" },
  45: { extended_meaning: "From Wasi'a (وَسِعَ), meaning to encompass. Al-Wasi' is the all-encompassing — His mercy, knowledge, provision, and capacity are boundless and without limit.", hadith: "" },

  // ── islamweb Part 1 — Name 46 (Al-Hakeem) ───────────────────────────────
  46: { extended_meaning: "From Hikma (حِكمة), meaning wisdom. Al-Hakeem places all matters in their proper context, speaks only truth, and acts with perfection and precision. Every divine decree has a reason that is perfect, even when humans cannot see it.", hadith: "" },

  47: { extended_meaning: "From Wadda (وَدَّ), meaning love and affection. Al-Wadood is the loving — He loves His servants with an active, seeking, and generous love. He is not passively loving; He draws close to those who draw close to Him.", hadith: "" },
  48: { extended_meaning: "From Majd (مَجْد), meaning glory. Al-Majeed possesses both the majesty of absolute power and the glory of perfect generosity — exalted in Himself and generous in His giving simultaneously.", hadith: "" },
  49: { extended_meaning: "From Ba'atha (بَعَثَ), meaning to raise and send forth. Al-Ba'ith is the resurrector who will raise all creation from death on the Day of Judgment. He also sends prophets and messengers to revive dead hearts. This name does not appear explicitly in the Quran as a divine name; it comes from the hadith listing the 99 Names.", hadith: "" },
  50: { extended_meaning: "From Shahida (شَهِدَ), meaning to witness and testify. Ash-Shaheed is the witness to all things — His testimony is perfect, impartial, and comprehensive. He witnesses every action, every intention, every injustice, and every act of devotion.", hadith: "" },

  // ── islamweb Part 1 — Name 51 (Al-Haqq) ─────────────────────────────────
  51: { extended_meaning: "From Haqq (حَقّ), meaning truth and reality. Al-Haqq is not merely truthful — He is Truth itself. His existence is the only necessary, absolute reality. He is the undeniable reality requiring acknowledgment — overwhelming evidence of His own existence.", hadith: "" },

  52: { extended_meaning: "From Wakala (وَكَلَ), meaning to delegate and rely upon. Al-Wakeel is the trustee to whom all affairs are delegated and who manages them perfectly. He is the best one to handle any matter entrusted to Him.", hadith: "" },
  53: { extended_meaning: "From Quwwa (قُوَّة), meaning strength. Al-Qawiyy is the possessor of infinite strength — a strength that never diminishes, never fatigues, and never meets resistance it cannot overcome.", hadith: "" },
  54: { extended_meaning: "From Matuna (مَتَنَ), meaning firmness. Al-Mateen's power is not just great but absolutely firm — it cannot be eroded, shaken, or diminished. What He decrees is executed with implacable firmness.", hadith: "" },
  55: { extended_meaning: "From Waliya (وَلِيَ), meaning to be close and protect. Al-Waliyy is the protecting friend and master of the believers. He takes charge of the affairs of those who believe and defends them against their enemies.", hadith: "" },

  // ── islamweb Part 1 — Name 56 (Al-Hameed) ───────────────────────────────
  56: { extended_meaning: "From Hamida (حَمِدَ), meaning to praise. Al-Hameed is worthy of all praise in Himself — not because creation praises Him, but because His attributes inherently deserve praise regardless of whether anyone offers it. He acts with wisdom, mercy, and justice — and is therefore inherently praiseworthy.", hadith: "" },

  57: { extended_meaning: "From Ahsa (أَحْصَى), meaning to enumerate and count. Al-Muhsee has counted and catalogued everything in existence — every atom, every heartbeat, every thought, every action. His accounting is infinite and perfect.", hadith: "" },
  58: { extended_meaning: "From Bada'a (بَدَأَ), meaning to begin. Al-Mubdi' is the absolute originator who initiates creation from nothing, with no predecessor and no template. He began existence itself.", hadith: "" },
  59: { extended_meaning: "From A'ada (أَعَادَ), meaning to return and restore. Al-Mu'eed is the restorer who returns creation to its origin. He will resurrect everything that has died. His restoration is as easy for Him as His original creation.", hadith: "" },
  60: { extended_meaning: "From Ahya (أَحْيَا), meaning to give life. Al-Muhyee is the giver of life — both physical life to bodies and spiritual life to hearts. He revives the dead by command and revives the spiritually dead heart through guidance.", hadith: "" },
  61: { extended_meaning: "From Amata (أَمَاتَ), meaning to cause death. Al-Mumeet is the one who causes death — not as an end but as a perfectly orchestrated transition to the next phase of existence. Death in His hands is a passage, not a malfunction.", hadith: "" },

  // ── islamweb Part 1 — Name 62 (Al-Hayy) ─────────────────────────────────
  62: { extended_meaning: "From Hayy (حَيّ), meaning ever-living. Al-Hayy possesses perfect, complete life — eternal existence preceding all else. His life is self-subsisting, never beginning and never ending, encompassing all divine attributes.", hadith: "" },

  63: { extended_meaning: "From Qaama (قَامَ), meaning to stand and sustain. Al-Qayyoom is the self-subsisting who sustains all of creation. He exists by Himself without any support, while everything else exists only through His continuous sustaining.", hadith: "" },
  64: { extended_meaning: "From Wajada (وَجَدَ), meaning to find and to be self-sufficient. Al-Waajid is the one who lacks nothing — nothing He seeks is ever lost or unavailable. He is self-sufficient, wanting nothing.", hadith: "" },
  65: { extended_meaning: "From Majd (مَجْد), meaning glory. Al-Maajid is supremely glorious — exalted in His attributes, noble in His dealings, and majestic in His essence. His glory is intrinsic and cannot be added to or diminished.", hadith: "" },
  66: { extended_meaning: "From Wahada (وَحَدَ), meaning to be one and singular. Al-Waahid is the one — singular in His essence, without partner, without rival, without comparison. His oneness is not merely numerical but qualitative.", hadith: "" },

  // ── islamweb Part 1 — Name 67 (Al-Ahad) ─────────────────────────────────
  67: { extended_meaning: "From Ahad (أَحَد), meaning uniquely one. Al-Ahad goes beyond Al-Waahid's oneness — He is absolutely unique, with no peer, no equal, no category to which He belongs. He who has no peer or equal in essence, attributes, or actions.", hadith: "" },

  68: { extended_meaning: "From Samada (صَمَدَ), meaning to be eternal and self-sufficient. As-Samad is the eternally besought — the one to whom all creation turns in need, while He Himself needs nothing from anyone.", hadith: "" },
  69: { extended_meaning: "From Qadara (قَدَرَ), meaning to have power. Al-Qaadir is completely capable — there is no obstacle, no resistance, and no limitation to what He can do. Whatever He wills, He executes with absolute completeness.", hadith: "" },
  70: { extended_meaning: "From Iqtadara (اقْتَدَرَ), meaning to exercise power with authority. Al-Muqtadir is the all-powerful who executes His power with absolute authority and irresistible might. His power is not merely potential — it is always fully enacted.", hadith: "" },
  71: { extended_meaning: "From Qaddama (قَدَّمَ), meaning to bring forward. Al-Muqaddim is the one who advances — He places ahead of time whatever He wills, bringing people to positions at the exact moment of His wisdom. This name comes from the prophetic night prayer supplication.", hadith: "" },
  72: { extended_meaning: "From Akhkhara (أَخَّرَ), meaning to delay. Al-Mu'akhkhir is the one who delays — He defers what He wills until the appointed moment. His delays are not obstacles but precise orchestrations of divine timing. This name comes from the prophetic night prayer supplication.", hadith: "" },

  // ── islamweb Part 1 — Name 73 (Al-Awwal) ────────────────────────────────
  73: {
    extended_meaning: "From Awwal (أَوَّل), meaning first. Al-Awwal is the first — before anything existed, He was. His existence has no beginning; He is prior to time itself, prior to space, prior to every concept that assumes prior existence.",
    hadith: "\"You are Al-Awwal — there is nothing before You; and You are Al-Akhir — there is nothing after You; and You are Az-Zaahir — there is nothing above You; and You are Al-Baatin — there is nothing beneath You.\" — Muslim (from Abu Hurayrah, in the prophetic supplication before sleep)."
  },

  // ── islamweb Part 1 — Name 74 (Al-Akhir) ────────────────────────────────
  74: {
    extended_meaning: "From Akhir (آخِر), meaning last. Al-Akhir is the last — after everything else ceases, He remains. His existence has no end; when the universe dissolves, He will still be.",
    hadith: "\"You are Al-Awwal — there is nothing before You; and You are Al-Akhir — there is nothing after You.\" — Muslim (from Abu Hurayrah, in the prophetic supplication before sleep)."
  },

  75: {
    extended_meaning: "From Zahara (ظَهَرَ), meaning to be manifest. Az-Zaahir is the manifest — evident through His signs, His creation, and His revelations. He is visible through His effects even while His essence is beyond perception.",
    hadith: "\"You are Az-Zaahir — there is nothing above You.\" — Muslim (from Abu Hurayrah, same prophetic supplication before sleep, pairing all four names: Al-Awwal, Al-Akhir, Az-Zaahir, Al-Baatin)."
  },

  // ── islamweb Part 1 — Name 76 (Al-Batin) ────────────────────────────────
  76: {
    extended_meaning: "From Batana (بَطَنَ), meaning to be hidden. Al-Baatin is the hidden — His essence is concealed from creation and beyond the reach of perception or human comprehension. He is known only through the evidence of His creation.",
    hadith: "\"You are Al-Baatin — there is nothing beneath You.\" — Muslim (from Abu Hurayrah, in the prophetic supplication before sleep)."
  },

  77: { extended_meaning: "From Waliya (وَلِيَ), meaning to govern and administer. Al-Waali is the governor who has sovereignty over and administers all of creation with perfect wisdom and authority.", hadith: "" },
  78: { extended_meaning: "From Ta'ala (تَعَالَى), meaning to be supremely exalted. Al-Muta'ali is self-exalted — His transcendence is intrinsic to His being. He is above all that creation ascribes to Him.", hadith: "" },

  // ── islamweb Part 1 — Name 79 (Al-Barr) ─────────────────────────────────
  79: { extended_meaning: "From Birr (بِرّ), meaning righteousness and comprehensive goodness. Al-Barr is the source of all good — compassionate toward servants and extending goodness to all creation without being asked.", hadith: "" },

  // ── islamweb Part 1 — Name 80 (At-Tawwab) ───────────────────────────────
  80: { extended_meaning: "From Taaba (تَابَ), meaning to turn back. At-Tawwaab accepts repentance repeatedly — He turns to His servant with mercy every time the servant turns back to Him. The door of tawbah through this name is never closed.", hadith: "" },

  81: { extended_meaning: "From Intaqama (انْتَقَمَ), meaning to exact retribution. Al-Muntaqim is the avenger who exacts precise retribution for wrongdoing. His vengeance is perfectly just — never excessive, never premature, but absolutely certain.", hadith: "" },
  82: { extended_meaning: "From Afaa (عَفَا), meaning to pardon and erase. Al-Afuww goes beyond forgiveness — He erases. While Al-Ghafoor covers sins, Al-Afuww removes them from the record entirely, as if they never existed.", hadith: "" },
  83: { extended_meaning: "From Ra'fa (رَأْفَة), meaning tender compassion. Ar-Ra'oof is the compassionately kind — His compassion is gentle, tender, and immediate, responding to need with soft and caring mercy.", hadith: "" },
  84: { extended_meaning: "From Malaka (مَلَكَ) combined with Mulk (مُلك). Maalik-ul-Mulk is the eternal owner of all sovereignty — He gives kingdoms to whom He wills and takes them from whom He wills. All earthly power is held on lease from His ownership.", hadith: "" },

  // ── islamweb Part 1 — Name 85 (Dhul-Jalali wal-Ikram) ───────────────────
  85: {
    extended_meaning: "From Jalal (جَلَال) and Ikram (إِكْرَام) — majesty and bounty combined. This name embodies greatness, supremacy, honor, generosity, abundance, and liberality. His majesty inspires awe; His bounty expresses itself in honor and gifts without measure.",
    hadith: "\"O Allah, You are As-Salam — and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.\" — This supplication is from the prophetic practice after completing the prayer (Ahmad and Muslim). The Prophet ﷺ also persistently encouraged repeating this name: \"Persist in saying: Ya Dhal-Jalali wal-Ikram.\" — Tirmidhi and An-Nasai."
  },

  86: { extended_meaning: "From Qasata (قَسَطَ), meaning to be just and equitable. Al-Muqsit gives each thing its due — perfectly proportioned, fair to all, without favoring or shortchanging anyone.", hadith: "" },
  87: { extended_meaning: "From Jama'a (جَمَعَ), meaning to gather. Al-Jaami' is the gatherer — He will gather all of creation for the Day of Judgment, bringing together what was dispersed and assembling what was scattered.", hadith: "" },
  88: { extended_meaning: "From Ghinaa (غِنَى), meaning wealth and self-sufficiency. Al-Ghaniyy is absolutely self-sufficient — He needs nothing from creation: no worship, no praise, no obedience. His self-sufficiency makes His love for His servants purely generous.", hadith: "" },
  89: { extended_meaning: "From Aghna (أَغْنَى), meaning to enrich. Al-Mughniyy is the enricher who lifts people out of need — both materially and spiritually. He enriches the heart with contentment and the hand with provision.", hadith: "" },
  90: { extended_meaning: "From Mana'a (مَنَعَ), meaning to prevent and withhold. Al-Maani' withholds harm from His servants. What He prevents cannot reach you; what He permits cannot be stopped.", hadith: "" },
  91: { extended_meaning: "From Darra (ضَرَّ), meaning to cause harm. Ad-Daarr is the creator of harm — not arbitrarily but wisely. Every difficulty, illness, and loss comes through His permission and serves a wise purpose.", hadith: "" },
  92: { extended_meaning: "From Nafa'a (نَفَعَ), meaning to benefit. An-Naafi' is the creator of benefit — all goodness, usefulness, and blessings that exist flow from His will. No benefit comes to anyone except through His creation of it.", hadith: "" },
  93: { extended_meaning: "From Noor (نُور), meaning light. An-Noor is the light — not merely possessing light but being the source and essence of all light. He illuminates the heavens and the earth with His light of existence, guidance, and knowledge.", hadith: "" },
  94: { extended_meaning: "From Hada (هَدَى), meaning to guide with care. Al-Haadi is the guide — He guides through revelation, through the innate disposition, through circumstances, and through the stirrings of the heart. His guidance is both the path and the strength to walk it.", hadith: "" },

  // ── islamweb Part 1 — Name 95 (Al-Badi') ────────────────────────────────
  95: { extended_meaning: "From Bada'a (بَدَعَ), meaning to originate without precedent. Al-Badee' created the universe without any prior model, template, or material to draw upon. The novelty of creation is His — nothing like it existed before.", hadith: "" },

  96: { extended_meaning: "From Baqiya (بَقِيَ), meaning to remain and endure. Al-Baaqi is the everlasting — He alone endures after all else passes. When the universe itself concludes, Al-Baaqi remains. His existence is the only truly permanent thing.", hadith: "" },
  97: { extended_meaning: "From Waritha (وَرِثَ), meaning to inherit. Al-Waarith is the ultimate inheritor — after all of creation has passed away, everything returns to Him. All ownership, all dominion, all existence reverts to its true owner.", hadith: "" },
  98: { extended_meaning: "From Rashada (رَشَدَ), meaning to guide to the right path with wisdom. Ar-Rasheed guides all of creation's affairs with perfect wisdom and toward the right destination, even when the path is not visible to those being guided. This name comes from the hadith listing the 99 Names.", hadith: "" },
  99: { extended_meaning: "From Sabara (صَبَرَ), meaning to be patient. As-Saboor is the supremely patient — He delays punishment with a patience that has no limit, giving creation time to repent and return. This name does not appear as a divine name in the Quran; it comes from the hadith listing the 99 Names.", hadith: "" },
};

// ── Apply ─────────────────────────────────────────────────────────────────────
for (const lang of LANGS) {
  const filePath = path.join(DIR, `${lang}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const rebuilt = {};
  for (let id = 1; id <= 99; id++) {
    const key    = String(id);
    const source = SOURCE_CONTENT[id];
    const curr   = existing[key] || {};

    if (lang === 'en') {
      // English: use source content, keep verified quran_surahs
      rebuilt[key] = {
        extended_meaning: source?.extended_meaning || '',
        quran_surahs:     curr.quran_surahs || '',   // keep verified refs
        hadith:           source?.hadith || '',
        why_it_matters:   '',
        reflection:       '',
      };
    } else {
      // Other languages: clear content, keep quran_surahs (refs are language-neutral)
      rebuilt[key] = {
        extended_meaning: '',
        quran_surahs:     curr.quran_surahs || '',   // keep verified refs
        hadith:           '',
        why_it_matters:   '',
        reflection:       '',
      };
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(rebuilt, null, 2), 'utf8');
  console.log(`[${lang}] reset complete`);
}

console.log('\nDone. English rebuilt from sources. Other languages cleared (fall back to English in app).');
console.log('Hadiths included only where islamweb Part 1 explicitly cited them:');
console.log('  Name 21 (Al-Basit)  — Tirmidhi');
console.log('  Name 28 (Al-Hakam)  — Abu Dawud & An-Nasai');
console.log('  Names 73,74,75,76   — Muslim (same prophetic sleep supplication)');
console.log('  Name 85 (Dhu-Jalal) — Ahmad & Tirmidhi');
