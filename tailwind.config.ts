import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // SPF Finances institutional palette
        spf: {
          blue: "#1d4ed8", // primary action / tiles  (sampled from mockup ~ #1e4fc4)
          royal: "#1746a8", // hero base
          ink: "#0f2a5e", // deep navy, hero gradient end & footer
          sky: "#eef3fb", // pale tint backgrounds, badges
          line: "#e2e8f0", // hairline borders
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
} satisfies Config;
