import { redirect } from "react-router-dom";
import styled from "@emotion/styled";

import Logo from "../components/general/Logo";
import AuthForm from "../components/auth/AuthForm";

export const Container = styled.div`
  flex: 0 1 25rem;
  background-color: var(--color-primary-100);
  border-radius: 0.5rem;
  box-shadow: 0 0 0.25rem var(--color-primary-400);
  height: 80%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const AuthPage = () => {
  return (
    <Container>
      <Logo dark={true} name={true} />
      <AuthForm />
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
        return redirect("/");
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
