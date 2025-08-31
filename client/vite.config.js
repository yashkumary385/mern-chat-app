import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
    server: {
    historyApiFallback: true,  // ensures local dev routing works
  },
})
