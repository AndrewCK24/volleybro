import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import {
  ARTIFACT_CLASS_A_BUDGET_PER_MONTH,
  ARTIFACT_STORAGE_BUDGET_BYTES,
  reserveArtifactUpload,
} from "../../../build/artifact-upload-budget.mjs";

const migration = await readFile(
  new URL(
    "../../../.emdash/migrations/0002_artifact_upload_budget.sql",
    import.meta.url,
  ),
  "utf8",
);

function createLedger(t) {
  const database = new DatabaseSync(":memory:");
  database.exec(migration);
  t.after(() => database.close());

  async function execute(sql, params) {
    if (/^\s*SELECT\b/iu.test(sql)) {
      return { rows: database.prepare(sql).all(...params), changes: 0 };
    }
    const result = database.prepare(sql).run(...params);
    return { rows: [], changes: Number(result.changes) };
  }

  return {
    database,
    execute,
    row(month) {
      return database
        .prepare(
          "SELECT * FROM blueprint_artifact_upload_budget WHERE month = ?",
        )
        .get(month);
    },
  };
}

function listPages(items, calls = { count: 0 }) {
  return async (cursor) => {
    calls.count += 1;
    if (!cursor)
      return { items: items.slice(0, 1), cursor: "next", hasMore: true };
    return { items: items.slice(1), hasMore: false };
  };
}

test("captures bucket baseline once per month and reserves bytes plus every PUT", async (t) => {
  const ledger = createLedger(t);
  const now = () => new Date("2026-10-16T10:00:00Z");
  const listCalls = { count: 0 };
  const listBucket = listPages([{ size: 500 }, { size: 200 }], listCalls);

  await reserveArtifactUpload(
    { bytes: 100, classARequests: 2 },
    { execute: ledger.execute, listBucket, now },
  );
  const october = ledger.row("2026-10");
  assert.equal(october.baseline_state, "ready");
  assert.equal(october.baseline_bytes, 700);
  assert.equal(october.reserved_bytes, 100);
  assert.equal(
    october.class_a_requests,
    4,
    "two LIST pages and two PUTs are charged",
  );
  assert.equal(listCalls.count, 2);

  await reserveArtifactUpload(
    { bytes: 25, classARequests: 1 },
    { execute: ledger.execute, listBucket, now },
  );
  assert.equal(listCalls.count, 2, "the monthly baseline is not rescanned");
  assert.equal(ledger.row("2026-10").reserved_bytes, 125);

  await reserveArtifactUpload(
    { bytes: 10, classARequests: 1 },
    {
      execute: ledger.execute,
      listBucket: async () => ({ items: [{ size: 825 }], hasMore: false }),
      now: () => new Date("2026-11-01T00:01:00Z"),
    },
  );
  assert.equal(ledger.row("2026-11").baseline_bytes, 825);
  assert.equal(ledger.row("2026-11").reserved_bytes, 10);
  assert.equal(
    ledger.row("2026-10").reserved_bytes,
    125,
    "prior ledger rows remain intact",
  );
});

test("uses one atomic conditional UPDATE so parallel uploads cannot oversell storage", async (t) => {
  const ledger = createLedger(t);
  const now = () => new Date("2026-10-16T10:00:00Z");
  await reserveArtifactUpload(
    { bytes: 0, classARequests: 1 },
    {
      execute: ledger.execute,
      listBucket: async () => ({
        items: [{ size: ARTIFACT_STORAGE_BUDGET_BYTES - 10 }],
        hasMore: false,
      }),
      now,
    },
  );

  const attempts = await Promise.allSettled([
    reserveArtifactUpload(
      { bytes: 6, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => {
          throw new Error("baseline must be cached");
        },
        now,
      },
    ),
    reserveArtifactUpload(
      { bytes: 6, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => {
          throw new Error("baseline must be cached");
        },
        now,
      },
    ),
  ]);
  assert.equal(
    attempts.filter(({ status }) => status === "fulfilled").length,
    1,
  );
  assert.equal(
    attempts.filter(({ status }) => status === "rejected").length,
    1,
  );
  assert.equal(ledger.row("2026-10").reserved_bytes, 6);
  assert.equal(
    ledger.row("2026-10").baseline_bytes + ledger.row("2026-10").reserved_bytes,
    ARTIFACT_STORAGE_BUDGET_BYTES - 4,
  );
});

test("atomically enforces the monthly Class A ceiling", async (t) => {
  const ledger = createLedger(t);
  const now = () => new Date("2026-10-16T10:00:00Z");
  await reserveArtifactUpload(
    { bytes: 0, classARequests: 1 },
    {
      execute: ledger.execute,
      listBucket: async () => ({ items: [], hasMore: false }),
      now,
    },
  );
  ledger.database
    .prepare(
      `
    UPDATE blueprint_artifact_upload_budget
    SET class_a_requests = ?
    WHERE month = ?
  `,
    )
    .run(ARTIFACT_CLASS_A_BUDGET_PER_MONTH - 1, "2026-10");

  const attempts = await Promise.allSettled([
    reserveArtifactUpload(
      { bytes: 1, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => {
          throw new Error("baseline must be cached");
        },
        now,
      },
    ),
    reserveArtifactUpload(
      { bytes: 1, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => {
          throw new Error("baseline must be cached");
        },
        now,
      },
    ),
  ]);
  assert.equal(
    attempts.filter(({ status }) => status === "fulfilled").length,
    1,
  );
  assert.equal(
    attempts.filter(({ status }) => status === "rejected").length,
    1,
  );
  assert.equal(
    ledger.row("2026-10").class_a_requests,
    ARTIFACT_CLASS_A_BUDGET_PER_MONTH,
  );
});

test("fails closed on unknown size and leaves consumed LIST quota reserved", async (t) => {
  const ledger = createLedger(t);
  await assert.rejects(
    reserveArtifactUpload(
      { bytes: 1, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => ({ items: [{ size: null }], hasMore: false }),
        now: () => new Date("2026-10-16T10:00:00Z"),
      },
    ),
    /existing artifact size is unknown/u,
  );
  assert.equal(ledger.row("2026-10").baseline_state, "initializing");
  assert.equal(ledger.row("2026-10").class_a_requests, 1);
});

test("a concurrent baseline claimant cannot duplicate bucket LIST calls", async (t) => {
  const ledger = createLedger(t);
  const now = () => new Date("2026-10-16T10:00:00Z");
  let releaseList;
  const blockedList = new Promise((resolve) => {
    releaseList = resolve;
  });
  const first = reserveArtifactUpload(
    { bytes: 1, classARequests: 1 },
    {
      execute: ledger.execute,
      listBucket: async () => {
        await blockedList;
        return { items: [], hasMore: false };
      },
      now,
    },
  );

  await new Promise((resolve) => setImmediate(resolve));
  await assert.rejects(
    reserveArtifactUpload(
      { bytes: 1, classARequests: 1 },
      {
        execute: ledger.execute,
        listBucket: async () => {
          throw new Error("must not list");
        },
        now,
      },
    ),
    /baseline is being initialized/u,
  );
  releaseList();
  await first;
  assert.equal(
    ledger.row("2026-10").class_a_requests,
    2,
    "one baseline LIST plus one PUT",
  );
});
