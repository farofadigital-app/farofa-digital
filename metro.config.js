const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: true,
  mangle: true
};

module.exports = config;
