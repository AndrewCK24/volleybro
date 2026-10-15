import { getCollection, type CollectionEntry } from "astro:content";
import type { ContentEntry } from "emdash";
import { getDb } from "emdash/runtime";
import { structure, type StructuredData } from "fumadocs-core/mdx-plugins";
import {
  loader,
  type MetaData,
  type PageData,
  type StaticSource,
} from "fumadocs-core/source";
import path from "node:path";
import { changeDataSchema, type ChangeData } from "./emdash-change-record";
import { z } from "zod";

type FeaturePage = CollectionEntry<"featurePages">;
type MetaEntry = CollectionEntry<"featureMeta">;
type ChangeListData = Pick<
  ChangeData,
  "title" | "description" | "pull_requests" | "publishedAt"
> & {
  scenarioCount: number;
};
type EmDashPage = Pick<ContentEntry<ChangeListData>, "id" | "data">;

type BlueprintChangeRow = {
  id: string;
  slug: string;
  title: string;
  linear_issue: string | null;
  description: string | null;
  pull_requests: string | Array<{ url: string }> | null;
  published_at: string | null;
  blocks: string | null;
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
type DesignPage = CollectionEntry<"designMeta">["data"]["pages"][number];
type SourceRaw = FeaturePage | EmDashPage | DesignPage;

type SourceConfig = {
  pageData: PageData & { structuredData: StructuredData; _raw: SourceRaw };
  metaData: MetaData;
};

function buildContentSource(
  pages: FeaturePage[],
  metas: MetaEntry[],
  contentRoot: string,
  isStructureEnabled: boolean,
): StaticSource<SourceConfig> {
  const files: StaticSource<SourceConfig>["files"] = [];
  for (const entry of pages) {
    if (!entry.filePath) continue;
    files.push({
      type: "page",
      path: path.relative(contentRoot, entry.filePath).replace(/\\/g, "/"),
      absolutePath: entry.filePath,
      data: {
        ...entry.data,
        _raw: entry,
        structuredData: isStructureEnabled
          ? structure(entry.body ?? "")
          : { headings: [], contents: [] },
      },
    });
  }
  for (const entry of metas) {
    if (!entry.filePath) continue;
    files.push({
      type: "meta",
      path: path.relative(contentRoot, entry.filePath).replace(/\\/g, "/"),
      absolutePath: entry.filePath,
      data: entry.data,
    });
  }
  return { files };
}

function buildChangeSource(entries: EmDashPage[]): StaticSource<SourceConfig> {
  return {
    files: entries.map((entry) => ({
      type: "page" as const,
      path: `${entry.id}/index.mdx`,
      absolutePath: `emdash://${entry.id}`,
      data: {
        title: entry.data.title,
        description: entry.data.description,
        structuredData: { headings: [], contents: [] },
        _raw: entry,
      },
    })),
  };
}

async function readPublishedChanges(): Promise<EmDashPage[]> {
  const db = await getDb();
  const typedDb = db.$extendTables<{
    ec_blueprint_changes: BlueprintChangeRow;
  }>();
  const entries = await typedDb
    .withRecursive("changeBlocks", (cte) => {
      const rootBlocks = cte
        .selectFrom("ec_blueprint_changes")
        .crossJoin((eb) =>
          eb
            .fn<{ value: string; type: string }>("json_each", [
              eb
                .case()
                .when(
                  eb.fn<number>("json_valid", [
                    eb.ref("ec_blueprint_changes.blocks"),
                  ]),
                  "=",
                  1,
                )
                .then(eb.ref("ec_blueprint_changes.blocks"))
                .else(eb.val("[]"))
                .end(),
            ])
            .as("block"),
        )
        .select((eb) => [
          "ec_blueprint_changes.id as entryId",
          "block.value as value",
          eb.val(0).as("depth"),
        ])
        .where("ec_blueprint_changes.deleted_at", "is", null)
        .where("ec_blueprint_changes.status", "=", "published")
        .where("block.type", "=", "object");

      const disclosureBlocks = cte
        .selectFrom("changeBlocks")
        .crossJoin((eb) => {
          const blocksJson = eb.fn("json_extract", [
            eb.ref("changeBlocks.value"),
            eb.val("$.blocks"),
          ]);
          const safeBlocks = eb
            .case()
            .when(eb.fn<number>("json_valid", [blocksJson]), "=", 1)
            .then(blocksJson)
            .else(eb.val("[]"))
            .end();
          return eb
            .fn<{ value: string; type: string }>("json_each", [safeBlocks])
            .as("child");
        })
        .select((eb) => [
          eb.ref("changeBlocks.entryId").$castTo<string>().as("entryId"),
          eb.ref("child.value").$castTo<string>().as("value"),
          eb(eb.ref("changeBlocks.depth").$castTo<number>(), "+", 1)
            .$castTo<number>()
            .as("depth"),
        ])
        .where(
          (eb) =>
            eb.fn<string>("json_extract", [
              eb.ref("changeBlocks.value"),
              eb.val("$._type"),
            ]),
          "=",
          "disclosure",
        )
        .where("changeBlocks.depth", "<", 8)
        .where("child.type", "=", "object");

      return rootBlocks.unionAll(disclosureBlocks);
    })
    .selectFrom("ec_blueprint_changes")
    .leftJoin("changeBlocks", "changeBlocks.entryId", "ec_blueprint_changes.id")
    .select((eb) => {
      const blockType = eb.fn("json_extract", [
        eb.ref("changeBlocks.value"),
        eb.val("$._type"),
      ]);
      const itemsJson = eb.fn("json_extract", [
        eb.ref("changeBlocks.value"),
        eb.val("$.items"),
      ]);
      const cardsCount = eb
        .case()
        .when(eb.fn<number>("json_valid", [itemsJson]), "=", 1)
        .then(
          eb
            .case()
            .when(eb.fn<string>("json_type", [itemsJson]), "=", "array")
            .then(eb.fn("json_array_length", [itemsJson]))
            .else(0)
            .end(),
        )
        .else(0)
        .end();
      return [
        "ec_blueprint_changes.id as id",
        "ec_blueprint_changes.slug as slug",
        "ec_blueprint_changes.title as title",
        "ec_blueprint_changes.linear_issue as linear_issue",
        "ec_blueprint_changes.description as description",
        "ec_blueprint_changes.pull_requests as pull_requests",
        "ec_blueprint_changes.published_at as published_at",
        eb.fn
          .sum(
            eb
              .case()
              .when(blockType, "=", "scenario")
              .then(1)
              .when(blockType, "=", "scenario_cards")
              .then(cardsCount)
              .else(0)
              .end(),
          )
          .as("scenarioCount"),
      ];
    })
    .where("ec_blueprint_changes.deleted_at", "is", null)
    .where("ec_blueprint_changes.status", "=", "published")
    .groupBy([
      "ec_blueprint_changes.id",
      "ec_blueprint_changes.slug",
      "ec_blueprint_changes.title",
      "ec_blueprint_changes.linear_issue",
      "ec_blueprint_changes.description",
      "ec_blueprint_changes.pull_requests",
      "ec_blueprint_changes.published_at",
    ])
    .orderBy("ec_blueprint_changes.published_at", "desc")
    .orderBy("ec_blueprint_changes.id", "desc")
    .execute();

  return entries.map((entry) => {
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
      scenarioCount: Number(entry.scenarioCount ?? 0),
    });
    if (!parsed.success)
      throw new Error(
        `Published Change "${entry.slug}" has invalid summary metadata.`,
      );
    return { id: entry.slug, data: parsed.data };
  });
}

