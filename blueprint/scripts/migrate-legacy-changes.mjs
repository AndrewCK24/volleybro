#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse, parseFragment, serialize, serializeOuter } from "parse5";
import {
  acceptedContentHash,
  changeDataSchema,
} from "../src/lib/emdash-change-record.ts";
import { sanitizeLegacyHtml } from "../src/lib/sanitize-legacy-html.ts";
import {
  parseAllowedPullRequestUrl,
  scenarioCount,
} from "../src/lib/github-change-data.ts";
import { prepareLinearG1Markdown } from "../src/lib/linear-g1-markdown.ts";
import { parseCliArgs } from "./parse-cli-args.ts";

const SNAPSHOT = "f010a9e020be8a342a7c7bafc31e2a361565135d";
const REQUIRED_NO_PR_SLUGS = ["record-flows", "sync-recording"];
const PR_URL = (number) =>
  `https://github.com/andrewck24/volleybro/pull/${number}`;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeDocument(content) {
  return `${content.replace(/\r\n?/gu, "\n").trimEnd()}\n`;
}

function printHelp() {
  console.log(`Usage: node blueprint/scripts/migrate-legacy-changes.mjs \\
  --store <fixed snapshot extraction> --rendered <legacy static /changes output> \\
  --manifest <45-row evidence JSON> --pull-requests <GitHub PR export JSON> \\
  --git-root <repository containing snapshot commit> --renderer-root <pinned legacy renderer checkout> \\
  --project-spec <accepted project G1 Team Doc export> --out <disposable transfer directory> \\
  [--g1-specs <accepted G1 documents JSON; matching slugs merge, other slugs create pages>]`);
}

function textContent(node) {
  if (node.nodeName === "#text") return node.value;
  return (node.childNodes ?? []).map(textContent).join("");
}

function attr(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function walk(node, predicate, result = []) {
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes ?? []) walk(child, predicate, result);
  return result;
}

async function filesBelow(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink())
      throw new Error(
        `Snapshot contains an unsupported symbolic link: ${path.join(directory, entry.name)}`,
      );
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesBelow(full, base)));
    else if (entry.isFile())
      files.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return files.sort();
}

function gitOutput(gitRoot, args, encoding = "utf8") {
  return execFileSync("git", args, {
    cwd: gitRoot,
    encoding,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function rendererOverlaySha256(rendererRoot) {
  const tracked = gitOutput(rendererRoot, [
    "diff",
    "--binary",
    "HEAD",
    "--",
    "blueprint",
  ]);
  const untrackedPaths = gitOutput(rendererRoot, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "--",
    "blueprint",
  ])
    .split("\n")
    .filter((file) => file && lstatSync(path.join(rendererRoot, file)).isFile())
    .sort();
  const untracked = untrackedPaths
    .map((file) => `${file}\0${readFileSync(path.join(rendererRoot, file))}`)
    .join("\0");
  return sha256(`${tracked}\0${untracked}`);
}

async function verifySnapshotFiles(storeRoot, gitRoot, snapshot, slugs) {
  for (const slug of slugs) {
    const localFiles = await filesBelow(path.join(storeRoot, slug));
    const treeFiles = gitOutput(gitRoot, [
      "ls-tree",
      "-r",
      "-z",
      "--name-only",
      snapshot,
      "--",
      slug,
    ])
      .split("\0")
      .filter(Boolean)
      .map((file) => file.slice(slug.length + 1))
      .sort();
    if (JSON.stringify(localFiles) !== JSON.stringify(treeFiles)) {
      throw new Error(
        `${slug}: extracted file tree does not match the fixed Git snapshot.`,
      );
    }
    for (const relative of localFiles) {
      const expected = gitOutput(
        gitRoot,
        ["show", `${snapshot}:${slug}/${relative}`],
        null,
      );
      const actual = await readFile(
        path.join(storeRoot, slug, ...relative.split("/")),
      );
      if (!Buffer.from(expected).equals(actual))
        throw new Error(
          `${slug}/${relative}: bytes do not match the fixed Git snapshot.`,
        );
    }
  }
}

function readFrontmatter(indexMdx, slug) {
  const match = indexMdx.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  if (!match) throw new Error(`${slug}: index.mdx has no YAML frontmatter.`);
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/u)) {
    const entry = line.match(/^(title|description):\s*(.*)$/u);
    if (!entry) continue;
    const raw = entry[2];
    let value = raw;
    if (raw.startsWith('"')) value = JSON.parse(raw);
    else if (raw.startsWith("'")) value = raw.slice(1, -1).replace(/''/gu, "'");
    fields.set(entry[1], value);
  }
  const title = fields.get("title");
  if (typeof title !== "string" || !title.trim())
    throw new Error(`${slug}: page title is missing.`);
  const description = fields.get("description");
  if (description !== undefined && typeof description !== "string")
    throw new Error(`${slug}: page description is invalid.`);
  return {
    title: title.trim(),
    ...(description ? { description: description.trim() } : {}),
  };
}

