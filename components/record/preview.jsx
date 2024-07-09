"use client";
import { useRecord } from "@/hooks/use-data";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import Rally from "@/components/record/rally";

const RecordPreview = ({ recordId }) => {
  const { record } = useRecord(recordId);
  const { players } = record.teams.home;
  const {
    recording,
    status: { setNum, rallyNum },
  } = useSelector((state) => state.record);
  const lastRally = useSelector(
    (state) => state.record.sets[setNum].records[rallyNum - 1]
  );
  const rally =
    recording.home.player._id || recording.home.type || rallyNum === 0
      ? recording
      : lastRally;
  const editingItem = recording.away.type
    ? "oppo"
    : recording.home.type
    ? "ours"
    : "";

  return (
    <Card className="grid w-full p-2">
      <Rally rally={rally} players={players} editingItem={editingItem} />
    </Card>
  );
};

export default RecordPreview;
