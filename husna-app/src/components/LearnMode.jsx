import React, { useState, useEffect, useRef } from 'react';
import namesData from '../data/names.json';

const NASHEEDS = [
    { id: 'asma0allah', name: 'Asma Allah Alhusna', file: '/assets/asma0allah.mp3' },
    { id: 'imad-rami', name: 'Imad Rami - Asma Allah', file: '/assets/imad-rami.mp3' },
    { id: 'ismael-belousch', name: 'Ismael Belousch', file: '/assets/ismael-belousch.mp3' }
];

const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const LearnMode = () => {
    const [selectedNasheed, setSelectedNasheed] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);

    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    useEffect(() => {
        // Auto-play when nasheed changes
        if (selectedNasheed && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
            setIsPlaying(true);
        }
    }, [selectedNasheed]);

    const playNameAudio = (arabicName) => {
        const utterance = new SpeechSynthesisUtterance(arabicName);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
    };

    const togglePlayPause = () => {
        if (!audioRef.current || !selectedNasheed) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error(e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressClick = (e) => {
        if (!progressBarRef.current || !audioRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    return (
        <div className="learn-container" style={{ paddingBottom: selectedNasheed ? '120px' : '20px' }}>
            <div className="learn-header">
                <h2>Learn the 99 Names</h2>
                <p>Scroll through and reflect on their meanings.</p>
            </div>

            <div className="nasheed-selector">
                <span>Background Nasheed:</span>
                <select
                    className="nasheed-select"
                    value={selectedNasheed?.id || ''}
                    onChange={(e) => {
                        const nash = NASHEEDS.find(n => n.id === e.target.value);
                        setSelectedNasheed(nash || null);
                    }}
                >
                    <option value="">None</option>
                    {NASHEEDS.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                </select>
            </div>

            <div className="names-list">
                {namesData.map((name) => (
                    <div key={name.id} className="name-card">
                        <div className="card-header">
                            <span className="name-number">{name.id}</span>
                            <button className="play-btn" onClick={() => playNameAudio(name.arabic)} title="Listen">
                                ▶
                            </button>
                        </div>
                        <div className="arabic-text">{name.arabic}</div>
                        <div className="transliteration">{name.transliteration}</div>
                        <div className="meaning">{name.meaning}</div>
                    </div>
                ))}
            </div>

            {selectedNasheed && (
                <div className={`audio-player-container ${isMinimized ? 'minimized' : ''}`}>
                    <audio
                        ref={audioRef}
                        src={selectedNasheed.file}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => {
                            if (!isLooping) setIsPlaying(false);
                        }}
                        loop={isLooping}
                    />

                    <div className="player-header">
                        <span className="player-title">{selectedNasheed.name}</span>
                        <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
                            {isMinimized ? '▲' : '▼'}
                        </button>
                    </div>

                    {!isMinimized && (
                        <>
                            <div className="progress-container">
                                <span className="time-text">{formatTime(progress)}</span>
                                <div className="progress-bar-wrapper" ref={progressBarRef} onClick={handleProgressClick}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="time-text">{formatTime(duration)}</span>
                            </div>

                            <div className="player-controls">
                                <button className="control-btn" onClick={togglePlayPause}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <button
                                    className={`control-btn loop-btn ${isLooping ? 'active' : ''}`}
                                    onClick={() => setIsLooping(!isLooping)}
                                    title="A-B Loop"
                                >
                                    🔁
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default LearnMode;
