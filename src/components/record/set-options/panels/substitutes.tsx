import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { lineupsActions } from "@/src/app/store/lineups-slice";
import { FiUserCheck, FiChevronLeft } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

import type { Player } from "@/src/entities/record";

const Substitutes = ({
  members,
  className,
}: {
  members: Player[];
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineups);

  return (
    <Card className={className}>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(lineupsActions.setOptionMode(""))}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>替補名單</CardTitle>
      </CardHeader>
      {lineups[status.lineupNum].substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <Button
            key={member._id}
            variant="outline"
            size="wide"
            onClick={() =>
              dispatch(
                lineupsActions.replaceEditingPlayer({
                  _id: member._id,
                  list: "substitutes",
                  zone: index + 1,
                })
              )
            }
            className="text-xl"
          >
            <FiUserCheck />
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
