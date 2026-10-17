import { useEffect, useState } from "react";
import type { ChangeSummary } from "./github-change-data";

let inFlight: Promise<ChangeSummary[]> | undefined;

function readSummaries(): Promise<ChangeSummary[]> {
  if (inFlight) return inFlight;
  inFlight = fetch("/api/change-summaries", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Change summaries are unavailable.");
      const changes: unknown = await response.json();
      if (!Array.isArray(changes))
        throw new Error("Invalid Change summary response.");
      return changes as ChangeSummary[];
    })
    .finally(() => {
      inFlight = undefined;
    });
  return inFlight;
}

export function useChangeSummaries(enabled: boolean) {
  const [state, setState] = useState<{
    changes?: ChangeSummary[];
    failed: boolean;
  }>({ failed: false });
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    readSummaries().then(
      (changes) => {
        if (active) setState({ changes, failed: false });
      },
      () => {
        if (active) setState({ failed: true });
      },
    );
    return () => {
      active = false;
    };
  }, [enabled]);
  return state;
}
