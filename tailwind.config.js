/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        card: '#1E1E1E',
        primary: '#BB86FC',
        text: {
          primary: '#F5F5F5',
          secondary: '#CCCCCC',
        },
        gray: {
          light: '#757575',
        },
        error: '#CF6679',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'waveform': 'waveform 1.2s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { height: '30%' },
          '50%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};