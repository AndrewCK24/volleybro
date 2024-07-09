import { useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import RecordRally from "@/components/record/panels/rally";
import RecordInterval from "@/components/record/panels/interval";

const RecordPanels = ({ recordId }) => {
  const { record } = useRecord(recordId);
  const { status } = useSelector((state) => state.record);

  return (
    <>
      {status.inPlay ? (
        <RecordRally recordId={recordId} />
      ) : (
        <RecordInterval recordId={recordId} />
      )}
    </>
  );
};

export default RecordPanels;
