const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  port: parseInt(process.env.RCT_METRO_PORT || 8081, 10),
};

module.exports = config;
