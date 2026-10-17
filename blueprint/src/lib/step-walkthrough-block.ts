import { z } from "zod";

const idSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-z0-9_-]*$/u);
const textSchema = z.string().min(1).max(500);

const actorStateSchema = z.strictObject({
  headline: z.string().max(120),
  status: z
    .strictObject({
      label: z.string().min(1).max(60),
      tone: z.enum(["neutral", "warning", "primary", "destructive"]),
    })
    .optional(),
  lines: z.array(textSchema).max(20),
  code: z.string().min(1).max(4000).optional(),
  highlight: z.boolean().optional(),
});

export const stepWalkthroughBlockSchema = z
  .strictObject({
    _type: z.literal("step_walkthrough"),
    _version: z.literal(1),
    _key: z.string().min(1).optional(),
    title: z.string().min(1).max(200),
    flow: z
      .array(
        z.strictObject({
          id: idSchema,
          label: z.string().min(1).max(120),
          kind: z.enum(["terminal", "process", "decision"]),
          branch: z
            .strictObject({ under: idSchema, note: z.string().max(120) })
            .optional(),
        }),
      )
      .min(1)
      .max(24),
    actors: z
      .array(z.strictObject({ id: idSchema, label: z.string().min(1).max(60) }))
      .min(1)
      .max(4),
    systemLabel: z.string().min(1).max(60),
    codeLanguage: z.string().min(1).max(40).optional(),
    scenarios: z
      .array(
        z.strictObject({
          id: idSchema,
          label: z.string().min(1).max(120),
          intro: z.string().max(1000),
          steps: z
            .array(
              z.strictObject({
                title: textSchema,
                node: idSchema,
                actors: z.record(idSchema, actorStateSchema),
                system: textSchema,
              }),
            )
            .min(1)
            .max(20),
        }),
      )
      .min(1)
      .max(12),
  })
  .superRefine((block, context) => {
    const unique = (ids: string[], path: string, label: string) => {
      if (new Set(ids).size !== ids.length)
        context.addIssue({
          code: "custom",
          path: [path],
          message: `${label} IDs must be unique.`,
        });
    };
    const flowIds = block.flow.map(({ id }) => id);
    const actorIds = block.actors.map(({ id }) => id);
    unique(flowIds, "flow", "Flow node");
    unique(actorIds, "actors", "Actor");
    unique(
      block.scenarios.map(({ id }) => id),
      "scenarios",
      "Scenario",
    );

    const mainIds = new Set(
      block.flow.filter(({ branch }) => !branch).map(({ id }) => id),
    );
    block.flow.forEach(({ branch }, index) => {
      if (branch && !mainIds.has(branch.under))
        context.addIssue({
          code: "custom",
          path: ["flow", index, "branch", "under"],
          message: "A branch must sit under a main-row flow node.",
        });
    });

    const expectedActors = [...actorIds].sort().join();
    block.scenarios.forEach(({ steps }, scenarioIndex) =>
      steps.forEach((step, stepIndex) => {
        const path = ["scenarios", scenarioIndex, "steps", stepIndex];
        if (!flowIds.includes(step.node))
          context.addIssue({
            code: "custom",
            path: [...path, "node"],
            message: "Step node must name a flow node.",
          });
        if (Object.keys(step.actors).sort().join() !== expectedActors)
          context.addIssue({
            code: "custom",
            path: [...path, "actors"],
            message: "Every step must give each actor's state exactly once.",
          });
      }),
    );
  });

export type StepWalkthroughBlock = z.infer<typeof stepWalkthroughBlockSchema>;
