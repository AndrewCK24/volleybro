"use client";
import { useRecord } from "@/hooks/use-data";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { scoringMoves } from "@/lib/scoring-moves";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Container, MoveButton } from "@/components/record/panels/moves";
import { createRally } from "@/lib/features/record/actions/create-rally";
import { createRallyOptimistic } from "@/lib/features/record/helpers";

const OppoMoves = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const recordState = useAppSelector((state) => state.record);
  const {
    status: { setIndex, entryIndex },
    recording,
  } = recordState[recordState.mode];
  const { record, mutate } = useRecord(recordId);

  const oppoMoves = scoringMoves.filter((option) =>
    scoringMoves[recording.home.num]?.outcome.includes(option.num)
  );

  const onOppoClick = async (move) => {
    if (recording.away.num !== move.num) {
      dispatch(recordActions.setRecordingAwayMove(move));
    } else {
      try {
        mutate(
          createRally({ recordId, setIndex, entryIndex }, recording, record),
          {
            revalidate: false,
            optimisticData: createRallyOptimistic(
              { recordId, setIndex, entryIndex },
              recording,
              record
            ),
          }
        );
        dispatch(recordActions.confirmRecordingRally(record));
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
