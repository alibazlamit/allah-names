import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HusnaApp from './App'; // Reuse the main app logic from App.js if possible

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
    backgroundColor: '#121212',
  },
});
