import type { GlobalConfig } from "semantic-release";

const config: Partial<GlobalConfig> = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/changelog", { changelogFile: "docs/CHANGELOG.md" }],
    ["@semantic-release/git", { assets: ["docs/CHANGELOG.md"] }],
  ],
};

export default config;
