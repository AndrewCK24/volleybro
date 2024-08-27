import { useSelector } from "react-redux";
import PlayerInfo from "@/components/team/lineup/panels/player-info";
import LineupOptions from "@/components/record/set-options/panels/options";
import Positions from "@/components/team/lineup/panels/positions";
import Substitutes from "@/components/record/set-options/panels/substitutes";

const LineupPanels = ({
  recordId,
  members,
  hasPairedSwitchPosition,
  className,
}) => {
  const { optionMode } = useSelector((state) => state.lineups.status);

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
          recordId={recordId}
          members={members}
          hasPairedSwitchPosition={hasPairedSwitchPosition}
        />
      )}
    </>
  );
};

export default LineupPanels;
