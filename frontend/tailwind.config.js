/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        primary: "#155eef",
        secondary: "#0b3aa4",
      },
    },
  },
  plugins: [],
};
