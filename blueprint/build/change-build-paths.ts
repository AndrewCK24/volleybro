import { snapshotUrl } from "virtual:blueprint-build-source";
import type { ChangeData } from "../src/lib/emdash-change-record";

export type ChangeBuildEntry = {
  id: string;
  slug: string;
  visibility: "public" | "preview";
  revisionId: string;
  data: ChangeData;
  contentHash: string;
  scenarioCount: number;
};

export async function getStaticPaths() {
  if (!snapshotUrl) return [];
  const response = await fetch(snapshotUrl, { redirect: "manual" });
  if (!response.ok)
    throw new Error("The private Change build snapshot is unavailable.");
  const snapshot = (await response.json()) as {
    version: number;
    rendererId: string;
    entries: ChangeBuildEntry[];
  };
  if (
    snapshot.version !== 1 ||
    snapshot.rendererId !== import.meta.env.BLUEPRINT_RENDERER_ID
  ) {
    throw new Error("Change build snapshot renderer identity does not match.");
  }
  return snapshot.entries.map((entry) => ({
    params: {
      view: entry.visibility,
      contentId: entry.id,
      revisionId: entry.revisionId,
    },
    props: { entry },
  }));
}
