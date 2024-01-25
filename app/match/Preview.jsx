import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Record from "./Record";

const Preview = () => {
  const router = useRouter();
  const { _id: matchId, recording, players } = useSelector((state) => state.match);
  const { isEditing, setNum, recordNum } = useSelector(
    (state) => state.match.status.editingData
  );
  const lastRecord = useSelector(
    (state) => state.match.sets[setNum].records[recordNum - 1]
  );
  const record =
    recording.ours.player._id ||
    recording.ours.type ||
    (recordNum === 0 && !isEditing)
      ? recording
      : lastRecord;
  const editingItem = recording.oppo.type
    ? "oppo"
    : recording.ours.type
    ? "ours"
    : "";

  return (
    <Record
      record={record}
      players={players}
      editingItem={editingItem}
      onClick={() => router.push(`/match/${matchId}/records`)}
    />
  );
};

export default Preview;
