/** @jest-environment node */

jest.mock(
  "emdash",
  () => ({
    definePlugin: (descriptor: unknown) => descriptor,
  }),
  { virtual: true },
);
jest.mock(
  "astro/zod",
  () => ({ z: jest.requireActual<typeof import("zod")>("zod").z }),
  { virtual: true },
);

import { publicationReceiptProblem } from "./publication-receipt";
import {
  createPlugin,
  MAX_MEDIA_UPLOAD_BYTES,
} from "./emdash-publication-policy";

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

describe("canonical content publish policy", () => {
  const plugin = createPlugin() as unknown as {
    hooks: Record<string, (...args: unknown[]) => Promise<unknown>>;
  };
  const beforePublish = plugin.hooks["content:beforePublish"];
  const content = {
    title: "Canonical Change",
    linear_issue: "ATE-306",
    pull_requests: [],
    blocks: [],
  };

  it("does not validate drafts on save, so incomplete drafts autosave", () => {
    expect(plugin.hooks["content:beforeSave"]).toBeUndefined();
  });

  it.each([
    [
      "Markdown strings",
      { _type: "markdown", _version: 1, markdown: "**raw**" },
    ],
    ["raw HTML blocks", { _type: "html", html: "<script>alert(1)</script>" }],
    ["iframes", { _type: "iframe", url: "https://example.com" }],
    ["unknown blocks", { _type: "unknown_block", value: "payload" }],
  ])("blocks publication of %s", async (_label, block) => {
    await expect(
      beforePublish(
        {
          collection: "blueprint_changes",
          content: {
            data: { ...content, blocks: [block] },
            draftRevisionId: "revision-1",
          },
        },
        {},
      ),
    ).resolves.toEqual({
      cancel: true,
      reason: "Change content does not match the published EmDash schema.",
    });
  });
});

describe("media upload size cap", () => {
  const plugin = createPlugin() as unknown as {
    hooks: Record<string, (event: unknown) => Promise<unknown>>;
  };
  const beforeUpload = plugin.hooks["media:beforeUpload"];
  const file = (size: number) => ({ name: "a.png", type: "image/png", size });

  it("passes a file at the cap and rejects one above it", async () => {
    const atCap = file(MAX_MEDIA_UPLOAD_BYTES);
    await expect(beforeUpload({ file: atCap })).resolves.toBe(atCap);
    await expect(
      beforeUpload({ file: file(MAX_MEDIA_UPLOAD_BYTES + 1) }),
    ).rejects.toThrow("20 MiB");
  });
});
