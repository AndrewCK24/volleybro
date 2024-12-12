import { useAppSelector } from "@/lib/redux/hooks";
import RecordMoves from "@/components/record/panels/moves";
import Substitutes from "@/components/record/panels/substitutes";
import RecordInterval from "@/components/record/panels/interval";
import type { ReduxRecordState } from "@/lib/features/record/types";

const RecordPanels = ({
  recordId,
  mode,
  className,
}: {
  recordId: string;
  mode: ReduxRecordState["mode"];
  className?: string;
}) => {
  const { status } = useAppSelector((state) => state.record[mode]);

  return (
    <>
      {status.inProgress ? (
        status.panel === "substitutes" ? (
          <Substitutes recordId={recordId} mode={mode} className={className} />
        ) : (
          <RecordMoves recordId={recordId} className={className} />
        )
      ) : (
        <RecordInterval recordId={recordId} className={className} />
      )}
    </>
  );
};

export default RecordPanels;
