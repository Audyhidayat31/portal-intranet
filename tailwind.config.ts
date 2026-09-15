import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00113a',
        'on-primary': '#ffffff',
        'on-primary-fixed-variant': '#2a4386',
        'institutional-navy': '#003366',
        'heritage-gold': '#B8860B',
        'error-ruby': '#DC3545',
        'info-cerulean': '#0D6EFD',
        'success-emerald': '#198754',
        'outline': '#727782',
        'outline-variant': '#c5c6d2',
        'on-surface': '#191c1d',
        'on-surface-variant': '#444650',
        'surface-muted': '#E9ECEF',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f3f9',
        'surface-container': '#efedf3',
        'surface-container-high': '#e9e7ee',
        'surface-container-highest': '#e1e3e4',
        'surface-variant': '#e1e3e4',
        'secondary': '#1b6d24',
        'secondary-container': '#a0f399',
        'on-secondary-container': '#217128',
        'primary-container': '#002366',
        'on-primary-container': '#758dd5',
        perpusnas: {
          50: '#f0f5fc',
          100: '#e1ecf8',
          200: '#c3daf2',
          300: '#94bfe9',
          400: '#5e9ddc',
          500: '#387ecc',
          600: '#2664b0',
          700: '#1e4f8f',
          800: '#1b4376',
          900: '#003469', // Main Navy Brand
          950: '#002244',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#B8860B', // Accent Amber/Gold
          700: '#996f09',
          800: '#7a5807',
          900: '#5c4205',
        }
      },
      spacing: {
        'gutter': '24px',
        'margin-desktop': '32px',
        'container-max': '1280px',
        'section-gap': '64px',
        'margin-mobile': '16px',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'Plus Jakarta Sans', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Atkinson Hyperlegible Next', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'Atkinson Hyperlegible Next', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
