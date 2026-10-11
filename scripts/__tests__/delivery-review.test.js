import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
const CANDIDATE_MARKER = "<!-- volleybro-g2-candidate -->";
const REVIEWER = { login: "andrewck24", type: "User" };
const SHA_A = "a".repeat(40);
const SHA_B = "b".repeat(40);
const SPEC_HASH = "c".repeat(64);
const CLI = fileURLToPath(new URL("../delivery-review.js", import.meta.url));

function candidate(overrides = {}) {
  return {
    schemaVersion: 1,
    repository: "owner/repo",
    pullRequest: 12,
    headSha: SHA_A,
    baseSha: SHA_B,
    snapshotUrl: "https://linear.app/team/doc",
    specHash: SPEC_HASH,
    change: "pr-based-blueprint-workflow",
    publishedBy: "andrewck24",
    ...overrides,
  };
}

function comment(body, overrides = {}) {
  return {
    user: REVIEWER,
    body,
    created_at: "2026-10-10T10:00:00Z",
    updated_at: "2026-10-10T10:00:00Z",
    ...overrides,
  };
}

const FAKE_GH = `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
const [command, ...args] = process.argv.slice(2);
const statePath = process.env.GH_FIXTURE;
const state = JSON.parse(readFileSync(statePath, "utf8"));
const save = () => writeFileSync(statePath, JSON.stringify(state));
const emit = (value) => process.stdout.write(JSON.stringify(value));
if (command === "api") {
  const path = args[0].replace("repos/owner/repo/", "");
  if (path === "issues/12/comments" && args.includes("POST")) {
    const body = args.find((arg) => arg.startsWith("body=")).slice(5);
    state.comments.push({ id: 99, user: { login: "github-actions[bot]", type: "Bot" }, body, created_at: "2026-10-11T10:02:00Z", updated_at: "2026-10-11T10:02:00Z" });
    save(); emit(state.comments.at(-1));
  } else if (path === "issues/12/comments") emit([state.comments]);
  else if (path === "pulls/12") emit(state.nativePr);
  else if (path === "actions/workflows/ci.yml") emit({ id: 5, path: ".github/workflows/ci.yml" });
  else if (path.startsWith("actions/workflows/5/runs")) emit([{ total_count: state.ciRuns.length, workflow_runs: state.ciRuns }]);
  else if (path === "actions/runs/888/jobs?filter=latest&per_page=100") emit({ total_count: 1, jobs: state.ciJobs });
  else if (path === "actions/workflows/delivery-review.yml") emit({ id: 6, path: ".github/workflows/delivery-review.yml" });
  else if (path.startsWith("actions/workflows/6/runs")) emit([{ total_count: state.deliveryRuns.length, workflow_runs: state.deliveryRuns }]);
  else if (/^actions\\/runs\\/777\\/attempts\\/\\d+$/.test(path)) {
    const attempt = path.split("/").at(-1);
    emit(state.deliveryAttempts?.[attempt] || state.deliveryRun);
  }
  else if (/^actions\\/runs\\/777\\/attempts\\/\\d+\\/jobs\\?filter=latest&per_page=100$/.test(path)) {
    const attempt = path.split("/")[4];
    emit({ total_count: 1, jobs: state.deliveryAttemptJobs?.[attempt] || state.deliveryJobs });
  }
  else if (path === "actions/runs/777/artifacts?per_page=100") emit({ total_count: state.artifacts.length, artifacts: state.artifacts });
  else if (path.startsWith("commits/") && path.includes("/check-runs")) {
    if (state.prMutationDuringChecks) {
      Object.assign(state.prView, state.prMutationDuringChecks.prView);
      Object.assign(state.nativePr, state.prMutationDuringChecks.nativePr);
      state.prMutationDuringChecks = null;
      save();
    }
    if (state.republishDuringChecks) {
      state.comments.push(state.republishDuringChecks);
      state.republishDuringChecks = null;
      save();
    }
    if (state.advanceBaseDuringChecks) {
      state.nativePr.base.sha = "e".repeat(40);
      state.prView.baseRefOid = "e".repeat(40);
      state.advanceBaseDuringChecks = false;
      save();
    }
    emit([{ total_count: state.checkRuns.length, check_runs: state.checkRuns }]);
  }
  else if (path.startsWith("commits/") && path.includes("/statuses")) emit([state.statuses]);
  else if (path.startsWith("commits/")) emit({ parents: [{ sha: "b".repeat(40) }, { sha: state.nativePr.head.sha }] });
  else if (path === "actions/runs/777") emit(state.actionRun);
  else { process.stderr.write("unknown API: " + path); process.exitCode = 2; }
} else if (command === "pr" && args[0] === "view") emit(state.prView);
else if (command === "pr" && args[0] === "merge") {
  if (state.failMerge) { process.stderr.write("merge rejected"); process.exitCode = 1; }
  else {
    state.mergeCount = (state.mergeCount || 0) + 1;
    state.prView.state = "MERGED";
    state.prView.mergedAt = "2026-10-11T10:01:00Z";
    state.prView.mergeCommit = { oid: "f".repeat(40) };
    state.nativePr.merged = true;
    state.nativePr.merged_at = state.prView.mergedAt;
    state.nativePr.merge_commit_sha = state.prView.mergeCommit.oid;
    state.nativePr.merged_by = { login: "github-actions[bot]", type: "Bot" };
    state.nativePr.base.sha = state.prView.mergeCommit.oid;
    if (state.prMutationOnMerge) {
      Object.assign(state.prView, state.prMutationOnMerge.prView);
      Object.assign(state.nativePr, state.prMutationOnMerge.nativePr);
    }
    save();
    process.stdout.write("merged");
  }
} else { process.stderr.write("unknown command"); process.exitCode = 2; }
`;

