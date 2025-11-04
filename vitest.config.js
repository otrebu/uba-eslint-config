import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "node_modules/**",
        "test/**",
        "**/*.config.js",
        "**/prettier.config.js",
      ],
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    environment: "node",
    globals: true,
    include: ["test/**/*.test.js"],
    // 15 seconds for slow ESLint operations
    testTimeout: 15_000,
  },
});
