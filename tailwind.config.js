/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c15329', // New primary color
          hover: '#a84723', // Darker shade for hover
          light: '#fdf1ed', // Light shade for backgrounds
          dark: '#8f3d1f', // Darker shade for active states
        }
      }
    },
  },
  plugins: [],
}