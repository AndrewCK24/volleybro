import styled from "@emotion/styled";

import { LinkButton } from "../common/List";
import { FiArrowLeft } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";

const Container = styled.header`
  flex: 0 0 4rem;
  width: 100%;
  padding: 0 5%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
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
`;

const CenteredTitle = styled(Title)`
  justify-content: center;
`;

const Header = ({ title, index }) => {
  return (
    <Container>
      {index ? (
        <>
          <LinkButton to={index}>
            <FiArrowLeft />
          </LinkButton>
          <CenteredTitle>{title}</CenteredTitle>
        </>
      ) : (
        <Title>{title}</Title>
      )}
      <IoNotificationsSharp />
    </Container>
  );
};

export default Header;
