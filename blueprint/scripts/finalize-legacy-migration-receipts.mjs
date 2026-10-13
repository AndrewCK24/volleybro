#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finalizeLegacyMigrationReceipts } from "../src/lib/legacy-migration-receipts.ts";

function parseArgs(args) {
  const values = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--") continue;
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (key === "help") values.help = true;
    else {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`Missing value for --${key}`);
      values[key] = value;
      index += 1;
    }
  }
  return values;
}

function printHelp() {
  console.log(`Usage: node blueprint/scripts/finalize-legacy-migration-receipts.mjs \\
  --audit <migration audit.json> --seed <seed.json> \\
  --media-manifest <media-manifest.json> --readback <EmDash drafts API JSON> \\
  --base-url <EmDash origin> --out <new evidence directory>

The read-back must be the complete first page from
/_emdash/api/content/blueprint_changes?status=draft&limit=100, fetched with an
EmDash API token that can read drafts. The script downloads each resolved media
asset and writes receipts only after content and source-image checks pass.`);
}

async function readJson(filename) {
  return JSON.parse(await readFile(path.resolve(filename), "utf8"));
}

function validatedBaseUrl(value) {
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(local && url.protocol === "http:"))
    throw new Error(
      "EmDash base URL must use HTTPS, except for loopback rehearsal.",
    );
  if (url.username || url.password || url.search || url.hash)
    throw new Error(
      "EmDash base URL must not include credentials, query, or fragment.",
    );
  return url;
}

async function digestMedia(baseUrl, storageKey, expectedSize) {
  const url = new URL(
    `/_emdash/api/media/file/${encodeURIComponent(storageKey)}`,
    baseUrl,
  );
  const response = await fetch(url, { redirect: "error" });
  if (!response.ok)
    throw new Error(
      `Media read-back failed for ${storageKey}: HTTP ${response.status}.`,
    );
  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) !== expectedSize)
    throw new Error(`Media size read-back failed for ${storageKey}.`);
  if (!response.body)
    throw new Error(`Media body is missing for ${storageKey}.`);
  const hasher = createHash("sha256");
  const reader = response.body.getReader();
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > expectedSize) {
      await reader.cancel();
      throw new Error(`Media size read-back failed for ${storageKey}.`);
    }
    hasher.update(value);
  }
  return { sha256: hasher.digest("hex"), size };
}

async function run(options) {
  for (const key of [
    "audit",
    "seed",
    "media-manifest",
    "readback",
    "base-url",
    "out",
  ])
    if (!options[key]) throw new Error(`Missing required --${key}.`);

  const outputDirectory = path.resolve(options.out);
  try {
    await access(outputDirectory);
    throw new Error(
      "Output directory already exists; choose a new evidence path.",
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Output directory"))
      throw error;
  }

  const baseUrl = validatedBaseUrl(options["base-url"]);
  const [audit, seed, mediaManifest, readback] = await Promise.all([
    readJson(options.audit),
    readJson(options.seed),
    readJson(options["media-manifest"]),
    readJson(options.readback),
  ]);
  const result = await finalizeLegacyMigrationReceipts({
    audit,
    seed,
    mediaManifest,
    readback,
    readMediaSha256: (storageKey, expectedSize) =>
      digestMedia(baseUrl, storageKey, expectedSize),
  });

  await mkdir(outputDirectory, { recursive: false });
  const auditOutput = {
    snapshot: result.snapshot,
    pageCount: result.pages.length,
    pages: result.pages,
    verifiedAt: new Date().toISOString(),
  };
  await Promise.all([
    writeFile(
      path.join(outputDirectory, "linear-receipts.md"),
      result.receiptMarkdown,
      { flag: "wx" },
    ),
    writeFile(
      path.join(outputDirectory, "readback-audit.json"),
      `${JSON.stringify(auditOutput, null, 2)}\n`,
      { flag: "wx" },
    ),
  ]);
  console.log(
    `Verified ${result.pages.length} legacy Change drafts and their media bytes.`,
  );
  console.log(
    `Final receipts: ${path.join(outputDirectory, "linear-receipts.md")}`,
  );
  console.log(
    `Read-back evidence: ${path.join(outputDirectory, "readback-audit.json")}`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) printHelp();
  else
    run(args).catch((error) => {
      console.error(error instanceof Error ? error.stack : String(error));
      process.exitCode = 1;
    });
}
