import { useSelector } from "react-redux";
import PlayerInfo from "@/components/team/lineup/panels/player-info";
import LineupOptions from "@/components/record/set-options/panels/options";
import Positions from "@/components/team/lineup/panels/positions";
import Substitutes from "@/components/record/set-options/panels/substitutes";

const LineupPanels = ({ members, hasPairedSwitchPosition, className }) => {
  const { status } = useSelector((state) => state.lineups);
  const { optionMode } = status;

  return (
    <>
      {optionMode === "playerInfo" ? (
        <PlayerInfo members={members} className={className} />
      ) : optionMode === "substitutes" ? (
        <Substitutes members={members} className={className} />
      ) : optionMode === "positions" ? (
        <Positions className={className} />
      ) : (
        <LineupOptions
          members={members}
          hasPairedSwitchPosition={hasPairedSwitchPosition}
        />
      )}
    </>
  );
};

export default LineupPanels;
