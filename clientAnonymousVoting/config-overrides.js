const webpack = require('webpack');

module.exports = function override(config) {
  const webpackVersion = webpack.version;
  console.log('webpack version:', webpackVersion);
  config.ignoreWarnings = [/Failed to parse source map/];
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve('crypto-browserify'),
    "stream": require.resolve('stream-browserify'),
    "assert": require.resolve('assert/'),
    "http": require.resolve('stream-http'),
    "https": require.resolve('https-browserify'),
    "os": require.resolve('os-browserify/browser'),
    "url": require.resolve('url/'),
    "buffer": require.resolve('buffer/'),
    "vm": require.resolve("vm-browserify"),
    "process": require.resolve('process/browser.js'),
  });
  config.resolve.fallback = fallback;
  config.resolve.alias = {
    ...config.resolve.alias,
    "process/browser.js": require.resolve("process/browser.js"),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};