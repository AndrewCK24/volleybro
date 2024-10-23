import { type Record, Side, type Substitution } from "@/entities/record";

export const createSubstitutionOptimistic = (
  params: { recordId: string; setIndex: number; rallyIndex: number },
  substitution: Substitution,
  record: Record
) => {
  const { setIndex } = params;
  const {
    team,
    players: { in: inPlayer, out: outPlayer },
  } = substitution;

  const side = team === Side.HOME ? "home" : "away";
  const lineup = record.sets[setIndex].lineups[side];

  const startingIndex = lineup.starting.findIndex((p) => p._id === outPlayer);
  const startingPlayer = lineup.starting[startingIndex];
  const subIndex = lineup.substitutes.findIndex((p) => p._id === inPlayer);
  const subPlayer = lineup.substitutes[subIndex];

  startingPlayer._id = inPlayer;
  subPlayer._id = outPlayer;
  subPlayer.sub = { _id: inPlayer };

  if (startingPlayer.sub) {
    startingPlayer.sub = { _id: "" };
  } else {
    startingPlayer.sub = { _id: outPlayer };
  }

  lineup.starting[startingIndex] = startingPlayer;
  lineup.substitutes[subIndex] = subPlayer;
  record.sets[setIndex].lineups[side] = lineup;
  record.sets[setIndex].substitutions.push(substitution);
  record.teams[side].stats[setIndex].substitution += 1;

  return record;
};
