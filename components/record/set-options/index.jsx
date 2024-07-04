"use client";
import useSWRMutation from "swr/mutation";
import { useRecord } from "@/hooks/use-data";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  const { record, mutate } = useRecord(recordId);
  const { status } = useSelector((state) => state.record);
  const { setNum } = status;
  const { lineups } = useSelector((state) => state.lineups);
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

  const postRequest = async (url, { arg }) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });
    const data = await res.json();
    return data;
  };
  const { trigger, mutate: mutateRecord } = useSWRMutation(
    `/api/records/${recordId}`,
    postRequest
  );

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
          members={record.teams.home.players}
          hasPairedSwitchPosition={hasPairedSwitchPosition}
          className="flex-1 px-0 overflow-scroll shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordSetOptions;
