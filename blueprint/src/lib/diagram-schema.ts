import { z } from "zod";

const finite = z.number();
const opacity = finite.min(0).max(1);
const paint = z.union([
  z.enum([
    "foreground",
    "background",
    "muted",
    "mutedBackground",
    "primary",
    "primaryForeground",
    "border",
    "card",
    "success",
    "warning",
    "destructive",
    "chart1",
    "chart3",
    "chart5",
    "primaryWash",
    "foregroundCard3",
    "foregroundTransparent30",
    "foregroundTransparent2",
    "foregroundBackground2",
    "warningMuted",
    "destructiveMuted",
    "none",
    "currentColor",
  ]),
  z.string().regex(/^#[\da-fA-F]{3}(?:[\da-fA-F]{3})?$/u),
]);

const sharedElementShape = {
  id: z
    .string()
    .max(256)
    .regex(/^[\p{L}\p{N}_][\p{L}\p{M}\p{N}_.:-]*$/u)
    .optional(),
  fill: paint.optional(),
  stroke: paint.optional(),
  strokeWidth: finite.min(0).optional(),
  opacity: opacity.optional(),
  fillOpacity: opacity.optional(),
  strokeOpacity: opacity.optional(),
  strokeDasharray: z.array(finite.min(0)).min(1).max(256).optional(),
  strokeLinecap: z.enum(["butt", "round", "square"]).optional(),
  strokeLinejoin: z
    .enum(["arcs", "bevel", "miter", "miter-clip", "round"])
    .optional(),
};

const arrowShape = {
  arrowStart: z.boolean().optional(),
  arrowEnd: z.boolean().optional(),
  markerStart: z
    .string()
    .max(256)
    .regex(/^[\p{L}\p{N}_][\p{L}\p{M}\p{N}_.:-]*$/u)
    .optional(),
  markerEnd: z
    .string()
    .max(256)
    .regex(/^[\p{L}\p{N}_][\p{L}\p{M}\p{N}_.:-]*$/u)
    .optional(),
};

const preserveAspectRatioSchema = z.union([
  z.strictObject({ align: z.literal("none") }),
  z.strictObject({
    align: z.enum([
      "xMinYMin",
      "xMidYMin",
      "xMaxYMin",
      "xMinYMid",
      "xMidYMid",
      "xMaxYMid",
      "xMinYMax",
      "xMidYMax",
      "xMaxYMax",
    ]),
    mode: z.enum(["meet", "slice"]).optional(),
  }),
]);

const textRunSchema = z.strictObject({
  id: sharedElementShape.id,
  text: z.string().max(20_000),
  x: finite.optional(),
  y: finite.optional(),
  dx: finite.optional(),
  dy: finite.optional(),
  rotate: z.array(finite).max(256).optional(),
  fill: paint.optional(),
  stroke: paint.optional(),
  strokeWidth: finite.min(0).optional(),
  opacity: opacity.optional(),
  fontSize: finite.min(0).optional(),
  fontFamily: z.enum(["sans", "serif", "mono"]).optional(),
  fontWeight: z
    .union([
      z.enum(["normal", "bold"]),
      z.number().int().min(100).max(900).multipleOf(100),
    ])
    .optional(),
  textAnchor: z.enum(["start", "middle", "end"]).optional(),
  dominantBaseline: z
    .enum(["auto", "middle", "hanging", "text-before-edge", "text-after-edge"])
    .optional(),
  letterSpacing: z
    .union([z.literal(0.3), z.literal(0.4), z.literal(0.6), z.literal(1.1)])
    .optional(),
});

const pathCommandArities: Record<string, number> = {
  M: 2,
  m: 2,
  L: 2,
  l: 2,
  H: 1,
  h: 1,
  V: 1,
  v: 1,
  C: 6,
  c: 6,
  S: 4,
  s: 4,
  Q: 4,
  q: 4,
  T: 2,
  t: 2,
  A: 7,
  a: 7,
  Z: 0,
  z: 0,
};

export const pathCommandSchema = z
  .strictObject({
    op: z.enum([
      "M",
      "m",
      "L",
      "l",
      "H",
      "h",
      "V",
      "v",
      "C",
      "c",
      "S",
      "s",
      "Q",
      "q",
      "T",
      "t",
      "A",
      "a",
      "Z",
      "z",
    ]),
    values: z.array(finite).max(7),
  })
  .superRefine(({ op, values }, context) => {
    if (values.length !== pathCommandArities[op]) {
      context.addIssue({
        code: "custom",
        path: ["values"],
        message: `Path command ${op} requires ${pathCommandArities[op]} numeric values.`,
      });
    }
    if ((op === "A" || op === "a") && values.length === 7) {
      if (values[0] < 0 || values[1] < 0) {
        context.addIssue({
          code: "custom",
          path: ["values"],
          message: "Arc radii must be non-negative.",
        });
      }
      if (![0, 1].includes(values[3]) || ![0, 1].includes(values[4])) {
        context.addIssue({
          code: "custom",
          path: ["values"],
          message: "Arc flags must be 0 or 1.",
        });
      }
    }
  });

const transformSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("translate"), x: finite, y: finite }),
  z.strictObject({ type: z.literal("scale"), x: finite, y: finite }),
  z
    .strictObject({
      type: z.literal("rotate"),
      angle: finite,
      cx: finite.optional(),
      cy: finite.optional(),
    })
    .refine((value) => (value.cx === undefined) === (value.cy === undefined)),
  z.strictObject({
    type: z.literal("matrix"),
    values: z.tuple([finite, finite, finite, finite, finite, finite]),
  }),
  z.strictObject({ type: z.literal("skewX"), angle: finite }),
  z.strictObject({ type: z.literal("skewY"), angle: finite }),
]);

