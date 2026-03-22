/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-montserrat)', 'sans-serif'],
        mono: ['var(--font-montserrat)', 'monospace'],
      },
      colors: {
        bone: '#F8FAFC', // Cleaner white/slate-50 style
        navy: {
          light: '#2E5077',
          DEFAULT: '#1B365D',
          dark: '#0F1A2A',
          deep: '#070C14',
        },
        darkNavy: '#070C14',
        cardDark: '#0F1A2A',
        accentBlue: '#3B82F6',
        slateText: '#475569',
      },
      animation: {
        pulse: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}
