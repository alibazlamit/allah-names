import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import { useAudioPlayer } from 'expo-audio';
import namesData from '../data/names.json';

const NASHEEDS = [
    { id: '1', title: 'Asma Allah (Asmaa Allah)', type: 'local', file: require('../assets/imad-rami.mp3') },
];

const LearnMode = () => {
    const [isPlayingNasheed, setIsPlayingNasheed] = React.useState(false);
    const [nasheedModalVisible, setNasheedModalVisible] = React.useState(false);
    const [isPlayerMinimized, setIsPlayerMinimized] = React.useState(false);
    const [currentNasheedTitle, setCurrentNasheedTitle] = React.useState('');

    // We still keep references to dynamically load audio
    const [currentAudioSource, setCurrentAudioSource] = React.useState(null);
    const player = useAudioPlayer(currentAudioSource);

    const [duration, setDuration] = React.useState(0);
    const [position, setPosition] = React.useState(0);
    const [isSliding, setIsSliding] = React.useState(false);

    // For Loop A-B State
    const [loopA, setLoopA] = React.useState(null);
    const [loopB, setLoopB] = React.useState(null);

    const formatTime = (millis) => {
        if (!millis) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    React.useEffect(() => {
        if (!player) return;

        let playbackInterval;
        if (isPlayingNasheed && !isSliding) {
            playbackInterval = setInterval(() => {
                setPosition(player.currentTime * 1000);

                // A-B Looping Check
                if (loopA !== null && loopB !== null && player.currentTime * 1000 >= loopB) {
                    player.seekTo(loopA / 1000);
                }
            }, 100);
        }

        return () => {
            if (playbackInterval) clearInterval(playbackInterval);
        };
    }, [isPlayingNasheed, isSliding, loopA, loopB, player]);

    // Handle auto-play when a new song is loaded
    React.useEffect(() => {
        if (player && currentAudioSource && isPlayingNasheed) {
            player.loop = true;
            player.play();
        }
    }, [player, currentAudioSource, isPlayingNasheed]);

    React.useEffect(() => {
        if (player) {
            setDuration((player.duration || 0) * 1000);
        }
    }, [currentAudioSource, player?.duration]);

    const stopNasheed = () => {
        if (player) {
            player.pause();
        }
        setIsPlayingNasheed(false);
        setCurrentNasheedTitle('');
        setCurrentAudioSource(null);
        setPosition(0);
        setDuration(0);
        setLoopA(null);
        setLoopB(null);
    };

    const togglePlayPause = () => {
        if (!player) return;

        if (isPlayingNasheed) {
            player.pause();
            setIsPlayingNasheed(false);
        } else {
            player.play();
            setIsPlayingNasheed(true);
        }
    };

    const selectAndPlayNasheed = (nasheed) => {
        try {
            if (player) {
                player.pause();
            }

            setLoopA(null);
            setLoopB(null);

            if (nasheed.type === 'local') {
                setCurrentAudioSource(nasheed.file);
            } else {
                setCurrentAudioSource({ uri: nasheed.uri });
            }

            // Loop property needs to be handled via expo-audio player options,
            // but for now relying on user restarting or player.loop
            // player.loop = true; // Removed as per instruction
            // player.play();      // Removed as per instruction

            setIsPlayingNasheed(true);
            setCurrentNasheedTitle(nasheed.title);
            setNasheedModalVisible(false);
        } catch (error) {
            console.log('Audio playback error', error);
        }
    };

    const playNameAudio = (arabicText) => {
        Speech.speak(arabicText, { language: 'ar-SA' });
    };

    const handleSetLoop = () => {
        if (loopA === null) {
            // Set A
            setLoopA(position);
        } else if (loopB === null) {
            // Set B (ensure it's after A)
            if (position > loopA + 1000) { // require at least 1s difference
                setLoopB(position);
                // Immediately jump to A when B is set
                if (player) {
                    player.seekTo(loopA / 1000);
                    player.play();
                }
            } else {
                alert('Loop B must be after Loop A by at least 1 second.');
            }
        } else {
            // Clear
            setLoopA(null);
            setLoopB(null);
        }
    };

    const handleSlidingStart = () => {
        setIsSliding(true);
    };

    const handleSlidingComplete = (value) => {
        setPosition(value);
        if (player) {
            player.seekTo(value / 1000);
        }
        setIsSliding(false);
    };

    const getLoopButtonState = () => {
        if (loopA !== null && loopB !== null) return 'A-B';
        if (loopA !== null) return 'A-...';
        return 'A-B';
    };

    const getLoopButtonStyle = () => {
        if (loopA !== null && loopB !== null) return styles.loopBtnActive;
        if (loopA !== null) return styles.loopBtnPending;
        return styles.loopBtnInactive;
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

                {!currentNasheedTitle && (
                    <TouchableOpacity
                        style={styles.nasheedMenuBtn}
                        onPress={() => setNasheedModalVisible(true)}
                    >
                        <Text style={styles.nasheedBtnMenuText}>
                            🎵 Choose a Nasheed to Play
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                data={namesData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            {/* Audio Control Bar at Bottom */}
            {currentNasheedTitle !== '' && (
                <View style={styles.audioControlBar}>
                    <View style={styles.topRowControls}>
                        <View style={styles.audioInfo}>
                            <Text style={styles.audioTitleText} numberOfLines={1}>
                                {currentNasheedTitle}
                            </Text>
                        </View>
                        <View style={styles.topActionsRow}>
                            <TouchableOpacity style={styles.controlIconBtn} onPress={() => setIsPlayerMinimized(!isPlayerMinimized)}>
                                <Text style={styles.audioIconSmall}>{isPlayerMinimized ? '▲' : '▼'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.controlIconBtn, styles.menuIconBtn]} onPress={() => setNasheedModalVisible(true)}>
                                <Text style={styles.audioIconSmall}>☰</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!isPlayerMinimized && (
                        <>
                            {/* Custom Scrubber */}
                            <View style={styles.sliderWrapper}>
                                <Slider
                                    style={{ flex: 1, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={duration}
                                    value={position}
                                    minimumTrackTintColor="#d4af37"
                                    maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                                    thumbTintColor="#d4af37"
                                    onSlidingStart={handleSlidingStart}
                                    onSlidingComplete={handleSlidingComplete}
                                />

                                {/* Visual indicator for A-B Loop boundaries underneath slider */}
                                {loopA !== null && (
                                    <View style={[styles.loopMarker, { left: `${(loopA / duration) * 100}%` }]}>
                                        <Text style={styles.loopMarkerText}>A</Text>
                                    </View>
                                )}
                                {loopB !== null && (
                                    <View style={[styles.loopMarker, { left: `${(loopB / duration) * 100}%` }]}>
                                        <Text style={styles.loopMarkerText}>B</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.timeRow}>
                                <Text style={styles.timeText}>{formatTime(position)}</Text>
                                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                            </View>
                        </>
                    )}

                    <View style={[styles.audioActions, isPlayerMinimized && styles.audioActionsCompact]}>
                        {!isPlayerMinimized ? (
                            <TouchableOpacity style={[styles.loopBtn, getLoopButtonStyle()]} onPress={handleSetLoop}>
                                <Text style={[styles.loopBtnText, (loopA !== null) && styles.loopBtnTextActive]}>
                                    {getLoopButtonState()}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 50 }} />
                        )}

                        <View style={styles.mainControls}>
                            <TouchableOpacity style={styles.mainActionBtn} onPress={togglePlayPause}>
                                <Text style={styles.playPauseIcon}>{isPlayingNasheed ? '⏸' : '▶'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.stopBtn} onPress={stopNasheed}>
                                <Text style={styles.stopIcon}>⏹</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Placeholder to balance the loop button on the right */}
                        <View style={{ width: 50 }} />
                    </View>
                </View>
            )}

            {/* Nasheed Selection Modal */}
            <Modal
                visible={nasheedModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setNasheedModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Nasheed</Text>
                            <TouchableOpacity onPress={() => setNasheedModalVisible(false)}>
                                <Text style={styles.closeModalText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={NASHEEDS}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.nasheedListItem}
                                    onPress={() => selectAndPlayNasheed(item)}
                                >
                                    <Text style={styles.nasheedListItemText}>{item.title}</Text>
                                    {currentNasheedTitle === item.title && (
                                        <Text style={styles.playingIndicator}>🔊</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

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
    nasheedMenuBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    nasheedBtnMenuText: {
        color: '#f8f9fa',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 160, // accommodate larger modern audio player
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
    audioControlBar: {
        backgroundColor: '#1e1e1e',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: 25, // safe area allowance
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    topRowControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    topActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioInfo: {
        flex: 1,
    },
    audioTitleText: {
        color: '#d4af37',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    controlIconBtn: {
        padding: 5,
        marginLeft: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 5,
    },
    menuIconBtn: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    audioIconSmall: {
        fontSize: 14,
        color: '#f8f9fa',
    },
    sliderWrapper: {
        width: '100%',
        marginVertical: 10,
        position: 'relative',
    },
    loopMarker: {
        position: 'absolute',
        top: 30, // pushed just below slider track
        marginLeft: -5,
        alignItems: 'center',
    },
    loopMarkerText: {
        color: '#4ade80',
        fontSize: 10,
        fontWeight: 'bold',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeText: {
        color: '#888',
        fontSize: 12,
        fontVariant: ['tabular-nums'],
    },
    audioActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    audioActionsCompact: {
        marginTop: 10, // slightly more padding if minimized 
    },
    loopBtn: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 70,
        alignItems: 'center',
    },
    loopBtnInactive: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'transparent',
    },
    loopBtnPending: {
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    loopBtnActive: {
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
    loopBtnText: {
        fontSize: 12,
        color: '#b0b3b8',
        fontWeight: 'bold',
    },
    loopBtnTextActive: {
        color: '#d4af37',
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    mainActionBtn: {
        backgroundColor: '#d4af37',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseIcon: {
        fontSize: 20,
        color: '#000',
        marginLeft: 2, // optical alignment for play icon
    },
    stopBtn: {
        backgroundColor: 'rgba(2ef, 68, 68, 0.1)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    stopIcon: {
        fontSize: 14,
        color: '#ef4444',
    },
    controlIconBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    audioIcon: {
        fontSize: 16,
        color: '#f8f9fa',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#242526',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#f8f9fa',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeModalText: {
        color: '#b0b3b8',
        fontSize: 24,
    },
    nasheedListItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nasheedListItemText: {
        color: '#f8f9fa',
        fontSize: 16,
        fontWeight: '500',
    },
    playingIndicator: {
        fontSize: 16,
    }
});

export default LearnMode;
