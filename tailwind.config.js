/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nyumba: {
          emerald: '#059669', // Verified trust color
          emeraldLight: '#ECFDF5',
          gold: '#D97706',    // Pending warning state
          amberLight: '#FFFBEB',
          crimson: '#DC2626', // Revoked / Scam alert state
          redLight: '#FEF2F2',
          navy: '#0F172A',    // Admin & Work dashboard surface
          slate: '#334155',
          cream: '#FAFAFA',   // Warm tenant background
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};