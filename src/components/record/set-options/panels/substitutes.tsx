import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { RiUserFollowLine, RiArrowLeftWideLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import type { Player } from "@/entities/record";
import { LineupOptionMode } from "@/lib/features/team/types";

const Substitutes = ({
  members,
  className,
}: {
  members: Player[];
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch(lineupActions.setOptionMode(LineupOptionMode.NONE))
            }
          >
            <RiArrowLeftWideLine />
          </Button>
          替補名單
        </CardTitle>
      </CardHeader>
      {lineups[status.lineupIndex].substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <Button
            key={member._id}
            variant="outline"
            size="wide"
            onClick={() =>
              dispatch(
                lineupActions.replaceEditingPlayer({
                  _id: member._id,
                  list: "substitutes",
                  zone: index + 1,
                })
              )
            }
            className="text-xl"
          >
            <RiUserFollowLine />
            <span className="flex justify-end font-semibold basis-8">
              {member.number || " "}
            </span>
            {member.name}
          </Button>
        );
      })}
    </Card>
  );
};

export default Substitutes;
