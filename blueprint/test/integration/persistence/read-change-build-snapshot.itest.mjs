import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { readChangeBuildSnapshot } from "../../../build/read-change-build-snapshot.mjs";

function createDatabase(t) {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE revisions (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      entry_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE ec_blueprint_changes (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      deleted_at TEXT,
      live_revision_id TEXT REFERENCES revisions(id),
      draft_revision_id TEXT REFERENCES revisions(id),
      published_at TEXT,
      locale TEXT NOT NULL DEFAULT 'en',
      title TEXT NOT NULL,
      description TEXT,
      linear_issue TEXT,
      pull_requests TEXT NOT NULL DEFAULT '[]',
      blocks TEXT NOT NULL DEFAULT '[]'
    );
  `);
  t.after(() => db.close());
  return db;
}

function insertEntry(db, entry) {
  db.prepare(
    `
    INSERT INTO ec_blueprint_changes (
      id, slug, status, deleted_at, live_revision_id, draft_revision_id,
      published_at, locale, title, description, linear_issue, pull_requests, blocks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    entry.id,
    entry.slug,
    entry.status,
    entry.deleted_at ?? null,
    entry.live_revision_id ?? null,
    entry.draft_revision_id ?? null,
    entry.published_at ?? null,
    entry.locale ?? "en",
    entry.title,
    entry.description ?? null,
    entry.linear_issue ?? "EXAMPLE-1",
    entry.pull_requests ?? "[]",
    entry.blocks ?? "[]",
  );
}

function insertRevision(db, revision) {
  db.prepare(
    `
    INSERT INTO revisions (id, collection, entry_id, data, created_at)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(
    revision.id,
    revision.collection ?? "blueprint_changes",
    revision.entry_id,
    revision.data,
    revision.created_at ?? "2026-10-01T00:00:00.000Z",
  );
}

function queryFrom(db) {
  return (sql, params) => {
    assert.match(
      sql,
      /^\s*SELECT\b/iu,
      "snapshot transport must remain read-only",
    );
    return db.prepare(sql).all(...params);
  };
}

function publishedEntry(overrides = {}) {
  return {
    id: "entry-public",
    slug: "public-change",
    status: "published",
    live_revision_id: "revision-live",
    draft_revision_id: "revision-current-draft",
    published_at: "2026-10-01T00:00:00.000Z",
    locale: "en",
    title: "Live title",
    description: "Live description",
    linear_issue: "EXAMPLE-1",
    pull_requests: "[]",
    blocks: "[]",
    ...overrides,
  };
}

function contentRevision(id, entryId, title, overrides = {}) {
  return {
    id,
    entry_id: entryId,
    data: JSON.stringify({
      title,
      description: `${title} description`,
      linear_issue: "EXAMPLE-1",
      pull_requests: [],
      blocks: [],
      ...overrides,
    }),
  };
}

function runSnapshot(db) {
  return readChangeBuildSnapshot({
    query: queryFrom(db),
    rendererId: "a".repeat(40),
  });
}

test("reads published live content and current/private drafts from SQLite", async (t) => {
  const db = createDatabase(t);
  const published = publishedEntry();
  const privateEntry = {
    id: "entry-private",
    slug: "private-change",
    status: "draft",
    draft_revision_id: "revision-private",
    locale: "en",
    title: "Private row title",
  };
  const deleted = publishedEntry({
    id: "entry-deleted",
    slug: "deleted-change",
    deleted_at: "2026-10-02T00:00:00.000Z",
    live_revision_id: "revision-deleted",
    draft_revision_id: null,
  });

  insertRevision(
    db,
    contentRevision("revision-live", published.id, "Live revision"),
  );
  insertRevision(
    db,
    contentRevision("revision-current-draft", published.id, "Current draft"),
  );
  insertRevision(
    db,
    contentRevision("revision-private", privateEntry.id, "Private draft"),
  );
  insertRevision(
    db,
    contentRevision("revision-deleted", deleted.id, "Deleted live"),
  );
  insertEntry(db, published);
  insertEntry(db, privateEntry);
  insertEntry(db, deleted);

  const snapshot = await runSnapshot(db);
  const publicEntries = snapshot.entries.filter(
    ({ visibility }) => visibility === "public",
  );
  const previews = snapshot.entries.filter(
    ({ visibility }) => visibility === "preview",
  );
  const publicPreview = previews.find(({ id }) => id === published.id);
  const privatePreview = previews.find(({ id }) => id === privateEntry.id);

  assert.equal(publicEntries.length, 1);
  assert.equal(publicEntries[0].data.title, "Live title");
  assert.equal(publicEntries[0].revisionId, "revision-live");
  assert.equal(publicEntries[0].locale, "en");
  assert.equal(
    publicEntries[0].contentHash,
    "f000942392fa1870aa5c3190e908450f4de386c87b0e3253803cc29b80b4d7bf",
  );
  assert.equal(publicPreview.data.title, "Current draft");
  assert.equal(publicPreview.revisionId, "revision-current-draft");
  assert.equal(privatePreview.data.title, "Private draft");
  assert.equal(privatePreview.visibility, "preview");
  assert.equal(
    snapshot.entries.some(({ id }) => id === deleted.id),
    false,
    "deleted content is excluded by the persisted deleted_at value",
  );
  assert.equal(
    publicEntries.some(({ data }) => data.title === "Current draft"),
    false,
    "current draft data never enters the public snapshot",
  );
});

test("rejects a draft revision that belongs to another entry", async (t) => {
  const db = createDatabase(t);
  insertRevision(
    db,
    contentRevision("revision-other-entry", "entry-owner", "Wrong owner"),
  );
  insertEntry(db, {
    id: "entry-target",
    slug: "target-change",
    status: "draft",
    draft_revision_id: "revision-other-entry",
    title: "Target row",
  });

  await assert.rejects(runSnapshot(db), /draft revision identity mismatch/u);
});

test("rejects malformed persisted revision JSON", async (t) => {
  const db = createDatabase(t);
  insertRevision(db, {
    id: "revision-malformed",
    entry_id: "entry-malformed",
    data: "{not-json",
  });
  insertEntry(db, {
    id: "entry-malformed",
    slug: "malformed-change",
    status: "draft",
    draft_revision_id: "revision-malformed",
    title: "Malformed row",
  });

  await assert.rejects(runSnapshot(db), /not valid JSON/u);
});

test("rejects same-slug entries across locales", async (t) => {
  const db = createDatabase(t);
  insertRevision(db, contentRevision("revision-en", "entry-en", "English"));
  insertRevision(db, contentRevision("revision-fr", "entry-fr", "French"));
  insertEntry(db, {
    id: "entry-en",
    slug: "same-slug",
    status: "draft",
    draft_revision_id: "revision-en",
    locale: "en",
    title: "English",
  });
  insertEntry(db, {
    id: "entry-fr",
    slug: "same-slug",
    status: "draft",
    draft_revision_id: "revision-fr",
    locale: "fr",
    title: "French",
  });

  await assert.rejects(runSnapshot(db), /slug collision for same-slug/u);
});

test("accepts native staged slug metadata while keeping the native preview URL on the live slug", async (t) => {
  const db = createDatabase(t);
  const entry = publishedEntry({ slug: "live-change" });
  insertRevision(db, contentRevision("revision-live", entry.id, "Live"));
  insertRevision(
    db,
    contentRevision("revision-current-draft", entry.id, "Draft", {
      _slug: "draft-change",
    }),
  );
  insertEntry(db, entry);
  const snapshot = await runSnapshot(db);
  assert.equal(
    snapshot.entries.find(({ visibility }) => visibility === "public").slug,
    "live-change",
  );
  const preview = snapshot.entries.find(
    ({ visibility }) => visibility === "preview",
  );
  assert.equal(preview.slug, "live-change");
  assert.equal(preview.data.title, "Draft");
  assert.equal(Object.hasOwn(preview.data, "_slug"), false);
});
