import { useSelector } from "react-redux";
import PlayerInfo from "@/src/components/team/lineup/panels/player-info";
import LineupOptions from "@/src/components/team/lineup/panels/options";
import Substitutes from "@/src/components/team/lineup/panels/substitutes";
import Positions from "@/src/components/team/lineup/panels/positions";

const LineupPanels = ({ members, hasPairedSwitchPosition, className }) => {
  const { lineups, status } = useSelector((state) => state.lineups);
  const { optionMode } = status;
  const { starting, liberos, substitutes } = lineups[status.lineupNum];
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
      {optionMode === "playerInfo" ? (
        <PlayerInfo members={members} className={className} />
      ) : optionMode === "substitutes" ? (
        <Substitutes members={members} others={others} className={className} />
      ) : optionMode === "positions" ? (
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
