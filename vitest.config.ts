import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    coverage: {
      include: ['src/**'],
      provider: 'v8',
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90
      }
    },
    environment: 'node',
    hookTimeout: 60_000,
    passWithNoTests: true
  }
})
