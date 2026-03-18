const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// If we are on the web, we can alias or ignore problematic native-only modules
if (process.env.EXPO_PUBLIC_PLATFORM === 'web' || process.env.npm_lifecycle_event === 'web' || process.env.EXPO_BUNDLER === 'webpack') {
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-country-picker-modal': require.resolve('react-native-web'), // Alias it to something safe
  };
}

module.exports = config;
