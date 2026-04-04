/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // We'll force dark mode
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8A00',
        brandblue: '#0EA5E9',
        black: '#0a0a0a',
        dark: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 138, 0, 0.15)',
        blueglow: '0 0 40px rgba(14, 165, 233, 0.1)',
      },
      borderRadius: {
        none: '0px',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
