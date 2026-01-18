import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      shuffle: false,
    },
    env: {
      NODE_ENV: "test",
      PGDATABASE_TEST: "tix_test_data",
    },
  },
});
