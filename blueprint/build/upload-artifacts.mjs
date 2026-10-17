import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import path from "node:path";

const MAX_UPLOAD_BYTES = 64 * 1024 * 1024;
const IDENTIFIER = /^[A-Za-z0-9_-]{1,128}$/u;
const RENDERER_ID = /^[a-f0-9]{40,64}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;

function artifactKey(rendererId, metadata) {
  return `blueprint-pages/v1/${rendererId}/${metadata.visibility}/${metadata.contentId}/${metadata.revisionId}.html`;
}

function catalogKey(rendererId) {
  return `blueprint-pages/v1/${rendererId}/catalog.json`;
}

function validateManifest(manifest) {
  if (
    !manifest ||
    typeof manifest !== "object" ||
    Array.isArray(manifest) ||
    manifest.version !== 1 ||
    !RENDERER_ID.test(manifest.rendererId) ||
    !Array.isArray(manifest.files) ||
    !Number.isSafeInteger(manifest.totalBytes) ||
    manifest.totalBytes < 0 ||
    manifest.totalBytes > MAX_UPLOAD_BYTES
  )
    throw new Error("Invalid artifact manifest.");

  let measuredTotal = 0;
  const identities = new Set();
  for (const file of manifest.files) {
    const metadata = file?.metadata;
    if (
      !metadata ||
      typeof metadata !== "object" ||
      metadata.rendererId !== manifest.rendererId ||
      typeof metadata.slug !== "string" ||
      !metadata.slug ||
      !IDENTIFIER.test(metadata.contentId) ||
      !IDENTIFIER.test(metadata.revisionId) ||
      (metadata.visibility !== "public" && metadata.visibility !== "preview") ||
      !SHA256.test(metadata.contentSha256) ||
      typeof metadata.scenarioCount !== "string" ||
      !/^(?:0|[1-9][0-9]*)$/u.test(metadata.scenarioCount) ||
      !Number.isSafeInteger(Number(metadata.scenarioCount)) ||
      file.key !== artifactKey(manifest.rendererId, metadata) ||
      !SHA256.test(file.htmlSha256) ||
      !Number.isSafeInteger(file.bytes) ||
      file.bytes < 0
    )
      throw new Error("Invalid artifact identity or metadata.");
    const identity = `${metadata.contentId}\0${metadata.visibility}`;
    if (identities.has(identity))
      throw new Error("Duplicate artifact identity.");
    identities.add(identity);
    measuredTotal += file.bytes;
    if (measuredTotal > MAX_UPLOAD_BYTES)
      throw new Error("Artifact upload exceeds the storage budget.");
  }
  if (measuredTotal !== manifest.totalBytes)
    throw new Error("Artifact manifest byte total mismatch.");
}

async function readArtifact(root, key) {
  if (typeof key !== "string" || key.startsWith("/") || key.includes("\\")) {
    throw new Error("Unsafe artifact path.");
  }
  const rootPath = await realpath(root);
  const filePath = path.resolve(rootPath, key);
  const relative = path.relative(rootPath, filePath);
  if (
    !relative ||
    relative.startsWith(`..${path.sep}`) ||
    relative === ".." ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Unsafe artifact path.");
  }
  const [actualPath, stat] = await Promise.all([
    realpath(filePath),
    lstat(filePath),
  ]);
  const actualRelative = path.relative(rootPath, actualPath);
  if (
    actualRelative.startsWith(`..${path.sep}`) ||
    actualRelative === ".." ||
    path.isAbsolute(actualRelative) ||
    !stat.isFile()
  )
    throw new Error(
      "Artifact path is not a regular file inside the upload root.",
    );
  return readFile(actualPath);
}

/**
 * Uploads an already validated static-generation manifest. The store must be a
 * private artifact bucket: the final catalog is the visibility switch, not an
 * access-control boundary for a public object-download endpoint.
 */
export async function uploadArtifacts({ root, manifest, store }) {
  if (!store || typeof store.put !== "function")
    throw new TypeError("A store.put adapter is required.");
  validateManifest(manifest);

  const entries = Object.create(null);
  let totalBytes = 0;
  for (const file of manifest.files) {
    const html = await readArtifact(root, file.key);
    if (
      html.byteLength !== file.bytes ||
      createHash("sha256").update(html).digest("hex") !== file.htmlSha256
    )
      throw new Error(`Artifact bytes failed verification: ${file.key}`);

    await store.put(file.key, html, {
      httpMetadata: { contentType: "text/html; charset=utf-8" },
      customMetadata: file.metadata,
    });
    totalBytes += html.byteLength;
    entries[file.metadata.contentId] ??= Object.create(null);
    entries[file.metadata.contentId][file.metadata.visibility] = file.metadata;
  }

  const catalog = {
    version: 1,
    rendererId: manifest.rendererId,
    entries,
  };
  const catalogBytes = Buffer.from(JSON.stringify(catalog));
  await store.put(catalogKey(manifest.rendererId), catalogBytes, {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-store",
    },
    customMetadata: {
      rendererId: manifest.rendererId,
      artifactCount: String(manifest.files.length),
    },
  });
  return {
    artifactCount: manifest.files.length,
    totalBytes,
    catalogKey: catalogKey(manifest.rendererId),
  };
}
