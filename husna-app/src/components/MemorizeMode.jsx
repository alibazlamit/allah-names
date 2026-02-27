import React, { useState, useRef } from 'react';
import namesData from '../data/names.json';

const MemorizeMode = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [testComplete, setTestComplete] = useState(false);

    const pressTimer = useRef(null);

    const currentName = namesData[currentIndex];

    const playAudio = () => {
        const utterance = new SpeechSynthesisUtterance(currentName.arabic);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
    };

    const handleReveal = () => {
        // Basic verification: accept if it matches transliteration or arabic roughly
        // Real implementation would use fuzzy finding for normalization.
        const normalizedInput = inputVal.toLowerCase().trim();
        const isCorrect =
            normalizedInput === currentName.transliteration.toLowerCase() ||
            normalizedInput === currentName.arabic;

        if (isCorrect) setScore(s => s + 1);
        setIsFlipped(true);
    };

    const handleNext = () => {
        if (currentIndex < namesData.length - 1) {
            setCurrentIndex(i => i + 1);
            setIsFlipped(false);
            setInputVal('');
        } else {
            setTestComplete(true);
        }
    };

    const handlePressIn = () => {
        pressTimer.current = setTimeout(() => {
            if (!isFlipped) {
                setIsFlipped(true);
                setHintsUsed(h => h + 1);
            }
        }, 600);
    };

    const handlePressOut = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    if (testComplete) {
        return (
            <div className="test-complete">
                <h2>Memorization Complete</h2>
                <p>You scored {score} out of {namesData.length} and used {hintsUsed} hints.</p>
                {score === namesData.length && hintsUsed === 0 ? (
                    <div>
                        <p className="success-msg">Masha'Allah! You have memorized the names perfectly.</p>
                        <button className="primary-btn" onClick={onComplete}>Proceed to Oath</button>
                    </div>
                ) : (
                    <div>
                        <p>In order to qualify for the Hall of Fame you must memorize 99 names using no hints. Keep doing it brother!</p>
                        <button className="secondary-btn" onClick={() => {
                            setCurrentIndex(0); setScore(0); setHintsUsed(0); setTestComplete(false); setInputVal(''); setIsFlipped(false);
                        }}>Try Again</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="memorize-container">
            <div className="memorize-header">
                <h2>Memorize Mode</h2>
                <p>Type the Transliteration or Arabic name</p>
                <div className="progress">Card {currentIndex + 1} of {namesData.length}</div>
            </div>

            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                <div className="flashcard-inner">
                    <div
                        className="flashcard-front"
                        onMouseDown={handlePressIn}
                        onMouseUp={handlePressOut}
                        onMouseLeave={handlePressOut}
                        onTouchStart={handlePressIn}
                        onTouchEnd={handlePressOut}
                    >
                        <button className="play-btn large" onClick={(e) => { e.stopPropagation(); playAudio(); }} title="Play Audio">▶</button>
                        <div className="meaning-hint">"{currentName.meaning}"</div>

                        <input
                            type="text"
                            className="answer-input"
                            placeholder="Type the name..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isFlipped && handleReveal()}
                            disabled={isFlipped}
                            autoFocus
                        />

                        {!isFlipped && (
                            <button className="submit-btn" onClick={handleReveal}>Submit</button>
                        )}
                    </div>

                    <div className="flashcard-back">
                        <h3 className="result-title">Answer:</h3>
                        <div className="arabic-text">{currentName.arabic}</div>
                        <div className="transliteration">{currentName.transliteration}</div>
                        <button className="next-btn" onClick={handleNext}>Next Card</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemorizeMode;
