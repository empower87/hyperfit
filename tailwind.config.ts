import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: ["0.60rem", "0.75rem"],
        xxxs: ["0.50rem", "0.50rem"],
      },
      colors: {
        primary: {
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
        },
        secondary: {
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
        },
        base: "#fff",
        muted: "#cbd5e1",
      },
    },
  },
  plugins: [],
} satisfies Config;
