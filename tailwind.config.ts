import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        canopy: {
          DEFAULT: "#173F2A",
          light: "#1f5238",
          dark: "#102b1d",
        },
        gold: {
          DEFAULT: "#D9A441",
          light: "#e6bc6c",
          dark: "#b8862f",
        },
        charcoal: {
          DEFAULT: "#17221B",
        },
        cream: {
          DEFAULT: "#F7F3E8",
        },
        lime: {
          DEFAULT: "#A8D84E",
          dark: "#8bbf34",
        },
        border: "#E5E0D3",
        input: "#E5E0D3",
        ring: "#A8D84E",
        background: "#F7F3E8",
        foreground: "#17221B",
        primary: {
          DEFAULT: "#173F2A",
          foreground: "#F7F3E8",
        },
        secondary: {
          DEFAULT: "#A8D84E",
          foreground: "#17221B",
        },
        destructive: {
          DEFAULT: "#B3261E",
          foreground: "#F7F3E8",
        },
        muted: {
          DEFAULT: "#EDE7D6",
          foreground: "#4B5548",
        },
        accent: {
          DEFAULT: "#D9A441",
          foreground: "#17221B",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#17221B",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
