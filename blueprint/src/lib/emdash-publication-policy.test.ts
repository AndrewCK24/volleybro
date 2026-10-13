/** @jest-environment node */

jest.mock(
  "emdash",
  () => ({
    definePlugin: (descriptor: unknown) => descriptor,
    ContentSaveRejectedError: class ContentSaveRejectedError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "ContentSaveRejectedError";
      }
    },
  }),
  { virtual: true },
);
jest.mock("astro/zod", () => ({ z: require("zod") }), { virtual: true });

import { publicationReceiptProblem } from "./publication-receipt";
import { createPlugin } from "./emdash-publication-policy";

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
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("requires a newly accepted revision after a published draft changes", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-2",
        liveRevisionId: "live-revision",
        actualContentHash: hash,
      }),
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("rejects a published entry's PR-index-only revision update without new acceptance", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("accepted-revision"),
        draftRevisionId: "pr-index-update",
        liveRevisionId: "live-revision",
        actualContentHash: hash,
      }),
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("blocks changed content even when the accepted draft revision matches", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-1",
        liveRevisionId: "live-revision",
        actualContentHash: "b".repeat(64),
      }),
    ).toBe("Linear's accepted G1 content hash does not match this draft.");
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

  it("matches one ordinary receipt for this revision among receipts for other drafts", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: `${receipt("earlier-revision")}\n${receipt("revision-1")}`,
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBeUndefined();
  });

  it("rejects duplicate receipts for the same draft revision", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: `${receipt("revision-1")}\n${receipt("revision-1")}`,
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBe("Linear has duplicate G1 receipts for this draft revision.");
  });
});

describe("canonical content save policy", () => {
  const plugin = createPlugin() as unknown as {
    hooks: Record<string, (event: unknown) => Promise<unknown>>;
  };
  const beforeSave = plugin.hooks["content:beforeSave"];
  const content = {
    title: "Canonical Change",
    linear_issue: "ATE-306",
    pull_requests: [],
    blocks: [
      {
        _type: "block",
        children: [{ _type: "span", text: "Canonical prose." }],
      },
      {
        _type: "scenario",
        _version: 1,
        id: "scenario-1",
        given: "a team",
        when: "it records a match",
        then: "the match appears",
      },
    ],
  };

  it("allows canonical Portable Text and typed blocks with an empty PR list", async () => {
    await expect(
      beforeSave({
        collection: "blueprint_changes",
        content,
        isNew: true,
      }),
    ).resolves.toBeUndefined();
  });

  it.each([
    [
      "Markdown strings",
      { _type: "markdown", _version: 1, markdown: "**raw**" },
    ],
    ["raw HTML blocks", { _type: "html", html: "<script>alert(1)</script>" }],
    ["iframes", { _type: "iframe", url: "https://example.com" }],
    ["unknown blocks", { _type: "unknown_block", value: "payload" }],
  ])("rejects %s before save", async (_label, block) => {
    await expect(
      beforeSave({
        collection: "blueprint_changes",
        content: { ...content, blocks: [block] },
        isNew: false,
        id: "existing-entry",
      }),
    ).rejects.toMatchObject({
      name: "ContentSaveRejectedError",
      message: "Change content does not match the canonical Blueprint schema.",
    });
  });

  it("does not reject writes to unrelated collections", async () => {
    await expect(
      beforeSave({
        collection: "other_collection",
        content: { arbitrary: true },
        isNew: true,
      }),
    ).resolves.toBeUndefined();
  });
});
