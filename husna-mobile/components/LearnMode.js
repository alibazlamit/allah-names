import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import { useAudioPlayer } from 'expo-audio';
import namesData from '../data/names.json';

const NASHEEDS = [
    { id: '1', title: 'Asma Allah (Asmaa Allah)', type: 'local', file: require('../assets/imad-rami.mp3') },
];

const LearnMode = ({ onPlayNasheed, isNasheedPlaying }) => {
    const { t, i18n } = useTranslation();

    const playNameAudio = (arabicText) => {
        Speech.speak(arabicText, { language: 'ar-SA' });
    };

    const renderItem = ({ item }) => {
        const lang = i18n.language;
        const localizedMeaning = item[`meaning_${lang}`] || item.meaning_en || item.meaning;

        return (
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
                <Text style={styles.meaningText}>{localizedMeaning}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{t('learn.title')}</Text>
                <Text style={styles.headerDesc}>{t('learn.subtitle')}</Text>

                {!isNasheedPlaying && (
                    <TouchableOpacity
                        style={styles.nasheedMenuBtn}
                        onPress={onPlayNasheed}
                    >
                        <Text style={styles.nasheedBtnMenuText}>
                            🎵 {t('learn.playNasheed')}
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
        paddingBottom: 220, // space for global player
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
