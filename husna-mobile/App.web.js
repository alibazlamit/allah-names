import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HusnaApp from './App.js'; // Explicitly point to the .js file to avoid cycle

// We can wrap the mobile app with web-specific layout or just export it
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
    height: '100vh',
    width: '100%',
    backgroundColor: '#121212',
  },
});
