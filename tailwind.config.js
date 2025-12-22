/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7132CA",
        secondary: "#C47BE4",
        border: "#979EB0",
        success: "#087D0E",
        error: "#EF9E6F",

        gray: {
          700: "#2E303E",
          600: "#6C7284",
          500: "#848CA1",
          400: "#F6F7FB",
        },

        purple: {
          700: "#7C3AED",
          600: "#9333EA",
          500: "#A855F7",
          400: "#C084FC",
          300: "#E9D5FF",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
      },
    },
  },
  plugins: [],
};
