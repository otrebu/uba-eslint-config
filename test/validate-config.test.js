import path from "node:path";

import { describe, test, expect } from "vitest";
import { ESLint } from "eslint";
import {
  generateEslintConfig,
  generateEslintConfigByFeatures,
} from "../index.js";

const fixture = (filename) => path.join("test", "fixtures", filename);

const lintWithConfig = async (config, filename) => {
  const eslint = new ESLint({
    allowInlineConfig: false,
    overrideConfigFile: true,
    overrideConfig: [{ ignores: [] }, ...config],
  });

  const [result] = await eslint.lintFiles([filename]);
  return result;
};

const collectRuleIds = (result) =>
  result.messages.map((message) => message.ruleId).filter(Boolean);

describe("generateEslintConfig", () => {
  test("fullstack config enforces React and a11y rules", async () => {
    const config = generateEslintConfig({ appType: "fullstack" });
    const result = await lintWithConfig(config, fixture("react.tsx"));
    const ruleIds = collectRuleIds(result);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        "react/button-has-type",
        "jsx-a11y/click-events-have-key-events",
      ]),
    );
  });

  test("backendOnly config omits React-specific rules", async () => {
    const config = generateEslintConfig({ appType: "backendOnly" });
    const result = await lintWithConfig(config, fixture("react.tsx"));
    const ruleIds = collectRuleIds(result);

    expect(ruleIds.some((id) => id?.startsWith("react/"))).toBe(false);
    expect(ruleIds.some((id) => id?.startsWith("jsx-a11y/"))).toBe(false);
  });
});

describe("generateEslintConfigByFeatures", () => {
  test("disabling TypeScript falls back to the JavaScript parser", async () => {
    const withTypescript = generateEslintConfigByFeatures({
      shouldEnableTypescript: true,
      shouldEnableNodeGlobals: true,
    });
    const withoutTypescript = generateEslintConfigByFeatures({
      shouldEnableTypescript: false,
      shouldEnableNodeGlobals: true,
    });

    const tsResult = await lintWithConfig(
      withTypescript,
      fixture("typescript.ts"),
    );
    expect(collectRuleIds(tsResult)).toEqual(
      expect.arrayContaining([
        "@typescript-eslint/no-explicit-any",
        "@typescript-eslint/no-unused-vars",
      ]),
    );

    const jsOnlyResult = await lintWithConfig(
      withoutTypescript,
      fixture("typescript.ts"),
    );
    expect(
      collectRuleIds(jsOnlyResult).some((id) =>
        id?.startsWith("@typescript-eslint/"),
      ),
    ).toBe(false);
    expect(
      jsOnlyResult.messages.some(
        (msg) => msg.ruleId === null && /Parsing error/i.test(msg.message),
      ),
    ).toBe(true);
  });

  test("Vitest feature flag toggles plugin enforcement", async () => {
    const vitestEnabled = generateEslintConfigByFeatures({
      shouldEnableVitest: true,
      shouldEnableNodeGlobals: true,
    });
    const vitestDisabled = generateEslintConfigByFeatures({
      shouldEnableVitest: false,
      shouldEnableNodeGlobals: true,
    });

    const withVitest = await lintWithConfig(
      vitestEnabled,
      fixture("vitest.test.ts"),
    );
    expect(collectRuleIds(withVitest)).toContain("vitest/expect-expect");

    const withoutVitest = await lintWithConfig(
      vitestDisabled,
      fixture("vitest.test.ts"),
    );
    expect(
      collectRuleIds(withoutVitest).some((id) => id?.startsWith("vitest/")),
    ).toBe(false);
  });
});