function extractRenderedContent(html, slug) {
  const document = parse(html);
  const articles = walk(
    document,
    (node) => node.tagName === "article" && attr(node, "id") === "nd-page",
  );
  if (articles.length !== 1)
    throw new Error(`${slug}: expected exactly one rendered Change article.`);
  const mains = walk(
    articles[0],
    (node) =>
      node.tagName === "main" && node.parentNode?.tagName === "astro-slot",
  );
  if (mains.length !== 1)
    throw new Error(`${slug}: expected exactly one rendered page main.`);
  const main = mains[0];
  const headers = main.childNodes.filter((node) => node.tagName === "header");
  if (headers.length !== 1)
    throw new Error(
      `${slug}: rendered title/status header is missing or ambiguous.`,
    );
  const htmlContent = main.childNodes
    .filter((node) => node !== headers[0])
    .map(serializeOuter)
    .join("");
  if (!htmlContent.trim())
    throw new Error(`${slug}: rendered historical page body is empty.`);
  if (!htmlContent.includes('id="proposal"'))
    throw new Error(`${slug}: rendered Proposal anchor is missing.`);
  return htmlContent;
}

function localImageSources(proposal) {
  const sources = [];
  const pattern = /!\[([^\]]*)\]\((\.\/[^)]+)\)/gu;
  for (const match of proposal.matchAll(pattern)) {
    sources.push({ alt: match[1], filename: path.posix.basename(match[2]) });
  }
  return sources;
}

function attachMediaMarkers(html, slug, sourceImages, storeRoot, snapshot) {
  if (sourceImages.length === 0) return { html, blocks: [], sourceFiles: [] };
  const fragment = parseFragment(html);
  const images = walk(fragment, (node) => node.tagName === "img");
  if (images.length !== sourceImages.length) {
    throw new Error(
      `${slug}: source has ${sourceImages.length} local images but the pinned renderer produced ${images.length} image nodes.`,
    );
  }
  const unused = [...sourceImages];
  const mediaBlocks = [];
  const sourceFiles = [];
  for (const image of images) {
    const alt = attr(image, "alt") ?? "";
    const index = unused.findIndex((source) => source.alt === alt);
    if (index < 0)
      throw new Error(
        `${slug}: rendered image alt text does not match a source asset.`,
      );
    const [source] = unused.splice(index, 1);
    const bytes = readContainedImage(
      path.join(storeRoot, slug, "proposal.mdx"),
      source.filename,
      storeRoot,
      slug,
    );
    const digest = sha256(bytes);
    const key = `legacy-image-${slug}-${digest.slice(0, 12)}`;
    image.attrs = image.attrs.filter(
      (attribute) =>
        attribute.name !== "src" && attribute.name !== "data-emdash-media-key",
    );
    image.attrs.push({ name: "data-emdash-media-key", value: key });
    const rawUrl = `https://raw.githubusercontent.com/andrewck24/volleybro/${snapshot}/${slug}/${source.filename}`;
    mediaBlocks.push({
      _type: "legacy_media",
      _version: 1,
      key,
      sha256: digest,
      alt,
      asset: {
        $media: { url: rawUrl, alt, filename: `${slug}-${source.filename}` },
      },
    });
    sourceFiles.push({
      filename: source.filename,
      key,
      sha256: digest,
      size: bytes.byteLength,
      sourceUrl: rawUrl,
    });
  }
  if (unused.length > 0)
    throw new Error(`${slug}: not all source images were rendered.`);
  return { html: serialize(fragment), blocks: mediaBlocks, sourceFiles };
}

function readContainedImage(proposalPath, filename, storeRoot, slug) {
  const assetPath = path.resolve(path.dirname(proposalPath), filename);
  const pageRoot = path.resolve(storeRoot, slug);
  if (!assetPath.startsWith(`${pageRoot}${path.sep}`))
    throw new Error(`${slug}: image path escapes the page directory.`);
  return readFileSync(assetPath);
}

function scenarioRecords(html, slug) {
  const fragment = parseFragment(html);
  const labels = ["GIVEN", "WHEN", "THEN"];
  const cards = walk(fragment, (node) => {
    if (node.tagName !== "div" || attr(node, "data-slot") !== "card")
      return false;
    const found = walk(
      node,
      (child) =>
        child.tagName === "span" && labels.includes(textContent(child).trim()),
    );
    return labels.every(
      (label) =>
        found.filter((span) => textContent(span).trim() === label).length === 1,
    );
  });
  const counts = Object.fromEntries(
    labels.map((label) => [
      label,
      walk(
        fragment,
        (node) => node.tagName === "span" && textContent(node).trim() === label,
      ).length,
    ]),
  );
  if (!Object.values(counts).every((count) => count === counts.GIVEN)) {
    throw new Error(
      `${slug}: rendered scenario labels are not balanced (${counts.GIVEN}/${counts.WHEN}/${counts.THEN}).`,
    );
  }
  const items = cards.map((card, index) => {
    const values = {};
    for (const label of labels) {
      const labelNode = walk(
        card,
        (node) => node.tagName === "span" && textContent(node).trim() === label,
      )[0];
      const row = labelNode?.parentNode;
      const value = row?.childNodes?.filter(
        (node) => node.tagName === "span",
      )?.[1];
      if (!value)
        throw new Error(
          `${slug}: scenario ${index + 1} has no ${label} value.`,
        );
      values[label.toLowerCase()] = textContent(value).trim();
    }
    return {
      id: `${slug}-scenario-${index + 1}`,
      given: values.given,
      when: values.when,
      then: values.then,
    };
  });
  if (items.length !== counts.GIVEN)
    throw new Error(
      `${slug}: some rendered scenario cards could not be extracted.`,
    );
  return items;
}

