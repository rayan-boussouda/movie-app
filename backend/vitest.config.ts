import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./src/__tests__/globalSetup.ts'],
    testTimeout: 15000,
    fileParallelism: false,
    reporters: ['verbose', 'html'],
    outputFile: { html: './test-report/index.html' },
  },
});
