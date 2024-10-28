import {
  EntryContainer,
  EntryScore,
  EntryText,
  EntryPlayerNumber,
} from "@/components/record/entry";

import { type Substitution, type Player } from "@/entities/record";

const Substitution = ({
  substitution,
  players,
  className,
}: {
  substitution: Substitution;
  players: Player[];
  className?: string;
}) => {
  const inPlayer = players.find((p) => p._id === substitution.players.in);
  const outPlayer = players.find((p) => p._id === substitution.players.out);

  return (
    <EntryContainer className={className}>
      <EntryScore />
      <EntryScore />
      <EntryText className="border-primary">
        <EntryPlayerNumber>{inPlayer.number}</EntryPlayerNumber>
        IN
      </EntryText>
      <EntryText className="border-destructive">
        <EntryPlayerNumber>{outPlayer.number}</EntryPlayerNumber>
        OUT
      </EntryText>
    </EntryContainer>
  );
};
