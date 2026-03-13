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
                useHint: 'Use Hint (-5 pts)',
                score: 'Score',
                hintsUsed: 'Hints Used',
                congratulations: 'Congratulations!',
                completedMessage: 'You have beautifully memorized all 99 Names of Allah.',
                proceedToOath: 'Proceed to Oath',
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
                useHint: 'استخدام تلميح (-٥ نقاط)',
                score: 'النقاط',
                hintsUsed: 'التلميحات',
                congratulations: 'مبارك!',
                completedMessage: 'لقد أتممت حفظ ٩٩ اسماً من أسماء الله الحسنى.',
                proceedToOath: 'الانتقال إلى القسم',
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
                useHint: 'Koristi pomoć (-5 bodova)',
                score: 'Bodovi',
                hintsUsed: 'Korištena pomoć',
                congratulations: 'Čestitamo!',
                completedMessage: 'Predivno si zapamtio svih 99 Allahovih Imena.',
                proceedToOath: 'Zavjet',
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
