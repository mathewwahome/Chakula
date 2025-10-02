export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00233c",
          hover: "#001a30",
        },
        accent: {
          DEFAULT: "#8ac826",
        },
        neutral: {
          dark: "#0F1724",
          light: "#F7FAFC",
        },
        danger: "#D64545",
      },
      borderRadius: {
        lg: "8px",
      },
    },
  },
  plugins: [],
}