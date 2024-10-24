import RecordMoves from "@/components/record/panels/moves";
import Substitutes from "@/components/record/panels/substitutes";
import RecordInterval from "@/components/record/panels/interval";
import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

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
        status.recordingMode === "substitutes" ? (
          <Substitutes
            recordId={recordId}
            recordState={recordState}
            recordActions={recordActions}
          />
        ) : (
          <RecordMoves
            recordId={recordId}
            recordState={recordState}
            recordActions={recordActions}
          />
        )
      ) : (
        <RecordInterval recordId={recordId} />
      )}
    </>
  );
};

export default RecordPanels;
