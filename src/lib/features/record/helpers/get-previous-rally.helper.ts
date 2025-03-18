import { type Record, type Rally, EntryType } from "@/entities/record";

export const getPreviousRally = (
  record: Record,
  setIndex: number,
  entryIndex: number
): Rally | null => {
  if (entryIndex <= 0) return null;
  
  const entries = record.sets[setIndex].entries;
  
  for (let i = entryIndex - 1; i >= 0; i--) {
    if (entries[i].type === EntryType.RALLY) {
      return entries[i].data as Rally;
    }
  }
  
  return null;
};
