import React, { useState, useEffect, Suspense } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Platform, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import LearnMode from './components/LearnMode';
import MemorizeMode from './components/MemorizeMode';
import HallOfFame from './components/HallOfFame';
import Dedication from './components/Dedication';
import AudioPlayer from './components/AudioPlayer';
import './i18n';
import { useTranslation } from 'react-i18next';

// Force absolute Edge-to-Edge on Android logic moved inside App component

const NASHEEDS = [
  { id: '1', title: 'Asma Allah (Asmaa Allah)', type: 'local', file: require('./assets/imad-rami.mp3') },
];

function HusnaApp() {
  const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = useState('learn');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);
  const { t, i18n } = useTranslation();

  // Global Audio State
  const [isPlayingNasheed, setIsPlayingNasheed] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [currentNasheedTitle, setCurrentNasheedTitle] = useState('');
  const [currentAudioSource, setCurrentAudioSource] = useState(null);
  const [nasheedModalVisible, setNasheedModalVisible] = useState(false);
  const [loopA, setLoopA] = useState(null);
  const [loopB, setLoopB] = useState(null);

  useEffect(() => {
    // Force absolute Edge-to-Edge on Android
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setPositionAsync('absolute').catch(() => {});
        NavigationBar.setBackgroundColorAsync('#ffffff00').catch(() => {}); // fully transparent
        SystemUI.setBackgroundColorAsync('#121212').catch(() => {}); // prevent flashes behind nav
      } catch (e) {
        console.warn('Native UI initialization failed', e);
      }
    }
  }, []);

  const player = useAudioPlayer(currentAudioSource || null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.playing) {
      if (loopA !== null && loopB !== null && status.currentTime * 1000 >= loopB) {
        player.seekTo(loopA / 1000);
      }
    }
  }, [status.currentTime, loopA, loopB]);

  useEffect(() => {
    if (player && currentAudioSource && isPlayingNasheed) {
      try {
        player.loop = true;
        player.play();
      } catch (err) {
        console.error('Failed to start playback:', err);
      }
    }
  }, [player, currentAudioSource, isPlayingNasheed]);

  const togglePlayPause = () => {
    if (!player) return;
    try {
      if (isPlayingNasheed) {
        player.pause();
        setIsPlayingNasheed(false);
      } else {
        player.play();
        setIsPlayingNasheed(true);
      }
    } catch (e) {
      console.error('Playback toggle error:', e);
    }
  };

  const stopNasheed = () => {
    try {
      if (player) player.pause();
    } catch (e) {
      console.error('Stop error:', e);
    }
    setIsPlayingNasheed(false);
    setCurrentNasheedTitle('');
    setCurrentAudioSource(null);
    setLoopA(null);
    setLoopB(null);
  };

  const handleSetLoop = () => {
    const currentPos = status.currentTime * 1000;
    if (loopA === null) setLoopA(currentPos);
    else if (loopB === null) {
      if (currentPos > loopA + 1000) {
        setLoopB(currentPos);
        player?.seekTo(loopA / 1000);
      }
    } else {
      setLoopA(null);
      setLoopB(null);
    }
  };

  const selectAndPlayNasheed = (nasheed) => {
    stopNasheed();
    if (nasheed.type === 'local') setCurrentAudioSource(nasheed.file);
    else setCurrentAudioSource({ uri: nasheed.uri });
    setCurrentNasheedTitle(nasheed.title);
    setIsPlayingNasheed(true);
    setNasheedModalVisible(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>

        <View style={[styles.mainContent, { paddingBottom: 0 }]}>
          {currentView === 'learn' && <LearnMode onPlayNasheed={() => setNasheedModalVisible(true)} isNasheedPlaying={!!currentNasheedTitle} />}
          {currentView === 'memorize' && (
            <MemorizeMode onComplete={(time) => { 
              setTimeTaken(time); 
              setCurrentView('oath'); 
            }} />
          )}
          {currentView === 'hall' && <HallOfFame initialMode="leaderboard" />}
          {currentView === 'oath' && (
            <HallOfFame 
              initialMode="oath" 
              timeTaken={timeTaken} 
              onOathComplete={() => setCurrentView('hall')} 
            />
          )}
          {currentView === 'dedication' && <Dedication />}
        </View>

        {currentView === 'learn' && (
          <TouchableOpacity style={styles.langBtn} onPress={() => setLangModalVisible(true)}>
            <Ionicons name="globe-outline" size={24} color="#d4af37" />
          </TouchableOpacity>
        )}

        <AudioPlayer
          isPlaying={status.playing}
          title={currentNasheedTitle}
          duration={status.duration * 1000}
          position={status.currentTime * 1000}
          isMinimized={isPlayerMinimized}
          onTogglePlay={togglePlayPause}
          onStop={stopNasheed}
          onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
          onSeek={(val) => {
             try {
               player?.seekTo(val / 1000);
             } catch(e) { console.error('Seek error:', e); }
          }}
          onSetLoop={handleSetLoop}
          loopA={loopA}
          loopB={loopB}
          onOpenMenu={() => setNasheedModalVisible(true)}
        />

        <Modal visible={nasheedModalVisible} transparent={true} animationType="slide">
          <View style={styles.nasheedModalOverlay}>
            <View style={styles.nasheedModalContent}>
              <View style={styles.nasheedHeader}>
                <Text style={styles.nasheedTitle}>{t('learn.nasheeds')}</Text>
                <TouchableOpacity onPress={() => setNasheedModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#b0b3b8" />
                </TouchableOpacity>
              </View>
              {NASHEEDS.map(item => (
                <TouchableOpacity key={item.id} style={styles.nasheedItem} onPress={() => selectAndPlayNasheed(item)}>
                  <Text style={styles.nasheedItemText}>{item.title}</Text>
                  {currentNasheedTitle === item.title && <Ionicons name="volume-high" size={20} color="#d4af37" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal visible={langModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>

              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('en')}>
                <Text style={styles.langText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('ar')}>
                <Text style={styles.langText}>العربية</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('bs')}>
                <Text style={styles.langText}>Bosanski</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('tr')}>
                <Text style={styles.langText}>Türkçe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('ur')}>
                <Text style={styles.langText}>اردو</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('id')}>
                <Text style={styles.langText}>Bahasa Indonesia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('bn')}>
                <Text style={styles.langText}>বাংলা</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('fa')}>
                <Text style={styles.langText}>فارسی</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
                <Text style={styles.closeBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                 style={{ marginTop: 20 }} 
                 onPress={() => require('react-native').Linking.openURL('https://allahin99ismi.com/')}
              >
                <Text style={{ color: '#d4af37', fontSize: 12, opacity: 0.8, textAlign: 'center' }}>
                  {t('common.translationCredit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={[styles.bottomNav, { bottom: Math.max(insets.bottom, Platform.OS === 'web' ? 20 : 30) }]}>
          <TouchableOpacity onPress={() => setCurrentView('learn')} style={styles.tabBtn}>
            <Ionicons name={currentView === 'learn' ? 'book' : 'book-outline'} size={24} color={currentView === 'learn' ? '#d4af37' : '#b0b3b8'} />
            <Text style={[styles.tabText, currentView === 'learn' && styles.activeTabText]}>{t('navigation.learn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentView('memorize')} style={styles.tabBtn}>
            <Ionicons name={currentView === 'memorize' ? 'flash' : 'flash-outline'} size={24} color={currentView === 'memorize' ? '#d4af37' : '#b0b3b8'} />
            <Text style={[styles.tabText, currentView === 'memorize' && styles.activeTabText]}>{t('navigation.memorize')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentView('hall')} style={styles.tabBtn}>
            <Ionicons name={currentView === 'hall' ? 'trophy' : 'trophy-outline'} size={24} color={currentView === 'hall' ? '#d4af37' : '#b0b3b8'} />
            <Text style={[styles.tabText, currentView === 'hall' && styles.activeTabText]}>{t('navigation.hall')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentView('dedication')} style={styles.tabBtn}>
            <Ionicons name={currentView === 'dedication' ? 'heart' : 'heart-outline'} size={24} color={currentView === 'dedication' ? '#d4af37' : '#b0b3b8'} />
            <Text style={[styles.tabText, currentView === 'dedication' && styles.activeTabText]}>{t('navigation.dua')}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Suspense fallback={<View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#d4af37' }}>Loading...</Text></View>}>
        <HusnaApp />
      </Suspense>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f2b23',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 20 : 30,
    left: 20,
    right: 20,
    height: 65,
    backgroundColor: 'rgba(25, 30, 28, 0.95)',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    minWidth: 60,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    color: '#b0b3b8',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#d4af37',
  },
  langBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    right: 20,
    backgroundColor: 'rgba(25, 30, 28, 0.8)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 20,
  },
  langOption: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  langText: {
    fontSize: 18,
    color: '#f8f9fa',
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#b0b3b8',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#b0b3b8',
    fontSize: 16,
  },
  nasheedModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  nasheedModalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  nasheedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nasheedTitle: {
    color: '#d4af37',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nasheedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  nasheedItemText: {
    color: '#f8f9fa',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#d4af37',
    fontSize: 16,
  }
});
