const fs = require('fs');
const path = require('path');

const namesPath = path.join(__dirname, '..', 'data', 'names.json');
const translationsDir = path.join(__dirname, '..', 'data', 'translations');

if (!fs.existsSync(translationsDir)) {
    fs.mkdirSync(translationsDir, { recursive: true });
}

const names = JSON.parse(fs.readFileSync(namesPath, 'utf8'));

const languages = ['en', 'ar', 'bs', 'tr', 'ur', 'id', 'bn', 'fa', 'fr'];
const translationData = {};

languages.forEach(lang => {
    translationData[lang] = {};
});

names.forEach(name => {
    languages.forEach(lang => {
        // Handle variations in field naming
        const meaning = name[`meaning_${lang}`] || (lang === 'en' ? (name.meaning_en || name.meaning) : null);
        if (meaning) {
            translationData[lang][name.id] = meaning;
        }
    });
});

languages.forEach(lang => {
    const filePath = path.join(translationsDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(translationData[lang], null, 4));
    console.log(`Created ${lang}.json`);
});

// Create a version of names.json without meanings
const coreNames = names.map(name => {
    const { 
        meaning, meaning_en, meaning_ar, meaning_bs, meaning_tr, 
        meaning_ur, meaning_id, meaning_bn, meaning_fa, meaning_fr,
        ...core 
    } = name;
    return core;
});

const coreNamesPath = path.join(__dirname, '..', 'data', 'names.json');
fs.writeFileSync(coreNamesPath, JSON.stringify(coreNames, null, 4));
console.log('Successfully stripped meanings from names.json');
