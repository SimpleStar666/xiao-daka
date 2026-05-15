/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        pink: {
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#F3B0C3',
          500: '#FFB5C2',
          600: '#e91e63',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },
      },
    },
  },
  plugins: [],
};