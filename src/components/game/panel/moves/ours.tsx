"use client";
import {
  Container,
  MOVE_CELL_CLASS,
  MoveButton,
} from "@/components/game/panel/moves";
import { Button } from "@/components/ui/button";
import { gameActions } from "@/lib/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  backMoves,
  errorMoves,
  frontMoves,
  type ScoringMove,
} from "@/lib/scoring-moves";
import { FiMinus, FiPlus } from "react-icons/fi";
import { RiRepeat2Line } from "react-icons/ri";

export const OursMoves = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const { entryDraft: draft } = gameState[gameState.mode];
  const zone = draft.home.player?.zone ?? 0;
  const oursMoves =
    zone === 0 ? errorMoves : zone === 1 || zone >= 5 ? backMoves : frontMoves;

  const onOursClick = (move: ScoringMove) => {
    dispatch(gameActions.setEntryDraftHomeMove(move));
  };

  return (
    <Container
      className={
        // ADR-0122: rows share a tall panel but never drop below 44px.
        zone === 0 ? "auto-rows-[minmax(44px,1fr)]" : undefined
      }
    >
      {oursMoves.map((move) => (
        <MoveButton
          key={`${move.type}-${move.num}`}
          move={move}
          toggled={draft.home.num === move.num}
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
          className={MOVE_CELL_CLASS}
          onClick={() => dispatch(gameActions.setPanel("substitutes"))}
        >
          替補
          <RiRepeat2Line />
        </Button>
      )}
    </Container>
  );
};
