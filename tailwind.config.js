/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  //  safelist: ['custom-calendar', 'calendar-popup'],
  theme: {
    extend: {
      colors: {
        travanaTeal: "#0D9488", // matching suitcase
        travanaYellow: "#FBBF24", // matching plane trail
        travanaCoral: "#FB7185", // matching plane tail
        travanaDark: "#0F172A", // for contrast/dark handle
      },
      fontFamily: {
        Clash_Display: ['"Clash Display"', "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
};
