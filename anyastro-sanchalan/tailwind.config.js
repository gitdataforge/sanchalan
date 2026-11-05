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
        brand: {
          black: '#000000',
          sidebar: '#050505',
          card: '#0B0B0B',
          elevated: '#111111',
          input: '#141414',
          border: '#262626',
          white: '#FFFFFF',
          silver: '#BDBDBD',
          muted: '#777777',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          blueTint: '#172554',
          blueFocus: '#60A5FA',
        },
        status: {
          new: '#3B82F6',
          contacted: '#06B6D4',
          interested: '#8B5CF6',
          qualified: '#14B8A6',
          proposal: '#6366F1',
          won: '#22C55E',
          lost: '#EF4444',
          hold: '#F59E0B',
          overdue: '#DC2626',
          spam: '#737373',
        },
        light: {
          bg: '#F5F5F5',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          text: '#111111',
          secondary: '#666666',
          border: '#E5E5E5',
          primaryAction: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}