/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E76F35",
          50: "#FDF5F0",
          100: "#FCE8DC",
          200: "#F8CCA9",
          300: "#F4AF77",
          400: "#EE8E47",
          500: "#E76F35",
          600: "#D3551B",
          700: "#A64115",
          800: "#792F0F",
          900: "#4D1D09",
        },
        secondary: {
          DEFAULT: "#25364A",
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#25364A",
          600: "#1C2A3A",
          700: "#141F2B",
          800: "#0D151D",
          900: "#060A0E",
        },
        background: "#F7F8FA",
        surface: "#FFFFFF",
        typography: "#252B36",
        success: {
          DEFAULT: "#1D9B68",
          50: "#EBF8F2",
          500: "#1D9B68",
          600: "#168055",
        },
        warning: {
          DEFAULT: "#E9A23B",
          50: "#FDF7EE",
          500: "#E9A23B",
          600: "#CF8928",
        },
        danger: {
          DEFAULT: "#D94B4B",
          50: "#FDF0F0",
          500: "#D94B4B",
          600: "#B83535",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        hover: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
