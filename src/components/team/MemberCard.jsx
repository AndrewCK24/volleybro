import { useDispatch } from "react-redux";
import styled from "@emotion/styled";

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

export const PrimaryButton = styled.button`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  svg {
    color: var(--color-secondary-500);
  }
`;

export const DangerButton = styled(PrimaryButton)`
  svg {
    color: var(--color-danger-400);
  }
`;

export const CancelButton = styled(PrimaryButton)`
  svg {
    color: var(--color-primary-400);
  }
`;

const MemberCard = ({ index, member }) => {
  const dispatch = useDispatch();
  const { number, name, role } = member;
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
  const formData = await request.formData();
  const memberData = {
    number: formData.get("number"),
    name: formData.get("name"),
    role: formData.get("role"),
  };

  try {
    const response = await fetch("/.netlify/functions/create-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(memberData),
    });
    const { status, message } = await response.json();

    dispatch(teamActions.saveMember({ index }));

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
