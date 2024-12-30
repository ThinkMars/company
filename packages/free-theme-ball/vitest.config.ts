import { defineConfig } from 'vitest/config'
import vue from 'rollup-plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      target: 'browser',
      css: true,
      preprocessStyles: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
