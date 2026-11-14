/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C16', // Deepest background canvas
          900: '#0D1526', // Elevated card background
          850: '#111C33', // Card hover / surface
          800: '#1B2945', // Standard border
          700: '#2A3C60', // Highlight border
          600: '#425883', // Muted slate
          500: '#647DAB',
        },
        brand: {
          50: '#F0F6FE',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Confident blue
          600: '#2563EB', // Core primary action
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 14px 30px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.2)',
        'elevated': '0 20px 40px -15px rgba(2, 6, 23, 0.8)',
      },
      backgroundImage: {
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'hero-ambient': 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(37, 99, 235, 0.12), transparent 70%)',
      },
    },
  },
  plugins: [],
};
