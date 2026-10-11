import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { validateSnapshot } from "../g1-snapshot.js";

const TEAM_ID = "c0d9895c-57b5-4be6-981f-a57590f6232d";
const CHANGE = "pr-based-blueprint-workflow";
const SOURCE = "https://linear.app/example/issue/SPEC-1/change-workflow";
const CONTENT = "# Accepted specification\r\n\r\nComplete spec.   \r\n";
const EXPECTED_HASH = createHash("sha256")
  .update("# Accepted specification\n\nComplete spec.\n")
  .digest("hex");

function document(overrides = {}) {
  const receipt = {
    schemaVersion: 1,
    change: CHANGE,
    actor: "github:andrewck24",
    acceptedAt: "2026-10-11T10:00:00.000Z",
    specHash: EXPECTED_HASH,
    source: SOURCE,
    normalization:
      "LF line endings; trim trailing document whitespace; one final LF",
  };
  return {
    id: "6c98aebc-d7e4-4d6d-9587-7f606d1159b3",
    url: "https://linear.app/asatelier/document/pr-based-blueprint-workflow-g1-6c98aebc",
    team: { id: TEAM_ID },
    content: `${CONTENT.trimEnd()}\n\n## G1 acceptance receipt\n\n\`\`\`json\n${JSON.stringify(receipt, null, 2)}\n\`\`\`\n`,
    ...overrides,
  };
}

function validation(input = document()) {
  return validateSnapshot(input, { teamId: TEAM_ID, change: CHANGE });
}

test("validates normalized Linear readback and returns only pointer metadata", () => {
  const result = validation();
  assert.equal(result.valid, true);
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.metadata, {
    change: CHANGE,
    source: SOURCE,
    documentUrl: document().url,
    specHash: EXPECTED_HASH,
  });
  assert.equal("spec" in result, false);
});

test("fails closed when the Doc is not attached to the expected Team", () => {
  const result = validation(document({ team: { id: "other-team" } }));
  assert.equal(result.valid, false);
  assert.match(result.diagnostics.join("\n"), /different or missing Team/);
});

test("fails closed when snapshot content and receipt hash diverge", () => {
  const input = document();
  input.content = input.content.replace("Complete spec.", "Changed spec.");
  const result = validation(input);
  assert.equal(result.valid, false);
  assert.match(result.diagnostics.join("\n"), /specHash does not match/);
});

test("rejects missing acceptance metadata, source and hash", () => {
  const input = document();
  input.content = input.content.replace(/"actor":.*\n/, "");
  input.content = input.content.replace(/"source":.*\n/, "");
  input.content = input.content.replace(/"specHash":.*\n/, "");
  const result = validation(input);
  assert.equal(result.valid, false);
  assert.match(result.diagnostics.join("\n"), /actor is missing/);
  assert.match(
    result.diagnostics.join("\n"),
    /source must be a Linear issue URL/,
  );
  assert.match(
    result.diagnostics.join("\n"),
    /specHash must be a lowercase SHA-256/,
  );
});

test("rejects a receipt for another Change or a missing document URL", () => {
  const input = document({
    url: "",
    content: document().content.replace(
      `"change": "${CHANGE}"`,
      '"change": "another-change"',
    ),
  });
  const result = validation(input);
  assert.equal(result.valid, false);
  assert.match(
    result.diagnostics.join("\n"),
    /document URL is missing or invalid/,
  );
  const wrongChange = validation({ ...document(), content: input.content });
  assert.match(
    wrongChange.diagnostics.join("\n"),
    /receipt Change does not match/,
  );
});

test("rejects exports without the real Linear document object fields", () => {
  const input = document({ team: undefined, id: undefined });
  const result = validation(input);
  assert.equal(result.valid, false);
  assert.match(result.diagnostics.join("\n"), /Team/);
  assert.match(result.diagnostics.join("\n"), /document ID is missing/);
});

test("rejects non-object receipt JSON without throwing", () => {
  for (const value of ["null", "[]", "1"]) {
    const input = document();
    input.content = input.content.replace(
      /```json\n[\s\S]*?\n```/,
      `\`\`\`json\n${value}\n\`\`\``,
    );
    const result = validation(input);
    assert.equal(result.valid, false);
    assert.match(result.diagnostics.join("\n"), /must be a JSON object/);
  }
});

test("rejects an acceptance date without an exact timestamp", () => {
  const input = document();
  input.content = input.content.replace(
    "2026-10-11T10:00:00.000Z",
    "2026-10-11",
  );
  const result = validation(input);
  assert.equal(result.valid, false);
  assert.match(result.diagnostics.join("\n"), /ISO 8601 timestamp/);
});
