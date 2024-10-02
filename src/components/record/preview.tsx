"use client";
import { useRecord } from "@/src/hooks/use-data";
import { cn } from "@/src/lib/utils";
import { Card } from "@/src/components/ui/card";
import Rally from "@/src/components/record/rally";

import type { ReduxRecordState } from "@/src/lib/features/record/types";

const RecordPreview = ({
  recordId,
  recordState,
  handleOptionOpen,
  className,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  handleOptionOpen?: (value: string) => void;
  className?: string;
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
