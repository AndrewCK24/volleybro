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
  className,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
  className?: string;
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
            className={className}
          />
        ) : (
          <RecordMoves
            recordId={recordId}
            recordState={recordState}
            recordActions={recordActions}
            className={className}
          />
        )
      ) : (
        <RecordInterval recordId={recordId} />
      )}
    </>
  );
};

export default RecordPanels;
