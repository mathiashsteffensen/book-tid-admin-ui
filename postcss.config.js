const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},

    '@fullhuman/postcss-purgecss': {
        content: [
        './src/pages/*.js',
        './src/pages/**/*.js',
        './src/components/*.js',
        './src/components/**/*.js',
        './node_modules/react-bootstrap/**/*.js',
      ]
    }

  },
};