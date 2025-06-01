// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5500,
  },
  optimizeDeps: {
    include: ['fast-deep-equal'],
  },
})
