import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./config/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#A32D2D",
          hover: "#801F1F",
          soft: "#FCEBEB",
          deep: "#501313",
        },
        ink: "#0A0A0A",
        muted: "#5A5A5A",
        hairline: "#E0E0E0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "640px",
      },
    },
  },
  plugins: [],
};
export default config;
