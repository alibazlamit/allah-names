import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import namesData from '../data/names.json';

const { width } = Dimensions.get('window');
// Calculate 3 columns grid
const TILE_SIZE = (width - 40 - 20) / 3;

// A single Tile Component
const NameTile = ({ item, isFlipped }) => {
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
        <View style={styles.tileWrapper}>
            <Animated.View style={[styles.tileCard, styles.tileFront, { transform: [{ rotateY: frontInterpolate }] }]}>
                <Text style={styles.tileNumber}>{item.id}</Text>
            </Animated.View>

            <Animated.View style={[styles.tileCard, styles.tileBack, { transform: [{ rotateY: backInterpolate }] }]}>
                <Text style={styles.tileArabic}>{item.arabic}</Text>
                <Text style={styles.tileTransliteration} numberOfLines={1}>{item.transliteration}</Text>
            </Animated.View>
        </View>
    );
};

const MemorizeMode = ({ onComplete }) => {
    const [inputVal, setInputVal] = useState('');
    const [revealedIds, setRevealedIds] = useState(new Set());
    const [hintsUsed, setHintsUsed] = useState(0);
    const scrollViewRef = useRef(null);

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

    const handleInputChange = (text) => {
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

            // Auto scroll to the correctly guessed tile
            const rowIndex = Math.floor((matchedName.id - 1) / 3);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: rowIndex * (TILE_SIZE + 10), animated: true });
            }
        }
    };

    const useHint = () => {
        if (hintsUsed >= 10) return;

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

    const isTestComplete = revealedIds.size === namesData.length;

    if (isTestComplete) {
        const finalScore = namesData.length - hintsUsed;
        return (
            <View style={styles.completeContainer}>
                <Text style={styles.completeHeader}>Masha'Allah!</Text>
                <Text style={styles.successMsg}>You have revealed all 99 Names.</Text>
                <Text style={styles.scoreMsg}>Your Score: {finalScore} / 99</Text>
                {hintsUsed > 0 && <Text style={styles.hintMsg}>({hintsUsed} hints used)</Text>}

                <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
                    <Text style={styles.primaryBtnText}>Proceed to Oath</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.header}>
                    <Text style={styles.title}>Memorize (Grid Mode)</Text>
                    <Text style={styles.progress}>{revealedIds.size} / 99 Revealed</Text>
                </View>
                <TouchableOpacity
                    style={[styles.hintBtn, hintsUsed >= 10 && styles.hintBtnDisabled]}
                    onPress={useHint}
                    disabled={hintsUsed >= 10}
                >
                    <Text style={styles.hintBtnText}>Hint ({10 - hintsUsed})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type any name..."
                    placeholderTextColor="#b0b3b8"
                    value={inputVal}
                    onChangeText={handleInputChange}
                    onSubmitEditing={() => {
                        handleInputChange(inputVal);
                        // Optional: if it still doesn't match on enter, we can clear it or leave it. Leaving it is better UX.
                    }}
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.submitBtnFloating}
                    onPress={() => handleInputChange(inputVal)}
                >
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
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
                        isFlipped={revealedIds.has(name.id)}
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
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    submitBtnText: {
        color: '#000',
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        gap: 10,
        paddingBottom: 40,
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
});

export default MemorizeMode;
