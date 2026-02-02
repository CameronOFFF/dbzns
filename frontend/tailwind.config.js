/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          900: '#0b0f1a',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
        },
        aurum: '#fbbf24',
        lumen: '#38bdf8',
        ember: '#f97316',
      },
    },
  },
  plugins: [],
};
