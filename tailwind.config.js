/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0E1010",
        "brand-blue": "#63DCF8",
        "brand-white": "#FFF",
      },
    },
  },
  plugins: [],
};
