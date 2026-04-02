import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zari: {
          bg: "#0a0a14",
          surface: "#14142a",
          surface2: "#1e1e3a",
          accent: "#7c5cfc",
          "accent-light": "#a78bfa",
          text: "#e8e8f0",
          muted: "#8888a8",
          pink: "#e855a0",
          blue: "#38b2ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1.2s ease-in-out infinite",
        thinking: "thinking 1.5s ease-in-out infinite",
        bounce: "bounce 1s infinite",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1.5)" },
        },
        thinking: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
