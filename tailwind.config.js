/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#131E29',
        orange: '#FF9900',
        canvas: '#F7F8FA',
        line: '#E5E7EB',
        muted: '#64748B',
      },
    },
  },
  plugins: [],
}
