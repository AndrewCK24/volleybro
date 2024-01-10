import { useSelector } from "react-redux";
import Record from "./Record";

const Preview = ({ onClick }) => {
  const recordingData = useSelector((state) => state.match.recording);
  const { isEditing, setNum, recordNum } = useSelector(
    (state) => state.match.status.editingData
  );
  const lastRecord = useSelector(
    (state) => state.match.sets[setNum].records[recordNum - 1]
  );
  const record =
    recordingData.ours.player._id ||
    recordingData.ours.type ||
    (recordNum === 0 && !isEditing)
      ? recordingData
      : lastRecord;
  const editingItem = recordingData.oppo.type
    ? "oppo"
    : recordingData.ours.type
    ? "ours"
    : "";

  return <Record record={record} editingItem={editingItem} onClick={onClick} />;
};

export default Preview;
