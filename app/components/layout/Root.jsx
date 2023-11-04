"use client";
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
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  overscroll-behavior-y: contain;

  &.full-height {
    padding: 0;
  }

  &.fixed {
    padding-bottom: 4.5rem;
    overflow: hidden;
    overscroll-behavior-y: none;
  }

  @media screen and (min-width: 768px) {
    padding: 4rem 5%;
  }
`;

const Root = ({ data, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  if (data && !useSelector((state) => state.user.signIn)) {
    const { userData, teamData, membersData } = data;
    console.log("userData", userData);
    const dispatch = useDispatch();
    dispatch(userActions.setUser(userData));
    dispatch(teamActions.setTeam({ teamData, membersData }));
  }

  return (
    <>
      {isAuthPage || <Header title="V-Stats" isIndex={isIndex} />}
      <Main className={pathname === "/team/lineup" ? "fixed" : ""}>
        {children}
      </Main>
      {isAuthPage || (isIndex && <StartRecordBtn />)}
      {isAuthPage || <BottomNav pathname={pathname} />}
    </>
  );
};

export default Root;
