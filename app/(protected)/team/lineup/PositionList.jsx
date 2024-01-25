import { useDispatch } from "react-redux";
import { teamActions } from "../team-slice";
import { ListItem, ListItemText } from "@/app/components/common/List";

const PositionList = ({ starting, status }) => {
  const dispatch = useDispatch();
  const { editingZone, editingMember } = status;
  const oppositeZone = editingZone > 3 ? editingZone - 3 : editingZone + 3;
  const isSetterExist = starting.find((starter) => starter.position === "S");
  const isOutsideExist = starting.find((starter) => starter.position === "OH");
  const isMiddleExist = starting.find((starter) => starter.position === "MB");
  const isOppositeExist = starting.find((starter) => starter.position === "OP");
  const positions = [
    {
      text: "舉球員（二傳, Setter）",
      value: "S",
      disabled:
        (isSetterExist && starting[editingZone - 1]?.position !== "S") ||
        (isOppositeExist
          ? starting[oppositeZone - 1]?.position !== "OP"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "主攻手（大砲, Outside Hitter）",
      value: "OH",
      disabled:
        (isOutsideExist && starting[editingZone - 1]?.position !== "OH") ||
        (isOutsideExist
          ? starting[oppositeZone - 1]?.position !== "OH"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "快攻手（攔中, Middle Blocker）",
      value: "MB",
      disabled:
        (isMiddleExist && starting[editingZone - 1]?.position !== "MB") ||
        (isMiddleExist
          ? starting[oppositeZone - 1]?.position !== "MB"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "副攻手（舉對, Opposite Hitter）",
      value: "OP",
      disabled:
        (isOppositeExist && starting[editingZone - 1]?.position !== "OP") ||
        (isSetterExist
          ? starting[oppositeZone - 1]?.position !== "S"
          : starting[oppositeZone - 1]?.position),
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
