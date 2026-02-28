import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const HallOfFame = ({ initialMode, onOathComplete }) => {
    const [mode, setMode] = useState(initialMode); // 'oath' or 'leaderboard'
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null);
    const [sworeOath, setSworeOath] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [leaderboard, setLeaderboard] = useState([]);
    const countryOptions = useMemo(() => countryList().getData(), []);

    useEffect(() => {
        setMode(initialMode);
        if (initialMode === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [initialMode]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://husna.alibazlamit.com/api/leaderboard');
            const data = await res.json();
            if (data.data) {
                setLeaderboard(data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load leaderboard.');
        }
        setLoading(false);
    };

    const handleOathSubmit = async (e) => {
        e.preventDefault();
        if (!sworeOath) {
            setError('You must swear the oath to proceed.');
            return;
        }
        if (!name || !country || !country.label) {
            setError('Please provide your name and country.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('https://husna.alibazlamit.com/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, country: country.label, sworeOath })
            });
            const data = await res.json();
            if (res.ok) {
                if (onOathComplete) onOathComplete();
                setMode('leaderboard');
                fetchLeaderboard();
            } else {
                setError(data.error || 'Submission failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error.');
        }
        setLoading(false);
    };

    if (mode === 'oath') {
        return (
            <div className="oath-container">
                <div className="oath-card">
                    <h2>The Honor System</h2>
                    <p className="oath-desc">
                        You have completed the memorization journey. Spiritual milestones rely on honesty and sincerity with Allah.
                        Before your name is inscribed in the Hall of Fame, you must take this solemn oath.
                    </p>

                    <form onSubmit={handleOathSubmit} className="oath-form">
                        <input
                            type="text"
                            placeholder="Your Name (or Nickname)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <Select
                            options={countryOptions}
                            value={country}
                            onChange={selectedOption => setCountry(selectedOption)}
                            placeholder="Select your country..."
                            className="country-select-container"
                            classNamePrefix="country-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    padding: '5px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    marginBottom: '1rem'
                                })
                            }}
                        />

                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="oath-checkbox"
                                checked={sworeOath}
                                onChange={e => setSworeOath(e.target.checked)}
                            />
                            <label htmlFor="oath-checkbox">
                                "I swear by Allah that I completed the 99 Names memorization test truthfully, without looking at any external resources."
                            </label>
                        </div>

                        {error && <div className="error-msg">{error}</div>}

                        <button type="submit" className="primary-btn oath-submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Sign Oath & Enter Hall of Fame'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Leaderboard Mode
    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>Global Hall of Fame</h2>
                <p>Nations uniting in the remembrance of Allah.</p>
            </div>

            {loading ? (
                <div className="loading">Loading rankings...</div>
            ) : (
                <div className="rankings-list">
                    {leaderboard.length === 0 ? (
                        <p className="empty-msg">No one has entered the Hall of Fame yet. Be the first!</p>
                    ) : (
                        leaderboard.map((item, idx) => (
                            <div key={idx} className="ranking-card">
                                <span className="rank-num">#{idx + 1}</span>
                                <span className="rank-country">{item.country}</span>
                                <span className="rank-count">{item.count} Memorizers</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HallOfFame;
