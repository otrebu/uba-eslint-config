import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @returns {import("eslint").Linter.Config[]} */
function getStorybookConfig() {
  const storybookPlugin = getStorybookPlugin();

  return [
    ...storybookPlugin.configs["flat/recommended"],
    { ignores: [".storybook", "storybook-static"] },
    {
      files: ["**/*.stories.@(js|jsx|ts|tsx)"],
      rules: { "storybook/no-renderer-packages": "off" },
    },
  ];
}

function getStorybookPlugin() {
  try {
    const storybookPluginModule = require("eslint-plugin-storybook");

    return storybookPluginModule.default ?? storybookPluginModule;
  } catch {
    throw new Error(
      "Storybook linting requires optional peer dependencies: eslint-plugin-storybook@^10.2.8 and storybook@^10.2.8.",
    );
  }
}

export { getStorybookConfig };
