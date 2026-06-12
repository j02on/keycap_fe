/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        crayon: ['Gaegu', 'cursive'],
      },
      colors: {
        skycrayon: '#8bd7ff',
        sunshine: '#ffe34f',
        tomato: '#f04444',
        leaf: '#a9df4f',
        ink: '#2a2a38',
        paper: '#fffdf0',
      },
      boxShadow: {
        comic: '7px 8px 0 #2a2a38',
        'comic-sm': '4px 5px 0 #2a2a38',
      },
    },
  },
  plugins: [],
}
