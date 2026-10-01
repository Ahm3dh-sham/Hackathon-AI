import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        foreground: "#f3f4f6",
        card: "#111827",
        border: "#1f2937",
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#10b981",
          purple: "#a855f7",
          cyan: "#06b6d4"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
