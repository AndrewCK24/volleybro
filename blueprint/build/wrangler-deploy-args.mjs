/** Wrangler deploy arguments; tags the version with its source commit when Workers Builds provides one. */
export function wranglerDeployArgs(env) {
  const sha = env.WORKERS_CI_COMMIT_SHA;
  return [
    "exec",
    "wrangler",
    "deploy",
    "--config",
    "dist/server/wrangler.json",
    ...(sha ? ["--tag", sha, "--message", `source ${sha}`] : []),
  ];
}
