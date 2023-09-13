import { Suspense } from "react";
import { Await, Outlet, redirect, useRouteLoaderData } from "react-router-dom";
import styled from "@emotion/styled";

import Loading from "../components/root/Loading";
import store from "../store/store";
import { getJwtInfo } from "../utils/auth";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

export const PagesContainer = styled.main`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  overflow: hidden;
  height: 100%;
  padding: 1rem 5%;
`;

const RootLayout = () => {
  const userData = useRouteLoaderData("root");
  // FIXME: Loading component is not working

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <Await resolve={userData}>
          <Outlet />
        </Await>
      </Suspense>
    </Container>
  );
};

export default RootLayout;

export const loader = async () => {
  const isSignIn = store.getState().user.signIn;
  if (isSignIn) return null;
  
  const { status, userData, teamData } = await getJwtInfo();

  if (status === 200) {
    // console.log("jwtLoader succeed", userData);
    store.dispatch({ type: "user/loadUserData", payload: userData });
    if (teamData) {
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
      return null;
    } else {
      return redirect("/team/new");
    }
  } else {
    return redirect("/auth");
  }
};
