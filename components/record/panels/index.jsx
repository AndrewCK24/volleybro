import { useRecord } from "@/hooks/use-data";
import RecordMoves from "@/components/record/panels/moves";
import RecordInterval from "@/components/record/panels/interval";

const RecordPanels = ({ recordId, recordState, recordActions }) => {
  const { record } = useRecord(recordId);
  const { status } = recordState;

  return (
    <>
      {status.inPlay ? (
        <RecordMoves
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
