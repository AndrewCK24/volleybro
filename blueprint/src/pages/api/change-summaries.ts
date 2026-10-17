import type { APIRoute } from "astro";
import { listPublishedChangeSummaries } from "../../lib/github-change-data";
import { readPublishedChanges } from "../../lib/published-changes";

export const prerender = false;

export const GET: APIRoute = async () => {
  const entries = await readPublishedChanges();
  const summaries = await listPublishedChangeSummaries(entries);
  return new Response(JSON.stringify(summaries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
