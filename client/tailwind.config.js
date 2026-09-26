/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B", // Amber-500 for a food theme
        secondary: "#1F2937",
        background: "#F9FAFB",
      },
    },
  },
  plugins: [],
}
