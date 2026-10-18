import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { listPublishedChangeSummaries } from "../../lib/github-change-data";
import { featureTitlesFromEntries } from "../../lib/feature-capabilities";
import { readPublishedChanges } from "../../lib/published-changes";

export const prerender = false;

export const GET: APIRoute = async () => {
  const entries = await readPublishedChanges();
  const features = await getCollection("featurePages");
  const summaries = await listPublishedChangeSummaries(
    entries,
    featureTitlesFromEntries(features),
  );
  return new Response(JSON.stringify(summaries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
