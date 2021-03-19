module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
    },
    scale: {
     '0': '0',
     '10': '.10'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
  /* prefix: 'tw-', */
}
