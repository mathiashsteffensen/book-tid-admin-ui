module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    [
      '@fullhuman/postcss-purgecss',
      {
        content: [
            './src/pages/**/*.{js,jsx,ts,tsx}',
            './src/components/**/*.{js,jsx,ts,tsx}'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      }
    ],
  ],
};