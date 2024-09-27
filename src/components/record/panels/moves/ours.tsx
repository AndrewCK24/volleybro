"use client";
import React from "react";
import { useDispatch } from "react-redux";
import {
  frontMoves,
  backMoves,
  errorMoves,
  type ScoringMove,
} from "@/src/lib/scoring-moves";
import { FiPlus, FiMinus, FiRepeat } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Container, MoveButton } from "@/src/components/record/panels/moves";

const OursMoves: React.FC<{ recordState: any; recordActions: any }> = ({
  recordState,
  recordActions,
}) => {
  const dispatch = useDispatch();
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
