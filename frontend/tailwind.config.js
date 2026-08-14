/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors are CSS variables (defined in globals.css) rather than fixed
      // hex values, so the same class names (bg-paper, text-ink, etc.) work
      // for both the light "Ledger" theme and the dark "Midnight Ledger"
      // theme — only the values swap based on the .dark class on <html>.
      colors: {
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        ledger: "rgb(var(--color-ledger) / <alpha-value>)",
        "ledger-dark": "rgb(var(--color-ledger-dark) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        oxblood: "rgb(var(--color-oxblood) / <alpha-value>)",
        parchment: "rgb(var(--color-surface-2) / <alpha-value>)",
        moss: "rgb(var(--color-moss) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(201, 162, 39, 0)" },
          "50%": { boxShadow: "0 0 24px rgba(201, 162, 39, 0.25)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