function anchorAudit(html) {
  const fragment = parseFragment(html);
  // Radix-generated control IDs wire transient widget internals; they are not
  // reader-facing anchors and are regenerated by the renderer. Keep authored
  // section, heading, review, and SVG marker IDs in the migration proof.
  const ids = walk(fragment, (node) => {
    const id = attr(node, "id");
    return typeof id === "string" && !id.startsWith("radix-");
  }).map((node) => attr(node, "id"));
  const unique = [...new Set(ids)].sort();
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  const duplicateIds = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();
  return {
    ids: unique,
    duplicateIds,
    elementCount: ids.length,
    sectionCount: walk(fragment, (node) => node.tagName === "section").length,
    reviewCount: walk(
      fragment,
      (node) =>
        node.tagName === "details" && /^review-/u.test(attr(node, "id") ?? ""),
    ).length,
  };
}

function verifyManifest(manifest, slugs, prRows, storeRoot) {
  if (manifest.snapshot !== SNAPSHOT)
    throw new Error("Mapping manifest uses a different store snapshot.");
  if (
    !Array.isArray(manifest.entries) ||
    manifest.entries.length !== slugs.length
  )
    throw new Error(
      "Mapping manifest must contain exactly one row per Change page.",
    );
  const rows = new Map(manifest.entries.map((entry) => [entry.slug, entry]));
  if (rows.size !== slugs.length || slugs.some((slug) => !rows.has(slug)))
    throw new Error(
      "Mapping manifest slugs do not exactly match the fixed store snapshot.",
    );
  const pullRequests = new Map(prRows.map((pr) => [pr.number, pr]));
  for (const entry of manifest.entries) {
    if (
      !SLUG_PATTERN.test(entry.slug) ||
      typeof entry.evidence !== "string" ||
      !entry.evidence.trim()
    ) {
      throw new Error(`Invalid issue/PR evidence for ${entry.slug}.`);
    }
    if (
      entry.linearIssue &&
      !/^[A-Z][A-Z0-9]*-[1-9]\d*$/u.test(entry.linearIssue)
    )
      throw new Error(`${entry.slug}: invalid Linear issue key.`);
    if (
      !Array.isArray(entry.pullRequests) ||
      new Set(entry.pullRequests.map((pr) => pr.number)).size !==
        entry.pullRequests.length
    ) {
      throw new Error(`${entry.slug}: PR mappings must be a unique array.`);
    }
    for (const mapping of entry.pullRequests) {
      const pr = pullRequests.get(mapping.number);
      if (!pr || pr.url !== PR_URL(mapping.number))
        throw new Error(
          `${entry.slug}: PR #${mapping.number} is absent from the GitHub evidence export.`,
        );
      if (mapping.url !== PR_URL(mapping.number))
        throw new Error(`${entry.slug}: PR URL is not canonical.`);
      if (!mapping.method || !mapping.evidence?.trim())
        throw new Error(
          `${entry.slug}: PR #${mapping.number} needs a recorded evidence method and rationale.`,
        );
      if (mapping.method === "review-link") {
        const sourcePath = path.resolve(storeRoot, mapping.sourceFile);
        if (!sourcePath.startsWith(`${storeRoot}${path.sep}`))
          throw new Error(
            `${entry.slug}: review evidence path escapes the store snapshot.`,
          );
        const source = readFileSync(sourcePath, "utf8");
        if (!source.includes(mapping.url))
          throw new Error(
            `${entry.slug}: review evidence does not contain ${mapping.url}.`,
          );
      } else if (mapping.method === "branch-title") {
        if (
          !mapping.matchText ||
          !`${pr.headRefName}\n${pr.title}`
            .toLowerCase()
            .includes(mapping.matchText.toLowerCase())
        ) {
          throw new Error(
            `${entry.slug}: recorded branch/title evidence does not match PR #${mapping.number}.`,
          );
        }
      } else if (mapping.method === "pr-body") {
        if (
          !mapping.matchText ||
          !String(pr.body ?? "")
            .toLowerCase()
            .includes(mapping.matchText.toLowerCase())
        ) {
          throw new Error(
            `${entry.slug}: recorded body evidence does not match PR #${mapping.number}.`,
          );
        }
      } else if (mapping.method === "release-list") {
        const releasePr = pullRequests.get(mapping.viaPr);
        const releaseBody = String(releasePr?.body ?? "");
        if (
          !releasePr ||
          !releaseBody
            .toLowerCase()
            .includes(mapping.matchText?.toLowerCase() ?? "") ||
          (!releaseBody.includes(mapping.url) &&
            !releaseBody.includes(`#${mapping.number}`))
        ) {
          throw new Error(
            `${entry.slug}: release-list evidence is not present in the referenced PR body.`,
          );
        }
      } else if (mapping.method === "agent-judgment") {
        if (
          entry.slug !== "pnpm12-toolchain" ||
          mapping.number !== 484 ||
          !/agent judgment/iu.test(mapping.evidence)
        ) {
          throw new Error(
            `${entry.slug}: agent judgment is not permitted for this PR mapping.`,
          );
        }
      } else
        throw new Error(
          `${entry.slug}: unsupported PR evidence method ${mapping.method}.`,
        );
    }
  }
  for (const slug of REQUIRED_NO_PR_SLUGS) {
    if (rows.get(slug)?.pullRequests.length !== 0)
      throw new Error(
        `${slug}: the accepted migration evidence requires no verified delivery PR.`,
      );
  }
  const noPrSlugs = [...rows.values()]
    .filter((entry) => entry.pullRequests.length === 0)
    .map((entry) => entry.slug)
    .sort();
  if (
    JSON.stringify(noPrSlugs) !==
    JSON.stringify([...REQUIRED_NO_PR_SLUGS].sort())
  ) {
    throw new Error(
      `Expected exactly the two accepted no-PR pages; found ${noPrSlugs.join(", ") || "none"}.`,
    );
  }
  return rows;
}

