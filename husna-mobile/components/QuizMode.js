import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import namesData from '../data/names.json';
import { maybeAskForRating } from '../utils/ratingPrompt';

const { width } = Dimensions.get('window');

const translations = {
  en: require('../data/translations/en.json'),
  ar: require('../data/translations/ar.json'),
  bs: require('../data/translations/bs.json'),
  tr: require('../data/translations/tr.json'),
  ur: require('../data/translations/ur.json'),
  id: require('../data/translations/id.json'),
  bn: require('../data/translations/bn.json'),
  fa: require('../data/translations/fa.json'),
  fr: require('../data/translations/fr.json'),
};

const TOTAL_QUESTIONS = namesData.length; // all 99
const MAX_LIVES = 3;
const STREAK_LIFE_BONUS = 15;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(lang) {
  const enMap = translations['en'];
  const langMap = translations[lang] ?? enMap;
  const getMeaning = (id) => langMap[String(id)] ?? enMap[String(id)] ?? '—';

  return shuffle(namesData).map(correct => {
    const isArabicToMeaning = Math.random() > 0.5;
    const wrongs = shuffle(namesData.filter(n => n.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]).map(n => ({
      id: n.id,
      text: isArabicToMeaning ? getMeaning(n.id) : n.arabic,
      sub: isArabicToMeaning ? null : n.transliteration,
      correct: n.id === correct.id,
    }));

    return {
      type: isArabicToMeaning ? 'arabic_to_meaning' : 'meaning_to_arabic',
      prompt: isArabicToMeaning ? correct.arabic : getMeaning(correct.id),
      promptSub: isArabicToMeaning ? correct.transliteration : null,
      options,
    };
  });
}

function starsForScore(score) {
  if (score >= 80) return 3;
  if (score >= 60) return 2;
  if (score >= 40) return 1;
  return 0;
}

