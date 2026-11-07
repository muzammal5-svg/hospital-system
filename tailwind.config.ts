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
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        urdu: ["var(--font-noto-urdu)", "Noto Nastaliq Urdu", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hospital: {
          navy: "#0B4F8A",
          "navy-hover": "#093F6E",
          "navy-tint": "#E8F1F9",
          teal: "#1E9E8F",
          "teal-hover": "#167C70",
          "teal-tint": "#E6F5F3",
          bg: "#F6F9FC",
          card: "#FFFFFF",
          border: "#E3E9EF",
          "sidebar-navy": "#0B3A66",
          "sidebar-active": "#14538F",
          "sidebar-indicator": "#1E9E8F",
          darkBg: "#0F1B2A",
          darkSurface: "#162638",
          darkBorder: "#23374D",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "#093F6E",
          tint: "#E8F1F9",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "#167C70",
          tint: "#E6F5F3",
        },
        destructive: {
          DEFAULT: "#D64545",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#2E9E6B",
          foreground: "#FFFFFF",
          tint: "#EAF7F0",
        },
        warning: {
          DEFAULT: "#E39B12",
          foreground: "#FFFFFF",
          tint: "#FEF7E8",
        },
        danger: {
          DEFAULT: "#D64545",
          foreground: "#FFFFFF",
          tint: "#FCEBEB",
        },
        info: {
          DEFAULT: "#2F80C9",
          foreground: "#FFFFFF",
          tint: "#EDF5FC",
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
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 24, 40, 0.06)",
        dropdown: "0 4px 12px rgba(16, 24, 40, 0.08)",
        modal: "0 10px 25px rgba(16, 24, 40, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
