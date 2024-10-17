import type { Match } from "@/entities/record";

export const finalPointHelper = (setIndex: number, info: Match) => {
  const isDecidingSet = setIndex === info.scoring.setCount - 1;
  return isDecidingSet ? info.scoring.decidingSetPoints : 25;
};
