import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const API_URL = 'https://husna.alibazlamit.com';

const HallOfFame = ({ initialMode, onOathComplete }) => {
    const [mode, setMode] = useState(initialMode); // 'oath' or 'leaderboard'
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null); // Will store country object
    const [sworeOath, setSworeOath] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        setMode(initialMode);
        if (initialMode === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [initialMode]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/leaderboard`);
            const data = await res.json();
            if (data.data) {
                setLeaderboard(data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load leaderboard. Ensure API is running on port 3005.');
        }
        setLoading(false);
    };

    const handleOathSubmit = async () => {
        if (!sworeOath) {
            setError('You must swear the oath to proceed.');
            return;
        }
        if (!name.trim() || !country) {
            setError('Please provide your name and select your country.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, country: country.name, sworeOath })
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
            setError('Network error syncing with server.');
        }
        setLoading(false);
    };

    if (mode === 'oath') {
        return (
            <View style={styles.oathContainer}>
                <View style={styles.oathCard}>
                    <Text style={styles.oathTitle}>The Honor System</Text>
                    <Text style={styles.oathDesc}>
                        You have completed the memorization journey. Spiritual milestones rely on honesty and sincerity with Allah.
                        Before your name is inscribed in the Hall of Fame, you must take this solemn oath.
                    </Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name (or Nickname)"
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                        />

                        <View style={styles.countryPickerContainer}>
                            <CountryPicker
                                withFilter
                                withFlag
                                withCountryNameButton
                                withAlphaFilter={false}
                                withCallingCode={false}
                                withEmoji
                                onSelect={(c) => setCountry(c)}
                                visible={false}
                                theme={{
                                    onBackgroundTextColor: '#fff',
                                    backgroundColor: '#1e1e1e',
                                    filterPlaceholderTextColor: '#888',
                                    primaryColor: '#000',
                                }}
                            />
                            {!country && <Text style={styles.countryPlaceholder}>Select Your Country</Text>}
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxWrapper}
                            onPress={() => setSworeOath(!sworeOath)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, sworeOath && styles.checkboxChecked]} />
                            <Text style={styles.checkboxLabel}>
                                "I swear by Allah that I completed the 99 Names memorization test truthfully, without looking at any external resources."
                            </Text>
                        </TouchableOpacity>

                        {!!error && <Text style={styles.errorMsg}>{error}</Text>}

                        <TouchableOpacity style={styles.submitBtn} onPress={handleOathSubmit} disabled={loading}>
                            <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Sign Oath & Enter Hall of Fame'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.leaderboardContainer}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.leaderboardTitle}>Global Hall of Fame</Text>
                <Text style={styles.leaderboardSubtitle}>Nations uniting in the remembrance of Allah.</Text>
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Loading rankings...</Text>
            ) : (
                <ScrollView style={styles.rankingsList} contentContainerStyle={{ paddingBottom: 40 }}>
                    {leaderboard.length === 0 ? (
                        <Text style={styles.emptyMsg}>No one has entered the Hall of Fame yet. Be the first!</Text>
                    ) : (
                        leaderboard.map((item, idx) => (
                            <View key={idx} style={styles.rankingCard}>
                                <Text style={styles.rankNum}>#{idx + 1}</Text>
                                <Text style={styles.rankCountry}>{item.country}</Text>
                                <Text style={styles.rankCount}>{item.count} Memorizers</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    oathContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    oathCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderRadius: 16,
        padding: 25,
        width: '100%',
        alignItems: 'center',
    },
    oathTitle: {
        color: '#d4af37',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    oathDesc: {
        color: '#b0b3b8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        color: '#fff',
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    countryPickerContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 54,
    },
    countryPlaceholder: {
        color: '#888',
        fontSize: 16,
        marginLeft: 10,
        position: 'absolute',
        left: 45, // roughly after the flag
    },
    checkboxWrapper: {
        flexDirection: 'row',
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#d4af37',
        marginRight: 10,
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#d4af37',
    },
    checkboxLabel: {
        color: '#f8f9fa',
        flex: 1,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    errorMsg: {
        color: '#ef4444',
        marginBottom: 15,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: '#d4af37',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    leaderboardContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
    },
    leaderboardHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    leaderboardTitle: {
        color: '#d4af37',
        fontSize: 24,
        fontWeight: 'bold',
    },
    leaderboardSubtitle: {
        color: '#b0b3b8',
        marginTop: 5,
    },
    loadingText: {
        color: '#fff',
        marginTop: 20,
    },
    rankingsList: {
        width: '100%',
        paddingHorizontal: 20,
    },
    rankingCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#d4af37',
        marginBottom: 15,
        alignItems: 'center',
    },
    rankNum: {
        color: '#d4af37',
        fontSize: 18,
        fontWeight: 'bold',
        width: 40,
    },
    rankCountry: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    rankCount: {
        color: '#b0b3b8',
        fontSize: 14,
    },
    emptyMsg: {
        color: '#b0b3b8',
        textAlign: 'center',
        marginTop: 40,
    }
});

export default HallOfFame;
