import assert from "node:assert/strict";
import test from "node:test";

import { assessReadiness } from "../pr-wait.js";

const head = "abc123";
const open = { state: "OPEN", headRefOid: head, mergeStateStatus: "CLEAN" };
const passing = [
  { name: "Verify", state: "SUCCESS" },
  { name: "Vercel", state: "SUCCESS" },
  { name: "Chromatic", state: "PENDING" },
];

test("ready once Verify and Vercel pass on the pinned head and GitHub reports CLEAN", () => {
  assert.deepEqual(assessReadiness({ checks: passing, pr: open, head }), {
    status: "ready",
  });
});

test("waits while the aggregate Verify check does not exist yet", () => {
  const checks = [{ name: "Vercel", state: "SUCCESS" }];
  const result = assessReadiness({ checks, pr: open, head });
  assert.equal(result.status, "wait");
  assert.match(result.reason, /Verify/);
});

test("waits for GitHub to settle the merge state after checks pass", () => {
  const pr = { ...open, mergeStateStatus: "UNKNOWN" };
  assert.equal(assessReadiness({ checks: passing, pr, head }).status, "wait");
});

test("fails closed when a required check fails or is cancelled", () => {
  for (const state of ["FAILURE", "CANCELLED"]) {
    const checks = [{ name: "Verify", state }];
    const result = assessReadiness({ checks, pr: open, head });
    assert.equal(result.status, "fail");
    assert.match(result.reason, new RegExp(`Verify is ${state}`));
  }
});

test("fails closed when the head moves away from the pinned revision", () => {
  const pr = { ...open, headRefOid: "def456" };
  const result = assessReadiness({ checks: passing, pr, head });
  assert.equal(result.status, "fail");
  assert.match(result.reason, /head moved/);
});

test("a branch behind main fails with the step that unblocks it", () => {
  const pr = { ...open, mergeStateStatus: "BEHIND" };
  const result = assessReadiness({ checks: passing, pr, head });
  assert.equal(result.status, "fail");
  assert.match(result.reason, /merge origin\/main/);
});

test("a merged pull request needs no wait", () => {
  const pr = { ...open, state: "MERGED" };
  assert.equal(assessReadiness({ checks: [], pr, head }).status, "merged");
});
