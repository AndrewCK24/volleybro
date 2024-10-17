import type { Record, Rally } from "@/entities/record";
import type { ReduxRecording } from "@/lib/features/record/types";

export const createRallyOptimistic = (
  params: { recordId: string; setIndex: number; rallyIndex: number },
  recording: ReduxRecording | Rally,
  record: Record
) => {
  const { setIndex, rallyIndex } = params;
  const { win, home, away } = recording;
  const isServing = rallyIndex
    ? record.sets[setIndex].rallies[rallyIndex - 1]?.win
    : record.sets[setIndex].options.serve === "home";
  if (win && !isServing) record.teams.home.stats[setIndex].rotation += 1;

  const homePlayerIndex = record.teams.home.players.findIndex(
    (player) => player._id === home.player._id
  );

  // TODO: 新增上場選手對應局數的 stats 物件（在開新局、換人時）
  const homePlayer = record.teams.home.players[homePlayerIndex];
  const awayTeam = record.teams.away;

  if (win) {
    homePlayer.stats[setIndex][home.type].success += 1;
    awayTeam.stats[setIndex][away.type].error += 1;
  } else {
    homePlayer.stats[setIndex][home.type].error += 1;
    awayTeam.stats[setIndex][away.type].success += 1;
  }

  record.teams.home.players[homePlayerIndex] = homePlayer;
  record.teams.away = awayTeam;
  record.sets[setIndex].rallies[rallyIndex] = recording;

  return record;
};
