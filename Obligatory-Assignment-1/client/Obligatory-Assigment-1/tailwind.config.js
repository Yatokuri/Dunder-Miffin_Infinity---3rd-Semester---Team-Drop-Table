import daisyui from './node_modules/daisyui';
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'icon-color': '#626470', // Custom color for icons etc
        'logo-color': '#20255E',
        'logo-color-hover': '#2a317a',
      },
    },
  },
  plugins: [daisyui],
}

