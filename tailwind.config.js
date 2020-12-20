module.exports = {
  purge: false,
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      width: {
        'border': '0.05rem',
        'extend-50': '150%',
        'extend-27': '130%',
        '100': '100rem',
      },
      height: {
        'border': '0.05rem',
        '3/5-screen': '64vh',
      },
      minWidth: {
        '2/3-screen': '75vw',
        '1/2': '50%'
      },
      maxWidth: {
        'screen': '100vw'
      },
      padding: {
        'micro': '0.125rem'
      },
      colors: {
        'primary': '#3f51b5'
      },
      inset: {
        '20': '20%'
      },
      fontSize: {
        '2xs': '0.675rem',
        '3xs': '0.5rem'
      },
      gridTemplateColumns: {
          'table': '50px repeat(7, 1fr)'
      },
      gridTemplateRows: {
        'table': '35px repeat(6, 1fr)'
    },
    },
  },
  variants: {},
  plugins: [],
}

