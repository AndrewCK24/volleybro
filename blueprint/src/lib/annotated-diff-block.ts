import { z } from "zod";

export const annotatedDiffBlockSchema = z.strictObject({
  _type: z.literal("annotated_diff"),
  _version: z.number().optional(),
  _key: z.string().min(1).optional(),
  language: z.string().min(1).optional(),
  lines: z
    .array(
      z.strictObject({
        kind: z.enum(["context", "add", "remove"]),
        text: z.string(),
      }),
    )
    .min(1),
});

export type AnnotatedDiffBlock = z.infer<typeof annotatedDiffBlockSchema>;
