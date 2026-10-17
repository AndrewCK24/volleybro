import { useChangeSummaries } from "@/lib/change-summary-client";
import { createChangesBreadcrumbTree } from "@/lib/changes-tree";
import { navigate } from "astro:transitions/client";
import type { AstroProviderProps } from "fumadocs-core/framework/astro";
import type { Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsPage,
  type DocsPageProps,
} from "fumadocs-ui/layouts/docs/page";
import { RootProvider } from "fumadocs-ui/provider/astro";
import type { ReactNode } from "react";

export function Docs({
  children,
  tree,
  pathname,
  params,
  page,
  hasChanges,
  liveChanges = false,
}: {
  children: ReactNode;
  tree: Root;
  pathname: string;
  params: AstroProviderProps["params"];
  page?: DocsPageProps;
  hasChanges: boolean;
  liveChanges?: boolean;
}) {
  const remote = useChangeSummaries(liveChanges);
  const visibleTree = remote.changes
    ? createChangesBreadcrumbTree({
        name: "Changes",
        children: remote.changes.map((change) => ({
          type: "page" as const,
          name: change.title,
          url: change.href,
        })),
      })
    : tree;
  return (
    <RootProvider
      pathname={pathname}
      params={params}
      navigate={navigate}
      search={{ options: { type: "static" } }}
    >
      <DocsLayout
        tree={visibleTree}
        nav={{ title: "Blueprint" }}
        sidebar={{
          tabs: [
            { title: "Changes", url: "/changes", unlisted: !hasChanges },
            { title: "Features", url: "/features" },
            { title: "Design System", url: "/design-system" },
          ],
        }}
      >
        <DocsPage {...page}>
          <DocsBody>{children}</DocsBody>
        </DocsPage>
      </DocsLayout>
    </RootProvider>
  );
}
