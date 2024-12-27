/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], //NavBar

        montserrat: ['Montserrat', 'sans-serif'], // For headlines
        openSans: ['Open Sans', 'sans-serif'],    // For body text
        workSans: ['Work Sans', 'sans-serif'],    // For Button font

        poppins: ['Poppins', 'sans-serif'],       // For headlines
        roboto: ['Roboto', 'sans-serif'],         // For body text
        barlow: ['Barlow', 'sans-serif'],         // for Button font

        playfair: ['Playfair Display', 'serif'],  // For headlines
        lora: ['Lora', 'serif'],                  // For body text
        nunito: ['Nunito', 'sans-serif'],         // for Button font

        oswald: ['Oswald', 'sans-serif'],         // For headlines
        inter: ['Inter', 'sans-serif'],           // For body text
        fjallaOne: ['Fjalla One', 'sans-serif'],  // for Button font

        raleway: ['Raleway', 'sans-serif'],       // For headlines
        notoSans: ['Noto Sans', 'sans-serif'],    // For body text
        workSans: ['Work Sans', 'sans-serif'],    // For Button font






      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}