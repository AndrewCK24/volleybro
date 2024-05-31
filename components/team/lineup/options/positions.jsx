import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/app/store/lineups-slice";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

const Positions = () => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const { starting } = lineups[status.lineupNum];
  const { editingMember } = status;
  const isEditingLiberos = editingMember.zone > 6;
  const oppositeZone =
    editingMember.zone > 3 ? editingMember.zone - 3 : editingMember.zone + 3;
  const isSetterExist = starting.find((starter) => starter.position === "S");
  const isOutsideExist = starting.find((starter) => starter.position === "OH");
  const isMiddleExist = starting.find((starter) => starter.position === "MB");
  const isOppositeExist = starting.find((starter) => starter.position === "OP");
  const positions = [
    {
      text: "舉球 (二傳, Setter)",
      value: "S",
      disabled:
        isEditingLiberos ||
        (isSetterExist &&
          starting[editingMember.zone - 1]?.position &&
          starting[editingMember.zone - 1].position !== "S") ||
        (isOppositeExist
          ? starting[oppositeZone - 1]?.position !== "OP"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "主攻 (大砲, Outside Hitter)",
      value: "OH",
      disabled:
        isEditingLiberos ||
        (isOutsideExist &&
          starting[editingMember.zone - 1]?.position &&
          starting[editingMember.zone - 1].position !== "OH") ||
        (isOutsideExist
          ? starting[oppositeZone - 1]?.position !== "OH"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "快攻 (攔中, Middle Blocker)",
      value: "MB",
      disabled:
        isEditingLiberos ||
        (isMiddleExist &&
          starting[editingMember.zone - 1]?.position &&
          starting[editingMember.zone - 1].position !== "MB") ||
        (isMiddleExist
          ? starting[oppositeZone - 1]?.position !== "MB"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "副攻 (舉對, Opposite Hitter)",
      value: "OP",
      disabled:
        isEditingLiberos ||
        (isOppositeExist &&
          starting[editingMember.zone - 1]?.position &&
          starting[editingMember.zone - 1].position !== "OP") ||
        (isSetterExist
          ? starting[oppositeZone - 1]?.position !== "S"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "自由 (Libero)",
      value: "L",
      disabled: !isEditingLiberos,
    },
  ];

  return (
    <>
      <CardHeader>
        <CardTitle>選擇位置</CardTitle>
      </CardHeader>
      <>
        {positions.map((position) => (
          <Button
            key={position.value}
            type={position.disabled && "secondary"}
            size="wide"
            onClick={() =>
              dispatch(lineupsActions.setPlayerPosition(position.value))
            }
            disabled={position.disabled}
            className="text-xl"
          >
            <span className="flex justify-end font-semibold basis-8">
              {position.value}
            </span>
            {position.text}
          </Button>
        ))}
      </>
    </>
  );
};

export default Positions;
