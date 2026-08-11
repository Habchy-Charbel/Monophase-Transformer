import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Base path must match your GitHub Pages URL subpath:
  // https://<username>.github.io/Monophase-Transformer/
  base: '/Monophase-Transformer/',
  plugins: [
    react(),
    tailwindcss()
  ],
})
