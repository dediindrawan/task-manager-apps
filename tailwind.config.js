/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./task-complete.html",
    "./task-form.html",
    "./task-uncomplete.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#4c44aa',
        'secondary': '#6a6dd8',
        'warning': '#f2d739',
        'danger': '#fd6e74',
        'success': '#3aab99',
        'darken': '#0e194d',
        'darken-50': 'rgba(14, 25, 77, 0.5)'
      },
    },
  },
  plugins: [],
}

