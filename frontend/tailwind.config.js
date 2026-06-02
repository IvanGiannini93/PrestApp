/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faf4',
          100: '#e8f5ee',
          200: '#c6e7d4',
          300: '#8fd4aa',
          400: '#4dba7a',
          500: '#2d9d5f',
          600: '#217a4b',
          700: '#1a5c3a',
          800: '#164a2f',
          900: '#123d27',
        },
      },
    },
  },
  plugins: [],
};
