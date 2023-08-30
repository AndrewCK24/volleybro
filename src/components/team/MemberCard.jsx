import { useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import styled from "@emotion/styled";

import { teamActions } from "./team-slice";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

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

const StyledForm = styled(Form)`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const InputContainer = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  width: 50%;
  flex: 1 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--color-primary-400);
  font-size: 1.5rem;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  width: 50%;
  flex: 1 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--color-primary-400);
  font-size: 1.5rem;
  font-weight: 500;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
`;

const StyledOption = styled.option`
  padding: 0.5rem;
  &:disabled {
    color: var(--color-primary-400);
  }
`;

const PrimaryButton = styled.button`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  svg {
    color: var(--color-secondary-500);
  }
`;

const DangerButton = styled(PrimaryButton)`
  svg {
    color: var(--color-danger-400);
  }
`;

const roleArr = [
  { value: "S", text: "Setter (S)" },
  { value: "MB", text: "Middle Blocker (MB)" },
  { value: "OH", text: "Outside Hitter (OH)" },
  { value: "OP", text: "Opposite (OP)" },
  { value: "L", text: "Libero (L)" },
  { value: "M", text: "Manager (M)" },
];

const MemberCard = ({ index, member }) => {
  const dispatch = useDispatch();
  const { number, name, role } = member;
  const isEditing = member?.isEditing;
  const handleEdit = () => {
    dispatch(teamActions.updateMember({ index }));
  };

  const handleDelete = async () => {
    try {
      await fetch("/.netlify/functions/delete-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(number),
      });
      dispatch(teamActions.deleteMember({ index }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardContainer>
      {isEditing || number === null ? (
        <StyledForm method="post" action="/teams">
          <InputContainer>
            <StyledInput
              type="number"
              placeholder="背號"
              id="number"
              name="number"
              defaultValue={number}
              required
            />
            <StyledInput
              type="text"
              placeholder="姓名"
              id="name"
              name="name"
              defaultValue={name}
              required
            />
            <StyledSelect id="role" name="role" defaultValue={""} required>
              <StyledOption value="" disabled>
                位置
              </StyledOption>
              {roleArr.map((item, index) => (
                <StyledOption key={index} value={item.value}>
                  {item.text}
                </StyledOption>
              ))}
            </StyledSelect>
            <StyledInput
              type="email"
              placeholder="信箱"
              id="email"
              name="email"
            />
          </InputContainer>
          <PrimaryButton type="submit" title="save">
            <FaSave />
          </PrimaryButton>
          <DangerButton
            // onClick={() => handleEdit()}
            type="button"
            title="cancel"
          >
            <MdCancel />
          </DangerButton>
        </StyledForm>
      ) : (
        <Contents>
          <Number>{number}</Number>
          <InfoContainer>{name}</InfoContainer>
          <InfoContainer>{role}</InfoContainer>
          <PrimaryButton onClick={() => handleEdit()} type="button" title="edit">
            <FiEdit2 />
          </PrimaryButton>
          <DangerButton
            onClick={() => handleDelete()}
            type="button"
            title="delete"
          >
            <MdDelete />
          </DangerButton>
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
