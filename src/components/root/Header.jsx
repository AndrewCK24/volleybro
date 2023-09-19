import styled from "@emotion/styled";

import { IoNotificationsSharp } from "react-icons/io5";

const Container = styled.header`
  flex: 0 0 4rem;
  width: 100%;
  padding: 2.5% 5% 0.5rem;
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

const BtnContainer = styled.div`
  flex: 1 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Header = () => {
  return (
    <Container>
      <BtnContainer>
      </BtnContainer>
      <IoNotificationsSharp />
    </Container>
  );
};

export default Header;
