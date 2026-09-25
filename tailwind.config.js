/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f7',
          100: '#fbe8f0',
          200: '#f7d3e3',
          300: '#f1b0cd',
          400: '#e77fb1',
          500: '#d95493',
          600: '#c53879',
          700: '#aa2761',
          800: '#8d2351',
          900: '#752145',
        },
        pastel: {
          pink: '#ffd1dc',
          blue: '#c5e0f5',
          mint: '#cbf3d2',
          yellow: '#fff2b2',
          purple: '#e2d4f0',
          peach: '#ffe5d9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
