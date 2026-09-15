/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {50:'#eef6fc',100:'#d9ecf8',200:'#b3d9f1',300:'#7ebfe6',400:'#4098d1',500:'#0B6FB8',600:'#0a5c99',700:'#0c4a7a',800:'#0f3c62',900:'#123350'},
        honey: {50:'#fff8ea',100:'#ffedc4',200:'#ffdb8a',300:'#ffc450',400:'#fbaa2a',500:'#F5A524',600:'#dc8a12',700:'#b66d0f',800:'#935915',900:'#794a16'},
        leaf: {50:'#eef7f1',100:'#d3ecdc',400:'#6cb389',500:'#4C9A6A',600:'#3d7d56',700:'#2f6243'},
        cream: '#FAF7F0',
        ink: '#16324F',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
}