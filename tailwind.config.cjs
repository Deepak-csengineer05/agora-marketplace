/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable dark mode via class strategy
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        agoraPink: "#ff5b8a",
        agoraAmber: "#ffb86b",
        agoraTeal: "#3ddfc7",
        agoraPurple: "#6a11cb",
        agoraBlue: "#00c6ff",
        agoraGreen: "#00f260",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #00c6ff, #6a11cb, #ff5b8a, #ffb86b, #00f260)",
        "brand-gradient2":
          "linear-gradient(90deg, #00f260,#00c6ff,#ffb86b)",
      },
    },
  },
  plugins: [],
};
