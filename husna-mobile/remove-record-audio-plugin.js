const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveRecordAudio(config) {
  return withAndroidManifest(config, (config) => {
    if (config.modResults.manifest['uses-permission']) {
      config.modResults.manifest['uses-permission'] = config.modResults.manifest['uses-permission'].filter(
        (permission) => permission.$['android:name'] !== 'android.permission.RECORD_AUDIO'
      );
    }
    return config;
  });
};
