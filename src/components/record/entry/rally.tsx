import { FiPlus, FiMinus } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import {
  EntryScore,
  EntryText,
  EntryPlayerNumber,
} from "@/components/record/entry";
import { scoringMoves } from "@/lib/scoring-moves";

import { type Rally, type Player, MoveType } from "@/entities/record";

const IconWin = () => <FiPlus className="text-primary" />;

const IconLose = () => <FiMinus className="text-destructive" />;

const Rally = ({ rally, players }: { rally: Rally; players: Player[] }) => {
  const { win, home, away } = rally;
  const playerNumber = players.find((p) => p._id === home.player._id)?.number;

  return (
    <>
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
                <RiUserLine />
              </span>
              {scoringMoves[away.num]?.text}
              {win ? <IconLose /> : <IconWin />}
            </>
          ) : (
            <>--</>
          ))}
      </EntryText>
    </>
  );
};

export default Rally;
