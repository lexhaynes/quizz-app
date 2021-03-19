module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
    },
    minHeight: {
     '75vh': '75vh',
     '78vh': '78vh',
     '90vh': '90vh',
     '95vh': '95vh',
    }
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
  /* prefix: 'tw-', */
}
