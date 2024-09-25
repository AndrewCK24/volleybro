"use client";
import { useDispatch } from "react-redux";
import { frontMoves, backMoves, errorMoves } from "@/lib/scoring-moves";
import { FiPlus, FiMinus, FiRepeat } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Container, MoveButton } from "@/components/record/panels/moves";

const OursMoves = ({ recordState, recordActions }) => {
  const dispatch = useDispatch();
  const { recording } = recordState;
  const { zone } = recording.home.player;
  const oursActions =
    zone === 0 ? errorMoves : zone === 1 || zone >= 5 ? backMoves : frontMoves;

  const onOursClick = (move) => {
    dispatch(recordActions.setRecordingHomeMove(move));
  };

  return (
    <Container className={zone === 0 && "grid-cols-1"}>
      {oursActions.map((move) => (
        <MoveButton
          key={`${move.type}-${move.num}`}
          move={move}
          variant={
            move.win
              ? recording.home.num === move.num
                ? "default"
                : "option_win"
              : recording.home.num === move.num
              ? "destructive"
              : "option_lose"
          }
          onClick={() => onOursClick(move)}
        >
          {zone === 0 ? `對方${move.text}失誤` : move.text}
          {move.win ? <FiPlus /> : <FiMinus />}
        </MoveButton>
      ))}
      {zone !== 0 && (
        <Button
          variant="secondary"
          size="lg"
          className="h-full text-[1.5rem] pr-1"
        >
          替補
          <FiRepeat />
        </Button>
      )}
    </Container>
  );
};

export default OursMoves;
