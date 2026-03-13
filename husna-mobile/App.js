import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Platform, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import LearnMode from './components/LearnMode';
import MemorizeMode from './components/MemorizeMode';
import HallOfFame from './components/HallOfFame';
import Dedication from './components/Dedication';
import './i18n';
import { useTranslation } from 'react-i18next';

// Force absolute Edge-to-Edge on Android
if (Platform.OS === 'android') {
  NavigationBar.setPositionAsync('absolute');
  NavigationBar.setBackgroundColorAsync('#ffffff00'); // fully transparent
  SystemUI.setBackgroundColorAsync('#121212'); // prevent flashes behind nav
}

const { height } = Dimensions.get('window');

export default function App() {
  const [currentView, setCurrentView] = useState('learn');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangModalVisible(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <View style={styles.container}>

          <View style={[styles.mainContent, { paddingBottom: 0 }]}>
            {currentView === 'learn' && <LearnMode />}
            {currentView === 'memorize' && <MemorizeMode onComplete={() => setCurrentView('oath')} />}
            {currentView === 'hall' && <HallOfFame initialMode="leaderboard" />}
            {currentView === 'oath' && <HallOfFame initialMode="oath" onOathComplete={() => setCurrentView('hall')} />}
            {currentView === 'dedication' && <Dedication />}
          </View>

          {currentView === 'learn' && (
            <TouchableOpacity style={styles.langBtn} onPress={() => setLangModalVisible(true)}>
              <Ionicons name="globe-outline" size={24} color="#d4af37" />
            </TouchableOpacity>
          )}

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

                <TouchableOpacity style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.bottomNav}>
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
  }
});
