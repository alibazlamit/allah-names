import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

const Dedication = () => {
    const { t } = useTranslation();
    // Soft fade-in animation for the text
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.ornamentContainer}>
                    <Text style={styles.ornament}>۞</Text>
                </View>

                <Text style={styles.bismillah}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>

                <Text style={styles.title}>{t('dedication.title')}</Text>

                <View style={styles.divider} />

                <Text style={styles.paragraph}>
                    {t('dedication.intro')}{' '}
                    <Text style={styles.highlightText}>{t('dedication.issa')}</Text>{t('dedication.sisterIntro')}{' '}
                    <Text style={styles.highlightText}>{t('dedication.zainab')}</Text>{t('dedication.grandparentsIntro')}{' '}
                    <Text style={styles.highlightText}>{t('dedication.grandparents')}</Text>.
                </Text>

                <Text style={styles.paragraph}>
                    {t('dedication.prayer1')}
                </Text>

                <Text style={styles.paragraph}>
                    {t('dedication.prayer2')}
                </Text>

                <View style={styles.duaBox}>
                    <Text style={styles.duaArabic}>
                        {t('dedication.duaArabic')}
                    </Text>
                    <Text style={styles.duaTranslation}>
                        {t('dedication.duaTranslation')}
                    </Text>
                </View>

                <View style={styles.ornamentContainerBottom}>
                    <Text style={styles.ornament}>۞</Text>
                </View>

                <Text style={styles.footerText}>
                    {t('dedication.footer')}
                </Text>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 40,
        paddingBottom: 80, // Accounts for Android physical nav bar
        backgroundColor: '#121212',
    },
    content: {
        alignItems: 'center',
    },
    ornamentContainer: {
        marginBottom: 20,
    },
    ornamentContainerBottom: {
        marginTop: 30,
        marginBottom: 20,
    },
    ornament: {
        fontSize: 32,
        color: '#d4af37',
        opacity: 0.8,
    },
    bismillah: {
        fontSize: 26,
        color: '#d4af37',
        fontFamily: Platform.OS === 'ios' ? 'Damascus' : 'serif',
        marginBottom: 25,
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8f9fa',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    divider: {
        width: 60,
        height: 2,
        backgroundColor: '#d4af37',
        marginVertical: 20,
        opacity: 0.5,
    },
    paragraph: {
        fontSize: 16,
        color: '#b0b3b8',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 20,
    },
    highlightText: {
        color: '#d4af37',
        fontWeight: 'bold',
    },
    duaBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        borderRadius: 16,
        padding: 24,
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    duaArabic: {
        fontSize: 22,
        color: '#f8f9fa',
        textAlign: 'center',
        lineHeight: 38,
        marginBottom: 15,
        fontFamily: Platform.OS === 'ios' ? 'Damascus' : 'serif',
    },
    duaTranslation: {
        fontSize: 14,
        color: '#d4af37',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.9,
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 10,
        fontStyle: 'italic',
    }
});

export default Dedication;
