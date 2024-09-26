"use client";
import { useDispatch } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { scoringMoves } from "@/lib/scoring-moves";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Container, MoveButton } from "@/components/record/panels/moves";

const OppoMoves = ({ recordId, recordState, recordActions }) => {
  const dispatch = useDispatch();
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
      const updateRallies = async () => {
        try {
          const res = await fetch(
            `/api/records/${recordId}/sets/${setNum}/rallies`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(recording),
            }
          );
          if (!res.ok) throw new Error("Network response was not ok");
          const rallies = await res.json();
          record.sets[setNum].rallies = rallies;
          return record;
        } catch (error) {
          console.error("[POST /api/records]", error);
        }
      };
      mutate(updateRallies(), {
        revalidate: false,
        optimisticData: (record) => {
          record.sets[setNum].rallies.push(recording);
          return record;
        },
      });
      dispatch(recordActions.resetRecording());
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