function validateAcceptedSpecs(specs, legacySlugs) {
  if (!specs) return new Map();
  const result = new Map();
  const legacySlugSet = new Set(legacySlugs);
  for (const [slug, spec] of Object.entries(specs)) {
    if (
      !SLUG_PATTERN.test(slug) ||
      spec.slug !== slug ||
      spec.accepted !== true
    )
      throw new Error(
        `G1 spec mapping for "${slug}" is not an accepted stable-slug document.`,
      );
    const expectedDisposition = legacySlugSet.has(slug)
      ? "merge-legacy"
      : "standalone";
    if (spec.pageDisposition !== expectedDisposition)
      throw new Error(
        slug + ": G1 page disposition must be " + expectedDisposition + ".",
      );
    const documentContent = normalizeDocument(String(spec.content ?? ""));
    const receiptMarker = "\n## G1 acceptance receipt\n";
    const receiptStart = documentContent.indexOf(receiptMarker);
    if (
      receiptStart < 0 ||
      documentContent.indexOf(
        receiptMarker,
        receiptStart + receiptMarker.length,
      ) >= 0
    )
      throw new Error(
        slug + ": accepted G1 document must contain one receipt.",
      );
    const acceptedContent =
      documentContent.slice(0, receiptStart).trimEnd() + "\n";
    const receiptText = documentContent.slice(
      receiptStart + receiptMarker.length,
    );
    const fence = String.fromCharCode(96).repeat(3);
    const receiptPrefix = "\n" + fence + "json\n";
    const receiptSuffix = "\n" + fence;
    if (
      !receiptText.startsWith(receiptPrefix) ||
      !receiptText.trimEnd().endsWith(receiptSuffix)
    )
      throw new Error(slug + ": G1 receipt is not a terminal JSON code block.");
    const receiptJson = receiptText
      .trimEnd()
      .slice(receiptPrefix.length, -receiptSuffix.length);
    let receipt;
    try {
      receipt = JSON.parse(receiptJson);
    } catch (error) {
      throw new Error(
        slug + ": G1 receipt is invalid JSON (" + error.message + ").",
      );
    }
    const hash = sha256(Buffer.from(acceptedContent, "utf8"));
    if (hash !== spec.sha256)
      throw new Error(
        `${slug}: accepted G1 document hash does not match its content.`,
      );
    const issueFromSource = String(receipt.source ?? "").match(
      /\/issue\/([A-Z][A-Z0-9]*-[1-9]\d*)(?:\/|$)/u,
    )?.[1];
    if (
      receipt.schemaVersion !== 1 ||
      receipt.change !== slug ||
      receipt.specHash !== spec.sha256 ||
      receipt.acceptedAt !== spec.acceptedAt ||
      issueFromSource !== spec.linearIssue
    )
      throw new Error(
        slug +
          ": G1 receipt, issue identity, acceptance time or hash mismatch.",
      );
    if (!spec.documentId || !spec.url)
      throw new Error(
        `${slug}: accepted G1 document is missing its Linear identity.`,
      );
    result.set(slug, {
      ...spec,
      sha256: hash,
      content: acceptedContent,
    });
  }
  return result;
}

