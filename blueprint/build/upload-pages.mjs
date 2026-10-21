import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { getPlatformProxy, unstable_readConfig } from "wrangler";
import { blueprintRendererId } from "./renderer-id.mjs";
import { uploadArtifacts } from "./upload-artifacts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const remote = args[0] === "--remote" && args.length === 1;
const local =
  args[0] === "--local" && args[1] === "--persist-to" && args.length === 3;
if (!remote && !local)
  throw new Error("Use --remote or --local --persist-to <directory>.");
const directory = path.join(root, ".emdash/page-artifacts");
const manifest = JSON.parse(
  await fs.readFile(path.join(directory, "manifest.json"), "utf8"),
);
if (manifest.rendererId !== (await blueprintRendererId(root))) {
  throw new Error(
    "Build artifacts do not match the current renderer; rebuild first.",
  );
}
const source = unstable_readConfig({
  config: path.join(root, "wrangler.jsonc"),
});
const binding = source.r2_buckets?.find(
  (item) => item.binding === "BLUEPRINT_PAGES",
);
const media = source.r2_buckets?.find(
  (item) => item.binding === "BLUEPRINT_MEDIA",
);
if (!binding?.bucket_name || binding.bucket_name === media?.bucket_name) {
  throw new Error("A separate private BLUEPRINT_PAGES bucket is required.");
}
const temporary = await fs.mkdtemp(
  path.join(os.tmpdir(), "blueprint-artifact-upload-"),
);
let proxy;
try {
  const configPath = path.join(temporary, "wrangler.json");
  await fs.writeFile(
    configPath,
    JSON.stringify({
      name: "blueprint-artifact-upload",
      compatibility_date: source.compatibility_date,
      ...(source.account_id ? { account_id: source.account_id } : {}),
      r2_buckets: [{ ...binding, remote }],
    }),
    { mode: 0o600 },
  );
  proxy = await getPlatformProxy({
    configPath,
    envFiles: [],
    remoteBindings: remote,
    persist: local ? { path: path.resolve(args[2], "v3") } : false,
  });
  const bucket = proxy.env.BLUEPRINT_PAGES;
  const result = await uploadArtifacts({
    root: directory,
    manifest,
    store: {
      async put(key, body, options) {
        await bucket.put(key, body, options);
        const stored = await bucket.get(key);
        if (!stored) throw new Error("Artifact read-back failed.");
        const bytes = await stored.arrayBuffer();
        const digest = (value) =>
          createHash("sha256").update(value).digest("hex");
        if (digest(Buffer.from(bytes)) !== digest(body))
          throw new Error("Artifact read-back digest mismatch.");
        for (const [name, value] of Object.entries(options.customMetadata)) {
          if (stored.customMetadata?.[name] !== value)
            throw new Error("Artifact read-back metadata mismatch.");
        }
      },
    },
  });
  console.log(
    `Verified ${result.artifactCount} Change artifacts (${result.totalBytes} bytes); catalog stored last.`,
  );
} finally {
  await proxy?.dispose();
  await fs.rm(temporary, { recursive: true, force: true });
}
