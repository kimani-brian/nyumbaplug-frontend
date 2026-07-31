/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nyumba: {
          emerald: '#0B7A5B',    // Verified trust color
          emeraldDark: '#065F46',
          emeraldLight: '#ECFDF5',
          terracotta: '#C0562E', // Editorial warm accent
          navy: '#0F172A',       // Depth surface
          cream: '#FAF7F2',      // Warm paper background
          sand: '#EFE9DF',       // Section tint
          ink: '#1C1B1A',        // Editorial text
          line: '#E5DED2',       // Warm border
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(15, 23, 42, 0.08)',
        lift: '0 12px 40px -12px rgba(15, 23, 42, 0.18)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
