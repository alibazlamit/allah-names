import React from 'react';
import { StyleSheet, View } from 'react-native';
import HusnaApp from './App.js'; // Explicitly point to the .js file to avoid cycle

// Global CSS to handle mobile viewport issues and address bar clipping
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      height: 100%;
      height: 100dvh; /* Modern browsers */
      height: -webkit-fill-available; /* iOS Safari */
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #121212;
    }
    #root {
      width: 100%;
      position: fixed;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <View style={styles.webContainer}>
      <HusnaApp />
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    height: '100dvh',
    width: '100%',
    backgroundColor: '#121212',
  },
});
