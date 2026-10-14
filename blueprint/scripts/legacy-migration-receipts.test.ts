/** @jest-environment node */

import { createHash } from "node:crypto";
import { acceptedContentHash } from "../src/lib/emdash-change-record";
import { finalizeLegacyMigrationReceipts } from "./legacy-migration-receipts";

const snapshot = "f".repeat(40);
const imageBytes = Buffer.from("verified historical image bytes");
const imageSha256 = createHash("sha256").update(imageBytes).digest("hex");
const sourceUrl =
  "https://raw.githubusercontent.com/andrewck24/volleybro/snapshot/alpha/diagram.png";
const mediaReference = {
  _type: "image",
  _key: "alpha-image-1",
  alt: "Diagram",
  asset: {
    $media: {
      url: sourceUrl,
      filename: "alpha-diagram.png",
      alt: "Diagram",
    },
  },
};
const paragraph = {
  _type: "block",
  _key: "alpha-block-1",
  style: "normal",
  children: [{ _type: "span", text: "Historical content", marks: [] }],
};
const seedData = {
  title: "Historical Change",
  linear_issue: "TEST-123",
  pull_requests: [],
  blocks: [paragraph, mediaReference],
};
const readbackData = {
  ...seedData,
  blocks: [
    paragraph,
    {
      ...mediaReference,
      asset: {
        _type: "reference",
        _ref: "cms-generated-media-id",
        url: "/_emdash/api/media/file/cms-object-key.png",
      },
    },
  ],
};
const standaloneData = {
  title: "Accepted G1 without a legacy page",
  linear_issue: "TEST-456",
  pull_requests: [],
  blocks: [
    {
      _type: "block",
      _key: "standalone-1",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Standalone accepted specification.",
          marks: [],
        },
      ],
    },
  ],
};

const input = () => ({
  audit: {
    schemaVersion: 1,
    snapshot,
    legacyPageCount: 1,
    pageEvidence: [
      {
        slug: "alpha",
        migrationDisposition: "public-in-progress-without-pr-or-metrics",
      },
      {
        slug: "accepted-standalone",
        migrationDisposition: "standalone-latest-accepted-g1-document",
      },
    ],
  },
  seed: {
    version: "1",
    meta: {},
    collections: [],
    blockTypes: [],
    content: {
      blueprint_changes: [
        { id: "legacy-alpha", slug: "alpha", status: "draft", data: seedData },
        {
          id: "accepted-standalone",
          slug: "accepted-standalone",
          status: "draft",
          data: standaloneData,
        },
      ],
    },
  },
  mediaManifest: [
    {
      slug: "alpha",
      filename: "diagram.png",
      packagePath: "media/alpha/diagram.png",
      contentType: "image/png",
      alt: "Diagram",
      key: "legacy-image-alpha-one",
      sha256: imageSha256,
      size: imageBytes.byteLength,
      sourceUrl,
    },
  ],
  readback: {
    items: [
      {
        id: "actual-entry-id",
        type: "blueprint_changes",
        slug: "alpha",
        status: "draft",
        draftRevisionId: "draft-revision-1",
        data: readbackData,
      },
      {
        id: "actual-standalone-id",
        type: "blueprint_changes",
        slug: "accepted-standalone",
        status: "draft",
        draftRevisionId: "draft-revision-standalone",
        data: standaloneData,
      },
    ],
    total: 2,
  },
  readMediaSha256: jest.fn(async (storageKey: string, expectedSize: number) => {
    expect(storageKey).toBe("cms-object-key.png");
    return { sha256: imageSha256, size: expectedSize };
  }),
});

describe("finalizeLegacyMigrationReceipts", () => {
  it("issues read-back receipts for every page after checking uploaded bytes", async () => {
    const source = input();
    const result = await finalizeLegacyMigrationReceipts(source);

    expect(result.pages).toEqual([
      {
        slug: "accepted-standalone",
        draftRevisionId: "draft-revision-standalone",
        contentSha256: await acceptedContentHash(standaloneData),
        mediaCount: 0,
      },
      {
        slug: "alpha",
        draftRevisionId: "draft-revision-1",
        contentSha256: await acceptedContentHash(readbackData),
        mediaCount: 1,
      },
    ]);
    expect(result.receiptMarkdown).toContain("slug=alpha");
    expect(result.receiptMarkdown).toContain("slug=accepted-standalone");
    expect(source.readMediaSha256).toHaveBeenCalledTimes(1);
  });

  it("rejects changed content, mismatched image bytes, and incomplete read-back", async () => {
    const changedContent = input();
    changedContent.readback.items[0].data = {
      ...readbackData,
      title: "Unreviewed edit",
    };
    await expect(
      finalizeLegacyMigrationReceipts(changedContent),
    ).rejects.toThrow("differs from its transfer seed");

    const changedImage = input();
    changedImage.readMediaSha256 = jest.fn(
      async (_storageKey, expectedSize) => ({
        sha256: "0".repeat(64),
        size: expectedSize,
      }),
    );
    await expect(finalizeLegacyMigrationReceipts(changedImage)).rejects.toThrow(
      "uploaded media bytes do not match",
    );

    const unknownMediaMetadata = input();
    const unknownMediaBlock = unknownMediaMetadata.readback.items[0].data
      .blocks[1] as { asset: Record<string, unknown> };
    unknownMediaBlock.asset.unreviewed = "must not be discarded";
    await expect(
      finalizeLegacyMigrationReceipts(unknownMediaMetadata),
    ).rejects.toThrow("unsupported media fields");

    const pagedReadback = input();
    Object.assign(pagedReadback.readback, { nextCursor: "next-page" });
    await expect(
      finalizeLegacyMigrationReceipts(pagedReadback),
    ).rejects.toThrow("read-back is paginated");
  });
});
