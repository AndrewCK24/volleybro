import React from "react";
import styled from "@emotion/styled";

import ScoreBar from "../components/recordPage/ScoreBar";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 2rem;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1rem;
  padding: 0 1rem;
  background-color: #FFEEAA;
`;

const RightPart = styled.div`
  height: 100%;
  grid-column-start: 4;
  grid-column-end: 12;
  background-color: #FFDE59;
  display: grid;
  grid-template-rows: 2fr 1fr;
  row-gap: 1.5rem;
  div {
    width: 100%;
    background-color: #D9D9D9;
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    grid-template-rows: repeat(6, minmax(0, 1fr));
    column-gap: 1rem;
    row-gap: 1rem;
  };
`;

const Court = styled.div`
  button {
    
  };
`;

const InfoZone = styled.div`
`;

const RecordPage = () => {
  return (
    <Container>
      <ScoreBar></ScoreBar>
      <RightPart>
        <Court>Court</Court>
        <InfoZone>InfoZone</InfoZone>
      </RightPart>
    </Container>
  );
}

export default RecordPage;