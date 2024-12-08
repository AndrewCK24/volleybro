import { RiArrowUpWideLine, RiArrowDownWideLine } from "react-icons/ri";
import {
  EntryScore,
  EntryText,
  EntryPlayerNumber,
} from "@/components/record/entry";

import { type Substitution, type Player } from "@/entities/record";

const Substitution = ({
  substitution,
  players,
}: {
  substitution: Substitution;
  players: Player[];
}) => {
  const inPlayer = players.find((p) => p._id === substitution.players.in);
  const outPlayer = players.find((p) => p._id === substitution.players.out);

  return (
    <>
      <EntryScore />
      <EntryScore />
      <EntryText>
        <EntryPlayerNumber>{outPlayer?.number}</EntryPlayerNumber>
        OUT
        <RiArrowDownWideLine className="text-destructive" />
      </EntryText>
      <EntryText>
        <EntryPlayerNumber>{inPlayer?.number}</EntryPlayerNumber>
        IN
        <RiArrowUpWideLine className="text-primary" />
      </EntryText>
    </>
  );
};

export default Substitution;
