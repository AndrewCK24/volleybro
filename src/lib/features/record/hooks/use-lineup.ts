import { useRecord } from "@/hooks/use-data";
import type { ReduxRecordState } from "@/lib/features/record/types";

export const useLineup = (recordId: string, recordState: ReduxRecordState) => {
  const { setIndex, isServing, inProgress } =
    recordState[recordState.mode].status;
  const { record } = useRecord(recordId);

  if (!inProgress) return { starting: [], liberos: [] };

  const { players, stats } = record.teams.home;
  const { starting, liberos, options } = structuredClone(
    record.sets[setIndex].lineups.home
  );

  const lineup = {
    liberos: liberos.map((libero) => {
      const player = players.find((p) => p._id === libero._id);
      const substitute = players.find((p) => p._id === libero?.sub?._id);
      return {
        ...player,
        position: libero.position,
        sub: { _id: substitute?._id, number: substitute?.number },
      };
    }),
    starting: starting.map((starter) => {
      const player = players.find((p) => p._id === starter._id);
      const substitute = players.find((p) => p._id === starter?.sub?._id);
      return {
        ...player,
        position: starter.position,
        sub: { _id: substitute?._id, number: substitute?.number },
      };
    }),
  };

  const rotation = stats[setIndex].rotation % 6;
  if (rotation) {
    const rotatedPlayers = lineup.starting.splice(0, rotation);
    lineup.starting.push(...rotatedPlayers);
  }
  const switchTargetIndex = lineup.starting.findIndex(
    (player, index) =>
      player.position === options.liberoSwitchPosition &&
      ((index === 0 && !isServing) || index >= 4)
  );
  if (switchTargetIndex !== -1) {
    const switchTarget = {
      ...lineup.starting[switchTargetIndex],
    };
    lineup.starting[switchTargetIndex] = lineup.liberos[0];
    lineup.liberos[0] = switchTarget;
  }

  return lineup;
};