function validateProjectSpec(spec) {
  if (
    !spec ||
    spec.change !== "emdash-blueprint-change-pages" ||
    !/^[A-Z][A-Z0-9]*-[1-9]\d*$/u.test(spec.linearIssue ?? "")
  ) {
    throw new Error(
      "The project G1 export must identify its accepted Linear Change.",
    );
  }
  if (
    spec.slug !== "emdash-blueprint-change-pages" ||
    typeof spec.title !== "string" ||
    !spec.title.trim()
  ) {
    throw new Error(
      "The project G1 export must include its accepted kebab-case slug and title.",
    );
  }
  if (
    typeof spec.documentId !== "string" ||
    !spec.documentId ||
    typeof spec.url !== "string" ||
    !spec.url.startsWith("https://linear.app/")
  ) {
    throw new Error(
      "The project G1 export is missing its canonical Linear document identity.",
    );
  }
  if (
    typeof spec.acceptedAt !== "string" ||
    typeof spec.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/u.test(spec.sha256)
  ) {
    throw new Error(
      "The project G1 export is missing its accepted timestamp or SHA-256.",
    );
  }
  const content = normalizeDocument(String(spec.content ?? ""));
  const receiptStart = content.indexOf("\n## G1 acceptance receipt\n");
  if (receiptStart < 0)
    throw new Error("The project G1 export has no acceptance receipt section.");
  const acceptedSpec = `${content.slice(0, receiptStart).trimEnd()}\n`;
  if (sha256(Buffer.from(acceptedSpec, "utf8")) !== spec.sha256) {
    throw new Error(
      "The project G1 document does not match its accepted G1 SHA-256.",
    );
  }
  const obsoleteAuthorization =
    "本接受固定規格，不授權開始實作、不切換正式服務、不建立或刪除 Cloudflare 資源。";
  const currentAuthorization =
    "本規格已通過 G1；依 WORKFLOW.md，接受 G1 後授權實作至 G2。不授權切換正式服務或建立、刪除 Cloudflare 資源。";
  if (
    !acceptedSpec.includes(obsoleteAuthorization) &&
    !acceptedSpec.includes("授權 ticket decomposition 與實作至 G2")
  ) {
    throw new Error(
      "The accepted project G1 source must record authorization through G2.",
    );
  }
  const pageContent = acceptedSpec.replace(
    obsoleteAuthorization,
    currentAuthorization,
  );
  return {
    ...spec,
    sourceContent: acceptedSpec,
    pageContent,
    sourceSha256: spec.sha256,
  };
}

