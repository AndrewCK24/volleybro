import { useSelector } from "react-redux";
import { FiEdit2, FiRepeat } from "react-icons/fi";
import {
  ListItemContainer,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const PlayerInfo = ({ setMode }) => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { editingMember } = editingLineup.status;
  const member = members.find((m) => m._id === editingMember._id);

  return (
    <>
      <ListItem onClick={() => setMode("substitutes")}>
        <ListItemText fit>球員</ListItemText>
        <ListItemText bold>{member.name}</ListItemText>
        <FiRepeat />
      </ListItem>
      <ListItemContainer>
        <ListItem>
          <ListItemText fit>背號</ListItemText>
          <ListItemText bold>{member.number}</ListItemText>
          <FiEdit2 />
        </ListItem>
        <ListItem onClick={() => setMode("positions")}>
          <ListItemText fit>位置</ListItemText>
          <ListItemText bold>{editingMember.position}</ListItemText>
          <FiEdit2 />
        </ListItem>
      </ListItemContainer>
    </>
  );
};

export default PlayerInfo;
