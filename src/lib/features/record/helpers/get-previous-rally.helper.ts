import { type Record, type Rally, EntryType } from "@/entities/record";

export const getPreviousRally = (
  record: Record,
  setIndex: number,
  entryIndex: number
): Rally => {
  const set = record.sets[setIndex];

  if (entryIndex === 0) return null;

  for (let i = entryIndex - 1; i >= 0; i--) {
    if (set.entries[i].type === EntryType.RALLY) {
      return set.entries[i].data as Rally;
    }
  }

  return null;
};
