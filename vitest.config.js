import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.js"],
    testTimeout: 15000, // 15 seconds for slow ESLint operations
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "test/**",
        "**/*.config.js",
        "**/prettier.config.js",
      ],
    },
  },
});
