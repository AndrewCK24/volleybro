import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { resolveScopeBase } from "../git-scope.js";

const execFileAsync = promisify(execFile);

test("scope follows the remote default through cutover and falls back to main", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "scope-base-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (args) => execFileAsync("git", args, { cwd: root });
  await git(["init", "-q", "-b", "main"]);
  await git(["config", "user.email", "test@example.com"]);
  await git(["config", "user.name", "Test"]);
  await writeFile(path.join(root, "README.md"), "init\n");
  await git(["add", "-A"]);
  await git(["commit", "-q", "-m", "init"]);
  await git(["update-ref", "refs/remotes/origin/dev", "HEAD"]);
  await git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
  await git([
    "symbolic-ref",
    "refs/remotes/origin/HEAD",
    "refs/remotes/origin/dev",
  ]);
  assert.equal(await resolveScopeBase(root), "origin/dev");
  await git([
    "symbolic-ref",
    "refs/remotes/origin/HEAD",
    "refs/remotes/origin/main",
  ]);
  assert.equal(await resolveScopeBase(root), "origin/main");
  await git(["symbolic-ref", "--delete", "refs/remotes/origin/HEAD"]);
  assert.equal(await resolveScopeBase(root), "origin/main");
  await git(["update-ref", "-d", "refs/remotes/origin/main"]);
  assert.equal(await resolveScopeBase(root), "main");
});
