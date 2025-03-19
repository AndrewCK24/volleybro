import { getPreviousRally } from "@/lib/features/record/helpers";
import type { Record } from "@/entities/record";

export const getPreviousScores = (
  record: Record,
  setIndex: number,
  entryIndex: number
): { home: number; away: number } => {
  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  return previousRally
    ? { home: previousRally.home.score, away: previousRally.away.score }
    : { home: 0, away: 0 };
};
