/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        customer: '#93c5fd',
        employee: '#fca5a5',
      },
    },
  },
  plugins: [],
};
