import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { blueprintRendererId } from "./renderer-id.mjs";
import { readChangeBuildSnapshot } from "./read-change-build-snapshot.mjs";
import { createD1SnapshotReader } from "./d1-snapshot-reader.mjs";
import {
  changeDataSchema,
  acceptedContentHashFromValidatedChange,
} from "../src/lib/emdash-change-record.ts";
import { scenarioCount } from "../src/lib/github-change-data.ts";
import { changeArtifactKey } from "../src/lib/change-artifact.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const options = new Map();
for (let index = 0; index < args.length; index++) {
  const flag = args[index];
  if (
    !["--snapshot", "--database-file", "--remote"].includes(flag) ||
    options.has(flag)
  ) {
    throw new Error("Unknown or duplicate Change build argument.");
  }
  if (flag === "--remote") options.set(flag, true);
  else {
    const next = args[++index];
    if (!next || next.startsWith("--"))
      throw new Error(`${flag} requires a value.`);
    options.set(flag, next);
  }
}
const value = (flag) => options.get(flag);
const rendererId = await blueprintRendererId(root);
let database;
let snapshot;

async function validateSnapshot(input) {
  if (
    input?.version !== 1 ||
    input.rendererId !== rendererId ||
    !Array.isArray(input.entries)
  )
    throw new Error("Invalid Change build snapshot.");
  const seen = new Set();
  const entries = [];
  const owners = new Map();
  for (const entry of input.entries) {
    if (entry.visibility !== "public" && entry.visibility !== "preview")
      throw new Error("Invalid Change visibility.");
    changeArtifactKey(rendererId, entry.id, entry.revisionId, entry.visibility);
    const identity = `${entry.id}:${entry.visibility}`;
    if (
      seen.has(identity) ||
      (owners.has(entry.slug) && owners.get(entry.slug) !== entry.id) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.slug)
    )
      throw new Error("Invalid or duplicate Change build identity.");
    seen.add(identity);
    owners.set(entry.slug, entry.id);
    const data = changeDataSchema.parse(entry.data);
    entries.push({
      ...entry,
      data,
      contentHash: await acceptedContentHashFromValidatedChange(data),
      scenarioCount: scenarioCount(data.blocks),
    });
  }
  return { version: 1, rendererId, entries };
}

const filename = value("--snapshot");
const databaseFile = value("--database-file");
const remote = options.has("--remote");
if (
  [Boolean(filename), Boolean(databaseFile), remote].filter(Boolean).length > 1
) {
  throw new Error("Choose exactly one Change snapshot source.");
}
try {
  if (filename) {
    snapshot = await validateSnapshot(
      JSON.parse(await fs.readFile(path.resolve(filename), "utf8")),
    );
  } else if (databaseFile) {
    const { DatabaseSync } = await import("node:sqlite");
    database = new DatabaseSync(path.resolve(databaseFile), { readOnly: true });
    snapshot = await readChangeBuildSnapshot({
      rendererId,
      query: async (sql, params) => database.prepare(sql).all(...params),
    });
  } else if (remote) {
    const { unstable_readConfig } = await import("wrangler");
    const config = unstable_readConfig({
      config: path.join(root, "wrangler.jsonc"),
    });
    const db = config.d1_databases?.find(
      (binding) => binding.binding === "BLUEPRINT_DB",
    );
    const account = process.env.CLOUDFLARE_ACCOUNT_ID ?? config.account_id;
    const token = process.env.CLOUDFLARE_API_TOKEN;
    if (!db?.database_id || !account || !token)
      throw new Error(
        "The authorized Cloudflare build identity is not configured.",
      );
    const reader = createD1SnapshotReader({
      accountId: account,
      databaseId: db.database_id,
      token,
    });
    snapshot = await readChangeBuildSnapshot({
      rendererId,
      query: reader.query,
    });
    console.log(
      `Change snapshot: ${snapshot.entries.length} views, ${reader.rowsRead} D1 rows read.`,
    );
  }
} finally {
  database?.close();
}

let server;
const env = { ...process.env };
if (snapshot) {
  const requestPath = `/${randomBytes(24).toString("hex")}`;
  const body = Buffer.from(JSON.stringify(snapshot));
  server = createServer((request, response) => {
    if (request.method !== "GET" || request.url !== requestPath) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    response.end(body);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  env.BLUEPRINT_BUILD_SOURCE = `http://127.0.0.1:${server.address().port}${requestPath}`;
} else {
  delete env.BLUEPRINT_BUILD_SOURCE;
  console.log(
    "Renderer build only: no CMS snapshot configured; no Change artifacts will be produced.",
  );
}

async function astro(command) {
  const child = spawn("pnpm", ["exec", "astro", command], {
    cwd: root,
    env,
    stdio: "inherit",
  });
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  if (code !== 0) throw new Error(`Astro ${command} failed (${code}).`);
}
try {
  await astro("check");
  await astro("build");
} finally {
  await fs.rm(path.join(root, "dist/client/__blueprint_build"), {
    recursive: true,
    force: true,
  });
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
