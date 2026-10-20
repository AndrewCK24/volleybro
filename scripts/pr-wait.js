#!/usr/bin/env node
// Waits until a pull request's pinned head is mergeable, or fails closed.
// `gh pr checks --watch --required` can return before the aggregate Verify
// check exists, so this polls the named checks and GitHub's merge state.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

export const REQUIRED_CHECKS = ["Verify", "Vercel"];
const FAILED_STATES = new Set([
  "FAILURE",
  "CANCELLED",
  "ERROR",
  "TIMED_OUT",
  "ACTION_REQUIRED",
  "STARTUP_FAILURE",
]);

export function assessReadiness({ checks, pr, head }) {
  if (pr.state === "MERGED") return { status: "merged" };
  if (pr.state !== "OPEN")
    return { status: "fail", reason: `PR is ${pr.state}` };
  if (pr.headRefOid !== head) {
    return {
      status: "fail",
      reason: `head moved from ${head} to ${pr.headRefOid}`,
    };
  }
  for (const name of REQUIRED_CHECKS) {
    const check = checks.find((c) => c.name === name);
    if (check && FAILED_STATES.has(check.state)) {
      return { status: "fail", reason: `${name} is ${check.state}` };
    }
  }
  if (pr.mergeStateStatus === "BEHIND") {
    return {
      status: "fail",
      reason: "branch is behind its base: merge origin/main, push and rerun",
    };
  }
  if (pr.mergeStateStatus === "DIRTY") {
    return { status: "fail", reason: "merge conflicts with its base" };
  }
  const pending = REQUIRED_CHECKS.filter(
    (name) => checks.find((c) => c.name === name)?.state !== "SUCCESS",
  );
  if (pending.length > 0) {
    return { status: "wait", reason: `waiting for ${pending.join(", ")}` };
  }
  if (pr.mergeStateStatus !== "CLEAN") {
    return { status: "wait", reason: `merge state is ${pr.mergeStateStatus}` };
  }
  return { status: "ready" };
}

async function ghJson(args) {
  try {
    return JSON.parse((await execFileAsync("gh", args)).stdout);
  } catch (error) {
    // `gh pr checks` exits non-zero while checks are pending or failing but
    // still prints the JSON.
    if (error.stdout) return JSON.parse(error.stdout);
    throw error;
  }
}

function readPr(number) {
  return ghJson([
    "pr",
    "view",
    number,
    "--json",
    "state,headRefOid,mergeStateStatus",
  ]);
}

function readChecks(number) {
  return ghJson(["pr", "checks", number, "--json", "name,state"]);
}

function option(argv, name, fallback) {
  const index = argv.indexOf(name);
  return index === -1 ? fallback : argv[index + 1];
}

async function main() {
  const argv = process.argv.slice(2);
  const number = argv[0];
  if (!number || number.startsWith("--")) {
    console.error(
      "usage: pnpm pr:wait <number> [--head <sha>] [--interval <s>] [--timeout <s>]",
    );
    process.exit(2);
  }
  const interval = Number(option(argv, "--interval", "30")) * 1000;
  const deadline =
    Date.now() + Number(option(argv, "--timeout", "1800")) * 1000;
  const head = option(argv, "--head", (await readPr(number)).headRefOid);
  console.log(`PR #${number} head ${head}`);

  let last = "";
  for (;;) {
    const [pr, checks] = await Promise.all([
      readPr(number),
      readChecks(number),
    ]);
    const result = assessReadiness({ checks, pr, head });
    if (result.status === "ready" || result.status === "merged") {
      console.log(`${result.status}: ${head}`);
      return;
    }
    if (result.status === "fail") {
      console.error(`not mergeable: ${result.reason}`);
      process.exit(1);
    }
    if (result.reason !== last) console.log(result.reason);
    last = result.reason;
    if (Date.now() > deadline) {
      console.error(`timed out: ${result.reason}`);
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
