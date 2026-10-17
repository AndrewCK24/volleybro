import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { uploadArtifacts } from "../../../build/upload-artifacts.mjs";

const rendererId = "a".repeat(40);
const sha = (value) => createHash("sha256").update(value).digest("hex");

async function fixture(t, options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "artifact-upload-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = [];
  const items = [
    {
      contentId: "change-1",
      revisionId: "live-2",
      visibility: "public",
      body: "<h1>Public</h1>",
    },
    {
      contentId: "change-1",
      revisionId: "draft-3",
      visibility: "preview",
      body: "<h1>Draft</h1>",
    },
  ];
  for (const item of items) {
    const metadata = {
      rendererId,
      contentId: item.contentId,
      slug: "example",
      revisionId: item.revisionId,
      visibility: item.visibility,
      contentSha256: sha(`content:${item.revisionId}`),
      scenarioCount: "2",
    };
    const key = `blueprint-pages/v1/${rendererId}/${item.visibility}/${item.contentId}/${item.revisionId}.html`;
    const body = Buffer.from(item.body);
    await mkdir(path.dirname(path.join(root, key)), { recursive: true });
    await writeFile(path.join(root, key), body);
    files.push({
      key,
      metadata,
      htmlSha256: sha(body),
      bytes: body.byteLength,
    });
  }
  const manifest = {
    version: 1,
    rendererId,
    files,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  };
  if (options.mutate) options.mutate({ root, manifest });
  const calls = [];
  const store = {
    async put(key, body, options) {
      calls.push({ key, body: Buffer.from(body), options });
    },
  };
  return { root, manifest, calls, store };
}

test("uploads verified artifacts before publishing the catalog", async (t) => {
  const input = await fixture(t);
  const result = await uploadArtifacts(input);
  assert.equal(input.calls.length, 3);
  assert.deepEqual(
    input.calls.map(({ key }) => key),
    [
      ...input.manifest.files.map(({ key }) => key),
      `blueprint-pages/v1/${rendererId}/catalog.json`,
    ],
  );
  assert.equal(
    JSON.parse(input.calls.at(-1).body.toString()).entries["change-1"].preview
      .revisionId,
    "draft-3",
  );
  assert.equal(result.artifactCount, 2);
  assert.equal(result.totalBytes, input.manifest.totalBytes);
});

test("rejects modified artifact bytes without publishing the catalog", async (t) => {
  const input = await fixture(t);
  await writeFile(
    path.join(input.root, input.manifest.files[0].key),
    "tampered",
  );
  await assert.rejects(uploadArtifacts(input), /failed verification/);
  assert.equal(
    input.calls.some(({ key }) => key.endsWith("/catalog.json")),
    false,
  );
});

test("rejects unsafe or noncanonical keys before any upload", async (t) => {
  const input = await fixture(t, {
    mutate({ manifest }) {
      manifest.files[0].key = "../private/draft.html";
    },
  });
  await assert.rejects(uploadArtifacts(input), /Invalid artifact identity/);
  assert.equal(input.calls.length, 0);
});

test("leaves the catalog untouched if an artifact upload fails", async (t) => {
  const input = await fixture(t);
  input.store.put = async (key, body, options) => {
    input.calls.push({ key, body: Buffer.from(body), options });
    if (input.calls.length === 2) throw new Error("simulated store failure");
  };
  await assert.rejects(uploadArtifacts(input), /simulated store failure/);
  assert.equal(
    input.calls.some(({ key }) => key.endsWith("/catalog.json")),
    false,
  );
});
