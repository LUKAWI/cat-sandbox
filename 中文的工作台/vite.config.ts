import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 10225,
    host: '0.0.0.0',
    // 开发环境代理 API 请求到 Express 后端
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:10230',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'clsx', 'tailwind-merge'],
          'markdown-vendor': ['react-markdown', 'rehype-highlight', 'remark-gfm'],
        },
      },
    },
  },
})
