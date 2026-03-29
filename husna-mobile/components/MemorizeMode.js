import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, ScrollView, Dimensions, TouchableWithoutFeedback, Vibration } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import namesData from '../data/names.json';

const { width } = Dimensions.get('window');
// Calculate 3 columns grid: padding 20 on each side (40) + two 10px gaps (20) = 60.
// We subtract an extra 3-4 pixels total from the width before dividing to account for sub-pixel rendering.
const TILE_SIZE = Math.floor((width - 64) / 3);

// A single Tile Component
const NameTile = ({ item, isFlipped, onLongPress }) => {
    const flipAnim = React.useRef(new Animated.Value(isFlipped ? 180 : 0)).current;

    React.useEffect(() => {
        Animated.timing(flipAnim, {
            toValue: isFlipped ? 180 : 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [isFlipped]);

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    return (
        <TouchableWithoutFeedback onLongPress={onLongPress}>
            <View style={styles.tileWrapper}>
                <Animated.View style={[styles.tileCard, styles.tileFront, { transform: [{ rotateY: frontInterpolate }] }]}>
                    <Text style={styles.tileNumber}>{item.id}</Text>
                </Animated.View>

                <Animated.View style={[styles.tileCard, styles.tileBack, { transform: [{ rotateY: backInterpolate }] }]}>
                    <Text style={styles.tileArabic}>{item.arabic}</Text>
                    <Text style={styles.tileTransliteration} numberOfLines={1}>{item.transliteration}</Text>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const MemorizeMode = ({ isActive, onComplete, onShowHelp }) => {
    const { t } = useTranslation();
    const [inputVal, setInputVal] = useState('');
    const [revealedIds, setRevealedIds] = useState(new Set());
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [duplicateGuess, setDuplicateGuess] = useState(false);
    const scrollViewRef = useRef(null);
    const lastMatchRef = useRef(null);
    const inputRef = useRef(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isActive && inputRef.current && !duplicateGuess) {
            const timeout = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

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

    const handleInputChange = useCallback((text) => {
        // Guard against autocomplete race condition:
        // After a match, autocomplete may fire another onChangeText with stale text.
        if (lastMatchRef.current) {
            const staleEn = normalizeEnglish(text);
            const staleAr = normalizeArabic(text);
            if (staleEn === lastMatchRef.current || staleAr === lastMatchRef.current) {
                lastMatchRef.current = null;
                setInputVal('');
                return;
            }
            lastMatchRef.current = null;
        }

        setInputVal(text);
        if (!text.trim()) return;

        try {
            const normEnInput = normalizeEnglish(text);
            const normArInput = normalizeArabic(text);

            const matchedName = namesData.find(name => {
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
                // Store the matched text to guard against autocomplete re-fire
                lastMatchRef.current = normalizeEnglish(text) || normalizeArabic(text);
                const isDuplicate = revealedIds.has(matchedName.id);

                if (isDuplicate) {
                    // Feedback for already guessed name
                    Vibration.vibrate(50); // Short vibration
                    setDuplicateGuess(true);
                    
                    Animated.sequence([
                        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
                    ]).start();

                    // Revert placeholder after 1.5 seconds
                    setTimeout(() => setDuplicateGuess(false), 1500);
                } else {
                    // New correct guess
                    setRevealedIds(prev => new Set(prev).add(matchedName.id));
                    
                    // Auto scroll to the correctly guessed tile
                    const rowIndex = Math.floor((matchedName.id - 1) / 3);
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: rowIndex * (TILE_SIZE + 10), animated: true });
                    }
                }

                // Check if this matched name is a prefix to another unrevealed name
                const isPrefixOfAnother = namesData.some(otherName => {
                    if (otherName.id === matchedName.id) return false;
                    if (revealedIds.has(otherName.id)) return false;

                    const otherNormTrans = normalizeEnglish(otherName.transliteration);
                    let otherNormTransBase = otherNormTrans;
                    if (otherNormTrans.startsWith('al')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('ar')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('as')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('ad')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('an')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('az')) otherNormTransBase = otherNormTrans.slice(2);
                    else if (otherNormTrans.startsWith('ash')) otherNormTransBase = otherNormTrans.slice(3);
                    else if (otherNormTrans.startsWith('at')) otherNormTransBase = otherNormTrans.slice(2);

                    const otherNormArabic = normalizeArabic(otherName.arabic);
                    const otherNormArabicBase = otherNormArabic.startsWith('ال') ? otherNormArabic.substring(2) : otherNormArabic;

                    const isEnPrefix = normEnInput.length > 2 && (otherNormTrans.startsWith(normEnInput) || otherNormTransBase.startsWith(normEnInput));
                    const isArPrefix = normArInput.length > 1 && (otherNormArabic.startsWith(normArInput) || otherNormArabicBase.startsWith(normArInput));

                    return isEnPrefix || isArPrefix;
                });

                // Clear input if:
                // 1. It's a new guess (always auto-submit newly found names)
                // 2. OR, it's NOT a prefix for another unrevealed name
                if (!isDuplicate || !isPrefixOfAnother) {
                    setTimeout(() => {
                        setInputVal('');
                        // Also programmatically clear the native input
                        if (inputRef.current) {
                            inputRef.current.clear();
                        }
                    }, 50);
                }
            }
        } catch (error) {
            console.error('Match error:', error);
        }
    }, [revealedIds]);

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

            // Auto scroll to the hint roughly (row index * height roughly)
            const rowIndex = Math.floor((unrevealed.id - 1) / 3);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: rowIndex * (TILE_SIZE + 10), animated: true });
            }
        }
    };

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const isTestComplete = revealedIds.size === namesData.length;

    // Start timer on first reveal
    if (revealedIds.size === 1 && !startTime) {
        setStartTime(Date.now());
    }

    // Stop timer on completion
    if (isTestComplete && !endTime && startTime) {
        setEndTime(Date.now());
    }

    const getTimeTaken = () => {
        if (!startTime || !endTime) return null;
        return Math.floor((endTime - startTime) / 1000); // return seconds
    };

    const handleComplete = () => {
        if (onComplete) onComplete(getTimeTaken());
    };

    const resetGame = () => {
        setRevealedIds(new Set());
        setHintsUsed(0);
        setInputVal('');
        setShowResults(false);
        setStartTime(null);
        setEndTime(null);
    };

    // When game is complete with NO hints -> proceed to oath
    if (isTestComplete && hintsUsed === 0) {
        return (
            <View style={styles.completeContainer}>
                <Text style={styles.completeHeader}>{t('memorize.congratulations')}</Text>
                <Text style={styles.successMsg}>
                    {t('memorize.completedMessage')}
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleComplete}>
                    <Text style={styles.primaryBtnText}>{t('memorize.proceedToOath')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // When game is complete WITH hints and user wants to browse the grid
    if (isTestComplete && hintsUsed > 0 && showResults) {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View style={styles.header}>
                        <Text style={styles.progress}>99 / 99 {t('memorize.revealed')}</Text>
                        <Text style={{ color: '#b0b3b8', fontSize: 12, marginTop: 2 }}>
                            {t('memorize.hintsUsed') || 'Hints Used'}: {hintsUsed}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.gridContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {namesData.map((name) => (
                        <NameTile
                            key={name.id}
                            item={name}
                            isFlipped={true}
                            onLongPress={() => {}}
                        />
                    ))}
                </ScrollView>

                <View style={styles.stickyBottomBar}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={resetGame}>
                        <Text style={styles.primaryBtnText}>{t('memorize.tryAgain') || 'Try Again'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // When game is complete WITH hints -> show results overlay
    if (isTestComplete && hintsUsed > 0 && !showResults) {
        return (
            <View style={styles.completeContainer}>
                <Text style={styles.completeHeader}>{t('memorize.congratulations')}</Text>
                <Text style={styles.successMsg}>
                    {t('memorize.completedMessage')}
                </Text>
                <Text style={[styles.scoreMsg, { textAlign: 'center', marginBottom: 20, paddingHorizontal: 20, color: '#b0b3b8' }]}>
                    {t('memorize.tryAgainNoHints')}
                </Text>
                <Text style={{ color: '#b0b3b8', fontSize: 14, marginBottom: 25 }}>
                    {t('memorize.hintsUsed') || 'Hints Used'}: {hintsUsed}
                </Text>

                <TouchableOpacity
                    style={[styles.primaryBtn, { marginBottom: 15 }]}
                    onPress={() => setShowResults(true)}
                >
                    <Text style={styles.primaryBtnText}>{t('memorize.viewAllNames') || 'View All Names'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryBtn]}
                    onPress={resetGame}
                >
                    <Text style={styles.secondaryBtnText}>{t('memorize.tryAgain') || 'Try Again'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.header}>
                    <Text style={styles.progress}>{revealedIds.size} / 99 {t('memorize.revealed')}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={resetGame}
                    >
                        <Ionicons name="refresh-outline" size={24} color="#d4af37" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={onShowHelp}
                    >
                        <Ionicons name="help-circle-outline" size={24} color="#d4af37" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.hintBtn}
                        onPress={useHint}
                    >
                        <Text style={styles.hintBtnText}>{t('memorize.useHint')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder={duplicateGuess ? (t('memorize.alreadyEntered') || 'Already entered!') : t('memorize.inputPlaceholder')}
                    placeholderTextColor={duplicateGuess ? '#d4af37' : '#b0b3b8'}
                    value={inputVal}
                    onChangeText={handleInputChange}
                    onSubmitEditing={() => {
                        handleInputChange(inputVal);
                    }}
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.submitBtnFloating}
                    onPress={() => handleInputChange(inputVal)}
                >
                    <Ionicons name="arrow-forward" size={24} color="#000" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
            >
                {namesData.map((name) => (
                    <NameTile
                        key={name.id}
                        item={name}
                        isFlipped={revealedIds.has(name.id)}
                        onLongPress={() => revealHint(name.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#121212',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpBtn: {
        padding: 5,
        marginRight: 10,
    },
    header: {
        alignItems: 'flex-start',
    },
    hintBtn: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d4af37',
    },
    hintBtnDisabled: {
        opacity: 0.5,
        borderColor: '#888',
    },
    hintBtnText: {
        color: '#d4af37',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        color: '#f8f9fa',
        fontWeight: 'bold',
    },
    progress: {
        color: '#d4af37',
        marginTop: 2,
        fontWeight: '600',
        fontSize: 14,
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: '#f8f9fa',
        fontSize: 16,
    },
    submitBtnFloating: {
        backgroundColor: '#d4af37',
        justifyContent: 'center',
        alignItems: 'center',
        width: 54,
        height: 54,
        borderRadius: 8,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        gap: 10,
        paddingBottom: 300,
    },
    tileWrapper: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        position: 'relative',
    },
    tileCard: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    tileFront: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tileBack: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
    },
    tileNumber: {
        color: '#b0b3b8',
        fontSize: 24,
        fontWeight: 'bold',
        opacity: 0.5,
    },
    tileArabic: {
        fontSize: 20,
        color: '#d4af37',
        marginBottom: 4,
        textAlign: 'center',
    },
    tileTransliteration: {
        fontSize: 10,
        color: '#f8f9fa',
        fontWeight: '600',
        textAlign: 'center',
    },
    completeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    completeHeader: {
        fontSize: 32,
        color: '#d4af37',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    successMsg: {
        color: '#4ade80',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
    },
    primaryBtn: {
        backgroundColor: '#d4af37',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    primaryBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryBtn: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#d4af37',
        backgroundColor: 'transparent',
    },
    secondaryBtnText: {
        color: '#d4af37',
        fontWeight: 'bold',
        fontSize: 16,
    },
    stickyBottomBar: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 120,
        alignItems: 'center',
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.2)',
    },
});

export default MemorizeMode;