export type DiagramTransform = z.infer<typeof transformSchema>;
export type DiagramPaint = z.infer<typeof paint>;
export type DiagramPathCommand = z.infer<typeof pathCommandSchema>;

const markerSchema = z.strictObject({
  id: z
    .string()
    .max(256)
    .regex(/^[\p{L}\p{N}_][\p{L}\p{M}\p{N}_.:-]*$/u),
  viewBox: z.strictObject({
    x: finite,
    y: finite,
    width: finite.positive(),
    height: finite.positive(),
  }),
  width: finite.positive(),
  height: finite.positive(),
  refX: finite,
  refY: finite,
  orient: z.union([z.enum(["auto", "auto-start-reverse"]), finite]),
  units: z.enum(["strokeWidth", "userSpaceOnUse"]).optional(),
  path: z.array(pathCommandSchema).min(1).max(256),
  fill: paint.optional(),
  stroke: paint.optional(),
});
type SharedElement = {
  id?: string;
  fill?: DiagramPaint;
  stroke?: DiagramPaint;
  strokeWidth?: number;
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
  strokeDasharray?: number[];
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "arcs" | "bevel" | "miter" | "miter-clip" | "round";
};

export type DiagramElement =
  | (SharedElement & {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx?: number;
      ry?: number;
    })
  | (SharedElement & { type: "circle"; cx: number; cy: number; r: number })
  | (SharedElement & {
      type: "ellipse";
      cx: number;
      cy: number;
      rx: number;
      ry: number;
    })
  | (SharedElement & {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      arrowStart?: boolean;
      arrowEnd?: boolean;
      markerStart?: string;
      markerEnd?: string;
    })
  | (SharedElement & {
      type: "path";
      commands: DiagramPathCommand[];
      arrowStart?: boolean;
      arrowEnd?: boolean;
      markerStart?: string;
      markerEnd?: string;
    })
  | (SharedElement & {
      type: "polyline";
      points: [number, number][];
      arrowStart?: boolean;
      arrowEnd?: boolean;
      markerStart?: string;
      markerEnd?: string;
    })
  | (SharedElement & { type: "polygon"; points: [number, number][] })
  | (SharedElement & {
      type: "text";
      x: number;
      y: number;
      text: string;
      runs?: z.infer<typeof textRunSchema>[];
      fontSize?: number;
      fontFamily?: "sans" | "serif" | "mono";
      fontWeight?: number | "normal" | "bold";
      textAnchor?: "start" | "middle" | "end";
      dominantBaseline?:
        "auto" | "middle" | "hanging" | "text-before-edge" | "text-after-edge";
      letterSpacing?: number;
    })
  | (SharedElement & {
      type: "group";
      children: DiagramElement[];
      transform?: DiagramTransform[];
    });

