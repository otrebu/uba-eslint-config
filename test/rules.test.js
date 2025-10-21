import { describe, test, expect } from "vitest";
import { ESLint } from "eslint";

describe("ESLint Rule Configuration", () => {
  test("no-console rule catches console statements", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const codeWithConsole = 'console.log("test");\n';
    const results = await eslint.lintText(codeWithConsole, {
      filePath: "test.js",
    });

    // Should have errors since no-console is enabled
    expect(results[0].errorCount).toBeGreaterThan(0);
    const hasNoConsoleError = results[0].messages.some(
      (m) => m.ruleId === "no-console",
    );
    expect(hasNoConsoleError).toBe(true);
  });

  test("no-var rule catches var declarations", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const codeWithVar = 'var x = 1;\n';
    const results = await eslint.lintText(codeWithVar, {
      filePath: "test.js",
    });

    // Should have errors since no-var is enabled
    expect(results[0].errorCount).toBeGreaterThan(0);
    const hasNoVarError = results[0].messages.some(
      (m) => m.ruleId === "no-var",
    );
    expect(hasNoVarError).toBe(true);
  });

  test("TypeScript rules are enabled for .ts files", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const config = await eslint.calculateConfigForFile("test.ts");

    // Check that TypeScript parser is configured
    expect(config.languageOptions?.parser).toBeDefined();

    // Check that at least some TypeScript rules are enabled
    const tsRules = Object.keys(config.rules || {}).filter((rule) =>
      rule.startsWith("@typescript-eslint/"),
    );
    expect(tsRules.length).toBeGreaterThan(0);
  });

  test("React rules are enabled for .jsx files", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const config = await eslint.calculateConfigForFile("test.jsx");

    // Check that React rules are present
    const reactRules = Object.keys(config.rules || {}).filter((rule) =>
      rule.startsWith("react/"),
    );
    expect(reactRules.length).toBeGreaterThan(0);

    // Check React Hooks rules are present
    const hooksRules = Object.keys(config.rules || {}).filter((rule) =>
      rule.startsWith("react-hooks/"),
    );
    expect(hooksRules.length).toBeGreaterThan(0);
  });

  test("import rules are configured", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const config = await eslint.calculateConfigForFile("test.js");

    // Check that import rules are present
    const importRules = Object.keys(config.rules || {}).filter((rule) =>
      rule.startsWith("import/"),
    );
    expect(importRules.length).toBeGreaterThan(0);
  });

  test("unicorn rules are configured", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const config = await eslint.calculateConfigForFile("test.js");

    // Check that unicorn rules are present
    const unicornRules = Object.keys(config.rules || {}).filter((rule) =>
      rule.startsWith("unicorn/"),
    );
    expect(unicornRules.length).toBeGreaterThan(0);
  });

  test("max-params rule is set to 3", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    // Test with 4 parameters (should fail)
    const codeWithTooManyParams = 'function test(a, b, c, d) {}\n';
    const results = await eslint.lintText(codeWithTooManyParams, {
      filePath: "test.js",
    });

    // Should have an error for max-params
    const hasMaxParamsError = results[0].messages.some(
      (m) => m.ruleId === "max-params",
    );
    expect(hasMaxParamsError).toBe(true);
  });

  test("prefer-template rule is enabled", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const codeWithConcatenation = 'const message = "Hello " + name;\n';
    const results = await eslint.lintText(codeWithConcatenation, {
      filePath: "test.js",
    });

    // Should suggest using template literals
    const hasPreferTemplateError = results[0].messages.some(
      (m) => m.ruleId === "prefer-template",
    );
    expect(hasPreferTemplateError).toBe(true);
  });
});
