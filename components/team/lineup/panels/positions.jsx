import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/app/store/lineups-slice";
import { FiChevronLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const positions = [
  {
    text: "舉球 (二傳, Setter)",
    value: "S",
  },
  {
    text: "主攻 (大砲, Outside Hitter)",
    value: "OH",
  },
  {
    text: "快攻 (攔中, Middle Blocker)",
    value: "MB",
  },
  {
    text: "副攻 (舉對, Opposite Hitter)",
    value: "OP",
  },
  {
    text: "自由 (Libero)",
    value: "L",
  },
];

const Positions = ({ className }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const { list, zone } = status.editingMember;
  const toggledPosition = lineups[status.lineupNum][list][zone - 1].position;
  const isEditingLiberos = list === "liberos";

  return (
    <Card className={className}>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(lineupsActions.setOptionMode("playerInfo"))}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>選擇位置</CardTitle>
      </CardHeader>
      <>
        {positions.map((position) => (
          <Button
            key={position.value}
            variant={toggledPosition === position.value ? "" : "outline"}
            size="wide"
            onClick={() =>
              dispatch(lineupsActions.setPlayerPosition(position.value))
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