async function eventFixture(
  t,
  {
    candidateHead = SHA_A,
    candidateRepository = "owner/repo",
    fork = false,
    failMerge = false,
    advanceBaseDuringChecks = false,
    ciRunOverrides = {},
    ciJobOverrides = {},
  } = {},
) {
  const root = await mkdtemp(path.join(os.tmpdir(), "delivery-review-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const bin = path.join(root, "bin");
  await mkdir(bin);
  const gh = path.join(bin, "gh");
  await writeFile(gh, FAKE_GH);
  await chmod(gh, 0o755);
  const fetchPreload = path.join(root, "fetch-fixture.mjs");
  await writeFile(
    fetchPreload,
    `import { readFile } from "node:fs/promises";
globalThis.fetch = async (url, options) => {
  if (url !== "https://api.github.com/repos/owner/repo/actions/artifacts/99/zip") throw new Error("unexpected URL");
  if (options.headers.Authorization !== "Bearer fixture-token") throw new Error("missing fixture auth");
  return new Response(await readFile(process.env.G2_FIXTURE_ARCHIVE), { status: 200 });
};\n`,
  );
  const acceptedAt = "2026-10-11T10:00:00Z";
  const currentCandidate = candidate({
    headSha: candidateHead,
    repository: candidateRepository,
  });
  const statePath = path.join(root, "state.json");
  const state = {
    failMerge,
    advanceBaseDuringChecks,
    mergeCount: 0,
    comments: [
      comment(`${CANDIDATE_MARKER}\n${JSON.stringify(currentCandidate)}`, {
        id: 10,
        created_at: "2026-10-11T09:00:00Z",
        updated_at: "2026-10-11T09:00:00Z",
      }),
      comment("LGTM", {
        id: 20,
        created_at: acceptedAt,
        updated_at: acceptedAt,
      }),
    ],
    prView: {
      number: 12,
      state: "OPEN",
      isDraft: false,
      mergedAt: null,
      mergeCommit: null,
      headRefOid: SHA_A,
      headRefName: "feat/test",
      baseRefName: "main",
      baseRefOid: SHA_B,
      mergeStateStatus: "CLEAN",
      url: "https://github.com/owner/repo/pull/12",
    },
    nativePr: {
      merged: false,
      merged_at: null,
      merged_by: null,
      merge_commit_sha: null,
      base: { ref: "main", sha: SHA_B, repo: { full_name: "owner/repo" } },
      head: {
        sha: SHA_A,
        repo: { full_name: fork ? "other/repo" : "owner/repo" },
      },
    },
    checkRuns: [
      {
        id: 50,
        name: "Verify",
        head_sha: SHA_A,
        app: { id: 15368 },
        status: "completed",
        conclusion: "success",
        started_at: "2026-10-11T09:30:00Z",
      },
    ],
    ciRuns: [
      {
        id: 888,
        workflow_id: 5,
        run_number: 4,
        run_attempt: 1,
        event: "pull_request",
        status: "completed",
        conclusion: "success",
        head_sha: SHA_A,
        repository: { full_name: "owner/repo" },
        head_repository: { full_name: "owner/repo" },
        ...ciRunOverrides,
      },
    ],
    ciJobs: [
      {
        name: "Verify",
        run_attempt: 1,
        status: "completed",
        conclusion: "success",
        check_run_url: "https://api.github.com/repos/owner/repo/check-runs/50",
        ...ciJobOverrides,
      },
    ],
    deliveryRuns: [],
    deliveryRun: {
      id: 777,
      workflow_id: 6,
      run_attempt: 1,
      event: "issue_comment",
      status: "completed",
      conclusion: "failure",
      head_sha: SHA_A,
      head_branch: "main",
      path: ".github/workflows/delivery-review.yml@refs/heads/main",
      repository: { full_name: "owner/repo" },
      head_repository: { full_name: "owner/repo" },
    },
    deliveryJobs: [
      { name: "record-or-merge", status: "completed", conclusion: "failure" },
    ],
    artifacts: [],
    statuses: [
      {
        context: "Vercel",
        url: "https://api.github.com/repos/owner/repo/statuses/" + SHA_A,
        creator: { id: 35613825, login: "vercel[bot]", type: "Bot" },
        state: "success",
        updated_at: "2026-10-11T09:30:00Z",
      },
    ],
    actionRun: {
      id: 777,
      repository: { full_name: "owner/repo" },
      event: "issue_comment",
      status: "completed",
      conclusion: "success",
      path: ".github/workflows/delivery-review.yml@refs/heads/main",
    },
  };
  await writeFile(statePath, JSON.stringify(state));
  const eventPath = path.join(root, "event.json");
  await writeFile(
    eventPath,
    JSON.stringify({
      action: "created",
      issue: {
        number: 12,
        pull_request: {
          url: "https://api.github.com/repos/owner/repo/pulls/12",
        },
      },
      comment: { ...state.comments[1], user: REVIEWER },
      repository: { full_name: "owner/repo", default_branch: "main" },
    }),
  );
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    GH_FIXTURE: statePath,
    DELIVERY_REVIEW_ENABLED: "true",
    DELIVERY_REVIEWER_LOGIN: "andrewck24",
    GITHUB_REPOSITORY: "owner/repo",
    GITHUB_EVENT_NAME: "issue_comment",
    GITHUB_EVENT_PATH: eventPath,
    GITHUB_RUN_ID: "777",
    GH_TOKEN: "fixture-token",
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_WORKFLOW_SHA: SHA_A,
    RUNNER_TEMP: root,
    NODE_OPTIONS: `--import=${pathToFileURL(fetchPreload).href}`,
    GITHUB_SERVER_URL: "https://github.com",
  };
  return {
    root,
    env,
    eventPath,
    state: async () => JSON.parse(await readFile(statePath, "utf8")),
    writeState: async (value) => writeFile(statePath, JSON.stringify(value)),
    writeEvent: async (value) => writeFile(eventPath, JSON.stringify(value)),
    run: (archivePath) =>
      spawnSync(process.execPath, [CLI, "event"], {
        env: {
          ...env,
          ...(archivePath ? { G2_FIXTURE_ARCHIVE: archivePath } : {}),
        },
        encoding: "utf8",
      }),
  };
}

async function installEvidenceArtifact(fixture, mutate = () => {}) {
  const state = await fixture.state();
  const evidencePath = path.join(fixture.root, "delivery-review-evidence.json");
  const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
  mutate(evidence);
  await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  const archivePath = path.join(fixture.root, "evidence.zip");
  await rm(archivePath, { force: true });
  execFileSync("zip", ["-q", archivePath, "delivery-review-evidence.json"], {
    cwd: fixture.root,
  });
  const archive = await readFile(archivePath);
  state.deliveryRuns = [state.deliveryRun];
  state.artifacts = [
    {
      id: 99,
      name: "delivery-review-evidence-1",
      expired: false,
      workflow_run: {
        id: 777,
        head_sha: SHA_A,
        event: "issue_comment",
      },
      digest: `sha256:${createHash("sha256").update(archive).digest("hex")}`,
      archive_download_url:
        "https://api.github.com/repos/owner/repo/actions/artifacts/99/zip",
    },
  ];
  await fixture.writeState(state);
  return archive;
}

test("event CLI accepts only configured-human exact LGTM comments", async (t) => {
  for (const mutate of [
    (event) => {
      event.comment.body = "lgtm";
    },
    (event) => {
      event.comment.body = "LGTM, merge";
    },
    (event) => {
      event.comment.user = { login: "andrewck24", type: "Bot" };
    },
  ]) {
    const fixture = await eventFixture(t);
    const event = JSON.parse(await readFile(fixture.eventPath, "utf8"));
    mutate(event);
    await fixture.writeEvent(event);
    const result = fixture.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal((await fixture.state()).mergeCount, 0);
  }

  const fixture = await eventFixture(t);
  const event = JSON.parse(await readFile(fixture.eventPath, "utf8"));
  event.comment.body = " LGTM\n";
  await fixture.writeEvent(event);
  const result = fixture.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal((await fixture.state()).mergeCount, 1);
});

test("event CLI binds LGTM to the newest unchanged candidate and rechecks before merge", async (t) => {
  const newer = await eventFixture(t);
  const newerState = await newer.state();
  const newerCandidate = candidate({ change: "newest-review-candidate" });
  newerState.comments.push(
    comment(`${CANDIDATE_MARKER}\n${JSON.stringify(newerCandidate)}`, {
      id: 15,
      created_at: "2026-10-11T09:45:00Z",
      updated_at: "2026-10-11T09:45:00Z",
    }),
  );
  await newer.writeState(newerState);
  const newerResult = newer.run();
  assert.equal(newerResult.status, 0, newerResult.stderr);
  const newerReceipt = (await newer.state()).comments.find((item) =>
    item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  assert.equal(
    JSON.parse(newerReceipt.body.split("\n").slice(1).join("\n"))
      .candidateCommentId,
    "15",
  );

  const edited = await eventFixture(t);
  const editedState = await edited.state();
  editedState.comments[0].body = `${CANDIDATE_MARKER}\n${JSON.stringify(candidate({ change: "edited-after-lgtm" }))}`;
  editedState.comments[0].updated_at = "2026-10-11T10:00:00Z";
  await edited.writeState(editedState);
  const editedResult = edited.run();
  assert.notEqual(editedResult.status, 0);
  assert.equal((await edited.state()).mergeCount, 0);

  const republished = await eventFixture(t);
  const republishedState = await republished.state();
  republishedState.republishDuringChecks = {
    ...comment(
      `${CANDIDATE_MARKER}\n${JSON.stringify(candidate({ specHash: "d".repeat(64) }))}`,
      { id: 30 },
    ),
    created_at: "2026-10-11T10:00:00Z",
    updated_at: "2026-10-11T10:00:00Z",
  };
  await republished.writeState(republishedState);
  const republishedResult = republished.run();
  assert.notEqual(republishedResult.status, 0);
  assert.equal((await republished.state()).mergeCount, 0);
});

test("event rejects PR context changes during checks before requesting merge", async (t) => {
  const scenarios = [
    {
      name: "target branch at the same base SHA",
      change: (state) => ({
        prView: { baseRefName: "other" },
        nativePr: { base: { ...state.nativePr.base, ref: "other" } },
      }),
    },
    {
      name: "draft",
      change: () => ({ prView: { isDraft: true }, nativePr: { draft: true } }),
    },
    {
      name: "head repository",
      change: (state) => ({
        nativePr: {
          head: { ...state.nativePr.head, repo: { full_name: "other/repo" } },
        },
      }),
    },
    {
      name: "merge readiness",
      change: () => ({ prView: { mergeStateStatus: "BLOCKED" } }),
    },
  ];
  for (const scenario of scenarios) {
    const fixture = await eventFixture(t);
    const state = await fixture.state();
    state.prMutationDuringChecks = scenario.change(state);
    await fixture.writeState(state);
    const result = fixture.run();
    assert.notEqual(result.status, 0, scenario.name);
    assert.match(result.stderr, /PR context, head or observed base changed/);
    const after = await fixture.state();
    assert.equal(after.mergeCount, 0, scenario.name);
    assert.equal(after.comments.length, 2, scenario.name);
  }
});

test("event refuses to certify or recover a merge on a different target branch", async (t) => {
  const fixture = await eventFixture(t);
  const state = await fixture.state();
  state.prMutationOnMerge = {
    prView: { baseRefName: "other" },
    nativePr: { base: { ...state.nativePr.base, ref: "other" } },
  };
  await fixture.writeState(state);
  const result = fixture.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /did not confirm merge/);
  const after = await fixture.state();
  assert.equal(after.mergeCount, 1);
  assert.equal(after.comments.length, 2);

  const retry = fixture.run();
  assert.notEqual(retry.status, 0);
  assert.match(retry.stderr, /same-repository pull request targeting main/);
  assert.equal((await fixture.state()).comments.length, 2);
});

test("event merges exact head and recovers a missing receipt from its digest-bound run artifact", async (t) => {
  const fixture = await eventFixture(t);
  const first = fixture.run();
  assert.equal(first.status, 0, first.stderr);
  let state = await fixture.state();
  assert.equal(state.mergeCount, 1);
  const receipt = JSON.parse(
    state.comments.at(-1).body.slice("<!-- volleybro-g2-receipt -->\n".length),
  );
  assert.equal(receipt.pullRequest, 12);
  assert.equal(receipt.headSha, SHA_A);
  assert.equal(receipt.acceptedCommentId, "20");
  assert.equal(receipt.eventId, "issue_comment:20");
  assert.equal(receipt.mergeCommit, "f".repeat(40));

  await installEvidenceArtifact(fixture);
  state = await fixture.state();
  state.comments = state.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await fixture.writeState(state);
  const retry = fixture.run(path.join(fixture.root, "evidence.zip"));
  assert.equal(retry.status, 0, retry.stderr);
  state = await fixture.state();
  assert.equal(state.mergeCount, 1);
  assert.equal(
    state.comments.filter((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ).length,
    1,
  );
});

test("recovery searches completed historical attempts after an in-progress or failed rerun", async (t) => {
  for (const currentStatus of ["in_progress", "completed"]) {
    const fixture = await eventFixture(t);
    const first = fixture.run();
    assert.equal(first.status, 0, first.stderr);
    await installEvidenceArtifact(fixture);
    const state = await fixture.state();
    state.comments = state.comments.filter(
      (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    );
    state.deliveryRuns = [
      {
        ...state.deliveryRun,
        run_attempt: 2,
        status: currentStatus,
        conclusion: currentStatus === "completed" ? "failure" : null,
      },
    ];
    state.deliveryAttempts = {
      1: state.deliveryRun,
      2: {
        ...state.deliveryRun,
        run_attempt: 2,
        status: currentStatus,
        conclusion: currentStatus === "completed" ? "failure" : null,
      },
    };
    state.deliveryAttemptJobs = {
      1: state.deliveryJobs,
      2: [
        { name: "record-or-merge", status: "completed", conclusion: "failure" },
      ],
    };
    await fixture.writeState(state);

    fixture.env.GITHUB_RUN_ATTEMPT = "2";
    const retry = fixture.run(path.join(fixture.root, "evidence.zip"));
    assert.equal(retry.status, 0, retry.stderr);
    const recovered = await fixture.state();
    assert.equal(recovered.mergeCount, 1);
    assert.equal(
      recovered.comments.filter((item) =>
        item.body.startsWith("<!-- volleybro-g2-receipt -->"),
      ).length,
      1,
    );
  }
});

test("missing receipt fails closed on wrong digest, PR, run, or attempt evidence", async (t) => {
  const fixture = await eventFixture(t);
  const first = fixture.run();
  assert.equal(first.status, 0, first.stderr);
  let state = await fixture.state();
  state.comments = state.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await fixture.writeState(state);
  await installEvidenceArtifact(fixture);
  state = await fixture.state();
  state.artifacts[0].digest = `sha256:${"0".repeat(64)}`;
  await fixture.writeState(state);
  const digestRetry = fixture.run(path.join(fixture.root, "evidence.zip"));
  assert.notEqual(digestRetry.status, 0);
  state = await fixture.state();
  assert.equal(state.mergeCount, 1);
  assert.equal(
    state.comments.some((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ),
    false,
  );

  const prFixture = await eventFixture(t);
  const prFirst = prFixture.run();
  assert.equal(prFirst.status, 0, prFirst.stderr);
  let prState = await prFixture.state();
  prState.comments = prState.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await prFixture.writeState(prState);
  await installEvidenceArtifact(prFixture, (evidence) => {
    evidence.pullRequest = 999;
  });
  const prRetry = prFixture.run(path.join(prFixture.root, "evidence.zip"));
  assert.notEqual(prRetry.status, 0);
  prState = await prFixture.state();
  assert.equal(prState.mergeCount, 1);
  assert.equal(
    prState.comments.some((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ),
    false,
  );

  const attemptFixture = await eventFixture(t);
  const attemptFirst = attemptFixture.run();
  assert.equal(attemptFirst.status, 0, attemptFirst.stderr);
  let attemptState = await attemptFixture.state();
  attemptState.comments = attemptState.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await attemptFixture.writeState(attemptState);
  await installEvidenceArtifact(attemptFixture, (evidence) => {
    evidence.runAttempt = 2;
  });
  const attemptRetry = attemptFixture.run(
    path.join(attemptFixture.root, "evidence.zip"),
  );
  assert.notEqual(attemptRetry.status, 0);
  attemptState = await attemptFixture.state();
  assert.equal(attemptState.mergeCount, 1);
  assert.equal(
    attemptState.comments.some((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ),
    false,
  );

  const runFixture = await eventFixture(t);
  const runFirst = runFixture.run();
  assert.equal(runFirst.status, 0, runFirst.stderr);
  let runState = await runFixture.state();
  runState.comments = runState.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await runFixture.writeState(runState);
  await installEvidenceArtifact(runFixture);
  runState = await runFixture.state();
  runState.deliveryRun.workflow_id = 7;
  runState.deliveryRuns = [runState.deliveryRun];
  await runFixture.writeState(runState);
  const runRetry = runFixture.run(path.join(runFixture.root, "evidence.zip"));
  assert.notEqual(runRetry.status, 0);
  runState = await runFixture.state();
  assert.equal(runState.mergeCount, 1);
  assert.equal(
    runState.comments.some((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ),
    false,
  );

  const expiredFixture = await eventFixture(t);
  const expiredFirst = expiredFixture.run();
  assert.equal(expiredFirst.status, 0, expiredFirst.stderr);
  let expiredState = await expiredFixture.state();
  expiredState.comments = expiredState.comments.filter(
    (item) => !item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  await expiredFixture.writeState(expiredState);
  await installEvidenceArtifact(expiredFixture);
  expiredState = await expiredFixture.state();
  expiredState.artifacts[0].expired = true;
  await expiredFixture.writeState(expiredState);
  const expiredRetry = expiredFixture.run(
    path.join(expiredFixture.root, "evidence.zip"),
  );
  assert.notEqual(expiredRetry.status, 0);
  expiredState = await expiredFixture.state();
  assert.equal(expiredState.mergeCount, 1);
  assert.equal(
    expiredState.comments.some((item) =>
      item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ),
    false,
  );
});

test("changed head, fork and native merge failure fail closed without a receipt", async (t) => {
  for (const options of [
    { candidateHead: "d".repeat(40) },
    { candidateRepository: "other/repo" },
    { fork: true },
    { failMerge: true },
    { advanceBaseDuringChecks: true },
  ]) {
    const fixture = await eventFixture(t, options);
    const result = fixture.run();
    assert.notEqual(result.status, 0);
    const state = await fixture.state();
    assert.equal(state.mergeCount, 0);
    assert.equal(
      state.comments.some((item) =>
        item.body.startsWith("<!-- volleybro-g2-receipt -->"),
      ),
      false,
    );
  }
});

test("Verify must come from the latest successful exact-head CI aggregate job", async (t) => {
  for (const overrides of [
    { ciRunOverrides: { workflow_id: 999 } },
    { ciRunOverrides: { conclusion: "failure" } },
    {
      ciJobOverrides: {
        check_run_url: "https://api.github.com/repos/owner/repo/check-runs/51",
      },
    },
  ]) {
    const fixture = await eventFixture(t, overrides);
    const result = fixture.run();
    assert.notEqual(result.status, 0);
    assert.equal((await fixture.state()).mergeCount, 0);
  }
});

test("an untrusted matching receipt marker cannot suppress the bot receipt", async (t) => {
  const fixture = await eventFixture(t);
  const state = await fixture.state();
  state.comments.push(
    comment(
      "<!-- volleybro-g2-receipt -->\n" +
        JSON.stringify({
          eventId: "issue_comment:20",
          kind: "G2_ACCEPTED_AND_MERGED",
          headSha: SHA_A,
        }),
      { id: 21, user: { login: "attacker", type: "User" } },
    ),
  );
  await fixture.writeState(state);
  const result = fixture.run();
  assert.equal(result.status, 0, result.stderr);
  const updated = await fixture.state();
  assert.equal(updated.mergeCount, 1);
  assert.equal(
    updated.comments.filter(
      (item) =>
        item.user?.login === "github-actions[bot]" &&
        item.body.startsWith("<!-- volleybro-g2-receipt -->"),
    ).length,
    1,
  );
});

async function directHumanMergeFixture(t) {
  const fixture = await eventFixture(t);
  const repo = path.join(fixture.root, "checkout");
  await mkdir(repo);
  const git = (args) =>
    execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
  git(["init", "-b", "feat/test"]);
  git(["config", "user.name", "Fixture"]);
  git(["config", "user.email", "fixture@example.invalid"]);
  await writeFile(path.join(repo, "tracked.txt"), "fixture\n");
  git(["add", "tracked.txt"]);
  git(["commit", "-m", "fixture"]);
  const localHead = git(["rev-parse", "HEAD"]);
  git(["remote", "add", "origin", "https://github.com/owner/repo.git"]);

  const state = await fixture.state();
  state.prView.state = "MERGED";
  state.prView.headRefOid = localHead;
  state.prView.mergedAt = "2026-10-11T10:01:00Z";
  state.prView.mergeCommit = { oid: "f".repeat(40) };
  state.nativePr.merged = true;
  state.nativePr.merged_at = state.prView.mergedAt;
  state.nativePr.merged_by = { login: "andrewck24", type: "User" };
  state.nativePr.merge_commit_sha = state.prView.mergeCommit.oid;
  state.nativePr.head.sha = localHead;
  state.nativePr.base.sha = SHA_B;
  const directCandidate = candidate({ headSha: localHead, baseSha: SHA_B });
  state.comments[0].body = `${CANDIDATE_MARKER}\n${JSON.stringify(directCandidate)}`;
  await fixture.writeState(state);

  return { fixture, repo, git, localHead };
}

test("reconcile allows a verified direct human merge without a receipt and never mutates", async (t) => {
  const { fixture, repo, git } = await directHumanMergeFixture(t);
  const before = git(["status", "--porcelain"]);
  const result = spawnSync(process.execPath, [CLI, "reconcile", "--pr", "12"], {
    cwd: repo,
    env: fixture.env,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mergeVerified, true);
  assert.equal(JSON.parse(result.stdout).cleanupEligible, false);
  assert.equal(JSON.parse(result.stdout).ownershipVerificationRequired, true);
  assert.equal(git(["status", "--porcelain"]), before);
  assert.equal((await fixture.state()).comments.length, 2);
});

test("reconcile independently rejects wrong remote, OPEN PR, and mismatched PR head", async (t) => {
  const scenarios = [
    {
      name: "remote",
      apply: async ({ git }) =>
        git([
          "remote",
          "set-url",
          "origin",
          "https://github.com/unrelated/repo.git",
        ]),
      resultKey: "repositoryMatches",
    },
    {
      name: "OPEN PR",
      apply: async ({ fixture }) => {
        const state = await fixture.state();
        state.prView.state = "OPEN";
        await fixture.writeState(state);
      },
      resultKey: "merged",
    },
    {
      name: "PR head",
      apply: async ({ fixture }) => {
        const state = await fixture.state();
        state.prView.headRefOid = "d".repeat(40);
        await fixture.writeState(state);
      },
      resultKey: "shaMatches",
    },
  ];
  for (const scenario of scenarios) {
    const context = await directHumanMergeFixture(t);
    await scenario.apply(context);
    const result = spawnSync(
      process.execPath,
      [CLI, "reconcile", "--pr", "12"],
      {
        cwd: context.repo,
        env: context.fixture.env,
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, `${scenario.name}: ${result.stderr}`);
    const status = JSON.parse(result.stdout);
    assert.equal(status[scenario.resultKey], false, scenario.name);
    assert.equal(status.mergeVerified, false, scenario.name);
    assert.equal(status.cleanupEligible, false, scenario.name);
  }
});

test("merged event records direct human acceptance after trusted native read-back", async (t) => {
  const fixture = await eventFixture(t);
  const state = await fixture.state();
  state.prView.state = "MERGED";
  state.prView.mergedAt = "2026-10-11T10:01:00Z";
  state.prView.mergeCommit = { oid: "f".repeat(40) };
  state.nativePr.merged = true;
  state.nativePr.merged_at = state.prView.mergedAt;
  state.nativePr.merged_by = { login: "andrewck24", type: "User" };
  state.nativePr.merge_commit_sha = state.prView.mergeCommit.oid;
  await fixture.writeState(state);
  const eventPath = path.join(fixture.root, "merged.json");
  await writeFile(
    eventPath,
    JSON.stringify({
      action: "closed",
      pull_request: {
        number: 12,
        merged: true,
        merged_at: state.prView.mergedAt,
        merged_by: { login: "andrewck24", type: "User" },
        merge_commit_sha: state.prView.mergeCommit.oid,
        head: { sha: SHA_A },
      },
    }),
  );
  const result = spawnSync(process.execPath, [CLI, "event"], {
    env: {
      ...fixture.env,
      GITHUB_EVENT_NAME: "pull_request_target",
      GITHUB_EVENT_PATH: eventPath,
    },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const updated = await fixture.state();
  const receiptComment = updated.comments.find((item) =>
    item.body.startsWith("<!-- volleybro-g2-receipt -->"),
  );
  assert.ok(receiptComment);
  const receipt = JSON.parse(
    receiptComment.body.slice("<!-- volleybro-g2-receipt -->\n".length),
  );
  assert.equal(receipt.event, "pull_request_target");
  assert.equal(receipt.headSha, SHA_A);
});
