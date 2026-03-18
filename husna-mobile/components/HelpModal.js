import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HelpModal = ({ visible, onClose }) => {
    const { t } = useTranslation();

    const sections = [
        {
            title: t('onboarding.step1Title'),
            text: t('onboarding.step1Text'),
            icon: 'library-outline'
        },
        {
            title: t('onboarding.step2Title'),
            text: t('onboarding.step2Text'),
            icon: 'game-controller-outline'
        },
        {
            title: t('onboarding.step3Title'),
            text: t('onboarding.step3Text'),
            icon: 'bulb-outline'
        },
        {
            title: t('onboarding.step4Title'),
            text: t('onboarding.step4Text'),
            icon: 'ribbon-outline'
        }
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{t('onboarding.title')}</Text>
                            <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeHeaderBtn}>
                            <Ionicons name="close" size={24} color="#b0b3b8" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        style={styles.scrollView} 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {sections.map((section, index) => (
                            <View key={index} style={styles.sectionCard}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={section.icon} size={28} color="#d4af37" />
                                </View>
                                <View style={styles.sectionInfo}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <Text style={styles.sectionText}>{section.text}</Text>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.getStartedBtn} onPress={onClose}>
                            <Text style={styles.getStartedText}>{t('onboarding.getStarted')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        width: '100%',
        height: Dimensions.get('window').height * 0.8,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        elevation: 20,
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    closeHeaderBtn: {
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d4af37',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#b0b3b8',
        lineHeight: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 10,
        paddingBottom: 40,
    },
    sectionCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    sectionInfo: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f8f9fa',
        marginBottom: 6,
    },
    sectionText: {
        fontSize: 14,
        color: '#b0b3b8',
        lineHeight: 20,
    },
    getStartedBtn: {
        backgroundColor: '#d4af37',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    getStartedText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HelpModal;
