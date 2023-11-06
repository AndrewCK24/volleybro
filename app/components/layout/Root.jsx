"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { userActions } from "../../user/user-slice";
import { teamActions } from "../../team/team-slice";
import Header from "./Header";
import StartRecordBtn from "./StartRecordBtn";
import BottomNav from "./BottomNav";

const Main = styled.main`
  flex: 1 1;
  margin: 3.5rem 0;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  overscroll-behavior-y: contain;
  background-color: var(--primary-200);
  z-index: 0;

  &.full-height {
    margin: 0;
    padding: 0%;
  }

  &.fixed {
    margin-bottom: 4.5rem;
    overflow: hidden;
    overscroll-behavior-y: none;
  }

  @media screen and (min-width: 768px) {
    padding: 4rem 5%;
  }
`;

const Root = ({ data, children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isSignIn = useSelector((state) => state.user.signIn);

  useEffect(() => {
    if (!data) {
      if (pathname !== "/sign-in") router.push("/sign-in");
    } else if (!isSignIn) {
      const { userData, teamData, membersData } = data;
      console.log("userData", userData);
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ teamData, membersData }));
      router.push("/");
    }
  }, []);

  return isAuthPage ? (
    <Main className="full-height">{children}</Main>
  ) : (
    <>
      <Header title="V-Stats" isIndex={isIndex} />
      <Main className={pathname === "/team/lineup" ? "fixed" : ""}>
        {children}
      </Main>
      {isIndex && <StartRecordBtn />}
      <BottomNav pathname={pathname} />
    </>
  );
};

export default Root;
