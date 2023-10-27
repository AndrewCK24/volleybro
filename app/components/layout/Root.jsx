"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";

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

const Root = ({ children }) => {
  const pathname = usePathname();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;

  return (
    <>
      {pathname === "/sign-in" || pathname === "/sign-up" ? (
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
      )}
    </>
  );
};

export default Root;
