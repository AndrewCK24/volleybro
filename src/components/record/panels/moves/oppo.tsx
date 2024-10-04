"use client";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { useRecord } from "@/src/hooks/use-data";
import { scoringMoves } from "@/src/lib/scoring-moves";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Container, MoveButton } from "@/src/components/record/panels/moves";
import { addRally } from "@/src/lib/features/record/actions/add-rally";

import type { ReduxRecordState } from "@/src/lib/features/record/types";
import type { RecordActions } from "@/src/lib/features/record/record-slice";
import type { EditingActions } from "@/src/lib/features/record/editing-slice";

const OppoMoves = ({
  recordId,
  recordState,
  recordActions,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
}) => {
  const dispatch = useAppDispatch();
  const { record, mutate } = useRecord(recordId);
  const {
    status: { setNum, rallyNum },
    recording,
  } = recordState;

  const oppoMoves = scoringMoves.filter((option) =>
    scoringMoves[recording.home.num]?.outcome.includes(option.num)
  );

  const onOppoClick = async (move) => {
    if (recording.away.num !== move.num) {
      dispatch(recordActions.setRecordingAwayMove(move));
    } else {
      try {
        mutate(addRally({ recordId, setNum }, recording, record), {
          revalidate: false,
          optimisticData: (record) => {
            record.sets[setNum].rallies.push(recording);
            return record;
          },
        });
        dispatch(recordActions.resetRecording(record));
      } catch (error) {
        console.error("[POST /api/records]", error);
      }
    }
  };

  return (
    <Container className="grid-cols-1">
      {oppoMoves.map((move) => (
        <MoveButton
          key={`${move.type}-${move.num + 15}`}
          move={move}
          toggled={recording.away.num === move.num}
          onClick={() => onOppoClick(move)}
        >
          {move.type === 7 ? `我方${move.text}失誤` : `對方${move.text}`}
          {move.win ? <FiPlus /> : <FiMinus />}
          {recording.away.num === move.num && <FiSend />}
        </MoveButton>
      ))}
    </Container>
  );
};

export default OppoMoves;
