import React from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import nameAudio from '../data/nameAudio';

const { height } = Dimensions.get('screen');

const detailsMap = {
  en: require('../data/details/en.json'),
  ar: require('../data/details/ar.json'),
  bs: require('../data/details/bs.json'),
  tr: require('../data/details/tr.json'),
  ur: require('../data/details/ur.json'),
  id: require('../data/details/id.json'),
  bn: require('../data/details/bn.json'),
  fa: require('../data/details/fa.json'),
  fr: require('../data/details/fr.json'),
};
const baseData = require('../data/details/base.json');
const namesData = require('../data/names.json');

const Section = ({ label, children, italic }) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <Text style={[styles.sectionText, italic && styles.italic]}>{children}</Text>
  </View>
);

const NameDetailModal = ({ name, onClose, onScrollToName }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const player = useAudioPlayer(name ? nameAudio[name.id] : null);

  if (!name) return null;

  const langDetails = detailsMap[lang] ?? detailsMap['en'];
  const detail = langDetails[String(name.id)] ?? detailsMap['en'][String(name.id)];
  const base = baseData[String(name.id)] ?? {};

  const playTTS = () => {
    try { player.seekTo(0); player.play(); } catch (_) {}
  };

  const relatedNames = (base.related ?? [])
    .map(id => namesData.find(n => n.id === id))
    .filter(Boolean);

  return (
    <Modal
      visible={!!name}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { height: height * 0.92 }]}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={styles.headerTranslit}>{name.transliteration}</Text>
                <Text style={styles.headerNumber}>#{name.id}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#b0b3b8" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Arabic hero */}
            <View style={styles.hero}>
              <Text style={styles.arabicText}>{name.arabic}</Text>
              <TouchableOpacity style={styles.ttsBtn} onPress={playTTS}>
                <Ionicons name="volume-high-outline" size={16} color="#d4af37" />
                <Text style={styles.ttsBtnText}>{t('detail.listen')}</Text>
              </TouchableOpacity>
            </View>

            {/* Quran count badge */}
            {base.quran_count > 0 && (
              <View style={styles.quranBadge}>
                <Ionicons name="book-outline" size={14} color="#d4af37" />
                <Text style={styles.quranBadgeText}>
                  {'  '}{t('detail.mentionedInQuran', { count: base.quran_count })}
                </Text>
              </View>
            )}

            {detail?.extended_meaning && (
              <Section label={t('detail.sectionMeaning')}>{detail.extended_meaning}</Section>
            )}
            {detail?.quran_surahs && (
              <Section label={t('detail.sectionQuran')}>{detail.quran_surahs}</Section>
            )}
            {detail?.why_it_matters && (
              <Section label={t('detail.sectionWhy')}>{detail.why_it_matters}</Section>
            )}
            {detail?.hadith && (
              <Section label={t('detail.sectionHadith')} italic>{detail.hadith}</Section>
            )}
            {detail?.reflection && (
              <Section label={t('detail.sectionReflection')}>{detail.reflection}</Section>
            )}

            {relatedNames.length > 0 && (
              <View style={styles.relatedRow}>
                <Text style={styles.sectionLabel}>{t('detail.sectionRelated')}</Text>
                <View style={styles.chips}>
                  {relatedNames.map(related => (
                    <TouchableOpacity
                      key={related.id}
                      style={styles.chip}
                      onPress={() => { onClose(); onScrollToName && onScrollToName(related.id); }}
                    >
                      <Text style={styles.chipText}>{related.transliteration}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(212,175,55,0.3)',
    elevation: 20,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dragHandle: {
    width: 40, height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2, marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerText: { flex: 1 },
  headerTranslit: { fontSize: 20, fontWeight: '700', color: '#f8f9fa' },
  headerNumber: { fontSize: 12, color: '#b0b3b8', marginTop: 2 },
  closeBtn: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 4 },
  hero: { alignItems: 'center', paddingVertical: 20 },
  arabicText: { fontSize: 56, color: '#d4af37', marginBottom: 16, textAlign: 'center' },
  ttsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
  },
  ttsBtnText: { color: '#d4af37', fontWeight: '600', fontSize: 13 },
  quranBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(212,175,55,0.08)',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 12, marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
  },
  quranBadgeText: { color: '#b0b3b8', fontSize: 13 },
  quranBadgeCount: { color: '#d4af37', fontWeight: '800' },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionLabel: {
    fontSize: 10, color: '#d4af37', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
  },
  sectionText: { fontSize: 14, color: '#e0e0e0', lineHeight: 22 },
  italic: { fontStyle: 'italic' },
  relatedRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
  },
  chipText: { color: '#d4af37', fontSize: 13, fontWeight: '600' },
});

export default NameDetailModal;
