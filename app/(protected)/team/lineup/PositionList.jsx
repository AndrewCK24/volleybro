import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { ListItem, ListItemText } from "@/app/components/common/List";

const PositionList = ({ starters, status }) => {
  const dispatch = useDispatch();
  const { editingZone, editingMember } = status;
  const oppositeZone = editingZone > 3 ? editingZone - 3 : editingZone + 3;
  const isSetterExist = starters.find((starter) => starter.position === "S");
  const isOutsideExist = starters.find((starter) => starter.position === "OH");
  const isMiddleExist = starters.find((starter) => starter.position === "MB");
  const isOppositeExist = starters.find((starter) => starter.position === "OP");
  const positions = [
    {
      text: "舉球員（二傳, Setter）",
      value: "S",
      disabled:
        (isSetterExist && starters[editingZone - 1]?.position !== "S") ||
        (isOppositeExist
          ? starters[oppositeZone - 1]?.position !== "OP"
          : starters[oppositeZone - 1]?.position),
    },
    {
      text: "主攻手（大砲, Outside Hitter）",
      value: "OH",
      disabled:
        (isOutsideExist && starters[editingZone - 1]?.position !== "OH") ||
        (isOutsideExist
          ? starters[oppositeZone - 1]?.position !== "OH"
          : starters[oppositeZone - 1]?.position),
    },
    {
      text: "快攻手（攔中, Middle Blocker）",
      value: "MB",
      disabled:
        (isMiddleExist && starters[editingZone - 1]?.position !== "MB") ||
        (isMiddleExist
          ? starters[oppositeZone - 1]?.position !== "MB"
          : starters[oppositeZone - 1]?.position),
    },
    {
      text: "副攻手（舉對, Opposite Hitter）",
      value: "OP",
      disabled:
        (isOppositeExist && starters[editingZone - 1]?.position !== "OP") ||
        (isSetterExist
          ? starters[oppositeZone - 1]?.position !== "S"
          : starters[oppositeZone - 1]?.position),
    },
    {
      text: "自由球員 (Libero)",
      value: "L",
      disabled: editingZone < 7,
    },
  ];
  const handleClick = (position) => {
    dispatch(
      teamActions.setLineupPlayer({
        zone: editingZone,
        member_id: editingMember._id,
        position,
      })
    );
  };

  return (
    <>
      {positions.map((position, index) => {
        return (
          <ListItem
            key={index}
            type={position.disabled && "secondary"}
            onClick={() => handleClick(position.value)}
            disabled={position.disabled}
          >
            <ListItemText minimized bold>
              {position.value}
            </ListItemText>
            <ListItemText>{position.text}</ListItemText>
          </ListItem>
        );
      })}
    </>
  );
};

export default PositionList;
