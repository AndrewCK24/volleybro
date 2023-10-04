import { useDispatch } from "react-redux";
import styled from "@emotion/styled";

import store from "../../store";
import { teamActions } from "./team-slice";
import {
  ListItemContainer,
  ListItemContent,
  ListIndicator,
} from "../common/List";
import MemberCardEdit from "./MemberCardEdit";
import { FiEdit2 } from "react-icons/fi";
import {
  MdOutlineAdminPanelSettings,
  MdCheckCircleOutline,
  MdOutlineAccessTime,
  MdOutlineHighlightOff,
} from "react-icons/md";

export const ButtonContainer = styled.div`
  flex: 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
`;

export const PrimaryButton = styled.button`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  aspect-ratio: 1;
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-secondary-500);
  }
`;

export const DangerButton = styled(PrimaryButton)`
  svg {
    color: var(--color-danger-500);
  }
`;

export const CancelButton = styled(PrimaryButton)`
  svg {
    color: var(--color-primary-400);
  }
`;

const MemberCard = ({ index, member }) => {
  const dispatch = useDispatch();
  const { info, number, name, role } = member;
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
  const isEditing = member?.isEditing;
  const handleEdit = () => {
    dispatch(teamActions.setMemberEditMode({ index, isEditing: true }));
  };

  return (
    <ListItemContainer>
      {isEditing ? (
        <MemberCardEdit index={index} member={member} />
      ) : (
        <>
          <ListItemContent className="small">{number}</ListItemContent>
          <ListItemContent>{name}</ListItemContent>
          <ListItemContent>{role}</ListItemContent>
          <ListIndicator className={status.className}>
            {status.icon}
            {status.text}
          </ListIndicator>
          <PrimaryButton
            onClick={() => handleEdit()}
            type="button"
            title="edit"
          >
            <FiEdit2 />
          </PrimaryButton>
        </>
      )}
    </ListItemContainer>
  );
};

export default MemberCard;

export const action = async ({ request }) => {
  const teamId = store.getState().team._id;
  const members = store.getState().team.members;
  const memberData = members.find((member) => member.isEditing);
  const method = memberData.isNew ? "create-member" : "update-member";

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
        memberData, // for giving _id of the member when updating
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
