import { Suspense } from "react";
import { Await, Outlet, redirect } from "react-router-dom";
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
  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <Await>
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
  
  const { status, userData } = await getJwtInfo();

  if (status === 200) {
    console.log("jwtLoader succeed", userData);
    store.dispatch({ type: "user/loadUser", payload: userData });
    if (userData.teamIds.length > 0) {
      return null;
    } else {
      return redirect("/team/new");
    }
  } else {
    return redirect("/auth");
  }
};
