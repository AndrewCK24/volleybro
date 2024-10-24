"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  frontMoves,
  backMoves,
  errorMoves,
  type ScoringMove,
} from "@/lib/scoring-moves";
import { FiPlus, FiMinus, FiRepeat } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Container, MoveButton } from "@/components/record/panels/moves";

import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

const OursMoves = ({
  recordState,
  recordActions,
}: {
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
}) => {
  const dispatch = useAppDispatch();
  const { recording } = recordState;
  const { zone } = recording.home.player;
  const oursMoves =
    zone === 0 ? errorMoves : zone === 1 || zone >= 5 ? backMoves : frontMoves;

  const onOursClick = (move: ScoringMove) => {
    dispatch(recordActions.setRecordingHomeMove(move));
  };

  return (
    <Container className={zone === 0 && "grid-cols-1"}>
      {oursMoves.map((move) => (
        <MoveButton
          key={`${move.type}-${move.num}`}
          move={move}
          toggled={recording.home.num === move.num}
          onClick={() => onOursClick(move)}
        >
          {zone === 0 ? `對方${move.text}失誤` : move.text}
          {move.win ? <FiPlus /> : <FiMinus />}
        </MoveButton>
      ))}
      {!!zone && (
        <Button
          variant="secondary"
          size="lg"
          className="h-full text-[1.5rem] pr-1"
          onClick={() =>
            dispatch(recordActions.setRecordingMode("substitutes"))
          }
        >
          替補
          <FiRepeat />
        </Button>
      )}
    </Container>
  );
};

export default OursMoves;
