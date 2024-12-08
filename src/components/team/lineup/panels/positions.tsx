import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { RiArrowLeftWideLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Position } from "@/entities/team";

import { LineupOptionMode } from "@/lib/features/team/types";

export const positions = [
  {
    text: "舉球 (二傳, Setter)",
    value: Position.S,
  },
  {
    text: "主攻 (大砲, Outside Hitter)",
    value: Position.OH,
  },
  {
    text: "快攻 (攔中, Middle Blocker)",
    value: Position.MB,
  },
  {
    text: "副攻 (舉對, Opposite Hitter)",
    value: Position.OP,
  },
  {
    text: "自由 (Libero)",
    value: Position.L,
  },
];

const Positions = ({ className }) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const { list, zone } = status.editingMember;
  const toggledPosition = lineups[status.lineupIndex][list][zone - 1].position;
  const isEditingLiberos = list === "liberos";

  return (
    <Card className={className}>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(lineupActions.setOptionMode(LineupOptionMode.PLAYERINFO))
          }
        >
          <RiArrowLeftWideLine />
        </Button>
        <CardTitle>選擇位置</CardTitle>
      </CardHeader>
      <>
        {positions.map((position) => (
          <Button
            key={position.value}
            variant={toggledPosition === position.value ? "default" : "outline"}
            size="wide"
            onClick={() =>
              dispatch(lineupActions.setPlayerPosition(position.value))
            }
            disabled={
              position.value === "L" ? !isEditingLiberos : isEditingLiberos
            }
            className="text-xl"
          >
            <span className="flex justify-end font-semibold basis-8">
              {position.value}
            </span>
            <span className="flex justify-start flex-1">{position.text}</span>
          </Button>
        ))}
      </>
    </Card>
  );
};

export default Positions;
