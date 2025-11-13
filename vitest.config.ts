import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: [...configDefaults.exclude, 'backup/**'],
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
      '@tests': '/tests',
    },
  },
})
