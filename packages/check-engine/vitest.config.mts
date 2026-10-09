import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // Real Chrome runs; a single run has a 20s budget.
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
