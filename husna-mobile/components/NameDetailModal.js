import React from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';

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
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  if (!name) return null;

  const langDetails = detailsMap[lang] ?? detailsMap['en'];
  const detail = langDetails[String(name.id)] ?? detailsMap['en'][String(name.id)];
  const base = baseData[String(name.id)] ?? {};

  const playTTS = () => {
    try { Speech.speak(name.arabic, { language: 'ar-SA' }); } catch (_) {}
  };

  const relatedNames = (base.related ?? [])
    .map(id => namesData.find(n => n.id === id))
    .filter(Boolean);

  return (
    <Modal
      visible={!!name}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <View style={styles.dragHandle} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.hero}>
            <Text style={styles.arabicText}>{name.arabic}</Text>
            <Text style={styles.transliteration}>{name.transliteration}</Text>
            <Text style={styles.nameNumber}>#{name.id}</Text>
            <TouchableOpacity style={styles.ttsBtn} onPress={playTTS}>
              <Text style={styles.ttsBtnText}>▶ Listen</Text>
            </TouchableOpacity>
          </View>

          {base.quran_count > 0 && (
            <View style={styles.quranBadge}>
              <Text style={styles.quranBadgeCount}>{base.quran_count}×</Text>
              <Text style={styles.quranBadgeLabel}> in the Quran</Text>
            </View>
          )}

          {detail?.extended_meaning && (
            <Section label="Meaning">{detail.extended_meaning}</Section>
          )}
          {detail?.quran_surahs && (
            <Section label="In the Quran">{detail.quran_surahs}</Section>
          )}
          {detail?.why_it_matters && (
            <Section label="Why it matters">{detail.why_it_matters}</Section>
          )}
          {detail?.hadith && (
            <Section label="Hadith" italic>{detail.hadith}</Section>
          )}
          {detail?.reflection && (
            <Section label="Reflection">{detail.reflection}</Section>
          )}

          {relatedNames.length > 0 && (
            <View style={styles.relatedRow}>
              <Text style={styles.sectionLabel}>Related Names</Text>
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', paddingTop: 12, paddingHorizontal: 20, paddingBottom: 8 },
  dragHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 12 },
  closeBtn: { position: 'absolute', right: 20, top: 12, padding: 8 },
  closeBtnText: { color: '#b0b3b8', fontSize: 18 },
  scroll: { paddingHorizontal: 20 },
  hero: { alignItems: 'center', paddingVertical: 24 },
  arabicText: { fontSize: 52, color: '#d4af37', marginBottom: 8, textAlign: 'center' },
  transliteration: { fontSize: 22, fontWeight: '700', color: '#f8f9fa', marginBottom: 4 },
  nameNumber: { fontSize: 13, color: '#b0b3b8', marginBottom: 16 },
  ttsBtn: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
  },
  ttsBtnText: { color: '#d4af37', fontWeight: '600', fontSize: 14 },
  quranBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginBottom: 16,
    alignSelf: 'center',
  },
  quranBadgeCount: { color: '#d4af37', fontWeight: '800', fontSize: 20 },
  quranBadgeLabel: { color: '#b0b3b8', fontSize: 14 },
  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)',
  },
  sectionLabel: {
    fontSize: 10, color: '#d4af37', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
  },
  sectionText: { fontSize: 14, color: '#e0e0e0', lineHeight: 22 },
  italic: { fontStyle: 'italic' },
  relatedRow: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
  },
  chipText: { color: '#d4af37', fontSize: 13, fontWeight: '600' },
});

export default NameDetailModal;
