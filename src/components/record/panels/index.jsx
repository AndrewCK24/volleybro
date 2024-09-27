import { useRecord } from "@/src/hooks/use-data";
import RecordMoves from "@/src/components/record/panels/moves";
import RecordInterval from "@/src/components/record/panels/interval";

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
