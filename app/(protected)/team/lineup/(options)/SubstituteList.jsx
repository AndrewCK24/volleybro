import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../../team-slice";
import { FiUserCheck } from "react-icons/fi";
import { SectionHr } from "@/app/components/common/Section";
import { ListItem, ListItemText } from "@/app/components/common/List";

const SubstituteList = () => {
  const dispatch = useDispatch();
  const { members, editingLineup } = useSelector((state) => state.team);
  const { editingMember } = editingLineup.status;

  const substitutes = members
    .filter((member) => editingLineup.substitutes.includes(member._id))
    .sort((a, b) => a.number - b.number);
  const others = members
    .filter((member) => editingLineup.others.includes(member._id))
    .sort((a, b) => a.number - b.number);

  return (
    <>
      {substitutes.map((player, index) => {
        return (
          <ListItem
            key={index}
            type={editingMember._id === player._id && "primary"}
            onClick={() => dispatch()}
            disabled={
              editingMember.position === "substitutes" &&
              editingMember._id !== player._id
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
      <SectionHr content="以上為正式比賽 12 + 2 人名單" />
      {others.map((player, index) => {
        return (
          <ListItem
            key={index}
            type={editingMember._id === player._id && "primary"}
            onClick={() => dispatch()}
            disabled={
              editingMember.position === "others" &&
              editingMember._id !== player._id
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
