import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'public/dist',
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@ui': '/src/ui',
      '@shared': '/src/shared',
      '@admin': '/src/app/contexts/admin',
      '@auth': '/src/app/contexts/auth',
      '@travel': '/src/app/contexts/travel',
    },
  },
})
