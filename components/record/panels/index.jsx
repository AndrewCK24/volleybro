import { useRecord } from "@/hooks/use-data";
import RecordActions from "@/components/record/panels/actions";
import RecordInterval from "@/components/record/panels/interval";

const RecordPanels = ({ recordId, recordState, recordActions }) => {
  const { record } = useRecord(recordId);
  const { status } = recordState;

  return (
    <>
      {status.inPlay ? (
        <RecordActions
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
