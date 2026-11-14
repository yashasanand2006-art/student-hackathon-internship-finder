/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1E293B',
          border: '#2A364F',
          muted: '#94A3B8',
          accent: '#8B5CF6',
          primary: '#6366F1',
          secondary: '#3B82F6',
          cyan: '#06B6D4',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.12) 35%, rgba(11, 15, 25, 0) 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.35)',
      },
    },
  },
  plugins: [],
};
