import { useAppSelector } from "@/lib/redux/hooks";
import PlayerInfo from "@/components/team/lineup/panels/player-info";
import LineupOptions from "@/components/team/lineup/panels/options";
import Substitutes from "@/components/team/lineup/panels/substitutes";
import Positions from "@/components/team/lineup/panels/positions";
import { LineupOptionMode } from "@/lib/features/team/types";

const LineupPanels = ({ members, hasPairedSwitchPosition, className }) => {
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const { optionMode } = status;
  const { starting, liberos, substitutes } = lineups[status.lineupIndex];
  const listedIds = new Set([
    ...starting.map((player) => player._id),
    ...liberos.map((player) => player._id),
    ...substitutes.map((player) => player._id),
  ]);
  const others = members
    .filter((member) => !listedIds.has(member._id))
    .sort((a, b) => a.number - b.number);

  return (
    <>
      {optionMode === LineupOptionMode.PLAYERINFO ? (
        <PlayerInfo members={members} className={className} />
      ) : optionMode === LineupOptionMode.SUBSTITUTES ? (
        <Substitutes members={members} others={others} className={className} />
      ) : optionMode === LineupOptionMode.POSITIONS ? (
        <Positions className={className} />
      ) : (
        <LineupOptions
          members={members}
          others={others}
          hasPairedSwitchPosition={hasPairedSwitchPosition}
          className={className}
        />
      )}
    </>
  );
};

export default LineupPanels;
