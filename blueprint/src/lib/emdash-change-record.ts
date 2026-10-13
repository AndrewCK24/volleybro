import { z } from "zod";

const portableSpanSchema = z.strictObject({
  _key: z.string().optional(),
  _type: z.literal("span"),
  marks: z.array(z.string().min(1)).optional(),
  text: z.string(),
});

const safeHrefSchema = z.string().refine((value) => {
  if (/^(?:\/|#)/u.test(value)) return true;
  try {
    return ["https:", "http:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "Expected a safe link URL.");

const markDefinitionSchema = z.strictObject({
  _key: z.string().min(1),
  _type: z.literal("link"),
  href: safeHrefSchema,
  blank: z.boolean().optional(),
});

const textBlockSchema = z
  .strictObject({
    _key: z.string().optional(),
    id: z
      .string()
      .regex(/^[A-Za-z][A-Za-z0-9_:.-]*$/u)
      .optional(),
    _type: z.literal("block"),
    children: z.array(portableSpanSchema),
    markDefs: z.array(markDefinitionSchema).optional(),
    style: z
      .enum(["normal", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"])
      .optional(),
    textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
    listItem: z.enum(["bullet", "number"]).optional(),
    level: z.number().int().min(1).optional(),
  })
  .superRefine((block, context) => {
    const linkKeys = new Set(
      (block.markDefs ?? []).map((definition) => definition._key),
    );
    for (const [spanIndex, span] of block.children.entries()) {
      for (const mark of span.marks ?? []) {
        if (
          [
            "strong",
            "em",
            "code",
            "underline",
            "strike-through",
            "superscript",
            "subscript",
          ].includes(mark)
        )
          continue;
        if (!linkKeys.has(mark)) {
          context.addIssue({
            code: "custom",
            path: ["children", spanIndex, "marks"],
            message: "Unknown Portable Text mark.",
          });
        }
      }
    }
  });

const imageBlockSchema = z.strictObject({
  _key: z.string().min(1).optional(),
  _type: z.literal("image"),
  asset: z.strictObject({
    _ref: z.string().min(1),
  }),
  alt: z.string().optional(),
  caption: z.string().optional(),
  title: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  displayWidth: z.number().positive().optional(),
  displayHeight: z.number().positive().optional(),
  alignment: z.enum(["left", "center", "right", "wide", "full"]).optional(),
  link: z
    .union([
      safeHrefSchema,
      z.strictObject({
        href: safeHrefSchema,
        blank: z.boolean().optional(),
      }),
    ])
    .optional(),
});

const codeBlockSchema = z.strictObject({
  _key: z.string().min(1).optional(),
  _type: z.literal("code"),
  code: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
});

const tableMarkDefinitionSchema = z.looseObject({
  _key: z.string().min(1),
  _type: z.string().min(1),
  href: safeHrefSchema.optional(),
});

const tableCellSchema = z.strictObject({
  _type: z.literal("tableCell"),
  _key: z.string().min(1),
  content: z.array(portableSpanSchema),
  markDefs: z.array(tableMarkDefinitionSchema).optional(),
  isHeader: z.boolean().optional(),
  colspan: z.number().int().min(1).optional(),
  rowspan: z.number().int().min(1).optional(),
  colwidth: z.array(z.number().positive()).optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
});

const tableBlockSchema = z.strictObject({
  _key: z.string().min(1).optional(),
  _type: z.literal("table"),
  rows: z.array(
    z.strictObject({
      _type: z.literal("tableRow"),
      _key: z.string().min(1),
      cells: z.array(tableCellSchema),
    }),
  ),
  hasHeaderRow: z.boolean().optional(),
  markDefs: z.array(tableMarkDefinitionSchema).optional(),
});

const standardBlockSchema = z.discriminatedUnion("_type", [
  textBlockSchema,
  imageBlockSchema,
  codeBlockSchema,
  tableBlockSchema,
]);

const versionedBlock = <S extends z.ZodRawShape>(shape: S) =>
  z.strictObject({ ...shape, _key: z.string().min(1).optional() });

export const blockSchema = z.union([
  standardBlockSchema,
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
  }),
  versionedBlock({
    _type: z.literal("scenario_cards"),
    _version: z.literal(1),
    items: z.string(),
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

function requireIssueForAuthoredContent(
  value: { linear_issue?: string; blocks: ChangeBlock[] },
  context: z.RefinementCtx,
) {
  if (!value.linear_issue) {
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
