#!/usr/bin/env node

import { createHash } from "node:crypto";

const RECEIPT_MARKER = "\n\n## G1 acceptance receipt\n\n";
const SHA256 = /^[a-f0-9]{64}$/;
const LINEAR_ISSUE_URL =
  /^https:\/\/linear\.app\/[a-z0-9-]+\/issue\/[A-Z]+-\d+(?:\/[^\s]*)?$/i;
const NORMALIZATION =
  "LF line endings; trim trailing document whitespace; one final LF";

const ISO_TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

function normalizeSpec(content) {
  return `${content.replace(/\r\n?/gu, "\n").trimEnd()}\n`;
}

function hashSpec(content) {
  return createHash("sha256")
    .update(normalizeSpec(content), "utf8")
    .digest("hex");
}

function isLinearDocumentUrl(value) {
  if (typeof value !== "string" || value.trim() !== value) return false;

  try {
    const url = new URL(value);
    const segments = url.pathname.split("/");
    const [workspace, resource, slug] = segments.slice(1);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "linear.app" ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      segments.length !== 4 ||
      !/^[a-z0-9-]+$/i.test(workspace ?? "") ||
      resource !== "document" ||
      !slug
    ) {
      return false;
    }

    const decodedSlug = decodeURIComponent(slug);
    return !decodedSlug.includes("/") && !decodedSlug.includes("\\");
  } catch {
    return false;
  }
}

function parseReceipt(content) {
  const firstMarker = content.indexOf(RECEIPT_MARKER);
  if (
    firstMarker < 0 ||
    content.indexOf(RECEIPT_MARKER, firstMarker + 1) >= 0
  ) {
    throw new Error(
      "document must contain exactly one G1 acceptance receipt section",
    );
  }

  const spec = content.slice(0, firstMarker);
  const receiptSection = content.slice(firstMarker + RECEIPT_MARKER.length);
  const match = receiptSection.match(/^```json\n([\s\S]*?)\n```\n?$/u);
  if (!match)
    throw new Error(
      "G1 acceptance receipt must be one JSON code block at the end of the document",
    );

  let receipt;
  try {
    receipt = JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`G1 acceptance receipt is invalid JSON: ${error.message}`);
  }
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    throw new Error("G1 acceptance receipt must be a JSON object");
  }
  return { spec, receipt };
}

export function validateSnapshot(document, { teamId, change } = {}) {
  const diagnostics = [];
  if (!document || typeof document !== "object") {
    return {
      valid: false,
      diagnostics: ["Linear document readback is missing"],
    };
  }
  if (!teamId) diagnostics.push("expected Linear Team ID is required");
  if (!change) diagnostics.push("expected Change slug is required");
  if (typeof document.id !== "string" || !document.id.trim())
    diagnostics.push("Linear document ID is missing");
  if (document.team?.id !== teamId)
    diagnostics.push("Linear document belongs to a different or missing Team");
  if (!isLinearDocumentUrl(document.url))
    diagnostics.push("Linear document URL is missing or invalid");
  if (typeof document.content !== "string" || !document.content.trim()) {
    diagnostics.push("Linear document content is missing");
  }
  if (diagnostics.length) return { valid: false, diagnostics };

  let parsed;
  try {
    parsed = parseReceipt(document.content);
  } catch (error) {
    return { valid: false, diagnostics: [error.message] };
  }
  const { spec, receipt } = parsed;

  if (!spec.trim()) diagnostics.push("accepted specification content is empty");
  if (receipt.schemaVersion !== 1)
    diagnostics.push("receipt schemaVersion must be 1");
  if (receipt.change !== change)
    diagnostics.push("receipt Change does not match the expected Change");
  if (typeof receipt.actor !== "string" || !receipt.actor.trim())
    diagnostics.push("receipt actor is missing");
  if (
    typeof receipt.acceptedAt !== "string" ||
    !ISO_TIMESTAMP.test(receipt.acceptedAt) ||
    !Number.isFinite(Date.parse(receipt.acceptedAt))
  ) {
    diagnostics.push("receipt acceptedAt must be an ISO 8601 timestamp");
  }
  if (!SHA256.test(receipt.specHash ?? ""))
    diagnostics.push("receipt specHash must be a lowercase SHA-256 digest");
  else if (receipt.specHash !== hashSpec(spec))
    diagnostics.push(
      "receipt specHash does not match the accepted specification",
    );
  if (!LINEAR_ISSUE_URL.test(receipt.source ?? ""))
    diagnostics.push("receipt source must be a Linear issue URL");
  if (receipt.normalization !== NORMALIZATION)
    diagnostics.push(
      "receipt normalization must describe LF, trimEnd and one trailing LF",
    );

  if (diagnostics.length) return { valid: false, diagnostics };
  return {
    valid: true,
    diagnostics: [],
    receipt,
    metadata: {
      change: receipt.change,
      source: receipt.source,
      documentUrl: document.url,
      specHash: receipt.specHash,
    },
  };
}
