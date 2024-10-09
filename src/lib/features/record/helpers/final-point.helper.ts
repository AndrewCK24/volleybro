import type { Match } from "@/entities/record";

export const finalPointHelper = (setNum: number, info: Match) => {
  const isDecidingSet = setNum === info.scoring.setCount - 1;
  return isDecidingSet ? info.scoring.decidingSetPoints : 25;
};