// ── Result screen ──────────────────────────────────────────────────────────────
const ResultScreen = ({ score, onRestart }) => {
  const { t } = useTranslation();
  const stars = starsForScore(score);

  useEffect(() => {
    if (stars >= 2) maybeAskForRating();
  }, [stars]);

  return (
    <View style={styles.resultContainer}>
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>{t('quiz.quizComplete')}</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreTotal}>/{TOTAL_QUESTIONS}</Text>
        </View>

        <View style={styles.starsRow}>
          {[1, 2, 3].map(i => (
            <Ionicons
              key={i}
              name={i <= stars ? 'star' : 'star-outline'}
              size={36}
              color={i <= stars ? '#d4af37' : 'rgba(212,175,55,0.25)'}
              style={{ marginHorizontal: 4 }}
            />
          ))}
        </View>

        <Text style={styles.resultMessage}>{t(`quiz.msg${stars}`)}</Text>

        <TouchableOpacity style={styles.restartBtn} onPress={onRestart}>
          <Ionicons name="refresh-outline" size={18} color="#121212" />
          <Text style={styles.restartBtnText}>{t('quiz.playAgain')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const QuizMode = ({ isActive }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const freshState = useCallback(() => ({
    questions: buildQuestions(lang),
    qIndex: 0,
    lives: MAX_LIVES,
    score: 0,
    streak: 0,
    lifeGained: false,
    selected: null,
    showResult: false,
  }), [lang]);

  const [state, setState] = useState(freshState);
  const { questions, qIndex, lives, score, streak, lifeGained, selected, showResult } = state;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const advance = useCallback((nextLives) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setState(s => {
        if (nextLives <= 0 || s.qIndex + 1 >= TOTAL_QUESTIONS) {
          return { ...s, selected: null, showResult: true };
        }
        return { ...s, selected: null, lifeGained: false, qIndex: s.qIndex + 1 };
      });
    }, 700);
  }, [fadeAnim]);

  const handleOption = useCallback((option) => {
    if (selected !== null) return;

    let nextLives = lives;
    let nextScore = score;
    let nextStreak = streak;
    let gainedLife = false;

    if (option.correct) {
      nextScore = score + 1;
      nextStreak = streak + 1;
      if (nextStreak % STREAK_LIFE_BONUS === 0 && lives < MAX_LIVES) {
        nextLives = lives + 1;
        gainedLife = true;
      }
    } else {
      shake();
      nextLives = lives - 1;
      nextStreak = 0;
    }

    setState(s => ({ ...s, selected: option.id, lives: nextLives, score: nextScore, streak: nextStreak, lifeGained: gainedLife }));
    advance(nextLives);
  }, [selected, lives, score, streak, advance]);

  const restart = useCallback(() => setState(freshState()), [freshState]);

  if (!isActive) return null;

  if (showResult) return <ResultScreen score={score} onRestart={restart} />;

  const q = questions[qIndex];

  const optionBg = (opt) => {
    if (selected === null) return 'rgba(255,255,255,0.05)';
    if (opt.id === selected && opt.correct) return 'rgba(52,199,89,0.25)';
    if (opt.id === selected && !opt.correct) return 'rgba(255,69,58,0.25)';
    if (opt.correct && selected !== null) return 'rgba(52,199,89,0.15)';
    return 'rgba(255,255,255,0.05)';
  };

  const optionBorder = (opt) => {
    if (selected === null) return 'rgba(255,255,255,0.08)';
    if (opt.id === selected && opt.correct) return '#34c759';
    if (opt.id === selected && !opt.correct) return '#ff453a';
    if (opt.correct && selected !== null) return '#34c759';
    return 'rgba(255,255,255,0.08)';
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.livesRow}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < lives ? 'heart' : 'heart-outline'}
              size={22}
              color={i < lives ? '#ff453a' : 'rgba(255,69,58,0.3)'}
              style={{ marginRight: 4 }}
            />
          ))}
        </View>
        <Text style={styles.progress}>{qIndex + 1} / {TOTAL_QUESTIONS}</Text>
        <View style={styles.rightStats}>
          {streak >= 3 && <Text style={styles.streakDisplay}>🔥 {streak}</Text>}
          <Text style={styles.scoreDisplay}>⭐ {score}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${((qIndex + 1) / TOTAL_QUESTIONS) * 100}%` }]} />
      </View>

      {/* +1 Life banner */}
      {lifeGained && (
        <View style={styles.lifeBanner}>
          <Ionicons name="heart" size={14} color="#ff453a" />
          <Text style={styles.lifeBannerText}> +1 Life — {STREAK_LIFE_BONUS} in a row!</Text>
        </View>
      )}

      {/* Question */}
      <Animated.View style={[styles.questionCard, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.questionType}>
          {q.type === 'arabic_to_meaning' ? t('quiz.questionArabicToMeaning') : t('quiz.questionMeaningToArabic')}
        </Text>

        {q.type === 'arabic_to_meaning' ? (
          <>
            <Text style={styles.questionArabic}>{q.prompt}</Text>
            <Text style={styles.questionTranslit}>{q.promptSub}</Text>
          </>
        ) : (
          <Text style={styles.questionMeaning}>"{q.prompt}"</Text>
        )}
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {q.options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, { backgroundColor: optionBg(opt), borderColor: optionBorder(opt) }]}
            onPress={() => handleOption(opt)}
            activeOpacity={0.75}
          >
            {q.type === 'arabic_to_meaning' ? (
              <Text style={styles.optionMeaning} numberOfLines={3}>{opt.text}</Text>
            ) : (
              <>
                <Text style={styles.optionArabic}>{opt.text}</Text>
                {opt.sub && <Text style={styles.optionTranslit}>{opt.sub}</Text>}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  livesRow: { flexDirection: 'row' },
  progress: { fontSize: 14, color: '#b0b3b8', fontWeight: '600' },
  rightStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakDisplay: { fontSize: 13, color: '#ff9f0a', fontWeight: '700' },
  scoreDisplay: { fontSize: 14, color: '#d4af37', fontWeight: '700' },

  progressBarBg: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2, marginBottom: 12,
  },
  progressBarFill: {
    height: 4, backgroundColor: '#d4af37', borderRadius: 2,
  },

  lifeBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,69,58,0.12)',
    borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,69,58,0.3)',
  },
  lifeBannerText: { color: '#ff453a', fontSize: 13, fontWeight: '700' },

  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20, padding: 24, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    alignItems: 'center', minHeight: 140, justifyContent: 'center',
  },
  questionType: {
    fontSize: 11, color: '#d4af37', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16,
  },
  questionArabic: { fontSize: 48, color: '#d4af37', textAlign: 'center', marginBottom: 6 },
  questionTranslit: { fontSize: 16, color: '#b0b3b8' },
  questionMeaning: { fontSize: 20, color: '#f8f9fa', textAlign: 'center', lineHeight: 28, fontStyle: 'italic' },

  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  option: {
    width: (width - 52) / 2,
    borderRadius: 16, padding: 16, borderWidth: 1,
    minHeight: 80, justifyContent: 'center', alignItems: 'center',
  },
  optionMeaning: { fontSize: 13, color: '#e0e0e0', textAlign: 'center', lineHeight: 18 },
  optionArabic: { fontSize: 26, color: '#d4af37', textAlign: 'center', marginBottom: 4 },
  optionTranslit: { fontSize: 11, color: '#b0b3b8', textAlign: 'center' },

  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  resultCard: {
    backgroundColor: '#1E1E1E', borderRadius: 24, padding: 32,
    width: '100%', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    elevation: 20, shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12,
  },
  resultTitle: { fontSize: 24, fontWeight: '700', color: '#d4af37', marginBottom: 24 },
  scoreCircle: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderRadius: 60, width: 130, height: 120,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)',
    marginBottom: 24,
  },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#d4af37' },
  scoreTotal: { fontSize: 18, color: '#b0b3b8', marginBottom: 6, marginLeft: 2 },
  starsRow: { flexDirection: 'row', marginBottom: 20 },
  resultMessage: { fontSize: 15, color: '#b0b3b8', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  restartBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#d4af37',
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 25,
  },
  restartBtnText: { color: '#121212', fontSize: 16, fontWeight: '700' },
});

export default QuizMode;
