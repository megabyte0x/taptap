import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunk
          'react-vendor': ['react', 'react-dom'],

          // Split Arweave related dependencies
          'arweave-core': ['arweave-wallet-kit'],
          'ao-connect': ['@permaweb/aoconnect'],

          // UI and animation libraries
          'ui-vendor': ['framer-motion', 'react-confetti'],

          // Data management
          'data-vendor': ['@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
