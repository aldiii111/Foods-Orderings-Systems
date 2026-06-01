/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  darkMode: "class", // enable class‑based dark mode (we’ll keep it on by default)
  theme: {
    extend: {
      colors: {
        primary: "#5850EC", // deep purple from Figma kit
        secondary: "#4A90E2", // accent blue
        glass: "rgba(255,255,255,0.08)",
        surface: "rgba(255,255,255,0.12)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
      },
      fontFamily: {
        sans: ["'Outfit'", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
