import { useDispatch } from "react-redux";
import { teamActions } from "../team-slice";
import { FiUserCheck } from "react-icons/fi";
import { ListItem, ListItemText } from "@/app/components/common/List";

const SubstituteList = ({ members, substitutes, status }) => {
  const dispatch = useDispatch();
  const { editingMember, type } = status;
  const handleClick = (player) => {
    dispatch(
      teamActions.setEditingStatus({
        member: {
          _id: player._id,
          number: player.number,
          type: "substitutes",
        },
      })
    );
  };

  const players = members.filter((member) => substitutes.includes(member._id));
  players.sort((a, b) => a.number - b.number);

  return (
    <>
      {players.map((player, index) => {
        return (
          <ListItem
            key={index}
            type={editingMember._id === player._id && "primary"}
            onClick={() => handleClick(player)}
            disabled={
              type === "substitutes" && editingMember._id !== player._id
            }
          >
            <FiUserCheck />
            <ListItemText minimized bold>
              {player.number || " "}
            </ListItemText>
            <ListItemText>{player.name}</ListItemText>
          </ListItem>
        );
      })}
    </>
  );
};

export default SubstituteList;
