import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          900: "#24361F",
          700: "#3E5C33",
          500: "#6E9450",
          400: "#8FB56C",
          200: "#DCEBC8",
          100: "#EEF6E4",
        },
        cream: "#FBFBF3",
        apricot: { DEFAULT: "#E8974D", dark: "#C97A32" },
        berry: "#B4485C",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
