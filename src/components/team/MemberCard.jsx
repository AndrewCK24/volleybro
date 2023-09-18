import { useDispatch } from "react-redux";
import styled from "@emotion/styled";

import store from "../../store/store";
import { teamActions } from "./team-slice";
import MemberCardEdit from "./MemberCardEdit";
import { FiEdit2 } from "react-icons/fi";

export const CardContainer = styled.div`
  flex: 0 0 4rem;
  width: 100%;
  background-color: var(--color-primary-200);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const Contents = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const InfoContainer = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Number = styled(InfoContainer)`
  flex: 0 0 4rem;
  justify-content: flex-end;
`;

export const ButtonContainer = styled(InfoContainer)`
  flex: 0 0;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`;

export const PrimaryButton = styled.button`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  aspect-ratio: 1;
  svg {
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
  const identity = admin
    ? "管理者"
    : userId
    ? "一般成員"
    : email
    ? "邀請中"
    : "未邀請";
  const isEditing = member?.isEditing;
  const handleEdit = () => {
    dispatch(teamActions.setMemberEditMode({ index, isEditing: true }));
  };

  return (
    <CardContainer>
      {isEditing ? (
        <MemberCardEdit index={index} member={member} />
      ) : (
        <Contents>
          <Number>{number}</Number>
          <InfoContainer>{name}</InfoContainer>
          <InfoContainer>{role}</InfoContainer>
          <InfoContainer>{identity}</InfoContainer>
          <PrimaryButton
            onClick={() => handleEdit()}
            type="button"
            title="edit"
          >
            <FiEdit2 />
          </PrimaryButton>
        </Contents>
      )}
    </CardContainer>
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
