import { redirect, Form } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store/store";
import Logo from "../components/general/Logo";

const Container = styled.div`
  flex: 0 1 25rem;
  background-color: var(--color-primary-200);
  border-radius: 0.5rem;
  height: 100%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const StyledForm = styled(Form)`
  flex: 0.8 1;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  width: 100%;
  padding: 0.5rem 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  height: 2.5rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--gray-primary);
  font-size: 1.5rem;
  font-weight: 500;
`;

const StyledButton = styled.button`
  height: 2.5rem;
  width: 100%;
  padding: 0.5rem;
  color: var(--color-primary-100);
  background-color: var(--color-secondary-500);
  border: none;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const AuthPage = () => {
  return (
    <Container>
      <Logo dark={true} name={true} />
      <StyledForm method="post" action="/auth">
        <StyledLabel htmlFor="email">帳號</StyledLabel>
        <StyledInput
          type="email"
          placeholder="email"
          id="email"
          name="email"
          required
          autoComplete="on"
        />
        <StyledLabel htmlFor="password">密碼</StyledLabel>
        <StyledInput
          type="password"
          placeholder="password"
          id="password"
          name="password"
          required
          autoComplete="on"
        />
        <StyledButton type="submit">註冊 / 登入</StyledButton>
      </StyledForm>
    </Container>
  );
};

export default AuthPage;

export const action = async ({ request }) => {
  console.log("auth action started");
  const formData = await request.formData();
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(userData),
    });
    const { status } = await response.json();

    switch (status) {
      case 200:
        return redirect("/home");
      case 201:
        return redirect("/team");
      case 401:
        return redirect("/auth");
      default:
        return null;
    }
  } catch (error) {
    console.log(error);
    return redirect("/auth");
  }
};

export const loader = async ({ request }) => {
};
