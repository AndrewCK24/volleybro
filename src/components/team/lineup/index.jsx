"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/src/app/store/lineups-slice";
import { FiSave } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import LineupCourt from "@/src/components/team/lineup/court";
import LineupPanels from "@/src/components/team/lineup/panels";
import LoadingCourt from "@/src/components/custom/loading/court";
import LoadingCard from "@/src/components/custom/loading/card";

const Lineup = ({ team, members, handleSave }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const liberoSwitchMode = lineups[status.lineupNum]?.options.liberoSwitchMode;
  const liberoSwitchPosition =
    lineups[status.lineupNum]?.options.liberoSwitchPosition;
  const hasPairedSwitchPosition =
    liberoSwitchMode === 0 ||
    (liberoSwitchPosition === "OP"
      ? lineups[status.lineupNum]?.starting.some(
          (player) => player._id && player.position === "OP"
        )
      : lineups[status.lineupNum]?.starting.some((player, index) => {
          const oppositeIndex = index >= 3 ? index - 3 : index + 3;
          return (
            player._id &&
            player.position === liberoSwitchPosition &&
            lineups[status.lineupNum].starting[oppositeIndex]._id &&
            lineups[status.lineupNum].starting[oppositeIndex].position ===
              liberoSwitchPosition
          );
        }));

  useEffect(() => {
    if (team && team.lineups) dispatch(lineupsActions.initialize(team.lineups));
  }, [team, dispatch]);

  if (!team || !members || !lineups.length) {
    return (
      <>
        <LoadingCourt />
        <LoadingCard className="flex-1 w-full" />
        <div className="flex flex-col w-full px-4">
          <Button size="lg" className="motion-safe:animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <LineupCourt members={members} />
      <LineupPanels
        members={members}
        hasPairedSwitchPosition={hasPairedSwitchPosition}
        className="flex-1 w-full overflow-scroll"
      />
      {!status.optionMode && (
        <div className="flex flex-col w-full px-4">
          <Button
            size="lg"
            onClick={() => handleSave(lineups)}
            disabled={!status.edited || !hasPairedSwitchPosition}
          >
            <FiSave />
            儲存陣容
          </Button>
        </div>
      )}
    </>
  );
};

export default Lineup;
