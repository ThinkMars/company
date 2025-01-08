import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
          antd_style: ['antd-style'],
          react: ['react'],
          react_dom: ['react-dom'],
        },
      },
    },
  },
})