function buildDesignSource(pages: DesignPage[]): StaticSource<SourceConfig> {
  const ordered = pages.map((page) => page.slug || "index");
  const files: StaticSource<SourceConfig>["files"] = [
    {
      type: "meta",
      path: "meta.json",
      data: { title: "Design System", pages: ordered },
    },
    ...pages.map((page) => ({
      type: "page" as const,
      path: `${page.slug ? `${page.slug}/` : ""}index.mdx`,
      data: {
        title: page.title,
        description: page.description,
        structuredData: { headings: [], contents: [] },
        _raw: page,
      },
    })),
  ];
  return { files };
}

export async function createBlueprintSources(
  options: {
    includeChanges?: boolean;
    isFeatureStructureEnabled?: boolean;
  } = {},
) {
  const [changes, features, featureMetas, designMetas] = await Promise.all([
    options.includeChanges === false
      ? Promise.resolve([])
      : readPublishedChanges(),
    getCollection("featurePages"),
    getCollection("featureMeta"),
    getCollection("designMeta"),
  ]);
  const designDocument = (await getCollection("designDocument"))[0];
  if (!designDocument) throw new Error("DESIGN.md is required by Blueprint");

  const featuresRoot = path.resolve("content/features");
  return {
    changes: loader({
      baseUrl: "/changes",
      source: buildChangeSource(changes),
    }),
    features: loader({
      baseUrl: "/features",
      source: buildContentSource(
        features,
        featureMetas,
        featuresRoot,
        options.isFeatureStructureEnabled !== false,
      ),
    }),
    designSystem: loader({
      baseUrl: "/design-system",
      source: buildDesignSource(
        designMetas.flatMap((entry) => entry.data.pages),
      ),
    }),
    changeEntries: changes,
    designPages: designMetas.flatMap((entry) => entry.data.pages),
    designDocument,
  };
}

export type BlueprintSources = Awaited<
  ReturnType<typeof createBlueprintSources>
>;
