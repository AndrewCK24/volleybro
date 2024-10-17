"use client";
import { useRecord } from "@/hooks/use-data";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Rally from "@/components/record/rally";

import type { ReduxRecordState } from "@/lib/features/record/types";

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
    status: { inPlay, setIndex, rallyIndex },
  } = recordState;

  if (!inPlay) return null;

  const lastRally = record.sets[setIndex].rallies[rallyIndex - 1];
  const isEditing = recording.home.player._id || recording.home.type;
  const rally = isEditing || rallyIndex === 0 ? recording : lastRally;

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
