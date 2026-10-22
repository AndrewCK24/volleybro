// next.config.ts imports next/server, which captures AsyncLocalStorage at load.
// Next's own CLI installs the global first; Storybook does not, so without this
// the captured instance is a stub that throws when used.
import "next/dist/server/node-environment-baseline.js";
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: { builder: { useSWC: true } },
  },
};

export default config;
