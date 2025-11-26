/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // This is the crucial line that enables class-based dark mode.
  // It tells Tailwind to apply dark variants when a 'dark' class is present on the html tag.
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
