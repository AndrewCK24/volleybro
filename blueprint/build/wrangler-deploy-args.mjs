import { execFileSync } from "node:child_process";

const FULL_SHA = /^[0-9a-f]{40}$/;

function checkedOutSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
}

/**
 * Wrangler deploy arguments; tags the version with its source commit.
 * Deploy-hook builds report the branch name in WORKERS_CI_COMMIT_SHA, so only a full SHA is trusted
 * and the checked-out commit is the fallback.
 */
export function wranglerDeployArgs(env, gitSha = checkedOutSha) {
  const sha = [env.WORKERS_CI_COMMIT_SHA, gitSha()].find((value) =>
    FULL_SHA.test(value ?? ""),
  );
  return [
    "exec",
    "wrangler",
    "deploy",
    "--config",
    "dist/server/wrangler.json",
    ...(sha ? ["--tag", sha, "--message", `source ${sha}`] : []),
  ];
}
