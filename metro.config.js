// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // Habilita el soporte para CSS en la web.
    isCSSEnabled: true,
});

// Habilita la función que Expo Router necesita.
config.transformer.unstable_allowRequireContext = true;

module.exports = config;