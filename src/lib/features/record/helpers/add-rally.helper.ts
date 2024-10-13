import type { Record, Rally } from "@/entities/record";
import type { ReduxRecording } from "@/lib/features/record/types";

export const addRallyOptimistic = (
  params: { recordId: string; setNum: number; rallyNum: number },
  recording: ReduxRecording | Rally,
  record: Record
) => {
  const { setNum, rallyNum } = params;
  const { win, home, away } = recording;
  const isServing = rallyNum
    ? record.sets[setNum].rallies[rallyNum - 1]?.win
    : record.sets[setNum].options.serve === "home";
  if (win && !isServing) record.teams.home.stats[setNum].rotation += 1;

  const homePlayerIndex = record.teams.home.players.findIndex(
    (player) => player._id === home.player._id
  );

  // TODO: 新增上場選手對應局數的 stats 物件（在開新局、換人時）
  const homePlayer = record.teams.home.players[homePlayerIndex];
  const awayTeam = record.teams.away;

  if (win) {
    homePlayer.stats[setNum][home.type].success += 1;
    awayTeam.stats[setNum][away.type].error += 1;
  } else {
    homePlayer.stats[setNum][home.type].error += 1;
    awayTeam.stats[setNum][away.type].success += 1;
  }

  record.teams.home.players[homePlayerIndex] = homePlayer;
  record.teams.away = awayTeam;
  record.sets[setNum].rallies[rallyNum] = recording;

  return record;
};
