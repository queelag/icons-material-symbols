import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/index.ts'],
      reporter: ['lcov']
    },
    include: ['tests/index.test.ts']
  }
})
