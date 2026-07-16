/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0A0E13',
          900: '#0F141B',
          800: '#161C25',
          700: '#1F2732',
          600: '#2B3644',
        },
        mist: {
          50: '#F7F9FB',
          100: '#EDF0F4',
          200: '#DCE1E8',
        },
        signal: {
          up: '#3ECF8E',
          upDim: '#1E4A38',
          down: '#F2545B',
          downDim: '#4A1F22',
        },
        amber: {
          400: '#F0B429',
          500: '#DE9A1F',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
