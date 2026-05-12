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

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(lang) {
  const langMap = translations[lang] ?? translations['en'];
  const pool = shuffle(namesData).slice(0, TOTAL_QUESTIONS);

  return pool.map(correct => {
    const isArabicToMeaning = Math.random() > 0.5;
    const wrongs = shuffle(namesData.filter(n => n.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]).map(n => ({
      id: n.id,
      text: isArabicToMeaning ? (langMap[String(n.id)] ?? n.transliteration) : n.arabic,
      sub: isArabicToMeaning ? null : n.transliteration,
      correct: n.id === correct.id,
    }));

    return {
      type: isArabicToMeaning ? 'arabic_to_meaning' : 'meaning_to_arabic',
      prompt: isArabicToMeaning ? correct.arabic : (langMap[String(correct.id)] ?? correct.transliteration),
      promptSub: isArabicToMeaning ? correct.transliteration : null,
      options,
      correctId: correct.id,
    };
  });
}

function starsForScore(score) {
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  if (score >= 3) return 1;
  return 0;
}

// ── Result screen ──────────────────────────────────────────────────────────────
const ResultScreen = ({ score, onRestart }) => {
  const stars = starsForScore(score);

  useEffect(() => {
    if (stars >= 2) maybeAskForRating();
  }, [stars]);

  const messages = [
    'Keep practicing — you\'ll get there! 💪',
    'Good effort! Review the names and try again.',
    'Well done! You\'re getting there. 🌟',
    'Excellent! You know the 99 Names well! ✨',
  ];

  return (
    <View style={styles.resultContainer}>
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Quiz Complete</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreTotal}>/ {TOTAL_QUESTIONS}</Text>
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

        <Text style={styles.resultMessage}>{messages[stars]}</Text>

        <TouchableOpacity style={styles.restartBtn} onPress={onRestart}>
          <Ionicons name="refresh-outline" size={18} color="#121212" />
          <Text style={styles.restartBtnText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const QuizMode = ({ isActive }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const freshState = useCallback(() => ({
    questions: buildQuestions(lang),
    qIndex: 0,
    lives: MAX_LIVES,
    score: 0,
    selected: null,
    showResult: false,
  }), [lang]);

  const [state, setState] = useState(freshState);
  const { questions, qIndex, lives, score, selected, showResult } = state;

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

  const advance = useCallback((isCorrect, nextLives) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setState(s => {
        if (nextLives <= 0 || s.qIndex + 1 >= TOTAL_QUESTIONS) {
          return { ...s, selected: null, showResult: true };
        }
        return { ...s, selected: null, qIndex: s.qIndex + 1 };
      });
    }, 700);
  }, [fadeAnim]);

  const handleOption = useCallback((option) => {
    if (selected !== null) return;

    let nextLives = lives;
    let nextScore = score;

    if (option.correct) {
      nextScore = score + 1;
    } else {
      shake();
      nextLives = lives - 1;
    }

    setState(s => ({ ...s, selected: option.id, lives: nextLives, score: nextScore }));
    advance(option.correct, nextLives);
  }, [selected, lives, score, advance]);

  const restart = useCallback(() => {
    setState(freshState());
  }, [freshState]);

  if (!isActive) return null;

  if (showResult) {
    return <ResultScreen score={score} onRestart={restart} />;
  }

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
        <Text style={styles.scoreDisplay}>⭐ {score}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${((qIndex + 1) / TOTAL_QUESTIONS) * 100}%` }]} />
      </View>

      {/* Question */}
      <Animated.View style={[styles.questionCard, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.questionType}>
          {q.type === 'arabic_to_meaning' ? 'What does this name mean?' : 'Which name has this meaning?'}
        </Text>

        {q.type === 'arabic_to_meaning' ? (
          <>
            <Text style={styles.questionArabic}>{q.prompt}</Text>
            <Text style={styles.questionTranslit}>{q.promptSub}</Text>
          </>
        ) : (
          <Text style={styles.questionMeaning}>{q.prompt}</Text>
        )}
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {q.options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, {
              backgroundColor: optionBg(opt),
              borderColor: optionBorder(opt),
            }]}
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
  scoreDisplay: { fontSize: 14, color: '#d4af37', fontWeight: '700' },

  progressBarBg: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2, marginBottom: 24,
  },
  progressBarFill: {
    height: 4, backgroundColor: '#d4af37',
    borderRadius: 2,
  },

  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20, padding: 24, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    alignItems: 'center', minHeight: 160, justifyContent: 'center',
  },
  questionType: {
    fontSize: 11, color: '#d4af37', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16,
  },
  questionArabic: { fontSize: 48, color: '#d4af37', textAlign: 'center', marginBottom: 6 },
  questionTranslit: { fontSize: 16, color: '#b0b3b8' },
  questionMeaning: { fontSize: 18, color: '#f8f9fa', textAlign: 'center', lineHeight: 26 },

  optionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  option: {
    width: (width - 52) / 2,
    borderRadius: 16, padding: 16,
    borderWidth: 1,
    minHeight: 80, justifyContent: 'center', alignItems: 'center',
  },
  optionMeaning: {
    fontSize: 13, color: '#e0e0e0', textAlign: 'center', lineHeight: 18,
  },
  optionArabic: { fontSize: 26, color: '#d4af37', textAlign: 'center', marginBottom: 4 },
  optionTranslit: { fontSize: 11, color: '#b0b3b8', textAlign: 'center' },

  // Result screen
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
    borderRadius: 60, width: 120, height: 120,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)',
    marginBottom: 24,
  },
  scoreNumber: { fontSize: 52, fontWeight: '800', color: '#d4af37' },
  scoreTotal: { fontSize: 20, color: '#b0b3b8', marginBottom: 8, marginLeft: 2 },
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
