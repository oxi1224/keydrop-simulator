const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontSize: {
        '2xs': '.56rem',
        '3xs': '.5rem'
      },
      colors: {
        navy: {
          100: 'rgb(180 184 205)',
          200: 'rgb(152 158 187)',
          300: 'rgb(106 109 129)',
          400: 'rgb(66 66 84)',
          500: 'rgb(49 48 62)',
          550: 'rgb(40 37 49)',
          600: 'rgb(31 30 39)',
          650: 'rgb(31 32 35)',
          650: 'rgb(31 32 35)',
          700: 'rgb(25 24 30)',
          750: 'rgb(23 23 28)',
          800: 'rgb(17 17 20)',
          900: 'rgb(8 10 13)'
        },
        white: '#FFFFFF',
        black: '#000000',
        gold: {
          DEFAULT: 'rgb(220,174,100)',
          400: 'rgb(255 203 119)',
          500: 'rgb(220 174 100)',
          600: 'rgb(215 163 79)',
          850: 'rgb(94 72 47)',
          900: 'rgb(62 50 30)',
          1000: 'rgb(220 174 100)'
        },
        lightgreen: {
          DEFAULT: 'rgb(119 255 157)',
          100: 'rgb(168 255 166)',
          200: 'rgb(119 255 157)'
        },
        current: 'currentColor',
        pastelGreen: 'rgb(80, 227, 109)',
        neonGreen: 'rgb(127, 217, 25)',
        failure: '#ff445d',
        success: '#588806',
        red: {
          DEFAULT: 'rgb(255, 68, 93)'
        },
        pink: {
          DEFAULT: 'rgb(223, 93, 238)'
        },
        violet: {
          DEFAULT: 'rgb(164, 26, 255)'
        },
        blue: {
          DEFAULT: 'rgb(68, 130, 255)'
        },
        gray: {
          DEFAULT: 'rgb(102, 102, 102)'
        },
        green: {
          DEFAULT: 'rgb(34, 197, 94)'
        }
      },
      translate: {
        110: '110%'
      },
      maxWidth: {
        '1/2': '50%'
      },
      borderColor: {
        default: 'currentColor'
      }
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('is-open', '&.is-open');
      addVariant('in-open', '.is-open &');
    })
  ]
};
