import React from 'react';
import namesData from '../data/names.json';

const LearnMode = () => {
    const playAudio = (arabicName) => {
        // Basic TTS as a placeholder for real audio files
        const utterance = new SpeechSynthesisUtterance(arabicName);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="learn-container">
            <div className="learn-header">
                <h2>Learn the 99 Names</h2>
                <p>Scroll through and reflect on their meanings.</p>
            </div>
            <div className="names-list">
                {namesData.map((name) => (
                    <div key={name.id} className="name-card">
                        <div className="card-header">
                            <span className="name-number">{name.id}</span>
                            <button className="play-btn" onClick={() => playAudio(name.arabic)} title="Listen">
                                ▶
                            </button>
                        </div>
                        <div className="arabic-text">{name.arabic}</div>
                        <div className="transliteration">{name.transliteration}</div>
                        <div className="meaning">{name.meaning}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LearnMode;
