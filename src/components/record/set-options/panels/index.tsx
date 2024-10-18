import { useAppSelector } from "@/lib/redux/hooks";
import PlayerInfo from "@/components/team/lineup/panels/player-info";
import Options from "@/components/record/set-options/panels/options";
import Positions from "@/components/team/lineup/panels/positions";
import Substitutes from "@/components/record/set-options/panels/substitutes";

import { LineupOptionMode } from "@/lib/features/team/types";
import type { Player } from "@/entities/record";

const LineupPanels = ({
  recordId,
  members,
  hasPairedSwitchPosition,
  className,
}: {
  recordId: string;
  members: Player[];
  hasPairedSwitchPosition: boolean;
  className?: string;
}) => {
  const { optionMode } = useAppSelector((state) => state.lineup.status);

  return (
    <>
      {optionMode === LineupOptionMode.PLAYERINFO ? (
        <PlayerInfo members={members} className={className} />
      ) : optionMode === LineupOptionMode.SUBSTITUTES ? (
        <Substitutes members={members} className={className} />
      ) : optionMode === LineupOptionMode.POSITIONS ? (
        <Positions className={className} />
      ) : (
        <Options
          recordId={recordId}
          members={members}
          hasPairedSwitchPosition={hasPairedSwitchPosition}
        />
      )}
    </>
  );
};

export default LineupPanels;
