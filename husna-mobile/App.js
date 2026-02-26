import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Platform } from 'react-native';
import LearnMode from './components/LearnMode';
import MemorizeMode from './components/MemorizeMode';
import HallOfFame from './components/HallOfFame';

const { height } = Dimensions.get('window');

export default function App() {
  const [currentView, setCurrentView] = useState('learn');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2b23" />
      <View style={styles.container}>

        <View style={styles.topNav}>
          <Text style={styles.logo}>Husna</Text>
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navBtn, currentView === 'learn' && styles.activeNavBtn]}
              onPress={() => setCurrentView('learn')}
            >
              <Text style={[styles.navBtnText, currentView === 'learn' && styles.activeNavBtnText]}>Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, currentView === 'memorize' && styles.activeNavBtn]}
              onPress={() => setCurrentView('memorize')}
            >
              <Text style={[styles.navBtnText, currentView === 'memorize' && styles.activeNavBtnText]}>Memorize</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, currentView === 'hall' && styles.activeNavBtn]}
              onPress={() => setCurrentView('hall')}
            >
              <Text style={[styles.navBtnText, currentView === 'hall' && styles.activeNavBtnText]}>Hall</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          {currentView === 'learn' && <LearnMode />}
          {currentView === 'memorize' && <MemorizeMode onComplete={() => setCurrentView('oath')} />}
          {currentView === 'hall' && <HallOfFame initialMode="leaderboard" />}
          {currentView === 'oath' && <HallOfFame initialMode="oath" onOathComplete={() => setCurrentView('hall')} />}
        </View>

      </View>
    </SafeAreaView>
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15,
    backgroundColor: '#0f2b23',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d4af37',
    letterSpacing: 1,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeNavBtn: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  navBtnText: {
    color: '#b0b3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  activeNavBtnText: {
    color: '#d4af37',
  },
  mainContent: {
    flex: 1,
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
