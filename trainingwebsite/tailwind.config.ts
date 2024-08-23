import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        textHover: "var(--teal-11)",
        iconColor: "var(--teal-a12)",
        bgcolor: "var(--teal-4)"
      }
    },
  },
  plugins: [],
};

export default config;
