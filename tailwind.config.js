module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
    purge: false,
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 2s linear infinite',
            },
            margin: {
                80: '20rem',
            },
            width: {
                border: '0.05rem',
                'extend-50': '150%',
                'extend-27': '130%',
                80: '20rem',
                92: '23rem',
                100: '100rem',
            },
            height: {
                80: '20rem',
                92: '23rem',
                border: '0.05rem',
                '3/5-screen': '64vh',
            },
            maxHeight: {
                32: '8rem'
            },
            minWidth: {
                '2/3-screen': '75vw',
                '1/3-screen': '25vw',
                '1/2': '50%',
                '2/3': '66%',
                '1/3': '33%',
                32: '8rem',
                92: '23rem',
            },
            maxWidth: {
                screen: '100vw',
            },
            padding: {
                micro: '0.125rem',
            },
            colors: {
                primary: '#007BFF',
                secondary: '#181D26',
            },
            inset: {
                20: '20%',
                6: '6rem',
            },
            fontSize: {
                '2xs': '0.675rem',
                '3xs': '0.5rem',
            },
            gridTemplateColumns: {
                table: '50px repeat(7, 1fr)',
            },
            gridTemplateRows: {
                table: '35px repeat(6, 1fr)',
            },
            screens: {
                xs: '200px',
            },
        },
    },
    variants: {},
    plugins: [],
};
