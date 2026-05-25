import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// IMPORTANTE: cambia '/cafeteria-ucol/' por el nombre de tu repositorio en GitHub
// Ejemplo: si tu repo se llama "mi-cafeteria", pon '/mi-cafeteria/'
export default defineConfig({
  plugins: [react()],
  base: '/cafeteria-ucol/',
})
