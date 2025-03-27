import { getPreviousRally } from "@/lib/features/record/helpers";
import type { Record } from "@/entities/record";

export const getServingStatus = (
  record: Record,
  setIndex: number,
  entryIndex: number
): boolean => {
  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  return previousRally
    ? previousRally.win
    : record.sets[setIndex]
    ? record.sets[setIndex].options.serve === "home"
    : true;
};
