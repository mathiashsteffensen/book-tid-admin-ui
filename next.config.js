const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPurgeCss = require('next-purgecss');

module.exports = withBundleAnalyzer(
  withPurgeCss({
    webpack(config, {isServer}) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ['@svgr/webpack'],
      });
      return config
    },

    purgeCssPaths: [
      './src/pages/*.js',
      './src/pages/**/*.js',
      './src/components/*.js',
      './src/components/**/*.js',
      './node_modules/react-bootstrap/**/*.js',
    ],
  })  
);