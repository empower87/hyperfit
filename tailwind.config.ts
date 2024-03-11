import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.60rem",
        xxxs: "0.50rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
