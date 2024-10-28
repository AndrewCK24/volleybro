import { FiPlus, FiMinus, FiUser } from "react-icons/fi";
import {
  EntryContainer,
  EntryScore,
  EntryText,
  EntryPlayerNumber,
} from "@/components/record/entry";
import { scoringMoves } from "@/lib/scoring-moves";

import { type Rally, type Player, MoveType } from "@/entities/record";

const IconWin = () => <FiPlus className="text-primary" />;

const IconLose = () => <FiMinus className="text-destructive" />;

const Rally = ({
  rally,
  players,
  onClick,
  className,
}: {
  rally: Rally;
  players: Player[];
  onClick: () => void;
  className?: string;
}) => {
  const { win, home, away } = rally;
  const playerNumber = players.find((p) => p._id === home.player._id)?.number;

  return (
    <EntryContainer className={className} onClick={onClick}>
      {home.type ? (
        <>
          <EntryScore win={win}>{home.score}</EntryScore>
          <EntryScore win={!win}>{away.score}</EntryScore>
        </>
      ) : (
        <>
          <EntryScore>{home.score}</EntryScore>
          <EntryScore>{away.score}</EntryScore>
        </>
      )}
      <EntryText className="border-primary">
        {home.type ? (
          home.type !== MoveType.UNFORCED ? (
            <>
              <EntryPlayerNumber>{playerNumber}</EntryPlayerNumber>
              {scoringMoves[home.num]?.text}
              {home.type && (win ? <IconWin /> : <IconLose />)}
            </>
          ) : (
            <>--</>
          )
        ) : (
          <EntryPlayerNumber>{playerNumber}</EntryPlayerNumber>
        )}
      </EntryText>
      <EntryText className="border-destructive">
        {away.type &&
          (away.type !== MoveType.UNFORCED ? (
            <>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-primary-foreground">
                <FiUser />
              </span>
              {scoringMoves[away.num]?.text}
              {win ? <IconLose /> : <IconWin />}
            </>
          ) : (
            <>--</>
          ))}
      </EntryText>
    </EntryContainer>
  );
};

export default Rally;
