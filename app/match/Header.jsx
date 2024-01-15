"use client";
import styled from "styled-components";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { useDispatch } from "react-redux";
import { matchActions } from "@/app/match/match-slice";
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
  const dispatch = useDispatch();
  const segments = useSelectedLayoutSegments();
  const matchId = segments[0];
  const isRecording = segments.length === 1;

  const handleBack = () => {
    if (segments[0] === "new") {
      if (segments[1] === "config") return router.push("/history");
      if (segments[1] === "lineup") return router.push("/match/new/config");
      if (segments[1] === "overview")
        return router.replace("/match/new/lineup");
      return router.back();
    }
    if (!isRecording) return router.push(`/match/${matchId}`);

    dispatch(matchActions.resetMatch());
    return router.push("/history");
  };

  return (
    <Container>
      <BtnContainer onClick={() => handleBack()}>
        <FiArrowLeft />
      </BtnContainer>
      <MainPart>
        {segments[0] === "new" ? (
          "新增比賽紀錄"
        ) : isRecording ? (
          <Scores />
        ) : segments[1] === "config" ? (
          "比賽資訊"
        ) : segments[1] === "records" ? (
          "逐球紀錄"
        ) : (
          ""
        )}
      </MainPart>
      {segments[0] === "new" || segments[1] === "config" ? (
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
