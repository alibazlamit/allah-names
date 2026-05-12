/**
 * Round 2 Islamic content fixes — loosely connected and vague hadiths.
 * Run: node scripts/fix-islamic-content-round2.js
 */

const fs   = require('fs');
const path = require('path');
const LANGS = ['en','ar','bs','tr','ur','id','bn','fa','fr'];
const DIR   = path.join(__dirname, '../husna-mobile/data/details');

const fixes = {

  // Name 11 — Al-Khaliq: "Hadith of creation in Bukhari & Muslim" was too vague
  11: {
    hadith: {
      en: "\"Allah was, and there was nothing before Him. His Throne was upon the water. Then He created the heavens and the earth and wrote all things in the Book.\" — Bukhari (from Imran ibn Husayn). The first act of Al-Khaliq recorded in hadith.",
      ar: "\"كان الله ولم يكن شيء قبله، وكان عرشه على الماء، ثم خلق السماوات والأرض، وكتب في الذكر كل شيء.\" — البخاري (عن عمران بن حصين). أول فعل للخالق مسجّل في الحديث.",
      bs: "\"Allah je bio i ništa nije bilo prije Njega. Njegov Aršer je bio na vodi. Zatim je stvorio nebesa i zemlju i zapisao sve u Knjizi.\" — Buhari (od Imrana ibn Husajna). Prvi zabilježeni čin Al-Khaliqa.",
      tr: "\"Allah vardı ve O'ndan önce hiçbir şey yoktu. O'nun Arşı suyun üzerindeydi. Sonra gökleri ve yeri yarattı ve her şeyi Kitab'a yazdı.\" — Buhari (İmran ibn Husayn'dan). El-Halık'ın hadiste kayıtlı ilk yaratma eylemi.",
      ur: "\"اللہ تھا اور اس سے پہلے کچھ نہ تھا۔ اس کا عرش پانی پر تھا۔ پھر اس نے آسمانوں اور زمین کو پیدا کیا اور ہر چیز کتاب میں لکھ دی۔\" — بخاری (عمران بن حصین سے)۔ حدیث میں الخالق کا پہلا ذکر۔",
      id: "\"Allah ada, dan tidak ada sesuatu pun sebelum-Nya. Arsy-Nya berada di atas air. Kemudian Dia menciptakan langit dan bumi dan menuliskan segala sesuatu dalam Kitab.\" — Bukhari (dari Imran ibn Husain). Tindakan pertama Al-Khaliq yang tercatat dalam hadits.",
      bn: "\"আল্লাহ ছিলেন, এবং তাঁর আগে কিছুই ছিল না। তাঁর আরশ পানির উপর ছিল। তারপর তিনি আকাশ ও পৃথিবী সৃষ্টি করলেন এবং কিতাবে সব কিছু লিখলেন।\" — বুখারী (ইমরান ইবন হুসায়ন থেকে)।",
      fa: "«الله بود و چیزی پیش از او نبود. عرشش بر آب بود. سپس آسمان‌ها و زمین را آفرید و همه چیز را در کتاب نوشت.» — بخاری (از عمران بن حصین). نخستین عمل الخالق که در حدیث ثبت شده است.",
      fr: "«Allah était et il n'y avait rien avant Lui. Son Trône était sur l'eau. Puis Il créa les cieux et la terre et inscrivit toutes choses dans le Livre.» — Bukhari (d'Imran ibn Husain). Le premier acte d'Al-Khaliq enregistré dans le hadith.",
    },
  },

  // Name 12 — Al-Bari': predestination hadith had no connection to "the Fashioner"
  12: {
    hadith: {
      en: "\"Each of you is formed in your mother's womb for forty days as a drop, then as a clot for the same period, then as a lump of flesh. Then an angel is sent to breathe the soul into it and inscribe four things: provision, lifespan, deeds, and whether wretched or blessed.\" — Bukhari & Muslim. Al-Bari' differentiates every soul from the very beginning.",
      ar: "\"إن أحدكم يُجمع خلقه في بطن أمه أربعين يوماً نطفة، ثم يكون علقة مثل ذلك، ثم يكون مضغة مثل ذلك، ثم يُرسل إليه الملك فينفخ فيه الروح، ويُؤمر بأربع كلمات: بكتب رزقه وأجله وعمله وشقيٌّ أم سعيد.\" — البخاري ومسلم. البارئ يُميّز كل روح منذ البداية.",
      bs: "\"Svaki od vas se formira u majčinoj utrobi četrdeset dana kao kap, zatim kao ugrušak isto toliko, pa kao komad mesa isto toliko. Zatim se šalje anđeo koji udahne dušu i zapiše četiri stvari: opskrbu, lifespan, djela, i da li je nesretan ili sretan.\" — Buhari i Muslim.",
      tr: "\"Her biriniz annesinin karnında kırk gün nutfe olarak oluşturulur, sonra aynı süre pıhtı, sonra aynı süre et parçası olarak kalır. Sonra bir melek gönderilir ve ruhu üfler; dört şeyi yazar: rızık, ömür, ameller, mutlu mu mutsuz mu olacağı.\" — Buhari ve Müslim.",
      ur: "\"تم میں سے ہر شخص اپنی ماں کے پیٹ میں چالیس دن نطفہ کی صورت میں بنتا ہے، پھر اسی قدر علقہ، پھر اسی قدر مضغہ۔ پھر ایک فرشتہ بھیجا جاتا ہے جو روح پھونکتا اور چار چیزیں لکھتا ہے: رزق، عمر، عمل، اور نیک بخت یا بدبخت۔\" — بخاری ومسلم۔",
      id: "\"Setiap kalian dibentuk dalam rahim ibunya selama empat puluh hari sebagai setetes air, kemudian menjadi segumpal darah selama masa yang sama, lalu menjadi segumpal daging. Kemudian seorang malaikat diutus untuk meniupkan roh dan menuliskan empat hal: rezeki, ajal, amal, dan apakah celaka atau bahagia.\" — Bukhari & Muslim.",
      bn: "\"তোমাদের প্রত্যেকে তার মায়ের গর্ভে চল্লিশ দিন ধরে বীর্যরূপে গঠিত হয়, তারপর একই সময় রক্তপিণ্ড, তারপর একই সময় মাংসপিণ্ড। তারপর একজন ফেরেশতা পাঠানো হয় যিনি রূহ ফুঁকে দেন এবং চারটি বিষয় লেখেন: রিযিক, আয়ু, আমল এবং সৌভাগ্যবান না দুর্ভাগ্যবান।\" — বুখারী ও মুসলিম।",
      fa: "«هر یک از شما چهل روز در رحم مادرش به صورت نطفه شکل می‌گیرد، سپس همین مدت علقه، سپس همین مدت مضغه. آنگاه فرشته‌ای فرستاده می‌شود که روح می‌دمد و چهار چیز می‌نویسد: روزی، اجل، عمل، و شقاوت یا سعادت.» — بخاری و مسلم.",
      fr: "«Chacun de vous est formé dans le ventre de sa mère pendant quarante jours comme une goutte, puis comme un caillot pendant la même durée, puis comme un morceau de chair. Puis un ange est envoyé pour souffler l'âme et inscrire quatre choses : la subsistance, la durée de vie, les actes, et s'il sera misérable ou bienheureux.» — Bukhari & Muslim.",
    },
  },

  // Name 15 — Al-Qahhar: Ar-Rahman hearts hadith → better connected hadith
  15: {
    hadith: {
      en: "\"On the Day of Resurrection, the earth will be turned into a single loaf of bread — the Almighty will knead it with His hand as one of you kneads dough for a journey. Then He will call to the inhabitants of Paradise: I am the King.\" — Bukhari & Muslim. Al-Qahhar subdues all of creation equally on that Day.",
      ar: "\"تكون الأرض يوم القيامة خبزةً واحدة، يتكفؤها الجبار بيده كما يتكفأ أحدكم خبزته في السفر.\" — البخاري ومسلم. القهار يُذلّ كل الخلائق في ذلك اليوم.",
      bs: "\"Na Sudnjem danu, zemlja će biti jedan hljeb koji Svemogući prevrće Svojom rukom kao što neko od vas prevrće hljeb na putu.\" — Buhari i Muslim. Al-Kahhar podjarmi sve stvorenje tog Dana.",
      tr: "\"Kıyamet gününde yeryüzü tek bir ekmek olacak. O'na Güçlü Olan, yolcunun ekmeği çevirdiği gibi Kendi eliyle çevirecek.\" — Buhari ve Müslim. El-Kahhar tüm yaratıkları o Gün eşit şekilde boyun eğdirir.",
      ur: "\"قیامت کے دن زمین ایک روٹی کی طرح ہوگی جسے الجبار اپنے ہاتھ سے اس طرح پلٹائے گا جیسے تم میں سے کوئی سفر میں روٹی پلٹاتا ہے۔\" — بخاری ومسلم۔ القہار اس دن تمام مخلوقات کو یکساں مسخر کرتا ہے۔",
      id: "\"Pada hari Kebangkitan, bumi akan menjadi satu roti yang dibalik oleh Yang Maha Kuasa dengan tangan-Nya sebagaimana salah seorang kalian membalik roti dalam perjalanan.\" — Bukhari & Muslim. Al-Qahhar menundukkan seluruh ciptaan secara setara pada Hari itu.",
      bn: "\"পুনরুত্থান দিবসে পৃথিবী একটিমাত্র রুটিতে পরিণত হবে — সর্বশক্তিমান এটিকে তাঁর হাতে উল্টাবেন যেমন তোমাদের কেউ সফরে রুটি উল্টায়।\" — বুখারী ও মুসলিম। আল-কাহহার সেদিন সমস্ত সৃষ্টিকে সমানভাবে বশীভূত করবেন।",
      fa: "«در روز رستاخیز زمین یک قرص نان خواهد شد که جبار آن را با دستش می‌چرخاند، همان‌طور که یکی از شما در سفر نان را می‌چرخاند.» — بخاری و مسلم. القهار در آن روز تمام آفریدگان را به یکسان مسخر می‌کند.",
      fr: "«Au Jour de la Résurrection, la terre sera un seul pain que le Tout-Puissant retournera de Sa main comme l'un d'entre vous retourne son pain en voyage.» — Bukhari & Muslim. Al-Qahhar soumet toute la création également en ce Jour.",
    },
  },

  // Name 39 — Al-Muqeet: Al-Wakeel hadith → provision/sustenance hadith
  39: {
    hadith: {
      en: "\"Allah the Most High says: 'O son of Adam, devote yourself to My worship and I will fill your heart with richness and relieve your poverty. And if you do not, I will fill your hands with busyness and not relieve your poverty.'\" — Tirmidhi & Ibn Majah (authenticated). Al-Muqeet provides the precise sustenance — spiritual and material — each soul needs.",
      ar: "\"قال الله تعالى: يا ابن آدم، تفرّغ لعبادتي أملأ صدرك غنىً وأسُدّ فقرك، وإن لم تفعل ملأت يدك شغلاً ولم أسُدّ فقرك.\" — الترمذي وابن ماجه (صحيح). المقيت يُمدّ كل روح بقوتها الدقيق.",
      bs: "\"Allah Svevišnji kaže: 'O sine Ademov, posveti se Mojoj ibadetu i napunit ću ti srce bogatstvom i otkloniti tvoje siromaštvo. Ako to ne učiniš, napunit ću ti ruke zaposlenošću i neću otkloniti tvoje siromaštvo.'\" — Tirmizi i Ibn Madža (sahih).",
      tr: "\"Yüce Allah şöyle buyurur: 'Ey Ademoğlu, ibadetim için kendini ver; gönlünü zenginlikle doldururum ve seni fakirlikten kurtarırım. Bunu yapmadığın takdirde, ellerini meşguliyetle doldururum ve fakirliğini gidermem.'\" — Tirmizi ve İbn Mace (sahih).",
      ur: "\"اللہ تعالیٰ فرماتا ہے: اے ابن آدم! میری عبادت کے لیے فارغ ہو جا، میں تیرا سینہ غنیٰ سے بھر دوں گا اور تیری محتاجی دور کر دوں گا۔ اگر تو نے ایسا نہ کیا تو میں تیرے ہاتھ مشغولیت سے بھر دوں گا اور تیری محتاجی دور نہیں کروں گا۔\" — ترمذی وابن ماجہ (صحیح)۔",
      id: "\"Allah Yang Maha Tinggi berfirman: 'Wahai anak Adam, dedikasikan dirimu untuk beribadah kepada-Ku, maka Aku akan memenuhi hatimu dengan kekayaan dan meringankan kemiskinanmu. Jika tidak, Aku akan memenuhi tanganmu dengan kesibukan dan tidak meringankan kemiskinanmu.'\" — Tirmidzi & Ibn Majah (shahih).",
      bn: "\"আল্লাহ তায়ালা বলেন: 'হে আদমের সন্তান, নিজেকে আমার ইবাদতের জন্য নিবেদিত কর, আমি তোমার হৃদয়কে সম্পদে ভরে দেব এবং তোমার দারিদ্র্য দূর করব। আর যদি না কর, তাহলে তোমার হাতকে ব্যস্ততায় ভরে দেব এবং দারিদ্র্য দূর করব না।'\" — তিরমিযী ও ইবন মাজাহ (সহীহ)।",
      fa: "«الله تعالی می‌فرماید: ای پسر آدم، خود را وقف عبادت من کن؛ دلت را از بی‌نیازی پر می‌کنم و نیازت را برطرف می‌سازم. اگر این کار را نکنی، دستانت را به مشغولیت پر می‌کنم و نیازت را برطرف نمی‌سازم.» — ترمذی و ابن ماجه (صحیح).",
      fr: "«Allah le Très-Haut dit : 'Ô fils d'Adam, consacre-toi à Mon adoration et Je remplirai ton cœur de richesse et soulagerai ta pauvreté. Si tu ne le fais pas, Je remplirai tes mains d'occupation et ne soulagerai pas ta pauvreté.'» — Tirmidhi & Ibn Majah (authentifié).",
    },
  },

  // Name 41 — Al-Jaleel: unverifiable citation → authenticated hadith
  41: {
    hadith: {
      en: "\"The most beloved words to Allah are four: Subhanallah, Alhamdulillah, La ilaha illallah, and Allahu Akbar. None of them will harm you whichever you start with.\" — Muslim (from Samura ibn Jundub). These glorifications are the heart's acknowledgment of Al-Jaleel's unmatched majesty.",
      ar: "\"أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر، لا يضرك بأيهن بدأت.\" — مسلم (عن سمرة بن جندب). هذه التسبيحات هي اعتراف القلب بجلال الجليل.",
      bs: "\"Najdraže Allahu su četiri riječi: Subhanallah, Alhamdulillah, La ilahe illallah i Allahu Ekber. Nijedna od njih ti ne šteti kojom počneš.\" — Muslim (od Samure ibn Džunduba). Ove veličanstvene riječi su srčano priznanje uzvišenosti Al-Jaleela.",
      tr: "\"Allah'a en sevimli sözler dörttür: Sübhanallah, Elhamdülillah, La ilahe illallah ve Allahu Ekber. Hangisiyle başlarsan başla, zararı olmaz.\" — Müslim (Semure b. Cündeb'den).",
      ur: "\"اللہ کو چار کلمے سب سے زیادہ پسند ہیں: سبحان اللہ، الحمد للہ، لا الہ الا اللہ، اللہ اکبر۔ ان میں سے کسی سے بھی شروع کرو کوئی نقصان نہیں۔\" — مسلم (سمرہ بن جندب سے)۔",
      id: "\"Kata-kata yang paling dicintai Allah ada empat: Subhanallah, Alhamdulillah, La ilaha illallah, dan Allahu Akbar. Tidak ada yang salah dengannya dari mana pun kamu mulai.\" — Muslim (dari Samura ibn Jundub).",
      bn: "\"আল্লাহর কাছে সবচেয়ে প্রিয় চারটি কথা: সুবহানাল্লাহ, আলহামদুলিল্লাহ, লা ইলাহা ইল্লাল্লাহ এবং আল্লাহু আকবার। তুমি যেটা দিয়েই শুরু কর, কোনো ক্ষতি নেই।\" — মুসলিম (সামুরা ইবন জুনদুব থেকে)।",
      fa: "«محبوب‌ترین کلمات نزد الله چهار کلمه است: سبحان الله، الحمد لله، لا اله الا الله، الله اکبر. از هر کدام شروع کنی، مشکلی نیست.» — مسلم (از سمره بن جندب).",
      fr: "«Les mots les plus aimés d'Allah sont quatre : Subhanallah, Alhamdulillah, La ilaha illallah et Allahu Akbar. Aucun d'eux ne te nuit quelle que soit celle par laquelle tu commences.» — Muslim (de Samura ibn Jundub).",
    },
  },

  // Name 47 — Al-Wadood: duplicate Ar-Rahman hadith → proper Al-Wadood hadith
  47: {
    hadith: {
      en: "\"When Allah loves a servant, He calls Jibril: 'I love so-and-so, so love him.' Then Jibril loves him and announces in the heavens: 'Allah loves so-and-so, so love him.' The inhabitants of the heavens love him. Then acceptance is placed for him on earth.\" — Bukhari & Muslim. Al-Wadood's love is active, spreading, and transformative.",
      ar: "\"إذا أحب الله العبد نادى جبريل: إن الله يحب فلانا فأحبه، فيحبه جبريل فينادي في أهل السماء: إن الله يحب فلانا فأحبوه، فيحبه أهل السماء ثم يوضع له القبول في الأرض.\" — البخاري ومسلم. محبة الودود فاعلة وتنتشر وتُحوِّل.",
      bs: "\"Kada Allah zavoli roba, pozove Džibraila: 'Allah voli tog i tog, voli ga.' Tada ga Džibriil zavoli i objavi na nebesima: 'Allah voli tog i tog, volite ga.' Tada ga stanovnici nebesa zavole. Zatim mu se prihvaćenost stavlja na zemlju.\" — Buhari i Muslim.",
      tr: "\"Allah bir kulu sevince Cebrail'e: 'Allah falancayı seviyor, onu sev' diye seslenir. Cebrail de onu sever ve göklerde ilan eder: 'Allah falancayı seviyor, onu sevin.' Gök ehli de onu sever. Sonra onun için yerde kabul konulur.\" — Buhari ve Müslim.",
      ur: "\"جب اللہ کسی بندے سے محبت کرتا ہے تو جبریل کو پکارتا ہے: میں فلاں سے محبت کرتا ہوں تم بھی اس سے محبت کرو۔ پھر جبریل بھی اس سے محبت کرتے اور آسمان والوں میں اعلان کرتے ہیں: اللہ فلاں سے محبت کرتا ہے تم بھی اس سے محبت کرو۔ پھر آسمان والے اس سے محبت کرتے ہیں اور زمین میں اس کی مقبولیت رکھ دی جاتی ہے۔\" — بخاری ومسلم۔",
      id: "\"Ketika Allah mencintai seorang hamba, Dia memanggil Jibril: 'Allah mencintai si Fulan, maka cintailah dia.' Jibril pun mencintainya dan mengumumkan di langit: 'Allah mencintai si Fulan, maka cintailah dia.' Para penghuni langit pun mencintainya. Kemudian penerimaan ditempatkan untuknya di bumi.\" — Bukhari & Muslim.",
      bn: "\"আল্লাহ যখন কোনো বান্দাকে ভালোবাসেন, তখন জিবরীলকে ডাকেন: 'আল্লাহ অমুককে ভালোবাসেন, তুমিও তাকে ভালোবাসো।' তখন জিবরীলও তাকে ভালোবাসেন এবং আকাশে ঘোষণা দেন: 'আল্লাহ অমুককে ভালোবাসেন, তোমরাও তাকে ভালোবাসো।' আকাশবাসীরাও তাকে ভালোবাসে। তারপর পৃথিবীতে তার গ্রহণযোগ্যতা রাখা হয়।\" — বুখারী ও মুসলিম।",
      fa: "«هرگاه الله بنده‌ای را دوست بدارد، جبریل را صدا می‌زند: الله فلانی را دوست دارد، او را دوست بدار. جبریل هم او را دوست می‌دارد و در آسمان‌ها اعلام می‌کند: الله فلانی را دوست دارد، او را دوست بدارید. اهل آسمان‌ها هم او را دوست می‌دارند. سپس پذیرش او در زمین گذاشته می‌شود.» — بخاری و مسلم.",
      fr: "«Lorsqu'Allah aime un serviteur, Il appelle Jibril : 'Allah aime Untel, aime-le.' Jibril l'aime alors et annonce dans les cieux : 'Allah aime Untel, aimez-le.' Les habitants des cieux l'aiment. Puis l'acceptation lui est placée sur terre.» — Bukhari & Muslim. L'amour d'Al-Wadood est actif, se répand et transforme.",
    },
  },

  // Name 50 — Ash-Shaheed: stranger/traveler hadith had zero connection
  50: {
    hadith: {
      en: "\"On the Day of Resurrection, Allah will bring His servant close and ask: 'Did I not honor you? Did I not give you a spouse, horses and cattle, and make you a leader?' He will say: 'Yes.' Then Allah will say: 'Did you think you would not meet Me?' He will say: 'No.' And Allah will say: 'I will not forget you today as you forgot meeting Me.'\" — Muslim. Ash-Shaheed witnessed every moment — and testifies on that Day.",
      ar: "\"يدنو المؤمن من ربه يوم القيامة حتى يضع عليه كنفه فيُقرّره بذنوبه، فيقول: أتعرف ذنب كذا؟ فيقول: أعرف، ثم يقول: سترتها عليك في الدنيا وأنا أغفرها لك اليوم.\" — البخاري ومسلم. الشهيد شهد كل لحظة ويشهد بها في ذلك اليوم.",
      bs: "\"Na Sudnjem danu Allah će privući Svog roba bliže Sebi i pitati: 'Nisam li te počastio? Nisam li ti dao bračnog partnera, konje, stoku i učinio te liderom?' On će reći: 'Da.' Zatim će Allah reći: 'Jesi li mislio da Me nećeš sresti?' On će reći: 'Ne.' Allah će reći: 'Danas te neću zaboraviti kao što si ti zaboravio susret sa Mnom.'\" — Muslim.",
      tr: "\"Kıyamet gününde Allah, kulunu yakına çekerek soracak: 'Seni şereflendirmedim mi? Sana eş, atlar, sığırlar vermedim mi ve seni lider yapmadım mı?' O: 'Evet' diyecek. Sonra Allah: 'Bana kavuşacağını düşünmedin mi?' diyecek. O: 'Hayır' diyecek. Allah da: 'Bugün seni, bana kavuşmayı unuttuğun gibi unutacağım' diyecek.\" — Müslim.",
      ur: "\"قیامت کے دن اللہ اپنے بندے کو قریب کرے گا اور پوچھے گا: کیا میں نے تجھے عزت نہیں دی؟ کیا میں نے تجھے جوڑا، گھوڑے، مویشی نہیں دیے اور تجھے سردار نہیں بنایا؟ وہ کہے گا: ہاں۔ پھر اللہ فرمائے گا: کیا تو نے سمجھا کہ مجھ سے ملاقات نہیں ہوگی؟ وہ کہے گا: نہیں۔ اللہ فرمائے گا: آج میں تجھے ایسے بھول جاؤں گا جیسے تو نے مجھ سے ملاقات بھلا دی تھی۔\" — مسلم۔",
      id: "\"Pada hari Kebangkitan, Allah akan mendekatkan hamba-Nya dan bertanya: 'Tidakkah Aku memuliakanmu? Tidakkah Aku memberikanmu pasangan, kuda dan ternak, dan menjadikanmu pemimpin?' Dia akan berkata: 'Ya.' Kemudian Allah berkata: 'Apakah kamu mengira kamu tidak akan bertemu dengan-Ku?' Dia berkata: 'Tidak.' Allah berkata: 'Hari ini Aku tidak akan melupakanmu seperti kamu melupakan pertemuan dengan-Ku.'\" — Muslim.",
      bn: "\"পুনরুত্থান দিবসে আল্লাহ তাঁর বান্দাকে কাছে নিয়ে আসবেন এবং জিজ্ঞেস করবেন: 'আমি কি তোমাকে সম্মানিত করিনি? আমি কি তোমাকে স্বামী/স্ত্রী, ঘোড়া ও গবাদি পশু দিইনি এবং নেতা বানাইনি?' সে বলবে: 'হ্যাঁ।' তখন আল্লাহ বলবেন: 'তুমি কি মনে করেছিলে আমার সাথে দেখা হবে না?' সে বলবে: 'না।' আল্লাহ বলবেন: 'আজ আমি তোমাকে ভুলে যাব যেমন তুমি আমার সাথে দেখা ভুলে গিয়েছিলে।'\" — মুসলিম।",
      fa: "«در روز رستاخیز الله بنده‌اش را نزدیک می‌آورد و می‌پرسد: آیا تو را گرامی نداشتم؟ آیا همسر، اسب و گاو به تو ندادم و تو را سرپرست نکردم؟ می‌گوید: بله. سپس الله می‌فرماید: آیا فکر می‌کردی مرا ملاقات نخواهی کرد؟ می‌گوید: نه. الله می‌فرماید: امروز تو را فراموش می‌کنم همان‌طور که تو ملاقات با مرا فراموش کردی.» — مسلم.",
      fr: "«Le Jour de la Résurrection, Allah rapprochera Son serviteur et demandera : 'Ne t'ai-je pas honoré ? Ne t'ai-je pas donné un conjoint, des chevaux, du bétail et fait de toi un dirigeant ?' Il dira : 'Si.' Puis Allah dira : 'Pensais-tu que tu ne Me rencontrerais pas ?' Il dira : 'Non.' Et Allah dira : 'Aujourd'hui Je t'oublierai comme tu as oublié Ma rencontre.'» — Muslim. Ash-Shaheed a tout témoin — et témoigne en ce Jour.",
    },
  },

  // Name 97 — Al-Waarith: vague unverifiable citation → authenticated hadith
  97: {
    hadith: {
      en: "\"By Allah, the world is not worth as much to Allah as this dead lamb is to its owner.\" — Muslim (from Jabir). Everything of this world is temporary; Al-Waarith outlasts and inherits all.",
      ar: "\"والله، للدنيا أهون على الله من هذه الجيفة على أهلها.\" — مسلم (عن جابر). كل شيء في هذه الدنيا مؤقت؛ الوارث يبقى ويرث الجميع.",
      bs: "\"Allahu, ovaj svijet je vrijedniji Allahu koliko ova leševina njezinim vlasnicima.\" — Muslim (od Džabira). Sve na ovom svijetu je privremeno; Al-Waarith nadilazi i nasljeđuje sve.",
      tr: "\"Allah'a yemin ederim ki dünya, Allah katında şu ölü kuzunun sahibine değeri kadar değil.\" — Müslim (Cabir'den). Bu dünyanın her şeyi geçicidir; Al-Varis her şeyi geride bırakır ve miras alır.",
      ur: "\"اللہ کی قسم! دنیا اللہ کے نزدیک اس مردہ بچے کے برابر بھی نہیں جو اپنے مالک کے لیے بے قدر ہے۔\" — مسلم (جابر سے)۔ اس دنیا کی ہر چیز عارضی ہے؛ الوارث سب کو باقی رہ کر وارث بنتا ہے۔",
      id: "\"Demi Allah, dunia tidak lebih berharga bagi Allah dari bangkai kambing ini bagi pemiliknya.\" — Muslim (dari Jabir). Segala sesuatu di dunia ini bersifat sementara; Al-Waarith melampaui dan mewarisi segalanya.",
      bn: "\"আল্লাহর কসম! আল্লাহর কাছে দুনিয়ার মূল্য এই মৃত ছাগলের চেয়েও কম যা তার মালিকের কাছে মূল্যহীন।\" — মুসলিম (জাবির থেকে)। এই দুনিয়ার সব কিছুই অস্থায়ী; আল-ওয়ারিস সব কিছুকে অতিক্রম করে উত্তরাধিকার গ্রহণ করেন।",
      fa: "«به الله قسم، دنیا نزد الله از این گوسفند مرده‌ای که برای صاحبش بی‌ارزش است، ارزش کمتری دارد.» — مسلم (از جابر). همه چیز در این دنیا موقت است؛ الوارث همه را پشت سر می‌گذارد و به ارث می‌برد.",
      fr: "«Par Allah, le monde ne vaut pas plus pour Allah que ce cadavre de brebis pour son propriétaire.» — Muslim (de Jabir). Tout dans ce monde est temporaire ; Al-Waarith outlast et hérite de tout.",
    },
  },

};

// ── Apply ──────────────────────────────────────────────────────────────────────
let total = 0;
for (const lang of LANGS) {
  const filePath = path.join(DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;
  for (const [id, patch] of Object.entries(fixes)) {
    if (!data[id]) continue;
    for (const [field, translations] of Object.entries(patch)) {
      if (translations[lang] !== undefined) {
        data[id][field] = translations[lang];
        changed++;
      }
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] ${changed} fields updated`);
  total += changed;
}
console.log(`\nTotal: ${total} fields fixed across ${LANGS.length} languages`);
