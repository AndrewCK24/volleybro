"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRecord } from "@/hooks/use-data";
import { scoringMoves } from "@/lib/scoring-moves";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Container, MoveButton } from "@/components/record/panels/moves";
import { addRally } from "@/lib/features/record/actions/add-rally";
import { addRallyOptimistic } from "@/lib/features/record/helpers/add-rally.helper";

import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

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
        console.log("before addRally", record.teams.home.stats[setNum]);
        mutate(addRally({ recordId, setNum, rallyNum }, recording, record), {
          revalidate: false,
          optimisticData: addRallyOptimistic(
            { recordId, setNum, rallyNum },
            recording,
            record
          ),
        });
        console.log("after addRally", record.teams.home.stats[setNum]);
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
