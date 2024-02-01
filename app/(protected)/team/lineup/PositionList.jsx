import { useDispatch } from "react-redux";
import { teamActions } from "../team-slice";
import { FiUserCheck, FiUserX, FiX } from "react-icons/fi";
import { ListItem, ListItemText } from "@/app/components/common/List";

const PositionList = ({ starting, status }) => {
  const dispatch = useDispatch();
  const { editingZone, editingMember } = status;
  const isEditingBenches = editingZone <= 0;
  const oppositeZone = editingZone > 3 ? editingZone - 3 : editingZone + 3;
  const isSetterExist = starting.find((starter) => starter.position === "S");
  const isOutsideExist = starting.find((starter) => starter.position === "OH");
  const isMiddleExist = starting.find((starter) => starter.position === "MB");
  const isOppositeExist = starting.find((starter) => starter.position === "OP");
  const positions = [
    {
      text: "舉球 (二傳, Setter)",
      value: "S",
      disabled:
        (isSetterExist &&
          starting[editingZone - 1].position &&
          starting[editingZone - 1].position !== "S") ||
        (isOppositeExist
          ? starting[oppositeZone - 1]?.position !== "OP"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "主攻 (大砲, Outside Hitter)",
      value: "OH",
      disabled:
        (isOutsideExist &&
          starting[editingZone - 1].position &&
          starting[editingZone - 1].position !== "OH") ||
        (isOutsideExist
          ? starting[oppositeZone - 1]?.position !== "OH"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "快攻 (攔中, Middle Blocker)",
      value: "MB",
      disabled:
        (isMiddleExist &&
          starting[editingZone - 1].position &&
          starting[editingZone - 1].position !== "MB") ||
        (isMiddleExist
          ? starting[oppositeZone - 1]?.position !== "MB"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "副攻 (舉對, Opposite Hitter)",
      value: "OP",
      disabled:
        (isOppositeExist &&
          starting[editingZone - 1].position &&
          starting[editingZone - 1].position !== "OP") ||
        (isSetterExist
          ? starting[oppositeZone - 1]?.position !== "S"
          : starting[oppositeZone - 1]?.position),
    },
    {
      text: "自由 (Libero)",
      value: "L",
      disabled: editingZone < 7,
    },
  ];
  const handleClick = (position) => {
    dispatch(teamActions.setPlayerPosition({ position }));
  };

  return (
    <>
      {isEditingBenches ? (
        <ListItem
          onClick={() =>
            dispatch(teamActions.setPlayerPosition({ position: "" }))
          }
        >
          <ListItemText minimized bold>
            {editingMember.type === "others" ? <FiUserCheck /> : <FiUserX />}
          </ListItemText>
          <ListItemText>
            {editingMember.type === "others"
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
              onClick={() => handleClick(position.value)}
              disabled={position.disabled}
            >
              <ListItemText minimized bold>
                {position.value}
              </ListItemText>
              <ListItemText>
                {position.text} {position.disabled ? "true" : "false"}
              </ListItemText>
            </ListItem>
          ))}
        </>
      )}
      <ListItem
        type="danger"
        onClick={() => dispatch(teamActions.resetEditingStatus())}
        center
      >
        <ListItemText minimized bold>
          <FiX />
        </ListItemText>
        <ListItemText>取消編輯</ListItemText>
      </ListItem>
    </>
  );
};

export default PositionList;
