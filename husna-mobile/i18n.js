import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
    en: {
        translation: {
            navigation: {
                learn: 'Learn',
                memorize: 'Memorize',
                hall: 'Hall',
                dua: 'Dua',
            },
            learn: {
                title: 'Learn the 99 Names',
                subtitle: 'Scroll through and reflect on their meanings.',
                playNasheed: 'Play Nasheed',
                nasheeds: 'Nasheeds',
                close: 'Close',
                meaning: 'Meaning',
            },
            memorize: {
                title: 'Memorize',
                revealed: 'Revealed',
                inputPlaceholder: 'Type any name...',
                submit: 'Submit',
                useHint: 'Use Hint',
                score: 'Names Found',
                hintsUsed: 'Hints Used',
                encouragement: 'Keep going! Try to memorize them all for the Hall of Fame.',
                tryAgainNoHints: 'To enter the Hall of Fame, you must memorize all 99 names without any hints. You can do it!',
                congratulations: 'Congratulations!',
                completedMessage: 'You have beautifully memorized all 99 Names of Allah.',
                proceedToOath: 'Proceed to Oath',
                tryAgain: 'Try Again',
            },
            hall: {
                title: 'Hall of Fame',
                score: 'Score',
                hints: 'Hints',
                date: 'Date',
                oathTitle: 'The Oath of Honesty',
                oathText: 'I solemnly swear by Allah (ﷻ), the All-Seeing and All-Hearing, that I have memorized all 99 Names of Allah completely from memory, without the use of any aides, lists, or external help during this session.',
                oathPrompt: 'If you have completed this truthfully, you may enter your name into the global Hall of Fame.',
                namePlaceholder: 'Your Name',
                selectCountry: 'Select Country',
                signOath: 'Sign Oath & Submit',
                submitting: 'Submitting...',
                subtitle: 'Nations uniting in the remembrance of Allah.',
                countriesTab: 'Countries',
                fastestTab: 'Fastest',
            },
            dedication: {
                title: 'Dedication',
                intro: "This application is humbly dedicated to the loving memory of my late father,",
                issa: "Issa",
                sisterIntro: ", my beloved sister,",
                zainab: "Zainab",
                grandparentsIntro: ", and my dear",
                grandparents: "Grandparents",
                prayer1: "May Allah (ﷻ) envelop them in His infinite mercy, forgive their sins, illuminate their graves, and elevate their ranks in Jannatul Firdaus.",
                prayer2: "We ask that whoever benefits from this app takes a brief moment to make a sincere Du'a for them, and for all deceased Muslims around the world.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"O Allah, forgive them and have mercy on them, keep them safe and sound and forgive them, honor their rest and ease their entrance; wash them with water and snow and hail, and cleanse them of sin as a white garment is cleansed of dirt.\"",
                footer: "Please keep us in your prayers.",
                version: "v1.0.11"
            },
            onboarding: {
                title: 'Welcome to Husna',
                subtitle: 'Your companion for the 99 Beautiful Names of Allah.',
                step1Title: 'Learn & Reflect',
                step1Text: 'Browse the 99 Names, listen to their pronunciation, and reflect on their deep meanings.',
                step2Title: 'The Memorization Game',
                step2Text: 'Test your memory! Type the name in Arabic or transliteration. Correct guesses flip a new tile.',
                step3Title: 'Hints & Hall of Fame',
                step3Text: 'You can use hints if you get stuck, but remember: using even one hint disqualifies you from entering the global Hall of Fame for that session.',
                step4Title: 'The Oath of Honesty',
                step4Text: 'Once you memorize all names without help, sign the oath and join the ranks of seekers across the world.',
                getStarted: 'Get Started',
            },
            common: {
                translationCredit: 'Translations provided by Allahin99ismi.com',
                selectLanguage: 'Select Language',
            }
        }
    },
    ar: {
        translation: {
            navigation: {
                learn: 'تعلّم',
                memorize: 'حفظ',
                hall: 'السجل',
                dua: 'دعاء',
            },
            learn: {
                title: 'تعلّم أسماء الله الحسنى',
                subtitle: 'تصفح وتأمل في معانيها.',
                playNasheed: 'تشغيل النشيد',
                nasheeds: 'الأناشيد',
                close: 'إغلاق',
                meaning: 'المعنى',
            },
            memorize: {
                title: 'التسميع',
                revealed: 'تم الكشف',
                inputPlaceholder: 'اكتب أي اسم...',
                submit: 'إرسال',
                useHint: 'استخدام تلميح',
                score: 'الأسماء المكتشفة',
                hintsUsed: 'التلميحات المستعملة',
                encouragement: 'استمر! حاول حفظها جميعاً لدخول لوحة الشرف.',
                tryAgainNoHints: 'لدخول لوحة الشرف، يجب عليك حفظ جميع الأسماء الـ ٩٩ دون أي تلميحات. أنت تستطيع!',
                congratulations: 'مبارك!',
                completedMessage: 'لقد أتممت حفظ ٩٩ اسماً من أسماء الله الحسنى.',
                proceedToOath: 'الانتقال إلى القسم',
                tryAgain: 'إعادة المحاولة',
            },
            hall: {
                title: 'لوحة الشرف',
                score: 'النقاط',
                hints: 'التلميحات',
                date: 'التاريخ',
                oathTitle: 'قسم الأمانة والصدق',
                oathText: 'أقسم بالله العظيم، السميع البصير، أنني حفظت وسمّعت أسماء الله الحسنى الـ ٩٩ كاملة من ذاكرتي، دون استخدام أي مساعدات أو قوائم أو مساعدة خارجية خلال هذه الجلسة.',
                oathPrompt: 'إذا كنت قد أتممت ذلك بصدق، يمكنك إدخال اسمك في لوحة الشرف العالمية.',
                namePlaceholder: 'اسمك',
                selectCountry: 'اختر الدولة',
                signOath: 'أقسم وأرسل',
                submitting: 'جاري الإرسال...',
                subtitle: 'أمم تتحد في ذكر الله.',
                countriesTab: 'الدول',
                fastestTab: 'الأسرع',
            },
            dedication: {
                title: 'إهداء',
                intro: "هذا التطبيق مُهدى إلى روح والدي الحبيب،",
                issa: "عيسى",
                sisterIntro: "، وأختي الغالية،",
                zainab: "زينب",
                grandparentsIntro: "، و",
                grandparents: "أجدادي",
                prayer1: "نسأل الله (عز وجل) أن يتغمدهم بواسع رحمته، ويغفر ذنوبهم، وينير قبورهم، ويرفع درجاتهم في جنات الفردوس.",
                prayer2: "نرجو ممن ينتفع بهذا التطبيق أن يخصص لحظة من وقته للدعاء الخالص لهم، ولجميع أموات المسلمين في كل مكان.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                footer: "لا تنسونا من صالح دعائكم.",
                version: "v1.0.11"
            },
            onboarding: {
                title: 'مرحباً بكم في حسنى',
                subtitle: 'رفيقك لتعلم ومعرفة أسماء الله الحسنى الـ ٩٩.',
                step1Title: 'تعلّم وتأمّل',
                step1Text: 'تصفح الأسماء الـ ٩٩، استمع إلى نطقها، وتأمل في معانيها العميقة.',
                step2Title: 'لعبة الحفظ',
                step2Text: 'اختبر ذاكرتك! اكتب الاسم بالعربية أو بالترجمة الصوتية. الإجابات الصحيحة تقلب بلاطة جديدة.',
                step3Title: 'التلميحات ولوحة الشرف',
                step3Text: 'يمكنك استخدام التلميحات إذا تعثرت، ولكن تذكر: استخدام تلميح واحد فقط يمنعك من دخول لوحة الشرف العالمية لتلك الجلسة.',
                step4Title: 'قسم الأمانة',
                step4Text: 'بمجرد حفظ جميع الأسماء بدون مساعدة، وقع القسم وانضم إلى صفوف الذاكرين حول العالم.',
                getStarted: 'ابدأ الآن',
            },
            common: {
                translationCredit: 'تم توفير الترجمات بواسطة Allahin99ismi.com',
                TranslationCredit: 'تم توفير الترجمات بواسطة Allahin99ismi.com',
            }
        }
    },
    bs: {
        translation: {
            navigation: {
                learn: 'Uči',
                memorize: 'Pamti',
                hall: 'Poredak',
                dua: 'Dova',
            },
            learn: {
                title: 'Nauči 99 Allahovih Imena',
                subtitle: 'Prelistaj i razmisli o njihovim značenjima.',
                playNasheed: 'Pusti Ilahiju',
                nasheeds: 'Ilahije',
                close: 'Zatvori',
                meaning: 'Značenje',
            },
            memorize: {
                title: 'Pamćenje',
                revealed: 'Otkriveno',
                inputPlaceholder: 'Unesi bilo koje ime...',
                submit: 'Potvrdi',
                useHint: 'Koristi pomoć',
                score: 'Pronađena imena',
                hintsUsed: 'Korištena pomoć',
                encouragement: 'Samo naprijed! Pokušaj ih sve zapamtiti za Kuću Slavnih.',
                tryAgainNoHints: 'Da biste ušli u Kuću Slavnih, morate zapamtiti svih 99 imena bez ijedne pomoći. Ti to možeš!',
                congratulations: 'Čestitamo!',
                completedMessage: 'Predivno si zapamtio svih 99 Allahovih Imena.',
                proceedToOath: 'Zavjet',
                tryAgain: 'Pokušaj ponovo',
            },
            hall: {
                title: 'Kuća Slavnih',
                score: 'Bodovi',
                hints: 'Pomoć',
                date: 'Datum',
                oathTitle: 'Zavjet Iskrenosti',
                oathText: 'Svečano se zaklinjem Allahom (ﷻ), Svevidećim i Sveznajućim, da sam zapamtio i ponovio svih 99 Allahovih imena potpuno iz sjećanja, bez upotrebe ikakvih pomagala, spiskova ili vanjske pomoći tokom ove sesije.',
                oathPrompt: 'Ako ste ovo iskreno završili, možete unijeti svoje ime u globalnu Kuću Slavnih.',
                namePlaceholder: 'Tvoje Ime',
                selectCountry: 'Izaberi Državu',
                signOath: 'Potpiši Zavjet i Pošalji',
                submitting: 'Slanje...',
                subtitle: 'Narodi ujedinjeni u sjećanju na Allaha.',
                countriesTab: 'Države',
                fastestTab: 'Najbrži',
            },
            dedication: {
                title: 'Posveta',
                intro: "Ova aplikacija je ponizno posvećena u znak sjećanja na mog rahmetli oca,",
                issa: "Isa",
                sisterIntro: ", moju voljenu sestru,",
                zainab: "Zejneb",
                grandparentsIntro: ", i moje drage",
                grandparents: "Nenedo i Dedo",
                prayer1: "Neka ih Allah (ﷻ) obavije Svojom neizmjernom milošću, oprosti im grijehe, osvijetli im kabure i uzdigne njihove deredže u Džennetul-Firdewsu.",
                prayer2: "Molimo svakoga ko ima koristi od ove aplikacije da odvoji trenutak i uputi iskrenu dovu za njih, kao i za sve umrle muslimane širom svijeta.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"Gospodaru, oprosti im i smiluj im se, spasi ih i pređi preko grijeha njihovih, učini im plemenitim mjesto boravka, a prostranim mjesto ulaska, operi ih vodom, snijegom i gradom, i očisti ih od grijeha kao što se čisti bijela odjeća od prljavštine.\"",
                footer: "Molimo vas da nas sačuvate u svojim dovama.",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'Prijevodi preuzeti sa Allahin99ismi.com',
                TranslationCredit: 'Prijevodi preuzeti sa Allahin99ismi.com',
            }
        }
    },
    tr: {
        translation: {
            navigation: {
                learn: 'Öğren',
                memorize: 'Ezberle',
                hall: 'Onur Listesi',
                dua: 'Dua',
            },
            learn: {
                title: '99 İsmi Öğren',
                subtitle: 'İsimler üzerinde düşünün ve anlamlarını keşfedin.',
                playNasheed: 'İlahi Dinle',
                nasheeds: 'İlahiler',
                close: 'Kapat',
                meaning: 'Anlamı',
            },
            memorize: {
                title: 'Ezberleme',
                revealed: 'Açılanlar',
                inputPlaceholder: 'Bir isim yazın...',
                submit: 'Gönder',
                useHint: 'İpucu Kullan',
                score: 'Bulunan İsimler',
                hintsUsed: 'Kullanılan İpucu',
                encouragement: 'Devam edin! Onur Listesi için hepsini ezberlemeye çalışın.',
                tryAgainNoHints: 'Onur Listesi\'ne girmek için 99 ismin tamamını hiç ipucu kullanmadan ezberlemelisiniz. Yapabilirsin!',
                congratulations: 'Tebrikler!',
                completedMessage: 'Allah\'ın 99 ismini de başarıyla ezberlediniz.',
                proceedToOath: 'Yemin Et',
                tryAgain: 'Tekrar Dene',
            },
            hall: {
                title: 'Onur Listesi',
                score: 'Puan',
                hints: 'İpucu',
                date: 'Tarih',
                oathTitle: 'Doğruluk Yemini',
                oathText: 'Her Şeyi Gören ve İşiten Allah\'ın (ﷻ) huzurunda yemin ederim ki, Allah\'ın 99 ismini tamamen ezberimden, hiçbir yardım, liste veya dış destek almadan söyledim.',
                oathPrompt: 'Eğer bunu dürüstçe tamamladıysanız, adınızı küresel Onur Listesi\'ne kaydedebilirsiniz.',
                namePlaceholder: 'Adınız',
                selectCountry: 'Ülke Seç',
                signOath: 'Yemini İmzala ve Gönder',
                submitting: 'Gönderiliyor...',
                subtitle: 'Allah\'ı zikretmekte birleşen ümmetler.',
                countriesTab: 'Ülkeler',
                fastestTab: 'En Hızlılar',
            },
            dedication: {
                title: 'İthaf',
                intro: "Bu uygulama, sevgili babam rahmetli",
                issa: "Issa",
                sisterIntro: ", canım kız kardeşim",
                zainab: "Zainab",
                grandparentsIntro: " ve değerli ",
                grandparents: "Büyükanne ve Büyükbabamın",
                prayer1: "aziz hatırasına adanmıştır. Allah (ﷻ) onlara sonsuz rahmetiyle muamele etsin, günahlarını bağışlasın, kabirlerini nurlandırsın ve makamlarını Cennetü'l-Firdevs'te yüceltsin.",
                prayer2: "Bu uygulamadan yararlanan herkesten, onlar ve dünyadaki tüm vefat etmiş Müslümanlar için içten bir dua etmesini rica ediyoruz.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"Allahım, onları bağışla ve onlara merhamet et, onları esenlikte kıl ve kusurlarını affet. Konakladıkları yeri onurlandır ve girişlerini kolaylaştır; onları su, kar ve dolu ile yıka; beyaz elbiseyi kirden temizlediğin gibi onları da günahlardan arındır.\"",
                footer: "Lütfen bizi dualarınızda eksik etmeyin.",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'Çeviriler Allahin99ismi.com tarafından sağlanmıştır',
                TranslationCredit: 'Çeviriler Allahin99ismi.com tarafından sağlanmıştır',
            }
        }
    },
    ur: {
        translation: {
            navigation: {
                learn: 'سیکھیں',
                memorize: 'یاد کریں',
                hall: 'اعزازات',
                dua: 'دعا',
            },
            learn: {
                title: '99 نام سیکھیں',
                subtitle: 'ناموں پر غور کریں اور ان کے معنی دریافت کریں۔',
                playNasheed: 'نعت سنیں',
                nasheeds: 'نعتیں',
                close: 'بند کریں',
                meaning: 'معنی',
            },
            memorize: {
                title: 'یادداشت',
                revealed: 'ظاہر شدہ',
                inputPlaceholder: 'کوئی بھی نام لکھیں...',
                submit: 'ارسال کریں',
                useHint: 'اشارہ لیں',
                score: 'ملنے والے نام',
                hintsUsed: 'استعمال شدہ اشارے',
                encouragement: 'جاری رکھیں! ہال آف فیم کے لیے تمام نام یاد کرنے کی کوشش کریں۔',
                tryAgainNoHints: 'ہال آف فیم میں شامل ہونے کے لیے، آپ کو بغیر کسی اشارے کے تمام 99 نام یاد کرنے ہوں گے۔ آپ یہ کر سکتے ہیں!',
                congratulations: 'مبارک ہو!',
                completedMessage: 'آپ نے اللہ کے تمام 99 نام خوبصورتی سے یاد کر لیے ہیں۔',
                proceedToOath: 'حلف اٹھائیں',
                tryAgain: 'دوبارہ کوشش کریں',
            },
            hall: {
                title: 'ہال آف فیم',
                score: 'سکور',
                hints: 'اشارے',
                date: 'تاریخ',
                oathTitle: 'سچائی کا حلف',
                oathText: 'میں اللہ (ﷻ)، جو سب کچھ دیکھنے اور سننے والا ہے، کے نام پر حلف اٹھاتا ہوں کہ میں نے اللہ کے تمام 99 نام مکمل طور پر اپنے حافظے سے، کسی بھی امداد، فہرست، یا بیرونی مدد کے بغیر یاد کیے ہیں۔',
                oathPrompt: 'اگر آپ نے یہ ایمانداری سے مکمل کیا ہے، تو آپ اپنا نام ہال آف فیم میں درج کر سکتے ہیں۔',
                namePlaceholder: 'آپ کا نام',
                selectCountry: 'ملک منتخب کریں',
                signOath: 'دستخط کریں اور بھیجیں',
                submitting: 'ارسال ہو رہا ہے...',
                subtitle: 'اللہ کے ذکر میں متحد قومیں۔',
                countriesTab: 'ممالک',
                fastestTab: 'تیز ترین',
            },
            dedication: {
                title: 'انتساب',
                intro: "یہ ایپلی کیشن مرے مرحوم والد،",
                issa: "عیسیٰ",
                sisterIntro: "، میری پیاری بہن،",
                zainab: "زینب",
                grandparentsIntro: "، اور مرے پیارے ",
                grandparents: "دادا دادی",
                prayer1: "کی یاد میں وقف ہے۔ اللہ (ﷻ) انہیں اپنی رحمت کے سائے میں رکھے، ان کے گناہ معاف کرے، ان کی قبروں کو روشن کرے اور جنت الفردوس میں ان کے درجات بلند کرے۔",
                prayer2: "ہم درخواست کرتے ہیں کہ جو بھی اس ایپ سے فائدہ اٹھائے، وہ ان کے لیے اور دنیا بھر کے تمام فوت شدہ مسلمانوں کے لیے ایک لمحہ نکال کر دعا کرے۔",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"اے اللہ، انہیں بخش دے اور ان پر رحم کر، انہیں عافیت دے اور ان سے درگزر فرما، ان کی مہمانی کو معزز بنا اور ان کے داخلے کو وسیع کر؛ انہیں پانی، برف اور اولوں سے دھو دے؛ اور انہیں گناہوں سے ایسے پاک کر دے جیسے سفید کپڑے کو میل کچیل سے پاک کیا جاتا ہے۔\"",
                footer: "براہ کرم ہمیں اپنی دعاؤں میں یاد رکھیں۔",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'ترجمہ بشکریہ Allahin99ismi.com',
                TranslationCredit: 'ترجمہ بشکریہ Allahin99ismi.com',
            }
        }
    },
    id: {
        translation: {
            navigation: {
                learn: 'Pelajari',
                memorize: 'Hafalkan',
                hall: 'Peringkat',
                dua: 'Doa',
            },
            learn: {
                title: 'Pelajari 99 Nama',
                subtitle: 'Renungkan dan pahami makna setiap nama.',
                playNasheed: 'Putar Nasyid',
                nasheeds: 'Nasyid',
                close: 'Tutup',
                meaning: 'Makna',
            },
            memorize: {
                title: 'Menghafal',
                revealed: 'Terungkap',
                inputPlaceholder: 'Ketik nama apapun...',
                submit: 'Kirim',
                useHint: 'Gunakan Petunjuk',
                score: 'Nama Ditemukan',
                hintsUsed: 'Petunjuk Digunakan',
                encouragement: 'Teruslah berusaha! Hafalkan semua untuk masuk Aula Kehormatan.',
                tryAgainNoHints: 'Untuk masuk Aula Kehormatan, Anda harus menghafal ke-99 nama tanpa petunjuk apapun. Anda pasti bisa!',
                congratulations: 'Selamat!',
                completedMessage: 'Anda telah menghafal ke-99 Nama Allah dengan indah.',
                proceedToOath: 'Lanjutkan ke Sumpah',
                tryAgain: 'Coba Lagi',
            },
            hall: {
                title: 'Aula Kehormatan',
                score: 'Skor',
                hints: 'Petunjuk',
                date: 'Tanggal',
                oathTitle: 'Sumpah Kejujuran',
                oathText: 'Saya bersumpah demi Allah (ﷻ), Yang Maha Melihat dan Maha Mendengar, bahwa saya telah menghafal ke-99 Nama Allah sepenuhnya dari ingatan, tanpa bantuan, daftar, atau bantuan eksternal selama sesi ini.',
                oathPrompt: 'Jika Anda telah menyelesaikan ini dengan jujur, Anda dapat memasukkan nama Anda ke Aula Kehormatan global.',
                namePlaceholder: 'Nama Anda',
                selectCountry: 'Pilih Negara',
                signOath: 'Tandatangani & Kirim',
                submitting: 'Mengirim...',
                subtitle: 'Bangsa-bangsa bersatu dalam mengingat Allah.',
            },
            dedication: {
                title: 'Dedikasi',
                intro: "Aplikasi ini dengan rendah hati didedikasikan untuk kenangan mendiang ayah saya,",
                issa: "Issa",
                sisterIntro: ", saudari tercinta saya,",
                zainab: "Zainab",
                grandparentsIntro: ", dan ",
                grandparents: "Kakek-Nenek",
                prayer1: "tersayang saya. Semoga Allah (ﷻ) menyelimuti mereka dengan rahmat-Nya yang tak terhingga, mengampuni dosa-dosa mereka, menerangi kubur mereka, dan meningkatkan derajat mereka di Jannatul Firdaus.",
                prayer2: "Kami memohon kepada siapa pun yang mengambil manfaat dari aplikasi ini untuk meluangkan waktu sejenak demi memanjatkan doa tulus bagi mereka, dan bagi semua Muslim yang telah wafat di seluruh dunia.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"Ya Allah, ampunilah mereka dan kasihanilah mereka, selamatkanlah mereka dan maafkanlah mereka, muliakanlah tempat tinggal mereka dan luaskanlah pintu masuk mereka; mandikanlah mereka dengan air, salju, dan es; dan bersihkanlah mereka dari dosa sebagaimana pakaian putih dibersihkan dari kotoran.\"",
                footer: "Mohon doakan kami.",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'Terjemahan disediakan oleh Allahin99ismi.com',
                TranslationCredit: 'Terjemahan disediakan oleh Allahin99ismi.com',
            }
        }
    },
    bn: {
        translation: {
            navigation: {
                learn: 'শিখুন',
                memorize: 'মুখস্থ',
                hall: 'র‍্যাঙ্কিং',
                dua: 'দোয়া',
            },
            learn: {
                title: '৯৯টি নাম শিখুন',
                subtitle: 'নামগুলো নিয়ে ভাবুন এবং অর্থ বোঝার চেষ্টা করুন।',
                playNasheed: 'নাশিদ শুনুন',
                nasheeds: 'নাশিদ',
                close: 'বন্ধ করুন',
                meaning: 'অর্থ',
            },
            memorize: {
                title: 'মুখস্থ করা',
                revealed: 'প্রকাশিত',
                inputPlaceholder: 'নাম লিখুন...',
                submit: 'জমা দিন',
                useHint: 'ইঙ্গিত নিন',
                score: 'প্রাপ্ত নাম',
                hintsUsed: 'ব্যবহৃত ইঙ্গিত',
                encouragement: 'চালিয়ে যান! হল অফ ফেমে যোগ দিতে সব নাম মুখস্থ করার চেষ্টা করুন।',
                tryAgainNoHints: 'হল অফ ফেমে অন্তর্ভুক্ত হতে ৯৯টি নাম কোনো ইঙ্গিত ছাড়াই মুখস্থ বলতে হবে। আপনি পারবেন!',
                congratulations: 'অভিনন্দন!',
                completedMessage: 'আপনি সফলভাবে আল্লাহর ৯৯টি নাম মুখস্থ করেছেন।',
                proceedToOath: 'শপথে এগিয়ে যান',
                tryAgain: 'আবার চেষ্টা করুন',
            },
            hall: {
                title: 'হল অফ ফেম',
                score: 'স্কোর',
                hints: 'ইঙ্গিত',
                date: 'তারিখ',
                oathTitle: 'সততার শপথ',
                oathText: 'আমি মহান আল্লাহ (ﷻ)-র নামে শপথ করছি যে, আমি আল্লাহর ৯৯টি নাম সম্পূর্ণ স্মৃতি থেকে কোনো সাহায্য, তালিকা বা বাহ্যিক সহায়তা ছাড়াই মুখস্থ বলেছি।',
                oathPrompt: 'আপনি যদি এটি সততার সাথে সম্পন্ন করে থাকেন, তবে বিশ্বব্যাপী হল অফ ফেমে আপনার নাম অন্তর্ভুক্ত করতে পারেন।',
                namePlaceholder: 'আপনার নাম',
                selectCountry: 'দেশ নির্বাচন করুন',
                signOath: 'শপথ করুন ও জমা দিন',
                submitting: 'জমা হচ্ছে...',
                subtitle: 'আল্লাহর স্মরণে ঐক্যবদ্ধ জাতিসমূহ।',
            },
            dedication: {
                title: 'উৎসর্গ',
                intro: "এই অ্যাপ্লিকেশনটি বিনম্রভাবে আমার প্রয়াত পিতা,",
                issa: "ইসা",
                sisterIntro: ", আমার প্রিয় বোন,",
                zainab: "জয়নব",
                grandparentsIntro: ", এবং আমার প্রিয় ",
                grandparents: "দাদা-দাদি ও নানা-নানির",
                prayer1: "স্মৃতির উদ্দেশ্যে উৎসর্গ করা হলো। আল্লাহ (ﷻ) তাঁদের অসীম রহমতে ঢেকে দিন, তাঁদের গুনাহ ক্ষমা করুন, তাঁদের কবর আলোকিত করুন এবং জান্নাতুল ফেরদাউসে তাঁদের মর্যাদা বৃদ্ধি করুন।",
                prayer2: "আমরা অনুরোধ করছি যে, যারা এই অ্যাপ থেকে উপকৃত হবেন তারা যেন তাঁদের জন্য এবং বিশ্বের সকল মৃত মুসলিমের জন্য আন্তরিকভাবে দোয়া করেন।",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"হে আল্লাহ, তাঁদের ক্ষমা করুন ও দয়া করুন, তাঁদের শান্তিতে রাখুন এবং তাঁদের ভুলত্রুটি ক্ষমা করুন। তাঁদের অবস্থানকে সম্মানিত করুন এবং তাঁদের প্রবেশপথকে প্রশস্ত করুন; তাঁদের জল, তুষার ও শিলাবৃষ্টি দিয়ে ধৌত করুন; এবং তাঁদের পাপ থেকে এমনভাবে পরিচ্ছন্ন করুন যেমন সাদা পোশাক ময়লা থেকে পরিষ্কার করা হয়।\"",
                footer: "দয়া করে আমাদের দোয়াতে রাখবেন।",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'অনুবাদ Allahin99ismi.com থেকে সংগৃহীত',
                TranslationCredit: 'অনুবাদ Allahin99ismi.com থেকে সংগৃহীত',
            }
        }
    },
    fa: {
        translation: {
            navigation: {
                learn: 'یادگیری',
                memorize: 'حفظ کردن',
                hall: 'برترین‌ها',
                dua: 'دعا',
            },
            learn: {
                title: 'یادگیری ۹۹ نام',
                subtitle: 'در نام‌ها و معانی آن‌ها تامل کنید.',
                playNasheed: 'پخش نشید',
                nasheeds: 'نشیدها',
                close: 'بستن',
                meaning: 'معنی',
            },
            memorize: {
                title: 'حفظ کردن',
                revealed: 'آشکار شده',
                inputPlaceholder: 'نامی را بنویسید...',
                submit: 'ارسال',
                useHint: 'راهنمایی',
                score: 'نام‌های یافته شده',
                hintsUsed: 'راهنمایی‌های استفاده شده',
                encouragement: 'ادامه دهید! برای ورود به تالار مشاهیر سعی کنید همه را حفظ کنید.',
                tryAgainNoHints: 'برای ورود به تالار مشاهیر، باید تمام ۹۹ نام را بدون هیچ راهنمایی حفظ کنید. شما می‌توانید!',
                congratulations: 'تبریک می‌گوییم!',
                completedMessage: 'شما تمام ۹۹ نام الله را به زیبایی حفظ کرده‌ید.',
                proceedToOath: 'مشاهده سوگندنامه',
                tryAgain: 'تلاش مجدد',
            },
            hall: {
                title: 'تالار مشاهیر',
                score: 'امتیاز',
                hints: 'راهنمایی',
                date: 'تاریخ',
                oathTitle: 'سوگند صداقت',
                oathText: 'من به الله (ﷻ) که شنوا و بیناست سوگند یاد می‌کنم که تمام ۹۹ نام الله را کاملاً از حفظ و بدون استفاده از هیچ کمکی در طول این جلسه گفته‌ام.',
                oathPrompt: 'اگر این کار را صادقانه انجام داده‌اید، می‌توانید نام خود را در تالار مشاهیر جهانی ثبت کنید.',
                namePlaceholder: 'نام شما',
                selectCountry: 'انتخاب کشور',
                signOath: 'امضای سوگند و ارسال',
                submitting: 'در حال ارسال...',
                subtitle: 'ملت‌هایی که در ذکر الله متحد شده‌اند.',
            },
            dedication: {
                title: 'اهدا',
                intro: "این اپلیکیشن متواضعانه به یاد پدر مرحومم،",
                issa: "عیسی",
                sisterIntro: "، خواهر عزیزم،",
                zainab: "زینب",
                grandparentsIntro: "، و ",
                grandparents: "پدربزرگ و مادربزرگ",
                prayer1: "عزیزم اهدا شده است. خداوند (ﷻ) آن‌ها را در رحمت بی‌کران خود بپوشاند، گناهانشان را ببخشد، قبرهایشان را نورانی کند و درجاتشان را در جنت‌الفردوس متعالی گرداند.",
                prayer2: "از کسانی که از این برنامه بهره‌مند می‌شوند می‌خواهیم لحظه‌ای را به دعای خالصانه برای آن‌ها و همه مسلمانان درگذشته در سراسر جهان اختصاص دهند.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"بارالها، آنان را بیامرز و مورد رحمت قرار ده، سلامت و عافیت بدار و از آنان درگذر، جایگاهشان را گرامی بدار و ورودشان را وسعت بخش؛ آنان را با آب، برف و تگرگ شستشو ده؛ و آنان را از گناهان پاک کن، همانگونه که جامه سپید از آلودگی پاک می‌شود.\"",
                footer: "لطفاً ما را در دعای خود یاد کنید.",
                version: "v1.0.11"
            },
            common: {
                translationCredit: 'ترجمه‌ها توسط Allahin99ismi.com ارائه شده است',
                TranslationCredit: 'ترجمه‌ها توسط Allahin99ismi.com ارائه شده است',
            }
        }
    },
    fr: {
        translation: {
            navigation: {
                learn: 'Apprendre',
                memorize: 'Mémoriser',
                hall: 'Classement',
                dua: 'Doua',
            },
            learn: {
                title: 'Apprendre les 99 Noms',
                subtitle: 'Parcourez et méditez sur leurs significations.',
                playNasheed: 'Jouer Nasheed',
                nasheeds: 'Nasheeds',
                close: 'Fermer',
                meaning: 'Signification',
            },
            memorize: {
                title: 'Mémoriser',
                revealed: 'Révélé',
                inputPlaceholder: 'Tapez un nom...',
                submit: 'Envoyer',
                useHint: 'Indice',
                score: 'Noms Trouvés',
                hintsUsed: 'Indices Utilisés',
                encouragement: 'Continuez ! Essayez de tous les mémoriser pour le Classement.',
                tryAgainNoHints: 'Pour entrer dans le Classement, vous devez mémoriser les 99 noms sans aucun indice. Vous pouvez le faire !',
                congratulations: 'Félicitations !',
                completedMessage: 'Vous avez magnifiquement mémorisé les 99 Noms d\'Allah.',
                proceedToOath: 'Passer au Serment',
                tryAgain: 'Réessayer',
            },
            hall: {
                title: 'Classement',
                score: 'Score',
                hints: 'Indices',
                date: 'Date',
                oathTitle: 'Le Serment d\'Honnêteté',
                oathText: 'Je jure solennellement par Allah (ﷻ), Celui qui voit tout et qui entend tout, que j\'ai mémorisé et récité les 99 Noms d\'Allah entièrement de mémoire, sans l\'aide d\'aucun support, liste ou aide extérieure durant cette session.',
                oathPrompt: 'Si vous avez accompli cela honnêtement, vous pouvez entrer votre nom dans le Classement mondial.',
                namePlaceholder: 'Votre Nom',
                selectCountry: 'Choisir Pays',
                signOath: 'Signer le Serment & Envoyer',
                submitting: 'Envoi...',
                subtitle: 'Des nations unies dans le souvenir d\'Allah.',
                countriesTab: 'Pays',
                fastestTab: 'Les plus rapides',
            },
            dedication: {
                title: 'Dédicace',
                intro: "Cette application est humblement dédiée à la mémoire de mon défunt père,",
                issa: "Issa",
                sisterIntro: ", ma sœur bien-aimée,",
                zainab: "Zainab",
                grandparentsIntro: ", et mes chers",
                grandparents: "Grands-parents",
                prayer1: "Puisse Allah (ﷻ) les envelopper de Sa miséricorde infinie, pardonner leurs péchés, illuminer leurs tombes et élever leurs rangs au Jannatul Firdaus.",
                prayer2: "Nous demandons à quiconque bénéficie de cette application de prendre un court instant pour faire une Doua sincère pour eux, et pour tous les musulmans décédés dans le monde.",
                duaArabic: "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ، وَعَافِهِمْ وَاعْفُ عَنْهُمْ، وَأَكْرِمْ نُزُلَهُمْ، وَوَسِّعْ مُدْخَلَهُمْ، وَاغْسِلْهُمْ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِمْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ",
                duaTranslation: "\"Ô Allah, pardonne-leur et fais-leur miséricorde, préserve-les et pardonne-leur, honore leur repos et facilite leur entrée ; lave-les avec l'eau, la neige et la grêle, et purifie-les du péché comme un vêtement blanc est purifié de la saleté.\"",
                footer: "S'il vous plaît, gardez-nous dans vos prières.",
                version: "v1.0.8"
            },
            onboarding: {
                title: 'Bienvenue sur Husna',
                subtitle: 'Votre compagnon pour les 99 Noms de Dieu (Allâh).',
                step1Title: 'Apprendre et Méditer',
                step1Text: 'Parcourez les 99 Noms, écoutez leur prononciation et méditez sur leurs significations profondes.',
                step2Title: 'Le Jeu de Mémorisation',
                step2Text: 'Testez votre mémoire ! Tapez le nom en arabe ou en translittération. Les bonnes réponses retournent une nouvelle tuile.',
                step3Title: 'Indices et Classement',
                step3Text: 'Vous pouvez utiliser des indices si vous êtes bloqué, mais n\'oubliez pas : l\'utilisation d\'un seul indice vous disqualifie du Classement mondial pour cette session.',
                step4Title: 'Le Serment d\'Honnêteté',
                step4Text: 'Une fois que vous avez mémorisé tous les noms sans aide, signez le serment et rejoignez les rangs des chercheurs du monde entier.',
                getStarted: 'Commencer',
            },
            common: {
                translationCredit: 'Traduction par Allahin99ismi.com',
                selectLanguage: 'Choisir la Langue',
            }
        }
    }
};

const LANGUAGE_KEY = '@app_language';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLanguage) {
                callback(savedLanguage);
                return;
            }
            callback('en'); // fallback
        } catch (error) {
            console.log('Error reading language', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
