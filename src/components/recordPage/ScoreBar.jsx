import React from "react";
import styled from "@emotion/styled";

const ScoreDiv = styled.div`
  height: 100%;
  grid-column-start: 1;
  grid-column-end: 3;
  background-color: #FFDE59;
  border-radius: 0.5rem;
`;

const ScoreBar = () => {
  return (
    <ScoreDiv></ScoreDiv>
  );
};

export default ScoreBar;