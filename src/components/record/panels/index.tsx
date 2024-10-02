import RecordMoves from "@/src/components/record/panels/moves";
import RecordInterval from "@/src/components/record/panels/interval";
import type { ReduxRecordState } from "@/src/lib/features/record/types";
import type { RecordActions } from "@/src/lib/features/record/record-slice";
import type { EditingActions } from "@/src/lib/features/record/editing-slice";

const RecordPanels = ({
  recordId,
  recordState,
  recordActions,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
}) => {
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
