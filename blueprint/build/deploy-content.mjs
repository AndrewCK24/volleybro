import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
if (process.argv.length !== 2)
  throw new Error("Content deployment accepts no argument overrides.");
async function run(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  if (code !== 0)
    throw new Error("Content deployment stopped before its next step.");
}
// Each failure stops the pipeline before the matching renderer can be deployed.
await run(process.execPath, ["build/blueprint.mjs", "--remote"]);
await run(process.execPath, ["build/upload-pages.mjs", "--remote"]);
await run("pnpm", [
  "exec",
  "wrangler",
  "deploy",
  "--config",
  "dist/server/wrangler.json",
]);
