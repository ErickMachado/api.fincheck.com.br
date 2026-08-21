import { defineConfig } from 'vitest/config'

const HOOK_TIMEOUT_MS = 60_000
const TEST_TIMEOUT_MS = 30_000
const MIN_COVERAGE_PERCENTAGE = 90

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    coverage: {
      exclude: ['src/infra/docker/**', 'src/infra/database/migrations/**', 'src/main/main.ts'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      provider: 'v8',
      thresholds: {
        branches: MIN_COVERAGE_PERCENTAGE,
        functions: MIN_COVERAGE_PERCENTAGE,
        lines: MIN_COVERAGE_PERCENTAGE,
        statements: MIN_COVERAGE_PERCENTAGE
      }
    },
    environment: 'node',
    hookTimeout: HOOK_TIMEOUT_MS,
    passWithNoTests: true,
    testTimeout: TEST_TIMEOUT_MS
  }
})
