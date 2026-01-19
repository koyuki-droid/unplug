/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Ignore React Native modules (not needed for web)
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
        'react-native': false,
      };
      
      // Ignore these modules in webpack
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@react-native-async-storage\/async-storage$/,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;

