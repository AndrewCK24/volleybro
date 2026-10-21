/** @jest-environment node */
import { wranglerDeployArgs } from "./wrangler-deploy-args.mjs";

describe("wranglerDeployArgs", () => {
  it("tags the deployment with the source commit when one is provided", () => {
    expect(wranglerDeployArgs({ WORKERS_CI_COMMIT_SHA: "abc123" })).toEqual([
      "exec",
      "wrangler",
      "deploy",
      "--config",
      "dist/server/wrangler.json",
      "--tag",
      "abc123",
      "--message",
      "source abc123",
    ]);
  });

  it("passes neither flag for manual deploys", () => {
    const args = wranglerDeployArgs({});
    expect(args).not.toContain("--tag");
    expect(args).not.toContain("--message");
  });
});
