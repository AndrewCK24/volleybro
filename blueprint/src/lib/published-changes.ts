import type { ContentEntry } from "emdash";
import { getDb } from "emdash/runtime";
import { changeDataSchema, type ChangeData } from "./emdash-change-record";
import { z } from "zod";
import { changeArtifactMetadata } from "./change-artifact";

type ChangeListData = Pick<
  ChangeData,
  "title" | "description" | "pull_requests" | "publishedAt"
> & {
  scenarioCount: number;
};
export type EmDashPage = Pick<ContentEntry<ChangeListData>, "id" | "data">;

type BlueprintChangeRow = {
  id: string;
  slug: string;
  title: string;
  linear_issue: string | null;
  description: string | null;
  pull_requests: string | Array<{ url: string }> | null;
  published_at: string | null;
  live_revision_id: string | null;
  status: string;
  deleted_at: string | null;
};

const changeListDataSchema = z
  .strictObject({
    title: changeDataSchema.in.shape.title,
    description: changeDataSchema.in.shape.description,
    linear_issue: changeDataSchema.in.shape.linear_issue.unwrap(),
    pull_requests: changeDataSchema.in.shape.pull_requests,
    publishedAt: changeDataSchema.in.shape.publishedAt,
    scenarioCount: z.number().int().nonnegative(),
  })
  .transform((data) => ({
    ...data,
    description: data.description ?? undefined,
  }));
export async function readPublishedChanges(): Promise<EmDashPage[]> {
  const runtime = await import("cloudflare:workers");
  const env = runtime.env as {
    BLUEPRINT_PAGES?: {
      get(key: string): Promise<{ json(): Promise<unknown> } | null>;
    };
  };
  const rendererId = import.meta.env.BLUEPRINT_RENDERER_ID ?? "";
  if (!env.BLUEPRINT_PAGES || !/^[a-f0-9]{40,64}$/u.test(rendererId)) return [];
  const catalogObject = await env.BLUEPRINT_PAGES.get(
    `blueprint-pages/v1/${rendererId}/catalog.json`,
  );
  if (!catalogObject) return [];
  const catalog = (await catalogObject.json()) as {
    version?: unknown;
    rendererId?: unknown;
    entries?: Record<string, { public?: unknown }>;
  };
  if (
    !catalog ||
    catalog.version !== 1 ||
    catalog.rendererId !== rendererId ||
    !catalog.entries ||
    typeof catalog.entries !== "object" ||
    Array.isArray(catalog.entries)
  )
    throw new Error("Invalid Change artifact catalog.");

  const db = (await getDb()).$extendTables<{
    ec_blueprint_changes: BlueprintChangeRow;
  }>();
  const entries = await db
    .selectFrom("ec_blueprint_changes")
    .select([
      "id",
      "slug",
      "title",
      "linear_issue",
      "description",
      "pull_requests",
      "published_at",
      "live_revision_id",
    ])
    .where("deleted_at", "is", null)
    .where("status", "=", "published")
    .orderBy("published_at", "desc")
    .orderBy("id", "desc")
    .execute();

  return entries.flatMap((entry) => {
    if (!entry.live_revision_id || !Object.hasOwn(catalog.entries!, entry.id))
      return [];
    const metadata = changeArtifactMetadata(
      catalog.entries![entry.id]?.public,
      {
        rendererId,
        contentId: entry.id,
        slug: entry.slug,
        revisionId: entry.live_revision_id,
        visibility: "public",
      },
    );
    if (!metadata) return [];
    let pullRequests: unknown = entry.pull_requests;
    if (typeof pullRequests === "string") {
      try {
        pullRequests = JSON.parse(pullRequests) as unknown;
      } catch {
        throw new Error(
          `Published Change "${entry.slug}" has invalid PR metadata.`,
        );
      }
    }
    const parsed = changeListDataSchema.safeParse({
      title: entry.title,
      linear_issue: entry.linear_issue,
      description: entry.description,
      pull_requests: pullRequests ?? [],
      publishedAt: entry.published_at,
      scenarioCount: metadata.scenarioCount,
    });
    if (!parsed.success) {
      throw new Error(
        `Published Change "${entry.slug}" has invalid summary metadata.`,
      );
    }
    return [{ id: entry.slug, data: parsed.data }];
  });
}
