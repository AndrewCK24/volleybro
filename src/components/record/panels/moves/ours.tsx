"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import {
  frontMoves,
  backMoves,
  errorMoves,
  type ScoringMove,
} from "@/lib/scoring-moves";
import { FiPlus, FiMinus } from "react-icons/fi";
import { RiRepeat2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Container, MoveButton } from "@/components/record/panels/moves";

const OursMoves = () => {
  const dispatch = useAppDispatch();
  const recordState = useAppSelector((state) => state.record);
  const { recording } = recordState[recordState.mode];
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
          onClick={() => dispatch(recordActions.setPanel("substitutes"))}
        >
          替補
          <RiRepeat2Line />
        </Button>
      )}
    </Container>
  );
};

export default OursMoves;
