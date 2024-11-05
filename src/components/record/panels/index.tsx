import { useAppSelector } from "@/lib/redux/hooks";
import RecordMoves from "@/components/record/panels/moves";
import Substitutes from "@/components/record/panels/substitutes";
import RecordInterval from "@/components/record/panels/interval";

const RecordPanels = ({
  recordId,
  className,
}: {
  recordId: string;
  className?: string;
}) => {
  const recordState = useAppSelector((state) => state.record);
  const { status } = recordState[recordState.mode];

  return (
    <>
      {status.inProgress ? (
        status.panel === "substitutes" ? (
          <Substitutes recordId={recordId} className={className} />
        ) : (
          <RecordMoves recordId={recordId} className={className} />
        )
      ) : (
        <RecordInterval recordId={recordId} />
      )}
    </>
  );
};

export default RecordPanels;
