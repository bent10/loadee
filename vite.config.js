/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['js-yaml', /node\:/]
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts'],
    coverage: {
      include: ['src'],
      exclude: ['src/types.ts']
    }
  }
})
