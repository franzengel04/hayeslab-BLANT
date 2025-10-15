import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/blant/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'http://hayeslab.ics.uci.edu',
    hmr: {
      protocol: 'ws',
      host: 'hayeslab.ics.uci.edu',
      port: 5173
    }
  }
})
