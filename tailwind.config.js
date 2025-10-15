/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'colorado-blue': '#1E40AF',
        'colorado-green': '#065F46',
        'legal-gold': '#F59E0B',
        'legal-gray': '#6B7280',
      },
      fontFamily: {
        'legal': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}