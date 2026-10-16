import { randomUUID } from "node:crypto";

export const ARTIFACT_STORAGE_BUDGET_BYTES = 1_000_000_000;
export const ARTIFACT_CLASS_A_BUDGET_PER_MONTH = 100_000;

const TABLE = "blueprint_artifact_upload_budget";
const LEASE_MS = 5 * 60 * 1_000;

const READ_SQL = `
  SELECT month, baseline_state, baseline_bytes, reserved_bytes,
         class_a_requests, lease_token, lease_expires_at
  FROM ${TABLE}
  WHERE month = ?
`;

const CLAIM_SQL = `
  INSERT INTO ${TABLE} (
    month, baseline_state, baseline_bytes, reserved_bytes,
    class_a_requests, lease_token, lease_expires_at
  ) VALUES (?, 'initializing', NULL, 0, 0, ?, ?)
  ON CONFLICT(month) DO NOTHING
`;

const TAKEOVER_SQL = `
  UPDATE ${TABLE}
  SET lease_token = ?, lease_expires_at = ?
  WHERE month = ? AND baseline_state = 'initializing' AND lease_expires_at <= ?
`;

const RESERVE_LIST_SQL = `
  UPDATE ${TABLE}
  SET class_a_requests = class_a_requests + 1, lease_expires_at = ?
  WHERE month = ? AND baseline_state = 'initializing' AND lease_token = ?
    AND class_a_requests < ?
`;

const FINALIZE_BASELINE_SQL = `
  UPDATE ${TABLE}
  SET baseline_state = 'ready', baseline_bytes = ?,
      lease_token = NULL, lease_expires_at = NULL
  WHERE month = ? AND baseline_state = 'initializing' AND lease_token = ?
`;

const RESERVE_UPLOAD_SQL = `
  UPDATE ${TABLE}
  SET reserved_bytes = reserved_bytes + ?,
      class_a_requests = class_a_requests + ?
  WHERE month = ? AND baseline_state = 'ready'
    AND baseline_bytes + reserved_bytes + ? <= ?
    AND class_a_requests + ? <= ?
`;

function fail(message) {
  throw new Error(`Blueprint artifact budget: ${message}`);
}

function currentMonth(now) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function safeNonnegativeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) fail(`${label} is invalid.`);
  return value;
}

async function readBudget(execute, month) {
  const result = await execute(READ_SQL, [month]);
  if (!Array.isArray(result.rows)) fail("ledger read did not return rows.");
  if (result.rows.length > 1) fail("ledger contains duplicate month rows.");
  return result.rows[0] ?? null;
}

async function reserveListRequest(execute, month, token, leaseExpiresAt) {
  const result = await execute(RESERVE_LIST_SQL, [
    leaseExpiresAt,
    month,
    token,
    ARTIFACT_CLASS_A_BUDGET_PER_MONTH,
  ]);
  if (result.changes !== 1) fail("could not reserve a bucket-list request.");
}

async function readBucketBaseline({ execute, listBucket, month, token, now }) {
  let cursor;
  const seenCursors = new Set();
  let totalBytes = 0;
  let pageCount = 0;

  while (true) {
    const leaseExpiresAt = now().getTime() + LEASE_MS;
    await reserveListRequest(execute, month, token, leaseExpiresAt);
    pageCount += 1;

    const page = await listBucket(cursor);
    if (
      !page ||
      !Array.isArray(page.items) ||
      typeof page.hasMore !== "boolean"
    )
      fail("private bucket listing returned an invalid page.");

    for (const item of page.items) {
      if (!Number.isSafeInteger(item?.size) || item.size < 0)
        fail("existing artifact size is unknown; uploads are blocked.");
      totalBytes += item.size;
      if (!Number.isSafeInteger(totalBytes))
        fail("existing artifact total is invalid.");
    }

    if (!page.hasMore) break;
    if (
      typeof page.cursor !== "string" ||
      page.cursor.length === 0 ||
      seenCursors.has(page.cursor)
    )
      fail("private bucket listing did not advance its cursor.");
    seenCursors.add(page.cursor);
    cursor = page.cursor;
  }

  if (pageCount === 0) fail("private bucket baseline was not read.");
  return totalBytes;
}

async function initializeBaseline({ execute, listBucket, month, now }) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const current = await readBudget(execute, month);
    if (current?.baseline_state === "ready") {
      safeNonnegativeInteger(current.baseline_bytes, "ledger baseline");
      safeNonnegativeInteger(current.reserved_bytes, "ledger reservation");
      safeNonnegativeInteger(current.class_a_requests, "ledger request count");
      return current;
    }

    const token = randomUUID();
    const time = now().getTime();
    let ownsLease = false;
    if (!current) {
      const claim = await execute(CLAIM_SQL, [month, token, time + LEASE_MS]);
      ownsLease = claim.changes === 1;
    } else if (
      current.baseline_state === "initializing" &&
      Number.isSafeInteger(current.lease_expires_at) &&
      current.lease_expires_at <= time
    ) {
      const takeover = await execute(TAKEOVER_SQL, [
        token,
        time + LEASE_MS,
        month,
        time,
      ]);
      ownsLease = takeover.changes === 1;
    } else if (
      current.baseline_state !== "initializing" ||
      !Number.isSafeInteger(current.class_a_requests) ||
      current.class_a_requests < 0
    ) {
      fail("ledger state is invalid.");
    }

    if (!ownsLease)
      fail("baseline is being initialized; retry after it completes.");

    const baselineBytes = await readBucketBaseline({
      execute,
      listBucket,
      month,
      token,
      now,
    });
    const finalized = await execute(FINALIZE_BASELINE_SQL, [
      baselineBytes,
      month,
      token,
    ]);
    if (finalized.changes !== 1)
      fail("baseline lease was lost before completion.");
  }
  fail("could not initialize the monthly baseline.");
}

/**
 * Reserve one private-bucket upload batch before writing any objects.
 * `classARequests` must include every R2 PUT in the batch, including the final
 * catalog PUT. Bucket LIST pages used for the baseline are charged separately.
 * Failed reservations are never refunded; byte reservations are intentionally
 * conservative for rewrites and interrupted uploads.
 */
export async function reserveArtifactUpload(
  input,
  { execute, listBucket, now = () => new Date() },
) {
  if (typeof execute !== "function" || typeof listBucket !== "function")
    fail("execute and listBucket adapters are required.");
  const bytes = safeNonnegativeInteger(input?.bytes, "upload bytes");
  const classARequests = safeNonnegativeInteger(
    input?.classARequests,
    "Class A request count",
  );
  if (classARequests < 1)
    fail("an upload batch must include at least one Class A request.");
  const currentDate = now();
  if (!(currentDate instanceof Date) || !Number.isFinite(currentDate.getTime()))
    fail("current time is invalid.");
  const month = currentMonth(currentDate);

  await initializeBaseline({ execute, listBucket, month, now });
  const result = await execute(RESERVE_UPLOAD_SQL, [
    bytes,
    classARequests,
    month,
    bytes,
    ARTIFACT_STORAGE_BUDGET_BYTES,
    classARequests,
    ARTIFACT_CLASS_A_BUDGET_PER_MONTH,
  ]);
  if (result.changes !== 1)
    fail("free-tier storage or monthly Class A request budget reached.");
}
