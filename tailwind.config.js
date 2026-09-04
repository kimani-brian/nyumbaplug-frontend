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
        // Google Blue — primary actions, links, focus rings
        primary: {
          DEFAULT: '#1A73E8',
          hover: '#1967D2',
          dark: '#174EA6',
          deep: '#185ABC',
          light: '#E8F0FE',
          soft: '#F4F8FD',
        },
        // Deprecated legacy aliases — kept so un-migrated components still
        // resolve; each surface is repointed to semantic tokens as its phase
        // lands (Phase 2 = shell/common, Phase 4 = hero/public, Phase 5 = dashboards).
        nyumba: {
          emerald: '#1A73E8',
          emeraldDark: '#1967D2',
          emeraldLight: '#E8F0FE',
          terracotta: '#174EA6',
          navy: '#174EA6',
          ink: '#202124',
          cream: '#FFFFFF',
          sand: '#F1F3F4',
          line: '#DADCE0',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'Arial', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Google Material elevation scale (neutral)
        soft: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        lift: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
        // Blue-tinted elevation for primary buttons/CTAs
        glow: '0 1px 2px 0 rgba(26,115,232,.3), 0 4px 8px 3px rgba(26,115,232,.15)',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
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
        'fade-up': 'fade-up 0.35s ease-out both',
        'fade-down': 'fade-down 0.35s ease-out both',
        'fade-left': 'fade-left 0.35s ease-out both',
        'fade-right': 'fade-right 0.35s ease-out both',
        'zoom-in': 'zoom-in 0.35s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.18s ease-out both',
      },
    },
  },
  plugins: [],
};
