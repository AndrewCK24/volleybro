import { z } from "zod";
import { parse, register } from "pele/core";
import flowchart from "pele/diagrams/flowchart";

register(flowchart);

export const MAX_FLOWCHART_SOURCE_LENGTH = 10_000;
export const MAX_FLOWCHART_NODES = 100;
export const MAX_FLOWCHART_EDGES = 200;
const MAX_DETAILS_JSON_LENGTH = 64_000;
const MAX_PATHS_JSON_LENGTH = 16_000;
const NODE_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{0,47}$/u;

function parseFlowchartModel(source: string) {
  try {
    const model = parse(source, {
      limit: MAX_FLOWCHART_SOURCE_LENGTH,
      maxEdges: MAX_FLOWCHART_EDGES,
    });
    if (model.type !== "flowchart") return null;
    if (
      model.nodes.size === 0 ||
      model.nodes.size > MAX_FLOWCHART_NODES ||
      [...model.nodes.keys()].some((nodeId) => !NODE_ID_PATTERN.test(nodeId)) ||
      model.edges.length > MAX_FLOWCHART_EDGES ||
      model.classes.size > 0 ||
      model.defaultEdgeStyle?.length ||
      model.tooltips.size > 0 ||
      [...model.nodes.values()].some(
        (node) =>
          node.styles.length > 0 ||
          node.classes.length > 0 ||
          node.link ||
          node.linkTarget ||
          node.img ||
          node.icon,
      ) ||
      model.edges.some(
        (edge) =>
          (edge.style?.length ?? 0) > 0 ||
          edge.classes.length > 0 ||
          edge.isUserDefinedId,
      )
    )
      return null;
    return model;
  } catch {
    return null;
  }
}

export function getInteractiveFlowchartModel(source: string) {
  return parseFlowchartModel(source);
}

export const interactiveFlowchartSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_FLOWCHART_SOURCE_LENGTH)
  .superRefine((source, context) => {
    if (!/^(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR)(?:\s|$)/u.test(source)) {
      context.addIssue({
        code: "custom",
        message:
          "Flowchart source must begin with a flowchart or graph declaration.",
      });
      return;
    }

    if (
      /^---\s*$/mu.test(source) ||
      /%%\s*\{\s*init|<\s*\/?\s*[A-Za-z]/iu.test(source) ||
      /^\s*(?:%%|classDef\b|class\b|style\b|click\b|linkStyle\b)/imu.test(
        source,
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Flowchart source cannot include frontmatter, init directives, raw HTML, links, or custom styling.",
      });
      return;
    }

    if (!parseFlowchartModel(source)) {
      context.addIssue({
        code: "custom",
        message:
          "Flowchart source must be valid and stay within the node and edge limits.",
      });
    }
  });

export const interactiveFlowchartDetailsSchema = z.record(
  z.string().regex(NODE_ID_PATTERN),
  z.strictObject({
    title: z.string().max(240),
    body: z.string().max(8_000),
  }),
);

export const interactiveFlowchartPathsSchema = z
  .array(
    z.strictObject({
      id: z.string().regex(NODE_ID_PATTERN),
      label: z.string().trim().min(1).max(160),
      nodeIds: z.array(z.string().regex(NODE_ID_PATTERN)).min(1).max(200),
    }),
  )
  .max(40);

export const interactiveFlowchartPropsSchema = z
  .strictObject({
    source: interactiveFlowchartSourceSchema,
    details: interactiveFlowchartDetailsSchema,
    paths: interactiveFlowchartPathsSchema.optional(),
  })
  .superRefine(({ source, details, paths }, context) => {
    const model = parseFlowchartModel(source);
    if (!model) return;
    const nodeIds = new Set(model.nodes.keys());

    for (const nodeId of Object.keys(details)) {
      if (!nodeIds.has(nodeId)) {
        context.addIssue({
          code: "custom",
          path: ["details", nodeId],
          message: `Unknown flowchart node id: ${nodeId}`,
        });
      }
    }

    if (!paths) return;

    const connections = new Set(
      model.edges.map((edge) => `${edge.start}\u0000${edge.end}`),
    );
    const pathIds = new Set<string>();
    paths.forEach((path, index) => {
      if (pathIds.has(path.id)) {
        context.addIssue({
          code: "custom",
          path: ["paths", index, "id"],
          message: `Duplicate path id: ${path.id}`,
        });
      }
      pathIds.add(path.id);
      path.nodeIds.forEach((nodeId, nodeIndex) => {
        const previous = path.nodeIds[nodeIndex - 1];
        if (
          previous &&
          nodeIds.has(previous) &&
          nodeIds.has(nodeId) &&
          !connections.has(`${previous}\u0000${nodeId}`)
        ) {
          context.addIssue({
            code: "custom",
            path: ["paths", index, "nodeIds", nodeIndex],
            message: "Path steps must follow an existing flowchart edge.",
          });
        }
        if (!nodeIds.has(nodeId)) {
          context.addIssue({
            code: "custom",
            path: ["paths", index, "nodeIds", nodeIndex],
            message: `Unknown flowchart node id: ${nodeId}`,
          });
        }
      });
    });
  });

export const interactiveFlowchartBlockFieldsShape = {
  source: interactiveFlowchartSourceSchema,
  details: z.string().max(MAX_DETAILS_JSON_LENGTH),
  paths: z.string().max(MAX_PATHS_JSON_LENGTH).default("[]"),
};

export const interactiveFlowchartBlockFieldsSchema = z
  .strictObject(interactiveFlowchartBlockFieldsShape)
  .superRefine(({ source, details, paths }, context) => {
    let parsedDetails: unknown;
    let parsedPaths: unknown;
    try {
      parsedDetails = JSON.parse(details);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["details"],
        message: "Flowchart details must be valid JSON.",
      });
      return;
    }
    try {
      parsedPaths = JSON.parse(paths);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["paths"],
        message: "Flowchart paths must be valid JSON.",
      });
      return;
    }

    const parsedProps = interactiveFlowchartPropsSchema.safeParse({
      source,
      details: parsedDetails,
      paths: parsedPaths,
    });
    if (!parsedProps.success) {
      for (const issue of parsedProps.error.issues) {
        context.addIssue({ ...issue, path: issue.path });
      }
    }
  });

export type InteractiveFlowchartDetails = z.infer<
  typeof interactiveFlowchartDetailsSchema
>;
export type InteractiveFlowchartPath = z.infer<
  typeof interactiveFlowchartPathsSchema
>[number];
export type InteractiveFlowchartProps = z.infer<
  typeof interactiveFlowchartPropsSchema
>;
