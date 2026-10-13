import { z } from "zod";
import {
  acceptedContentHash,
  canonicalizeContentValue,
  changeDataSchema,
  omitCmsKeys,
} from "../src/lib/emdash-change-record.ts";

const mediaManifestSchema = z.array(
  z.strictObject({
    slug: z.string().min(1),
    filename: z.string().min(1),
    key: z.string().min(1),
    sha256: z.string().regex(/^[a-f0-9]{64}$/u),
    size: z.number().int().nonnegative(),
    sourceUrl: z.url(),
  }),
);

const transferSeedSchema = z.looseObject({
  content: z.looseObject({
    blueprint_changes: z.array(
      z.looseObject({
        id: z.string().min(1),
        slug: z.string().min(1),
        status: z.enum(["draft", "published"]),
        data: z.unknown(),
      }),
    ),
  }),
});

const migrationAuditSchema = z.looseObject({
  schemaVersion: z.literal(1),
  snapshot: z.string().regex(/^[a-f0-9]{40}$/u),
  legacyPageCount: z.number().int().positive(),
  pageEvidence: z.array(
    z.looseObject({
      slug: z.string().min(1),
      migrationDisposition: z.string().min(1),
    }),
  ),
});

const readbackSchema = z.looseObject({
  items: z.array(
    z.looseObject({
      id: z.string().min(1),
      type: z.string().min(1),
      slug: z.string().min(1),
      status: z.string().min(1),
      data: z.unknown(),
      draftRevisionId: z.string().nullable().optional(),
    }),
  ),
  nextCursor: z.string().optional(),
});

type ManifestRow = z.infer<typeof mediaManifestSchema>[number];
type MediaDigestReader = (
  storageKey: string,
  expectedSize: number,
) => Promise<{ sha256: string; size: number }>;

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Migration content contains an invalid object.");
  return value as Record<string, unknown>;
}

function stableProjection(
  dataValue: unknown,
  side: "seed" | "readback",
  manifestByUrl: Map<string, ManifestRow>,
  expectedKeys?: string[],
): { value: unknown; mediaKeys: string[] } {
  const data = record(dataValue);
  if (!Array.isArray(data.blocks))
    throw new Error("Migration content has no Portable Text blocks array.");
  let imageIndex = 0;
  const mediaKeys: string[] = [];
  const blocks = data.blocks.map((value: unknown) => {
    const block = record(value);
    if (block._type !== "image") return omitCmsKeys(block);
    const key =
      side === "seed"
        ? (() => {
            const source = record(record(block.asset).$media);
            const sourceUrl = typeof source.url === "string" ? source.url : "";
            const row = manifestByUrl.get(sourceUrl);
            if (!row)
              throw new Error(
                "Seed image URL has no source media manifest row.",
              );
            if (
              source.filename !== `${row.slug}-${row.filename}` ||
              (source.alt ?? "") !== (block.alt ?? "")
            )
              throw new Error(
                `${row.slug}: native seed image metadata differs from the source manifest.`,
              );
            return row.key;
          })()
        : (() => {
            const key = expectedKeys?.[imageIndex];
            const asset = record(block.asset);
            if (typeof key !== "string" || typeof asset._ref !== "string")
              throw new Error(
                "Read-back image does not resolve to a native EmDash asset reference.",
              );
            return key;
          })();
    imageIndex += 1;
    mediaKeys.push(key);
    return {
      ...omitCmsKeys(block),
      asset: { verifiedMigrationMediaKey: key },
    };
  });
  if (side === "readback" && imageIndex !== (expectedKeys?.length ?? 0))
    throw new Error("Imported image blocks do not match the transfer seed.");
  return {
    value: {
      title: data.title,
      description: data.description,
      linear_issue: data.linear_issue,
      pull_requests: data.pull_requests,
      blocks,
    },
    mediaKeys,
  };
}

