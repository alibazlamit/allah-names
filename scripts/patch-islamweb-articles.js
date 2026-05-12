/**
 * Patch en.json with richer content from individual islamweb articles.
 * Sources fetched 2026-05-12 from islamweb.net series articles.
 * Only hadiths explicitly cited in those articles are included.
 */
const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../husna-mobile/data/details/en.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const patches = {

  // islamweb article 235801 — Al-Malik
  3: {
    extended_meaning: "Al-Malik refers to the one whose command is executed in His kingdom — absolute sovereignty. According to classical scholars, the kingdom of Allah is absolute in creation, disposition, and outcome, while human kingship is relative and temporary. True kingship belongs solely to Allah.",
    hadith: "\"I am the King. Where are the tyrants? Where are the arrogant?\" — Allah says this after folding the heavens on the Day of Resurrection and grasping them in His right hand. — Muslim (from Ibn Umar). Also from Muslim (Abu Hurairah): In the last third of the night, Allah says: \"I am the King, I am the King — who calls upon Me that I may answer him?\""
  },

  // islamweb article 235147 — As-Samee'
  26: {
    extended_meaning: "As-Sami' refers to Allah's attribute of hearing all sounds, whether secret or manifest — encompassing His comprehensive knowledge of all utterances and His responsiveness to supplication. Unlike creation whose hearing is limited by proximity and volume, Allah's hearing encompasses all sounds across all languages and needs simultaneously.",
    hadith: "\"Be moderate in calling upon Me. You are not invoking one who is deaf or absent — you are invoking One who is All-Hearing and Near.\" — Muslim (from Abu Hurayrah). Also: \"Whoever says in the morning: 'In the name of Allah by whose name nothing harms — neither on earth nor in heaven — and He is the All-Hearing, All-Knowing,' nothing will harm him that day.\" — Abu Dawud."
  },

  // islamweb article 239614 — Al-Ghafoor
  34: {
    extended_meaning: "Al-Ghafoor derives from the root غفر (ghafara) meaning to cover or conceal. It denotes Allah's act of concealing sins and pardoning transgressions through His grace and mercy. Scholars note that without His forgiveness, creation would be ruined. His forgiveness is vast — He pardons even major transgressions upon sincere repentance, without grudge or condition.",
    hadith: "The Prophet ﷺ taught Abu Bakr: \"O Allah, I have wronged my soul greatly, and none forgives sins except You. Forgive me with forgiveness from You, and have mercy upon me — indeed, You are Al-Ghafoor, Ar-Raheem.\" — Bukhari. Also the Hadith Qudsi: \"O son of Adam, as long as you call upon Me and have hope in Me, I will forgive you regardless of what you have done. O son of Adam, if your sins were to reach the clouds of the sky and then you sought My forgiveness, I would forgive you.\" — Tirmidhi (from Anas ibn Malik)."
  },

  // islamweb article 232372 — Ash-Shakoor
  35: {
    extended_meaning: "Ash-Shakoor accepts little deeds and multiplies the reward vastly. As scholars explain, He values the small actions of servants and magnifies their recompense while overlooking abundant mistakes. Ibn al-Qayyim noted that Allah's appreciation encompasses accepting small sincere works while overlooking shortcomings, multiplying rewards infinitely without measure.",
    hadith: "A man found a well while thirsty, drank from it, then saw a dog suffering from thirst. He filled his boot with water and gave it to the dog. The Prophet ﷺ said: \"Allah appreciated this deed and forgave him.\" — Bukhari (from Abu Hurayrah). Also: \"Whoever does not thank people has not thanked Allah.\" — Abu Dawud."
  },

  // islamweb article 232909 — Al-Kabeer
  37: {
    extended_meaning: "Al-Kabeer — the Great. According to classical scholars: Ibn Manzur: 'The Mighty and Glorious in His attribute'; Al-Tabari: 'The Mighty whose greatness exceeds all things'; Al-Khattabi: 'Characterized by majesty and greatness.' His magnificence encompasses His essence, attributes, and actions. All creation is diminished in comparison to His greatness.",
    hadith: "\"The most beloved words to Allah are four: Subhanallah, Alhamdulillah, La ilaha illallah, and Allahu Akbar. It does not matter which one you begin with.\" — Muslim (from Sumarah ibn Jundub). The phrase Allahu Akbar — Allah is Greatest — is the constant proclamation of Al-Kabeer's supreme greatness."
  },

  // islamweb article 236884 — Al-Wadood
  47: {
    extended_meaning: "Al-Wadood derives from al-wudd (love/affection). It signifies both the one who loves and the beloved one — Allah is both lover and beloved (واد ومودود). He loves the righteous and they love Him in return. This name appears paired with forgiveness, showing that His love extends even to the repentant.",
    hadith: ""
  },

  // islamweb article 237595 — Al-Majeed
  48: {
    extended_meaning: "Al-Majeed represents absolute glory — encompassing majesty, generosity, and supreme attributes. It combines notions of nobility, magnificence, and transcendent grandeur. Classical scholars clarified that Al-Majeed denotes comprehensive excellence: all of His attributes embody majesty and glory.",
    hadith: "The Prophet ﷺ taught the Abrahamic salutation of prayer: \"O Allah, send blessings upon Muhammad and his family as You sent blessings upon the family of Ibrahim — indeed, You are Al-Hameed, Al-Majeed.\" — Muslim (from Ka'b ibn 'Ujrah). This name is recited by every Muslim in every prayer."
  },

  // islamweb article 238657 — Al-Hameed
  56: {
    extended_meaning: "Al-Hameed — the one who is praised and deserves all praise due to His perfect attributes and deeds. He is praised in prosperity and hardship alike, as His actions embody wisdom, justice, mercy, and excellence. Classical scholars define this as describing the One deserving universal praise for creating, sustaining, and governing creation with perfect wisdom.",
    hadith: "The Prophet ﷺ taught: \"O Allah, send blessings upon Muhammad and his family as You sent blessings upon the family of Ibrahim — indeed, You are Al-Hameed, Al-Majeed.\" — Bukhari (from Ka'b ibn Ujrah). Every Muslim recites this in every prayer."
  },

  // islamweb article 233527 — Al-Ahad
  67: {
    extended_meaning: "Al-Ahad signifies the Unique One — absolutely unique in His essence, attributes, lordship, and divinity. He is the only entity without peer, partner, or equal. This name appears uniquely in Surah Al-Ikhlas, carrying comprehensive theological significance regarding monotheistic belief. Al-Ahad goes beyond mere numerical oneness to absolute incomparability in every sense.",
    hadith: "A man was praying and said: 'O Allah, I testify that You are Allah — Al-Ahad, As-Samad, who has not begotten and has not been begotten, and equal to Him is not any one.' The Prophet ﷺ said: 'He has been forgiven, he has been forgiven, he has been forgiven.' — Abu Dawud (from Mihjin ibn Al-Adra', authenticated by Al-Albani). Also in Bukhari (Ibn Abbas): Allah said: 'The son of Adam denies Me... yet I am Al-Ahad As-Samad, I have not begotten and have not been begotten.'"
  },
};

for (const [id, patch] of Object.entries(patches)) {
  if (!data[id]) continue;
  if (patch.extended_meaning) data[id].extended_meaning = patch.extended_meaning;
  if (patch.hadith !== undefined) data[id].hadith = patch.hadith;
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
console.log('Patched', Object.keys(patches).length, 'names with islamweb article content.');
