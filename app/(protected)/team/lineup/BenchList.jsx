import { FiUser } from "react-icons/fi";
import { ListItem, ListItemText } from "@/app/components/common/List";

const BenchList = ({
  members,
  benches,
  editingZone,
  editingMember,
  setEditingMember,
}) => {
  const handleClick = (player) => {
    setEditingMember({ _id: player._id, number: player.number });
  };

  const players = members.filter((member) => benches.includes(member._id));
  players.sort((a, b) => a.number - b.number);

  return (
    <>
      {players.map((player, index) => {
        return (
          <ListItem
            key={index}
            type={editingMember._id === player._id && "primary"}
            onClick={() => handleClick(player)}
            disabled={!editingZone}
          >
            <FiUser />
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

export default BenchList;