export async function finalizeLegacyMigrationReceipts(input: {
  audit: unknown;
  seed: unknown;
  mediaManifest: unknown;
  readback: unknown;
  readMediaSha256: MediaDigestReader;
}): Promise<{
  snapshot: string;
  receiptMarkdown: string;
  pages: Array<{
    slug: string;
    draftRevisionId: string | null;
    contentSha256: string;
    mediaCount: number;
  }>;
}> {
  const audit = migrationAuditSchema.parse(input.audit);
  const seed = transferSeedSchema.parse(input.seed);
  const mediaManifest = mediaManifestSchema.parse(input.mediaManifest);
  const readback = readbackSchema.parse(input.readback);
  if (readback.nextCursor)
    throw new Error("EmDash read-back is paginated; fetch every draft first.");

  const legacyPages = audit.pageEvidence.filter((page) =>
    [
      "derive-status-and-metrics-from-live-github",
      "public-in-progress-without-pr-or-metrics",
    ].includes(page.migrationDisposition),
  );
  if (legacyPages.length !== audit.legacyPageCount)
    throw new Error("Migration audit legacy page count is inconsistent.");
  const expectedSlugs = audit.pageEvidence.map((page) => page.slug).sort();
  if (new Set(expectedSlugs).size !== expectedSlugs.length)
    throw new Error("Migration audit contains duplicate page slugs.");

  const expectedBySlug = new Map(
    seed.content.blueprint_changes.map((entry) => [entry.slug, entry]),
  );
  if (
    expectedBySlug.size !== seed.content.blueprint_changes.length ||
    expectedSlugs.length !== expectedBySlug.size ||
    expectedSlugs.some((slug) => !expectedBySlug.has(slug))
  )
    throw new Error(
      "Transfer seed does not contain the exact audited page set.",
    );

  const actualBySlug = new Map(readback.items.map((item) => [item.slug, item]));
  if (actualBySlug.size !== readback.items.length)
    throw new Error("EmDash read-back contains duplicate slugs.");
  if (actualBySlug.size !== expectedBySlug.size)
    throw new Error(
      "EmDash read-back and transfer seed have different page sets.",
    );

  const manifestByKey = new Map(mediaManifest.map((row) => [row.key, row]));
  const manifestByUrl = new Map(
    mediaManifest.map((row) => [row.sourceUrl, row]),
  );
  if (
    manifestByKey.size !== mediaManifest.length ||
    manifestByUrl.size !== mediaManifest.length
  )
    throw new Error(
      "Migration media manifest contains duplicate keys or URLs.",
    );
  const usedManifestKeys = new Set<string>();
  const pages = [];
  const receiptRows = [];

  for (const slug of expectedSlugs) {
    const entry = expectedBySlug.get(slug)!;
    const actualRecord = actualBySlug.get(slug);
    if (
      !actualRecord ||
      actualRecord.type !== "blueprint_changes" ||
      actualRecord.status !== "draft"
    )
      throw new Error(`${slug}: expected one imported EmDash draft.`);
    const expected = stableProjection(entry.data, "seed", manifestByUrl);
    const expectedMediaKeys = expected.mediaKeys;
    const actualData = changeDataSchema.parse(actualRecord.data);
    const actual = stableProjection(
      actualData,
      "readback",
      manifestByUrl,
      expectedMediaKeys,
    );
    if (
      canonicalizeContentValue(expected.value) !==
      canonicalizeContentValue(actual.value)
    )
      throw new Error(
        `${slug}: imported content differs from its transfer seed.`,
      );

    const expectedBlocks = record(entry.data).blocks as unknown[];
    const actualBlocks = actualData.blocks;
    const seedImages = expectedBlocks.filter(
      (block) => record(block)._type === "image",
    );
    const actualImages = actualBlocks.filter(
      (block) => block._type === "image",
    );
    if (actualImages.length !== seedImages.length)
      throw new Error(
        `${slug}: imported native image blocks differ from the seed.`,
      );
    for (let index = 0; index < seedImages.length; index += 1) {
      const seedImage = record(seedImages[index]);
      const source = record(record(seedImage.asset).$media);
      const manifest = manifestByUrl.get(source.url)!;
      const image = record(actualImages[index]);
      const localAsset = record(image.asset);
      const filePrefix = "/_emdash/api/media/file/";
      const localUrl = typeof localAsset.url === "string" ? localAsset.url : "";
      const storageKey = localUrl.startsWith(filePrefix)
        ? decodeURIComponent(localUrl.slice(filePrefix.length))
        : "";
      if (
        manifest.slug !== slug ||
        source.url !== manifest.sourceUrl ||
        source.filename !== `${slug}-${manifest.filename}` ||
        (source.alt ?? "") !== (seedImage.alt ?? "") ||
        !/^[A-Za-z0-9._-]+$/u.test(storageKey)
      )
        throw new Error(
          `${slug}: image did not resolve to the expected safe local EmDash asset.`,
        );
      usedManifestKeys.add(manifest.key);
      const received = await input.readMediaSha256(storageKey, manifest.size);
      if (
        received.size !== manifest.size ||
        received.sha256 !== manifest.sha256
      )
        throw new Error(
          `${slug}: uploaded media bytes do not match the source SHA-256.`,
        );
    }

    const contentSha256 = await acceptedContentHash(actualData);
    const draftRevisionId = actualRecord.draftRevisionId ?? null;
    receiptRows.push(
      `<!-- emdash-page-readback:v1 snapshot=${audit.snapshot} slug=${slug} revision=${draftRevisionId ?? "unavailable"} sha256=${contentSha256} -->`,
    );
    pages.push({
      slug,
      draftRevisionId,
      contentSha256,
      mediaCount: seedImages.length,
    });
  }

  if (usedManifestKeys.size !== manifestByKey.size)
    throw new Error("Media manifest contains unused or unmapped assets.");

  return {
    snapshot: audit.snapshot,
    receiptMarkdown: [
      "# Verified canonical EmDash migration read-back receipts",
      "",
      `Snapshot: ${audit.snapshot}`,
      `Pages: ${pages.length}`,
      "Receipts were computed from every EmDash draft read-back after Portable Text and native media checks. Media bytes were fetched from each resolved local storage key and matched to the source SHA-256.",
      "",
      ...receiptRows,
      "",
    ].join("\n"),
    pages,
  };
}
