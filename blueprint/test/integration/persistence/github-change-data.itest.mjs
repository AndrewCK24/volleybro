import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { readPullRequestSummaries } from "../../../src/lib/github-change-data.ts";

const migration = await readFile(
  new URL(
    "../../../.emdash/migrations/0001_github_pull_request_cache.sql",
    import.meta.url,
  ),
  "utf8",
);

class SQLiteD1 {
  database = new DatabaseSync(":memory:");

  constructor() {
    this.database.exec(migration);
  }

  prepare(sql) {
    const statement = this.database.prepare(sql);
    let values = [];
    const boundStatement = {
      bind: (...nextValues) => {
        values = nextValues;
        return boundStatement;
      },
      first: async (column) => {
        const row = statement.get(...values) ?? null;
        return column && row ? (row[column] ?? null) : row;
      },
      all: async () => ({ results: statement.all(...values) }),
      run: async () => statement.run(...values),
    };
    return boundStatement;
  }

  close() {
    this.database.close();
  }
}

function stubGitHubFetch(t, { merged = false } = {}) {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async (input) => {
    requests += 1;
    const url = new URL(String(input));
    if (url.pathname.endsWith("/pulls/552")) {
      return Response.json({
        number: 552,
        state: merged ? "closed" : "open",
        merged_at: merged ? "2026-10-12T08:00:00Z" : null,
        merge_commit_sha: merged ? "a".repeat(40) : null,
        commits: 3,
        changed_files: 1,
        additions: 20,
        deletions: 5,
      });
    }
    if (url.pathname.endsWith("/pulls/552/files")) {
      return Response.json([{ filename: "src/example.ts" }]);
    }
    throw new Error(`Unexpected GitHub API request: ${url}`);
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  return () => requests;
}

const pullRequestUrl = "https://github.com/andrewck24/volleybro/pull/552";

test("D1 SQL persists open-cache expiry and refreshes expired rows", async (t) => {
  const database = new SQLiteD1();
  t.after(() => database.close());
  const requestCount = stubGitHubFetch(t);
  const options = { env: { BLUEPRINT_DB: database }, now: 1_000 };

  const first = await readPullRequestSummaries([pullRequestUrl], options);
  assert.equal(first[0]?.filesChanged, 1);
  assert.equal(requestCount(), 2);

  const cachedRow = database.database
    .prepare(
      "SELECT payload, expires_at FROM blueprint_github_pull_request_cache WHERE cache_key = ?",
    )
    .get("pr:552");
  assert.equal(cachedRow.expires_at, 301_000);
  assert.equal(JSON.parse(cachedRow.payload).number, 552);

  await readPullRequestSummaries([pullRequestUrl], {
    env: { BLUEPRINT_DB: database },
    now: 300_999,
  });
  assert.equal(requestCount(), 2);

  await readPullRequestSummaries([pullRequestUrl], {
    env: { BLUEPRINT_DB: database },
    now: 301_000,
  });
  assert.equal(requestCount(), 4);
  assert.equal(
    database.database
      .prepare(
        "SELECT expires_at FROM blueprint_github_pull_request_cache WHERE cache_key = ?",
      )
      .get("pr:552").expires_at,
    601_000,
  );
});

test("D1 SQL retains merged metrics permanently under the merge SHA", async (t) => {
  const database = new SQLiteD1();
  t.after(() => database.close());
  const requestCount = stubGitHubFetch(t, { merged: true });
  const first = await readPullRequestSummaries([pullRequestUrl], {
    env: { BLUEPRINT_DB: database },
    now: 1_000,
  });
  assert.equal(first[0]?.mergedAt, "2026-10-12T08:00:00Z");
  assert.equal(requestCount(), 2);

  const shaKey = `merge:${"a".repeat(40)}`;
  const mergedRow = database.database
    .prepare(
      "SELECT payload, expires_at FROM blueprint_github_pull_request_cache WHERE cache_key = ?",
    )
    .get(shaKey);
  assert.equal(mergedRow.expires_at, null);
  assert.equal(JSON.parse(mergedRow.payload).mergeCommitSha, "a".repeat(40));

  const cached = await readPullRequestSummaries([pullRequestUrl], {
    env: { BLUEPRINT_DB: database },
    now: Number.MAX_SAFE_INTEGER,
  });
  assert.deepEqual(cached, first);
  assert.equal(requestCount(), 2);
});
