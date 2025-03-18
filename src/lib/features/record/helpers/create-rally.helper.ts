import { getServingStatus } from "@/lib/features/record/helpers";
import { type Record, type Rally, EntryType } from "@/entities/record";

export const createRallyOptimistic = (
  params: { recordId: string; setIndex: number; entryIndex: number },
  recording: Rally,
  record: Record
) => {
  const { setIndex, entryIndex } = params;
  const { win, home, away } = recording;
  const isServing = getServingStatus(record, setIndex, entryIndex);
  if (win && !isServing) record.teams.home.stats[setIndex].rotation += 1;

  const homePlayerIndex = record.teams.home.players.findIndex(
    (player) => player._id === home.player._id
  );
  const homePlayer = record.teams.home.players[homePlayerIndex];
  const homeTeam = record.teams.home;
  const awayTeam = record.teams.away;

  if (win) {
    if (homePlayerIndex !== -1) {
      homePlayer.stats[setIndex][home.type].success += 1;
      record.teams.home.players[homePlayerIndex] = homePlayer;
    }
    homeTeam.stats[setIndex][home.type].success += 1;
    awayTeam.stats[setIndex][away.type].error += 1;
  } else {
    if (homePlayerIndex !== -1) {
      homePlayer.stats[setIndex][home.type].error += 1;
      record.teams.home.players[homePlayerIndex] = homePlayer;
    }
    homeTeam.stats[setIndex][home.type].error += 1;
    awayTeam.stats[setIndex][away.type].success += 1;
  }

  record.teams.home = homeTeam;
  record.teams.away = awayTeam;
  record.sets[setIndex].entries[entryIndex] = {
    type: EntryType.RALLY,
    data: recording,
  };

  return record;
};
