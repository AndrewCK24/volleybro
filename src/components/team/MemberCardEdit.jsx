import { Form } from "react-router-dom";
import styled from "@emotion/styled";

import { PrimaryButton, DangerButton, CancelButton } from "./MemberCard";
import { MdDelete, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

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
  justify-content: center;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  width: 50%;
  /* height: 2rem; */
  flex: 1 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  /* border: solid 1px var(--color-primary-400); */
  line-height: 2rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  width: 50%;
  /* height: 3rem; */
  flex: 1 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  /* border: solid 1px var(--color-primary-400); */
  line-height: 2rem;
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

const roleArr = [
  { value: "S", text: "Setter (S)" },
  { value: "MB", text: "Middle Blocker (MB)" },
  { value: "OH", text: "Outside Hitter (OH)" },
  { value: "OP", text: "Opposite (OP)" },
  { value: "L", text: "Libero (L)" },
  { value: "M", text: "Manager (M)" },
];

const MemberCardEdit = ({ index, member }) => {
  const { number, name, role } = member;

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
    <StyledForm method="post" action="/team">
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
        <StyledSelect id="role" name="role" defaultValue={role || ""} required>
          <StyledOption value="" disabled>
            位置
          </StyledOption>
          {roleArr.map((item, index) => (
            <StyledOption key={index} value={item.value}>
              {item.text}
            </StyledOption>
          ))}
        </StyledSelect>
        <StyledInput type="email" placeholder="信箱" id="email" name="email" />
      </InputContainer>
      <PrimaryButton type="submit" title="save">
        <FaSave />
      </PrimaryButton>
      <CancelButton
        // onClick={() => handleEdit()}
        type="button"
        title="cancel"
      >
        <MdCancel />
      </CancelButton>
      <DangerButton onClick={() => handleDelete()} type="button" title="delete">
        <MdDelete />
      </DangerButton>
    </StyledForm>
  );
};

export default MemberCardEdit;
