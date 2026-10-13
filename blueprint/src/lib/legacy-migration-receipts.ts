import { z } from "zod";
import {
  acceptedContentHash,
  changeDataSchema,
} from "./emdash-change-record.ts";

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

type Data = z.infer<typeof changeDataSchema>;
type LegacyMedia = Extract<Data["blocks"][number], { _type: "legacy_media" }>;

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function withoutCmsKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutCmsKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "_key")
      .map(([key, child]) => [key, withoutCmsKeys(child)]),
  );
}

function migrationProjection(data: Data): unknown {
  return {
    title: data.title,
    description: data.description,
    linear_issue: data.linear_issue,
    pull_requests: data.pull_requests,
    blocks: data.blocks.map((block) => {
      if (block._type !== "legacy_media") return withoutCmsKeys(block);
      const { asset: _asset, _key: _cmsKey, ...stableFields } = block;
      return {
        ...stableFields,
        asset: { verifiedMigrationMediaKey: block.key },
      };
    }),
  };
}

export type LegacyMediaDigestReader = (
  storageKey: string,
  expectedSize: number,
) => Promise<{ sha256: string; size: number }>;

export async function finalizeLegacyMigrationReceipts(input: {
  audit: unknown;
  seed: unknown;
  mediaManifest: unknown;
  readback: unknown;
  readMediaSha256: LegacyMediaDigestReader;
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

  const expectedBySlug = new Map(
    seed.content.blueprint_changes.map((entry) => [entry.slug, entry]),
  );
  if (expectedBySlug.size !== seed.content.blueprint_changes.length)
    throw new Error("Transfer seed contains duplicate Change slugs.");
  const legacySlugs = legacyPages.map((page) => page.slug).sort();
  if (
    legacySlugs.some((slug) => !expectedBySlug.has(slug)) ||
    legacySlugs.length !== audit.legacyPageCount
  ) {
    throw new Error(
      "Transfer seed does not contain the exact audited legacy pages.",
    );
  }

  const actualBySlug = new Map(readback.items.map((item) => [item.slug, item]));
  if (actualBySlug.size !== readback.items.length)
    throw new Error("EmDash read-back contains duplicate slugs.");
  for (const entry of seed.content.blueprint_changes) {
    const actual = actualBySlug.get(entry.slug);
    if (
      !actual ||
      actual.type !== "blueprint_changes" ||
      actual.status !== "draft"
    )
      throw new Error(`${entry.slug}: expected one imported EmDash draft.`);
  }
  if (actualBySlug.size !== expectedBySlug.size)
    throw new Error(
      "EmDash read-back and transfer seed have different slug sets.",
    );

  const manifestByKey = new Map(mediaManifest.map((row) => [row.key, row]));
  if (manifestByKey.size !== mediaManifest.length)
    throw new Error("Migration media manifest contains duplicate keys.");
  const receiptRows = [];
  const pages = [];
  const usedManifestKeys = new Set<string>();

  for (const slug of legacySlugs) {
    const expected = changeDataSchema.parse(expectedBySlug.get(slug)!.data);
    const actualRecord = actualBySlug.get(slug)!;
    if (actualRecord.status !== "draft")
      throw new Error(
        `${slug}: import must remain draft until receipts are finalized.`,
      );
    const actual = changeDataSchema.parse(actualRecord.data);
    if (
      canonicalize(migrationProjection(expected)) !==
      canonicalize(migrationProjection(actual))
    )
      throw new Error(
        `${slug}: imported content differs from its transfer seed.`,
      );

    const expectedMedia = expected.blocks.filter(
      (block): block is LegacyMedia => block._type === "legacy_media",
    );
    const actualMedia = new Map(
      actual.blocks.flatMap((block) =>
        block._type === "legacy_media" ? [[block.key, block] as const] : [],
      ),
    );
    if (actualMedia.size !== expectedMedia.length)
      throw new Error(`${slug}: imported media blocks do not match the seed.`);

    for (const block of expectedMedia) {
      const manifest = manifestByKey.get(block.key);
      const actualBlock = actualMedia.get(block.key);
      if (!manifest || !actualBlock)
        throw new Error(
          `${slug}: ${block.key} has no exact media manifest/read-back row.`,
        );
      if (
        manifest.slug !== slug ||
        manifest.sha256 !== block.sha256 ||
        manifest.key !== block.key
      ) {
        throw new Error(
          `${slug}: ${block.key} source integrity does not match the audit.`,
        );
      }
      usedManifestKeys.add(block.key);
      const sourceAsset = block.asset;
      if (!("$media" in sourceAsset))
        throw new Error(`${slug}: ${block.key} seed source URL is missing.`);
      const localAsset = actualBlock.asset;
      if (
        !("meta" in localAsset) ||
        localAsset.provider !== "local" ||
        !/^[A-Za-z0-9._-]+$/u.test(localAsset.meta.storageKey)
      ) {
        throw new Error(
          `${slug}: ${block.key} did not resolve to a safe local EmDash media asset.`,
        );
      }
      if (
        sourceAsset.$media.url !== manifest.sourceUrl ||
        sourceAsset.$media.filename !== `${slug}-${manifest.filename}` ||
        (sourceAsset.$media.alt ?? "") !== block.alt
      ) {
        throw new Error(
          `${slug}: ${block.key} source URL/filename/alt differs from the media manifest.`,
        );
      }
      const received = await input.readMediaSha256(
        localAsset.meta.storageKey,
        manifest.size,
      );
      if (
        received.size !== manifest.size ||
        received.sha256 !== manifest.sha256
      )
        throw new Error(
          `${slug}: ${block.key} uploaded media bytes do not match the source SHA-256.`,
        );
    }

    const contentSha256 = await acceptedContentHash(actual);
    const draftRevisionId = actualRecord.draftRevisionId ?? null;
    receiptRows.push(
      `<!-- emdash-legacy-entry:v1 snapshot=${audit.snapshot} slug=${slug} sha256=${contentSha256} -->`,
    );
    pages.push({
      slug,
      draftRevisionId,
      contentSha256,
      mediaCount: expectedMedia.length,
    });
  }

  if (usedManifestKeys.size !== manifestByKey.size)
    throw new Error("Media manifest contains unused or unmapped assets.");

  return {
    snapshot: audit.snapshot,
    receiptMarkdown: [
      "# Verified legacy EmDash migration receipts",
      "",
      `Snapshot: ${audit.snapshot}`,
      `Pages: ${pages.length}`,
      "Receipts were computed from EmDash draft read-back after import. Media bytes were fetched from each resolved local storage key and matched to the source SHA-256.",
      "",
      ...receiptRows,
      "",
    ].join("\n"),
    pages,
  };
}
