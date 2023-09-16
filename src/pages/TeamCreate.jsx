import { Form, redirect } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store/store";

const Container = styled.div`
  flex: 1 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: 40%;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-secondary-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledLabel = styled.label`
  width: 100%;
  flex: 0 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  width: 60%;
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const StyledInput = styled.input`
  flex: 5 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.75rem;
  font-weight: 500;
`;

const StyledButton = styled.button`
  flex: 1 1 6rem;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.75rem;
  font-weight: 500;
  background-color: var(--color-primary-400);
  color: var(--color-secondary-100);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    font-weight: 700;
    background-color: var(--color-primary-500);
  }
`;

const TeamCreatePage = () => {
  return (
    <Container>
      <StyledForm method="post" path="/team/new">
        <StyledLabel>輸入要建立的隊伍名稱</StyledLabel>
        <InputContainer>
          <StyledInput
            type="text"
            placeholder="隊伍名稱"
            id="name"
            name="name"
            required
          />
          <StyledButton type="submit">建立</StyledButton>
        </InputContainer>
      </StyledForm>
    </Container>
  );
};

export default TeamCreatePage;

export const action = async ({ request }) => {
  console.log("team create action started");
  const formData = await request.formData();
  const reqData = {
    name: formData.get("name"),
  };

  try {
    const response = await fetch("/.netlify/functions/create-team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(reqData),
    });
    const { status, userData, teamData } = await response.json();
    console.log("team create action finished");

    if (status === 200) {
      store.dispatch({ type: "user/signIn", payload: userData });
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
      store.dispatch({
        type: "team/setMemberEditMode",
        payload: { index: 0, isEditing: true },
      });
      return redirect("/team");
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
