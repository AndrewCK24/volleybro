import React from "react";
import styled from "@emotion/styled";

import ScoreBar from "../components/recordPage/ScoreBar";
import PreviewBar from "../components/recordPage/PreviewBar";
import { ReactComponent as Logo } from "../images/logo-black.svg";
import { ReactComponent as StatsIcon } from "../images/file-text.svg";

const Container = styled.div`
  width: 100%;
  height: 100%;
  /* TODO: 檢查 padding */
  padding-top: 2rem;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1rem;
  padding: 0 1rem;
`;

const MainPart = styled.div`
  height: 100%;
  grid-column: 4 / span 8;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  column-gap: 1.5rem;
  row-gap: 1.5rem;
  /* TODO: 建立直屬子div的共用屬性 */
  /* div {
  }; */
`;

const CourtLeft = styled.div`
  grid-column: 1;
  grid-row: 1;
  background-color: var(--yellow-primary);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1rem;
`;

const CourtRight = styled.div`
  grid-column: 2;
  grid-row: 1;
  background-color: var(--yellow-primary);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(6, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1rem;
`;

const InfoLeft = styled.div`
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-rows: repeat(5, minmax(0, 1fr));
  row-gap: 1rem;
`;

const Scores = styled.div`
  grid-row: 2 / -1;
  border: 1px solid var(--black-primary);
  border-radius: 1rem;
`;

const InfoRight = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  row-gap: 1rem;
`;

const ConfirmBtn = styled.button`
  grid-row: 1;
  border: 1px solid var(--yellow-primary);
  border-radius: 1rem;
  background-color: var(--yellow-primary);
  font-size: 2rem;
  font-weight: 700;
`;

const TeamStats = styled.div`
  grid-row: 2 / -1;
  border-radius: 1rem;
  background-color: var(--black-primary);
  color: var(--white-primary);
  svg {
    stroke: var(--white-primary);
  };
`;

const RecordPage = () => {
  return (
    <Container>
      <ScoreBar />
      <MainPart>
        <CourtLeft>
          CourtLeft
        </CourtLeft>
        <CourtRight>
          CourtRight
        </CourtRight>
        <InfoLeft>
          <PreviewBar />
          <Scores></Scores>
        </InfoLeft>
        <InfoRight>
          <ConfirmBtn>確認</ConfirmBtn>
          <TeamStats>
            <StatsIcon />
          </TeamStats>
        </InfoRight>
      </MainPart>
    </Container>
  );
}

export default RecordPage;