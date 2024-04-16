import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../../team-slice";
import { FiUserCheck, FiUser } from "react-icons/fi";
import { SectionHr } from "@/app/components/common/Section";
import { ListItem, ListItemText } from "@/app/components/common/List";

const SubstituteList = () => {
  const dispatch = useDispatch();
  const { members, editingLineup } = useSelector((state) => state.team);

  return (
    <>
      {editingLineup.substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <ListItem
            key={index}
            onClick={() =>
              dispatch(
                teamActions.replaceEditingPlayer({
                  _id: member._id,
                  list: "substitutes",
                  zone: index,
                })
              )
            }
          >
            <FiUserCheck />
            <ListItemText minimized bold>
              {member.number || " "}
            </ListItemText>
            <ListItemText>{member.name}</ListItemText>
          </ListItem>
        );
      })}
      <SectionHr content="以上為正式比賽 12 + 2 人名單" />
      {editingLineup.others.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <ListItem
            key={index}
            onClick={() =>
              dispatch(
                teamActions.replaceEditingPlayer({
                  _id: member._id,
                  list: "others",
                  zone: index,
                })
              )
            }
          >
            <FiUser />
            <ListItemText minimized bold>
              {member.number || " "}
            </ListItemText>
            <ListItemText>{member.name}</ListItemText>
          </ListItem>
        );
      })}
    </>
  );
};

export default SubstituteList;
