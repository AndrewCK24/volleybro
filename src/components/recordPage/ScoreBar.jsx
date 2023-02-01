import React from "react";
import styled from "@emotion/styled";

const ScoreDiv = styled.div`
  height: 100%;
  grid-column-start: 1;
  grid-column-end: 3;
  background-color: var(--yellow-primary);
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  overflow: auto;
  touch-action: pan-y;
  overscroll-behavior-y: none;
  /* TODO: 增加可滑動時上下方內陰影 https://ithelp.ithome.com.tw/articles/10188293 */
  /* TODO: add className .scrollbar-hidden from index.css */
  -ms-overflow-style: none;   /* Hide scrollbar for Edge */
  scrollbar-width: none;      /* FireFox */
  ::-webkit-scrollbar {       /* Chrome, Safari and Opera */
    display: none;
  };
`;

const Content = styled.div`
  width: 50%;
  height: 100vh;
  background: linear-gradient(to bottom, var(--white-primary), var(--black-primary));
`;

const ScoreBar = () => {
  return (
    <ScoreDiv>
      <Content />
    </ScoreDiv>
  );
};

export default ScoreBar;