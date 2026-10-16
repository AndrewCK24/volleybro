import {
  changeDataSchema,
  acceptedContentHashFromValidatedChange,
} from "../src/lib/emdash-change-record.ts";
import { scenarioCount } from "../src/lib/github-change-data.ts";

const CHANGE_COLLECTION = "blueprint_changes";
const CHANGE_TABLE = "ec_blueprint_changes";
const REVISION_TABLE = "revisions";
const RENDERER_ID = /^[a-f0-9]{40,64}$/u;

const ENTRY_SQL = `
  SELECT id, slug, status, deleted_at, live_revision_id, draft_revision_id,
         published_at, locale
  FROM ${CHANGE_TABLE}
  WHERE deleted_at IS NULL
  ORDER BY id
`;

const LIVE_CONTENT_SQL = `
  SELECT id, slug, status, deleted_at, live_revision_id, published_at,
         title, description, linear_issue, pull_requests, blocks
  FROM ${CHANGE_TABLE}
  WHERE id = ?
`;

const LIVE_REVISION_SQL = `
  SELECT id, collection, entry_id
  FROM ${REVISION_TABLE}
  WHERE id = ?
`;

const DRAFT_REVISION_SQL = `
  SELECT id, collection, entry_id, data
  FROM ${REVISION_TABLE}
  WHERE id = ?
`;

function fail(message) {
  throw new Error(`Change build snapshot: ${message}`);
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) fail(`invalid ${name}.`);
  return value;
}

function parseJsonObject(value, name) {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      fail(`${name} is not valid JSON.`);
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    fail(`${name} must be a JSON object.`);
  return parsed;
}

function parseJsonArray(value, name) {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      fail(`${name} is not valid JSON.`);
    }
  }
  if (!Array.isArray(parsed)) fail(`${name} must be a JSON array.`);
  return parsed;
}

function localeMetadata(value) {
  return requiredString(value, "entry locale");
}

function validateEntries(rows) {
  const ids = new Set();
  const slugOwners = new Map();
  const localeSlugOwners = new Map();

  for (const row of rows) {
    if (!row || typeof row !== "object" || Array.isArray(row))
      fail("entry query returned an invalid row.");
    const id = requiredString(row.id, "entry id");
    const slug = requiredString(row.slug, `slug for ${id}`);
    const localeKey = String(localeMetadata(row.locale)).toLowerCase();
    if (ids.has(id)) fail(`duplicate entry id ${id}.`);
    ids.add(id);

    const previousLocaleOwner = localeSlugOwners.get(`${localeKey}\0${slug}`);
    if (previousLocaleOwner)
      fail(`locale/slug collision for ${localeKey}/${slug}.`);
    localeSlugOwners.set(`${localeKey}\0${slug}`, id);

    const previousSlugOwner = slugOwners.get(slug);
    if (previousSlugOwner)
      fail(`slug collision for ${slug} (${previousSlugOwner} and ${id}).`);
    slugOwners.set(slug, id);
  }
}

async function readRevision(query, entry, revisionId, expectedField) {
  const id = requiredString(
    revisionId,
    `${expectedField} revision id for ${entry.slug}`,
  );
  const sql =
    expectedField === "draft" ? DRAFT_REVISION_SQL : LIVE_REVISION_SQL;
  const rows = await query(sql, [id]);
  if (!Array.isArray(rows))
    fail(`revision query for ${entry.slug} did not return rows.`);
  if (rows.length !== 1)
    fail(`missing or duplicate ${expectedField} revision for ${entry.slug}.`);
  const revision = rows[0];
  if (
    revision?.id !== id ||
    revision.collection !== CHANGE_COLLECTION ||
    revision.entry_id !== entry.id
  ) {
    fail(`${expectedField} revision identity mismatch for ${entry.slug}.`);
  }
  return revision;
}

async function readLiveContent(query, entry) {
  const rows = await query(LIVE_CONTENT_SQL, [entry.id]);
  if (!Array.isArray(rows))
    fail(`live content query for ${entry.slug} did not return rows.`);
  if (rows.length !== 1)
    fail(`missing or duplicate live content for ${entry.slug}.`);
  const content = rows[0];
  if (
    content?.id !== entry.id ||
    content.slug !== entry.slug ||
    content.status !== "published" ||
    content.deleted_at !== null ||
    content.live_revision_id !== entry.live_revision_id
  ) {
    fail(`published content identity changed for ${entry.slug}.`);
  }
  return content;
}

