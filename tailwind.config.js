/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#9C7A4C",
        charcoal: "#1C1512",
        cream: "#F3EAE2",
        wine: "#7A2E3A",
        blush: "#E8D2C9",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
    },
  },
  plugins: [],
};