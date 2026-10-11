#!/usr/bin/env node
import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { validateRequiredChecks } from "./release-controls.js";

const execFile = promisify(execFileCallback);
const CANDIDATE_MARKER = "<!-- volleybro-g2-candidate -->";
const RECEIPT_MARKER = "<!-- volleybro-g2-receipt -->";
const SHA_PATTERN = /^[0-9a-f]{40}$/;
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const ARTIFACT_DIGEST_PATTERN = /^sha256:([0-9a-f]{64})$/;

function fail(message) {
  throw new Error(message);
}

function exactLgtm(body) {
  return typeof body === "string" && body.trim() === "LGTM";
}

function isAuthorizedAcceptance(comment, reviewer) {
  return (
    comment?.user?.login === reviewer &&
    comment.user.type === "User" &&
    exactLgtm(comment.body) &&
    Date.parse(comment.updated_at) === Date.parse(comment.created_at)
  );
}

function parseMarkedJson(body, marker) {
  if (typeof body !== "string" || !body.startsWith(`${marker}\n`)) return null;
  try {
    return JSON.parse(body.slice(marker.length).trim());
  } catch {
    return null;
  }
}

function compareCommentOrder(a, b, timeKey = "created_at") {
  const timeDelta = Date.parse(a[timeKey]) - Date.parse(b[timeKey]);
  if (timeDelta) return timeDelta;
  try {
    const aId = BigInt(a.id);
    const bId = BigInt(b.id);
    return aId < bId ? -1 : aId > bId ? 1 : 0;
  } catch {
    return String(a.id).localeCompare(String(b.id));
  }
}

function chooseCandidate(comments, reviewer, acceptedAt, acceptedId) {
  const cutoff = Date.parse(acceptedAt);
  if (!Number.isFinite(cutoff)) return null;
  const candidates = comments.filter((comment) => {
    if (comment.user?.login !== reviewer || comment.user?.type !== "User")
      return false;
    const candidate = parseMarkedJson(comment.body, CANDIDATE_MARKER);
    const created = Date.parse(comment.created_at);
    const updated = Date.parse(comment.updated_at);
    return (
      candidate &&
      Number.isFinite(created) &&
      Number.isFinite(updated) &&
      /^[1-9]\d*$/.test(String(comment.id)) &&
      updated >= created
    );
  });
  const beforeAcceptance = (comment, key) => {
    const timestamp = Date.parse(comment[key]);
    if (timestamp !== cutoff) return timestamp < cutoff;
    try {
      return (
        acceptedId !== undefined && BigInt(comment.id) < BigInt(acceptedId)
      );
    } catch {
      return false;
    }
  };
  const latest = [...candidates].sort((a, b) => compareCommentOrder(b, a))[0];
  if (
    latest &&
    ((Date.parse(latest.updated_at) === cutoff &&
      Date.parse(latest.created_at) < cutoff) ||
      !beforeAcceptance(latest, "created_at") ||
      !beforeAcceptance(latest, "updated_at"))
  )
    return null;
  return (
    candidates
      .filter(
        (comment) =>
          beforeAcceptance(comment, "created_at") &&
          beforeAcceptance(comment, "updated_at"),
      )
      .sort((a, b) => compareCommentOrder(b, a))[0] || null
  );
}

function validateCandidate(
  candidate,
  { repository, number, headSha, baseSha, reviewer },
) {
  if (
    candidate?.schemaVersion !== 1 ||
    candidate?.repository !== repository ||
    Number(candidate?.pullRequest) !== Number(number) ||
    candidate?.publishedBy !== reviewer
  )
    fail("Candidate belongs to another repository or pull request");
  if (
    candidate.headSha !== headSha ||
    (baseSha && candidate.baseSha !== baseSha)
  )
    fail("PR head or base changed after the published candidate");
  let snapshotUrl;
  try {
    snapshotUrl = new URL(candidate.snapshotUrl);
  } catch {
    fail("Candidate snapshot URL must be a valid HTTPS URL");
  }
  if (
    !SHA_PATTERN.test(candidate.baseSha || "") ||
    snapshotUrl.protocol !== "https:" ||
    !HASH_PATTERN.test(candidate.specHash || "") ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.change || "")
  )
    fail("Candidate is missing its snapshot URL, spec hash, or Change slug");
  return candidate;
}

async function command(bin, args, options = {}) {
  try {
    const result = await execFile(bin, args, {
      maxBuffer: 8 * 1024 * 1024,
      ...options,
    });
    return result.stdout.trim();
  } catch (error) {
    fail(`${bin} ${args[0]} failed: ${error.stderr?.trim() || error.message}`);
  }
}

function required(name) {
  const value = process.env[name];
  if (!value) fail(`Missing required environment value: ${name}`);
  return value;
}

function safeSha(value, label) {
  if (typeof value !== "string" || !SHA_PATTERN.test(value))
    fail(`${label} must be a full lowercase commit SHA`);
  return value;
}

function repository() {
  return required("GITHUB_REPOSITORY");
}

function remoteMatchesRepository(remote, fullName) {
  const server = new URL(process.env.GITHUB_SERVER_URL || "https://github.com");
  const candidates = [
    `https://${server.host}/${fullName}`,
    `git@${server.host}:${fullName}`,
    `ssh://git@${server.host}/${fullName}`,
  ];
  return candidates.includes(remote.replace(/\.git$/, ""));
}

async function api(path) {
  return JSON.parse(
    await command("gh", ["api", `repos/${repository()}/${path}`]),
  );
}

