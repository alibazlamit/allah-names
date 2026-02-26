import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import namesData from '../data/names.json';

const LearnMode = () => {
    const [isPlayingNasheed, setIsPlayingNasheed] = React.useState(false);
    const soundRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const toggleNasheed = async () => {
        try {
            if (isPlayingNasheed) {
                if (soundRef.current) {
                    await soundRef.current.pauseAsync();
                }
                setIsPlayingNasheed(false);
            } else {
                if (!soundRef.current) {
                    // Stub: We use a placeholder remote audio for the Nasheed since we have no local mp3 provided
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: 'https://cdn.pixabay.com/audio/2024/02/09/audio_6a3fd5e1d5.mp3' }, // Placeholder Islamic-style calm track
                        { isLooping: true }
                    );
                    soundRef.current = sound;
                }
                await soundRef.current.playAsync();
                setIsPlayingNasheed(true);
            }
        } catch (error) {
            console.log('Audio playback error', error);
        }
    };

    const playNameAudio = (arabicText) => {
        Speech.speak(arabicText, { language: 'ar-SA' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{item.id}</Text>
                </View>
                <TouchableOpacity style={styles.playBtn} onPress={() => playNameAudio(item.arabic)}>
                    <Text style={styles.playIcon}>▶</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
            <Text style={styles.transliterationText}>{item.transliteration}</Text>
            <Text style={styles.meaningText}>{item.meaning}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Learn the 99 Names</Text>
                <Text style={styles.headerDesc}>Scroll through and reflect on their meanings.</Text>

                <TouchableOpacity
                    style={[styles.nasheedBtn, isPlayingNasheed && styles.nasheedBtnActive]}
                    onPress={toggleNasheed}
                >
                    <Text style={[styles.nasheedBtnText, isPlayingNasheed && styles.nasheedBtnTextActive]}>
                        {isPlayingNasheed ? '⏸ Pause Nasheed' : '🎵 Play Background Nasheed'}
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={namesData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8f9fa',
        marginBottom: 5,
    },
    headerDesc: {
        color: '#b0b3b8',
        textAlign: 'center',
        marginBottom: 15,
    },
    nasheedBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    nasheedBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        borderColor: '#d4af37',
    },
    nasheedBtnText: {
        color: '#f8f9fa',
        fontWeight: '600',
    },
    nasheedBtnTextActive: {
        color: '#d4af37',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        alignItems: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    numberBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    numberText: {
        color: '#b0b3b8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    playBtn: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        color: '#d4af37',
        fontSize: 14,
        marginLeft: 3,
    },
    arabicText: {
        fontSize: 40,
        color: '#d4af37',
        marginBottom: 10,
        textAlign: 'center',
    },
    transliterationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8f9fa',
        marginBottom: 5,
    },
    meaningText: {
        fontSize: 14,
        color: '#b0b3b8',
        textAlign: 'center',
    },
});

export default LearnMode;
