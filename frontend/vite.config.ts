import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1512,
    strictPort: true, // Optional: if 6000 is busy, Vite won't automatically try the next port
  },
})