async function stableWritePackage(outputDirectory, files) {
  try {
    const existing = await readdir(outputDirectory);
    if (
      JSON.stringify([...existing].sort()) !==
      JSON.stringify(Object.keys(files).sort())
    ) {
      throw new Error(
        "Output directory already exists and does not match this transfer package.",
      );
    }
    for (const [name, content] of Object.entries(files)) {
      const existingContent = await readFile(
        path.join(outputDirectory, name),
        "utf8",
      );
      if (existingContent !== content)
        throw new Error(
          "Output directory already exists with different migration output.",
        );
    }
    console.log(`Existing migration package matches: ${outputDirectory}`);
    return;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await mkdir(outputDirectory, { recursive: true });
  for (const [name, content] of Object.entries(files))
    await writeFile(path.join(outputDirectory, name), content, "utf8");
}

async function run(options) {
  for (const key of [
    "store",
    "rendered",
    "manifest",
    "pull-requests",
    "git-root",
    "renderer-root",
    "project-spec",
    "out",
  ]) {
    if (!options[key]) throw new Error(`--${key} is required.`);
  }
  const storeRoot = path.resolve(options.store);
  const renderedRoot = path.resolve(options.rendered);
  const gitRoot = path.resolve(options["git-root"]);
  const rendererRoot = path.resolve(options["renderer-root"]);
  const outputDirectory = path.resolve(options.out);
  if (
    [storeRoot, renderedRoot, gitRoot, rendererRoot].some(
      (input) =>
        outputDirectory === input ||
        outputDirectory.startsWith(`${input}${path.sep}`),
    )
  ) {
    throw new Error(
      "Transfer output must be a disposable directory outside the inputs and Git repository.",
    );
  }
  const [
    storeEntries,
    renderEntries,
    manifest,
    prRows,
    specs,
    projectSpecSource,
  ] = await Promise.all([
    readdir(storeRoot, { withFileTypes: true }),
    readdir(renderedRoot, { withFileTypes: true }),
    readFile(path.resolve(options.manifest), "utf8").then(JSON.parse),
    readFile(path.resolve(options["pull-requests"]), "utf8").then(JSON.parse),
    options["g1-specs"]
      ? readFile(path.resolve(options["g1-specs"]), "utf8").then(JSON.parse)
      : Promise.resolve(undefined),
    readFile(path.resolve(options["project-spec"]), "utf8").then(JSON.parse),
  ]);
  const projectSpec = validateProjectSpec(projectSpecSource);
  const slugs = storeEntries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
  if (slugs.length !== 45)
    throw new Error(`Expected 45 legacy Change pages; found ${slugs.length}.`);
  if (
    renderEntries.some(
      (entry) => entry.isDirectory() || !entry.name.endsWith(".html"),
    )
  )
    throw new Error(
      "Rendered directory must contain only flat <slug>.html routes.",
    );
  const renderedSlugs = renderEntries
    .map((entry) => entry.name.slice(0, -5))
    .sort();
  if (JSON.stringify(renderedSlugs) !== JSON.stringify(slugs))
    throw new Error(
      "Rendered route slugs do not exactly match the fixed store snapshot.",
    );
  if (!Array.isArray(prRows) || prRows.length < 1)
    throw new Error("GitHub PR evidence export is missing.");
  const mappings = verifyManifest(manifest, slugs, prRows, storeRoot);
  const acceptedSpecs = validateAcceptedSpecs(specs, slugs);
  if (slugs.includes(projectSpec.slug))
    throw new Error(
      "The project G1 article slug must not shadow a legacy Change.",
    );
  const snapshotMetadata = gitOutput(gitRoot, [
    "show",
    "-s",
    "--format=%H %T %P",
    SNAPSHOT,
  ])
    .trim()
    .split(" ");
  if (snapshotMetadata[0] !== SNAPSHOT)
    throw new Error(
      "Fixed store snapshot commit is unavailable from the selected Git repository.",
    );
  await verifySnapshotFiles(storeRoot, gitRoot, SNAPSHOT, slugs);
  const reachable = gitOutput(gitRoot, ["rev-list", "--reverse", SNAPSHOT])
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean);
  const prExportHash = sha256(
    await readFile(path.resolve(options["pull-requests"])),
  );
  const rendererRevision = gitOutput(rendererRoot, [
    "rev-parse",
    "HEAD",
  ]).trim();
  const rendererOverlay = rendererOverlaySha256(rendererRoot);
  const seedTemplate = JSON.parse(
    await readFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../.emdash/seed.json",
      ),
      "utf8",
    ),
  );
  const content = [];
  const pages = [];
  const mediaManifest = [];

  for (const slug of slugs) {
    const sourceDirectory = path.join(storeRoot, slug);
    const htmlPath = path.join(renderedRoot, `${slug}.html`);
    const [indexMdx, proposal, facts, renderedHtml] = await Promise.all([
      readFile(path.join(sourceDirectory, "index.mdx"), "utf8"),
      readFile(path.join(sourceDirectory, "proposal.mdx"), "utf8").catch(
        () => "",
      ),
      readFile(path.join(sourceDirectory, "facts.json"), "utf8").then(
        JSON.parse,
      ),
      readFile(htmlPath, "utf8"),
    ]);
    const titleAndDescription = readFrontmatter(indexMdx, slug);
    let legacyHtml = extractRenderedContent(renderedHtml, slug);
    const sourceAudit = anchorAudit(legacyHtml);
    const attached = attachMediaMarkers(
      legacyHtml,
      slug,
      localImageSources(proposal),
      storeRoot,
      SNAPSHOT,
    );
    legacyHtml = sanitizeLegacyHtml(attached.html);
    const mediaBlocks = attached.blocks;
    const scenarios = scenarioRecords(legacyHtml, slug);
    const anchors = anchorAudit(legacyHtml);
    if (JSON.stringify(anchors) !== JSON.stringify(sourceAudit)) {
      throw new Error(
        `${slug}: sanitization changed the page audit: source=${JSON.stringify(sourceAudit)} migrated=${JSON.stringify(anchors)}.`,
      );
    }
    const blocks = [
      { _type: "legacy_html", _version: 1, html: legacyHtml },
      ...mediaBlocks,
      ...(scenarios.length
        ? [
            {
              _type: "scenario_cards",
              _version: 1,
              items: JSON.stringify(scenarios),
              rendered_in_legacy_html: true,
            },
          ]
        : []),
    ];
    const acceptedSpec = acceptedSpecs.get(slug);
    const renderedG1Spec = acceptedSpec
      ? prepareLinearG1Markdown(acceptedSpec.content)
      : undefined;
    if (acceptedSpec)
      blocks.push({
        _type: "markdown",
        _version: 1,
        markdown: renderedG1Spec.markdown,
      });
    const stableBlocks = blocks.map((block, index) => ({
      ...block,
      _key: `${slug}-${index + 1}`,
    }));
    const mapping = mappings.get(slug);
    const data = {
      ...titleAndDescription,
      ...(mapping.linearIssue ? { linear_issue: mapping.linearIssue } : {}),
      pull_requests: mapping.pullRequests.map(({ url }) => ({ url })),
      blocks: stableBlocks,
    };
    const valid = changeDataSchema.safeParse(data);
    if (!valid.success)
      throw new Error(
        `${slug}: generated EmDash entry does not match its strict schema: ${valid.error.message}`,
      );
    const seedContentHash = await acceptedContentHash(data);
    const importedScenarios = scenarioCount(blocks);
    if (importedScenarios !== scenarios.length)
      throw new Error(
        `${slug}: structured scenario count does not match rendered legacy content.`,
      );
    const imageMarkers = walk(
      parseFragment(legacyHtml),
      (node) =>
        node.tagName === "img" &&
        typeof attr(node, "data-emdash-media-key") === "string",
    );
    if (imageMarkers.length !== mediaBlocks.length)
      throw new Error(
        `${slug}: sanitized HTML and EmDash media blocks do not match.`,
      );

    content.push({ id: `legacy-${slug}`, slug, status: "draft", data });
    mediaManifest.push(
      ...attached.sourceFiles.map((image) => ({ slug, ...image })),
    );
    pages.push({
      slug,
      title: titleAndDescription.title,
      description: titleAndDescription.description ?? null,
      linearIssue: mapping.linearIssue ?? null,
      issueMapping: mapping.issueMapping ?? "unresolved",
      evidence: mapping.evidence,
      pullRequests: mapping.pullRequests.map(
        ({ number, method, evidence }) => ({
          number,
          url: PR_URL(number),
          method,
          evidence,
        }),
      ),
      migrationDisposition: mapping.pullRequests.length
        ? "derive-status-and-metrics-from-live-github"
        : "public-in-progress-without-pr-or-metrics",
      g1Spec: acceptedSpec
        ? {
            documentId: acceptedSpec.documentId,
            url: acceptedSpec.url,
            sha256: acceptedSpec.sha256,
            renderedContentSha256: sha256(renderedG1Spec.markdown),
            renderTransformations: renderedG1Spec.transformations,
          }
        : null,
      scenarioCount: importedScenarios,
      legacyFactsScenarioCrossCheck:
        typeof facts.scenarios === "number"
          ? {
              oldValue: facts.scenarios,
              derivedValue: importedScenarios,
              matches: facts.scenarios === importedScenarios,
            }
          : null,
      sections: anchors.sectionCount,
      reviewSections: anchors.reviewCount,
      anchors,
      renderedHtmlSha256: sha256(renderedHtml),
      sanitizedHtmlSha256: sha256(legacyHtml),
      seedContentSha256: seedContentHash,
      media: attached.sourceFiles.map(
        ({ filename, key, sha256: imageHash, size }) => ({
          filename,
          key,
          sha256: imageHash,
          size,
        }),
      ),
    });
  }

  const verifiedPrNumbers = new Set(prRows.map((pr) => pr.number));
  const standaloneG1Specs = [...acceptedSpecs.entries()].filter(
    ([slug]) => !slugs.includes(slug),
  );
  if (standaloneG1Specs.some(([slug]) => slug === projectSpec.slug))
    throw new Error(
      "The project G1 article slug must not duplicate a standalone accepted G1 page.",
    );
  for (const [slug, acceptedSpec] of standaloneG1Specs) {
    if (
      typeof acceptedSpec.title !== "string" ||
      !acceptedSpec.title.trim() ||
      !/^[A-Z][A-Z0-9]*-[1-9]\d*$/u.test(acceptedSpec.linearIssue ?? "")
    ) {
      throw new Error(
        `${slug}: standalone G1 page needs a title and Linear issue key.`,
      );
    }
    if (!Array.isArray(acceptedSpec.pullRequests))
      throw new Error(`${slug}: standalone G1 page PR URLs must be an array.`);
    const pullRequests = acceptedSpec.pullRequests.map((pr) => {
      const number = parseAllowedPullRequestUrl(pr?.url ?? "");
      if (
        number === null ||
        !verifiedPrNumbers.has(number) ||
        typeof pr.evidence !== "string" ||
        !pr.evidence.trim()
      ) {
        throw new Error(
          `${slug}: each G1 PR URL needs a canonical verified GitHub link and evidence.`,
        );
      }
      return { number, url: pr.url, evidence: pr.evidence };
    });
    if (
      new Set(pullRequests.map(({ number }) => number)).size !==
      pullRequests.length
    ) {
      throw new Error(`${slug}: standalone G1 PR mappings must be unique.`);
    }
    const renderedG1Spec = prepareLinearG1Markdown(acceptedSpec.content);
    const data = {
      title: acceptedSpec.title,
      ...(acceptedSpec.description
        ? { description: acceptedSpec.description }
        : {}),
      linear_issue: acceptedSpec.linearIssue,
      pull_requests: pullRequests.map(({ url }) => ({ url })),
      blocks: [
        {
          _type: "markdown",
          _version: 1,
          markdown: renderedG1Spec.markdown,
          _key: `${slug}-1`,
        },
      ],
    };
    const valid = changeDataSchema.safeParse(data);
    if (!valid.success)
      throw new Error(
        `${slug}: standalone G1 entry does not match the EmDash schema: ${valid.error.message}`,
      );
    content.push({ id: `accepted-g1-${slug}`, slug, status: "draft", data });
    pages.push({
      slug,
      title: acceptedSpec.title,
      description: acceptedSpec.description ?? null,
      linearIssue: acceptedSpec.linearIssue,
      pullRequests,
      migrationDisposition: "standalone-latest-accepted-g1-document",
      g1Spec: {
        documentId: acceptedSpec.documentId,
        url: acceptedSpec.url,
        acceptedAt: acceptedSpec.acceptedAt ?? null,
        sha256: acceptedSpec.sha256,
        renderedContentSha256: sha256(renderedG1Spec.markdown),
        renderTransformations: renderedG1Spec.transformations,
      },
      scenarioCount: scenarioCount(data.blocks),
      contentSha256: await acceptedContentHash(data),
    });
  }

  const renderedProjectSpec = prepareLinearG1Markdown(projectSpec.pageContent);
  const projectData = {
    title: projectSpec.title,
    ...(projectSpec.description
      ? { description: projectSpec.description }
      : {}),
    linear_issue: projectSpec.linearIssue,
    pull_requests: [],
    blocks: [
      {
        _type: "markdown",
        _version: 1,
        markdown: renderedProjectSpec.markdown,
        _key: `${projectSpec.slug}-1`,
      },
    ],
  };
  const validProject = changeDataSchema.safeParse(projectData);
  if (!validProject.success)
    throw new Error(
      `Project G1 article does not match the EmDash schema: ${validProject.error.message}`,
    );
  content.push({
    id: `project-${projectSpec.slug}`,
    slug: projectSpec.slug,
    status: "draft",
    data: projectData,
  });
  pages.push({
    slug: projectSpec.slug,
    title: projectSpec.title,
    description: projectSpec.description ?? null,
    linearIssue: projectSpec.linearIssue,
    migrationDisposition: "accepted-g1-project-spec-draft-for-local-rehearsal",
    g1Source: {
      documentId: projectSpec.documentId,
      url: projectSpec.url,
      acceptedAt: projectSpec.acceptedAt,
      sha256: projectSpec.sourceSha256,
    },
    contentSha256: await acceptedContentHash(projectData),
    sourceAuthorizationCorrection:
      "WORKFLOW.md authorizes implementation through G2; production switch and Cloudflare resource creation/deletion remain excluded.",
  });

  const seed = {
    ...seedTemplate,
    meta: {
      ...seedTemplate.meta,
      name: "Blueprint legacy Change transfer",
      description: `Disposable draft import from blueprint-changes snapshot ${SNAPSHOT}`,
    },
    content: { blueprint_changes: content },
  };
  const seedJson = `${JSON.stringify(seed, null, 2)}\n`;
  const audit = {
    schemaVersion: 1,
    snapshot: SNAPSHOT,
    snapshotTree: snapshotMetadata[1],
    snapshotParent: snapshotMetadata.slice(2).join(" ") || null,
    reachableCommitCount: reachable.length,
    reachableCommitGraphSha256: sha256(`${reachable.join("\n")}\n`),
    earlierUnreachableHistoryGuaranteed: false,
    renderedSnapshotAsserted: SNAPSHOT,
    rendererRevision,
    rendererOverlaySha256: rendererOverlay,
    projectG1: {
      slug: projectSpec.slug,
      documentId: projectSpec.documentId,
      url: projectSpec.url,
      acceptedAt: projectSpec.acceptedAt,
      sourceSha256: projectSpec.sourceSha256,
      migratedContentSha256: pages.at(-1).contentSha256,
      authorizationCorrection: true,
      renderTransformations: renderedProjectSpec.transformations,
    },
    githubPrExportSha256: prExportHash,
    pageCount: pages.length,
    legacyPageCount: slugs.length,
    noPrPages: pages
      .filter(
        (page) =>
          page.migrationDisposition ===
          "public-in-progress-without-pr-or-metrics",
      )
      .map(({ slug }) => slug),
    acceptedG1SpecCount: acceptedSpecs.size,
    standaloneAcceptedG1SpecCount: standaloneG1Specs.length,
    pageEvidence: pages,
    importStatus:
      "draft-for-local-rehearsal; no published entries or live Cloudflare writes",
    importedFactsFields: [],
    mediaCount: mediaManifest.length,
  };
  const auditJson = `${JSON.stringify(audit, null, 2)}\n`;
  const mediaJson = `${JSON.stringify(mediaManifest, null, 2)}\n`;
  const receiptText = [
    `# Legacy EmDash migration pre-import checks`,
    ``,
    `Snapshot: ${SNAPSHOT}`,
    `Pages: ${pages.length}`,
    `This rehearsal package contains no publishable migration receipts. EmDash converts each seed $media URL into a local media id and storage key; final content hashes must be generated from the imported draft read-back after the media bytes are verified.`,
    ``,
    `After importing the seed as drafts, export all drafts from /_emdash/api/content/blueprint_changes?status=draft&limit=100 with an EmDash API token that can read drafts, then run finalize-legacy-migration-receipts.mjs. Only that finalizer output may be copied to the Linear migration issue.`,
    ``,
  ].join("\n");
  await stableWritePackage(outputDirectory, {
    "seed.json": seedJson,
    "audit.json": auditJson,
    "media-manifest.json": mediaJson,
    "migration-preimport.md": receiptText,
  });
  console.log(
    `Audited ${slugs.length}/45 legacy pages, ${standaloneG1Specs.length} standalone accepted G1 pages and project G1 draft; ${mediaManifest.length} media assets; ${acceptedSpecs.size} accepted G1 docs total.`,
  );
  console.log(`No verified PR pages: ${audit.noPrPages.join(", ") || "none"}.`);
  console.log(
    `Reachable snapshot commits: ${reachable.length}; archive only guarantees this reachable graph.`,
  );
  console.log(`Transfer package: ${outputDirectory}`);
}

const args = parseCliArgs(process.argv.slice(2));
if (args.help) printHelp();
else
  run(args).catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
