"use client";
import { useEffect } from "react";
import { useRecord } from "@/hooks/use-data";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LineupCourt from "@/components/team/lineup/court";
import RecordSetPanels from "@/components/record/set-options/panels";

const RecordSetOptions = ({ recordId }) => {
  const dispatch = useAppDispatch();
  const { record } = useRecord(recordId);
  const { setIndex } = useAppSelector((state) => state.record.general.status);
  const { lineups } = useAppSelector((state) => state.lineup);
  const liberoSwitchMode = lineups[0]?.options.liberoSwitchMode;
  const liberoSwitchPosition = lineups[0]?.options.liberoSwitchPosition;
  const hasPairedSwitchPosition =
    liberoSwitchMode === 0 ||
    (liberoSwitchPosition === "OP"
      ? lineups[0]?.starting.some(
          (player) => player._id && player.position === "OP"
        )
      : lineups[0]?.starting.some((player, index) => {
          const oppositeIndex = index >= 3 ? index - 3 : index + 3;
          return (
            player._id &&
            player.position === liberoSwitchPosition &&
            lineups[0].starting[oppositeIndex]._id &&
            lineups[0].starting[oppositeIndex].position === liberoSwitchPosition
          );
        }));

  useEffect(() => {
    const lineup =
      record?.sets[setIndex]?.lineups?.home || record.teams.home.lineup;
    dispatch(lineupActions.initialize([lineup]));
    console.log("initialize", lineup);
  }, [record, setIndex, dispatch]);

  return (
    <DialogContent size="lg">
      <DialogDescription className="sr-only">
        設定第 {setIndex + 1} 局的陣容
      </DialogDescription>
      <DialogHeader>
        <DialogTitle className="pb-2 font-medium text-center">
          第 {setIndex + 1} 局設定
        </DialogTitle>
      </DialogHeader>
      <LineupCourt members={record.teams.home.players} />
      <RecordSetPanels
        recordId={recordId}
        members={record.teams.home.players}
        hasPairedSwitchPosition={hasPairedSwitchPosition}
        className="flex-1 px-0 overflow-scroll shadow-none"
      />
    </DialogContent>
  );
};

export default RecordSetOptions;
