import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: {
      // Fixes HMR issues by ensuring proper connection
      overlay: true,
      // Use WebSockets for more reliable HMR
      protocol: 'ws',
      // Increase timeout for slower connections
      timeout: 30000
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'react-i18next',
      'i18next',
      'zustand',
      'react-icons',
      'chart.js',
      'react-chartjs-2'
    ]
  },
  // Improve build performance
  build: {
    // Reduce chunk size for better caching
    chunkSizeWarningLimit: 1000,
    // Minify output for production
    minify: 'terser',
    // Generate sourcemaps for debugging
    sourcemap: true
  }
})
