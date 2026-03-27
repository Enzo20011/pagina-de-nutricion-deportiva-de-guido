/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '576px',   // mòviles
      'md': '768px',   // tablets vertical
      'lg': '992px',   // tablets horizontal / medianas
      'xl': '1200px',  // desktops comunes
      '2xl': '1600px', // pantallas grandes / 4K
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        label: ['var(--font-manrope)', 'sans-serif'],
        mono: ['var(--font-manrope)', 'monospace'],
      },
      colors: {
        // Stitch Kinetic Lab Dark - Surface Hierarchy
        'kl-bg':          '#0a0f14', // base background
        'kl-surface':     '#0a0f14', // surface
        'kl-surface-low': '#0e1419', // surface-container-low
        'kl-surface-med': '#141a20', // surface-container
        'kl-surface-hi':  '#1a2027', // surface-container-high
        'kl-surface-top': '#1f262e', // surface-container-highest
        'kl-surface-var': '#1f262e', // surface-variant
        // Stitch Kinetic Lab Dark - Accent/Primary
        'kl-primary':     '#aaffdc',
        'kl-primary-c':   '#00fdc1',
        'kl-primary-dim': '#00edb4',
        'kl-secondary':   '#4afdd6',
        'kl-tertiary':    '#69daff',
        // Stitch Kinetic Lab Dark - Text
        'kl-text':        '#eaeef6',
        'kl-text-dim':    '#a7abb2',
        'kl-outline':     '#71767c',
        'kl-outline-var': '#43484e',
        // Legacy compat
        bone: '#eaeef6',
        darkNavy: '#0a0f14',
        navy: { DEFAULT: '#1a2027', dark: '#0e1419', deep: '#0a0f14' },
        cardDark: '#141a20',
        accentBlue: '#aaffdc',
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
        '3xl': '60px',
      },
      backgroundImage: {
        'gradient-top': 'linear-gradient(to top, rgba(7,12,20,1) 60%, transparent)',
      },
    },
  },
  plugins: [],
}
