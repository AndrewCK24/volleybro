export type FeatureCapabilityLink = {
  href: string;
  fullLabel: string;
  shortLabel: string;
};

export function featureCapabilityLinks(
  capabilities: string[],
  featureTitles: Map<string, string>,
): FeatureCapabilityLink[] {
  const paths = [...featureTitles.keys()];
  return capabilities.flatMap((capability) => {
    const segments = capability.split("/");
    const labels = segments.map((_, index) =>
      featureTitles.get(segments.slice(0, index + 1).join("/")),
    );
    if (labels.some((label) => !label)) {
      throw new Error(
        `Change capability points to a missing Feature page: ${capability}`,
      );
    }
    const fullLabel = (labels as string[]).join(" › ");
    let shortLabel = fullLabel;
    for (
      let offset = Math.max(0, segments.length - 2);
      offset >= 0;
      offset -= 1
    ) {
      const suffix = segments.slice(offset).join("/");
      const matches = paths.filter(
        (path) => path === suffix || path.endsWith(`/${suffix}`),
      );
      if (matches.length === 1) {
        shortLabel = (labels as string[]).slice(offset).join(" › ");
        break;
      }
    }
    return [{ href: `/features/${capability}`, fullLabel, shortLabel }];
  });
}

export function featureTitlesFromEntries(
  entries: Array<{ id: string; data: { title: string } }>,
): Map<string, string> {
  return new Map(
    entries.flatMap((entry) => {
      const path = entry.id
        .replace(/\/index(?:\.mdx?)?$/u, "")
        .replace(/\.mdx?$/u, "");
      return path ? [[path, entry.data.title] as const] : [];
    }),
  );
}
