export default {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"],
        },
        preset: "angular",
        releaseRules: [
          { breaking: true, release: "major" },
          { release: "minor", type: "feat" },
          { release: "patch", type: "fix" },
          { release: "patch", scope: "README", type: "docs" },
          { release: "patch", type: "chore" },
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { npmPublish: true, provenance: true }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