function publishedContent(entry, changeDataSchema) {
  const raw = {
    title: entry.title,
    description: entry.description ?? undefined,
    linear_issue: entry.linear_issue ?? undefined,
    pull_requests: parseJsonArray(
      entry.pull_requests ?? [],
      `pull_requests for ${entry.slug}`,
    ),
    blocks: parseJsonArray(entry.blocks, `blocks for ${entry.slug}`),
    publishedAt: entry.published_at,
  };
  const result = changeDataSchema.safeParse(raw);
  if (!result.success)
    fail(
      `published content for ${entry.slug} does not match the accepted schema.`,
    );
  return result.data;
}

function previewContent(revision, entry, changeDataSchema) {
  const raw = parseJsonObject(
    revision.data,
    `draft revision data for ${entry.slug}`,
  );
  const {
    locale: _locale,
    publishedAt: _publishedAt,
    _slug: stagedSlug,
    ...contentData
  } = raw;
  if (
    stagedSlug !== undefined &&
    (typeof stagedSlug !== "string" || !stagedSlug)
  ) {
    fail(`invalid native staged slug for ${entry.slug}.`);
  }
  const result = changeDataSchema.safeParse(contentData);
  if (!result.success)
    fail(`draft content for ${entry.slug} does not match the accepted schema.`);
  return result.data;
}

async function makeSnapshotEntry({
  entry,
  revisionId,
  visibility,
  data,
  scenarioCount,
}) {
  return {
    id: entry.id,
    slug: entry.slug,
    locale: localeMetadata(entry.locale),
    visibility,
    revisionId,
    data,
    contentHash: await acceptedContentHashFromValidatedChange(data),
    scenarioCount: scenarioCount(data.blocks),
  };
}

/**
 * Build immutable renderer input from the published EmDash rows and the current
 * draft revision. Node 24 runs the canonical repository TypeScript schema.
 * `query(sql, params)` is an injected read-only D1 transport returning row arrays.
 */
export async function readChangeBuildSnapshot({ query, rendererId }) {
  if (typeof query !== "function") fail("query must be a function.");
  if (!RENDERER_ID.test(rendererId ?? "")) fail("invalid rendererId.");

  const rows = await query(ENTRY_SQL, []);
  if (!Array.isArray(rows)) fail("entry query did not return rows.");
  validateEntries(rows);

  const entries = [];
  for (const entry of rows) {
    const isPublished = entry.status === "published";
    const liveRevisionId = entry.live_revision_id;
    const draftRevisionId = entry.draft_revision_id;

    let liveRevision;
    let liveContent;
    if (isPublished) {
      liveRevision = await readRevision(query, entry, liveRevisionId, "live");
      liveContent = await readLiveContent(query, entry);
      const data = publishedContent(liveContent, changeDataSchema);
      entries.push(
        await makeSnapshotEntry({
          entry,
          revisionId: liveRevision.id,
          visibility: "public",
          data,
          scenarioCount,
        }),
      );
    }

    if (draftRevisionId) {
      const draftRevision = await readRevision(
        query,
        entry,
        draftRevisionId,
        "draft",
      );
      const data = previewContent(draftRevision, entry, changeDataSchema);
      entries.push(
        await makeSnapshotEntry({
          entry,
          revisionId: draftRevision.id,
          visibility: "preview",
          data,
          scenarioCount,
        }),
      );
    } else if (isPublished) {
      const data = publishedContent(liveContent, changeDataSchema);
      entries.push(
        await makeSnapshotEntry({
          entry,
          revisionId: liveRevision.id,
          visibility: "preview",
          data,
          scenarioCount,
        }),
      );
    }
  }

  const currentRows = await query(ENTRY_SQL, []);
  if (JSON.stringify(currentRows) !== JSON.stringify(rows)) {
    fail(
      "content lifecycle changed while reading the snapshot; retry the build.",
    );
  }
  return { version: 1, rendererId, entries };
}
