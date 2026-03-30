import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#030d1a",
          900: "#071428",
          800: "#0c1e3a",
          700: "#112548",
        },
      },
    },
  },
  plugins: [],
};

export default config;
