import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import LearnMode from './components/LearnMode';
import MemorizeMode from './components/MemorizeMode';
import HallOfFame from './components/HallOfFame';
import Dedication from './components/Dedication';

// Force absolute Edge-to-Edge on Android
if (Platform.OS === 'android') {
  NavigationBar.setPositionAsync('absolute');
  NavigationBar.setBackgroundColorAsync('#ffffff00'); // fully transparent
  SystemUI.setBackgroundColorAsync('#121212'); // prevent flashes behind nav
}

const { height } = Dimensions.get('window');

export default function App() {
  const [currentView, setCurrentView] = useState('learn');

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

          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => setCurrentView('learn')} style={styles.tabBtn}>
              <Ionicons name={currentView === 'learn' ? 'book' : 'book-outline'} size={24} color={currentView === 'learn' ? '#d4af37' : '#b0b3b8'} />
              <Text style={[styles.tabText, currentView === 'learn' && styles.activeTabText]}>Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView('memorize')} style={styles.tabBtn}>
              <Ionicons name={currentView === 'memorize' ? 'flash' : 'flash-outline'} size={24} color={currentView === 'memorize' ? '#d4af37' : '#b0b3b8'} />
              <Text style={[styles.tabText, currentView === 'memorize' && styles.activeTabText]}>Memorize</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView('hall')} style={styles.tabBtn}>
              <Ionicons name={currentView === 'hall' ? 'trophy' : 'trophy-outline'} size={24} color={currentView === 'hall' ? '#d4af37' : '#b0b3b8'} />
              <Text style={[styles.tabText, currentView === 'hall' && styles.activeTabText]}>Hall</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView('dedication')} style={styles.tabBtn}>
              <Ionicons name={currentView === 'dedication' ? 'heart' : 'heart-outline'} size={24} color={currentView === 'dedication' ? '#d4af37' : '#b0b3b8'} />
              <Text style={[styles.tabText, currentView === 'dedication' && styles.activeTabText]}>Dua</Text>
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
