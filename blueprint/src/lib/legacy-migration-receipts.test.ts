/** @jest-environment node */

import { createHash } from "node:crypto";
import { acceptedContentHash } from "./emdash-change-record";
import { finalizeLegacyMigrationReceipts } from "./legacy-migration-receipts";

const snapshot = "f".repeat(40);
const imageBytes = Buffer.from("verified historical image bytes");
const imageSha256 = createHash("sha256").update(imageBytes).digest("hex");

const seedData = {
  title: "Historical Change",
  linear_issue: "TEST-123",
  pull_requests: [],
  blocks: [
    {
      _type: "legacy_html",
      _version: 1,
      html: '<figure><img alt="Diagram" data-emdash-media-key="legacy-image-alpha-one"></figure>',
      _key: "alpha-1",
    },
    {
      _type: "legacy_media",
      _version: 1,
      key: "legacy-image-alpha-one",
      sha256: imageSha256,
      alt: "Diagram",
      asset: {
        $media: {
          url: "https://raw.githubusercontent.com/andrewck24/volleybro/snapshot/alpha/diagram.png",
          filename: "alpha-diagram.png",
          alt: "Diagram",
        },
      },
      _key: "alpha-2",
    },
  ],
};

const readbackData = {
  ...seedData,
  blocks: [
    seedData.blocks[0],
    {
      ...seedData.blocks[1],
      asset: {
        id: "cms-generated-media-id",
        provider: "local" as const,
        alt: "Diagram",
        filename: "alpha-diagram.png",
        mimeType: "image/png",
        width: 640,
        height: 480,
        meta: { storageKey: "cms-generated-object-key.png" },
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
      _type: "markdown",
      _version: 1,
      markdown: "Standalone accepted specification.",
      _key: "standalone-1",
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
      key: "legacy-image-alpha-one",
      sha256: imageSha256,
      size: imageBytes.byteLength,
      sourceUrl:
        "https://raw.githubusercontent.com/andrewck24/volleybro/snapshot/alpha/diagram.png",
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
    expect(storageKey).toBe("cms-generated-object-key.png");
    return { sha256: imageSha256, size: expectedSize };
  }),
});

describe("finalizeLegacyMigrationReceipts", () => {
  it("issues receipts from imported draft content after checking the uploaded bytes", async () => {
    const source = input();
    const result = await finalizeLegacyMigrationReceipts(source);

    expect(result.pages).toEqual([
      {
        slug: "alpha",
        draftRevisionId: "draft-revision-1",
        contentSha256: await acceptedContentHash(readbackData),
        mediaCount: 1,
      },
    ]);
    expect(result.receiptMarkdown).toContain(
      `<!-- emdash-legacy-entry:v1 snapshot=${snapshot} slug=alpha sha256=${result.pages[0].contentSha256} -->`,
    );
    expect(source.readMediaSha256).toHaveBeenCalledTimes(1);
  });

  it("binds each final receipt to the resolved local media identity", async () => {
    const first = await finalizeLegacyMigrationReceipts(input());
    const modified = input();
    Object.assign(modified.readback.items[0], {
      data: {
        ...readbackData,
        blocks: [
          readbackData.blocks[0],
          {
            ...readbackData.blocks[1],
            asset: {
              ...readbackData.blocks[1].asset,
              id: "different-media-id",
              meta: { storageKey: "different-storage-key.png" },
            },
          },
        ],
      },
    });
    modified.readMediaSha256 = jest.fn(async (_storageKey, expectedSize) => ({
      sha256: imageSha256,
      size: expectedSize,
    }));
    const second = await finalizeLegacyMigrationReceipts(modified);

    expect(second.pages[0].contentSha256).not.toBe(
      first.pages[0].contentSha256,
    );
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

    const pagedReadback = input();
    Object.assign(pagedReadback.readback, { nextCursor: "next-page" });
    await expect(
      finalizeLegacyMigrationReceipts(pagedReadback),
    ).rejects.toThrow("read-back is paginated");
  });

  it("rejects changed content in an accepted G1 page without a legacy slug", async () => {
    const changedStandalone = input();
    changedStandalone.readback.items[1].data = {
      ...standaloneData,
      title: "Changed standalone specification",
    };

    await expect(
      finalizeLegacyMigrationReceipts(changedStandalone),
    ).rejects.toThrow(
      "accepted-standalone: imported content differs from its transfer seed",
    );
  });
});
