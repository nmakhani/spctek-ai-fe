/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      fg: "var(--theme-fg)",
      slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617",
      },
    },
    extend: {
      colors: {
        "brand-primary": "#606bfa",
        "brand-secondary": "#a0a6fc",
      },
      fontFamily: {
        sans: ["Poppins", "var(--font-poppins)", "system-ui", "sans-serif"],
        heading: ["Gued", "Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple":
          "0 0 40px rgba(var(--theme-accent2-rgb),0.3), 0 0 80px rgba(var(--theme-accent2-rgb),0.1)",
      },
    },
  },
  plugins: [],
};
