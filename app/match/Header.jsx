"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import styled from "styled-components";
import { FiArrowLeft, FiMoreHorizontal } from "react-icons/fi";
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const Title = styled.div`
  flex: 1;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-900);
  font-size: 2rem;
  font-weight: 600;
`;

const Header = () => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const isNew = segments[0] === "new";
  const isConfig = segments[1] === "config";

  const handleBack = () => {
    if (isNew) {
      return router.push("/history");
    }
    if (isConfig) {
      return router.push(`/match/${segments[0]}`);
    }
    return router.push("/history");
  };

  const handleMore = () => {
    if (!isConfig) return router.push(`/match/${segments[0]}/config`);
  };

  return (
    <Container>
      <BtnContainer onClick={() => handleBack()}>
        <FiArrowLeft />
      </BtnContainer>
      <MainPart>{isConfig ? <Title>賽事資訊</Title> : <Scores />}</MainPart>
      <BtnContainer onClick={() => handleMore()}>
        <FiMoreHorizontal />
      </BtnContainer>
    </Container>
  );
};

export default Header;
