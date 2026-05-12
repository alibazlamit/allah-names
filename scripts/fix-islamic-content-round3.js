/**
 * Round 3 — comprehensive sweep of all remaining issues.
 * Run: node scripts/fix-islamic-content-round3.js
 */
const fs   = require('fs');
const path = require('path');
const LANGS = ['en','ar','bs','tr','ur','id','bn','fa','fr'];
const DIR   = path.join(__dirname, '../husna-mobile/data/details');

const fixes = {

  // Name 6 — Al-Mu'min: paraphrased Bukhari — restore authentic text
  6: {
    hadith: {
      en: "\"None of you truly believes until I am more beloved to him than his own son, his father, and all of mankind.\" — Bukhari (from Anas ibn Malik). The Prophet ﷺ is the living embodiment of Al-Mu'min's gift of faith — loving him is the mark of true belief.",
      ar: "\"لا يؤمن أحدكم حتى أكون أحب إليه من ولده ووالده والناس أجمعين.\" — البخاري (عن أنس بن مالك). النبي ﷺ هو التجسيد الحي لهبة المؤمن للإيمان.",
      bs: "\"Niko od vas neće istinski vjerovati sve dok mu ja ne budem draži od njegova sina, oca i svih ljudi.\" — Buhari (od Enesa ibn Malika). Vjerovjesnik ﷺ je živo utjelovljenje dara vjere od Al-Mu'mina.",
      tr: "\"Hiçbiriniz beni oğlundan, babasından ve tüm insanlardan daha çok sevmedikçe gerçek anlamda iman etmiş olmaz.\" — Buhari (Enes ibn Malik'ten).",
      ur: "\"تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک میں اسے اس کے بیٹے، باپ اور تمام لوگوں سے زیادہ محبوب نہ ہو جاؤں۔\" — بخاری (انس بن مالک سے)۔",
      id: "\"Tidak ada seorang pun di antara kalian yang benar-benar beriman sampai aku lebih dicintai olehnya daripada anaknya, ayahnya, dan seluruh manusia.\" — Bukhari (dari Anas ibn Malik).",
      bn: "\"তোমাদের মধ্যে কেউ ততক্ষণ পর্যন্ত সত্যিকার মুমিন হবে না যতক্ষণ না আমি তার কাছে তার সন্তান, পিতা এবং সমস্ত মানুষের চেয়ে বেশি প্রিয় না হই।\" — বুখারী (আনাস ইবন মালিক থেকে)।",
      fa: "«هیچ یک از شما به راستی ایمان نمی‌آورد تا آنکه من نزدش از فرزند، پدر و همه مردم محبوب‌تر باشم.» — بخاری (از انس بن مالک).",
      fr: "«Aucun de vous ne croit vraiment jusqu'à ce que je lui sois plus cher que son fils, son père et tous les gens.» — Bukhari (d'Anas ibn Malik).",
    },
  },

  // Name 22 — Al-Khafidh: change from humility/raising (same as 23 & 24)
  22: {
    hadith: {
      en: "\"Whoever has even an atom's weight of arrogance in his heart will not enter Paradise.\" A man said: 'What if a man likes to have good clothes and good shoes?' He said: 'Allah is beautiful and loves beauty. Arrogance is rejecting the truth and looking down on people.' — Muslim. Al-Khafidh abases the arrogant.",
      ar: "\"لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر. قال رجل: إن الرجل يحب أن يكون ثوبه حسناً ونعله حسنة؟ قال: إن الله جميل يحب الجمال، الكبر بطر الحق وغمط الناس.\" — مسلم. الخافض يُذلّ المتكبرين.",
      bs: "\"Niko s atomom oholosti u srcu neće ući u Džennet.' Čovjek reče: 'A što ako čovjek voli lijepu odjeću i lijepe cipele?' Reče: 'Allah je lijep i voli ljepotu. Oholost je odbacivanje istine i omalovažavanje ljudi.'\" — Muslim.",
      tr: "\"Kalbinde zerre kadar kibir olan kişi cennete giremez.' Bir adam: 'Ya güzel elbise ve güzel ayakkabı sevmek?' dedi. O: 'Allah güzeldir ve güzelliği sever. Kibir, hakkı reddetmek ve insanları küçük görmektir' dedi.\" — Müslim.",
      ur: "\"جس کے دل میں ذرہ برابر بھی تکبر ہو وہ جنت میں داخل نہیں ہو گا۔ ایک شخص نے کہا: آدمی اچھے کپڑے اور جوتے پسند کرے تو؟ آپ نے فرمایا: اللہ خوبصورت ہے اور خوبصورتی کو پسند کرتا ہے۔ تکبر حق کو رد کرنا اور لوگوں کو حقیر سمجھنا ہے۔\" — مسلم۔",
      id: "\"Tidak akan masuk surga orang yang memiliki seberat dzarrah kesombongan dalam hatinya.' Seseorang berkata: 'Bagaimana jika seseorang menyukai pakaian dan alas kaki yang bagus?' Beliau bersabda: 'Allah itu indah dan menyukai keindahan. Kesombongan adalah menolak kebenaran dan meremehkan orang lain.'\" — Muslim.",
      bn: "\"যার হৃদয়ে একটি অণু পরিমাণ অহংকার আছে সে জান্নাতে প্রবেশ করবে না।' একজন বলল: 'একজন মানুষ সুন্দর পোশাক এবং জুতা পছন্দ করলে?' তিনি বললেন: 'আল্লাহ সুন্দর এবং সৌন্দর্য পছন্দ করেন। অহংকার হলো সত্যকে প্রত্যাখ্যান করা এবং মানুষকে তুচ্ছ করা।'\" — মুসলিম।",
      fa: "«کسی که ذره‌ای تکبر در دلش باشد وارد بهشت نمی‌شود.' مردی گفت: اگر کسی لباس و کفش خوب دوست داشته باشد چه؟ فرمود: الله زیباست و زیبایی را دوست دارد. تکبر رد کردن حق و خوار شمردن مردم است.» — مسلم.",
      fr: "«Nul n'entrera au Paradis avec un atome d'orgueil dans son cœur.' Un homme dit : 'Et si un homme aime de beaux habits et de belles chaussures ?' Il dit : 'Allah est beau et aime la beauté. L'orgueil, c'est rejeter la vérité et mépriser les gens.'» — Muslim.",
    },
  },

  // Name 24 — Al-Mu'izz: change from humility/raising (same as 22 & 23)
  24: {
    hadith: {
      en: "\"Indeed Allah raises peoples through this Book and degrades others by it.\" — Muslim (from 'Umar ibn al-Khattab, who narrated it from the Prophet ﷺ). Al-Mu'izz bestows honor through the Quran — the highest honor is closeness to His word.",
      ar: "\"إن الله يرفع بهذا الكتاب أقواماً ويضع به آخرين.\" — مسلم (عن عمر بن الخطاب عن النبي ﷺ). المعزّ يمنح الشرف بالقرآن.",
      bs: "\"Zaista Allah uzdiže narode ovom Knjigom i ponižava druge njome.\" — Muslim (od Omera ibn al-Hattaba, koji ga je prenio od Vjerovjesnika ﷺ). Al-Mu'izz daje čast kroz Kur'an.",
      tr: "\"Gerçekten Allah bu Kitapla bazı milletleri yükseltir ve diğerlerini alçaltır.\" — Müslim (Resulullah'tan nakleden Ömer ibn el-Hattab'dan). El-Mu'izz, Kur'an aracılığıyla onur verir.",
      ur: "\"بے شک اللہ اس کتاب کے ذریعے کچھ قوموں کو اونچا کرتا ہے اور دوسروں کو نیچا۔\" — مسلم (عمر بن الخطاب سے جنہوں نے نبی ﷺ سے روایت کی)۔ المعزّ قرآن کے ذریعے عزت عطا کرتا ہے۔",
      id: "\"Sesungguhnya Allah meninggikan bangsa-bangsa melalui Kitab ini dan merendahkan yang lain dengannya.\" — Muslim (dari Umar ibn al-Khattab yang meriwayatkannya dari Nabi ﷺ). Al-Mu'izz menganugerahkan kehormatan melalui Al-Qur'an.",
      bn: "\"নিশ্চয়ই আল্লাহ এই কিতাবের মাধ্যমে কিছু জাতিকে উঁচু করেন এবং অন্যদের নিচু করেন।\" — মুসলিম ('উমর ইবনুল খাত্তাব থেকে যিনি নবী ﷺ থেকে বর্ণনা করেছেন)।",
      fa: "«الله با این کتاب برخی اقوام را بلند می‌کند و برخی دیگر را پایین می‌آورد.» — مسلم (از عمر بن خطاب که از پیامبر ﷺ روایت کرده است).",
      fr: "«En vérité, Allah élève des peuples grâce à ce Livre et en abaisse d'autres par lui.» — Muslim (d'Umar ibn al-Khattab, qui l'a rapporté du Prophète ﷺ). Al-Mu'izz confère l'honneur par le Coran.",
    },
  },

  // Name 26 — As-Sami': Quran 58:1 was in hadith field — use Aisha's narration instead
  26: {
    quran_surahs: {
      en: "45 times in the Quran. Paired constantly with Al-Basir (the Seeing). Surah Al-Mujadilah (58:1) was revealed when Allah heard the plea of Khawla bint Tha'laba. Surah Al-Isra (17:1), Al-Hajj (22:61, 22:75), Al-Hujurat (49:18).",
      ar: "وردت ٤٥ مرة في القرآن. مقرونة دائماً بالبصير. نزلت سورة المجادلة (٥٨:١) حين سمع الله شكوى خولة بنت ثعلبة. سورة الإسراء (١٧:١) والحج (٢٢:٦١) والحجرات (٤٩:١٨).",
      bs: "45 puta u Kur'anu. Uvijek u paru s Al-Basirom. Sura Al-Mudžadala (58:1) objavljena je kada je Allah čuo molbu Khavle bint Tha'labe. Sura Al-Isra (17:1), Al-Hadž (22:61, 22:75), Al-Hudžurat (49:18).",
      tr: "Kur'an'da 45 kez geçer. Her zaman El-Basir ile eşleştirilir. Mücadile suresi (58:1), Allah'ın Havle bint Sa'lebe'nin yakarışını duymasıyla indirildi. İsra (17:1), Hac (22:61, 22:75), Hucurat (49:18).",
      ur: "قرآن میں ٤٥ مرتبہ۔ ہمیشہ البصیر کے ساتھ جوڑا۔ سورۃ المجادلہ (٥٨:١) اس وقت نازل ہوئی جب اللہ نے خولہ بنت ثعلبہ کی فریاد سنی۔ سورۃ الإسراء (١٧:١)، الحج (٢٢:٦١، ٢٢:٧٥)، الحجرات (٤٩:١٨)۔",
      id: "45 kali dalam Al-Qur'an. Selalu berpasangan dengan Al-Basir. Surah Al-Mujadilah (58:1) diturunkan ketika Allah mendengar permohonan Khawla bint Tha'laba. Surah Al-Isra (17:1), Al-Hajj (22:61, 22:75), Al-Hujurat (49:18).",
      bn: "কুরআনে ৪৫ বার। সর্বদা আল-বাসীরের সাথে যুক্ত। সূরা আল-মুজাদালা (৫৮:১) নাযিল হয়েছিল যখন আল্লাহ খাওলা বিনত সা'লাবার আবেদন শুনলেন। সূরা আল-ইসরা (১৭:১), আল-হাজ্জ (২২:৬১, ২২:৭৫), আল-হুজুরাত (৪৯:১৮)।",
      fa: "۴۵ بار در قرآن. همیشه با البصیر جفت می‌شود. سوره المجادله (۵۸:۱) هنگامی نازل شد که الله درخواست خوله بنت ثعلبه را شنید. سوره الإسراء (۱۷:۱)، الحج (۲۲:۶۱، ۲۲:۷۵)، الحجرات (۴۹:۱۸).",
      fr: "45 fois dans le Coran. Toujours associé à Al-Basir. La sourate Al-Mujadilah (58:1) a été révélée quand Allah entendit la supplique de Khawla bint Tha'laba. Sourate Al-Isra (17:1), Al-Hajj (22:61, 22:75), Al-Hujurat (49:18).",
    },
    hadith: {
      en: "'Aisha said: \"Glory be to the One whose hearing encompasses all things. I heard some of what Khawla said but some was hidden from me — and yet Allah heard her complaint from above seven heavens.\" — Bukhari (context of Surah Al-Mujadilah). As-Sami' hears what even those present cannot.",
      ar: "قالت عائشة رضي الله عنها: \"سبحان الذي وسع سمعه الأصوات، لقد سمعت بعض كلامها ويخفى علي بعضه، وقد سمع الله تعالى قولها من فوق سبع سماوات.\" — البخاري (في سياق نزول سورة المجادلة).",
      bs: "Aiša je rekla: \"Slava Onome čiji sluh obuhvata sve glasove. Čula sam nešto od onoga što je rekla, ali mi je dio bio skriven — a Allah je čuo njenu žalbu iznad sedam nebesa.\" — Buhari (u kontekstu sure Al-Mudžadala).",
      tr: "Aişe şöyle dedi: \"Her sesi işiten Allah'ı tenzih ederim. Ben o kadının sözlerinin bir kısmını duydum, bir kısmı ise benden gizliydi — oysa Allah onun şikâyetini yedi semanın üzerinden işitti.\" — Buhari (Mücadele suresinin nüzul sebebi).",
      ur: "حضرت عائشہ نے فرمایا: \"پاک ہے وہ ذات جس کی سماعت تمام آوازوں کو محیط ہے۔ میں نے اس کی کچھ باتیں سنیں اور کچھ مجھ سے مخفی رہیں — پھر بھی اللہ نے سات آسمانوں کے اوپر سے اس کی شکایت سنی۔\" — بخاری (سورۃ المجادلہ کے نزول کے سیاق میں)۔",
      id: "Aisyah berkata: \"Mahasuci Dzat yang pendengarannya mencakup segala suara. Aku mendengar sebagian dari apa yang dia katakan namun sebagiannya tersembunyi dariku — namun Allah mendengar keluhannya dari atas tujuh langit.\" — Bukhari (konteks turunnya Surah Al-Mujadilah).",
      bn: "আয়িশা বললেন: \"পবিত্র তিনি যাঁর শ্রবণ সমস্ত কণ্ঠস্বর অন্তর্ভুক্ত করে। আমি তার কথার কিছু অংশ শুনলাম কিন্তু কিছু আমার কাছ থেকে লুকানো ছিল — তবুও আল্লাহ সাত আকাশের উপর থেকে তার অভিযোগ শুনলেন।\" — বুখারী (সূরা আল-মুজাদালার নাযিলের প্রেক্ষাপটে)।",
      fa: "عایشه گفت: «پاک است آن که شنواییش همه صداها را فرا می‌گیرد. من برخی از سخنانش را شنیدم اما برخی دیگر از من پنهان ماند — با این حال الله شکایتش را از فراز هفت آسمان شنید.» — بخاری (در سیاق نزول سوره المجادله).",
      fr: "Aïcha dit : «Gloire à Celui dont l'ouïe encompasse tous les sons. J'ai entendu une partie de ce qu'elle disait mais une partie m'était cachée — et pourtant Allah a entendu sa plainte depuis au-dessus de sept cieux.» — Bukhari (contexte de la révélation de la sourate Al-Mujadilah).",
    },
  },

  // Name 27 — Al-Basir: duplicate of Name 7 hadith
  27: {
    hadith: {
      en: "\"Allah does not look at your bodies or your wealth. He looks at your hearts and your deeds.\" — Muslim (from Abu Hurayrah). Al-Basir's sight penetrates to what is invisible to others — the inner reality of the heart.",
      ar: "\"إن الله لا ينظر إلى صوركم وأموالكم، ولكن ينظر إلى قلوبكم وأعمالكم.\" — مسلم (عن أبي هريرة). نظر البصير يخترق ما لا يراه الآخرون — حقيقة القلب الداخلية.",
      bs: "\"Allah ne gleda u vaše izglede ili bogatstvo. On gleda u vaša srca i vaša djela.\" — Muslim (od Ebu Hurejre). Al-Basirov pogled prodire do onoga što je nevidljivo drugima — unutarnju stvarnost srca.",
      tr: "\"Allah ne suretlerinize ne de mallarınıza bakar. Kalplerinize ve amellerinize bakar.\" — Müslim (Ebu Hüreyre'den). El-Basir'in görüşü, başkalarına görünmeyene — kalbin iç gerçeğine — nüfuz eder.",
      ur: "\"اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا۔ وہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔\" — مسلم (ابو ہریرہ سے)۔ البصیر کی نظر وہاں تک پہنچتی ہے جو دوسروں کو نظر نہیں آتی — دل کی باطنی حقیقت۔",
      id: "\"Allah tidak melihat bentuk tubuh atau harta kalian. Dia melihat hati dan perbuatan kalian.\" — Muslim (dari Abu Hurairah). Penglihatan Al-Basir menembus apa yang tidak terlihat orang lain — realitas batin hati.",
      bn: "\"আল্লাহ তোমাদের চেহারা বা সম্পদের দিকে তাকান না। তিনি তোমাদের হৃদয় এবং কাজের দিকে তাকান।\" — মুসলিম (আবু হুরায়রা থেকে)। আল-বাসীরের দৃষ্টি সেখানে পৌঁছায় যা অন্যরা দেখতে পায় না — হৃদয়ের অভ্যন্তরীণ সত্য।",
      fa: "«الله به ظاهر و مال شما نمی‌نگرد. به دل‌ها و اعمال شما می‌نگرد.» — مسلم (از ابوهریره). دیدِ البصیر به آنچه دیگران نمی‌بینند نفوذ می‌کند — واقعیت درونی دل.",
      fr: "«Allah ne regarde pas vos formes ou vos richesses. Il regarde vos cœurs et vos actes.» — Muslim (d'Abu Hurayrah). Le regard d'Al-Basir pénètre ce qui est invisible aux autres — la réalité intérieure du cœur.",
    },
  },

  // Name 30 — Al-Latif: no hadith — replace narrative with Hadith Qudsi
  30: {
    hadith: {
      en: "\"My servant does not draw near to Me with anything more beloved to Me than what I have made obligatory on him. My servant continues drawing near to Me with voluntary acts until I love him. When I love him, I am his hearing with which he hears, his sight with which he sees, his hand with which he strikes, and his foot with which he walks.\" — Bukhari (Hadith Qudsi). Al-Latif works through the subtlest channels when He loves a servant.",
      ar: "\"ما تقرب إليّ عبدي بشيء أحب إليّ مما افترضته عليه، وما يزال عبدي يتقرب إليّ بالنوافل حتى أحبه، فإذا أحببته كنت سمعه الذي يسمع به، وبصره الذي يبصر به، ويده التي يبطش بها، ورجله التي يمشي بها.\" — البخاري (حديث قدسي). اللطيف يعمل من أدق القنوات عندما يُحبّ عبده.",
      bs: "\"Moj rob Mi se ne može približiti ničim što mi je draže od onoga što sam mu propisao. I Moj rob se neprestano Meni približava nafilama dok ga ne zavolim. Kada ga zavolim, budem sluh kojim čuje, vid kojim gleda, ruka kojom udara i noga kojom hoda.\" — Buhari (Hadith Qudsi).",
      tr: "\"Kulum, üzerine farz kıldığım şeylerden daha sevimli bir şeyle Bana yaklaşamaz. Kulum nafilelerle Bana yaklaşmaya devam eder, nihayet onu severim. Onu sevince, onun işittiği kulağı, gördüğü gözü, vurduğu eli ve yürüdüğü ayağı olurum.\" — Buhari (Hadis Kudsi).",
      ur: "\"میرا بندہ کسی بھی چیز سے اتنا میرے قریب نہیں ہو سکتا جتنا ان فرائض سے جو میں نے اس پر عائد کیے۔ پھر وہ نوافل کے ذریعے قریب ہوتا رہتا ہے یہاں تک کہ میں اس سے محبت کرنے لگتا ہوں۔ جب میں اس سے محبت کرتا ہوں تو میں اس کا وہ کان بن جاتا ہوں جس سے وہ سنتا ہے، وہ آنکھ جس سے دیکھتا ہے، وہ ہاتھ جس سے پکڑتا ہے، اور وہ پاؤں جس سے چلتا ہے۔\" — بخاری (حدیث قدسی)۔",
      id: "\"Hamba-Ku tidak dapat mendekatkan diri kepada-Ku dengan sesuatu yang lebih Aku cintai dari apa yang Aku wajibkan atasnya. Hamba-Ku terus mendekatkan diri kepada-Ku dengan amalan sunnah hingga Aku mencintainya. Jika Aku mencintainya, Aku menjadi pendengarannya yang dengannya ia mendengar, penglihatannya yang dengannya ia melihat, tangannya yang dengannya ia bertindak, dan kakinya yang dengannya ia berjalan.\" — Bukhari (Hadits Qudsi).",
      bn: "\"আমার বান্দা এমন কিছু দিয়ে আমার কাছাকাছি হতে পারে না যা আমি তার উপর ফরয করেছি তার চেয়ে বেশি প্রিয়। আমার বান্দা নফল কাজের মাধ্যমে আমার কাছাকাছি হতে থাকে যতক্ষণ না আমি তাকে ভালোবাসি। যখন আমি তাকে ভালোবাসি, আমি তার কান হয়ে যাই যা দিয়ে সে শোনে, তার চোখ যা দিয়ে দেখে, তার হাত যা দিয়ে আঁকড়ে ধরে, এবং তার পা যা দিয়ে হাঁটে।\" — বুখারী (হাদীস কুদসী)।",
      fa: "«بنده‌ام با هیچ چیز محبوب‌تر از آنچه واجب کرده‌ام به من تقرب نمی‌جوید. بنده‌ام با نوافل به من نزدیک می‌شود تا محبوبم شود. وقتی محبوبم شد، شنوایی او که با آن می‌شنود، بینایی که با آن می‌بیند، دستی که با آن می‌زند و پایی که با آن راه می‌رود می‌شوم.» — بخاری (حدیث قدسی).",
      fr: "«Mon serviteur ne se rapproche pas de Moi avec quelque chose de plus aimé de Moi que ce que Je lui ai rendu obligatoire. Mon serviteur continue à se rapprocher de Moi par les actes surérogatoires jusqu'à ce que Je l'aime. Quand Je l'aime, Je suis son ouïe par laquelle il entend, sa vue par laquelle il voit, sa main avec laquelle il frappe, et son pied avec lequel il marche.» — Bukhari (Hadith Qudsi).",
    },
  },

  // Name 40 — Al-Haseeb: duplicate of Name 52 — use reckoning hadith
  40: {
    hadith: {
      en: "\"On the Day of Judgment, the two feet of the son of Adam will not move until he is asked about five things: his life and how he spent it; his youth and how he used it; his wealth and how he earned it and spent it; and what he did with his knowledge.\" — Tirmidhi (authenticated). Al-Haseeb's reckoning is precise and comprehensive.",
      ar: "\"لا تزول قدما عبد يوم القيامة حتى يُسأل عن خمس: عن عمره فيم أفناه، وعن شبابه فيم أبلاه، وعن ماله من أين اكتسبه وفيم أنفقه، وماذا عمل فيما علم.\" — الترمذي (صحيح). محاسبة الحسيب دقيقة وشاملة.",
      bs: "\"Noge Ademovog potomka neće se pomaknuti na Sudnjem danu dok ne bude pitan o petero: svom životu i kako ga je proveo; svojoj mladosti i kako je u njoj živio; svom imetku odakle ga je stekao i kako ga je potrošio; i što je činio sa znanjem koje je imao.\" — Tirmizi (sahih).",
      tr: "\"Kıyamet gününde Ademoğlunun iki ayağı beş şeyden sorulmadan yerinden kımıldamayacak: Ömrünü nerede tükettiğinden; gençliğini nasıl geçirdiğinden; malını nereden kazanıp nereye harcadığından; ve ilmiyle ne yaptığından.\" — Tirmizi (sahih).",
      ur: "\"قیامت کے دن آدم کے بیٹے کے دونوں قدم پانچ چیزوں کے بارے میں پوچھے بغیر نہیں ہلیں گے: اپنی عمر اور اسے کیسے گزارا؛ اپنی جوانی اور اسے کیسے صرف کیا؛ اپنے مال کو کہاں سے کمایا اور کہاں خرچ کیا؛ اور اپنے علم کے ساتھ کیا کیا۔\" — ترمذی (صحیح)۔",
      id: "\"Kedua kaki anak Adam tidak akan bergerak pada Hari Kiamat sebelum ditanya tentang lima hal: umurnya dan bagaimana ia habiskan; masa mudanya dan bagaimana ia gunakan; hartanya dari mana ia peroleh dan ke mana ia belanjakan; dan apa yang ia lakukan dengan ilmunya.\" — Tirmidzi (shahih).",
      bn: "\"কিয়ামতের দিন আদম সন্তানের দুই পা না সরানো পর্যন্ত পাঁচটি বিষয় সম্পর্কে জিজ্ঞাসা করা হবে: তার জীবন এবং কীভাবে কাটিয়েছে; তার যৌবন এবং কীভাবে ব্যয় করেছে; তার সম্পদ কোথা থেকে উপার্জন করেছে এবং কোথায় ব্যয় করেছে; এবং সে তার জ্ঞান দিয়ে কী করেছে।\" — তিরমিযী (সহীহ)।",
      fa: "«دو پای فرزند آدم در روز قیامت از جایش نمی‌رود تا از پنج چیز پرسیده شود: از عمرش که در چه راهی گذراند؛ از جوانیش که در چه راهی صرف کرد؛ از مالش که از کجا به دست آورد و در کجا هزینه کرد؛ و از اینکه با علمش چه کرد.» — ترمذی (صحیح).",
      fr: "«Les deux pieds du fils d'Adam ne bougeront pas le Jour du Jugement avant qu'il ne soit interrogé sur cinq choses : sa vie et comment il l'a passée ; sa jeunesse et comment il l'a utilisée ; sa richesse d'où il l'a gagnée et comment il l'a dépensée ; et ce qu'il a fait avec son savoir.» — Tirmidhi (authentifié).",
    },
  },

  // Name 41 — Al-Jaleel: duplicate of Name 37 — use Azeem glorification
  41: {
    hadith: {
      en: "\"Two words are light on the tongue, heavy on the scales, and beloved to Ar-Rahman: Subhanallahi wa bihamdih, Subhanallahil-Azeem.\" — Bukhari & Muslim. The glorification of Al-Azeem (the Magnificent) resonates with Al-Jaleel's majesty — these words are the tongue's acknowledgment of His incomparable greatness.",
      ar: "\"كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم.\" — البخاري ومسلم. تمجيد العظيم يتردد صداه مع جلال الجليل.",
      bs: "\"Dvije riječi su lake na jeziku, teške na vagi, i drage Ar-Rahmanu: Subhanallahi wa bihamdihi, Subhanallahil-Azim.\" — Buhari i Muslim. Veličanje Al-Azima odražava se u veličanstvenosti Al-Jaleela.",
      tr: "\"İki kelime dilde hafif, mizanda ağır ve Ar-Rahman'a sevimlidir: Subhanallahi ve bihamdihi, Subhanallahil-Azim.\" — Buhari ve Müslim. El-Azim'in yüceltilmesi El-Jalil'in azametiyle örtüşür.",
      ur: "\"دو کلمے زبان پر ہلکے، میزان میں بھاری، اور الرحمان کو محبوب ہیں: سبحان اللہ وبحمده، سبحان اللہ العظیم۔\" — بخاری ومسلم۔ العظیم کی تسبیح الجلیل کی عظمت سے مطابقت رکھتی ہے۔",
      id: "\"Dua kata yang ringan di lidah, berat di timbangan, dan dicintai oleh Ar-Rahman: Subhanallahi wa bihamdihi, Subhanallahil-Azim.\" — Bukhari & Muslim. Memuliakan Al-Azim beresonansi dengan keagungan Al-Jaleel.",
      bn: "\"দুটি কথা জিহ্বায় হালকা, মিজানে ভারী এবং আর-রহমানের কাছে প্রিয়: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযীম।\" — বুখারী ও মুসলিম। আল-আযীমের তসবীহ আল-জালীলের মহিমার সাথে সামঞ্জস্যপূর্ণ।",
      fa: "«دو کلمه بر زبان سبک، در ترازو سنگین، و نزد الرحمان محبوب‌اند: سبحان الله وبحمده، سبحان الله العظیم.» — بخاری و مسلم. تمجید العظیم با جلال الجلیل همخوانی دارد.",
      fr: "«Deux mots sont légers sur la langue, lourds dans la balance et aimés d'Ar-Rahman : Subhanallahi wa bihamdihi, Subhanallahil-Azim.» — Bukhari & Muslim. La glorification d'Al-Azim résonne avec la majesté d'Al-Jaleel.",
    },
  },

  // Name 45 — Al-Wasi': Quran 7:156 in hadith field
  45: {
    hadith: {
      en: "\"Allah the Almighty said: 'If My servant intends to do a good deed and does not do it, I record one good deed for him. If he intends it and does it, I record ten to seven hundred times, even many more. If he intends an evil deed and does not do it, I record one good deed for him.\" — Bukhari & Muslim (Hadith Qudsi). Al-Wasi's encompassing mercy rewards even good intentions.",
      ar: "\"قال الله عز وجل: إذا هَمَّ عبدي بحسنة ولم يعملها كتبتها له حسنة، فإن عملها كتبتها له عشر حسنات إلى سبعمائة ضعف. وإذا هَمَّ بسيئة ولم يعملها كتبتها له حسنة.\" — البخاري ومسلم (حديث قدسي). رحمة الواسع الشاملة تُجزي حتى النيات الحسنة.",
      bs: "\"Allah Svemogući rekao je: 'Ako Moj rob namjeri dobro djelo i ne uradi ga, zapišem mu jednu nagradu. Ako to namjeri i uradi, zapišem mu od deset do sedam stotina puta, čak i više. Ako namjeri loše djelo i ne uradi ga, zapišem mu jednu dobru nagradu.'\" — Buhari i Muslim (Hadith Qudsi).",
      tr: "\"Yüce Allah buyurdu: 'Kulum bir iyilik yapmayı niyet eder de yapmazsa, ona bir iyilik yazarım. Niyet eder ve yaparsa, on iyilikten yedi yüze kadar, hatta daha da çok yazarım. Kötülük yapmayı niyet eder de yapmazsa, ona bir iyilik yazarım.'\" — Buhari ve Müslim (Hadis Kudsi).",
      ur: "\"اللہ عزوجل نے فرمایا: جب میرا بندہ نیک عمل کا ارادہ کرے اور نہ کرے تو میں اسے ایک نیکی لکھ دیتا ہوں۔ اگر وہ کرے تو دس سے سات سو تک بلکہ اس سے بھی زیادہ لکھتا ہوں۔ اگر برائی کا ارادہ کرے اور نہ کرے تو اسے ایک نیکی لکھ دیتا ہوں۔\" — بخاری ومسلم (حدیث قدسی)۔",
      id: "\"Allah Yang Maha Agung berfirman: 'Jika hamba-Ku berniat melakukan kebaikan namun tidak melakukannya, Aku mencatat satu kebaikan untuknya. Jika ia berniat dan melakukannya, Aku mencatat sepuluh hingga tujuh ratus kali lipat, bahkan lebih. Jika ia berniat melakukan keburukan namun tidak melakukannya, Aku mencatat satu kebaikan untuknya.'\" — Bukhari & Muslim (Hadits Qudsi).",
      bn: "\"আল্লাহ সর্বশক্তিমান বললেন: 'আমার বান্দা যদি একটি ভালো কাজের ইচ্ছা করে এবং না করে, তবে আমি তার জন্য একটি ভালো কাজ লিখে দিই। যদি ইচ্ছা করে এবং করে, তবে দশ থেকে সাত শত গুণ পর্যন্ত এমনকি আরও বেশি লিখি। যদি একটি খারাপ কাজের ইচ্ছা করে এবং না করে, তবে তার জন্য একটি ভালো কাজ লিখে দিই।'\" — বুখারী ও মুসলিম (হাদীস কুদসী)।",
      fa: "«الله عزوجل فرمود: هرگاه بنده‌ام قصد کار نیکی داشته باشد و انجام ندهد، یک حسنه برایش می‌نویسم. اگر قصد کند و انجام دهد، از ده تا هفتصد برابر، بلکه بیشتر می‌نویسم. اگر قصد کار بدی داشته باشد و انجام ندهد، یک حسنه برایش می‌نویسم.» — بخاری و مسلم (حدیث قدسی).",
      fr: "«Allah le Tout-Puissant a dit : 'Si Mon serviteur a l'intention de faire une bonne action et ne la fait pas, J'enregistre une bonne action pour lui. S'il en a l'intention et la fait, J'enregistre de dix à sept cents fois, voire davantage. S'il a l'intention de faire une mauvaise action et ne la fait pas, J'enregistre une bonne action pour lui.'» — Bukhari & Muslim (Hadith Qudsi).",
    },
  },

  // Name 46 — Al-Hakeem: vague unverifiable citation
  46: {
    hadith: {
      en: "\"No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim — not even the prick of a thorn — except that Allah expiates some of his sins for it.\" — Bukhari & Muslim (from Abu Sa'id al-Khudri and Abu Hurayrah). Al-Hakeem's wisdom ensures that even the smallest suffering carries purpose.",
      ar: "\"ما يُصيب المسلم من نَصَب ولا وَصَب ولا هَمٍّ ولا حَزَن ولا أذى ولا غَمٍّ، حتى الشوكة يُشاكُها، إلا كفّر الله بها من خطاياه.\" — البخاري ومسلم (عن أبي سعيد الخدري وأبي هريرة). حكمة الحكيم تضمن أن حتى أصغر المعاناة يحمل غاية.",
      bs: "\"Ništa ne snađe muslimana od umora, ni bolesti, ni brige, ni tuge, ni ozljede, ni jada — čak ni ubod trna — a da mu Allah time ne oprosti neke od njegovih grijeha.\" — Buhari i Muslim.",
      tr: "\"Müslümana isabet eden yorgunluk, hastalık, üzüntü, keder, eziyet ve sıkıntıdan — hatta bir dikenin batmasından bile — Allah mutlaka onun günahlarını bununla bağışlar.\" — Buhari ve Müslim.",
      ur: "\"مسلمان کو جو بھی تھکاوٹ، بیماری، غم، پریشانی، تکلیف یا دکھ پہنچے — حتیٰ کہ کانٹا بھی چبھے — اللہ اس کے بدلے اس کے گناہ معاف کر دیتا ہے۔\" — بخاری ومسلم (ابو سعید خدری اور ابو ہریرہ سے)۔",
      id: "\"Tidak ada yang menimpa seorang Muslim berupa kelelahan, penyakit, kesedihan, dukacita, gangguan, dan kekhawatiran — bahkan tusukan duri pun — kecuali Allah menghapus sebagian dosanya karenanya.\" — Bukhari & Muslim.",
      bn: "\"কোনো মুসলিমকে ক্লান্তি, রোগ, দুঃখ, বেদনা, কষ্ট বা পেরেশানি স্পর্শ করে না — এমনকি একটি কাঁটাও বিঁধলে — আল্লাহ তার বিনিময়ে তার কিছু পাপ মোচন করে দেন।\" — বুখারী ও মুসলিম।",
      fa: "«هیچ مسیبتی به مسلمان نمی‌رسد — نه خستگی، نه بیماری، نه اندوه، نه غم، نه آزار و نه نگرانی، حتی خاری که به او فرو می‌رود — مگر اینکه الله به سبب آن برخی گناهانش را می‌آمرزد.» — بخاری و مسلم.",
      fr: "«Aucune fatigue, ni maladie, ni souci, ni tristesse, ni mal, ni détresse n'atteint le musulman — pas même la piqûre d'une épine — sans qu'Allah n'expie pour lui certains de ses péchés.» — Bukhari & Muslim.",
    },
  },

  // Name 53 — Al-Qawiyy: keep, but Name 70 (Al-Muqtadir) must be different
  70: {
    hadith: {
      en: "\"Allah gives respite to the oppressor. But when He seizes him, He does not let him go.\" — Bukhari & Muslim (from Abu Musa al-Ash'ari). Al-Muqtadir's power, when fully exercised, is absolute and inescapable — history confirms no oppressor has outlasted His decree.",
      ar: "\"إن الله يُملي للظالم حتى إذا أخذه لم يُفلِته.\" — البخاري ومسلم (عن أبي موسى الأشعري). قدرة المقتدر لا تُقاوَم حين تُنفَّذ كاملاً.",
      bs: "\"Allah daje odgodu tlačitelju. Ali kada ga uhvati, ne pušta ga.\" — Buhari i Muslim (od Ebu Musa el-Eš'arija). Al-Muqtadirova moć, kada se u potpunosti iskoristi, apsolutna je i neizbježna.",
      tr: "\"Allah zalime mühlet verir. Ama onu yakaladığında bırakmaz.\" — Buhari ve Müslim (Ebu Musa el-Eş'ari'den). El-Muktedir'in gücü, tam olarak kullanıldığında mutlak ve kaçınılmazdır.",
      ur: "\"اللہ ظالم کو مہلت دیتا ہے۔ لیکن جب اسے پکڑتا ہے تو چھوڑتا نہیں۔\" — بخاری ومسلم (ابو موسیٰ اشعری سے)۔ المقتدر کی قدرت جب پوری طرح نافذ ہو تو مطلق اور ناگزیر ہے۔",
      id: "\"Allah memberi tangguh kepada orang zalim. Namun ketika Dia menangkapnya, Dia tidak melepaskannya.\" — Bukhari & Muslim (dari Abu Musa al-Ash'ari). Kekuasaan Al-Muqtadir, ketika sepenuhnya dijalankan, mutlak dan tak terelakkan.",
      bn: "\"আল্লাহ অত্যাচারীকে অবকাশ দেন। কিন্তু যখন তাকে পাকড়াও করেন, ছাড়েন না।\" — বুখারী ও মুসলিম (আবু মুসা আল-আশ'আরী থেকে)। আল-মুক্তাদিরের শক্তি পূর্ণরূপে প্রয়োগ হলে তা পরম এবং অপ্রতিরোধ্য।",
      fa: "«الله به ستمگر مهلت می‌دهد. اما وقتی او را می‌گیرد، رهایش نمی‌کند.» — بخاری و مسلم (از ابوموسی اشعری). قدرت المقتدر، وقتی به تمامی اعمال می‌شود، مطلق و گریزناپذیر است.",
      fr: "«Allah accorde un sursis à l'oppresseur. Mais quand Il le saisit, Il ne le lâche pas.» — Bukhari & Muslim (d'Abu Musa al-Ash'ari). La puissance d'Al-Muqtadir, quand elle est pleinement exercée, est absolue et inévitable.",
    },
  },

  // Name 54 — Al-Mateen: sleep/scales hadith belongs to Al-Qayyoom — fix
  54: {
    hadith: {
      en: "\"Tie your camel, then put your trust in Allah.\" — Tirmidhi (from Anas ibn Malik, authenticated). After you have done what you can, rely on Al-Mateen — whose resolve is unshakeable and whose decree cannot be altered by any force.",
      ar: "\"اعقل ناقتك ثم توكل على الله.\" — الترمذي (عن أنس بن مالك، حسن). بعد أن تأخذ بالأسباب، توكل على المتين الذي لا يُغيَّر حكمه.",
      bs: "\"Svežite devu, a potom se oslonite na Allaha.\" — Tirmizi (od Enesa ibn Malika, hasan). Nakon što učinite što možete, oslonite se na Al-Mateena čija je odluka nepokolebljiva.",
      tr: "\"Deveni bağla, sonra Allah'a tevekkül et.\" — Tirmizi (Enes ibn Malik'ten, hasen). Elinizden geleni yaptıktan sonra, kararlılığı sarsılmaz Al-Mateen'e güvenin.",
      ur: "\"اونٹ باندھو پھر اللہ پر توکل کرو۔\" — ترمذی (انس بن مالک سے، حسن)۔ جو کر سکتے ہو کرنے کے بعد المتین پر توکل کرو جس کا فیصلہ کوئی طاقت نہیں بدل سکتی۔",
      id: "\"Tambatkan untamu, kemudian bertawakallah kepada Allah.\" — Tirmidzi (dari Anas ibn Malik, hasan). Setelah melakukan apa yang Anda bisa, bertawakallah kepada Al-Mateen yang keputusan-Nya tidak tergoyahkan.",
      bn: "\"তোমার উট বেঁধে রাখো, তারপর আল্লাহর উপর তাওয়াক্কুল করো।\" — তিরমিযী (আনাস ইবন মালিক থেকে, হাসান)। যা করার করার পর আল-মাতীনের উপর ভরসা রাখো যাঁর সিদ্ধান্ত কোনো শক্তি পরিবর্তন করতে পারে না।",
      fa: "«شترت را ببند، سپس بر الله توکل کن.» — ترمذی (از انس بن مالک، حسن). پس از اینکه هرچه در توانت بود انجام دادی، بر المتین توکل کن که تصمیمش تزلزل‌ناپذیر است.",
      fr: "«Attache ton chameau, puis mets ta confiance en Allah.» — Tirmidhi (d'Anas ibn Malik, hasan). Après avoir fait ce que vous pouvez, faites confiance à Al-Mateen — dont la résolution est inébranlable.",
    },
  },

  // Name 57 — Al-Muhsee: "Based on Quran 99:7-8" — real hadith
  57: {
    hadith: {
      en: "\"Your deeds are presented to Allah on Monday and Thursday. And I love that my deeds be presented while I am fasting.\" — Muslim (from Abu Hurayrah, explaining why the Prophet fasted on those days). Al-Muhsee's counting is reviewed before Allah twice every week — nothing is overlooked.",
      ar: "\"تُعرض الأعمال يوم الاثنين والخميس، وأنا أحب أن يُعرض عملي وأنا صائم.\" — مسلم (عن أبي هريرة). مراجعة المُحصي تُعرض على الله مرتين في الأسبوع.",
      bs: "\"Vaša djela se predočuju Allahu u ponedjeljak i četvrtak. I volim da moja djela budu predočena dok postim.\" — Muslim (od Ebu Hurejre). Al-Muhs'eovo prebrojavanje pregledava se pred Allahom dva puta sedmično.",
      tr: "\"Ameller, pazartesi ve perşembe günleri Allah'a arz edilir. Ben amellerimin oruçlu iken arz edilmesini severim.\" — Müslim (Ebu Hüreyre'den). El-Muhsi'nin hesabı her hafta iki kez Allah'a sunulur.",
      ur: "\"اعمال پیر اور جمعرات کو اللہ کے سامنے پیش کیے جاتے ہیں۔ اور میں چاہتا ہوں کہ میرے اعمال روزے کی حالت میں پیش ہوں۔\" — مسلم (ابو ہریرہ سے)۔ المحصی کی گنتی ہر ہفتے دو مرتبہ اللہ کے سامنے پیش ہوتی ہے۔",
      id: "\"Amal-amal kalian dihadapkan kepada Allah pada hari Senin dan Kamis. Dan aku suka jika amalku dihadapkan sementara aku sedang berpuasa.\" — Muslim (dari Abu Hurairah). Hitungan Al-Muhsee ditinjau di hadapan Allah dua kali setiap minggu.",
      bn: "\"তোমাদের আমল সোমবার ও বৃহস্পতিবার আল্লাহর সামনে পেশ করা হয়। আমি চাই আমার আমল রোযা অবস্থায় পেশ হোক।\" — মুসলিম (আবু হুরায়রা থেকে)। আল-মুহসীর গণনা প্রতি সপ্তাহে দুবার আল্লাহর সামনে উপস্থাপিত হয়।",
      fa: "«اعمال شما در روز دوشنبه و پنجشنبه به الله عرضه می‌شود. و دوست دارم اعمالم در حال روزه‌داری عرضه شود.» — مسلم (از ابوهریره). شمارش المحصی هر هفته دو بار نزد الله بررسی می‌شود.",
      fr: "«Vos actes sont présentés à Allah le lundi et le jeudi. Et j'aime que mes actes soient présentés pendant que je jeûne.» — Muslim (d'Abu Hurayrah). Le décompte d'Al-Muhsee est revu devant Allah deux fois par semaine.",
    },
  },

  // Name 58 — Al-Mubdi': partial duplicate of Name 11 — use distinct hadith
  58: {
    hadith: {
      en: "\"When Allah created creation, He wrote in a Book with Him above the Throne: 'My mercy precedes My wrath.'\" — Bukhari & Muslim. The very first decree of Al-Mubdi' when originating all of existence was to inscribe mercy as its foundation — creation began with mercy.",
      ar: "\"إن الله لما خلق الخلق كتب في كتابه على نفسه: إن رحمتي تغلب غضبي.\" — البخاري ومسلم. كان أول قرار للمبدئ حين أوجد الكون هو أن يكتب الرحمة أساساً — بدأ الخلق بالرحمة.",
      bs: "\"Kada je Allah stvorio stvaranje, zapisao je u Knjizi kod Sebe iznad Arša: 'Moja milost prethodi Mojoj srdžbi.'\" — Buhari i Muslim. Prva odredba Al-Mubdi'a pri stvaranju svemira bila je da upiše milost kao njenu osnovu.",
      tr: "\"Allah yaratılışı yarattığında, Arş'ın üstünde Kendinde olan bir Kitaba yazdı: 'Rahmetim gazabıma galip gelir.'\" — Buhari ve Müslim. Tüm varlığı başlatırken El-Mubdi'nin ilk kararı, rahmeti temel olarak kaydetmekti.",
      ur: "\"جب اللہ نے تخلیق پیدا کی تو عرش کے اوپر اپنے پاس ایک کتاب میں لکھا: میری رحمت میرے غضب سے سبقت لے جاتی ہے۔\" — بخاری ومسلم۔ ہر چیز کو وجود میں لاتے وقت المبدئ کا پہلا فیصلہ تھا کہ رحمت کو بنیاد بنائے۔",
      id: "\"Ketika Allah menciptakan penciptaan, Dia menulis dalam sebuah Kitab di sisi-Nya di atas Arasy: 'Rahmat-Ku mendahului murka-Ku.'\" — Bukhari & Muslim. Keputusan pertama Al-Mubdi' saat mengawali seluruh keberadaan adalah menuliskan kasih sayang sebagai fondasinya.",
      bn: "\"আল্লাহ যখন সৃষ্টি তৈরি করলেন, তখন আরশের উপরে তাঁর কাছে একটি কিতাবে লিখলেন: 'আমার রহমত আমার ক্রোধের আগে।'\" — বুখারী ও মুসলিম। আল-মুবদির প্রথম আদেশ ছিল সমস্ত অস্তিত্বের ভিত্তি হিসেবে রহমতকে লেখা।",
      fa: "«هنگامی که الله آفرینش را آفرید، در کتابی نزد خود بالای عرش نوشت: رحمتم بر خشمم پیشی می‌گیرد.» — بخاری و مسلم. نخستین فرمان المبدئ هنگام پدید آوردن همه هستی این بود که رحمت را به عنوان بنیادش ثبت کند.",
      fr: "«Quand Allah créa la création, Il écrivit dans un Livre auprès de Lui au-dessus du Trône : 'Ma miséricorde précède Ma colère.'» — Bukhari & Muslim. Le tout premier décret d'Al-Mubdi' en originant toute existence fut d'inscrire la miséricorde comme sa fondation.",
    },
  },

  // Name 63 — Al-Qayyoom: Quran 35:41 in hadith field
  63: {
    hadith: {
      en: "\"Whoever recites Ayat al-Kursi after every obligatory prayer, nothing will prevent him from entering Paradise except death.\" — An-Nasai (authenticated by Ibn Hibban). Ayat al-Kursi begins with 'Allahu laa ilaaha illa Huwal-Hayyul-Qayyoom' — invoking Al-Qayyoom directly in the greatest verse of the Quran.",
      ar: "\"من قرأ آية الكرسي دُبُر كل صلاة مكتوبة، لم يمنعه من دخول الجنة إلا أن يموت.\" — النسائي (صحيح ابن حبان). آية الكرسي تبدأ بـ'اللهُ لا إلَهَ إلَّا هُوَ الحَيُّ القَيُّومُ'.",
      bs: "\"Onaj ko prouči Ajetul-kursiju nakon svake farz-namaza, ništa ga neće spriječiti da uđe u Džennet osim smrti.\" — Nesai (autentičan prema Ibn Hibbanu). Ajetul-kursija počinje s 'Allahu laa ilahe illa Huwal-Hayyul-Qayyoom'.",
      tr: "\"Her farz namazdan sonra Ayet'el-Kürsî'yi okuyan kimse, ölüm dışında cennete girmesini engelleyen hiçbir şey kalmaz.\" — Nesai (İbn Hibban tarafından doğrulanmış). Ayetel Kürsü 'Allahu laa ilahe illa Huval-Hayyül-Kayyüm' ile başlar.",
      ur: "\"جو شخص ہر فرض نماز کے بعد آیت الکرسی پڑھے، اسے جنت میں داخل ہونے سے صرف موت روکتی ہے۔\" — نسائی (ابن حبان نے صحیح قرار دیا)۔ آیت الکرسی 'اللهُ لا إلَهَ إلَّا هُوَ الحَيُّ القَيُّومُ' سے شروع ہوتی ہے۔",
      id: "\"Siapa yang membaca Ayat Kursi setelah setiap shalat wajib, tidak ada yang menghalanginya masuk surga kecuali kematian.\" — An-Nasai (diautentikasi oleh Ibn Hibban). Ayat Kursi dimulai dengan 'Allahu laa ilaaha illa Huwal-Hayyul-Qayyoom'.",
      bn: "\"যে ব্যক্তি প্রতিটি ফরয নামাযের পর আয়াতুল কুরসী পড়ে, মৃত্যু ছাড়া কিছুই তাকে জান্নাতে প্রবেশ করতে বাধা দেয় না।\" — আন-নাসাই (ইবন হিব্বান দ্বারা সহীহ)। আয়াতুল কুরসী শুরু হয় 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল কাইয়্যুম' দিয়ে।",
      fa: "«هر کس پس از هر نماز واجب آیت‌الکرسی بخواند، جز مرگ چیزی مانع ورودش به بهشت نخواهد شد.» — نسائی (ابن حبان تأیید کرده). آیت‌الکرسی با «اللهُ لا إلَهَ إلَّا هُوَ الحَيُّ القَيُّومُ» آغاز می‌شود.",
      fr: "«Quiconque récite l'Ayat al-Kursi après chaque prière obligatoire, rien ne l'empêchera d'entrer au Paradis sauf la mort.» — An-Nasai (authentifié par Ibn Hibban). L'Ayat al-Kursi commence par 'Allahu laa ilaaha illa Huwal-Hayyul-Qayyoom'.",
    },
  },

  // Name 67 — Al-Ahad: possibly weak hadith — use authenticated version
  67: {
    hadith: {
      en: "\"The Prophet ﷺ heard a man in prayer reciting only Surah Al-Ikhlas. He said: 'He has earned it.' They asked: 'What?' He said: 'Paradise.'\" — Bukhari (in Adab al-Mufrad) & Ahmad (authenticated). Surah Al-Ikhlas — the declaration of Al-Ahad's absolute uniqueness — is sufficient for one who truly understands it.",
      ar: "\"سمع النبي ﷺ رجلاً يقرأ في صلاته سورة الإخلاص فقال: وجبت. قالوا: ما وجبت؟ قال: الجنة.\" — البخاري (في الأدب المفرد) وأحمد (صحيح). سورة الإخلاص كافية لمن يفهمها حقاً.",
      bs: "\"Vjerovjesnik ﷺ čuo je čovjeka koji je u namazu učio samo suru Al-Ihlas. Rekao je: 'Zaslužio je.' Pitali su: 'Šta je zaslužio?' Rekao je: 'Džennet.'\" — Buhari (u Edebul-Mufredu) i Ahmed (sahih).",
      tr: "\"Peygamber ﷺ namazında sadece İhlas suresini okuyan bir adam duydu ve şöyle dedi: 'Hak etti.' Sordular: 'Ne hak etti?' Dedi: 'Cenneti.'\" — Buhari (Edebul-Müfred'de) ve Ahmed (sahih).",
      ur: "\"نبی ﷺ نے ایک شخص کو نماز میں صرف سورۃ الاخلاص پڑھتے سنا تو فرمایا: اس نے حاصل کر لیا۔ پوچھا گیا: کیا؟ فرمایا: جنت۔\" — بخاری (ادب المفرد میں) اور احمد (صحیح)۔",
      id: "\"Nabi ﷺ mendengar seorang pria dalam shalat hanya membaca Surah Al-Ikhlas. Beliau berkata: 'Ia telah mendapatkannya.' Mereka bertanya: 'Apa?' Beliau berkata: 'Surga.'\" — Bukhari (dalam Adab al-Mufrad) & Ahmad (shahih).",
      bn: "\"নবী ﷺ একজন লোককে নামাযে শুধু সূরা আল-ইখলাস পড়তে শুনলেন এবং বললেন: 'সে তা পেয়ে গেছে।' তারা জিজ্ঞেস করল: 'কী?' তিনি বললেন: 'জান্নাত।'\" — বুখারী (আদাব আল-মুফরাদে) ও আহমাদ (সহীহ)।",
      fa: "«پیامبر ﷺ مردی را شنید که در نمازش فقط سوره الإخلاص می‌خواند. فرمود: سزاوارش شد. پرسیدند: چه؟ فرمود: بهشت.» — بخاری (در ادب المفرد) و احمد (صحیح).",
      fr: "«Le Prophète ﷺ entendit un homme réciter uniquement la sourate Al-Ikhlas dans sa prière. Il dit : 'Il l'a mérité.' Ils demandèrent : 'Quoi ?' Il dit : 'Le Paradis.'» — Bukhari (dans Adab al-Mufrad) & Ahmad (authentifié).",
    },
  },

  // Name 68 — As-Samad: vague "prophetic commentary"
  68: {
    hadith: {
      en: "\"A man was leading the prayer and would always conclude with Surah Al-Ikhlas. On returning, they mentioned this to the Prophet ﷺ, who said: 'Ask him why he does this.' He said: 'Because it describes Ar-Rahman, and I love to recite it.' The Prophet said: 'Tell him that Allah loves him.'\" — Bukhari & Muslim. As-Samad — the Eternally Besought — is loved by the one who loves His description.",
      ar: "\"كان رجل يؤمّ قوماً فكان يختم كل صلاة بـ(قل هو الله أحد)، فسألوه، فقال: لأنها صفة الرحمن، وأنا أحب أن أقرأها. فقال النبي ﷺ: أخبروه أن الله يحبه.\" — البخاري ومسلم. الصمد الذي يُتوجه إليه يُحب من يُحب وصفه.",
      bs: "\"Čovjek je predvodio ljude u namazu i uvijek bi završavao sa surom Al-Ihlas. Upitali su ga o tome pa je rekao: 'Jer opisuje Ar-Rahmana, a volim je učiti.' Vjerovjesnik ﷺ je rekao: 'Recite mu da ga Allah voli.'\" — Buhari i Muslim.",
      tr: "\"Bir adam cemaate imam olarak namaz kıldırıyor ve her namazı İhlas suresiyle bitiriyordu. Bunu sorduklarında: 'Çünkü bu Ar-Rahman'ı tarif eder, ben de onu okumayı seviyorum' dedi. Peygamber ﷺ: 'Ona söyleyin ki Allah onu seviyor' buyurdu.\" — Buhari ve Müslim.",
      ur: "\"ایک شخص لوگوں کو نماز پڑھاتا اور ہر نماز سورۃ الاخلاص پر ختم کرتا۔ پوچھنے پر کہا: کیونکہ یہ الرحمان کی صفت بیان کرتی ہے اور مجھے اسے پڑھنا پسند ہے۔ نبی ﷺ نے فرمایا: اسے بتا دو کہ اللہ اس سے محبت کرتا ہے۔\" — بخاری ومسلم۔",
      id: "\"Seorang pria memimpin shalat dan selalu mengakhiri dengan Surah Al-Ikhlas. Mereka menanyakannya, dan ia berkata: 'Karena ia menggambarkan Ar-Rahman, dan aku suka membacanya.' Nabi ﷺ bersabda: 'Beritahu dia bahwa Allah mencintainya.'\" — Bukhari & Muslim.",
      bn: "\"একজন লোক লোকদের নামায পড়াত এবং সবসময় সূরা আল-ইখলাস দিয়ে শেষ করত। জিজ্ঞেস করলে বলল: 'কারণ এটি আর-রহমানের বর্ণনা করে এবং আমি এটি পড়তে ভালোবাসি।' নবী ﷺ বললেন: 'তাকে বলো যে আল্লাহ তাকে ভালোবাসেন।'\" — বুখারী ও মুসলিম।",
      fa: "«مردی پیشنماز مردم بود و همیشه نمازش را با سوره الإخلاص تمام می‌کرد. از او پرسیدند. گفت: چون صفت الرحمان را بیان می‌کند و دوست دارم آن را بخوانم. پیامبر ﷺ فرمود: به او بگویید الله او را دوست دارد.» — بخاری و مسلم.",
      fr: "«Un homme guidait les gens dans la prière et concluait toujours avec la sourate Al-Ikhlas. Ils lui en demandèrent la raison, et il dit : 'Parce qu'elle décrit Ar-Rahman, et j'aime la réciter.' Le Prophète ﷺ dit : 'Dites-lui qu'Allah l'aime.'» — Bukhari & Muslim.",
    },
  },

  // Name 78 — Al-Muta'ali: Quran 17:43 in hadith field
  78: {
    hadith: {
      en: "\"In your bowing, say 'Subhana Rabbiyal Azeem' (Glory be to my Lord, the Magnificent) three times. In your prostration, say 'Subhana Rabbiyal A'la' (Glory be to my Lord, the Most High) three times.\" — Abu Dawud (authenticated, from Uqbah ibn Amir). Al-Muta'ali — the Most High — is proclaimed in every prostration of every prayer.",
      ar: "\"اجعلوا هذه الآية في ركوعكم: سبحان ربي العظيم، وفي سجودكم: سبحان ربي الأعلى.\" — أبو داود (صحيح، عن عقبة بن عامر). المتعالي يُمجَّد في كل سجدة من كل صلاة.",
      bs: "\"U svom ruku'u govorite 'Subhane Rabbijel-Azim' (Slava Mom Gospodaru, Uzvišenom) tri puta. U svom sedždi govorite 'Subhane Rabbijel-A'la' (Slava Mom Gospodaru, Previšnjem) tri puta.\" — Ebu Davud (sahih, od Ukbe ibn Amira).",
      tr: "\"Rükunuzda 'Subhane Rabbiyel-Azim' (Yüce Rabbime hamd olsun) deyin üç kez. Secdenizde 'Subhane Rabbiyel-A'la' (En Yüce Rabbime hamd olsun) deyin üç kez.\" — Ebu Davud (sahih, Ukbe ibn Amir'den).",
      ur: "\"اپنے رکوع میں تین بار سبحان ربی العظیم کہو۔ اپنے سجدے میں تین بار سبحان ربی الأعلیٰ کہو۔\" — ابو داود (صحیح، عقبہ بن عامر سے)۔ المتعالی کا ہر نماز کے ہر سجدے میں اعلان ہوتا ہے۔",
      id: "\"Dalam rukuk, ucapkan 'Subhana Rabbiyal Azim' (Maha Suci Tuhanku Yang Maha Agung) tiga kali. Dalam sujud, ucapkan 'Subhana Rabbiyal A'la' (Maha Suci Tuhanku Yang Maha Tinggi) tiga kali.\" — Abu Dawud (shahih, dari Uqbah ibn Amir).",
      bn: "\"তোমার রুকুতে তিনবার বলো 'সুবহানা রাব্বিয়াল আযীম' (পবিত্র আমার মহান প্রতিপালক)। তোমার সিজদায় তিনবার বলো 'সুবহানা রাব্বিয়াল আ'লা' (পবিত্র আমার সর্বোচ্চ প্রতিপালক)।\" — আবু দাউদ (সহীহ, উকবা ইবন আমির থেকে)।",
      fa: "«در رکوعت بگو 'سبحان ربی العظیم' (منزه است پروردگار بزرگم) سه بار. در سجودت بگو 'سبحان ربی الأعلی' (منزه است پروردگار متعالم) سه بار.» — ابوداود (صحیح، از عقبه بن عامر).",
      fr: "«Dans votre agenouillement, dites 'Subhana Rabbiyal Azim' (Gloire à mon Seigneur, le Magnifique) trois fois. Dans votre prosternation, dites 'Subhana Rabbiyal A'la' (Gloire à mon Seigneur, le Très Haut) trois fois.» — Abu Dawud (authentifié, d'Uqbah ibn Amir).",
    },
  },

  // Name 84 — Maalik-ul-Mulk: Quran 3:26 in hadith field
  84: {
    hadith: {
      en: "\"Allah will fold up the heavens on the Day of Resurrection and grasp them in His right hand. Then He will say: 'I am the King. Where are the tyrants? Where are the arrogant?'\" — Bukhari & Muslim (from Ibn Umar). Maalik-ul-Mulk makes His absolute ownership unmistakable on that Day.",
      ar: "\"يطوي الله السماوات يوم القيامة، ثم يأخذهن بيده اليمنى، ثم يقول: أنا الملك، أين الجبارون؟ أين المتكبرون؟\" — البخاري ومسلم (عن ابن عمر). مالك الملك يُوضح ملكيته المطلقة في ذلك اليوم.",
      bs: "\"Allah će saviti nebesa na Sudnjem danu, a onda ih uhvatiti Svojom desnom rukom. Potom će reći: 'Ja sam Vladar. Gdje su tirani? Gdje su oholi?'\" — Buhari i Muslim (od Ibn Omera).",
      tr: "\"Allah, Kıyamet gününde gökleri dürecek ve sonra Sağ Eliyle tutacak. Ardından: 'Ben Melikim. Zalimler nerede? Kibirliler nerede?' diyecek.\" — Buhari ve Müslim (İbn Ömer'den).",
      ur: "\"اللہ قیامت کے دن آسمانوں کو لپیٹ دے گا پھر انہیں اپنے دائیں ہاتھ میں لے گا، پھر فرمائے گا: میں بادشاہ ہوں۔ جابر کہاں ہیں؟ متکبر کہاں ہیں؟\" — بخاری ومسلم (ابن عمر سے)۔",
      id: "\"Allah akan melipat langit pada Hari Kebangkitan, kemudian menggenggamnya dengan Tangan Kanan-Nya. Kemudian Dia berkata: 'Aku adalah Raja. Di mana para tiran? Di mana orang-orang yang sombong?'\" — Bukhari & Muslim (dari Ibn Umar).",
      bn: "\"আল্লাহ পুনরুত্থান দিবসে আকাশ ভাঁজ করবেন এবং তারপর তা তাঁর ডান হাতে ধরবেন। তারপর বলবেন: 'আমি বাদশাহ। অত্যাচারীরা কোথায়? অহংকারীরা কোথায়?'\" — বুখারী ও মুসলিম (ইবন উমর থেকে)।",
      fa: "«الله در روز قیامت آسمان‌ها را می‌پیچد و آن‌ها را در دست راستش می‌گیرد. سپس می‌گوید: من پادشاهم. جباران کجایند؟ متکبران کجایند؟» — بخاری و مسلم (از ابن عمر).",
      fr: "«Allah repliera les cieux le Jour de la Résurrection, puis les saisira dans Sa main droite. Ensuite Il dira : 'Je suis le Roi. Où sont les tyrans ? Où sont les arrogants ?'» — Bukhari & Muslim (d'Ibn Umar).",
    },
  },

  // Name 87 — Al-Jaami': indirect Al-Hashir connection — use direct gathering hadith
  87: {
    hadith: {
      en: "\"People will be gathered on the Day of Resurrection on a white plain, like pure thin bread — with no landmark for anyone.\" — Bukhari & Muslim (from Sahl ibn Sa'd al-Sa'idi). Al-Jaami' brings every soul that ever lived to a single gathering — the most comprehensive assembly in existence.",
      ar: "\"يُحشر الناس يوم القيامة على أرض بيضاء عفراء كقرصة النقي، ليس فيها معلم لأحد.\" — البخاري ومسلم (عن سهل بن سعد الساعدي). الجامع يحضر كل روح عاشت في تجمع واحد.",
      bs: "\"Ljudi će biti sabranog na Sudnjem danu na bijeloj ravnici, poput čistog tankog hljeba — bez ikakve orijentacije za ikoga.\" — Buhari i Muslim (od Sehla ibn Sa'da). Al-Džami' dovodi svaku dušu koja je ikada živjela na jedno jedino skupljanje.",
      tr: "\"İnsanlar, Kıyamet gününde beyaz, saf bir düzlükte — ince saf ekmek gibi — hiç kimse için işaret olmaksızın bir araya toplanacak.\" — Buhari ve Müslim (Sehl ibn Sa'd el-Saidi'den).",
      ur: "\"لوگ قیامت کے دن سفید میدان پر اکٹھے کیے جائیں گے جیسے سفید پتلی روٹی — جس میں کسی کے لیے کوئی نشانی نہ ہو۔\" — بخاری ومسلم (سہل بن سعد الساعدی سے)۔ الجامع ہر اس روح کو جو کبھی جیئی ایک اجتماع میں لاتا ہے۔",
      id: "\"Manusia akan dikumpulkan pada Hari Kebangkitan di dataran putih, seperti roti tipis yang bersih — tanpa tanda apapun untuk siapapun.\" — Bukhari & Muslim (dari Sahl ibn Sa'd al-Sa'idi). Al-Jaami' membawa setiap jiwa yang pernah hidup ke dalam satu perkumpulan.",
      bn: "\"পুনরুত্থান দিবসে মানুষদের একটি সাদা সমভূমিতে জড়ো করা হবে — পরিষ্কার পাতলা রুটির মতো — যেখানে কারো জন্য কোনো চিহ্ন নেই।\" — বুখারী ও মুসলিম (সাহল ইবন সা'দ আস-সাঈদী থেকে)।",
      fa: "«مردم در روز قیامت در زمینی سفید مانند نان سفید نازک — بدون هیچ نشانه‌ای برای هیچ‌کس — گردآوری می‌شوند.» — بخاری و مسلم (از سهل بن سعد الساعدی).",
      fr: "«Les gens seront rassemblés le Jour de la Résurrection sur une plaine blanche, comme du pain plat pur — sans aucun repère pour personne.» — Bukhari & Muslim (de Sahl ibn Sa'd al-Sa'idi). Al-Jaami' rassemble chaque âme qui ait jamais vécu en un seul rassemblement.",
    },
  },

  // Name 95 — Al-Badee': Quran paraphrase in hadith field
  95: {
    hadith: {
      en: "\"The first thing Allah created was the Pen. He said to it: 'Write.' It said: 'What shall I write, my Lord?' He said: 'Write the destiny of all things until the Hour of Resurrection.'\" — Abu Dawud (authenticated by Al-Hakim and others). Al-Badee' originated not only creation but the record of all that would ever be — an act of pure innovation with no precedent.",
      ar: "\"أول ما خلق الله القلم، قال له: اكتب. قال: ما أكتب؟ قال: اكتب مقادير كل شيء حتى تقوم الساعة.\" — أبو داود (صحّحه الحاكم وغيره). البديع لم يُبدع الخلق فحسب، بل أبدع سجل كل ما سيكون.",
      bs: "\"Prva stvar koju je Allah stvorio bila je Pero. Rekao mu je: 'Piši.' Reklo je: 'Šta da pišem, moj Gospodaru?' Rekao je: 'Piši sudbinu svih stvari do Sudnjeg sata.'\" — Ebu Davud (potvrdio ga El-Hakim i drugi).",
      tr: "\"Allah'ın yarattığı ilk şey Kalem'di. Ona dedi: 'Yaz.' O: 'Ne yazayım, Ya Rabbim?' dedi. Dedi: 'Kıyamete kadar her şeyin kaderini yaz.'\" — Ebu Davud (El-Hakim ve diğerleri tarafından doğrulanmıştır).",
      ur: "\"اللہ نے سب سے پہلے قلم پیدا کیا اور فرمایا: لکھ۔ اس نے کہا: کیا لکھوں؟ فرمایا: ہر چیز کی تقدیر لکھو قیامت تک۔\" — ابو داود (حاکم وغیرہ نے صحیح قرار دیا)۔",
      id: "\"Hal pertama yang Allah ciptakan adalah Pena. Dia berkata kepadanya: 'Tulis.' Ia berkata: 'Apa yang harus saya tulis, ya Tuhanku?' Dia berkata: 'Tuliskan takdir semua hal hingga Hari Kebangkitan.'\" — Abu Dawud (diautentikasi oleh Al-Hakim dan lainnya).",
      bn: "\"আল্লাহ সর্বপ্রথম যা সৃষ্টি করেছেন তা হলো কলম। তিনি তাকে বললেন: 'লেখো।' সে বলল: 'কী লিখব, হে আমার প্রতিপালক?' তিনি বললেন: 'কিয়ামত পর্যন্ত সমস্ত জিনিসের তাকদীর লেখো।'\" — আবু দাউদ (আল-হাকিম এবং অন্যান্যরা সহীহ বলেছেন)।",
      fa: "«اولین چیزی که الله آفرید، قلم بود. به آن فرمود: بنویس. گفت: چه بنویسم، پروردگارم؟ فرمود: تقدیر همه چیز را تا روز قیامت بنویس.» — ابوداود (الحاکم و دیگران تأیید کرده‌اند).",
      fr: "«La première chose qu'Allah créa fut la Plume. Il lui dit : 'Écris.' Elle dit : 'Que dois-je écrire, mon Seigneur ?' Il dit : 'Écris le destin de toutes choses jusqu'au Jour de la Résurrection.'» — Abu Dawud (authentifié par Al-Hakim et d'autres).",
    },
  },

  // Name 98 — Ar-Rasheed: round 1 introduced Quran 65:2-3 — replace properly
  98: {
    hadith: {
      en: "\"Every child is born in the fitrah (innate disposition toward truth). Then his parents make him a Jew, a Christian, or a Zoroastrian.\" — Bukhari & Muslim. Ar-Rasheed built His guidance into every human soul from birth — the fitrah is His guidance, factory-installed.",
      ar: "\"كل مولود يولد على الفطرة، فأبواه يهودانه أو ينصرانه أو يمجسانه.\" — البخاري ومسلم. الرشيد أودع هدايته في كل روح إنسانية منذ الولادة — الفطرة هي هدايته المُدرَجة.",
      bs: "\"Svako dijete se rađa u fitri (urođenoj sklonosti prema istini). Zatim ga roditelji čine Židovom, Kršćaninom ili Zoroastrijcem.\" — Buhari i Muslim. Ar-Rašid je utkao Svoju uputu u svaku ljudsku dušu od rođenja.",
      tr: "\"Her çocuk fıtrat üzere doğar (hakikate doğal eğilim). Sonra annesi babası onu Yahudi, Hristiyan veya Mecusi yapar.\" — Buhari ve Müslim. Er-Reşid, doğuştan itibaren her insan ruhuna rehberliğini yerleştirmiştir.",
      ur: "\"ہر بچہ فطرت پر پیدا ہوتا ہے۔ پھر اس کے والدین اسے یہودی، نصرانی یا مجوسی بناتے ہیں۔\" — بخاری ومسلم۔ الرشید نے پیدائش سے ہی ہر انسانی روح میں اپنی ہدایت ودیعت کی ہے۔",
      id: "\"Setiap anak dilahirkan dalam fitrah (kecenderungan bawaan menuju kebenaran). Kemudian orang tuanya menjadikannya Yahudi, Kristen, atau Zoroaster.\" — Bukhari & Muslim. Ar-Rasheed menanamkan bimbingan-Nya ke dalam setiap jiwa manusia sejak lahir.",
      bn: "\"প্রতিটি শিশু ফিতরতের (সত্যের প্রতি সহজাত ঝোঁক) উপর জন্মগ্রহণ করে। তারপর তার বাবা-মা তাকে ইহুদি, খ্রিস্টান বা অগ্নিপূজারী বানায়।\" — বুখারী ও মুসলিম। আর-রাশীদ জন্ম থেকেই প্রতিটি মানব আত্মায় তাঁর হেদায়াত গেঁথে দিয়েছেন।",
      fa: "«هر کودکی بر فطرت (گرایش ذاتی به حقیقت) متولد می‌شود. سپس والدینش او را یهودی، مسیحی یا زرتشتی می‌کنند.» — بخاری و مسلم. الرشید هدایتش را از بدو تولد در هر روح انسانی نهاده است.",
      fr: "«Chaque enfant naît dans la fitrah (disposition innée vers la vérité). Ensuite ses parents en font un Juif, un Chrétien ou un Zoroastrien.» — Bukhari & Muslim. Ar-Rasheed a intégré Sa guidance dans chaque âme humaine depuis la naissance — la fitrah est Sa guidance, installée en usine.",
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
