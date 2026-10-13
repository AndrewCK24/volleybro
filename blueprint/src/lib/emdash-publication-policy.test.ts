/** @jest-environment node */

import {
  LEGACY_STORE_SNAPSHOT,
  legacyImportReceiptProblem,
  publicationReceiptProblem,
} from "./publication-receipt";

const hash = "a".repeat(64);
const receipt = (revision: string, acceptedHash = hash) =>
  `<!-- emdash-g1-publication:v1 revision=${revision} sha256=${acceptedHash} -->`;

describe("publicationReceiptProblem", () => {
  it("blocks publication without a parseable Linear G1 receipt", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: "No G1 receipt",
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBe("Linear has no accepted G1 revision for this Change.");
  });

  it("requires the exact accepted draft revision on first publication", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-2",
        actualContentHash: hash,
      }),
    ).toBe(
      "Linear's accepted G1 revision does not match this unpublished draft.",
    );
  });

  it("blocks a changed accepted specification even when the entry was already published", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-2",
        liveRevisionId: "live-revision",
        actualContentHash: "b".repeat(64),
      }),
    ).toBe("Linear's accepted G1 content hash does not match this draft.");
  });

  it("allows a published entry's PR-index-only revision update when the accepted content hash is unchanged", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("accepted-revision"),
        draftRevisionId: "pr-index-update",
        liveRevisionId: "live-revision",
        actualContentHash: hash,
      }),
    ).toBeUndefined();
  });

  it("allows the exact revision and hash accepted for initial publication", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBeUndefined();
  });
});

describe("legacyImportReceiptProblem", () => {
  const legacyReceipt = (slug: string, acceptedHash = hash) =>
    `<!-- emdash-legacy-entry:v1 snapshot=${LEGACY_STORE_SNAPSHOT} slug=${slug} sha256=${acceptedHash} -->`;
  const input = (
    overrides: Partial<Parameters<typeof legacyImportReceiptProblem>[0]> = {},
  ) => ({
    migrationIssueDescription: legacyReceipt("record-flows"),
    actualContentHash: hash,
    slug: "record-flows",
    hasLegacyHtml: true,
    ...overrides,
  });

  it("allows a verified page in the fixed snapshot, including the two no-G1 history pages", () => {
    expect(legacyImportReceiptProblem(input())).toBeUndefined();
    expect(
      legacyImportReceiptProblem(
        input({
          migrationIssueDescription: legacyReceipt("blueprint-build-archive"),
          slug: "blueprint-build-archive",
        }),
      ),
    ).toBeUndefined();
  });

  it("requires the fixed store snapshot, matching slug, a unique receipt, and the full content hash", () => {
    expect(
      legacyImportReceiptProblem(
        input({
          migrationIssueDescription: legacyReceipt(
            "record-flows",
            "b".repeat(64),
          ),
        }),
      ),
    ).toContain("hash");
    expect(
      legacyImportReceiptProblem(input({ actualContentHash: "b".repeat(64) })),
    ).toContain("hash");
    expect(
      legacyImportReceiptProblem(input({ slug: "some-new-change" })),
    ).toContain("no unique");
    expect(
      legacyImportReceiptProblem(input({ hasLegacyHtml: false })),
    ).toContain("legacy_html");
    expect(
      legacyImportReceiptProblem(
        input({
          migrationIssueDescription: `${legacyReceipt("record-flows")}\n${legacyReceipt("record-flows")}`,
        }),
      ),
    ).toContain("no unique");
  });
});
