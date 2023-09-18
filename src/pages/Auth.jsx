import { redirect } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store/store";
import { getJwtInfo } from "../utils/auth";
import { Container, PagesContainer } from "./Root";
import Logo from "../components/general/Logo";
import AuthForm from "../components/auth/AuthForm";

export const AuthContainer = styled.div`
  flex: 1 1;
  background-image: url("../court-background.jpg");
  background-size: cover;
  /* border-radius: 1rem; */
  box-shadow: 0 0 0.25rem var(--color-primary-400);
  height: 100%;
  /* padding: 4rem 2rem; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const AuthPage = () => {
  return (
    <Container>
      {/* <PagesContainer> */}
      <AuthContainer>
        <Logo />
        <AuthForm />
      </AuthContainer>
      {/* </PagesContainer> */}
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
    const { status, userData, teamData } = await getJwtInfo();

    if (status === 200) {
      // console.log("jwtLoader succeed", userData);
      store.dispatch({ type: "user/loadUserData", payload: userData });
      if (teamData) {
        store.dispatch({ type: "team/loadTeamData", payload: teamData });
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

    // FIXME: userData 載入可能重工
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
