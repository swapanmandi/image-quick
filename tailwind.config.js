/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        darkPalette: {
          100: "#000B58",
          200: "#006A67",
          300: "#FB773C",
          400: "#3DC2EC",
        },
      },
    },
  },
  plugins: [],
};
