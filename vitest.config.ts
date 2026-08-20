import { defineConfig } from 'vitest/config'

const HOOK_TIMEOUT_MS = 60_000
const TEST_TIMEOUT_MS = 30_000

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'node',
    hookTimeout: HOOK_TIMEOUT_MS,
    passWithNoTests: true,
    testTimeout: TEST_TIMEOUT_MS
  }
})
