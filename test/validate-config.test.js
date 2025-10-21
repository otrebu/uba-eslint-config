import { describe, test, expect } from "vitest";
import { ESLint } from "eslint";
import { generateEslintConfig, generateEslintConfigByFeatures } from "../index.js";

describe("ESLint Config Loading", () => {
  test("config loads without errors", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    expect(eslint).toBeDefined();

    // Try linting a simple file to ensure config actually works
    const results = await eslint.lintText('const x = 1;\n', {
      filePath: "test.js",
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  test("generateEslintConfig function exists and is callable", () => {
    expect(typeof generateEslintConfig).toBe("function");

    const fullstackConfig = generateEslintConfig({ appType: "fullstack" });
    expect(Array.isArray(fullstackConfig)).toBe(true);
    expect(fullstackConfig.length).toBeGreaterThan(0);

    const backendConfig = generateEslintConfig({ appType: "backendOnly" });
    expect(Array.isArray(backendConfig)).toBe(true);
    expect(backendConfig.length).toBeGreaterThan(0);
  });

  test("generateEslintConfigByFeatures function exists and is callable", () => {
    expect(typeof generateEslintConfigByFeatures).toBe("function");

    const minimalConfig = generateEslintConfigByFeatures({
      shouldEnableTypescript: false,
      shouldEnableReact: false,
      shouldEnableA11y: false,
      shouldEnableCypress: false,
      shouldEnableVitest: false,
      shouldEnableGraphql: false,
      shouldEnableStorybook: false,
      shouldEnableQuery: false,
      shouldEnableRouter: false,
      shouldEnableBrowserGlobals: false,
      shouldEnableNodeGlobals: true,
    });

    expect(Array.isArray(minimalConfig)).toBe(true);
    expect(minimalConfig.length).toBeGreaterThan(0);
  });

  test("fullstack config includes React and TypeScript", () => {
    const config = generateEslintConfig({ appType: "fullstack" });

    // Check that React plugin is included by looking for React rules
    const hasReactRules = config.some((entry) => {
      const rules = entry.rules || {};
      return Object.keys(rules).some((rule) => rule.startsWith("react/"));
    });
    expect(hasReactRules).toBe(true);

    // Config should have entries for TypeScript files
    const hasTypeScriptFiles = config.some((entry) => {
      const files = entry.files || [];
      return files.some((pattern) => pattern.includes("**/*.ts") || pattern.includes("**/*.tsx"));
    });
    expect(hasTypeScriptFiles).toBe(true);
  });

  test("backendOnly config excludes React plugins", () => {
    const config = generateEslintConfig({ appType: "backendOnly" });

    // Should not include React-specific rules
    const hasReactRules = config.some((entry) => {
      const rules = entry.rules || {};
      return Object.keys(rules).some((rule) => rule.startsWith("react/"));
    });
    expect(hasReactRules).toBe(false);

    // Should not include jsx-a11y rules
    const hasA11yRules = config.some((entry) => {
      const rules = entry.rules || {};
      return Object.keys(rules).some((rule) => rule.startsWith("jsx-a11y/"));
    });
    expect(hasA11yRules).toBe(false);
  });

  test("config with TypeScript disabled is smaller", () => {
    const configWithoutTs = generateEslintConfigByFeatures({
      shouldEnableTypescript: false,
      shouldEnableNodeGlobals: true,
    });

    const configWithTs = generateEslintConfigByFeatures({
      shouldEnableTypescript: true,
      shouldEnableNodeGlobals: true,
    });

    // Config array should be shorter without TypeScript config
    expect(configWithoutTs.length).toBeLessThan(configWithTs.length);

    // Config with TypeScript should be valid
    expect(Array.isArray(configWithoutTs)).toBe(true);
    expect(configWithoutTs.length).toBeGreaterThan(0);
  });

  test("config works with different file types", async () => {
    const eslint = new ESLint({
      overrideConfigFile: "./eslint.config.js",
    });

    const fileTypes = [
      { code: 'const x = 1;\n', path: "test.js" },
      { code: 'const x: number = 1;\n', path: "test.ts" },
      { code: 'export const Component = () => <div />;\n', path: "test.jsx" },
      { code: 'export const Component = () => <div />;\n', path: "test.tsx" },
    ];

    for (const { code, path } of fileTypes) {
      const results = await eslint.lintText(code, { filePath: path });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    }
  });
});
