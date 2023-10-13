import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, redirect, useLocation } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store";
import { getJwtInfo } from "../utils/auth";
import Header from "../components/root/Header";
import BottomNav from "../components/root/BottomNav";
import StartRecordBtn from "../components/root/StartRecordBtn";

export const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const MainContainer = styled.main`
  flex: 1 1;
  padding: 0.5rem 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  /* overscroll-behavior-x: none; */
  overscroll-behavior-y: contain;

  &.fixed {
    padding-bottom: 0.5rem;
    overflow: hidden;
    overscroll-behavior-y: none;
  }

  @media screen and (min-width: 768px) {
    padding: 1rem 5% 0;
  }
`;

const Footer = styled.footer`
  // TODO: put ads here
  flex: 0 0 4rem;
  width: 100%;
`;

const RootLayout = () => {
  const { members } = useSelector((state) => state.team);
  const hasSixPlayers =
    members.filter((member) => member.number && member.role !== "M").length >=
    6;

  const { pathname } = useLocation();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;
  const returnPath = isIndex ? "" : `/${pathArr[0]}`;
  const teamId = useSelector((state) => state.team._id);
  const { title } = useSelector((state) => state.root);

  useEffect(() => {
    document.title = title ? `${title} | V-Stats` : "V-Stats";
  }, [title]);

  // FIXME: Loading component is not working
  // (with React.suspense and Await component)
  return pathArr[0] === "record" ? (
    <RootContainer>
      <Header title={title} index="/" />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </RootContainer>
  ) : (
    <RootContainer>
      <Header title={title} index={returnPath} />
      <MainContainer className={pathArr[1] === "lineup" ? "fixed" : ""}>
        <Outlet />
        {isIndex && <Footer />}
      </MainContainer>
      {isIndex && teamId && hasSixPlayers && <StartRecordBtn />}
      <BottomNav />
    </RootContainer>
  );
};

export default RootLayout;

export const loader = async () => {
  const isSignIn = store.getState().user.signIn;
  if (isSignIn) return null;

  const { status, userData, teamData } = await getJwtInfo();

  if (status === 200) {
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
