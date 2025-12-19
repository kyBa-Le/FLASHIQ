/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7132CA",
        secondary: "#C47BE4",
        border: "#979EB0",         
        input: {
          DEFAULT: "#F6F7FB",
          text: "#848CA1",
        },
        success: "#087D0E",
        error: "#EF9E6F",
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
