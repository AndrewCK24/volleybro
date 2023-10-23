"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";

import Header from "./Header";
import StartRecordBtn from "./StartRecordBtn";
import BottomNav from "./BottomNav";

const Main = styled.main`
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

const Root = ({ children }) => {
  const pathname = usePathname();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;

  return (
    <>
      <Header title="V-Stats" />
      <Main className={pathname === "/team/lineup" ? "fixed" : ""}>
        {children}
      </Main>
      <StartRecordBtn />
      <BottomNav pathname={pathname} />
    </>
  );
};

export default Root;
