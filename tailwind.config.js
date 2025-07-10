/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/devtools.html",
    "./src/panel/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'github-dark': {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          'text-secondary': '#8b949e',
          link: '#58a6ff',
          'button-bg': '#21262d',
          'button-hover-bg': '#30363d',
          'button-text': '#c9d1d9',
        }
      }
    },
  },
  plugins: [],
}
