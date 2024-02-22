import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      sm: "0.875rem",
      xs: "0.75rem",
      xxs: "0.60rem",
      xxxs: "0.50rem",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
