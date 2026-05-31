import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { uploadApiPlugin } from './plugins/vite-upload-api.js'

export default defineConfig({
  plugins: [vue(), uploadApiPlugin()],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/products': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/orders': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/cart': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/categories': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
