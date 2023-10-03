import { Outlet, redirect } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store";
import { getJwtInfo } from "../utils/auth";
import { RootContainer } from "./Root";

export const AuthContainer = styled.div`
  flex: 1 1;
  background-image: url("../court-background.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const AuthPage = () => {
  return (
    <RootContainer>
      <AuthContainer>
        <Outlet />
      </AuthContainer>
    </RootContainer>
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