const diagramElementSchema: z.ZodType<DiagramElement> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.strictObject({
      type: z.literal("rect"),
      ...sharedElementShape,
      x: finite,
      y: finite,
      width: finite.min(0),
      height: finite.min(0),
      rx: finite.min(0).optional(),
      ry: finite.min(0).optional(),
    }),
    z.strictObject({
      type: z.literal("circle"),
      ...sharedElementShape,
      cx: finite,
      cy: finite,
      r: finite.min(0),
    }),
    z.strictObject({
      type: z.literal("ellipse"),
      ...sharedElementShape,
      cx: finite,
      cy: finite,
      rx: finite.min(0),
      ry: finite.min(0),
    }),
    z.strictObject({
      type: z.literal("line"),
      ...sharedElementShape,
      ...arrowShape,
      x1: finite,
      y1: finite,
      x2: finite,
      y2: finite,
    }),
    z.strictObject({
      type: z.literal("path"),
      ...sharedElementShape,
      ...arrowShape,
      commands: z.array(pathCommandSchema).min(1).max(10_000),
    }),
    z.strictObject({
      type: z.literal("polyline"),
      ...sharedElementShape,
      ...arrowShape,
      points: z
        .array(z.tuple([finite, finite]))
        .min(2)
        .max(10_000),
    }),
    z.strictObject({
      type: z.literal("polygon"),
      ...sharedElementShape,
      points: z
        .array(z.tuple([finite, finite]))
        .min(3)
        .max(10_000),
    }),
    z.strictObject({
      type: z.literal("text"),
      ...sharedElementShape,
      x: finite,
      y: finite,
      text: z.string().max(20_000),
      runs: z.array(textRunSchema).min(1).max(256).optional(),
      fontSize: finite.min(0).optional(),
      fontFamily: z.enum(["sans", "serif", "mono"]).optional(),
      fontWeight: z
        .union([
          z.enum(["normal", "bold"]),
          z.number().int().min(100).max(900).multipleOf(100),
        ])
        .optional(),
      letterSpacing: z
        .union([z.literal(0.3), z.literal(0.4), z.literal(0.6), z.literal(1.1)])
        .optional(),
      textAnchor: z.enum(["start", "middle", "end"]).optional(),
      dominantBaseline: z
        .enum([
          "auto",
          "middle",
          "hanging",
          "text-before-edge",
          "text-after-edge",
        ])
        .optional(),
    }),
    z.strictObject({
      type: z.literal("group"),
      ...sharedElementShape,
      children: z.array(diagramElementSchema).max(10_000),
      transform: z.array(transformSchema).max(100).optional(),
    }),
  ]),
);

export const diagramBlockSchema = z
  .strictObject({
    _type: z.literal("diagram"),
    _version: z.number().optional(),
    _key: z.string().min(1).optional(),
    title: z.string().max(2_000).optional(),
    description: z.string().max(4_000).optional(),
    preserveAspectRatio: preserveAspectRatioSchema.optional(),
    viewBox: z.strictObject({
      x: finite,
      y: finite,
      width: finite.positive(),
      height: finite.positive(),
    }),
    anchors: z
      .array(
        z.strictObject({
          id: z
            .string()
            .max(256)
            .regex(/^[\p{L}\p{N}_][\p{L}\p{M}\p{N}_.:-]*$/u),
          x: finite.optional(),
          y: finite.optional(),
        }),
      )
      .max(2_000)
      .optional(),
    elements: z.array(diagramElementSchema).min(1).max(10_000),
    markers: z.array(markerSchema).max(256).optional(),
  })
  .superRefine((block, context) => {
    let count = 0;
    const visit = (elements: DiagramElement[], depth: number) => {
      for (const [index, element] of elements.entries()) {
        count += 1;
        if (count > 10_000) {
          context.addIssue({
            code: "custom",
            path: ["elements", index],
            message: "Diagram contains too many elements.",
          });
          return;
        }
        if (depth > 24) {
          context.addIssue({
            code: "custom",
            path: ["elements", index],
            message: "Diagram groups cannot be nested more than 24 levels.",
          });
          return;
        }
        if (element.type === "group") visit(element.children, depth + 1);
      }
    };
    visit(block.elements, 1);
  });

export type DiagramBlock = z.infer<typeof diagramBlockSchema>;
