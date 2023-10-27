"use client";

import styled from "styled-components";

import { IconButton } from "../common/Button";
import { FiArrowLeft } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";

const Container = styled.header`
  position: fixed;
  height: 3.5rem;
  width: 100%;
  padding: 0 5%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  overscroll-behavior: none;
  background-color: var(--color-primary-100);
  svg {
    color: var(--color-primary-500);
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const Title = styled.h1`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  font-size: 2rem;
  font-weight: 500;
  line-height: 3rem;

  &.center {
    justify-content: center;
  }
`;

const CenteredTitle = styled(Title)`
  justify-content: center;
`;

const Header = ({ title, isIndex }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Container>
      {isIndex && (
        <IconButton onClick={handleBack}>
          <FiArrowLeft />
        </IconButton>
      )}
      <Title className={isIndex ? "center" : ""}>{title}</Title>
      <IoNotificationsSharp />
    </Container>
  );
};

export default Header;
