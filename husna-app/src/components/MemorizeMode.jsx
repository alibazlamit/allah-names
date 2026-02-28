import React, { useState, useRef, useEffect } from 'react';
import namesData from '../data/names.json';

const NameTile = ({ item, isFlipped, onLongPress }) => {
    const pressTimer = useRef(null);

    const handlePressIn = () => {
        pressTimer.current = setTimeout(() => {
            onLongPress();
        }, 600);
    };

    const handlePressOut = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
        <div
            className={`tile-wrapper ${isFlipped ? 'flipped' : ''}`}
            onMouseDown={handlePressIn}
            onMouseUp={handlePressOut}
            onMouseLeave={handlePressOut}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
        >
            <div className="tile-inner">
                <div className="tile-front">
                    <span className="tile-number">{item.id}</span>
                </div>
                <div className="tile-back">
                    <div className="tile-arabic">{item.arabic}</div>
                    <div className="tile-transliteration">{item.transliteration}</div>
                </div>
            </div>
        </div>
    );
};

const MemorizeMode = ({ onComplete }) => {
    const [inputVal, setInputVal] = useState('');
    const [revealedIds, setRevealedIds] = useState(new Set());
    const [hintsUsed, setHintsUsed] = useState(0);

    const normalizeArabic = (text) => {
        return text
            .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '') // Remove diacritics
            .replace(/[إأٱآا]/g, 'ا') // Normalize Alif
            .replace(/[يى]/g, 'ي') // Normalize Yaa/Alif Maqsura
            .replace(/ة/g, 'ه') // Normalize Ta Marbuta
            .replace(/ـ/g, '') // Remove Tatweel/Kashida
            .replace(/[^ء-ي]/g, ''); // Remove EVERYTHING that is not a core Arabic letter
    };

    const normalizeEnglish = (text) => {
        return text.toLowerCase().replace(/[^a-z]/gi, ''); // Only letters
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputVal(text);
        if (!text.trim()) return;

        const normEnInput = normalizeEnglish(text);
        const normArInput = normalizeArabic(text);

        const matchedName = namesData.find(name => {
            if (revealedIds.has(name.id)) return false;

            // Transliteration checks
            const normTrans = normalizeEnglish(name.transliteration);
            let normTransBase = normTrans;
            if (normTrans.startsWith('al')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('ar')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('as')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('ad')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('an')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('az')) normTransBase = normTrans.slice(2);
            else if (normTrans.startsWith('ash')) normTransBase = normTrans.slice(3);
            else if (normTrans.startsWith('at')) normTransBase = normTrans.slice(2);

            // Arabic checks
            const normArabic = normalizeArabic(name.arabic);
            const normArabicBase = normArabic.startsWith('ال') ? normArabic.substring(2) : normArabic;

            const isEnglishMatch = normEnInput.length > 2 && (normEnInput === normTrans || normEnInput === normTransBase);
            const isArabicMatch = normArInput.length > 1 && (normArInput === normArabic || normArInput === normArabicBase);

            return isEnglishMatch || isArabicMatch;
        });

        if (matchedName) {
            setRevealedIds(prev => new Set(prev).add(matchedName.id));
            setInputVal(''); // clear input after correct guess

            // Auto scroll in browser
            setTimeout(() => {
                const element = document.getElementById(`tile-${matchedName.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const revealHint = (id) => {
        if (!revealedIds.has(id)) {
            setRevealedIds(prev => new Set(prev).add(id));
            setHintsUsed(h => h + 1);
        }
    };

    const useHint = () => {
        // Find first unrevealed
        const unrevealed = namesData.find(name => !revealedIds.has(name.id));
        if (unrevealed) {
            setRevealedIds(prev => new Set(prev).add(unrevealed.id));
            setHintsUsed(h => h + 1);

            setTimeout(() => {
                const element = document.getElementById(`tile-${unrevealed.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const isTestComplete = revealedIds.size === namesData.length;

    if (isTestComplete) {
        return (
            <div className="test-complete">
                <h2>Masha'Allah!</h2>
                <p className="success-msg">
                    You memorized {namesData.length - hintsUsed} of {namesData.length} and used {hintsUsed} hints.
                </p>
                {hintsUsed === 0 ? (
                    <div>
                        <button className="primary-btn" onClick={onComplete}>Proceed to Oath</button>
                    </div>
                ) : (
                    <div>
                        <p style={{ marginBottom: '20px' }}>In order to qualify for the Hall of Fame you must memorize 99 names using no hints. Keep doing it brother!</p>
                        <button className="secondary-btn" onClick={() => {
                            setRevealedIds(new Set());
                            setHintsUsed(0);
                            setInputVal('');
                        }}>Try Again</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="memorize-container">
            <div className="header-row" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="memorize-header">
                    <h2>Memorize (Grid Mode)</h2>
                    <div className="progress">{revealedIds.size} / 99 Revealed</div>
                </div>
                <button className="hint-btn" onClick={useHint}>Use Hint</button>
            </div>

            <div className="input-container" style={{ maxWidth: '600px', width: '100%' }}>
                <input
                    type="text"
                    className="answer-input"
                    placeholder="Type any name..."
                    value={inputVal}
                    onChange={handleInputChange}
                    autoFocus
                />
            </div>

            <div className="tiles-grid">
                {namesData.map((name) => (
                    <div key={name.id} id={`tile-${name.id}`}>
                        <NameTile
                            item={name}
                            isFlipped={revealedIds.has(name.id)}
                            onLongPress={() => revealHint(name.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemorizeMode;
