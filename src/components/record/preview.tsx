"use client";
import { useRecord } from "@/hooks/use-data";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Entry from "@/components/record/entry";

import { EntryType } from "@/entities/record";

const RecordPreview = ({
  recordId,
  handleOptionOpen,
  className,
}: {
  recordId: string;
  handleOptionOpen?: (value: string) => void;
  className?: string;
}) => {
  const { record } = useRecord(recordId);
  const { players } = record.teams.home;
  const recordState = useAppSelector((state) => state.record);
  const {
    recording,
    status: { inProgress, setIndex, entryIndex },
  } = recordState[recordState.mode];

  if (!inProgress) return null;

  const lastRally = record.sets[setIndex].entries[entryIndex - 1];
  const isEditing = recording.home.player._id || recording.home.type;
  const recordingEntry = recording.substitution
    ? { type: EntryType.SUBSTITUTION, data: recording.substitution }
    : recording.timeout
    ? { type: EntryType.TIMEOUT, data: recording.timeout }
    : recording.challenge
    ? { type: EntryType.CHALLENGE, data: recording.challenge }
    : { type: EntryType.RALLY, data: recording };
  const entry = isEditing || entryIndex === 0 ? recordingEntry : lastRally;

  return (
    <Card className={cn("grid w-full p-2", className)}>
      <Entry
        entry={entry}
        players={players}
        onClick={handleOptionOpen ? () => handleOptionOpen("summary") : null}
        className={isEditing ? "animate-pulse duration-1000" : ""}
      />
    </Card>
  );
};

export default RecordPreview;
