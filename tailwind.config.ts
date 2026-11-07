import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "-apple-system", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"],
        urdu: ["var(--font-noto-urdu)", "Noto Nastaliq Urdu", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        kontrora: {
          black: "#050505",
          dark: "#0A0A0A",
          surface: "#111111",
          elevated: "#171717",
          bone: "#EDE8E0",
          "bone-dim": "rgba(237, 232, 224, 0.08)",
          muted: "#5C5852",
          secondary: "#9A958C",
          border: "rgba(237, 232, 224, 0.12)",
          "border-strong": "rgba(237, 232, 224, 0.22)",
        },
        hospital: {
          teal: "#0EA5A4",
          "teal-dark": "#0B7F86",
          "teal-light": "#14B8A6",
          blue: "#2563EB",
          "bg-light": "#F4F8FA",
          "surface-light": "#FFFFFF",
          "text-dark": "#0B1B26",
          "surface-dark": "#0B0F14",
          "bg-dark": "#050505",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.5rem",
        pill: "9999px",
      },
      boxShadow: {
        "glow-teal": "0 0 25px rgba(14, 165, 164, 0.35)",
        "glow-bone": "0 0 20px rgba(237, 232, 224, 0.15)",
        "card-soft": "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
      },
      letterSpacing: {
        widest: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
