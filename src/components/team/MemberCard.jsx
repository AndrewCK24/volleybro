import { useDispatch, useSelector } from "react-redux";

import store from "../../store";
import { teamActions } from "./team-slice";
import {
  ListItemContainer,
  ListItemContentContainer,
  ListItemContent,
  ListIndicator,
} from "../common/List";
import { IconButton } from "../common/Button";
import MemberCardEdit from "./MemberCardEdit";
import { FiEdit2 } from "react-icons/fi";
import {
  MdOutlineAdminPanelSettings,
  MdCheckCircleOutline,
  MdOutlineAccessTime,
  MdOutlineHighlightOff,
} from "react-icons/md";

const MemberCard = ({ index, member }) => {
  const dispatch = useDispatch();
  const { editingMember } = useSelector((state) => state.team);
  const { info, number, name, role, _id = "" } = member;
  const { admin, email, userId } = info;
  const status = admin
    ? {
        text: "管理者",
        className: "danger",
        icon: <MdOutlineAdminPanelSettings />,
      }
    : userId
    ? {
        text: "已加入",
        className: "primary",
        icon: <MdCheckCircleOutline />,
      }
    : email
    ? { text: "邀請中", className: "", icon: <MdOutlineAccessTime /> }
    : {
        text: "未邀請",
        className: "secondary",
        icon: <MdOutlineHighlightOff />,
      };
  const isEditing = (editingMember === _id);
  const handleEdit = () => {
    dispatch(teamActions.setMemberEditMode({ _id }));
  };

  return (
    <ListItemContainer>
      {isEditing ? (
        <MemberCardEdit index={index} member={member} />
      ) : (
        <>
          <ListItemContentContainer>
            <ListItemContent className="small">{number}</ListItemContent>
            <ListItemContent>{name}</ListItemContent>
            <ListItemContent className="small">{role}</ListItemContent>
          </ListItemContentContainer>
          <ListIndicator className={status.className}>
            {status.icon}
            {status.text}
          </ListIndicator>
          <IconButton onClick={() => handleEdit()} type="button" title="edit">
            <FiEdit2 />
          </IconButton>
        </>
      )}
    </ListItemContainer>
  );
};

export default MemberCard;

export const action = async ({ request }) => {
  const teamId = store.getState().team._id;
  const { editingMember } = store.getState().team;
  const method = editingMember ? "update-member" : "create-member";

  const formData = await request.formData();
  const editingData = {
    info: {
      admin: formData.get("admin"),
      email: formData.get("email"),
    },
    name: formData.get("name"),
    number: formData.get("number"),
    role: formData.get("role"),
  };

  try {
    const response = await fetch(`/.netlify/functions/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        teamId,
        editingData,
        editingMember,  // for giving _id of the member when updating
      }),
    });

    const { status, teamData } = await response.json();
    if (status === 200) {
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
