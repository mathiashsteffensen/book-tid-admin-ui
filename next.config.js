module.exports = {
    webpack(config, {isServer}) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ['@svgr/webpack'],
      });
      return config;
    },
  };