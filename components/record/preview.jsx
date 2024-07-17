"use client";
import { useRecord } from "@/hooks/use-data";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Rally from "@/components/record/rally";

const RecordPreview = ({
  recordId,
  recordState,
  handleOptionOpen,
  className,
}) => {
  const { record } = useRecord(recordId);
  const { players } = record.teams.home;
  const {
    recording,
    status: { setNum, rallyNum },
  } = recordState;
  const lastRally = useSelector(
    (state) => state.record.sets[setNum].rallies[rallyNum - 1]
  );
  const rally =
    recording.home.player || recording.home.type || rallyNum === 0
      ? recording
      : lastRally;
  const editingItem = recording.away.type
    ? "oppo"
    : recording.home.type
    ? "ours"
    : "";

  return (
    <Card className={cn("grid w-full p-2", className)}>
      <Rally
        rally={rally}
        players={players}
        editingItem={editingItem}
        onClick={handleOptionOpen ? () => handleOptionOpen("rallies") : null}
      />
    </Card>
  );
};

export default RecordPreview;
