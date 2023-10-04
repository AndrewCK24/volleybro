import { useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import styled from "@emotion/styled";

import { teamActions } from "./team-slice";
import { ButtonContainer, IconButton } from "../common/Button";
import { MdDelete, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const StyledForm = styled(Form)`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: 1rem;
`;

const InputContainer = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  font-size: 1.5rem;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  /* flex: 1 1; */
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  width: 100%;
  /* flex: 1 1; */
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.5rem;
  font-weight: 500;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  color: var(--color-primary-400);
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

const adminArr = [
  { value: true, text: "管理者" },
  { value: false, text: "一般成員" },
];

const MemberCardEdit = ({ index, member }) => {
  const dispatch = useDispatch();
  const { info, number, name, role, _id } = member;

  const handleCancel = () => {
    dispatch(teamActions.setMemberEditMode({ index, isEditing: false }));
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
    <StyledForm method="post" action="/team">
      <InputContainer>
        隊員資料
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
      </InputContainer>
      <InputContainer>
        邀請與權限
        <StyledInput
          type="email"
          placeholder="信箱"
          id="email"
          name="email"
          defaultValue={info.email}
        />
        <StyledSelect
          id="admin"
          name="admin"
          defaultValue={info.admin}
          required
        >
          <StyledOption value="" disabled>
            權限
          </StyledOption>
          {adminArr.map((item, index) => (
            <StyledOption key={index} value={item.value}>
              {item.text}
            </StyledOption>
          ))}
        </StyledSelect>
      </InputContainer>
      <ButtonContainer>
        <IconButton type="submit" title="save">
          <FaSave />
        </IconButton>
        <IconButton
          onClick={() => handleCancel()}
          type="button"
          title="cancel"
          className="secondary"
        >
          <MdCancel />
        </IconButton>
        {_id && (
          <IconButton
            onClick={() => handleDelete()}
            type="button"
            title="delete"
            className="danger"
          >
            <MdDelete />
          </IconButton>
        )}
      </ButtonContainer>
    </StyledForm>
  );
};

export default MemberCardEdit;
