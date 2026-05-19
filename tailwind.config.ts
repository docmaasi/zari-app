import type { Config } from "tailwindcss";

// Brand palette: a Zora-inspired identity tuned for an emotional AI companion.
//   - bg / surface : deep near-black, slightly warm
//   - accent       : hot magenta — signature, warm, bold
//   - violet       : warm secondary that bridges to memory/AI feel
//   - blue (cyan)  : electric tech accent, used sparingly
//   - peach        : premium/celebration accent
// Legacy keys (`pink`, `blue`) preserved as aliases so existing components
// don't need touching for the rebrand to take effect.
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
          bg: "#0b0b12",
          surface: "#16161f",
          surface2: "#1f1f2c",
          accent: "#ff3d8a",
          "accent-light": "#ff7eb1",
          "accent-dark": "#d9216e",
          text: "#f7f7fb",
          muted: "#7e7e92",
          pink: "#ff3d8a",
          blue: "#5cf1ff",
          violet: "#b14aff",
          peach: "#ffcb6b",
          glow: "#ff3d8a",
        },
      },
      backgroundImage: {
        "zari-brand": "linear-gradient(120deg, #ff3d8a 0%, #b14aff 50%, #5cf1ff 100%)",
        "zari-brand-soft":
          "linear-gradient(120deg, rgba(255,61,138,0.18) 0%, rgba(177,74,255,0.14) 50%, rgba(92,241,255,0.14) 100%)",
        "zari-orb-radial":
          "radial-gradient(circle at 35% 30%, #ffd2e3 0%, #ff7eb1 18%, #ff3d8a 40%, #b14aff 72%, #5cf1ff 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1.2s ease-in-out infinite",
        thinking: "thinking 1.5s ease-in-out infinite",
        bounce: "bounce 1s infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "brand-pan": "brandPan 12s ease infinite",
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
        brandPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
