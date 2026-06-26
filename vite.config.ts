import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

// 设置 uni-app 的源文件目录为 src
process.env.UNI_INPUT_DIR = path.resolve(__dirname, 'src')

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8123',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:8123',
        changeOrigin: true
      }
    }
  }
})