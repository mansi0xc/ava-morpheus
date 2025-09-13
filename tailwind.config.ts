import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Core System Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Avalanche Brand Colors
        avalanche: {
          red: "hsl(var(--avalanche-red))",
          black: "hsl(var(--avalanche-black))",
          white: "hsl(var(--avalanche-white))",
        },
        
        // Surface Colors
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        
        // Primary Colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        
        // Secondary Colors
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Destructive Colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Muted Colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Accent Colors
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Popover Colors
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Card Colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Steampunk Specific Colors
        brass: {
          DEFAULT: "hsl(var(--brass))",
          dark: "hsl(var(--brass-dark))",
        },
        copper: "hsl(var(--copper))",
        bronze: "hsl(var(--bronze))",
        
        // Glow Colors
        glow: {
          red: "hsl(var(--glow-red))",
          white: "hsl(var(--glow-white))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ornate: "var(--radius-ornate)",
      },
      
      boxShadow: {
        glow: "var(--shadow-glow)",
        ornate: "var(--shadow-ornate)",
        inset: "var(--shadow-inset)",
      },
      
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-ornate': 'var(--gradient-ornate)',
        'gradient-glow': 'var(--gradient-glow)',
      },
      
      fontFamily: {
        'steampunk': ['Cinzel', 'serif'],
        'ornate': ['Playfair Display', 'serif'],
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gear-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            textShadow: "0 0 5px hsl(var(--glow-red)), 0 0 10px hsl(var(--glow-red)), 0 0 15px hsl(var(--glow-red))"
          },
          "50%": { 
            textShadow: "0 0 10px hsl(var(--glow-red)), 0 0 20px hsl(var(--glow-red)), 0 0 30px hsl(var(--glow-red))"
          },
        },
        "border-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--glow-red) / 0.5)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--glow-red) / 0.8)" },
        },
        "ornate-entrance": {
          from: {
            opacity: "0",
            transform: "scale(0.9) translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gear-rotate": "gear-rotate 20s linear infinite",
        "gear-rotate-reverse": "gear-rotate 15s linear infinite reverse",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "ornate-entrance": "ornate-entrance 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
