import path from "node:path";

import { describe, test, expect, beforeAll } from "vitest";
import { ESLint } from "eslint";

const fixturePath = (filename) => path.join("test", "fixtures", filename);

const extractRuleIds = (result) =>
  result.messages.map((message) => message.ruleId).filter(Boolean);

describe("ESLint Rule Configuration", () => {
  let eslint;

  beforeAll(() => {
    eslint = new ESLint({
      allowInlineConfig: false,
      overrideConfigFile: "./eslint.config.js",
    });
  });

  const lintFixture = async (filename) => {
    const [result] = await eslint.lintFiles([fixturePath(filename)]);
    return result;
  };

  test("javascript baseline rules flag console, var, and max-params violations", async () => {
    const result = await lintFixture("javascript.js");
    const ruleIds = extractRuleIds(result);

    expect(ruleIds).toEqual(
      expect.arrayContaining(["no-console", "no-var", "max-params"]),
    );
  });

  test("import ordering and unicorn export rules run on import fixtures", async () => {
    const result = await lintFixture("imports.js");
    const ruleIds = extractRuleIds(result);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        "perfectionist/sort-imports",
        "unicorn/prefer-export-from",
      ]),
    );
  });

  test("TypeScript-specific rules run on .ts files", async () => {
    const result = await lintFixture("typescript.ts");
    const ruleIds = extractRuleIds(result);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        "@typescript-eslint/no-explicit-any",
        "@typescript-eslint/no-unused-vars",
      ]),
    );
  });

  test("React and a11y rules run on React components", async () => {
    const result = await lintFixture("react.tsx");
    const ruleIds = extractRuleIds(result);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        "react/button-has-type",
        "jsx-a11y/click-events-have-key-events",
      ]),
    );
  });

  test("Vitest plugin rules run on test files", async () => {
    const result = await lintFixture("vitest.test.ts");
    const ruleIds = extractRuleIds(result);

    expect(ruleIds).toContain("vitest/expect-expect");
  });
});
