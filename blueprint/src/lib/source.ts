import { getCollection, type CollectionEntry } from "astro:content";
import { getEmDashCollection, type ContentEntry } from "emdash";
import { structure, type StructuredData } from "fumadocs-core/mdx-plugins";
import {
  loader,
  type MetaData,
  type PageData,
  type StaticSource,
} from "fumadocs-core/source";
import path from "node:path";
import { changeDataSchema, type ChangeData } from "./emdash-change-record";

type FeaturePage = CollectionEntry<"featurePages">;
type MetaEntry = CollectionEntry<"featureMeta">;
type EmDashPage = ContentEntry<ChangeData>;
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
        structuredData: structure(entry.body ?? ""),
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
  const entries: EmDashPage[] = [];
  let cursor: string | undefined;
  do {
    const result = await getEmDashCollection("blueprint_changes", {
      limit: 100,
      status: "published",
      ...(cursor ? { cursor } : {}),
      orderBy: { published_at: "desc" },
    });
    if (result.error)
      throw new Error(
        `Could not read published Blueprint Changes: ${result.error.message}`,
      );
    for (const entry of result.entries) {
      const parsed = changeDataSchema.safeParse(entry.data);
      if (!parsed.success)
        throw new Error(`Published Change "${entry.id}" has invalid content.`);
      entries.push({ id: entry.id, data: parsed.data, edit: entry.edit });
    }
    cursor = result.nextCursor;
  } while (cursor);
  return entries;
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
  options: { includeChanges?: boolean } = {},
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
      source: buildContentSource(features, featureMetas, featuresRoot),
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
