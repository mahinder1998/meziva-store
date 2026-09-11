/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
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
        // Headings / luxury display
        serif: ["var(--font-fraunces)", "Georgia", "serif"],

        // Body / buttons / forms / navigation
        sans: ["var(--font-roboto)", "Arial", "sans-serif"],
      },

      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
    },
  },

  plugins: [],
};