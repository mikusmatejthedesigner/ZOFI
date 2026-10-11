import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Na GitHub Pages web neběží na kořeni domény, ale v podsložce (/<název repozitáře>/).
// Workflow proto nastavuje VITE_BASE, lokálně a na vlastní doméně zůstává "/".
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
