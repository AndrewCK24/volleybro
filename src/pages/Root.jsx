import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, redirect, useLocation } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store";
import { getJwtInfo } from "../utils/auth";
import Header from "../components/root/Header";
import BottomNav from "../components/root/BottomNav";
import StartRecordBtn from "../components/root/StartRecordBtn";

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
  padding: 1rem 5% 0;
`;

const RootLayout = () => {
  const { pathname } = useLocation();
  const pathArr = pathname.split("/").filter(Boolean);
  const index = pathArr.length > 1 ? `/${pathArr[0]}` : "";
  const teamId = useSelector((state) => state.team._id);
  const { title } = useSelector((state) => state.root);

  useEffect(() => {
    document.title = title ? `${title} | V-Stats` : "V-Stats";
  }, [title]);

  // FIXME: Loading component is not working
  // (with React.suspense and Await component)
  return pathArr[0] === "record" ? (
    <Container>
      <Header title={title} index="/" />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
    </Container>
  ) : (
    <Container>
      <Header title={title} index={index} />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
      {teamId && <StartRecordBtn />}
      <BottomNav />
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
    // if (userData.name) {
    if (teamData) {
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
      return null;
    } else {
      return redirect("/team/new");
    }
    // } else {
    //   return redirect("/auth/signUp");
    // }
  } else {
    return redirect("/auth");
  }
};