async function apiAll(path) {
  const pages = JSON.parse(
    await command("gh", [
      "api",
      `repos/${repository()}/${path}`,
      "--paginate",
      "--slurp",
    ]),
  );
  return Array.isArray(pages[0]) ? pages.flat() : pages;
}

async function workflowRuns(path) {
  const pages = await apiAll(path);
  return pages.flatMap((page) => page?.workflow_runs || []);
}

async function saveIntentArtifact(intent) {
  const target = process.env.RUNNER_TEMP;
  if (!target)
    fail("RUNNER_TEMP is required to preserve G2 acceptance evidence");
  await writeFile(
    path.join(target, "delivery-review-evidence.json"),
    `${JSON.stringify(intent, null, 2)}\n`,
    { mode: 0o600 },
  );
}

async function downloadIntentArtifact(run, attempt) {
  const artifactsResponse = await api(
    `actions/runs/${run.id}/artifacts?per_page=100`,
  );
  if (
    !Array.isArray(artifactsResponse.artifacts) ||
    artifactsResponse.total_count > artifactsResponse.artifacts.length
  )
    fail("Workflow artifact inventory is incomplete");
  const artifact = artifactsResponse.artifacts.find(
    (item) => item.name === `delivery-review-evidence-${attempt}`,
  );
  const digest = String(artifact?.digest || "").match(
    ARTIFACT_DIGEST_PATTERN,
  )?.[1];
  const expectedUrl = `https://api.github.com/repos/${repository()}/actions/artifacts/${artifact?.id}/zip`;
  if (
    !artifact ||
    artifact.expired ||
    !digest ||
    artifact.archive_download_url !== expectedUrl ||
    String(artifact.workflow_run?.id) !== String(run.id) ||
    artifact.workflow_run?.head_sha !== run.head_sha
  )
    fail("Trusted G2 run has no valid digest-bound evidence artifact");
  const response = await fetch(expectedUrl, {
    signal: AbortSignal.timeout(30_000),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${required("GH_TOKEN")}`,
    },
  });
  if (!response.ok)
    fail(`G2 evidence download returned HTTP ${response.status}`);
  const archive = Buffer.from(await response.arrayBuffer());
  if (createHash("sha256").update(archive).digest("hex") !== digest)
    fail("G2 evidence artifact digest does not match GitHub metadata");
  const directory = await mkdtemp(
    path.join(tmpdir(), "delivery-review-evidence-"),
  );
  const archivePath = path.join(directory, "evidence.zip");
  try {
    await writeFile(archivePath, archive);
    const entries = (await command("unzip", ["-Z1", archivePath]))
      .split("\n")
      .filter(Boolean);
    if (entries.length !== 1 || entries[0] !== "delivery-review-evidence.json")
      fail("G2 evidence artifact has unexpected contents");
    await command("unzip", ["-q", archivePath, "-d", directory]);
    return {
      artifact,
      evidence: JSON.parse(
        await readFile(path.join(directory, entries[0]), "utf8"),
      ),
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function prView(number) {
  return JSON.parse(
    await command("gh", [
      "pr",
      "view",
      String(number),
      "--repo",
      repository(),
      "--json",
      "number,state,isDraft,mergedAt,mergeCommit,headRefOid,headRefName,baseRefName,baseRefOid,mergeStateStatus,url",
    ]),
  );
}

async function comments(number) {
  return apiAll(`issues/${number}/comments`);
}

async function checksFor(sha) {
  const [checkResponse, statusResponse] = await Promise.all([
    apiAll(`commits/${sha}/check-runs?per_page=100`),
    apiAll(`commits/${sha}/statuses?per_page=100`),
  ]);
  return {
    checkRuns: checkResponse.flatMap((page) => page.check_runs || []),
    statuses: statusResponse,
  };
}

async function mergeParentsMatch(nativePr, baseSha, headSha) {
  if (!nativePr.merge_commit_sha) return false;
  const commit = await api(`commits/${nativePr.merge_commit_sha}`);
  return (
    Array.isArray(commit.parents) &&
    commit.parents.length === 2 &&
    commit.parents[0]?.sha === baseSha &&
    commit.parents[1]?.sha === headSha
  );
}

async function validateTrustedVerify(sha, checkRuns) {
  const workflow = await api("actions/workflows/ci.yml");
  if (workflow.path !== ".github/workflows/ci.yml")
    fail("Expected CI workflow identity is unavailable");
  const runs = await workflowRuns(
    `actions/workflows/${workflow.id}/runs?head_sha=${sha}&per_page=100`,
  );
  const matchingRuns = runs
    .filter(
      (run) =>
        String(run.workflow_id) === String(workflow.id) &&
        run.head_sha === sha &&
        run.event === "pull_request" &&
        run.repository?.full_name === repository() &&
        run.head_repository?.full_name === repository(),
    )
    .sort(
      (a, b) =>
        Number(b.run_number) - Number(a.run_number) ||
        Number(b.run_attempt) - Number(a.run_attempt),
    );
  const latest = matchingRuns[0];
  if (
    !latest ||
    latest.status !== "completed" ||
    latest.conclusion !== "success"
  )
    fail("Latest trusted CI run for this head is not successful");
  const jobResponse = await api(
    `actions/runs/${latest.id}/jobs?filter=latest&per_page=100`,
  );
  if (
    !Array.isArray(jobResponse.jobs) ||
    jobResponse.total_count > jobResponse.jobs.length
  )
    fail("Trusted CI job inventory is incomplete");
  const verifyJobs = jobResponse.jobs.filter(
    (job) =>
      job.name === "Verify" &&
      (!job.run_attempt ||
        String(job.run_attempt) === String(latest.run_attempt)),
  );
  const checkIds = new Set(
    checkRuns
      .filter((check) => check.head_sha === sha)
      .map((check) => String(check.id)),
  );
  const verifyJob = verifyJobs[0];
  const checkId = String(verifyJob?.check_run_url || "").match(
    /\/check-runs\/(\d+)$/,
  )?.[1];
  if (
    verifyJobs.length !== 1 ||
    verifyJob.status !== "completed" ||
    verifyJob.conclusion !== "success" ||
    !checkId ||
    !checkIds.has(checkId)
  )
    fail("Exact-head Verify check is not produced by the trusted CI run");
}

async function postComment(number, body) {
  const repositoryName = repository();
  return command("gh", [
    "api",
    `repos/${repositoryName}/issues/${number}/comments`,
    "--method",
    "POST",
    "--raw-field",
    `body=${body}`,
  ]);
}

async function recordReceipt(number, receipt) {
  const existing = await comments(number);
  if (
    existing.some((comment) => {
      if (comment.user?.login !== "github-actions[bot]") return false;
      const prior = parseMarkedJson(comment.body, RECEIPT_MARKER);
      return prior && JSON.stringify(prior) === JSON.stringify(receipt);
    })
  )
    return;
  await postComment(
    number,
    `${RECEIPT_MARKER}\n${JSON.stringify(receipt, null, 2)}`,
  );
}

function candidateFromComment(comment) {
  const candidate = parseMarkedJson(comment.body, CANDIDATE_MARKER);
  return (
    candidate && {
      ...candidate,
      commentId: comment.id,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }
  );
}

async function saveAcceptanceEvidence({
  number,
  headSha,
  baseSha,
  acceptedComment,
  candidateComment,
  reviewer,
  eventId,
  eventName,
  sourceEvent,
}) {
  const runId = required("GITHUB_RUN_ID");
  const runAttempt = Number(required("GITHUB_RUN_ATTEMPT"));
  const workflowSha = safeSha(required("GITHUB_WORKFLOW_SHA"), "Workflow SHA");
  const evidence = {
    schemaVersion: 1,
    kind: "G2_ACCEPTANCE_EVIDENCE",
    repository: repository(),
    pullRequest: Number(number),
    headSha,
    baseSha,
    actor: reviewer,
    acceptedCommentId: String(acceptedComment.id),
    acceptedAt: acceptedComment.created_at,
    acceptanceBody: acceptedComment.body,
    candidateCommentId: String(candidateComment.id),
    candidateCreatedAt: candidateComment.created_at,
    candidateUpdatedAt: candidateComment.updated_at,
    candidateBody: candidateComment.body,
    candidateBodySha256: createHash("sha256")
      .update(candidateComment.body)
      .digest("hex"),
    event: eventName,
    eventId,
    sourceEvent: {
      action: sourceEvent.action || null,
      issueNumber: sourceEvent.issue?.number || sourceEvent.number || null,
      commentId: sourceEvent.comment?.id || null,
      commentBody: sourceEvent.comment?.body || null,
      headSha:
        sourceEvent.workflow_run?.head_sha ||
        sourceEvent.sha ||
        sourceEvent.pull_request?.head?.sha ||
        null,
      workflowRunId: sourceEvent.workflow_run?.id || null,
      workflowRunAttempt: sourceEvent.workflow_run?.run_attempt || null,
      statusId: sourceEvent.id || null,
    },
    runId,
    runAttempt,
    workflowSha,
  };
  await saveIntentArtifact(evidence);
  return evidence;
}

function evidenceMatches(evidence, { number, headSha, allComments, reviewer }) {
  if (
    evidence?.schemaVersion !== 1 ||
    evidence.kind !== "G2_ACCEPTANCE_EVIDENCE" ||
    evidence.repository !== repository() ||
    Number(evidence.pullRequest) !== Number(number) ||
    evidence.headSha !== headSha ||
    evidence.actor !== reviewer ||
    !/^[1-9]\d*$/.test(String(evidence.runId)) ||
    !Number.isSafeInteger(evidence.runAttempt) ||
    evidence.runAttempt < 1 ||
    !SHA_PATTERN.test(evidence.workflowSha || "") ||
    !sourceEventMatches(evidence)
  )
    return false;
  const accepted = allComments.find(
    (comment) =>
      String(comment.id) === String(evidence.acceptedCommentId) &&
      isAuthorizedAcceptance(comment, reviewer) &&
      comment.created_at === evidence.acceptedAt &&
      comment.body === evidence.acceptanceBody,
  );
  const candidateComment = allComments.find(
    (comment) =>
      String(comment.id) === String(evidence.candidateCommentId) &&
      comment.user?.login === reviewer &&
      comment.user?.type === "User" &&
      comment.created_at === evidence.candidateCreatedAt &&
      comment.updated_at === evidence.candidateUpdatedAt &&
      comment.body === evidence.candidateBody,
  );
  if (!accepted || !candidateComment) return false;
  const currentCandidate = chooseCandidate(
    allComments,
    reviewer,
    accepted.created_at,
    accepted.id,
  );
  if (currentCandidate?.id !== candidateComment.id) return false;
  return (
    createHash("sha256").update(candidateComment.body).digest("hex") ===
    evidence.candidateBodySha256
  );
}

function sourceEventMatches(evidence) {
  const source = evidence.sourceEvent;
  if (evidence.event === "issue_comment")
    return (
      source.action === "created" &&
      Number(source.issueNumber) === Number(evidence.pullRequest) &&
      String(source.commentId) === String(evidence.acceptedCommentId) &&
      source.commentBody === evidence.acceptanceBody &&
      source.commentBody?.trim() === "LGTM" &&
      evidence.eventId === `issue_comment:${source.commentId}`
    );
  if (evidence.event === "workflow_run")
    return (
      source.action === "completed" &&
      source.headSha === evidence.headSha &&
      evidence.eventId ===
        `workflow_run:${source.workflowRunId}:${source.workflowRunAttempt}`
    );
  if (evidence.event === "status")
    return (
      source.headSha === evidence.headSha &&
      evidence.eventId === `status:${source.statusId}`
    );
  return false;
}

async function validateEvidenceRun(runId, attempt, evidence) {
  const [run, workflow] = await Promise.all([
    api(`actions/runs/${runId}/attempts/${attempt}`),
    api("actions/workflows/delivery-review.yml"),
  ]);
  if (
    workflow.path !== ".github/workflows/delivery-review.yml" ||
    String(run.id) !== String(runId) ||
    String(run.workflow_id) !== String(workflow.id) ||
    run.repository?.full_name !== repository() ||
    run.head_repository?.full_name !== repository() ||
    run.head_branch !== "main" ||
    run.event !== evidence.event ||
    run.head_sha !== evidence.workflowSha ||
    String(run.run_attempt) !== String(attempt) ||
    run.status !== "completed" ||
    String(run.path || "").split("@")[0] !== workflow.path
  )
    return false;
  const jobs = await api(
    `actions/runs/${runId}/attempts/${attempt}/jobs?filter=latest&per_page=100`,
  );
  if (!Array.isArray(jobs.jobs) || jobs.total_count > jobs.jobs.length)
    return false;
  const writers = jobs.jobs.filter((job) => job.name === "record-or-merge");
  return writers.length === 1 && writers[0].status === "completed";
}

async function readTrustedEvidence(runId, attempt) {
  const run = await api(`actions/runs/${runId}/attempts/${attempt}`);
  const { artifact, evidence } = await downloadIntentArtifact(run, attempt);
  if (
    evidence.runId !== String(runId) ||
    evidence.runAttempt !== Number(attempt) ||
    !(await validateEvidenceRun(runId, attempt, evidence)) ||
    !sourceEventMatches(evidence)
  )
    return null;
  return { artifact, evidence };
}

async function findAcceptedEvidence({
  number,
  headSha,
  acceptedCommentId,
  allComments,
  reviewer,
}) {
  const workflow = await api("actions/workflows/delivery-review.yml");
  if (workflow.path !== ".github/workflows/delivery-review.yml") return null;
  const runs = await workflowRuns(
    `actions/workflows/${workflow.id}/runs?per_page=100`,
  );
  for (const run of runs) {
    if (
      run.repository?.full_name !== repository() ||
      String(run.workflow_id) !== String(workflow.id)
    )
      continue;
    const attempts = Number(run.run_attempt);
    if (!Number.isSafeInteger(attempts) || attempts < 1) continue;
    for (let attempt = attempts; attempt >= 1; attempt -= 1) {
      try {
        const { evidence } = await readTrustedEvidence(run.id, attempt);
        if (
          evidence &&
          String(evidence.acceptedCommentId) === String(acceptedCommentId) &&
          evidenceMatches(evidence, { number, headSha, allComments, reviewer })
        )
          return evidence;
      } catch {
        // Missing, expired, or malformed artifacts are not evidence.
      }
    }
  }
  return null;
}

function actionRunIdFromUrl(value) {
  try {
    const url = new URL(value);
    const server = new URL(
      process.env.GITHUB_SERVER_URL || "https://github.com",
    );
    const prefix = `/${repository()}/actions/runs/`;
    if (url.origin !== server.origin || !url.pathname.startsWith(prefix))
      return null;
    const runId = url.pathname.slice(prefix.length);
    if (!/^[1-9]\d*$/.test(runId)) return null;
    return runId;
  } catch {
    return null;
  }
}

async function validateBotReceipt({
  receipt,
  nativePr,
  comments: allComments,
  reviewer,
  number,
  headSha,
}) {
  if (
    receipt?.schemaVersion !== 1 ||
    receipt.kind !== "G2_ACCEPTED_AND_MERGED" ||
    receipt.repository !== repository() ||
    Number(receipt.pullRequest) !== Number(number) ||
    receipt.actor !== reviewer ||
    receipt.headSha !== headSha ||
    receipt.mergeCommit !== nativePr.merge_commit_sha ||
    receipt.mergedAt !== nativePr.merged_at ||
    !SHA_PATTERN.test(receipt.baseSha || "") ||
    !receipt.acceptedCommentId ||
    !receipt.candidateCommentId ||
    !Number.isSafeInteger(receipt.runAttempt) ||
    !Number.isFinite(Date.parse(receipt.acceptedAt)) ||
    !["issue_comment", "workflow_run", "status"].includes(receipt.event)
  )
    return false;
  const accepted = allComments.find(
    (comment) =>
      String(comment.id) === String(receipt.acceptedCommentId) &&
      isAuthorizedAcceptance(comment, reviewer) &&
      comment.created_at === receipt.acceptedAt,
  );
  if (!accepted) return false;
  if (
    receipt.event === "issue_comment" &&
    receipt.eventId !== `issue_comment:${accepted.id}`
  )
    return false;
  if (
    receipt.event !== "issue_comment" &&
    !receipt.eventId.startsWith(`${receipt.event}:`)
  )
    return false;
  const candidateComment = allComments.find(
    (comment) => String(comment.id) === String(receipt.candidateCommentId),
  );
  const currentLatest = chooseCandidate(
    allComments,
    reviewer,
    accepted.created_at,
    accepted.id,
  );
  const candidate = candidateComment
    ? parseMarkedJson(candidateComment.body, CANDIDATE_MARKER)
    : null;
  if (
    !candidate ||
    currentLatest?.id !== candidateComment.id ||
    candidateComment.created_at !== receipt.candidateCreatedAt ||
    candidateComment.updated_at !== receipt.candidateUpdatedAt ||
    candidate.headSha !== receipt.headSha ||
    candidate.baseSha !== receipt.baseSha ||
    candidate.snapshotUrl !== receipt.snapshotUrl ||
    candidate.specHash !== receipt.specHash ||
    candidate.change !== receipt.change
  )
    return false;
  try {
    validateCandidate(candidate, {
      repository: repository(),
      number,
      headSha,
      baseSha: receipt.baseSha,
      reviewer,
    });
  } catch {
    return false;
  }
  const runId = actionRunIdFromUrl(receipt.runUrl);
  if (!runId || runId !== String(receipt.runId)) return false;
  if (!(await mergeParentsMatch(nativePr, receipt.baseSha, headSha)))
    return false;
  try {
    const { evidence } = await readTrustedEvidence(runId, receipt.runAttempt);
    return Boolean(
      nativePr.merged_by?.login === "github-actions[bot]" &&
      evidence &&
      evidenceMatches(evidence, {
        number,
        headSha,
        allComments,
        reviewer,
      }) &&
      evidence.eventId === receipt.eventId &&
      evidence.event === receipt.event &&
      String(evidence.acceptedCommentId) ===
        String(receipt.acceptedCommentId) &&
      String(evidence.candidateCommentId) ===
        String(receipt.candidateCommentId) &&
      evidence.baseSha === receipt.baseSha &&
      evidence.workflowSha === receipt.workflowSha,
    );
  } catch {
    return false;
  }
}

function receiptForEvidence({
  evidence,
  candidate,
  candidateComment,
  number,
  nativePr,
}) {
  return {
    schemaVersion: 1,
    kind: "G2_ACCEPTED_AND_MERGED",
    repository: repository(),
    pullRequest: Number(number),
    headSha: evidence.headSha,
    actor: evidence.actor,
    eventId: evidence.eventId,
    event: evidence.event,
    runId: evidence.runId,
    runAttempt: evidence.runAttempt,
    workflowSha: evidence.workflowSha,
    runUrl: `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${repository()}/actions/runs/${evidence.runId}`,
    snapshotUrl: candidate.snapshotUrl,
    specHash: candidate.specHash,
    change: candidate.change,
    acceptedAt: evidence.acceptedAt,
    acceptedCommentId: evidence.acceptedCommentId,
    candidateCommentId: String(candidateComment.id),
    candidateCreatedAt: candidateComment.created_at,
    candidateUpdatedAt: candidateComment.updated_at,
    baseSha: evidence.baseSha,
    mergedAt: nativePr.merged_at,
    mergeCommit: nativePr.merge_commit_sha,
  };
}

function isSameRepositoryMainPr(pr, nativePr) {
  return (
    pr.baseRefName === "main" &&
    nativePr.base?.ref === "main" &&
    nativePr.base?.repo?.full_name === repository() &&
    nativePr.head?.repo?.full_name === repository()
  );
}

async function mergeAccepted({
  number,
  acceptedComment,
  eventId,
  eventName,
  sourceEvent,
}) {
  const reviewer = required("DELIVERY_REVIEWER_LOGIN");
  const allComments = await comments(number);
  const pr = await prView(number);
  const nativePr = await api(`pulls/${number}`);
  if (!isSameRepositoryMainPr(pr, nativePr))
    fail("G2 requires a same-repository pull request targeting main");
  if (pr.state === "MERGED") {
    const prior = allComments
      .filter((comment) => comment.user?.login === "github-actions[bot]")
      .map((comment) => parseMarkedJson(comment.body, RECEIPT_MARKER))
      .find(
        (receipt) =>
          receipt?.eventId === eventId && receipt.headSha === pr.headRefOid,
      );
    if (
      prior &&
      nativePr.merged &&
      nativePr.merge_commit_sha === prior.mergeCommit &&
      nativePr.merged_at === prior.mergedAt &&
      (await validateBotReceipt({
        receipt: prior,
        nativePr,
        comments: allComments,
        reviewer,
        number,
        headSha: pr.headRefOid,
      }))
    )
      return;
    if (
      !nativePr.merged ||
      nativePr.head?.sha !== pr.headRefOid ||
      nativePr.merged_by?.login !== "github-actions[bot]"
    )
      fail("G2 PR is already merged without a trusted bot merge");
    const evidence = await findAcceptedEvidence({
      number,
      headSha: pr.headRefOid,
      acceptedCommentId: acceptedComment.id,
      allComments,
      reviewer,
    });
    if (!evidence)
      fail("Merged G2 PR has no recoverable trusted acceptance artifact");
    if (!(await mergeParentsMatch(nativePr, evidence.baseSha, pr.headRefOid)))
      fail(
        "Merged PR native commit parents do not match the accepted base and head",
      );
    const recoveredComment = allComments.find(
      (comment) => String(comment.id) === String(evidence.candidateCommentId),
    );
    const recoveredCandidate = candidateFromComment(recoveredComment);
    await recordReceipt(
      number,
      receiptForEvidence({
        evidence,
        candidate: recoveredCandidate,
        candidateComment: recoveredComment,
        number,
        nativePr,
      }),
    );
    return;
  }
  const candidateComment = chooseCandidate(
    allComments,
    reviewer,
    acceptedComment.created_at,
    acceptedComment.id,
  );
  if (!candidateComment)
    fail(
      "No pre-acceptance G2 candidate was published by the configured reviewer",
    );
  const candidate = candidateFromComment(candidateComment);
  if (pr.state !== "OPEN" || pr.isDraft || nativePr.draft)
    fail("G2 requires an open, ready PR targeting main");
  if (
    nativePr.base?.sha !== pr.baseRefOid ||
    nativePr.head?.sha !== pr.headRefOid
  )
    fail("G2 requires a same-repository pull request");
  const headSha = safeSha(pr.headRefOid, "Current PR head");
  validateCandidate(candidate, {
    repository: repository(),
    number,
    headSha,
    baseSha: pr.baseRefOid,
    reviewer,
  });
  if (pr.mergeStateStatus !== "CLEAN")
    fail("GitHub does not report a clean merge state");
  const { checkRuns, statuses } = await checksFor(headSha);
  validateRequiredChecks(headSha, checkRuns, statuses, repository());
  await validateTrustedVerify(headSha, checkRuns);

  // HEAD is locked by gh's --match-head-commit. Re-read the observed base
  // immediately before mutation; GitHub exposes no equivalent base lock.
  const beforeMerge = await prView(number);
  const nativeBeforeMerge = await api(`pulls/${number}`);
  if (
    !isSameRepositoryMainPr(beforeMerge, nativeBeforeMerge) ||
    beforeMerge.state !== "OPEN" ||
    beforeMerge.isDraft ||
    nativeBeforeMerge.draft ||
    beforeMerge.mergeStateStatus !== "CLEAN" ||
    beforeMerge.headRefOid !== headSha ||
    beforeMerge.baseRefOid !== candidate.baseSha ||
    nativeBeforeMerge.base?.sha !== candidate.baseSha ||
    nativeBeforeMerge.head?.sha !== headSha
  )
    fail("PR context, head or observed base changed before merge");

  const commentsBeforeMerge = await comments(number);
  const currentAcceptance = commentsBeforeMerge.find(
    (comment) => String(comment.id) === String(acceptedComment.id),
  );
  const currentCandidate = chooseCandidate(
    commentsBeforeMerge,
    reviewer,
    acceptedComment.created_at,
    acceptedComment.id,
  );
  if (
    !currentAcceptance ||
    !isAuthorizedAcceptance(currentAcceptance, reviewer) ||
    currentAcceptance.body !== acceptedComment.body ||
    !currentCandidate ||
    String(currentCandidate.id) !== String(candidateComment.id) ||
    currentCandidate.body !== candidateComment.body ||
    currentCandidate.updated_at !== candidateComment.updated_at
  )
    fail("LGTM or its candidate changed before merge");

  const evidence = await saveAcceptanceEvidence({
    number,
    headSha,
    baseSha: nativeBeforeMerge.base.sha,
    acceptedComment,
    candidateComment,
    reviewer,
    eventId,
    eventName,
    sourceEvent,
  });

  await command("gh", [
    "pr",
    "merge",
    String(number),
    "--repo",
    repository(),
    "--merge",
    "--match-head-commit",
    headSha,
  ]);
  const merged = await prView(number);
  const nativeMerged = await api(`pulls/${number}`);
  if (
    !isSameRepositoryMainPr(merged, nativeMerged) ||
    merged.state !== "MERGED" ||
    merged.headRefOid !== headSha ||
    !nativeMerged.merged ||
    nativeMerged.head?.sha !== headSha ||
    !(await mergeParentsMatch(
      nativeMerged,
      nativeBeforeMerge.base.sha,
      headSha,
    ))
  )
    fail("GitHub did not confirm merge of the accepted head");
  await recordReceipt(
    number,
    receiptForEvidence({
      evidence,
      candidate,
      candidateComment,
      number,
      nativePr: nativeMerged,
    }),
  );
}

async function inspectAcceptance(
  number,
  eventId,
  eventName,
  acceptedCommentId,
  sourceEvent,
) {
  const reviewer = required("DELIVERY_REVIEWER_LOGIN");
  const allComments = await comments(number);
  const latestAcceptance = acceptedCommentId
    ? allComments.find(
        (comment) =>
          String(comment.id) === String(acceptedCommentId) &&
          isAuthorizedAcceptance(comment, reviewer),
      )
    : allComments
        .filter((comment) => isAuthorizedAcceptance(comment, reviewer))
        .sort((a, b) => compareCommentOrder(b, a))[0];
  if (!latestAcceptance) return;
  await mergeAccepted({
    number,
    acceptedComment: latestAcceptance,
    eventId,
    eventName,
    sourceEvent,
  });
}

async function handleEvent() {
  if (process.env.DELIVERY_REVIEW_ENABLED !== "true")
    return { skipped: "disabled" };
  const reviewer = required("DELIVERY_REVIEWER_LOGIN");
  const eventName = required("GITHUB_EVENT_NAME");
  const event = JSON.parse(
    await readFile(required("GITHUB_EVENT_PATH"), "utf8"),
  );
  const eventId =
    eventName === "issue_comment"
      ? `${eventName}:${event.comment?.id || "unknown"}`
      : eventName === "workflow_run"
        ? `${eventName}:${event.workflow_run?.id || "unknown"}:${event.workflow_run?.run_attempt || "unknown"}`
        : eventName === "status"
          ? `${eventName}:${event.id || "unknown"}`
          : `${eventName}:${event.pull_request?.number || "unknown"}:${event.pull_request?.merge_commit_sha || "unknown"}`;

  if (eventName === "issue_comment" && event.action === "created") {
    const pullRequest = event.issue?.pull_request;
    if (!pullRequest || !isAuthorizedAcceptance(event.comment, reviewer))
      return { skipped: "not-an-authorized-LGTM" };
    await inspectAcceptance(
      event.issue.number,
      eventId,
      eventName,
      event.comment.id,
      event,
    );
  } else if (
    eventName === "workflow_run" &&
    event.action === "completed" &&
    event.workflow_run?.conclusion === "success"
  ) {
    const prs = await apiAll(
      `commits/${safeSha(event.workflow_run.head_sha, "Workflow head")}/pulls`,
    );
    for (const pr of prs) {
      if (
        pr.base?.repo?.full_name === repository() &&
        pr.head?.repo?.full_name === repository()
      )
        await inspectAcceptance(
          pr.number,
          eventId,
          eventName,
          undefined,
          event,
        );
    }
  } else if (eventName === "status" && event.state === "success") {
    const prs = await apiAll(
      `commits/${safeSha(event.sha, "Status SHA")}/pulls`,
    );
    for (const pr of prs) {
      if (
        pr.base?.repo?.full_name === repository() &&
        pr.head?.repo?.full_name === repository()
      )
        await inspectAcceptance(
          pr.number,
          eventId,
          eventName,
          undefined,
          event,
        );
    }
  } else if (
    eventName === "pull_request_target" &&
    event.action === "closed" &&
    event.pull_request?.merged
  ) {
    const mergedBy = event.pull_request.merged_by;
    if (mergedBy?.login !== reviewer || mergedBy?.type !== "User")
      return { skipped: "merge-by-non-reviewer" };
    const pr = await prView(event.pull_request.number);
    const nativePr = await api(`pulls/${event.pull_request.number}`);
    const headSha = safeSha(event.pull_request.head?.sha, "Merged PR head");
    if (
      pr.state !== "MERGED" ||
      pr.headRefOid !== headSha ||
      pr.baseRefName !== "main" ||
      !nativePr.merged ||
      nativePr.merged_by?.login !== reviewer ||
      nativePr.merged_by?.type !== "User" ||
      nativePr.base?.repo?.full_name !== repository() ||
      nativePr.head?.repo?.full_name !== repository() ||
      nativePr.base?.ref !== "main" ||
      nativePr.head?.sha !== headSha
    )
      fail("Merged PR API read-back does not match the trusted event");
    const candidateComment = chooseCandidate(
      await comments(pr.number),
      reviewer,
      event.pull_request.merged_at,
    );
    if (!candidateComment)
      fail(
        "Direct merge has no published G2 candidate from the configured reviewer",
      );
    const candidate = candidateFromComment(candidateComment);
    validateCandidate(candidate, {
      repository: repository(),
      number: pr.number,
      headSha,
      baseSha: candidate.baseSha,
      reviewer,
    });
    if (!(await mergeParentsMatch(nativePr, candidate.baseSha, headSha)))
      fail(
        "Direct merge parents do not match the published candidate base and head",
      );
    await recordReceipt(pr.number, {
      schemaVersion: 1,
      kind: "G2_ACCEPTED_AND_MERGED",
      repository: repository(),
      pullRequest: pr.number,
      headSha,
      actor: reviewer,
      eventId,
      event: eventName,
      acceptedAt: event.pull_request.merged_at,
      mergedAt: event.pull_request.merged_at,
      mergeCommit: event.pull_request.merge_commit_sha,
      baseSha: candidate.baseSha,
      runUrl: `${process.env.GITHUB_SERVER_URL}/${repository()}/actions/runs/${process.env.GITHUB_RUN_ID}`,
      snapshotUrl: candidate.snapshotUrl,
      specHash: candidate.specHash,
      change: candidate.change,
    });
  }
  return { handled: true };
}

async function publish(number, snapshotUrl, specHash, change) {
  const reviewer = required("DELIVERY_REVIEWER_LOGIN");
  if (!HASH_PATTERN.test(specHash || ""))
    fail("--spec-hash must be a lowercase SHA-256 digest");
  if (!/^https:\/\//.test(snapshotUrl || ""))
    fail("--snapshot must be an HTTPS URL");
  const pr = await prView(number);
  const nativePr = await api(`pulls/${number}`);
  if (pr.state !== "OPEN" || pr.isDraft || pr.baseRefName !== "main")
    fail("Candidate requires an open, ready PR targeting main");
  if (
    nativePr.base?.repo?.full_name !== repository() ||
    nativePr.head?.repo?.full_name !== repository() ||
    nativePr.base?.ref !== "main" ||
    nativePr.base?.sha !== pr.baseRefOid ||
    nativePr.head?.sha !== pr.headRefOid
  )
    fail("Candidate requires a same-repository pull request");
  const candidate = {
    schemaVersion: 1,
    repository: repository(),
    pullRequest: Number(number),
    headSha: safeSha(pr.headRefOid, "PR head"),
    baseSha: safeSha(pr.baseRefOid, "PR base"),
    snapshotUrl,
    specHash,
    change,
    publishedBy: reviewer,
  };
  const response = await postComment(
    number,
    `${CANDIDATE_MARKER}\n${JSON.stringify(candidate, null, 2)}`,
  );
  process.stdout.write(`${response}\n`);
}

async function reconcile(number) {
  const repositoryName = repository();
  const reviewer = required("DELIVERY_REVIEWER_LOGIN");
  const localRemote = await command("git", ["remote", "get-url", "origin"]);
  const localBranch = await command("git", ["branch", "--show-current"]);
  const localHead = safeSha(
    await command("git", ["rev-parse", "HEAD"]),
    "Local HEAD",
  );
  const pr = await prView(number);
  const nativePr = await api(`pulls/${number}`);
  const isOwnedContext = remoteMatchesRepository(localRemote, repositoryName);
  const hasMatchingBranch = localBranch === pr.headRefName;
  const hasMatchingSha = localHead === pr.headRefOid;
  const allComments = await comments(number);
  const receipts = allComments
    .filter((comment) => comment.user?.login === "github-actions[bot]")
    .map((comment) => parseMarkedJson(comment.body, RECEIPT_MARKER))
    .filter(Boolean);
  const receipt = receipts.find(
    (item) =>
      item.headSha === localHead &&
      item.repository === repositoryName &&
      item.actor === reviewer &&
      item.kind === "G2_ACCEPTED_AND_MERGED",
  );
  const isDirectHumanMerge =
    nativePr.merged_by?.login === reviewer &&
    nativePr.merged_by?.type === "User";
  const isBotMerge = nativePr.merged_by?.login === "github-actions[bot]";
  const candidateComment = chooseCandidate(
    allComments,
    reviewer,
    nativePr.merged_at,
  );
  const candidate = candidateComment
    ? candidateFromComment(candidateComment)
    : null;
  let hasMatchingCandidate = false;
  if (candidate) {
    try {
      validateCandidate(candidate, {
        repository: repositoryName,
        number,
        headSha: localHead,
        baseSha: isDirectHumanMerge ? candidate.baseSha : receipt?.baseSha,
        reviewer,
      });
      hasMatchingCandidate = isDirectHumanMerge
        ? await mergeParentsMatch(nativePr, candidate.baseSha, localHead)
        : candidate.specHash === receipt?.specHash &&
          candidate.snapshotUrl === receipt?.snapshotUrl &&
          candidate.change === receipt?.change;
    } catch {
      hasMatchingCandidate = false;
    }
  }
  const isMerged = Boolean(
    nativePr.merged &&
    nativePr.merged_at &&
    nativePr.base?.ref === "main" &&
    nativePr.base?.repo?.full_name === repositoryName &&
    nativePr.head?.repo?.full_name === repositoryName &&
    nativePr.head?.sha === localHead &&
    nativePr.merge_commit_sha &&
    pr.state === "MERGED",
  );
  const isAutomationEligible = Boolean(
    isBotMerge &&
    receipt &&
    (await validateBotReceipt({
      receipt,
      nativePr,
      comments: allComments,
      reviewer,
      number,
      headSha: localHead,
    })),
  );
  const isMergeVerified = Boolean(
    isOwnedContext &&
    hasMatchingBranch &&
    hasMatchingSha &&
    isMerged &&
    (isDirectHumanMerge || isAutomationEligible) &&
    hasMatchingCandidate,
  );
  process.stdout.write(
    `${JSON.stringify({ repository: repositoryName, pullRequest: Number(number), localBranch, localHead, repositoryMatches: isOwnedContext, branchMatches: hasMatchingBranch, shaMatches: hasMatchingSha, merged: isMerged, directHumanMerge: isDirectHumanMerge, botMerge: isBotMerge, receipt: Boolean(receipt), candidateMatches: hasMatchingCandidate, mergeVerified: isMergeVerified, cleanupEligible: false, ownershipVerificationRequired: true }, null, 2)}\n`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, ...args] = process.argv.slice(2);
  try {
    if (mode === "publish" && args.length === 8) {
      const flags = Object.fromEntries(
        args.reduce((pairs, value, index) => {
          if (value.startsWith("--"))
            pairs.push([value.slice(2), args[index + 1]]);
          return pairs;
        }, []),
      );
      if (!flags.pr || !flags.snapshot || !flags["spec-hash"] || !flags.change)
        fail(
          "Usage: publish --pr N --snapshot URL --spec-hash HASH --change SLUG",
        );
      await publish(flags.pr, flags.snapshot, flags["spec-hash"], flags.change);
    } else if (mode === "event" && args.length === 0) {
      process.stdout.write(`${JSON.stringify(await handleEvent())}\n`);
    } else if (
      mode === "reconcile" &&
      args.length === 2 &&
      args[0] === "--pr"
    ) {
      await reconcile(args[1]);
    } else {
      fail(
        "Usage: delivery-review.js publish --pr N --snapshot URL --spec-hash HASH --change SLUG | event | reconcile --pr N",
      );
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
