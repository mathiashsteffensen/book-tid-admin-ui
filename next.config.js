const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
    webpack(config, {isServer}) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ['@svgr/webpack'],
      });
      
      if (process.env.ANALYZE) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        )
      }
      return config;
    },
  };