import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { blueprintRendererId } from "./renderer-id.mjs";
import { changeArtifactKey } from "../src/lib/change-artifact.ts";

const MAX_GENERATION_BYTES = 64 * 1024 * 1024;

export async function blueprintStaticGeneration(root) {
  const rendererId = await blueprintRendererId(root);
  const source = process.env.BLUEPRINT_BUILD_SOURCE;
  if (source) {
    const url = new URL(source);
    if (url.protocol !== "http:" || url.hostname !== "127.0.0.1") {
      throw new Error(
        "Change build input must come from the private local build process.",
      );
    }
  }
  let clientDirectory;
  return {
    name: "blueprint-static-generation",
    hooks: {
      "astro:config:setup": ({ updateConfig, injectRoute }) => {
        updateConfig({
          vite: {
            define: {
              "import.meta.env.BLUEPRINT_RENDERER_ID":
                JSON.stringify(rendererId),
            },
            plugins: [
              {
                name: "blueprint-private-build-source",
                resolveId(id) {
                  return id === "virtual:blueprint-build-source"
                    ? "\0blueprint-build-source"
                    : null;
                },
                load(id) {
                  return id === "\0blueprint-build-source"
                    ? `export const snapshotUrl = ${JSON.stringify(source ?? "")};`
                    : null;
                },
              },
            ],
          },
        });
        injectRoute({
          pattern: "/__blueprint_build/[view]/[contentId]/[revisionId]",
          entrypoint: path.join(root, "build/change-page.astro"),
          prerender: true,
        });
      },
      "astro:config:done": ({ config }) => {
        clientDirectory = fileURLToPath(config.build.client);
      },
      "astro:build:done": async () => {
        if (!source) return;
        const generatedDirectory = path.join(
          clientDirectory,
          "__blueprint_build",
        );
        const privateDirectory = path.join(root, ".emdash/page-artifacts");
        let stagingDirectory;
        try {
          const response = await fetch(source, { redirect: "error" });
          if (!response.ok)
            throw new Error("Change build input disappeared before staging.");
          const snapshot = await response.json();
          if (snapshot.version !== 1 || snapshot.rendererId !== rendererId) {
            throw new Error("Change artifact renderer identity mismatch.");
          }
          if ((await blueprintRendererId(root)) !== rendererId) {
            throw new Error(
              "Renderer source changed during the build; artifacts were not staged.",
            );
          }
          stagingDirectory = await fs.mkdtemp(
            path.join(root, ".emdash/.page-artifacts-"),
          );
          await fs.chmod(stagingDirectory, 0o700);
          const catalog = {
            version: 1,
            rendererId,
            entries: Object.create(null),
          };
          const files = [];
          let totalBytes = 0;
          for (const entry of snapshot.entries) {
            if (
              entry.visibility !== "public" &&
              entry.visibility !== "preview"
            ) {
              throw new Error("Invalid Change artifact visibility.");
            }
            const key = changeArtifactKey(
              rendererId,
              entry.id,
              entry.revisionId,
              entry.visibility,
            );
            const html = await fs.readFile(
              path.join(
                generatedDirectory,
                entry.visibility,
                entry.id,
                `${entry.revisionId}.html`,
              ),
            );
            totalBytes += html.byteLength;
            if (totalBytes > MAX_GENERATION_BYTES)
              throw new Error(
                "Change artifact generation exceeds the Free storage budget.",
              );
            const metadata = {
              rendererId,
              contentId: entry.id,
              slug: entry.slug,
              revisionId: entry.revisionId,
              visibility: entry.visibility,
              contentSha256: entry.contentHash,
              scenarioCount: String(entry.scenarioCount),
            };
            const output = path.join(stagingDirectory, key);
            await fs.mkdir(path.dirname(output), {
              recursive: true,
              mode: 0o700,
            });
            await fs.writeFile(output, html, { mode: 0o600 });
            catalog.entries[entry.id] ??= {};
            catalog.entries[entry.id][entry.visibility] = metadata;
            files.push({
              key,
              metadata,
              htmlSha256: createHash("sha256").update(html).digest("hex"),
              bytes: html.byteLength,
            });
          }
          await fs.writeFile(
            path.join(stagingDirectory, "catalog.json"),
            JSON.stringify(catalog),
            { mode: 0o600 },
          );
          await fs.writeFile(
            path.join(stagingDirectory, "manifest.json"),
            JSON.stringify({
              version: 1,
              rendererId,
              files,
              totalBytes,
            }),
            { mode: 0o600 },
          );
          const previousDirectory = `${privateDirectory}.previous`;
          await fs.rm(previousDirectory, { recursive: true, force: true });
          let hasPrevious = false;
          try {
            await fs.rename(privateDirectory, previousDirectory);
            hasPrevious = true;
          } catch (error) {
            if (error.code !== "ENOENT") throw error;
          }
          try {
            await fs.rename(stagingDirectory, privateDirectory);
          } catch (error) {
            if (hasPrevious)
              await fs.rename(previousDirectory, privateDirectory);
            throw error;
          }
          await fs.rm(previousDirectory, { recursive: true, force: true });
        } finally {
          // Build-only routes contain drafts and must never enter deployed assets.
          await fs.rm(generatedDirectory, { recursive: true, force: true });
          if (stagingDirectory)
            await fs.rm(stagingDirectory, { recursive: true, force: true });
        }
      },
    },
  };
}
