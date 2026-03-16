const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveRecordAudio(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    
    // 1. Add tools namespace if it doesn't exist
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/apk/res/tools';
    }

    // 2. Ensure uses-permission array exists
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    // 3. Filter out any existing RECORD_AUDIO to avoid duplicates
    manifest['uses-permission'] = manifest['uses-permission'].filter(
      (item) => item.$['android:name'] !== 'android.permission.RECORD_AUDIO'
    );

    // 4. Add the permission with tools:node="remove"
    // This tells the manifest merger to explicitly remove this permission
    // even if it's added by a library (like expo-audio).
    manifest['uses-permission'].push({
      $: {
        'android:name': 'android.permission.RECORD_AUDIO',
        'tools:node': 'remove',
      },
    });

    return config;
  });
};
