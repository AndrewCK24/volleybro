import { z } from "zod";

const portableSpanSchema = z.strictObject({
  _key: z.string().optional(),
  _type: z.literal("span"),
  marks: z.array(z.string()).optional(),
  text: z.string(),
});

const portableTextBlockSchema = z.strictObject({
  _key: z.string().optional(),
  _type: z.literal("block"),
  children: z.array(portableSpanSchema),
  markDefs: z
    .array(
      z.strictObject({
        _key: z.string(),
        _type: z.string(),
        href: z.string().optional(),
      }),
    )
    .optional(),
  style: z.enum(["normal", "h2", "h3", "blockquote"]).optional(),
});

const legacyMediaAssetSchema = z.strictObject({
  key: z.string().regex(/^legacy-image-[a-z0-9-]+$/u),
  sha256: z.string().regex(/^[a-f0-9]{64}$/u),
  alt: z.string(),
  asset: z.union([
    z.strictObject({
      $media: z.strictObject({
        url: z.url(),
        alt: z.string().optional(),
        filename: z.string().optional(),
      }),
    }),
    z.strictObject({
      id: z.string().min(1),
      provider: z.literal("local").optional(),
      alt: z.string().optional(),
      filename: z.string().optional(),
      mimeType: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      meta: z.strictObject({
        storageKey: z.string().regex(/^[A-Za-z0-9._-]+$/u),
      }),
    }),
  ]),
});

const versionedBlock = <S extends z.ZodRawShape>(shape: S) =>
  z.strictObject({ ...shape, _key: z.string().min(1).optional() });

export const blockSchema = z.discriminatedUnion("_type", [
  versionedBlock({
    _type: z.literal("markdown"),
    _version: z.literal(1),
    markdown: z.string(),
  }),
  versionedBlock({
    _type: z.literal("prose"),
    _version: z.literal(1),
    value: z.array(portableTextBlockSchema),
  }),
  versionedBlock({
    _type: z.literal("legacy_html"),
    _version: z.literal(1),
    html: z.string(),
  }),
  versionedBlock({
    _type: z.literal("legacy_media"),
    _version: z.literal(1),
    ...legacyMediaAssetSchema.shape,
  }),
  versionedBlock({
    _type: z.literal("decision_cards"),
    _version: z.literal(1),
    records: z.string(),
  }),
  versionedBlock({
    _type: z.literal("risk_table"),
    _version: z.literal(1),
    risks: z.string(),
  }),
  versionedBlock({
    _type: z.literal("scenario"),
    _version: z.literal(1),
    id: z.string().min(1),
    given: z.string(),
    when: z.string(),
    then: z.string(),
    rendered_in_legacy_html: z.boolean().optional(),
  }),
  versionedBlock({
    _type: z.literal("scenario_cards"),
    _version: z.literal(1),
    items: z.string(),
    rendered_in_legacy_html: z.boolean().optional(),
  }),
  versionedBlock({
    _type: z.literal("interactive_flowchart"),
    _version: z.literal(1),
    nodes: z.string(),
    edges: z.string(),
    details: z.string(),
  }),
]);

const changeDataBaseSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  linear_issue: z
    .string()
    .regex(/^[A-Z][A-Z0-9]*-[1-9]\d*$/u)
    .optional(),
  pull_requests: z
    .array(
      z.strictObject({
        url: z
          .string()
          .regex(
            /^https:\/\/github\.com\/andrewck24\/volleybro\/pull\/[1-9]\d*$/u,
          ),
      }),
    )
    .max(12)
    .default([]),
  blocks: z.array(blockSchema),
  id: z.string().optional(),
  status: z.string().optional(),
  authorId: z.string().nullable().optional(),
  primaryBylineId: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
  publishedAt: z.date().or(z.string()).nullable().optional(),
  scheduledAt: z.date().or(z.string()).nullable().optional(),
  draftRevisionId: z.string().optional(),
  liveRevisionId: z.string().optional(),
  locale: z.string().optional(),
  translationGroup: z.string().nullable().optional(),
});

function isLegacyContent(blocks: ChangeBlock[]) {
  return blocks.some((block) => block._type === "legacy_html");
}

function requireIssueForAuthoredContent(
  value: { linear_issue?: string; blocks: ChangeBlock[] },
  context: z.RefinementCtx,
) {
  if (!isLegacyContent(value.blocks) && !value.linear_issue) {
    context.addIssue({
      code: "custom",
      path: ["linear_issue"],
      message: "Authored Changes require a Linear issue.",
    });
  }
}

export const changeDataSchema = changeDataBaseSchema.superRefine(
  requireIssueForAuthoredContent,
);

export type ChangeBlock = z.infer<typeof blockSchema>;
export type ChangeData = z.infer<typeof changeDataSchema>;
export type EmDashChangeEntry = { id: string; data: ChangeData };

const acceptedContentBaseSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  linear_issue: z
    .string()
    .regex(/^[A-Z][A-Z0-9]*-[1-9]\d*$/u)
    .optional(),
  blocks: z.array(blockSchema),
});

export const acceptedContentSchema = acceptedContentBaseSchema.superRefine(
  requireIssueForAuthoredContent,
);

export function omitCmsKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitCmsKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "_key")
      .map(([key, child]) => [key, omitCmsKeys(child)]),
  );
}

function acceptedHashProjection(value: z.infer<typeof acceptedContentSchema>) {
  return {
    ...value,
    blocks: value.blocks.map(omitCmsKeys),
  };
}

export function canonicalizeContentValue(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.map(canonicalizeContentValue).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalizeContentValue(record[key])}`,
      )
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export async function acceptedContentHash(value: unknown): Promise<string> {
  const stored = changeDataSchema.safeParse(value);
  if (!stored.success)
    throw new Error(
      "Change content does not match the accepted EmDash schema.",
    );
  const parsed = acceptedContentSchema.safeParse({
    title: stored.data.title,
    description: stored.data.description,
    linear_issue: stored.data.linear_issue,
    blocks: stored.data.blocks,
  });
  if (!parsed.success)
    throw new Error(
      "Change content does not match the accepted EmDash schema.",
    );
  const content = acceptedHashProjection(parsed.data);
  const bytes = new TextEncoder().encode(canonicalizeContentValue(content));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function parseJsonField<T>(
  value: string,
  schema: z.ZodType<T>,
  field: string,
): T {
  let json: unknown;
  try {
    json = JSON.parse(value);
  } catch {
    throw new Error(`Change block field "${field}" is not valid JSON.`);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    throw new Error(`Change block field "${field}" does not match its schema.`);
  return parsed.data;
}
