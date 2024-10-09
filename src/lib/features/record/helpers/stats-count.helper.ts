import type { Record, Rally, MoveType } from "@/src/entities/record";
import type { ReduxRecording } from "@/src/lib/features/record/types";

export const statsCountHelper = (
  params: { recordId: string; setNum: number },
  recording: ReduxRecording | Rally,
  record: Record
) => {
  const { recordId, setNum } = params;
  const { win, home, away } = recording;

  const homePlayer = record.teams.home.players.find(
    (player) => player._id === home.player._id
  );
  // TODO: 新增 stats 物件
  if (!homePlayer.stats[setNum]) {
  }
  if (win) {
    homePlayer.stats[setNum][home.type].success += 1;
  } else {
    homePlayer.stats[setNum][home.type].error += 1;
  }
};
