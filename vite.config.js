/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      input: ['src/index.ts', 'src/async.ts', 'src/sync.ts']
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})
