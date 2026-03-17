import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AudioPlayer = ({
    isPlaying,
    title,
    duration,
    position,
    isMinimized,
    onTogglePlay,
    onStop,
    onToggleMinimize,
    onSeek,
    onSetLoop,
    loopA,
    loopB,
    onOpenMenu
}) => {
    if (!title) return null;

    const formatTime = (millis) => {
        if (!millis) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

    const [isSliding, setIsSliding] = React.useState(false);
    const [slidingValue, setSlidingValue] = React.useState(0);

    return (
        <View style={[styles.playerContainer, isMinimized && styles.playerContainerMinimized]}>
            <View style={styles.topRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
                </View>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onToggleMinimize}>
                        <Ionicons name={isMinimized ? 'chevron-up' : 'chevron-down'} size={20} color="#f8f9fa" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, styles.menuBtn]} onPress={onOpenMenu}>
                        <Ionicons name="list" size={20} color="#f8f9fa" />
                    </TouchableOpacity>
                </View>
            </View>

            {!isMinimized && (
                <>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration || 1}
                            value={isSliding ? slidingValue : position}
                            minimumTrackTintColor="#d4af37"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                            thumbTintColor="#d4af37"
                            onValueChange={(val) => {
                                setIsSliding(true);
                                setSlidingValue(val);
                            }}
                            onSlidingComplete={(val) => {
                                setIsSliding(false);
                                onSeek(val);
                            }}
                        />
                        {loopA !== null && (
                            <View style={[styles.marker, { left: `${(loopA / duration) * 100}%` }]}>
                                <Text style={styles.markerText}>A</Text>
                            </View>
                        )}
                        {loopB !== null && (
                            <View style={[styles.marker, { left: `${(loopB / duration) * 100}%` }]}>
                                <Text style={styles.markerText}>B</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{formatTime(isSliding ? slidingValue : position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </>
            )}

            <View style={[styles.controlsRow, isMinimized && styles.controlsRowCompact]}>
                {!isMinimized ? (
                    <TouchableOpacity style={[styles.loopBtn, getLoopButtonStyle()]} onPress={onSetLoop}>
                        <Text style={[styles.loopBtnText, loopA !== null && styles.loopBtnTextActive]}>
                            {getLoopButtonState()}
                        </Text>
                    </TouchableOpacity>
                ) : <View style={{ width: 60 }} />}

                <View style={styles.centerControls}>
                    <TouchableOpacity style={styles.playPauseBtn} onPress={onTogglePlay}>
                        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#000" style={!isPlaying && { marginLeft: 3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
                        <Ionicons name="square" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                <View style={{ width: 60 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    playerContainer: {
        position: 'absolute',
        bottom: 110,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderRadius: 24,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 20,
    },
    playerContainerMinimized: {
        paddingVertical: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoCol: {
        flex: 1,
    },
    titleText: {
        color: '#d4af37',
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuBtn: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
    },
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        marginTop: 5,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    timeText: {
        color: '#888',
        fontSize: 11,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    controlsRowCompact: {
        marginTop: 5,
    },
    centerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    playPauseBtn: {
        backgroundColor: '#d4af37',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    loopBtn: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 60,
        alignItems: 'center',
    },
    loopBtnInactive: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
        fontSize: 10,
        color: '#b0b3b8',
        fontWeight: 'bold',
    },
    loopBtnTextActive: {
        color: '#d4af37',
    },
    marker: {
        position: 'absolute',
        top: 25,
        alignItems: 'center',
    },
    markerText: {
        color: '#4ade80',
        fontSize: 9,
        fontWeight: 'bold',
    }
});

export default AudioPlayer;
