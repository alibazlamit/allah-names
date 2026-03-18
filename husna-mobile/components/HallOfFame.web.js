import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

const API_URL = 'https://husna.alibazlamit.com';
const API_SECRET = 'husna-secret-key-2026'; // Same as mobile/server

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const HallOfFame = ({ initialMode, timeTaken, onOathComplete }) => {
    const { t } = useTranslation();
    const options = React.useMemo(() => countryList().getData(), []);
    const [mode, setMode] = useState(initialMode); // 'oath', 'leaderboard', or 'badge'
    const [tab, setTab] = useState('country'); // 'country' or 'names'
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null); // { label: 'Country Name', value: 'ISO' }
    const [sworeOath, setSworeOath] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [userUuid, setUserUuid] = useState(null);
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        loadUserIdentity();
    }, []);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    useEffect(() => {
        if (mode === 'leaderboard') {
            fetchLeaderboard();
            if (tab === 'names') fetchUserRank();
        }
    }, [mode, tab]);

    const loadUserIdentity = () => {
        let uuid = localStorage.getItem('user_uuid');
        if (!uuid) {
            uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('user_uuid', uuid);
        }
        setUserUuid(uuid);
        
        const savedName = localStorage.getItem('user_name');
        if (savedName) setName(savedName);
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = `${API_URL}/api/leaderboard?type=${tab}`;
            const res = await fetch(endpoint);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server returned ${res.status}`);
            }
            const data = await res.json();
            if (data.data) {
                setLeaderboard(data.data);
            }
        } catch (err) {
            console.error('Leaderboard error:', err);
            setError(t('hall.networkError') || 'Failed to load leaderboard. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRank = async () => {
        if (!userUuid) return;
        try {
            const res = await fetch(`${API_URL}/api/leaderboard/rank/${userUuid}`);
            const data = await res.json();
            if (data.rank) setUserRank(data);
        } catch (err) { console.error(err); }
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
            localStorage.setItem('user_name', name.trim());

            const timestamp = Math.floor(Date.now() / 1000).toString();
            const payload = `${timestamp}${name.trim()}${country.label}${timeTaken || ''}`;
            const signature = hmacSHA256(payload, API_SECRET).toString(Hex);

            const res = await fetch(`${API_URL}/api/leaderboard`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-husna-signature': signature,
                    'x-husna-timestamp': timestamp
                },
                body: JSON.stringify({ 
                    name: name.trim(), 
                    country: country.label, 
                    sworeOath: true,
                    user_uuid: userUuid,
                    time_taken: timeTaken
                })
            });
            const data = await res.json();
            if (res.ok) {
                if (onOathComplete) onOathComplete();
                setMode('leaderboard');
                setTab('names');
                fetchLeaderboard();
            } else {
                setError(data.error || 'Submission failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error syncing with server.');
        } finally {
            setLoading(false);
        }
    };

    const CertificateCard = () => {
        if (!name) return null;
        return (
            <View style={styles.badgeContainer}>
                <View style={styles.badgeCard}>
                    <View style={styles.badgeTopDecor} />
                    <Text style={styles.badgeTitle}>Hafiz al-Asma</Text>
                    <Text style={styles.badgeName}>{name}</Text>
                    <Text style={styles.badgeText}>
                        Has successfully memorized the 99 Beautiful Names of Allah.
                    </Text>
                    <View style={styles.badgeBottomRow}>
                        <Text style={styles.badgeDate}>{new Date().toLocaleDateString()}</Text>
                        <Text style={styles.badgeCountry}>{country?.label || 'World'}</Text>
                    </View>
                    <View style={styles.badgeSeal}>
                        <Text style={styles.badgeSealText}>99</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (mode === 'oath') {
        return (
            <View style={styles.oathContainer}>
                <View style={styles.oathCard}>
                    <Text style={styles.oathTitle}>{t('hall.oathTitle')}</Text>
                    <Text style={styles.oathDesc}>
                        {t('hall.oathText')}
                    </Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('hall.namePlaceholder')}
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                        />

                        <View style={styles.countryPickerContainer}>
                            <Select
                                options={options}
                                value={country}
                                onChange={setCountry}
                                placeholder={t('hall.selectCountry') || "Select your country..."}
                                styles={customSelectStyles}
                                menuPortalTarget={document.body}
                                menuPlacement="auto"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxWrapper}
                            onPress={() => setSworeOath(!sworeOath)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, sworeOath && styles.checkboxChecked]} />
                            <Text style={styles.checkboxLabel}>
                                {t('hall.oathPrompt')}
                            </Text>
                        </TouchableOpacity>

                        {!!error && <Text style={styles.errorMsg}>{error}</Text>}

                        <TouchableOpacity style={styles.submitBtn} onPress={handleOathSubmit} disabled={loading}>
                            <Text style={styles.submitBtnText}>{loading ? t('hall.submitting') : t('hall.signOath')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.leaderboardContainer}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.leaderboardTitle}>{t('hall.title')}</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tabItem, tab === 'country' && styles.tabItemActive]} 
                        onPress={() => setTab('country')}
                    >
                        <Text style={[styles.tabLabel, tab === 'country' && styles.tabLabelActive]}>Countries</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabItem, tab === 'names' && styles.tabItemActive]} 
                        onPress={() => setTab('names')}
                    >
                        <Text style={[styles.tabLabel, tab === 'names' && styles.tabLabelActive]}>Fastest</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Loading rankings...</Text>
            ) : (
                <ScrollView style={styles.rankingsList} contentContainerStyle={{ paddingBottom: 100 }}>
                    <CertificateCard />
                    {leaderboard.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Text style={styles.emptyMsg}>No entries yet. Be the first!</Text>
                        </View>
                    ) : (
                        <>
                            {leaderboard.map((item, idx) => (
                                <View key={idx} style={styles.rankingCard}>
                                    <Text style={styles.rankNum}>#{idx + 1}</Text>
                                    <View style={styles.rankInfo}>
                                        <Text style={styles.rankMainText}>{tab === 'country' ? item.country : item.name}</Text>
                                        <Text style={styles.rankSubText}>{tab === 'country' ? `${item.count} Memorizers` : item.country}</Text>
                                    </View>
                                    {tab === 'names' && item.time_taken && (
                                        <Text style={styles.rankMetric}>{formatTime(item.time_taken)}</Text>
                                    )}
                                </View>
                            ))}

                            {tab === 'names' && userRank && userRank.rank > 20 && (
                                <>
                                    <Text style={styles.rankDivider}>•••</Text>
                                    <View style={[styles.rankingCard, styles.rankingCardUser]}>
                                        <Text style={styles.rankNum}>#{userRank.rank}</Text>
                                        <View style={styles.rankInfo}>
                                            <Text style={styles.rankMainText}>{userRank.user.name} (You)</Text>
                                            <Text style={styles.rankSubText}>{userRank.user.country}</Text>
                                        </View>
                                        <Text style={styles.rankMetric}>{formatTime(userRank.user.time_taken)}</Text>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: state.isFocused ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.1)',
        padding: '4px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#d4af37',
        },
        minHeight: 54,
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 10px',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        marginTop: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        overflow: 'hidden',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        padding: 0,
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
            background: 'rgba(212, 175, 55, 0.3)',
            borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(212, 175, 55, 0.5)',
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#d4af37' : state.isFocused ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        color: state.isSelected ? '#000' : '#fff',
        padding: '12px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
        '&:active': {
            backgroundColor: '#d4af37',
            color: '#000',
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: '#888',
        fontSize: '14px',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#fff',
        fontSize: '16px',
    }),
    input: (base) => ({
        ...base,
        color: '#fff',
        outline: 'none',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#d4af37',
        '&:hover': {
            color: '#fff',
        },
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
};

const styles = StyleSheet.create({
    // Badge Styles
    badgeContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 30,
    },
    badgeCard: {
        backgroundColor: '#1a1a1a',
        width: '95%',
        maxWidth: 500,
        padding: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#d4af37',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
    },
    badgeTopDecor: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: '#d4af37',
    },
    badgeTitle: {
        color: '#d4af37',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 10,
    },
    badgeName: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        fontFamily: "'Optima', 'Georgia', serif",
    },
    badgeText: {
        color: '#b0b3b8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
        fontStyle: 'italic',
    },
    badgeBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.2)',
        paddingTop: 20,
    },
    badgeDate: {
        color: '#888',
        fontSize: 12,
    },
    badgeCountry: {
        color: '#d4af37',
        fontSize: 12,
        fontWeight: '600',
    },
    badgeSeal: {
        position: 'absolute',
        top: 25,
        right: 25,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 1,
        borderColor: '#d4af37',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        transform: 'rotate(15deg)',
    },
    badgeSealText: {
        color: '#d4af37',
        fontSize: 18,
        fontWeight: 'bold',
    },

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
        maxWidth: 500,
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
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        color: '#fff',
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        outlineStyle: 'none',
    },
    countryPickerContainer: {
        marginBottom: 15,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        cursor: 'pointer',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#d4af37',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#d4af37',
    },
    checkboxLabel: {
        color: '#b0b3b8',
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },
    errorMsg: {
        color: '#ff4d4d',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: '#d4af37',
        borderRadius: 12,
        padding: 18,
        width: '100%',
        alignItems: 'center',
        cursor: 'pointer',
    },
    submitBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },

    leaderboardContainer: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    leaderboardHeader: {
        marginBottom: 20,
    },
    leaderboardTitle: {
        color: '#d4af37',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        cursor: 'pointer',
    },
    tabItemActive: {
        backgroundColor: '#d4af37',
    },
    tabLabel: {
        color: '#b0b3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    tabLabelActive: {
        color: '#000',
    },
    loadingText: {
        color: '#b0b3b8',
        textAlign: 'center',
        marginTop: 50,
    },
    rankingsList: {
        flex: 1,
    },
    rankingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    rankingCardUser: {
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    rankNum: {
        color: '#d4af37',
        fontSize: 18,
        fontWeight: 'bold',
        width: 45,
    },
    rankInfo: {
        flex: 1,
    },
    rankMainText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    rankSubText: {
        color: '#b0b3b8',
        fontSize: 12,
        marginTop: 2,
    },
    rankMetric: {
        color: '#d4af37',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rankDivider: {
        color: 'rgba(212, 175, 55, 0.3)',
        textAlign: 'center',
        fontSize: 24,
        marginVertical: 10,
    },
    emptyMsg: {
        color: '#b0b3b8',
        textAlign: 'center',
    },
});

export default HallOfFame;
