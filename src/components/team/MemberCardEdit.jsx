import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import styled from "@emotion/styled";

import { teamActions } from "./team-slice";
import { FormControl, FormSelect } from "../common/Form";
import { ButtonContainer, IconButton } from "../common/Button";
import { MdDelete, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const StyledForm = styled(Form)`
  flex: 1 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.5rem;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const FormSection = styled.section`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  font-size: 1.5rem;
  gap: 0.5rem;
`;

const roleArr = [
  { value: "S", text: "舉球 (S)" },
  { value: "MB", text: "攔中 (MB)" },
  { value: "OH", text: "主攻 (OH)" },
  { value: "OP", text: "舉對 (OP)" },
  { value: "L", text: "自由 (L)" },
  { value: "M", text: "球經 (M)" },
];

const adminArr = [
  { id: "admin", value: true, text: "管理者" },
  { id: "member", value: false, text: "一般成員" },
];

const MemberCardEdit = ({ index, member, isAdmin }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const { _id: teamId, editingMember } = useSelector((state) => state.team);
  const { info, number, name, role, _id } = member;

  const handleCancel = () => {
    dispatch(teamActions.setMemberEditMode(""));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/.netlify/functions/delete-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          teamId,
          editingMember,
        }),
      });
      const { teamData } = await response.json();
      dispatch(teamActions.loadTeamData(teamData));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledForm method="post" action="/team">
      <FormSection>
        <FormControl
          name="number"
          labelText="背號"
          type="number"
          placeholder="請輸入球員背號"
          required={true}
          defaultValue={number}
        />
        <FormControl
          name="name"
          labelText="姓名"
          type="text"
          placeholder="請輸入球員姓名"
          required={true}
          defaultValue={name}
        />
      </FormSection>
      <FormSection>
        <FormControl
          name="email"
          labelText="電子信箱"
          type="email"
          placeholder="請輸入球員電子信箱"
          required={true}
          defaultValue={info.email}
          disabled={!isAdmin}
        />
        <FormSelect
          name="admin"
          labelText="權限"
          options={adminArr}
          required={true}
          defaultValue={info.admin}
          disabled={!isAdmin}
        />
      </FormSection>
      <ButtonContainer>
        <IconButton type="submit" title="save">
          <FaSave />
        </IconButton>
        {_id && info.userId !== userId && (
          <IconButton
            onClick={() => handleDelete()}
            type="button"
            title="delete"
            className="danger"
          >
            <MdDelete />
          </IconButton>
        )}
        <IconButton
          onClick={() => handleCancel()}
          type="button"
          title="cancel"
          className="secondary"
        >
          <MdCancel />
        </IconButton>
      </ButtonContainer>
    </StyledForm>
  );
};

export default MemberCardEdit;
