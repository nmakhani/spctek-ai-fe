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
      bg: {
        DEFAULT: "var(--theme-bg)",
        light: "var(--theme-bg-light)",
        card: "var(--theme-bg-card)",
      },
      cyan: {
        DEFAULT: "var(--theme-accent)",
        light: "var(--theme-accent-light)",
        dark: "var(--theme-accent-dark)",
        50: "#fdf4ff",
        100: "#fae8ff",
        400: "var(--theme-accent-light)",
        500: "var(--theme-accent)",
        600: "var(--theme-accent-dark)",
        900: "#590a70",
      },
      purple: {
        DEFAULT: "var(--theme-accent2)",
        light: "var(--theme-accent2-light)",
        dark: "var(--theme-accent2-dark)",
        50: "#f3e8f5",
        100: "#e8c8f0",
        400: "var(--theme-accent2-light)",
        500: "var(--theme-accent2)",
        600: "var(--theme-accent2-dark)",
        900: "#250b2a",
      },
      fg: "var(--theme-fg)",
      muted: "var(--theme-muted)",
      "muted-light": "var(--theme-muted-light)",
      "muted-dark": "var(--theme-muted-dark)",
      amber: {
        DEFAULT: "#fbbf24",
        light: "#fcd34d",
        dark: "#f59e0b",
      },
      rose: {
        DEFAULT: "#fb7185",
        light: "#fda4af",
        dark: "#f43f5e",
      },
      green: {
        DEFAULT: "#34d399",
        light: "#6ee7b7",
        dark: "#10b981",
      },
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
      dark: {
        50: "#f8fafc",
        100: "#e2e8f0",
        200: "#cbd5e1",
        300: "#94a3b8",
        400: "#64748b",
        500: "#475569",
        600: "#334155",
        700: "#1e293b",
        800: "#0f172a",
        900: "#020617",
        950: "#000000",
      },
    },
    extend: {
      colors: {
        "brand-primary": "#606bfa",
        "brand-secondary": "#a0a6fc",
        "brand-dark": "#131532",
      },
      fontFamily: {
        sans: ["Poppins", "var(--font-poppins)", "system-ui", "sans-serif"],
        heading: ["Gued", "Outfit", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "glass-gradient-hover":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        "aurora-1":
          "linear-gradient(135deg, rgba(var(--theme-accent-rgb),0.15) 0%, rgba(var(--theme-accent2-rgb),0.15) 50%, rgba(var(--theme-accent-rgb),0.05) 100%)",
        "aurora-2":
          "linear-gradient(225deg, rgba(var(--theme-accent2-rgb),0.12) 0%, rgba(var(--theme-accent-rgb),0.12) 50%, rgba(var(--theme-accent2-rgb),0.04) 100%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(var(--theme-accent-rgb),0.08) 0%, transparent 50%), radial-gradient(at 80% 0%, rgba(var(--theme-accent2-rgb),0.08) 0%, transparent 50%), radial-gradient(at 0% 50%, rgba(var(--theme-accent-rgb),0.04) 0%, transparent 50%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        aurora: "aurora 15s ease infinite",
        "spin-slow": "spin 12s linear infinite",
        "aurora-drift-1": "aurora-drift-1 25s ease-in-out infinite",
        "aurora-drift-2": "aurora-drift-2 32s ease-in-out infinite",
        "aurora-drift-3": "aurora-drift-3 28s ease-in-out infinite",
        "gradient-stripes": "gradient-stripes 12s linear infinite",
        "particle-shimmer": "particle-shimmer 4s ease-in forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(3deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(var(--theme-accent-rgb),0.2)" },
          "50%": { borderColor: "rgba(var(--theme-accent2-rgb),0.3)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "aurora-drift-1": {
          "0%": { transform: "translate(0, 0)", opacity: "0.4" },
          "25%": { transform: "translate(100px, -80px)", opacity: "0.6" },
          "50%": { transform: "translate(-50px, 100px)", opacity: "0.4" },
          "75%": { transform: "translate(80px, 50px)", opacity: "0.5" },
          "100%": { transform: "translate(0, 0)", opacity: "0.4" },
        },
        "aurora-drift-2": {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "0.3" },
          "25%": {
            transform: "translate(-120px, 100px) scale(1.1)",
            opacity: "0.5",
          },
          "50%": {
            transform: "translate(60px, -80px) scale(0.9)",
            opacity: "0.3",
          },
          "75%": {
            transform: "translate(-80px, -60px) scale(1.05)",
            opacity: "0.4",
          },
          "100%": { transform: "translate(0, 0) scale(1)", opacity: "0.3" },
        },
        "aurora-drift-3": {
          "0%": { transform: "translate(0, 0)", opacity: "0.35" },
          "25%": { transform: "translate(80px, 120px)", opacity: "0.5" },
          "50%": { transform: "translate(-100px, -60px)", opacity: "0.35" },
          "75%": { transform: "translate(60px, -100px)", opacity: "0.45" },
          "100%": { transform: "translate(0, 0)", opacity: "0.35" },
        },
        "gradient-stripes": {
          "0%": { backgroundPosition: "0% 0%", opacity: "0.15" },
          "50%": { opacity: "0.25" },
          "100%": { backgroundPosition: "200% 200%", opacity: "0.15" },
        },
        "particle-shimmer": {
          "0%": { opacity: "0", transform: "translateY(0) scale(0.5)" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-100px) scale(0)" },
        },
      },
      boxShadow: {
        "glow-cyan":
          "0 0 40px rgba(var(--theme-accent-rgb),0.3), 0 0 80px rgba(var(--theme-accent-rgb),0.1)",
        "glow-purple":
          "0 0 40px rgba(var(--theme-accent2-rgb),0.3), 0 0 80px rgba(var(--theme-accent2-rgb),0.1)",
        "glow-mixed":
          "0 0 40px rgba(var(--theme-accent-rgb),0.2), 0 0 80px rgba(var(--theme-accent2-rgb),0.15)",
        glass:
          "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-lg":
          "0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "inner-glow":
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.1)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
