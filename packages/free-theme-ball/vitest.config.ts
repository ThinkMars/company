import { defineConfig } from 'vitest/config'
import vue from 'rollup-plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      target: 'browser',
      preprocessStyles: true,
    }),
  ],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
