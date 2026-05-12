import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import { Ionicons } from '@expo/vector-icons';
import { maybeAskForRating } from '../utils/ratingPrompt';

const API_URL = 'https://husna.alibazlamit.com';
const API_SECRET = 'husna-secret-key-2026';

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const HallOfFame = ({ initialMode, timeTaken, onOathComplete, quizResult, initialSection }) => {
    const { t } = useTranslation();

    // ── Top-level section: memorize | quiz ──────────────────────────────────────
    const [section, setSection] = useState(initialSection || 'memorize');

    // ── Memorize section state ──────────────────────────────────────────────────
    const [mode, setMode] = useState(initialMode || 'leaderboard');
    const [tab, setTab] = useState('country');
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [sworeOath, setSworeOath] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [userUuid, setUserUuid] = useState(null);
    const [userRank, setUserRank] = useState(null);
    const [localTimeTaken, setLocalTimeTaken] = useState(null);

    // ── Quiz section state ──────────────────────────────────────────────────────
    const [quizName, setQuizName] = useState('');
    const [quizCountry, setQuizCountry] = useState(null);
    const [quizPickerVisible, setQuizPickerVisible] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState('');
    const [quizLeaderboard, setQuizLeaderboard] = useState([]);
    const [quizLbLoading, setQuizLbLoading] = useState(false);

    useEffect(() => { loadUserIdentity(); }, []);

    useEffect(() => {
        if (initialMode) setMode(initialMode);
    }, [initialMode]);

    useEffect(() => {
        if (section === 'memorize' && mode === 'leaderboard') {
            fetchLeaderboard();
            if (tab === 'names') fetchUserRank();
        }
        if (section === 'quiz') fetchQuizLeaderboard();
    }, [section, mode, tab]);

    const loadUserIdentity = async () => {
        try {
            let uuid = await AsyncStorage.getItem('user_uuid');
            if (!uuid) {
                uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                await AsyncStorage.setItem('user_uuid', uuid);
            }
            setUserUuid(uuid);
            const savedName = await AsyncStorage.getItem('user_name');
            if (savedName) { setName(savedName); setQuizName(savedName); }
            const savedCountry = await AsyncStorage.getItem('user_country');
            if (savedCountry) setCountry({ name: savedCountry });
            const savedTime = await AsyncStorage.getItem('user_time_taken');
            if (savedTime) setLocalTimeTaken(parseInt(savedTime));
        } catch (e) { console.error(e); }
    };

    const fetchLeaderboard = async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/leaderboard?type=${tab}`);
            const data = await res.json();
            if (data.data) setLeaderboard(data.data);
        } catch { setError(t('hall.networkError') || 'Network error.'); }
        finally { setLoading(false); }
    };

    const fetchUserRank = async () => {
        if (!userUuid) return;
        try {
            const res = await fetch(`${API_URL}/api/leaderboard/rank/${userUuid}`);
            const data = await res.json();
            if (data.rank) setUserRank(data);
        } catch (err) { console.error(err); }
    };

    const fetchQuizLeaderboard = async () => {
        setQuizLbLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/quiz-leaderboard`);
            const data = await res.json();
            if (data.data) setQuizLeaderboard(data.data);
        } catch { }
        finally { setQuizLbLoading(false); }
    };

    const handleOathSubmit = async () => {
        if (!sworeOath) { setError('You must swear the oath to proceed.'); return; }
        if (!name.trim() || !country) { setError('Please provide your name and select your country.'); return; }
        setLoading(true); setError('');
        try {
            await AsyncStorage.setItem('user_name', name.trim());
            await AsyncStorage.setItem('user_country', country.name);
            if (timeTaken) await AsyncStorage.setItem('user_time_taken', String(timeTaken));
            setLocalTimeTaken(timeTaken);
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const payload = `${timestamp}${name.trim()}${country.name}${timeTaken || ''}`;
            const signature = hmacSHA256(payload, API_SECRET).toString(Hex);
            const res = await fetch(`${API_URL}/api/leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-husna-signature': signature, 'x-husna-timestamp': timestamp },
                body: JSON.stringify({ name: name.trim(), country: country.name, sworeOath, user_uuid: userUuid, time_taken: timeTaken })
            });
            const data = await res.json();
            if (res.ok) {
                if (onOathComplete) onOathComplete();
                maybeAskForRating();
                setMode('leaderboard');
                setTab('names');
                fetchLeaderboard();
            } else { setError(data.error || 'Submission failed.'); }
        } catch { setError('Network error syncing with server.'); }
        finally { setLoading(false); }
    };

    const handleQuizSubmit = async () => {
        if (!quizName.trim() || !quizCountry) { setQuizError('Please enter your name and select your country.'); return; }
        if (!quizResult) return;
        setQuizLoading(true); setQuizError('');
        try {
            await AsyncStorage.setItem('user_name', quizName.trim());
            await AsyncStorage.setItem('user_country', quizCountry.name);
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const payload = `${timestamp}${quizName.trim()}${quizCountry.name}${quizResult.score}${quizResult.timeTaken}`;
            const signature = hmacSHA256(payload, API_SECRET).toString(Hex);
            const res = await fetch(`${API_URL}/api/quiz-leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-husna-signature': signature, 'x-husna-timestamp': timestamp },
                body: JSON.stringify({ name: quizName.trim(), country: quizCountry.name, user_uuid: userUuid, score: quizResult.score, time_taken: quizResult.timeTaken })
            });
            const data = await res.json();
            if (res.ok) { setQuizSubmitted(true); fetchQuizLeaderboard(); }
            else { setQuizError(data.error || 'Submission failed.'); }
        } catch { setQuizError('Network error. Please try again.'); }
        finally { setQuizLoading(false); }
    };

    const handleShare = async () => {
        const displayTime = localTimeTaken || timeTaken;
        const timeStr = displayTime ? formatTime(displayTime) : null;
        const lines = [
            `🌟 I memorized all 99 Names of Allah (ﷻ)!`,
            name && country?.name ? `🏆 ${name} · ${country.name}` : null,
            timeStr ? `⏱️ Completed in ${timeStr}` : null,
            ``, `Download Husna on the Play Store:`,
            `https://play.google.com/store/apps/details?id=com.alibazlamit.husnamobile`,
        ].filter(Boolean);
        try { await Share.share({ message: lines.join('\n') }); } catch (e) { console.error(e); }
    };

    const CertificateCard = () => {
        if (!name) return null;
        return (
            <>
                <View style={styles.badgeContainer}>
                    <View style={styles.badgeCard}>
                        <View style={styles.badgeTopDecor} />
                        <Text style={styles.badgeTitle}>Hafiz al-Asma</Text>
                        <Text style={styles.badgeName}>{name}</Text>
                        <Text style={styles.badgeText}>Has successfully memorized the 99 Beautiful Names of Allah.</Text>
                        <View style={styles.badgeBottomRow}>
                            <Text style={styles.badgeDate}>{new Date().toLocaleDateString()}</Text>
                            <Text style={styles.badgeCountry}>{country?.name || 'World'}</Text>
                        </View>
                        <View style={styles.badgeSeal}><Text style={styles.badgeSealText}>99</Text></View>
                    </View>
                </View>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                    <Text style={styles.shareBtnText}>🔗  Share Achievement</Text>
                </TouchableOpacity>
            </>
        );
    };

    // ── Section Switcher ────────────────────────────────────────────────────────
    const SectionSwitcher = () => (
        <View style={styles.sectionSwitcher}>
            <TouchableOpacity
                style={[styles.sectionBtn, section === 'memorize' && styles.sectionBtnActive]}
                onPress={() => setSection('memorize')}
            >
                <Ionicons name="grid-outline" size={15} color={section === 'memorize' ? '#121212' : '#b0b3b8'} />
                <Text style={[styles.sectionBtnText, section === 'memorize' && styles.sectionBtnTextActive]}>Memorize</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sectionBtn, section === 'quiz' && styles.sectionBtnActive]}
                onPress={() => setSection('quiz')}
            >
                <Ionicons name="bulb-outline" size={15} color={section === 'quiz' ? '#121212' : '#b0b3b8'} />
                <Text style={[styles.sectionBtnText, section === 'quiz' && styles.sectionBtnTextActive]}>Quiz</Text>
            </TouchableOpacity>
        </View>
    );

    // ── Memorize: Oath form ─────────────────────────────────────────────────────
    if (section === 'memorize' && mode === 'oath') {
        return (
            <View style={styles.container}>
                <SectionSwitcher />
                <ScrollView contentContainerStyle={styles.oathScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.oathBadge}>
                        <Ionicons name="grid-outline" size={14} color="#d4af37" />
                        <Text style={styles.oathBadgeText}>  Memorize Game — Hall of Fame</Text>
                    </View>
                    <View style={styles.oathCard}>
                        <Text style={styles.oathTitle}>{t('hall.oathTitle')}</Text>
                        <Text style={styles.oathDesc}>{t('hall.oathText')}</Text>
                        <View style={styles.formContainer}>
                            <TextInput style={styles.input} placeholder={t('hall.namePlaceholder')} placeholderTextColor="#888" value={name} onChangeText={setName} />
                            <TouchableOpacity style={styles.countryPickerContainer} onPress={() => setPickerVisible(true)} activeOpacity={0.7}>
                                <CountryPicker withFilter withFlag withCountryNameButton withAlphaFilter={false} withCallingCode={false} withEmoji
                                    onSelect={(c) => { setCountry(c); setPickerVisible(false); }}
                                    onClose={() => setPickerVisible(false)}
                                    countryCode={country?.cca2 || undefined}
                                    modalProps={{ statusBarTranslucent: true }}
                                    visible={pickerVisible}
                                    theme={{ onBackgroundTextColor: '#fff', backgroundColor: '#1e1e1e', filterPlaceholderTextColor: '#888', primaryColor: '#f8f9fa', primaryColorVariant: '#d4af37', fontSize: 16 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.checkboxWrapper} onPress={() => setSworeOath(!sworeOath)} activeOpacity={0.7}>
                                <View style={[styles.checkbox, sworeOath && styles.checkboxChecked]} />
                                <Text style={styles.checkboxLabel}>{t('hall.oathPrompt')}</Text>
                            </TouchableOpacity>
                            {!!error && <Text style={styles.errorMsg}>{error}</Text>}
                            <TouchableOpacity style={styles.submitBtn} onPress={handleOathSubmit} disabled={loading}>
                                <Text style={styles.submitBtnText}>{loading ? t('hall.submitting') : t('hall.signOath')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // ── Memorize: Leaderboard ───────────────────────────────────────────────────
    if (section === 'memorize') {
        return (
            <View style={styles.container}>
                <SectionSwitcher />
                <View style={styles.leaderboardHeader}>
                    <Text style={styles.leaderboardTitle}>{t('hall.title')}</Text>
                    <Text style={styles.leaderboardSubtitle}>
                        🧠 For those who memorized all 99 Names
                    </Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.tabItem, tab === 'country' && styles.tabItemActive]} onPress={() => setTab('country')}>
                            <Text style={[styles.tabLabel, tab === 'country' && styles.tabLabelActive]}>{t('hall.countriesTab') || 'Countries'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabItem, tab === 'names' && styles.tabItemActive]} onPress={() => setTab('names')}>
                            <Text style={[styles.tabLabel, tab === 'names' && styles.tabLabelActive]}>{t('hall.fastestTab') || 'Fastest'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {loading ? <Text style={styles.loadingText}>Loading rankings...</Text> : (
                    <ScrollView style={styles.rankingsList} contentContainerStyle={{ paddingBottom: 100 }}>
                        <CertificateCard />
                        {leaderboard.length === 0 ? (
                            <View style={styles.emptyContainer}>
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
                                        {tab === 'names' && item.time_taken && <Text style={styles.rankMetric}>{formatTime(item.time_taken)}</Text>}
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
    }

    // ── Quiz section ────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <SectionSwitcher />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.leaderboardTitle}>Quiz Champions</Text>
                <Text style={styles.leaderboardSubtitle}>⚡ Complete all 99 Names without losing your lives</Text>

                {/* Submission form — only shown right after completing the quiz */}
                {quizResult && !quizSubmitted && (
                    <View style={styles.quizSubmitCard}>
                        <View style={styles.quizResultRow}>
                            <View style={styles.quizResultStat}>
                                <Text style={styles.quizResultValue}>{quizResult.score}/99</Text>
                                <Text style={styles.quizResultLabel}>Score</Text>
                            </View>
                            <View style={styles.quizResultDivider} />
                            <View style={styles.quizResultStat}>
                                <Text style={styles.quizResultValue}>{formatTime(quizResult.timeTaken)}</Text>
                                <Text style={styles.quizResultLabel}>Time</Text>
                            </View>
                        </View>
                        <Text style={styles.quizSubmitTitle}>Enter the Hall of Fame</Text>
                        <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#888" value={quizName} onChangeText={setQuizName} />
                        <TouchableOpacity style={styles.countryPickerContainer} onPress={() => setQuizPickerVisible(true)} activeOpacity={0.7}>
                            <CountryPicker withFilter withFlag withCountryNameButton withAlphaFilter={false} withCallingCode={false} withEmoji
                                onSelect={(c) => { setQuizCountry(c); setQuizPickerVisible(false); }}
                                onClose={() => setQuizPickerVisible(false)}
                                countryCode={quizCountry?.cca2 || undefined}
                                modalProps={{ statusBarTranslucent: true }}
                                visible={quizPickerVisible}
                                theme={{ onBackgroundTextColor: '#fff', backgroundColor: '#1e1e1e', filterPlaceholderTextColor: '#888', primaryColor: '#f8f9fa', primaryColorVariant: '#d4af37', fontSize: 16 }}
                            />
                        </TouchableOpacity>
                        {!!quizError && <Text style={styles.errorMsg}>{quizError}</Text>}
                        <TouchableOpacity style={styles.submitBtn} onPress={handleQuizSubmit} disabled={quizLoading}>
                            <Text style={styles.submitBtnText}>{quizLoading ? 'Submitting...' : 'Submit Score'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {quizSubmitted && (
                    <View style={styles.quizSubmittedBanner}>
                        <Ionicons name="checkmark-circle" size={20} color="#34c759" />
                        <Text style={styles.quizSubmittedText}>  Score submitted! See your ranking below.</Text>
                    </View>
                )}

                {/* Quiz Leaderboard */}
                <View style={styles.quizLbSection}>
                    <Text style={styles.quizLbHeader}>Top Quiz Players</Text>
                    {quizLbLoading ? (
                        <Text style={styles.loadingText}>Loading...</Text>
                    ) : quizLeaderboard.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyMsg}>No entries yet. Complete all 99 Names to be first!</Text>
                        </View>
                    ) : (
                        quizLeaderboard.map((item, idx) => (
                            <View key={idx} style={styles.rankingCard}>
                                <Text style={styles.rankNum}>#{idx + 1}</Text>
                                <View style={styles.rankInfo}>
                                    <Text style={styles.rankMainText}>{item.name}</Text>
                                    <Text style={styles.rankSubText}>{item.country}</Text>
                                </View>
                                <View style={styles.quizRankRight}>
                                    <Text style={styles.rankMetric}>{item.score}/99</Text>
                                    {item.time_taken && <Text style={styles.quizRankTime}>{formatTime(item.time_taken)}</Text>}
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Section switcher
    sectionSwitcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12, margin: 16, marginBottom: 8, padding: 4,
    },
    sectionBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 10, borderRadius: 10,
    },
    sectionBtnActive: { backgroundColor: '#d4af37' },
    sectionBtnText: { color: '#b0b3b8', fontSize: 14, fontWeight: '600' },
    sectionBtnTextActive: { color: '#121212' },

    // Badge/certificate
    badgeContainer: { width: '100%', alignItems: 'center', marginVertical: 24 },
    badgeCard: {
        backgroundColor: '#1a1a1a', width: '95%', padding: 30,
        borderRadius: 20, borderWidth: 2, borderColor: '#d4af37',
        alignItems: 'center', position: 'relative', overflow: 'hidden',
        elevation: 10, shadowColor: '#d4af37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    },
    badgeTopDecor: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#d4af37' },
    badgeTitle: { color: '#d4af37', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 },
    badgeName: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, fontFamily: Platform.OS === 'ios' ? 'Optima' : 'serif' },
    badgeText: { color: '#b0b3b8', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20, fontStyle: 'italic' },
    badgeBottomRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 1, borderTopColor: 'rgba(212,175,55,0.2)', paddingTop: 15 },
    badgeDate: { color: '#888', fontSize: 12 },
    badgeCountry: { color: '#d4af37', fontSize: 12, fontWeight: '600' },
    badgeSeal: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#d4af37', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(212,175,55,0.1)', transform: [{ rotate: '15deg' }] },
    badgeSealText: { color: '#d4af37', fontSize: 16, fontWeight: 'bold' },

    // Oath form
    oathScroll: { padding: 20, paddingBottom: 60 },
    oathBadge: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: 8,
        paddingVertical: 8, paddingHorizontal: 16, marginBottom: 16,
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)', alignSelf: 'center',
    },
    oathBadgeText: { color: '#d4af37', fontSize: 12, fontWeight: '700' },
    oathCard: {
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)', borderRadius: 16, padding: 25, alignItems: 'center',
    },
    oathTitle: { color: '#d4af37', fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    oathDesc: { color: '#b0b3b8', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    formContainer: { width: '100%' },

    // Shared form inputs
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff',
        padding: 15, fontSize: 16, marginBottom: 15,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    countryPickerContainer: {
        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12,
        marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        minHeight: 55, justifyContent: 'center', flexDirection: 'row', alignItems: 'center',
    },
    checkboxWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingRight: 10 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#d4af37', marginRight: 12 },
    checkboxChecked: { backgroundColor: '#d4af37' },
    checkboxLabel: { color: '#b0b3b8', fontSize: 13, flex: 1, lineHeight: 18 },
    errorMsg: { color: '#ff4d4d', fontSize: 14, marginBottom: 15, textAlign: 'center' },
    submitBtn: { backgroundColor: '#d4af37', borderRadius: 12, padding: 18, width: '100%', alignItems: 'center' },
    submitBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

    // Memorize leaderboard
    leaderboardHeader: { paddingHorizontal: 20, paddingTop: 4, marginBottom: 16 },
    leaderboardTitle: { color: '#d4af37', fontSize: 26, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    leaderboardSubtitle: { color: '#b0b3b8', fontSize: 12, textAlign: 'center', marginBottom: 16 },
    tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 },
    tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    tabItemActive: { backgroundColor: '#d4af37' },
    tabLabel: { color: '#b0b3b8', fontSize: 14, fontWeight: '600' },
    tabLabelActive: { color: '#000' },
    loadingText: { color: '#b0b3b8', textAlign: 'center', marginTop: 40 },
    rankingsList: { flex: 1, paddingHorizontal: 16 },
    rankingCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12,
        padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)',
    },
    rankingCardUser: { borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.1)' },
    rankNum: { color: '#d4af37', fontSize: 18, fontWeight: 'bold', width: 45 },
    rankInfo: { flex: 1 },
    rankMainText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    rankSubText: { color: '#b0b3b8', fontSize: 12, marginTop: 2 },
    rankMetric: { color: '#d4af37', fontSize: 16, fontWeight: 'bold' },
    rankDivider: { color: 'rgba(212,175,55,0.3)', textAlign: 'center', fontSize: 24, marginVertical: 10 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyMsg: { color: '#b0b3b8', textAlign: 'center' },
    shareBtn: { marginTop: 8, marginBottom: 10, alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 25, borderWidth: 1, borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.12)' },
    shareBtnText: { color: '#d4af37', fontWeight: '700', fontSize: 15 },

    // Quiz section
    quizSubmitCard: {
        marginHorizontal: 16, marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20,
        padding: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    },
    quizResultRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    quizResultStat: { alignItems: 'center', flex: 1 },
    quizResultValue: { fontSize: 28, fontWeight: '800', color: '#d4af37' },
    quizResultLabel: { fontSize: 11, color: '#b0b3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
    quizResultDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
    quizSubmitTitle: { color: '#f8f9fa', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
    quizSubmittedBanner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(52,199,89,0.1)', borderRadius: 12,
        marginHorizontal: 16, padding: 14, marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(52,199,89,0.25)',
    },
    quizSubmittedText: { color: '#34c759', fontSize: 14, fontWeight: '600' },
    quizLbSection: { paddingHorizontal: 16 },
    quizLbHeader: { color: '#b0b3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 },
    quizRankRight: { alignItems: 'flex-end' },
    quizRankTime: { color: '#b0b3b8', fontSize: 11, marginTop: 2 },
});

export default HallOfFame;
