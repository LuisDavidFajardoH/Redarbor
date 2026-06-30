/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Scheme-dependent (driven by CSS vars in global.css, flips light/dark).
        background: 'rgb(var(--c-background) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--c-surface-elevated) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        'border-strong': 'rgb(var(--c-border-strong) / <alpha-value>)',
        foreground: 'rgb(var(--c-foreground) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        // Brand colors (constant across both schemes).
        accent: '#6366F1',
        'accent-soft': '#6366F120',
        'accent-foreground': '#FFFFFF',
        'accent-glow': '#6366F133',
        green: '#32D583',
        'green-soft': '#32D58320',
        amber: '#FFB547',
        'amber-soft': '#FFB54720',
        coral: '#E85A4F',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        pill: '31px',
      },
    },
  },
  plugins: [],
};
