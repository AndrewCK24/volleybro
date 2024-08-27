"use client";
import { useRecord } from "@/hooks/use-data";
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
  const lastRally = record.sets[setNum].rallies[rallyNum - 1];
  const isEditing = recording.home.player._id || recording.home.type;
  const rally = isEditing || rallyNum === 0 ? recording : lastRally;

  return (
    <Card className={cn("grid w-full p-2", className)}>
      <Rally
        rally={rally}
        players={players}
        onClick={handleOptionOpen ? () => handleOptionOpen("rallies") : null}
        className={isEditing ? "animate-pulse duration-1000" : ""}
      />
    </Card>
  );
};

export default RecordPreview;
