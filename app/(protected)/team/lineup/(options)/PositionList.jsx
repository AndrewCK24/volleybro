import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../../team-slice";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { ListItem, ListItemText } from "@/app/components/common/List";

const PositionList = () => {
  const dispatch = useDispatch();
  const { starting, status } = useSelector((state) => state.team.editingLineup);
  const { editingMember } = status;
  const isEditingBenches = editingMember.zone <= 0;
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
      {isEditingBenches ? (
        <ListItem onClick={() => dispatch(teamActions.setPlayerPosition(""))}>
          <ListItemText minimized bold>
            {editingMember.position === "others" ? (
              <FiUserCheck />
            ) : (
              <FiUserX />
            )}
          </ListItemText>
          <ListItemText>
            {editingMember.position === "others"
              ? "移入替補球員名單"
              : "移出替補球員名單"}
          </ListItemText>
        </ListItem>
      ) : (
        <>
          {positions.map((position, index) => (
            <ListItem
              key={index}
              type={position.disabled && "secondary"}
              onClick={() =>
                dispatch(teamActions.setPlayerPosition(position.value))
              }
              disabled={position.disabled}
            >
              <ListItemText minimized bold>
                {position.value}
              </ListItemText>
              <ListItemText>{position.text}</ListItemText>
            </ListItem>
          ))}
        </>
      )}
    </>
  );
};

export default PositionList;
