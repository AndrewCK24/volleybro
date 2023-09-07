import { redirect } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store/store";
import { getJwtInfo } from "../utils/auth";
import { Container, PagesContainer } from "./Root";
import Logo from "../components/general/Logo";
import AuthForm from "../components/auth/AuthForm";

export const AuthContainer = styled.div`
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
      <PagesContainer>
        <AuthContainer>
          <Logo dark={true} name={true} />
          <AuthForm />
        </AuthContainer>
      </PagesContainer>
    </Container>
  );
};

export default AuthPage;

export const loader = async () => {
  const isSignIn = store.getState().user.signIn;
  if (isSignIn) {
    const teamIds = store.getState().user.teamIds;
    if (teamIds.length > 0) {
      return redirect("/");
    } else {
      return redirect("/team/new");
    }
  } else {
    const { status, userData } = await getJwtInfo();

    if (status === 200) {
      console.log("jwtLoader succeed", userData);
      store.dispatch({ type: "user/loadUser", payload: userData });
      if (userData.teamIds.length > 0) {
        return redirect("/");
      } else {
        return redirect("/team/new");
      }
    } else {
      return null;
    }
  }
};

export const action = async ({ request }) => {
  console.log("auth action started");
  const formData = await request.formData();
  const reqData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/.netlify/functions/fetch-user-by-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(reqData),
    });
    const { status, userData } = await response.json();
    console.log("auth action finished", userData);

    if (status === 200) {
      store.dispatch({ type: "user/loadUser", payload: userData });
      return redirect("/");
    } else if (status === 201) {
      store.dispatch({ type: "user/loadUser", payload: userData });
      return redirect("/team/new");
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
