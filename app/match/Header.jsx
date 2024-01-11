"use client";
import styled from "styled-components";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import Scores from "./Scores";

const Container = styled.section`
  flex: 0 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 1.5rem 1.5rem;
  padding: 0 0.5rem 0.5rem;
  background-color: var(--primary-100);
  box-shadow: 0 0 1rem var(--primary-300);
  gap: 0.5rem;
`;

const BtnContainer = styled.button`
  flex: 0 0;
  height: 100%;
  min-width: 4rem;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: var(--primary-900);
  background-color: transparent;
  svg {
    flex: 1;
    width: 2rem;
    height: 2rem;
  }
`;

const MainPart = styled.div`
  flex: 3 1;
  min-height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-900);
  font-size: 2rem;
  font-weight: 600;
`;

const Header = () => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const matchId = segments[0];
  const isNew = segments[0] === "new";
  const isConfig = segments[1] === "config";
  const isRecords = segments[1] === "records";

  const isMatchDataLoaded = useSelector((state) => state.match._id) === matchId;
  const isRecording = segments.length === 1;

  const handleBack = () => {
    if (isNew) return router.push("/history");
    if (!isRecording) return router.push(`/match/${matchId}`);

    return router.push("/history");
  };

  return (
    <Container>
      <BtnContainer onClick={() => handleBack()}>
        <FiArrowLeft />
      </BtnContainer>
      <MainPart>
        {isMatchDataLoaded &&
          (isRecording ? (
            <Scores />
          ) : isConfig ? (
            "比賽資訊"
          ) : isRecords ? (
            "逐球紀錄"
          ) : (
            ""
          ))}
      </MainPart>
      {isConfig ? (
        <BtnContainer />
      ) : (
        <BtnContainer onClick={() => router.push(`/match/${matchId}/config`)}>
          <FiSettings />
        </BtnContainer>
      )}
    </Container>
  );
};

export default Header;
