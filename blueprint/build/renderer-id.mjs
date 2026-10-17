import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

export async function blueprintRendererId(root) {
  const hash = createHash("sha256");
  async function include(relative) {
    const absolute = path.resolve(root, relative);
    const stat = await fs.stat(absolute);
    if (stat.isDirectory()) {
      for (const name of (await fs.readdir(absolute)).sort()) {
        if (name.includes(".test.") || name.includes(".itest.")) continue;
        await include(path.join(relative, name));
      }
    } else {
      hash.update(relative.replaceAll(path.sep, "/"));
      hash.update("\0");
      hash.update(await fs.readFile(absolute));
      hash.update("\0");
    }
  }
  for (const file of [
    "src",
    "build",
    "content",
    "package.json",
    ".emdash/seed.json",
    "astro.config.mjs",
    "wrangler.jsonc",
    "../pnpm-lock.yaml",
  ]) {
    await include(file);
  }
  return hash.digest("hex");
}
