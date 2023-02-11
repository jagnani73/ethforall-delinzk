/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        onyx: "#414141",
        "pale-purple": "#F8ECFF",
        "slate-blue": "#7F56D9",
      },
    },
  },
  plugins: [],
};
