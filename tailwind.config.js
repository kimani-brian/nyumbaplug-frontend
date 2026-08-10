/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens (flip via CSS variables + .dark class)
        page: 'rgb(var(--page) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        'panel-strong': 'rgb(var(--panel-strong) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        primary: {
          DEFAULT: '#2F2FE4',
          hover: '#2828CC',
          dark: '#162E93',
          deep: '#1A1953',
          light: '#EEF0FC',
          soft: '#F7F8FE',
        },
        nyumba: {
          // Primary bright blue — CTAs, verified trust, active states
          emerald: '#2F2FE4',
          emeraldDark: '#162E93',
          emeraldLight: '#EEF0FC',
          // Secondary / supporting accent
          terracotta: '#162E93',
          // Depth surfaces
          navy: '#1A1953',
          // Near-black premium backgrounds
          ink: '#080616',
          // Cool neutral surfaces
          cream: '#FFFFFF',
          sand: '#F3F4FC',
          line: '#E4E7F5',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(22, 46, 147, 0.08)',
        lift: '0 16px 48px -16px rgba(22, 46, 147, 0.22)',
        glow: '0 8px 32px -8px rgba(47, 47, 228, 0.35)',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-down': 'fade-down 0.6s ease-out both',
        'fade-left': 'fade-left 0.6s ease-out both',
        'fade-right': 'fade-right 0.6s ease-out both',
        'zoom-in': 'zoom-in 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
