"use client";
import { useRecord } from "@/hooks/use-data";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupsActions } from "@/app/store/lineups-slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LineupCourt from "@/components/team/lineup/court";
import RecordSetPanels from "@/components/record/set-options/panels";

const RecordSetOptions = ({ recordId }) => {
  const dispatch = useAppDispatch();
  const { record } = useRecord(recordId);
  const { setNum } = useAppSelector((state) => state.record.status);
  const { lineups } = useAppSelector((state) => state.lineups);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full"
          onClick={() =>
            dispatch(
              lineupsActions.initialize([record.sets[setNum].lineups.home])
            )
          }
        >
          開始下一局
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className="pb-2 font-medium text-center">
            第 {setNum + 1} 局設定
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
    </Dialog>
  );
};

export default RecordSetOptions;
