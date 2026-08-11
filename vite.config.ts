import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path is '/Monophase-Transformer/' only for production (GitHub Pages).
// During dev (`npm run dev`), base stays '/' so localhost:5173 works normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Monophase-Transformer/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))
