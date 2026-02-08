/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        burnt: '#BF5700',
        spotify: '#1DB954',
      },
    },
  },
  plugins: [],
};
