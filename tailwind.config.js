/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",      // Azul vibrante
        secondary: "#22c55e",    // Verde lima
        accent: "#fde047",       // Amarillo cálido
        background: "#f8fafc",   // Gris muy claro
        dark: "#1e293b",         // Gris oscuro
        muted: "#64748b",        // Gris medio
      },
    },
  },
  plugins: [],
}
