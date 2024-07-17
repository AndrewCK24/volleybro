import { useRecord } from "@/hooks/use-data";
import RecordRally from "@/components/record/panels/rally";
import RecordInterval from "@/components/record/panels/interval";

const RecordPanels = ({ recordId, recordState, recordActions }) => {
  const { record } = useRecord(recordId);
  const { status } = recordState;

  return (
    <>
      {status.inPlay ? (
        <RecordRally
          recordId={recordId}
          recordState={recordState}
          recordActions={recordActions}
        />
      ) : (
        <RecordInterval recordId={recordId} />
      )}
    </>
  );
};

export default RecordPanels;
