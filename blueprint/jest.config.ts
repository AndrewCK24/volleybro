import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Config } from "jest";
import nextJest from "next/jest.js";

const blueprintRoot = path.dirname(fileURLToPath(import.meta.url));
const createJestConfig = nextJest({ dir: blueprintRoot });

export default async function jestConfig(): Promise<Config> {
  const nextResolved = await createJestConfig({})();

  return {
    ...nextResolved,
    rootDir: blueprintRoot,
    testEnvironment: "jest-fixed-jsdom",
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    transform: nextResolved.transform,
    transformIgnorePatterns: [
      "/node_modules/(?!.*(msw|@mswjs|rettime|until-async|@open-draft|cookie)/)",
      "^.+\\.module\\.(css|sass|scss)$",
    ],
    setupFilesAfterEnv: [path.join(blueprintRoot, "test/setup.ts")],
    moduleNameMapper: {
      ...nextResolved.moduleNameMapper,
      "^@/(.*)$": path.join(blueprintRoot, "src/$1"),
      "^@test/(.*)$": path.join(blueprintRoot, "test/$1"),
    },
  };
}
