import { createHash } from "node:crypto";
import { parseFragment, serialize } from "parse5";

const ASTRO_ISLAND_STYLE_SHA256 =
  "beff48a0aa3b0522db59c507af7b4d99f3559a6e4bffd09f9f61fa2cc93bfe8c";
const ASTRO_BOOTSTRAP_SHA256 = new Set([
  "d41bc35562ebdd0082db4b878540e2dbb783155269935b8c40918858a524b362",
  "b50224740c36bea7d0d4f8e0504e0c2f6038a4857c481c90d5279e7a1cba5087",
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeCss(value) {
  return value.replace(/\s+/gu, "");
}

function rawText(node) {
  if (node.nodeName === "#text") return node.value;
  if (node.childNodes?.some((child) => child.tagName))
    throw new Error("Rendered presentation artifact contains nested elements.");
  return (node.childNodes ?? []).map(rawText).join("");
}

function walk(node, predicate, result = []) {
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes ?? []) walk(child, predicate, result);
  return result;
}

/**
 * Removes only known non-reader presentation artifacts from a pinned legacy
 * renderer output. Every removal is recorded without retaining CSS or JS.
 */
export function removeLegacyPresentationArtifacts(html, slug, sourceMdx) {
  const fragment = parseFragment(html);
  const removed = [];
  const normalizedSource = normalizeCss(sourceMdx);
  const artifacts = walk(
    fragment,
    (node) =>
      node.nodeName === "#comment" ||
      node.tagName === "style" ||
      node.tagName === "script",
  );

  for (const node of artifacts) {
    const tag = node.tagName;
    const kind = node.nodeName === "#comment" ? "comment" : "element";
    const body = kind === "comment" ? node.data : rawText(node);
    const hash = sha256(body);
    let provenance;
    if (kind === "comment") {
      if (body === "astro:end" && node.parentNode?.tagName === "astro-island")
        provenance = "renderer-island-boundary";
      else if (
        body.trim() === "" &&
        node.parentNode?.tagName === "span" &&
        node.parentNode.parentNode?.tagName === "span"
      )
        provenance = "renderer-inline-separator";
      else
        throw new Error(
          `${slug}: rendered comment has no verified renderer provenance (${hash}).`,
        );
    } else if (tag === "style") {
      if (hash === ASTRO_ISLAND_STYLE_SHA256)
        provenance = "renderer-island-presentation";
      else if (body.trim() && normalizedSource.includes(normalizeCss(body)))
        provenance = "authored-presentation";
      else
        throw new Error(
          `${slug}: rendered <style> has no verified presentation-only source provenance (${hash}).`,
        );
    } else if (ASTRO_BOOTSTRAP_SHA256.has(hash)) {
      provenance = "renderer-bootstrap";
    } else {
      throw new Error(
        `${slug}: rendered <script> is not a recognized renderer bootstrap (${hash}).`,
      );
    }

    const parent = node.parentNode;
    if (!parent)
      throw new Error(`${slug}: render artifact has no parent node.`);
    const index = parent.childNodes.indexOf(node);
    if (index < 0) throw new Error(`${slug}: render artifact is detached.`);
    parent.childNodes.splice(index, 1);
    removed.push({
      kind: kind === "comment" ? "comment" : tag,
      sha256: hash,
      bytes: Buffer.byteLength(body),
      provenance,
    });
  }

  return { html: serialize(fragment), removed };
}
