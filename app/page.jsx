"use client";

import styled from "styled-components";

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


export default function Home() {
  return (
    <Main>
    </Main>
  )
}
